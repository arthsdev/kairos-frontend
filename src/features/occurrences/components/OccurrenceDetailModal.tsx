import { X, Calendar, MapPin, User, ImageOff, Pencil } from 'lucide-react'
import type { Occurrence } from '../types'

interface OccurrenceDetailModalProps {
    occurrence: Occurrence | null
    isOpen: boolean
    onClose: () => void
    onEdit: (occurrence: Occurrence) => void
}

export function OccurrenceDetailModal({
    occurrence,
    isOpen,
    onClose,
    onEdit,
}: OccurrenceDetailModalProps) {
    if (!isOpen || !occurrence) return null

    const canEdit = occurrence.actions?.canEdit ?? false

    const handleEditClick = () => {
        onClose()
        onEdit(occurrence)
    }

    const formatDate = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                month: 'short',
                day: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            })
        } catch {
            return dateString
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
            <div className="relative w-full max-w-lg max-h-[90vh] flex flex-col rounded-xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="flex items-start justify-between border-b border-slate-800 p-5 pb-4">
                    <div className="space-y-2 pr-6">
                        <h3 className="text-xl font-bold text-slate-100">
                            {occurrence.title}
                        </h3>
                        <div className="flex flex-wrap gap-2 items-center">
                            <span className="inline-flex items-center rounded-md bg-slate-800 px-2.5 py-0.5 text-xs font-medium text-slate-300 capitalize">
                                {occurrence.category.toLowerCase()}
                            </span>
                            <span className="inline-flex items-center rounded-md bg-slate-800 px-2.5 py-0.5 text-xs font-medium text-slate-300 capitalize">
                                {occurrence.severity.toLowerCase()}
                            </span>
                            <span
                                className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold ${occurrence.status === 'VERIFIED'
                                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                                    : occurrence.status === 'RESOLVED'
                                        ? 'bg-slate-700/50 text-slate-400 border border-slate-600/30'
                                        : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                                    }`}
                            >
                                {occurrence.status}
                            </span>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content (scrollable) */}
                <div className="flex-1 overflow-y-auto p-5 space-y-4">
                    {/* Occurrence image or placeholder */}
                    {occurrence.imageUrl ? (
                        <div className="relative w-full h-56 rounded-lg overflow-hidden bg-slate-950 border border-slate-800">
                            <img
                                src={occurrence.imageUrl}
                                alt={occurrence.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.currentTarget.style.display = 'none'
                                }}
                            />
                        </div>
                    ) : (
                        <div className="flex items-center justify-center gap-2 h-24 rounded-lg border border-dashed border-slate-800 bg-slate-950/50 text-slate-500">
                            <ImageOff className="w-5 h-5 shrink-0" />
                            <span className="text-xs font-medium">No image provided</span>
                        </div>
                    )}

                    {/* Description */}
                    <div className="space-y-1">
                        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                            Description
                        </span>
                        <p className="text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">
                            {occurrence.description || 'No description provided.'}
                        </p>
                    </div>

                    {/* Location, Date & Reporter details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-3 border-t border-slate-800 text-xs text-slate-400">
                        <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-slate-500 shrink-0" />
                            <span>
                                Lat: {occurrence.latitude.toFixed(4)}, Lng: {occurrence.longitude.toFixed(4)}
                            </span>
                        </div>

                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-slate-500 shrink-0" />
                            <span>{formatDate(occurrence.createdAt)}</span>
                        </div>

                        {(occurrence.reporterDisplayId || occurrence.userId) && (
                            <div className="flex items-center gap-2 sm:col-span-2">
                                <User className="w-4 h-4 text-slate-500 shrink-0" />
                                <span>
                                    Reported by:{' '}
                                    <code className="bg-slate-800 px-1.5 py-0.5 rounded text-xs font-mono text-slate-300">
                                        {occurrence.reporterDisplayId ?? occurrence.userId}
                                    </code>
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-2 border-t border-slate-800 p-4 bg-slate-950/50">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-slate-300 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 hover:text-white transition-colors"
                    >
                        Close
                    </button>
                    {canEdit && (
                        <button
                            type="button"
                            onClick={handleEditClick}
                            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-950 bg-slate-100 rounded-lg hover:bg-white transition-colors"
                        >
                            <Pencil className="w-4 h-4" />
                            Edit
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}