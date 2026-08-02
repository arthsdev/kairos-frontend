import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { citiesApi } from '../api/citiesApi'

export function useSearchCities() {
    const [searchTerm, setSearchTerm] = useState('')

    const {
        data: results = [],
        isFetching,
        isError,
    } = useQuery({
        queryKey: ['search-cities', searchTerm],
        queryFn: () => citiesApi.searchCities(searchTerm),
        enabled: searchTerm.trim().length > 0,
    })

    const handleSearch = (term: string) => {
        if (!term.trim()) return
        setSearchTerm(term)
    }

    return {
        results,
        isSearching: isFetching,
        isError,
        handleSearch,
    }
}