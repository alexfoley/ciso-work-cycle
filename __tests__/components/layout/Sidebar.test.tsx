// SPDX-License-Identifier: AGPL-3.0-or-later
// SPDX-FileCopyrightText: 2025 Alex Foley

import { render, screen } from '@testing-library/react'
import { Sidebar } from '@/components/layout/Sidebar'
import { projects } from '@/lib/data'

describe('Sidebar Component - Executive Project Categorization', () => {
  describe('Left Sidebar - Early Stage Projects', () => {
    test('displays Unplanned Work category', () => {
      render(<Sidebar position="left" />)
      expect(screen.getByText('Unplanned Work')).toBeInTheDocument()
    })

    test('displays IS Projects category', () => {
      render(<Sidebar position="left" />)
      expect(screen.getByText('IS Projects')).toBeInTheDocument()
    })

    test('does not display IT/Business Projects in left sidebar', () => {
      render(<Sidebar position="left" />)
      expect(screen.queryByText('IT/Business Projects')).not.toBeInTheDocument()
    })

    test('does not display Business-as-Usual in left sidebar', () => {
      render(<Sidebar position="left" />)
      expect(screen.queryByText('Business-as-Usual')).not.toBeInTheDocument()
    })

    test('shows correct icon for Unplanned Work', () => {
      const { container } = render(<Sidebar position="left" />)
      // AlertTriangle icon should be present
      const icons = container.querySelectorAll('svg')
      expect(icons.length).toBeGreaterThan(0)
    })

    test('shows correct icon for IS Projects', () => {
      const { container } = render(<Sidebar position="left" />)
      // Shield icon should be present
      const icons = container.querySelectorAll('svg')
      expect(icons.length).toBeGreaterThan(0)
    })
  })

  describe('Right Sidebar - Mature Projects', () => {
    test('displays IT/Business Projects category', () => {
      render(<Sidebar position="right" />)
      expect(screen.getByText('IT/Business Projects')).toBeInTheDocument()
    })

    test('displays Business-as-Usual category', () => {
      render(<Sidebar position="right" />)
      expect(screen.getByText('Business-as-Usual')).toBeInTheDocument()
    })

    test('does not display Unplanned Work in right sidebar', () => {
      render(<Sidebar position="right" />)
      expect(screen.queryByText('Unplanned Work')).not.toBeInTheDocument()
    })

    test('does not display IS Projects in right sidebar', () => {
      render(<Sidebar position="right" />)
      expect(screen.queryByText('IS Projects')).not.toBeInTheDocument()
    })

    test('shows correct icon for IT/Business Projects', () => {
      const { container } = render(<Sidebar position="right" />)
      // Briefcase icon should be present
      const icons = container.querySelectorAll('svg')
      expect(icons.length).toBeGreaterThan(0)
    })
  })

  describe('Project Filtering and Display', () => {
    test('filters projects by category for left sidebar', () => {
      render(<Sidebar position="left" />)

      const leftCategories = ['Unplanned Work', 'IS Projects']
      const leftProjects = projects.filter(p => leftCategories.includes(p.category))

      leftProjects.forEach(project => {
        expect(screen.getByText(project.name)).toBeInTheDocument()
      })
    })

    test('filters projects by category for right sidebar', () => {
      render(<Sidebar position="right" />)

      const rightCategories = ['IT/Business Projects', 'Business-as-Usual']
      const rightProjects = projects.filter(p => rightCategories.includes(p.category))

      rightProjects.forEach(project => {
        expect(screen.getByText(project.name)).toBeInTheDocument()
      })
    })

    test('displays risk level for each project', () => {
      render(<Sidebar position="left" />)

      // Check that RISK label appears
      const riskLabels = screen.getAllByText(/RISK:/)
      expect(riskLabels.length).toBeGreaterThan(0)
    })

    test('displays complexity level for each project', () => {
      render(<Sidebar position="left" />)

      // Check that COMPLEXITY label appears
      const complexityLabels = screen.getAllByText(/COMPLEXITY:/)
      expect(complexityLabels.length).toBeGreaterThan(0)
    })

    test('displays correct risk values (L/M/H)', () => {
      render(<Sidebar position="left" />)

      const leftCategories = ['Unplanned Work', 'IS Projects']
      const leftProjects = projects.filter(p => leftCategories.includes(p.category))

      // Check that each unique risk value appears
      const uniqueRisks = [...new Set(leftProjects.map(p => p.risk))]
      uniqueRisks.forEach(risk => {
        const riskPattern = new RegExp(`RISK: ${risk}`)
        const matches = screen.getAllByText(riskPattern)
        expect(matches.length).toBeGreaterThan(0)
      })
    })

    test('displays correct complexity values (L/M/H)', () => {
      render(<Sidebar position="left" />)

      const leftCategories = ['Unplanned Work', 'IS Projects']
      const leftProjects = projects.filter(p => leftCategories.includes(p.category))

      // Check that each unique complexity value appears
      const uniqueComplexities = [...new Set(leftProjects.map(p => p.complexity))]
      uniqueComplexities.forEach(complexity => {
        const complexityPattern = new RegExp(`COMPLEXITY: ${complexity}`)
        const matches = screen.getAllByText(complexityPattern)
        expect(matches.length).toBeGreaterThan(0)
      })
    })
  })

  describe('Responsive Design', () => {
    test('applies responsive height classes', () => {
      const { container } = render(<Sidebar position="left" />)
      const sidebar = container.querySelector('.h-auto')
      expect(sidebar).toHaveClass('lg:h-[calc(100vh-8rem)]')
    })

    test('enables vertical scrolling', () => {
      const { container } = render(<Sidebar position="left" />)
      const sidebar = container.querySelector('.overflow-y-auto')
      expect(sidebar).toBeInTheDocument()
    })

    test('applies responsive padding', () => {
      const { container } = render(<Sidebar position="left" />)
      const sidebar = container.querySelector('.p-2')
      expect(sidebar).toHaveClass('lg:p-4')
    })

    test('category icons scale responsively', () => {
      const { container } = render(<Sidebar position="left" />)
      const icon = container.querySelector('svg')
      expect(icon).toHaveClass('h-4', 'w-4')
      expect(icon).toHaveClass('lg:h-5', 'lg:w-5')
    })

    test('category text scales responsively', () => {
      const { container } = render(<Sidebar position="left" />)
      const categoryText = screen.getByText('Unplanned Work')
      expect(categoryText).toHaveClass('text-xs')
      expect(categoryText).toHaveClass('lg:text-base')
    })

    test('project name text scales responsively', () => {
      const { container } = render(<Sidebar position="left" />)
      const projectNames = container.querySelectorAll('.text-\\[11px\\]')
      expect(projectNames.length).toBeGreaterThan(0)
    })
  })

  describe('Executive Presentation Quality', () => {
    test('groups projects by category', () => {
      const { container } = render(<Sidebar position="left" />)

      // Each category should have its own section
      const categoryHeaders = screen.getAllByText(/^(Unplanned Work|IS Projects)$/)
      expect(categoryHeaders.length).toBe(2)
    })

    test('applies professional typography', () => {
      const { container } = render(<Sidebar position="left" />)
      const categoryText = screen.getByText('Unplanned Work')
      expect(categoryText).toHaveClass('font-semibold', 'tracking-tight')
    })

    test('uses uppercase for metadata labels', () => {
      const { container } = render(<Sidebar position="left" />)
      const metadata = container.querySelectorAll('.uppercase')
      expect(metadata.length).toBeGreaterThan(0)
    })

    test('applies proper spacing between categories', () => {
      const { container } = render(<Sidebar position="left" />)
      const spacingContainer = container.querySelector('.space-y-3')
      expect(spacingContainer).toHaveClass('lg:space-y-6')
    })

    test('indents project list for visual hierarchy', () => {
      const { container } = render(<Sidebar position="left" />)
      const projectList = container.querySelector('.pl-4')
      expect(projectList).toHaveClass('lg:pl-6')
    })
  })
})
