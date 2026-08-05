import { useState, useEffect, type SubmitEventHandler } from 'react'
import { isAxiosError } from 'axios'
import type { Occurrence, UpdateOccurrenceInput } from '../types'
import { parseBackendValidationError } from '../../../shared/lib/parseBackendError'

interface EditOccurrenceModalProps {
    occurrence: Occurrence | null
    isOpen: boolean
    isSubmitting?: boolean
    onClose: () => void
    onSubmit: (id: string, data: UpdateOccurrenceInput) => Promise<void>
}

const MIN_TITLE_LENGTH = 20

export function EditOccurrenceModal({
    occurrence,
    isOpen,
    isSubmitting = false,
    onClose,
    onSubmit,
}: EditOccurrenceModalProps) {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (occurrence) {
            setTitle(occurrence.title)
            setDescription(occurrence.description)
            setError(null)
        }
    }, [occurrence])

    useEffect(() => {
        if (!isOpen || isSubmitting) return

        function handleKeyDown(e: KeyboardEvent) {
            if (e.key === 'Escape') {
                onClose()
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [isOpen, isSubmitting, onClose])

    if (!isOpen || !occurrence) return null

    const isTitleTooShort = title.length > 0 && title.length < MIN_TITLE_LENGTH

    const handleSubmit: SubmitEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault()
        setError(null)

        try {
            await onSubmit(occurrence.id, { title, description })
            onClose()
        } catch (err) {
            if (isAxiosError(err) && err.response?.data?.message) {
                setError(parseBackendValidationError(err.response.data))
            } else {
                setError('Failed to save changes. Please try again.')
            }
        }
    }

    const handleBackdropClick = () => {
        if (!isSubmitting) {
            onClose()
        }
    }

    return (
        <div
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-hidden cursor-pointer"
            onClick={handleBackdropClick}
        >
            <div
                className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg flex flex-col max-h-[85dvh] shadow-2xl overflow-hidden cursor-default"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Fixed Header */}
                <div className="flex items-center justify-between border-b border-slate-800 p-4 sm:p-6 shrink-0">
                    <h2 className="text-xl font-bold text-white">Edit Occurrence</h2>
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="text-slate-400 hover:text-white transition-colors disabled:opacity-50 p-1"
                    >
                        ✕
                    </button>
                </div>

                {/* Form Layout */}
                <form onSubmit={handleSubmit} className="flex flex-col min-h-0 flex-1">
                    {/* Scrollable Content Body */}
                    <div className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
                        {/* Error Banner */}
                        {error && (
                            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">
                                Title <span className="text-slate-500">(min {MIN_TITLE_LENGTH} chars)</span>
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                minLength={MIN_TITLE_LENGTH}
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-sky-500 text-sm"
                                required
                            />
                            {isTitleTooShort && (
                                <p className="text-xs text-rose-400 mt-1">
                                    Title must be at least {MIN_TITLE_LENGTH} characters (current: {title.length}).
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Description</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={4}
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-sky-500 text-sm resize-none"
                                required
                            />
                        </div>
                    </div>

                    {/* Fixed Actions Footer */}
                    <div className="flex items-center justify-end gap-3 p-4 sm:p-6 border-t border-slate-800 bg-slate-900 shrink-0">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white transition-colors disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting || isTitleTooShort}
                            className="px-4 py-2 text-sm font-medium bg-sky-500 hover:bg-sky-400 text-white rounded-lg transition-colors disabled:opacity-50"
                        >
                            {isSubmitting ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}