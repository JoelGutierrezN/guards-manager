export interface DashboardChartPoint {
  key: string
  label: string
  longLabel: string
  assignments: number
  returns: number
  x: number
  assignmentsY: number
  returnsY: number
}

export interface DashboardChartGridLine {
  key: string
  value: number
  y: number
}

export interface DashboardChartView {
  width: number
  height: number
  topY: number
  baselineY: number
  labelY: number
  points: DashboardChartPoint[]
  gridLines: DashboardChartGridLine[]
  assignmentsPath: string
  assignmentsAreaPath: string
  returnsPath: string
  totalAssignments: number
  totalReturns: number
  weeksCount: number
}
