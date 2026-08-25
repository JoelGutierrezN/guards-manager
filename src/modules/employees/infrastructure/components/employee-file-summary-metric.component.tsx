import { type JSX, useMemo } from 'react'
import { cn } from '../../../shared/infraestructure/utils/cn'
import { EmployeeFilePresenter } from '../../application/employee-file-presenter.helper'
import {
  EMPLOYEE_FILE_METRIC_TONES,
  type EmployeeFileMetricTone,
} from './employee-file-metric-tone.model'

interface Props {
  label: string
  value: number | null
  tone?: EmployeeFileMetricTone
  hint?: string
}

export function EmployeeFileSummaryMetric({
  label,
  value,
  tone = 'default',
  hint,
}: Props): JSX.Element {
  const valueClassName = useMemo(
    () => cn('text-[22px] font-medium tracking-[-0.02em]', EMPLOYEE_FILE_METRIC_TONES[tone]),
    [tone],
  )

  return (
    <div>
      <div className="text-[11px] text-muted">{label}</div>
      <div className={valueClassName} title={hint}>
        {EmployeeFilePresenter.metricValue(value)}
      </div>
    </div>
  )
}
