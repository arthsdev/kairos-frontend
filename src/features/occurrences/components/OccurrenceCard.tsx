import type { Occurrence } from '../types'

interface OccurrenceCardProps {
    occurrence: Occurrence
    onEdit?: (occurrence: Occurrence) => void
    onDelete?: (id: string, title: string) => void
    onVerify?: (id: string) => void
    onResolve?: (id: string) => void
    isDeleting?: boolean
    isVerifying?: boolean
    isResolving?: boolean
}

function getStatusBadge(status: string) {
    switch (status) {
        case 'RESOLVED':
            return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
        case 'VERIFIED':
            return 'bg-sky-500/10 text-sky-400 border-sky-500/20'
        default:
            return 'bg-amber-500/10 text-amber-400 border-amber-500/20'
    }
}

function getSeverityBadge(severity: string) {
    switch (severity) {
        case 'CRITICAL':
            return 'bg-rose-500/10 text-rose-400 border-rose-500/20'
        case 'HIGH':
            return 'bg-orange-500/10 text-orange-400 border-orange-500/20'
        case 'MEDIUM':
            return 'bg-amber-500/10 text-amber-400 border-amber-500/20'
        default:
            return 'bg-slate-500/10 text-slate-300 border-slate-500/20'
    }
}

export function OccurrenceCard({
    occurrence: occ,
    onEdit,
    onDelete,
    onVerify,
    onResolve,
    isDeleting,
    isVerifying,
    isResolving,
}: OccurrenceCardProps) {
    const canShowVerify = Boolean(occ.actions?.canVerify && onVerify)
    const canShowResolve = Boolean(occ.actions?.canResolve && onResolve)
    const hasModerationActions = canShowVerify || canShowResolve

    const canShowEdit = Boolean(occ.actions?.canEdit && onEdit)
    const canShowDelete = Boolean(occ.actions?.canDelete && onDelete)
    const hasUserActions = canShowEdit || canShowDelete

    return (
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between">
            <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="font-semibold text-white text-base leading-snug flex-1 min-w-0 break-words">{occ.title}</h3>
                    <span className={`shrink-0 text-xs px-2.5 py-1 rounded-full border font-medium ${getStatusBadge(occ.status)}`}>
                        {occ.status}
                    </span>
                </div>
                <p className="text-sm text-slate-400 mb-4 line-clamp-2">{occ.description}</p>
                {occ.reporterDisplayId && (
                    <p className="text-xs text-slate-500 mb-2">
                        Reported by: <span className="text-slate-300">{occ.reporterDisplayId}</span>
                    </p>
                )}
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex flex-col gap-3">
                <div className="flex items-center justify-between text-xs text-slate-400">
                    <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded border font-medium ${getSeverityBadge(occ.severity)}`}>
                            {occ.severity}
                        </span>
                        <span className="text-slate-500">•</span>
                        <span>{occ.category}</span>
                    </div>

                    {hasUserActions && (
                        <div className="flex gap-3">
                            {canShowEdit && (
                                <button
                                    onClick={() => onEdit?.(occ)}
                                    className="text-sky-400 hover:underline font-medium"
                                >
                                    Edit
                                </button>
                            )}
                            {canShowDelete && (
                                <button
                                    onClick={() => onDelete?.(occ.id, occ.title)}
                                    disabled={isDeleting}
                                    className="text-rose-400 hover:underline font-medium disabled:opacity-50"
                                >
                                    {isDeleting ? 'Deleting...' : 'Delete'}
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {hasModerationActions && (
                    <div className="flex gap-2 pt-2 border-t border-slate-800/50">
                        {canShowVerify && (
                            <button
                                onClick={() => onVerify?.(occ.id)}
                                disabled={isVerifying}
                                className="flex-1 py-1.5 bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/20 rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
                            >
                                {isVerifying ? 'Verifying...' : 'Verify'}
                            </button>
                        )}
                        {canShowResolve && (
                            <button
                                onClick={() => onResolve?.(occ.id)}
                                disabled={isResolving}
                                className="flex-1 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
                            >
                                {isResolving ? 'Resolving...' : 'Resolve'}
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}