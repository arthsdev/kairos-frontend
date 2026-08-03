import { useState, useEffect, useCallback, type SubmitEventHandler, type ChangeEvent } from 'react'
import { AxiosError } from 'axios'
import { FormField } from '../../../shared/components/FormField'
import { parseBackendValidationError } from '../../../shared/lib/parseBackendError'
import { useMonitoredCities } from '../../cities/hooks/useMonitoredCities'
import { useCreateOccurrenceMutation } from '../hooks/useCreateOccurrenceMutation'
import type { CreateOccurrenceForm, OccurrenceCategory, SeverityLevel } from '../types'

interface CreateOccurrenceModalProps {
    isOpen: boolean
    onClose: () => void
}

const CATEGORIES: OccurrenceCategory[] = [
    'FLOOD',
    'LANDSLIDE',
    'SEWAGE',
    'ILLEGAL_DUMPING',
    'MUDDY_WATER',
    'WILDFIRE',
]
const SEVERITIES: SeverityLevel[] = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']

const EMPTY_FORM: CreateOccurrenceForm = {
    title: '',
    description: '',
    category: '',
    severity: '',
    cityId: '',
    latitude: '',
    longitude: '',
    imageUrl: '',
}

export function CreateOccurrenceModal({ isOpen, onClose }: CreateOccurrenceModalProps) {
    const [form, setForm] = useState<CreateOccurrenceForm>(EMPTY_FORM)
    const [error, setError] = useState<string | null>(null)

    const { cities, isPending: isLoadingCities } = useMonitoredCities()
    const { mutate: createOccurrence, isPending } = useCreateOccurrenceMutation()

    const handleClose = useCallback(() => {
        if (isPending) return

        setForm(EMPTY_FORM)
        setError(null)
        onClose()
    }, [isPending, onClose])

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                handleClose()
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [isOpen, handleClose])

    if (!isOpen) return null

    const handleCityChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const cityId = e.target.value
        const selectedCity = cities?.find((c) => c.id === cityId)

        setForm((prev) => ({
            ...prev,
            cityId,
            latitude: selectedCity?.latitude ?? '',
            longitude: selectedCity?.longitude ?? '',
        }))
    }

    const onSubmit: SubmitEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault()
        setError(null)

        createOccurrence(
            {
                ...form,
                category: form.category as OccurrenceCategory,
                severity: form.severity as SeverityLevel,
                latitude: Number(form.latitude),
                longitude: Number(form.longitude),
                imageUrl: form.imageUrl || undefined,
            },
            {
                onSuccess: () => handleClose(),
                onError: (err: unknown) => {
                    if (err instanceof AxiosError) {
                        const parsed = parseBackendValidationError(err.response?.data)
                        setError(parsed || err.response?.data?.message || 'Failed to create occurrence.')
                    } else {
                        setError('An unexpected error occurred.')
                    }
                },
            }
        )
    }

    const hasNoCities = !isLoadingCities && (!cities || cities.length === 0)

    return (
        <div
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
            onClick={handleClose}
        >
            <div
                className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl p-6 space-y-6 shadow-2xl my-8"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <h2 className="text-xl font-semibold text-white">New Occurrence</h2>
                    <button
                        type="button"
                        onClick={handleClose}
                        disabled={isPending}
                        className="text-slate-400 hover:text-white transition-colors disabled:opacity-50"
                    >
                        ✕
                    </button>
                </div>

                {/* Error Banner */}
                {error && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                        {error}
                    </div>
                )}

                {/* Form Body */}
                <form onSubmit={onSubmit} className="space-y-4">
                    <fieldset disabled={isPending} className="space-y-4 disabled:opacity-80">
                        {/* Title */}
                        <FormField
                            id="title"
                            name="title"
                            label="Title"
                            value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                            placeholder="e.g. River overflow near main road"
                            required
                        />

                        {/* City Selection */}
                        <div className="space-y-1.5">
                            <label htmlFor="cityId" className="block text-xs font-medium text-slate-300">
                                Monitored City <span className="text-red-400">*</span>
                            </label>
                            <select
                                id="cityId"
                                required
                                disabled={isLoadingCities || hasNoCities || isPending}
                                value={form.cityId}
                                onChange={handleCityChange}
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <option value="" disabled>
                                    {isLoadingCities
                                        ? 'Loading cities...'
                                        : hasNoCities
                                            ? 'No cities available'
                                            : 'Select a city...'}
                                </option>
                                {cities?.map((city) => (
                                    <option key={city.id} value={city.id}>
                                        {city.name} - {city.state}
                                    </option>
                                ))}
                            </select>
                            {hasNoCities && (
                                <p className="text-xs text-amber-400 mt-1">
                                    No monitored cities found. Please add a city first before creating an occurrence.
                                </p>
                            )}
                        </div>

                        {/* Category & Severity */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label htmlFor="category" className="block text-xs font-medium text-slate-300">
                                    Category <span className="text-red-400">*</span>
                                </label>
                                <select
                                    id="category"
                                    required
                                    value={form.category}
                                    onChange={(e) =>
                                        setForm({ ...form, category: e.target.value as OccurrenceCategory })
                                    }
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                >
                                    <option value="" disabled>
                                        Select category...
                                    </option>
                                    {CATEGORIES.map((cat) => (
                                        <option key={cat} value={cat}>
                                            {cat}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-1.5">
                                <label htmlFor="severity" className="block text-xs font-medium text-slate-300">
                                    Severity <span className="text-red-400">*</span>
                                </label>
                                <select
                                    id="severity"
                                    required
                                    value={form.severity}
                                    onChange={(e) =>
                                        setForm({ ...form, severity: e.target.value as SeverityLevel })
                                    }
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                >
                                    <option value="" disabled>
                                        Select severity...
                                    </option>
                                    {SEVERITIES.map((sev) => (
                                        <option key={sev} value={sev}>
                                            {sev}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Coordinates */}
                        <div className="p-3 bg-slate-950/50 border border-slate-800/80 rounded-xl space-y-2">
                            <span className="block text-xs font-semibold text-slate-400">
                                Coordinates (Auto-filled from selected city, editable)
                            </span>
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    id="latitude"
                                    name="latitude"
                                    label="Latitude"
                                    type="number"
                                    value={String(form.latitude)}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            latitude: e.target.value === '' ? '' : Number(e.target.value),
                                        })
                                    }
                                    placeholder="-23.5505"
                                    required
                                />
                                <FormField
                                    id="longitude"
                                    name="longitude"
                                    label="Longitude"
                                    type="number"
                                    value={String(form.longitude)}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            longitude: e.target.value === '' ? '' : Number(e.target.value),
                                        })
                                    }
                                    placeholder="-46.6333"
                                    required
                                />
                            </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-1.5">
                            <label htmlFor="description" className="block text-xs font-medium text-slate-300">
                                Description <span className="text-red-400">*</span>
                            </label>
                            <textarea
                                id="description"
                                required
                                rows={3}
                                placeholder="Provide details about the occurrence..."
                                value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
                            />
                        </div>

                        {/* Image URL */}
                        <FormField
                            id="imageUrl"
                            name="imageUrl"
                            label="Image URL (Optional)"
                            type="url"
                            value={form.imageUrl}
                            onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                            placeholder="https://..."
                        />
                    </fieldset>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={isPending}
                            className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white transition-colors disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isPending || hasNoCities}
                            className="px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {isPending ? 'Submitting...' : 'Create Occurrence'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}