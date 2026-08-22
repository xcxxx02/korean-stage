type ProgressSummaryProps = {
  completedUnitIds: string[]
  totalUnits: number
}

export function ProgressSummary({ completedUnitIds, totalUnits }: ProgressSummaryProps) {
  const completedCount = new Set(completedUnitIds).size
  return <p className="inline-flex rounded-full border border-stage-cobalt bg-stage-cobalt-soft px-4 py-2 text-sm font-black text-stage-cobalt">{completedCount} of {totalUnits} units complete</p>
}
