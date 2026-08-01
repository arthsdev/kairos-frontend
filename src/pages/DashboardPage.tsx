import { useState } from 'react'
import { OccurrenceCard } from '../features/occurrences/components/OccurrenceCard'
import { EditOccurrenceModal } from '../features/occurrences/components/EditOccurrenceModal'
import { useModerationMutations } from '../features/occurrences/hooks/useModerationMutations'
import { useMyOccurrences } from '../features/occurrences/hooks/useMyOccurrences'
import type { Occurrence, UpdateOccurrenceInput } from '../features/occurrences/types'

export function DashboardPage() {
  const { occurrences, isPending, isError } = useMyOccurrences()
  const { updateOccAsync, deleteOcc, isDeleting, isUpdating } = useModerationMutations()
  const [editingOccurrence, setEditingOccurrence] = useState<Occurrence | null>(null)

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
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-6">My Occurrences</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {occurrences?.map((occ) => (
          <OccurrenceCard
            key={occ.id}
            occurrence={occ}
            onEdit={setEditingOccurrence}
            onDelete={handleDelete}
            isDeleting={isDeleting}
          />
        ))}
      </div>

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