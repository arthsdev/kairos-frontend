import { useState, useEffect, useMemo, type SubmitEventHandler } from 'react'
import { isAxiosError } from 'axios'
import { MapPin, Compass } from 'lucide-react'
import type { Occurrence, UpdateOccurrenceInput } from '../types'
import { parseBackendValidationError } from '../../../shared/lib/parseBackendError'
import { LocationPickerMap } from './LocationPickerMap'

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
    const [latitude, setLatitude] = useState<number | ''>('')
    const [longitude, setLongitude] = useState<number | ''>('')
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (occurrence) {
            setTitle(occurrence.title)
            setDescription(occurrence.description)
            setLatitude(occurrence.latitude)
            setLongitude(occurrence.longitude)
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

    // Memoiza o centro inicial do mapa com base nas coordenadas originais da ocorrência
    const initialCenter = useMemo<[number, number] | undefined>(() => {
        if (!occurrence) return undefined
        return [Number(occurrence.latitude), Number(occurrence.longitude)]
    }, [occurrence?.id, occurrence?.latitude, occurrence?.longitude])

    const currentLatitude = latitude !== '' ? Number(latitude) : undefined
    const currentLongitude = longitude !== '' ? Number(longitude) : undefined

    if (!isOpen || !occurrence) return null

    const isTitleTooShort = title.length > 0 && title.length < MIN_TITLE_LENGTH

    const handleLocationChange = (lat: number, lng: number) => {
        setLatitude(lat)
        setLongitude(lng)
    }

    const handleSubmit: SubmitEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault()
        setError(null)

        if (currentLatitude === undefined || currentLongitude === undefined) {
            setError('Please set a valid location on the map.')
            return
        }

        try {
            await onSubmit(occurrence.id, {
                title,
                description,
                latitude: currentLatitude,
                longitude: currentLongitude,
            })
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
                        className="text-slate-400 hover:text-white transition-colors disabled:opacity-50 p-1 rounded-lg hover:bg-slate-800"
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

                        <fieldset disabled={isSubmitting} className="space-y-4 disabled:opacity-80">
                            {/* Title */}
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

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">Description</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={3}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-sky-500 text-sm resize-none"
                                    required
                                />
                            </div>

                            {/* Location Picker Section */}
                            <div className="space-y-2 p-3 bg-slate-950/50 border border-slate-800/80 rounded-xl">
                                <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
                                    <Compass className="w-3.5 h-3.5 text-slate-400" />
                                    <span>Location Pinpoint</span>
                                </span>

                                {initialCenter && currentLatitude !== undefined && currentLongitude !== undefined ? (
                                    <div className="rounded-xl overflow-hidden border border-slate-800 h-48 sm:h-56">
                                        <LocationPickerMap
                                            initialCenter={initialCenter}
                                            latitude={currentLatitude}
                                            longitude={currentLongitude}
                                            onChange={handleLocationChange}
                                        />
                                    </div>
                                ) : (
                                    <div className="p-4 bg-slate-900/50 border border-dashed border-slate-800 rounded-xl text-center text-slate-500 text-xs flex flex-col items-center justify-center gap-2 h-36">
                                        <MapPin className="w-5 h-5 text-slate-600" />
                                        <span>Location coordinates unavailable.</span>
                                    </div>
                                )}

                                {/* Read-only Coordinates Inputs */}
                                <div className="grid grid-cols-2 gap-4 pt-1">
                                    <div>
                                        <label className="block text-xs font-medium text-slate-400 mb-1">Latitude</label>
                                        <input
                                            type="number"
                                            value={latitude}
                                            readOnly
                                            className="w-full bg-slate-800/50 border border-slate-800 rounded-lg px-3 py-1.5 text-slate-300 text-sm focus:outline-none cursor-not-allowed"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-slate-400 mb-1">Longitude</label>
                                        <input
                                            type="number"
                                            value={longitude}
                                            readOnly
                                            className="w-full bg-slate-800/50 border border-slate-800 rounded-lg px-3 py-1.5 text-slate-300 text-sm focus:outline-none cursor-not-allowed"
                                        />
                                    </div>
                                </div>
                            </div>
                        </fieldset>
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