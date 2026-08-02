import { useState, useEffect, type SubmitEventHandler } from 'react'
import { AxiosError } from 'axios'
import { FormField } from '../../../shared/components/FormField'
import { parseBackendValidationError } from '../../../shared/lib/parseBackendError'
import { useAddCityMutation } from '../hooks/useAddCityMutation'
import { useSearchCities } from '../hooks/useSearchCities'
import type { CitySearchResult } from '../types'

interface AddCityModalProps {
    isOpen: boolean
    onClose: () => void
}

export function AddCityModal({ isOpen, onClose }: AddCityModalProps) {
    const [inputValue, setInputValue] = useState('')
    const [addError, setAddError] = useState<string | null>(null)

    const { results, isSearching, isError: isSearchError, handleSearch } = useSearchCities()
    const { mutate: addCity, isPending: isAdding } = useAddCityMutation()

    // Reset local state and search results on modal close
    const handleClose = () => {
        setInputValue('')
        setAddError(null)
        handleSearch('')
        onClose()
    }

    // Handle ESC key press to close modal
    useEffect(() => {
        if (!isOpen) return

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                handleClose()
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [isOpen])

    if (!isOpen) return null

    const onSubmit: SubmitEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault()
        setAddError(null)
        handleSearch(inputValue)
    }

    const handleSelectCity = (city: CitySearchResult) => {
        setAddError(null)

        addCity(city, {
            onSuccess: () => {
                handleClose()
            },
            onError: (error: unknown) => {
                if (error instanceof AxiosError) {
                    const parsedMessage = parseBackendValidationError(error.response?.data)
                    const fallbackMessage = error.response?.data?.message || error.message

                    setAddError(parsedMessage || fallbackMessage)
                } else {
                    setAddError('An unexpected error occurred.')
                }
            },
        })
    }

    return (
        <div
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
            onClick={handleClose}
        >
            {/* Prevent clicks inside the modal from triggering backdrop close */}
            <div
                className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl p-6 space-y-6 relative shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={handleClose}
                    type="button"
                    className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
                >
                    ✕
                </button>

                <header>
                    <h2 className="text-xl font-bold text-white">Add City</h2>
                    <p className="text-sm text-slate-400">
                        Search for the city you want to monitor and select it from the list.
                    </p>
                </header>

                {/* Mutation Error Banner */}
                {addError && (
                    <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm flex justify-between items-center">
                        <span>{addError}</span>
                        <button
                            onClick={() => setAddError(null)}
                            type="button"
                            className="text-amber-400 hover:text-amber-200 text-xs font-bold"
                        >
                            ✕
                        </button>
                    </div>
                )}

                <form onSubmit={onSubmit} className="space-y-4">
                    <div className="flex items-end gap-2">
                        <div className="flex-1">
                            <FormField
                                id="search-city-input"
                                label="City Name"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder="Enter a city name (e.g. São Paulo, London)..."
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isSearching || !inputValue.trim()}
                            className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-medium px-5 py-2 rounded-lg text-sm transition-colors h-[38px]"
                        >
                            {isSearching ? 'Searching...' : 'Search'}
                        </button>
                    </div>
                </form>

                {/* Search Error Banner */}
                {isSearchError && (
                    <div className="p-4 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
                        Failed to search cities. Please try again later.
                    </div>
                )}

                {/* Search Results List */}
                <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                    {results.length > 0 && (
                        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                            Results found ({results.length})
                        </h3>
                    )}
                    {results.map((city) => (
                        <div
                            key={`${city.latitude}-${city.longitude}`}
                            className="flex items-center justify-between p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-colors"
                        >
                            <div>
                                <h4 className="font-medium text-white text-base">{city.name}</h4>
                                <p className="text-sm text-slate-400">
                                    {city.admin1 ? `${city.admin1}, ` : ''}{city.country}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => handleSelectCity(city)}
                                disabled={isAdding}
                                className="bg-slate-800 hover:bg-indigo-600 border border-slate-700 hover:border-indigo-500 text-slate-200 hover:text-white text-xs font-medium px-4 py-2 rounded-lg transition-all disabled:opacity-50"
                            >
                                {isAdding ? 'Adding...' : 'Add'}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}