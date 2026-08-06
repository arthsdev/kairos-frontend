import { Server, Coffee, Layers, Database, HardDrive } from 'lucide-react'

const TECH_STACK = [
    { icon: Server, title: 'Spring Boot 4', subtitle: 'REST API Engine', iconColor: 'text-emerald-400', hoverBorder: 'hover:border-emerald-500/40' },
    { icon: Coffee, title: 'Java 21 LTS', subtitle: 'Virtual Threads', iconColor: 'text-amber-400', hoverBorder: 'hover:border-amber-500/40' },
    { icon: Layers, title: 'RabbitMQ', subtitle: 'Async Task Queue', iconColor: 'text-orange-400', hoverBorder: 'hover:border-orange-500/40' },
    { icon: Database, title: 'Redis', subtitle: 'Caching & Rate Limit', iconColor: 'text-red-400', hoverBorder: 'hover:border-red-500/40' },
    { icon: HardDrive, title: 'MySQL 8 / Flyway', subtitle: 'Migrations & Data', iconColor: 'text-sky-400', hoverBorder: 'hover:border-sky-500/40' },
] as const

export function ArchitectureSection() {
    return (
        <section id="architecture" className="relative z-10 py-16 px-6 bg-slate-950/50 border-b border-slate-800/60">
            <div className="max-w-6xl mx-auto space-y-8 text-center">
                <div className="space-y-2">
                    <span className="text-[11px] font-bold tracking-widest text-sky-400 uppercase">BACKEND STACK</span>
                    <h2 className="text-2xl font-bold text-white">Production-Grade Technologies</h2>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                    {TECH_STACK.map((tech) => {
                        const Icon = tech.icon
                        return (
                            <div
                                key={tech.title}
                                className={`p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col items-center gap-2 transition-all duration-300 hover:-translate-y-1 hover:bg-slate-900/90 hover:shadow-lg ${tech.hoverBorder} group cursor-default`}
                            >
                                <Icon className={`w-6 h-6 transition-transform duration-300 group-hover:scale-110 ${tech.iconColor}`} />
                                <span className="text-xs font-bold text-white">{tech.title}</span>
                                <span className="text-[10px] text-slate-500">{tech.subtitle}</span>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}