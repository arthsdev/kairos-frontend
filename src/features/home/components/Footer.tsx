export function Footer() {
    return (
        <footer className="relative z-10 border-t border-slate-800/80 py-8 px-6 bg-[#07090e]">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
                <div className="flex items-center gap-3">
                    <span className="font-bold text-white text-sm">Kairos</span>
                    <span>—</span>
                    <span>Environmental Risk Platform</span>
                </div>
                <div className="flex items-center gap-6">
                    <a href="#pipeline" className="hover:text-slate-300 transition-colors">Pipeline</a>
                    <a href="#architecture" className="hover:text-slate-300 transition-colors">Architecture</a>
                    <span className="text-slate-700">•</span>
                    <p>© {new Date().getFullYear()} Kairos. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}