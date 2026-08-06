const PIPELINE_STEPS = [
    {
        step: '01',
        title: 'Meteorological Ingestion',
        description: 'Background workers poll weather APIs for precipitation and pressure indicators across active regions.',
        colorClass: 'bg-sky-500/10 border-sky-500/20 text-sky-400 group-hover:bg-sky-500 group-hover:text-slate-950',
        hoverBorder: 'hover:border-sky-500/50',
    },
    {
        step: '02',
        title: 'Incident Aggregation',
        description: 'Field reports submitted by users are grouped geographically and weighted by severity in real time.',
        colorClass: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-slate-950',
        hoverBorder: 'hover:border-emerald-500/50',
    },
    {
        step: '03',
        title: 'Automated Webhooks',
        description: 'Crossed thresholds trigger RabbitMQ workers to dispatch external alert payloads asynchronously.',
        colorClass: 'bg-amber-500/10 border-amber-500/20 text-amber-400 group-hover:bg-amber-500 group-hover:text-slate-950',
        hoverBorder: 'hover:border-amber-500/50',
    },
] as const

export function PipelineSection() {
    return (
        <section id="pipeline" className="relative z-10 py-20 px-6 border-b border-slate-800/60">
            <div className="max-w-6xl mx-auto space-y-12">
                <div className="text-center space-y-3">
                    <h2 className="text-2xl sm:text-3xl font-bold text-white">Risk Evaluation Pipeline</h2>
                    <p className="text-slate-400 text-sm max-w-xl mx-auto">
                        How climate feeds and citizen reports flow through the backend system.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {PIPELINE_STEPS.map((item) => (
                        <div
                            key={item.step}
                            className={`group p-6 rounded-xl bg-slate-900/40 border border-slate-800 space-y-3 transition-all duration-300 hover:-translate-y-1.5 hover:bg-slate-900/80 hover:shadow-xl ${item.hoverBorder}`}
                        >
                            <div className={`w-10 h-10 rounded-lg border font-bold flex items-center justify-center transition-all duration-300 ${item.colorClass}`}>
                                {item.step}
                            </div>
                            <h3 className="text-base font-semibold text-white group-hover:text-sky-300 transition-colors">{item.title}</h3>
                            <p className="text-xs text-slate-400 leading-relaxed">{item.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}