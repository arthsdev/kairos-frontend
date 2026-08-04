import { useRef, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { api } from '../../../shared/lib/axios'

export interface PlanStatusResponse {
    planType: 'FREE' | 'TRIAL' | 'PREMIUM'
    expiresAt: string | null
}

async function getPlanStatus(): Promise<PlanStatusResponse> {
    const response = await api.get<PlanStatusResponse>('/plans')
    return response.data
}

interface UsePlanStatusOptions {
    enabled?: boolean
    shouldPoll?: boolean
}

export function usePlanStatus(options?: UsePlanStatusOptions) {
    const pollCountRef = useRef(0)

    useEffect(() => {
        if (!options?.shouldPoll) {
            pollCountRef.current = 0
        }
    }, [options?.shouldPoll])

    const query = useQuery({
        queryKey: ['plan-status'],
        queryFn: getPlanStatus,
        enabled: options?.enabled ?? true,
        refetchInterval: (q) => {
            if (!options?.shouldPoll) return false

            const data = q.state.data
            const attempts = q.state.dataUpdateCount

            pollCountRef.current = attempts

            if (data && data.planType === 'PREMIUM') {
                return false
            }

            if (attempts >= 15) {
                return false
            }

            return 2000
        },
    })

    const isTimedOut = Boolean(
        options?.shouldPoll &&
        query.data?.planType !== 'PREMIUM' &&
        pollCountRef.current >= 15
    )

    return {
        ...query,
        isTimedOut,
    }
}