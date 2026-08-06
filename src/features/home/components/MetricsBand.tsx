const METRICS = [
    { value: 'RabbitMQ', label: 'Asynchronous Risk Pipeline', highlight: 'text-sky-400' },
    { value: 'REST + JSON', label: 'Standard API Operations', highlight: 'text-white' },
    { value: 'JWT Auth', label: 'Stateless Request Security', highlight: 'text-emerald-400' },
    { value: 'Redis Cache', label: 'Rate Limiting & Telemetry', highlight: 'text-white' },
] as const

export function MetricsBand() {
    return (
        <section className="border-y border-slate-800/60 bg-slate-950/40 py-8 relative z-10">
            <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                {METRICS.map((metric) => (
                    <div key={metric.label} className="space-y-1">
                        <div className={`text-xl font-bold font-mono ${metric.highlight}`}>{metric.value}</div>
                        <div className="text-xs text-slate-400">{metric.label}</div>
                    </div>
                ))}
            </div>
        </section>
    )
}