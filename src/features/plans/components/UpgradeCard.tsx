import axios from 'axios'
import { usePlanStatus } from '../hooks/usePlanStatus'
import { useCheckout } from '../hooks/useCheckout'

export function UpgradeCard() {
    const { data: planStatus, isLoading } = usePlanStatus()
    const { mutate: handleUpgrade, isPending: isRedirecting, isError, error } = useCheckout()

    if (isLoading || planStatus?.planType === 'PREMIUM') {
        return null
    }

    const getErrorMessage = () => {
        if (axios.isAxiosError(error) && error.response?.data?.message) {
            return error.response.data.message
        }
        return 'Failed to start checkout process. Please try again.'
    }

    return (
        <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-600/15 to-indigo-600/10 border border-blue-500/20 space-y-3">
            <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">
                    Current: {planStatus?.planType ?? 'FREE'}
                </span>
                <h4 className="text-xs font-semibold text-white mt-2">Upgrade to Premium</h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Unlock unlimited monitoring and full system capabilities.
                </p>
            </div>

            <button
                type="button"
                onClick={() => handleUpgrade()}
                disabled={isRedirecting}
                className="w-full py-2 px-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-medium transition-colors shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
            >
                {isRedirecting ? (
                    <>
                        <span className="h-3 w-3 rounded-full border-2 border-white border-t-transparent animate-spin" />
                        <span>Redirecting...</span>
                    </>
                ) : (
                    <span>Upgrade Now</span>
                )}
            </button>

            {isError && (
                <p className="text-[11px] text-rose-400 font-medium">
                    {getErrorMessage()}
                </p>
            )}
        </div>
    )
}