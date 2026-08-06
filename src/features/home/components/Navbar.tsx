import { Link } from 'react-router'

export function Navbar() {
    return (
        <header className="border-b border-slate-800/80 bg-[#07090e]/80 backdrop-blur-xl sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                <div className="flex items-center gap-8">
                    <Link to="/" className="text-lg font-bold tracking-tight text-white flex items-center gap-2.5">
                        <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                        </span>
                        Kairos
                        <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded border border-slate-700 bg-slate-800/50 text-slate-400">v1.0</span>
                    </Link>
                    <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        <a href="#overview" className="hover:text-white transition-colors">Overview</a>
                        <a href="#pipeline" className="hover:text-white transition-colors">Risk Pipeline</a>
                        <a href="#architecture" className="hover:text-white transition-colors">Architecture</a>
                        <a href="#pricing" className="hover:text-white transition-colors">Plans</a>
                    </nav>
                </div>

                <div className="flex items-center gap-3">
                    <Link
                        to="/login"
                        className="text-xs font-medium px-4 py-2 text-slate-300 hover:text-white border border-slate-800 rounded-lg bg-slate-900/60 hover:bg-slate-800/80 transition-all"
                    >
                        Sign In
                    </Link>
                    <Link
                        to="/register"
                        className="text-xs font-semibold px-4 py-2 bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-400 hover:to-sky-500 text-white rounded-lg transition-all shadow-md shadow-sky-500/20"
                    >
                        Get Started
                    </Link>
                </div>
            </div>
        </header>
    )
}