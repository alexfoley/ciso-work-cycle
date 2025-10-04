// SPDX-License-Identifier: AGPL-3.0-or-later
// SPDX-FileCopyrightText: 2025 Alex Foley

import { render, screen } from '@testing-library/react'
import { Header } from '@/components/layout/Header'

describe('Header Component - Executive Branding', () => {
  describe('Core Rendering', () => {
    test('renders CISO Work Cycle title', () => {
      render(<Header />)
      expect(screen.getByText('CISO Work Cycle')).toBeInTheDocument()
    })

    test('renders BarChart3 icon for data visualization branding', () => {
      const { container } = render(<Header />)
      // Lucide icons render as SVG elements
      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })

    test('applies sticky positioning for persistent header', () => {
      const { container } = render(<Header />)
      const header = container.querySelector('header')
      expect(header).toHaveClass('sticky', 'top-0', 'z-50')
    })

    test('applies backdrop blur for modern aesthetic', () => {
      const { container } = render(<Header />)
      const header = container.querySelector('header')
      expect(header).toHaveClass('backdrop-blur')
    })
  })

  describe('Responsive Design', () => {
    test('renders with responsive height classes', () => {
      const { container } = render(<Header />)
      const headerContent = container.querySelector('.h-14')
      expect(headerContent).toBeInTheDocument()
      expect(headerContent).toHaveClass('lg:h-16')
    })

    test('icon scales responsively', () => {
      const { container } = render(<Header />)
      const icon = container.querySelector('svg')
      expect(icon).toHaveClass('h-5', 'w-5')
      expect(icon).toHaveClass('lg:h-7', 'lg:w-7')
    })

    test('title text scales responsively', () => {
      const { container } = render(<Header />)
      const title = screen.getByText('CISO Work Cycle')
      expect(title).toHaveClass('text-base')
      expect(title).toHaveClass('lg:text-2xl')
    })

    test('spacing adapts for different screen sizes', () => {
      const { container } = render(<Header />)
      const contentWrapper = container.querySelector('.space-x-2')
      expect(contentWrapper).toHaveClass('lg:space-x-4')
    })
  })

  describe('Executive Presentation Quality', () => {
    test('title uses line-clamp for overflow handling', () => {
      const { container } = render(<Header />)
      const title = screen.getByText('CISO Work Cycle')
      expect(title).toHaveClass('line-clamp-1')
    })

    test('applies professional typography', () => {
      const { container } = render(<Header />)
      const title = screen.getByText('CISO Work Cycle')
      expect(title).toHaveClass('font-bold', 'tracking-tight')
    })

    test('header has proper border styling', () => {
      const { container } = render(<Header />)
      const header = container.querySelector('header')
      expect(header).toHaveClass('border-b')
    })
  })
})
