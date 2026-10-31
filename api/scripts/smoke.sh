#!/usr/bin/env bash
# Smoke test a running API: register, login, list events, book a free ticket.
#   scripts/smoke.sh https://eventease-api.vercel.app
set -euo pipefail
BASE="${1:-http://localhost:4000}"
EMAIL="smoke$(date +%s)@example.com"
PASS="SmokeTest2026"
json() { node -e "let s='';process.stdin.on('data',d=>s+=d).on('end',()=>{const o=JSON.parse(s);console.log($1)})"; }

echo "1. health";   curl -fsS "$BASE/health"; echo
echo "2. register"; curl -fsS -X POST "$BASE/api/auth/register" -H 'Content-Type: application/json' \
  -d "{\"name\":\"Smoke Tester\",\"email\":\"$EMAIL\",\"password\":\"$PASS\"}" | json 'o.success+" "+o.user.role'
echo "3. login"
TOKEN=$(curl -fsS -X POST "$BASE/api/auth/login" -H 'Content-Type: application/json' \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASS\"}" | json 'o.token')
echo "token received (${#TOKEN} chars)"
echo "4. events"
EVENTS=$(curl -fsS "$BASE/api/events?limit=50")
echo "$EVENTS" | json 'o.events.length+" upcoming events, first: "+o.events[0].title'
read -r EVENT_ID TICKET_ID < <(echo "$EVENTS" | json '(()=>{const e=o.events.find(e=>e.ticketTypes.some(t=>t.price===0&&t.remaining>0));const t=e.ticketTypes.find(t=>t.price===0);return e.id+" "+t.id})()')
echo "5. book free ticket for event $EVENT_ID"
curl -fsS -X POST "$BASE/api/user/bookings" -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' \
  -d "{\"eventId\":\"$EVENT_ID\",\"ticketTypeId\":\"$TICKET_ID\",\"quantity\":1}" | json 'o.booking.status+" "+o.booking.bookingReference+" for "+o.booking.event.title'
echo "6. my bookings"
curl -fsS "$BASE/api/user/bookings" -H "Authorization: Bearer $TOKEN" | json 'o.bookings.length+" booking(s)"'
