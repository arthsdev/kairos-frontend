import { useQuery } from '@tanstack/react-query'
import { occurrencesApi } from '../features/occurrences/api/occurrencesApi'
import { useAuth } from '../features/auth/hooks/useAuth'

export default function AdminPage() {
  const { userName, logout } = useAuth()

  const {
    data: occurrences,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ['all-occurrences'],
    queryFn: occurrencesApi.getAllOccurrences,
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'RESOLVED':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
      case 'VERIFIED':
        return 'bg-sky-500/10 text-sky-400 border-sky-500/20'
      default:
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20'
    }
  }

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20'
      case 'HIGH':
        return 'bg-orange-500/10 text-orange-400 border-orange-500/20'
      case 'MEDIUM':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20'
      default:
        return 'bg-slate-500/10 text-slate-300 border-slate-500/20'
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Top Bar */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">Admin Panel</h1>
              <p className="text-sm text-slate-400">
                Operator: <span className="text-sky-400 font-medium">{userName ?? 'Administrator'}</span>
              </p>
            </div>
            <span className="text-xs font-semibold uppercase px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
              Admin Mode
            </span>
          </div>
          <button
            onClick={logout}
            className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-slate-200">All System Occurrences</h2>
        </div>

        {/* 1. Loading State */}
        {isPending && (
          <div className="flex justify-center items-center py-12">
            <p className="text-slate-400 animate-pulse">Loading all occurrences...</p>
          </div>
        )}

        {/* 2. Error State */}
        {isError && (
          <div className="p-4 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
            <p className="font-semibold">Failed to load admin panel</p>
            <p className="text-xs text-rose-300/80 mt-1">
              {error instanceof Error ? error.message : 'Ensure you have the ADMIN role'}
            </p>
          </div>
        )}

        {/* 3. Empty State */}
        {occurrences && occurrences.length === 0 && (
          <div className="text-center py-12 bg-slate-900/30 border border-slate-800/80 rounded-xl">
            <p className="text-slate-400">No occurrences registered in the system.</p>
          </div>
        )}

        {/* 4. Data State */}
        {occurrences && occurrences.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2">
            {occurrences.map((occ) => (
              <div
                key={occ.id}
                className="p-5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="font-semibold text-white text-base leading-snug">{occ.title}</h3>
                    <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${getStatusBadge(occ.status)}`}>
                      {occ.status}
                    </span>
                  </div>

                  <p className="text-sm text-slate-400 mb-3 line-clamp-2">{occ.description}</p>

                  <p className="text-xs text-slate-500 mb-4">
                    Reported by: <span className="text-slate-300">{occ.userName || occ.userId}</span>
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded border font-medium ${getSeverityBadge(occ.severity)}`}>
                      {occ.severity}
                    </span>
                    <span className="text-slate-500">•</span>
                    <span className="text-slate-400">{occ.category}</span>
                  </div>

                  {/* Moderator / Admin Action Controls */}
                  {occ.actions && (
                    <div className="flex gap-3">
                      {occ.actions.canVerify && (
                        <button className="text-sky-400 hover:underline font-medium">Verify</button>
                      )}
                      {occ.actions.canResolve && (
                        <button className="text-emerald-400 hover:underline font-medium">Resolve</button>
                      )}
                      {occ.actions.canDelete && (
                        <button className="text-rose-400 hover:underline font-medium">Delete</button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}