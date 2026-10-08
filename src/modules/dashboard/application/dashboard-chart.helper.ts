import type { DashboardSeriesPoint } from '../domain/dashboard-series-point.model'
import { DashboardDateHelper } from '../infraestructure/helpers/dashboard-date.helper'
import type {
  DashboardChartGridLine,
  DashboardChartPoint,
  DashboardChartView,
} from './dashboard-chart.model'

const WIDTH = 760
const HEIGHT = 210
const PADDING_TOP = 12
const PADDING_RIGHT = 12
const PADDING_BOTTOM = 26
const PADDING_LEFT = 30
const LABEL_OFFSET = 8
const MIN_SCALE = 4

export class DashboardChartHelper {
  static build(series: DashboardSeriesPoint[]): DashboardChartView {
    const baselineY = HEIGHT - PADDING_BOTTOM
    const scaleMax = DashboardChartHelper.scaleMax(series)
    const points = series.map((point, index) =>
      DashboardChartHelper.toPoint(point, index, series.length, scaleMax, baselineY),
    )

    return {
      width: WIDTH,
      height: HEIGHT,
      topY: PADDING_TOP,
      baselineY,
      labelY: HEIGHT - LABEL_OFFSET,
      points,
      gridLines: DashboardChartHelper.gridLines(scaleMax, baselineY),
      assignmentsPath: DashboardChartHelper.linePath(points, 'assignmentsY'),
      assignmentsAreaPath: DashboardChartHelper.areaPath(points, baselineY),
      returnsPath: DashboardChartHelper.linePath(points, 'returnsY'),
      totalAssignments: DashboardChartHelper.sum(series, 'assignments'),
      totalReturns: DashboardChartHelper.sum(series, 'returns'),
      weeksCount: series.length,
    }
  }

  private static toPoint(
    point: DashboardSeriesPoint,
    index: number,
    total: number,
    scaleMax: number,
    baselineY: number,
  ): DashboardChartPoint {
    return {
      key: point.weekStart === '' ? `semana-${index}` : point.weekStart,
      label: DashboardDateHelper.weekLabel(point.weekStart),
      longLabel: DashboardDateHelper.weekLongLabel(point.weekStart),
      assignments: point.assignments,
      returns: point.returns,
      x: DashboardChartHelper.horizontalPosition(index, total),
      assignmentsY: DashboardChartHelper.verticalPosition(point.assignments, scaleMax, baselineY),
      returnsY: DashboardChartHelper.verticalPosition(point.returns, scaleMax, baselineY),
    }
  }

  private static horizontalPosition(index: number, total: number): number {
    const usableWidth = WIDTH - PADDING_LEFT - PADDING_RIGHT
    if (total <= 1) return PADDING_LEFT + usableWidth / 2
    return PADDING_LEFT + (index * usableWidth) / (total - 1)
  }

  private static verticalPosition(value: number, scaleMax: number, baselineY: number): number {
    const usableHeight = baselineY - PADDING_TOP
    return baselineY - (value * usableHeight) / scaleMax
  }

  private static scaleMax(series: DashboardSeriesPoint[]): number {
    const values = series.flatMap((point) => [point.assignments, point.returns])
    const highest = values.length === 0 ? 0 : Math.max(...values)
    return Math.max(MIN_SCALE, highest)
  }

  private static gridLines(scaleMax: number, baselineY: number): DashboardChartGridLine[] {
    const steps = [0, Math.round(scaleMax / 2), scaleMax]
    const uniqueSteps = [...new Set(steps)]
    return uniqueSteps.map((value) => ({
      key: `grid-${value}`,
      value,
      y: DashboardChartHelper.verticalPosition(value, scaleMax, baselineY),
    }))
  }

  private static linePath(
    points: DashboardChartPoint[],
    axis: 'assignmentsY' | 'returnsY',
  ): string {
    if (points.length === 0) return ''
    return points
      .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point[axis]}`)
      .join(' ')
  }

  private static areaPath(points: DashboardChartPoint[], baselineY: number): string {
    if (points.length === 0) return ''
    const [firstPoint] = points
    const lastPoint = points[points.length - 1]
    const line = DashboardChartHelper.linePath(points, 'assignmentsY')
    return `${line} L ${lastPoint.x} ${baselineY} L ${firstPoint.x} ${baselineY} Z`
  }

  private static sum(series: DashboardSeriesPoint[], axis: 'assignments' | 'returns'): number {
    return series.reduce((total, point) => total + point[axis], 0)
  }
}
