import { useState } from 'react'
import { useSearchParams } from 'react-router'
import { OccurrenceCard } from '../features/occurrences/components/OccurrenceCard'
import { EditOccurrenceModal } from '../features/occurrences/components/EditOccurrenceModal'
import { CreateOccurrenceModal } from '../features/occurrences/components/CreateOccurrenceModal'
import { useModerationMutations } from '../features/occurrences/hooks/useModerationMutations'
import { useMyOccurrences } from '../features/occurrences/hooks/useMyOccurrences'
import { usePlanStatus } from '../features/plans/hooks/usePlanStatus'
import type { Occurrence, UpdateOccurrenceInput } from '../features/occurrences/types'

export function DashboardPage() {
  const { occurrences, isPending, isError } = useMyOccurrences()
  const { updateOccAsync, deleteOcc, isDeleting, isUpdating } = useModerationMutations()

  const [editingOccurrence, setEditingOccurrence] = useState<Occurrence | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  // Stripe Upgrade Search Params & Polling Logic
  const [searchParams, setSearchParams] = useSearchParams()
  const upgradeStatus = searchParams.get('upgrade') // 'success' | 'cancelled' | null

  const isUpgrading = upgradeStatus === 'success'
  const { data: planStatus, isTimedOut, isFetching } = usePlanStatus({ shouldPoll: isUpgrading })

  const isConfirmedPremium = planStatus?.planType === 'PREMIUM'
  const showTimeout = isUpgrading && !isConfirmedPremium && isTimedOut && !isFetching

  const clearUpgradeParam = () => {
    searchParams.delete('upgrade')
    setSearchParams(searchParams)
  }

  const handleUpdate = async (id: string, data: UpdateOccurrenceInput) => {
    await updateOccAsync({ id, payload: data })
  }

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      deleteOcc(id)
    }
  }

  if (isPending) {
    return <div className="p-8 text-slate-400">Loading your occurrences...</div>
  }

  if (isError) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
          Failed to load your occurrences. Please try again later.
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Cancellation Banner */}
      {upgradeStatus === 'cancelled' && (
        <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-amber-300 text-sm flex items-center justify-between">
          <span>Checkout process was cancelled. No charges were made.</span>
          <button
            type="button"
            onClick={clearUpgradeParam}
            className="text-slate-400 hover:text-white transition-colors"
            aria-label="Close notification"
          >
            ✕
          </button>
        </div>
      )}

      {/* Upgrade Status Banners */}
      {isUpgrading && (
        <div className="transition-all">
          {/* Confirmed Success */}
          {isConfirmedPremium && (
            <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl text-emerald-400">
              <span className="text-sm font-medium">
                Premium subscription activated successfully.
              </span>
              <button
                type="button"
                onClick={clearUpgradeParam}
                className="text-slate-400 hover:text-white transition-colors"
                aria-label="Close notification"
              >
                ✕
              </button>
            </div>
          )}

          {/* Waiting for Webhook (Processing) */}
          {!isConfirmedPremium && !showTimeout && (
            <div className="flex items-center justify-between bg-blue-500/10 border border-blue-500/20 p-4 rounded-2xl text-blue-400">
              <div className="flex items-center gap-3">
                <span className="h-4 w-4 rounded-full border-2 border-blue-400 border-t-transparent animate-spin" />
                <span className="text-sm">
                  Confirming your payment status. Please wait a moment...
                </span>
              </div>
            </div>
          )}

          {/* Timeout Banner */}
          {showTimeout && (
            <div className="flex items-center justify-between bg-amber-500/10 border border-amber-500/20 p-4 rounded-2xl text-amber-300">
              <span className="text-sm">
                Payment confirmation is taking longer than expected. Your Premium access will be updated automatically once processed.
              </span>
              <button
                type="button"
                onClick={clearUpgradeParam}
                className="text-slate-400 hover:text-white transition-colors"
                aria-label="Close notification"
              >
                ✕
              </button>
            </div>
          )}
        </div>
      )}

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">My Occurrences</h1>
          <p className="text-sm text-slate-400">
            Manage and monitor all occurrences reported by you.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-medium transition-colors shadow-lg shadow-blue-500/20 flex items-center gap-2"
        >
          <span>+ New Occurrence</span>
        </button>
      </div>

      {/* Occurrences List */}
      {occurrences && occurrences.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {occurrences.map((occ: Occurrence) => (
            <OccurrenceCard
              key={occ.id}
              occurrence={occ}
              onEdit={setEditingOccurrence}
              onDelete={handleDelete}
              isDeleting={isDeleting}
            />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center border border-slate-800 rounded-2xl bg-slate-900/50 space-y-3">
          <p className="text-slate-400 text-sm">You haven't reported any occurrences yet.</p>
          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="text-sm text-blue-400 hover:text-blue-300 font-medium underline underline-offset-4"
          >
            Create your first occurrence
          </button>
        </div>
      )}

      {/* Modals */}
      <CreateOccurrenceModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      <EditOccurrenceModal
        isOpen={Boolean(editingOccurrence)}
        occurrence={editingOccurrence}
        onClose={() => setEditingOccurrence(null)}
        onSubmit={handleUpdate}
        isSubmitting={isUpdating}
      />
    </div>
  )
}