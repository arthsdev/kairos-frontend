import { useMutation } from '@tanstack/react-query'
import { api } from '../../../shared/lib/axios'

export interface CheckoutResponse {
    checkoutUrl: string
}

async function createCheckoutSession(): Promise<CheckoutResponse> {
    const response = await api.post<CheckoutResponse>('/plans/upgrade')
    return response.data
}

export function useCheckout() {
    return useMutation({
        mutationFn: createCheckoutSession,
        onSuccess: (data) => {
            if (data.checkoutUrl) {
                window.location.href = data.checkoutUrl
            }
        },
    })
}