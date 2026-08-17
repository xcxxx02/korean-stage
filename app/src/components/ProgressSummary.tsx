type ProgressSummaryProps = {
  completedUnitIds: string[]
  totalUnits: number
}

export function ProgressSummary({ completedUnitIds, totalUnits }: ProgressSummaryProps) {
  const completedCount = new Set(completedUnitIds).size
  return <p>{completedCount} of {totalUnits} units complete</p>
}
