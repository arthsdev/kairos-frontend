import { Link } from 'react-router'
import { Radio, ArrowRight, CloudRain, MapPin, ShieldAlert } from 'lucide-react'

export function HeroSection() {
    return (
        <section id="overview" className="relative z-10 pt-20 pb-16 px-6">
            <div className="max-w-5xl mx-auto text-center space-y-6">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-slate-300 text-xs font-medium backdrop-blur-md shadow-inner hover:border-slate-700 transition-colors cursor-default">
                    <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                    <span>Regional Environmental Risk Platform</span>
                </div>

                <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-[1.15] max-w-4xl mx-auto">
                    Correlating Weather Telemetry <br />
                    <span className="bg-gradient-to-r from-sky-400 via-emerald-400 to-sky-200 bg-clip-text text-transparent">
                        With Community Incident Reports
                    </span>
                </h1>

                <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto font-normal leading-relaxed">
                    Kairos ingests meteorological feeds and crowd-sourced field reports to calculate sector risk indicators and trigger automated emergency notifications.
                </p>

                <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
                    <Link
                        to="/login"
                        className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold bg-sky-500 hover:bg-sky-400 text-slate-950 transition-all duration-200 text-sm flex items-center justify-center gap-2 shadow-xl shadow-sky-500/25 hover:shadow-sky-500/40 hover:-translate-y-0.5 active:translate-y-0"
                    >
                        Access Dashboard <ArrowRight className="w-4 h-4" />
                    </Link>
                    <a
                        href="#pipeline"
                        className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-medium bg-slate-900/80 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-all duration-200 text-sm flex items-center justify-center gap-2 hover:-translate-y-0.5 active:translate-y-0"
                    >
                        How It Works
                    </a>
                </div>
            </div>

            {/* Preview Card */}
            <div className="max-w-5xl mx-auto mt-14 rounded-2xl bg-slate-900/70 border border-slate-800/80 p-2 shadow-2xl backdrop-blur-md transition-all duration-500 hover:border-slate-700/80 hover:shadow-sky-500/10 group">
                <div className="bg-[#0b0f17] rounded-xl border border-slate-800/80 overflow-hidden">
                    <div className="px-5 py-3 bg-slate-950 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs">
                        <div className="flex items-center gap-3">
                            <div className="flex gap-1.5">
                                <span className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/40 inline-block" />
                                <span className="w-3 h-3 rounded-full bg-amber-500/20 border border-amber-500/40 inline-block" />
                                <span className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500/40 inline-block" />
                            </div>
                            <span className="font-mono text-slate-400 border-l border-slate-800 pl-3">
                                SECTOR_MONITOR // Region #04
                            </span>
                        </div>
                        <div className="flex items-center gap-3 font-mono text-[11px] text-slate-500">
                            <span className="flex items-center gap-1.5 text-emerald-400">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" /> RabbitMQ Messaging Queue
                            </span>
                        </div>
                    </div>

                    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 space-y-3 transition-all duration-300 hover:border-sky-500/40 hover:bg-slate-900/80 hover:-translate-y-1">
                            <div className="flex items-center justify-between text-xs text-sky-400 font-semibold uppercase tracking-wider">
                                <span className="flex items-center gap-2"><CloudRain className="w-4 h-4" /> Weather Telemetry</span>
                                <span className="font-mono text-[10px] text-slate-500">API Feed</span>
                            </div>
                            <div>
                                <div className="text-3xl font-extrabold text-white">52.4 <span className="text-sm font-normal text-slate-400">mm/h</span></div>
                                <p className="text-xs text-slate-400 mt-1">Precipitation threshold monitored</p>
                            </div>
                        </div>

                        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 space-y-3 transition-all duration-300 hover:border-amber-500/40 hover:bg-slate-900/80 hover:-translate-y-1">
                            <div className="flex items-center justify-between text-xs text-amber-400 font-semibold uppercase tracking-wider">
                                <span className="flex items-center gap-2"><MapPin className="w-4 h-4" /> Community Reports</span>
                                <span className="font-mono text-[10px] text-slate-500">Active</span>
                            </div>
                            <div>
                                <div className="text-3xl font-extrabold text-white">14 <span className="text-sm font-normal text-slate-400">reports</span></div>
                                <p className="text-xs text-slate-400 mt-1">Verified field occurrences in sector</p>
                            </div>
                        </div>

                        <div className="bg-red-950/20 border border-red-500/30 rounded-xl p-5 space-y-3 transition-all duration-300 hover:border-red-500/60 hover:bg-red-950/30 hover:-translate-y-1 shadow-lg shadow-red-950/20">
                            <div className="flex items-center justify-between text-xs text-red-400 font-semibold uppercase tracking-wider">
                                <span className="flex items-center gap-2"><ShieldAlert className="w-4 h-4 animate-bounce" /> Calculated Status</span>
                                <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-300 font-mono text-[10px] border border-red-500/30">ALERT HIGH</span>
                            </div>
                            <div>
                                <div className="text-3xl font-extrabold text-red-400">84.5 <span className="text-sm font-normal text-slate-400">/ 100</span></div>
                                <p className="text-xs text-slate-400 mt-1">Triggers async webhook dispatch</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}