import { Link } from 'react-router'
import { CheckCircle2 } from 'lucide-react'

export function PricingSection() {
    return (
        <section id="pricing" className="relative z-10 py-20 px-6">
            <div className="max-w-5xl mx-auto space-y-12">
                <div className="text-center space-y-2">
                    <h2 className="text-2xl sm:text-3xl font-bold text-white">Access Plans</h2>
                    <p className="text-slate-400 text-sm">Flexible tiers designed for citizens, NGOs, and municipalities.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
                    {/* Community */}
                    <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl flex flex-col justify-between space-y-6 transition-all duration-300 hover:border-slate-700 hover:bg-slate-900/70 hover:-translate-y-1">
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-lg font-bold text-white">Community</h3>
                                <p className="text-xs text-slate-400 mt-1">For local citizens</p>
                            </div>
                            <div className="text-3xl font-extrabold text-white">$0 <span className="text-xs font-normal text-slate-500">/ forever</span></div>
                            <ul className="space-y-3 text-xs text-slate-300">
                                <li className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-sky-400" /> Submit incident reports</li>
                                <li className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-sky-400" /> View sector risk status & alerts</li>
                                <li className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-sky-400" /> Standard User role access</li>
                            </ul>
                        </div>
                        <Link to="/register" className="w-full py-2.5 rounded-lg border border-slate-800 bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-center text-white transition-all duration-200">
                            Sign Up Free
                        </Link>
                    </div>

                    {/* Pro */}
                    <div className="bg-slate-900/90 border-2 border-sky-500/80 p-6 rounded-2xl flex flex-col justify-between space-y-6 relative shadow-xl shadow-sky-500/10 transition-all duration-300 hover:border-sky-400 hover:shadow-sky-500/20 hover:-translate-y-1.5">
                        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-sky-500 text-slate-950 font-extrabold text-[10px] uppercase px-3 py-0.5 rounded-full tracking-wider shadow">
                            RECOMMENDED
                        </span>
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-lg font-bold text-white">Civil Defense & NGOs</h3>
                                <p className="text-xs text-slate-400 mt-1">For monitoring operations</p>
                            </div>
                            <div className="text-3xl font-extrabold text-white">Pro <span className="text-xs font-normal text-slate-500">/ tier</span></div>
                            <ul className="space-y-3 text-xs text-slate-300">
                                <li className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-sky-400" /> Continuous weather telemetry feeds</li>
                                <li className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-sky-400" /> Webhook alert integration</li>
                                <li className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-sky-400" /> Admin moderation access</li>
                            </ul>
                        </div>
                        <Link to="/register" className="w-full py-2.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold text-center transition-all duration-200 shadow-md shadow-sky-500/20 hover:shadow-sky-500/40">
                            Get Started
                        </Link>
                    </div>

                    {/* Enterprise */}
                    <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl flex flex-col justify-between space-y-6 transition-all duration-300 hover:border-slate-700 hover:bg-slate-900/70 hover:-translate-y-1">
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-lg font-bold text-white">Enterprise / City</h3>
                                <p className="text-xs text-slate-400 mt-1">For municipal systems</p>
                            </div>
                            <div className="text-3xl font-extrabold text-white">Custom <span className="text-xs font-normal text-slate-500">/ deployment</span></div>
                            <ul className="space-y-3 text-xs text-slate-300">
                                <li className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-sky-400" /> Custom OAuth2 / Role integration</li>
                                <li className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-sky-400" /> Dedicated messaging queues</li>
                            </ul>
                        </div>
                        <button type="button" className="w-full py-2.5 rounded-lg border border-slate-800 bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-center text-white transition-all duration-200">
                            Contact Team
                        </button>
                    </div>
                </div>
            </div>
        </section>
    )
}