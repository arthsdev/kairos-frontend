import { useState } from 'react'
import { LayoutList, Map as MapIcon } from 'lucide-react'
import { OccurrenceCard } from '../features/occurrences/components/OccurrenceCard'
import { EditOccurrenceModal } from '../features/occurrences/components/EditOccurrenceModal'
import { OccurrenceMap } from '../features/occurrences/components/OccurrenceMap'
import { useModerationMutations } from '../features/occurrences/hooks/useModerationMutations'
import { useAllOccurrences } from '../features/occurrences/hooks/useAllOccurrences'
import type { Occurrence, UpdateOccurrenceInput } from '../features/occurrences/types'

type ViewMode = 'list' | 'map'

export function AdminPage() {
  const { occurrences, isPending, isError } = useAllOccurrences()
  const {
    updateOccAsync,
    deleteOcc,
    verifyOcc,
    resolveOcc,
    isDeleting,
    isVerifying,
    isResolving,
    isUpdating,
  } = useModerationMutations()

  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [editingOccurrence, setEditingOccurrence] = useState<Occurrence | null>(null)

  const handleUpdate = async (id: string, data: UpdateOccurrenceInput) => {
    await updateOccAsync({ id, payload: data })
  }

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      deleteOcc(id)
    }
  }

  // Reuses the already-loaded list in memory — no extra API call needed
  const handleSelectOnMap = (id: string) => {
    const found = occurrences?.find((occ) => occ.id === id)
    if (found?.actions?.canEdit) {
      setEditingOccurrence(found)
    }
  }

  // Looks up canEdit from the already-loaded list, since MapOccurrenceDTO
  // doesn't carry OccurrenceActions (lightweight payload by design)
  const canEditLookup = (id: string) => {
    const found = occurrences?.find((occ) => occ.id === id)
    return found?.actions?.canEdit ?? false
  }

  if (isPending) {
    return <div className="p-8 text-slate-400">Loading all occurrences...</div>
  }

  if (isError) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
          Failed to load occurrences for moderation. Please try again later.
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Admin Moderation Dashboard</h1>

        <div className="flex items-center bg-slate-900 border border-slate-800 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${viewMode === 'list'
              ? 'bg-slate-800 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
              }`}
          >
            <LayoutList className="w-4 h-4" />
            List
          </button>
          <button
            type="button"
            onClick={() => setViewMode('map')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${viewMode === 'map'
              ? 'bg-slate-800 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
              }`}
          >
            <MapIcon className="w-4 h-4" />
            Map
          </button>
        </div>
      </div>

      {viewMode === 'map' ? (
        <div className="h-[calc(100vh-14rem)]">
          <OccurrenceMap onSelectOccurrence={handleSelectOnMap} canEditLookup={canEditLookup} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {occurrences?.map((occ) => (
            <OccurrenceCard
              key={occ.id}
              occurrence={occ}
              onEdit={setEditingOccurrence}
              onDelete={handleDelete}
              onVerify={verifyOcc}
              onResolve={resolveOcc}
              isDeleting={isDeleting}
              isVerifying={isVerifying}
              isResolving={isResolving}
            />
          ))}
        </div>
      )}

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