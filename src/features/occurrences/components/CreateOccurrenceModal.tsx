import { useState, useEffect, useCallback, type SubmitEventHandler, type ChangeEvent } from 'react'
import { AxiosError } from 'axios'
import {
    X,
    MapPin,
    Tag,
    AlertTriangle,
    Compass,
    FileText,
    Image as ImageIcon,
    AlertCircle,
    Loader2
} from 'lucide-react'
import { FormField } from '../../../shared/components/FormField'
import { parseBackendValidationError } from '../../../shared/lib/parseBackendError'
import { useMonitoredCities } from '../../cities/hooks/useMonitoredCities'
import { useCreateOccurrenceMutation } from '../hooks/useCreateOccurrenceMutation'
import { LocationPickerMap } from '../../occurrences/components/LocationPickerMap'
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

    const selectedCity = cities?.find((c) => c.id === form.cityId)

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
        const city = cities?.find((c) => c.id === cityId)

        setForm((prev) => ({
            ...prev,
            cityId,
            latitude: city?.latitude ?? '',
            longitude: city?.longitude ?? '',
        }))
    }

    const handleLocationChange = (lat: number, lng: number) => {
        setForm((prev) => ({
            ...prev,
            latitude: lat,
            longitude: lng,
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
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-hidden"
            onClick={handleClose}
        >
            <div
                className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl flex flex-col max-h-[85dvh] shadow-2xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Fixed Header */}
                <div className="flex items-center justify-between border-b border-slate-800 p-4 sm:p-6 shrink-0">
                    <h2 className="text-xl font-semibold text-white">New Occurrence</h2>
                    <button
                        type="button"
                        onClick={handleClose}
                        disabled={isPending}
                        className="text-slate-400 hover:text-white transition-colors disabled:opacity-50 p-1 rounded-lg hover:bg-slate-800"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form Layout */}
                <form onSubmit={onSubmit} className="flex flex-col min-h-0 flex-1">
                    {/* Scrollable Content Body */}
                    <div className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
                        {/* Error Banner */}
                        {error && (
                            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

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
                                <label htmlFor="cityId" className="flex items-center gap-1.5 text-xs font-medium text-slate-300">
                                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                                    <span>Monitored City</span>
                                    <span className="text-red-400">*</span>
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
                                    <p className="text-xs text-amber-400 mt-1 flex items-center gap-1">
                                        <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                                        <span>No monitored cities found. Please add a city first before creating an occurrence.</span>
                                    </p>
                                )}
                            </div>

                            {/* Location Picker Section */}
                            <div className="space-y-2 p-3 bg-slate-950/50 border border-slate-800/80 rounded-xl">
                                <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
                                    <Compass className="w-3.5 h-3.5 text-slate-400" />
                                    <span>Location Pinpoint</span>
                                </span>

                                {selectedCity ? (
                                    <div className="rounded-xl overflow-hidden border border-slate-800 h-48 sm:h-56">
                                        <LocationPickerMap
                                            initialCenter={[
                                                Number(selectedCity.latitude),
                                                Number(selectedCity.longitude),
                                            ]}
                                            latitude={Number(form.latitude)}
                                            longitude={Number(form.longitude)}
                                            onChange={handleLocationChange}
                                        />
                                    </div>
                                ) : (
                                    <div className="p-4 bg-slate-900/50 border border-dashed border-slate-800 rounded-xl text-center text-slate-500 text-xs flex flex-col items-center justify-center gap-2 h-36">
                                        <MapPin className="w-5 h-5 text-slate-600" />
                                        <span>Select a city above to interact with the location map.</span>
                                    </div>
                                )}

                                {/* Read-only Coordinates Inputs */}
                                <div className="grid grid-cols-2 gap-4 pt-1">
                                    <FormField
                                        id="latitude"
                                        name="latitude"
                                        label="Latitude"
                                        type="number"
                                        value={String(form.latitude)}
                                        placeholder="-23.5505"
                                        required
                                        readOnly
                                    />
                                    <FormField
                                        id="longitude"
                                        name="longitude"
                                        label="Longitude"
                                        type="number"
                                        value={String(form.longitude)}
                                        placeholder="-46.6333"
                                        required
                                        readOnly
                                    />
                                </div>
                            </div>

                            {/* Category & Severity */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label htmlFor="category" className="flex items-center gap-1.5 text-xs font-medium text-slate-300">
                                        <Tag className="w-3.5 h-3.5 text-slate-400" />
                                        <span>Category</span>
                                        <span className="text-red-400">*</span>
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
                                    <label htmlFor="severity" className="flex items-center gap-1.5 text-xs font-medium text-slate-300">
                                        <AlertTriangle className="w-3.5 h-3.5 text-slate-400" />
                                        <span>Severity</span>
                                        <span className="text-red-400">*</span>
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

                            {/* Description */}
                            <div className="space-y-1.5">
                                <label htmlFor="description" className="flex items-center gap-1.5 text-xs font-medium text-slate-300">
                                    <FileText className="w-3.5 h-3.5 text-slate-400" />
                                    <span>Description</span>
                                    <span className="text-red-400">*</span>
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
                            <div className="space-y-1.5">
                                <label htmlFor="imageUrl" className="flex items-center gap-1.5 text-xs font-medium text-slate-300">
                                    <ImageIcon className="w-3.5 h-3.5 text-slate-400" />
                                    <span>Image URL (Optional)</span>
                                </label>
                                <FormField
                                    id="imageUrl"
                                    name="imageUrl"
                                    label=""
                                    type="url"
                                    value={form.imageUrl}
                                    onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                                    placeholder="https://..."
                                />
                            </div>
                        </fieldset>
                    </div>

                    {/* Fixed Actions Footer */}
                    <div className="flex items-center justify-end gap-3 p-4 sm:p-6 border-t border-slate-800 bg-slate-900 shrink-0">
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
                            {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                            <span>{isPending ? 'Submitting...' : 'Create Occurrence'}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}