import type { RiskLevel } from '../types'

export function getRiskLevelColor(riskLevel: RiskLevel): string {
    switch (riskLevel) {
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

export function getRiskLevelBgClass(riskLevel: RiskLevel): string {
    switch (riskLevel) {
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