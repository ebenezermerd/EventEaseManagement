export interface AnalyticsMetric {
  label: string
  value: number
  change: number
  changeType: 'increase' | 'decrease'
  period: string
}

export interface ChartDataPoint {
  name: string
  value?: number
  [key: string]: string | number | undefined
}

export const mockPlatformMetrics: AnalyticsMetric[] = [
  {
    label: 'Total Users',
    value: 5234,
    change: 8,
    changeType: 'increase',
    period: 'from last month',
  },
  {
    label: 'Active Events',
    value: 78,
    change: 5,
    changeType: 'increase',
    period: 'from last week',
  },
  {
    label: 'Platform Revenue',
    value: 2450000,
    change: 12,
    changeType: 'increase',
    period: 'from last month',
  },
  {
    label: 'Tickets Sold',
    value: 8956,
    change: 18,
    changeType: 'increase',
    period: 'from last month',
  },
]

export const mockOrganizerMetrics: AnalyticsMetric[] = [
  {
    label: 'Total Attendees',
    value: 1234,
    change: 18,
    changeType: 'increase',
    period: 'from last month',
  },
  {
    label: 'Ticket Sales',
    value: 1543,
    change: 12,
    changeType: 'increase',
    period: 'from last month',
  },
  {
    label: 'Total Revenue',
    value: 384000,
    change: 15,
    changeType: 'increase',
    period: 'from last month',
  },
  {
    label: 'Active Events',
    value: 8,
    change: 2,
    changeType: 'increase',
    period: 'from last month',
  },
]

export const mockRevenueChartData: ChartDataPoint[] = [
  { name: 'Jan', revenue: 45000, tickets: 320 },
  { name: 'Feb', revenue: 52000, tickets: 380 },
  { name: 'Mar', revenue: 48000, tickets: 350 },
  { name: 'Apr', revenue: 61000, tickets: 420 },
  { name: 'May', revenue: 78000, tickets: 540 },
  { name: 'Jun', revenue: 85000, tickets: 620 },
]

export const mockCategoryDistribution: ChartDataPoint[] = [
  { name: 'Conference', value: 35 },
  { name: 'Music', value: 25 },
  { name: 'Festival', value: 20 },
  { name: 'Workshop', value: 12 },
  { name: 'Exhibition', value: 8 },
]

export const mockUserGrowthData: ChartDataPoint[] = [
  { name: 'Week 1', users: 420 },
  { name: 'Week 2', users: 580 },
  { name: 'Week 3', users: 720 },
  { name: 'Week 4', users: 890 },
]

export const mockTicketSalesData: ChartDataPoint[] = [
  { name: 'Mon', sales: 45 },
  { name: 'Tue', sales: 52 },
  { name: 'Wed', sales: 38 },
  { name: 'Thu', sales: 65 },
  { name: 'Fri', sales: 78 },
  { name: 'Sat', sales: 95 },
  { name: 'Sun', sales: 72 },
]
