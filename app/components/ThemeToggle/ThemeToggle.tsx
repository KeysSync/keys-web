'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/lib/theme/ThemeProvider'
import './style.css'

interface ThemeToggleProps {
  variant?: 'default' | 'sidebar' | 'ghost'
  className?: string
}

export function ThemeToggle({
  variant = 'default',
  className = '',
}: ThemeToggleProps) {
  const { theme, toggleTheme, mounted } = useTheme()

  if (!mounted) {
    return (
      <button
        type="button"
        className={`theme-toggle theme-toggle--${variant} ${className}`}
        aria-label="Alternar tema"
        disabled
      />
    )
  }

  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      className={`theme-toggle theme-toggle--${variant} ${className}`}
      onClick={toggleTheme}
      aria-label={isDark ? 'Ativar modo claro' : 'Ativar modo escuro'}
      title={isDark ? 'Modo claro' : 'Modo escuro'}
    >
      {isDark ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  )
}
