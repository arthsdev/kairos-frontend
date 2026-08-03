import { useState } from 'react'
import { OccurrenceCard } from '../features/occurrences/components/OccurrenceCard'
import { EditOccurrenceModal } from '../features/occurrences/components/EditOccurrenceModal'
import { CreateOccurrenceModal } from '../features/occurrences/components/CreateOccurrenceModal'
import { useModerationMutations } from '../features/occurrences/hooks/useModerationMutations'
import { useMyOccurrences } from '../features/occurrences/hooks/useMyOccurrences'
import type { Occurrence, UpdateOccurrenceInput } from '../features/occurrences/types'

export function DashboardPage() {
  const { occurrences, isPending, isError } = useMyOccurrences()
  const { updateOccAsync, deleteOcc, isDeleting, isUpdating } = useModerationMutations()

  const [editingOccurrence, setEditingOccurrence] = useState<Occurrence | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

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