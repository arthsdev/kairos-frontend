import type { OccurrenceCategory, SeverityLevel, OccurrenceStatus } from '../types'

/**
 * Retorna a cor hexadecimal associada ao nível de gravidade.
 */
export function getSeverityColor(severity: SeverityLevel): string {
    switch (severity) {
        case 'LOW':
            return '#3b82f6' // blue-500
        case 'MEDIUM':
            return '#eab308' // yellow-500
        case 'HIGH':
            return '#f97316' // orange-500
        case 'CRITICAL':
            return '#ef4444' // red-500
        default:
            return '#64748b' // slate-500
    }
}

/**
 * Retorna classes Tailwind de background. Útil para legendas e badges externos.
 */
export function getSeverityBgClass(severity: SeverityLevel): string {
    switch (severity) {
        case 'LOW':
            return 'bg-blue-500'
        case 'MEDIUM':
            return 'bg-yellow-500'
        case 'HIGH':
            return 'bg-orange-500'
        case 'CRITICAL':
            return 'bg-red-500'
        default:
            return 'bg-slate-500'
    }
}

/**
 * Retorna a classe Tailwind para a borda com base no status de moderação do backend.
 */
export function getModerationBorderStyle(status: OccurrenceStatus): string {
    switch (status) {
        case 'VERIFIED':
            return 'border-2 border-emerald-500 shadow-emerald-500/20'
        case 'PENDING':
            return 'border-2 border-dashed border-amber-400 animate-pulse'
        case 'RESOLVED':
            return 'border-2 border-slate-600 opacity-60 grayscale'
        default:
            return 'border border-slate-700'
    }
}

/**
 * Retorna a string SVG puramente inline com caminhos exatos dos ícones Lucide.
 */
export function getCategorySvg(category: OccurrenceCategory): string {
    const props =
        'xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"'

    switch (category) {
        case 'FLOOD':
            // Waves
            return `<svg ${props}><path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/></svg>`

        case 'LANDSLIDE':
            // Mountain
            return `<svg ${props}><path d="m8 3 4 8 5-5 5 15H2z"/><path d="M4.14 15.08c2.62-1.57 5.24-1.43 7.86.42 2.74 1.94 5.49 2 8.23.19"/></svg>`

        case 'SEWAGE':
            // Droplets
            return `<svg ${props}><path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z"/><path d="M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97"/></svg>`

        case 'ILLEGAL_DUMPING':
            // Trash-2
            return `<svg ${props}><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>`

        case 'MUDDY_WATER':
            // Cloud Rain
            return `<svg ${props}><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M16 14v6"/><path d="M8 14v6"/><path d="M12 16v6"/></svg>`

        case 'WILDFIRE':
            // Flame
            return `<svg ${props}><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>`

        default:
            // Alert Triangle
            return `<svg ${props}><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>`
    }
}

/**
 * Monta a string HTML final para o L.divIcon do Leaflet.
 */
export function createCustomMarkerHtml(
    category: OccurrenceCategory,
    severity: SeverityLevel,
    status: OccurrenceStatus = 'VERIFIED'
): string {
    const bgColor = getSeverityColor(severity)
    const borderStyle = getModerationBorderStyle(status)
    const svgIcon = getCategorySvg(category)

    return `
        <div class="relative flex items-center justify-center w-9 h-9 rounded-full shadow-md transition-transform duration-150 hover:scale-110 ${borderStyle}" style="background-color: ${bgColor}">
            <div class="text-white flex items-center justify-center">
                ${svgIcon}
            </div>
        </div>
    `
}