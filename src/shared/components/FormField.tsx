import type { InputHTMLAttributes } from 'react'

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  id: string
}

export function FormField({ label, id, className = '', ...props }: FormFieldProps) {
  return (
    <div className="space-y-1">
      <label className="block text-xs font-medium text-slate-300" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        {...props}
        className={`w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white placeholder-slate-500 transition-colors focus:border-sky-500 focus:outline-none ${className}`}
      />
    </div>
  )
}