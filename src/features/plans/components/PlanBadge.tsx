import { usePlanStatus } from '../hooks/usePlanStatus'
import { calculateDaysRemaining } from '../utils/planUtils'

export function PlanBadge() {
    const { data: planStatus, isLoading } = usePlanStatus()

    if (isLoading) {
        return (
            <div className="h-6 w-20 bg-slate-800 animate-pulse rounded-full" />
        )
    }

    const planType = planStatus?.planType ?? 'FREE'
    const daysRemaining = calculateDaysRemaining(planStatus?.expiresAt ?? null)

    if (planType === 'PREMIUM') {
        return (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Premium
            </span>
        )
    }

    if (planType === 'TRIAL') {
        const trialText =
            daysRemaining === 0
                ? 'Last day'
                : daysRemaining !== null
                    ? `${daysRemaining}d left`
                    : ''

        return (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                Trial {trialText && `(${trialText})`}
            </span>
        )
    }

    return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-800 text-slate-400 border border-slate-700">
            Free
        </span>
    )
}