import { projects, timelineMarkers, projectCategories } from '@/lib/data'

describe('Data Model Validation - Executive Data Integrity', () => {
  describe('Project Data Structure - CISO Portfolio Requirements', () => {
    test('all projects have required fields for executive presentation', () => {
      projects.forEach(project => {
        // Every project must have these fields for executive clarity
        expect(project.name).toBeDefined()
        expect(typeof project.name).toBe('string')
        expect(project.name.length).toBeGreaterThan(0)

        expect(project.position).toBeDefined()
        expect(typeof project.position).toBe('number')

        expect(project.category).toBeDefined()
        expect(typeof project.category).toBe('string')

        expect(project.risk).toBeDefined()
        expect(['L', 'M', 'H']).toContain(project.risk)

        expect(project.complexity).toBeDefined()
        expect(['L', 'M', 'H']).toContain(project.complexity)

        expect(project.timeline).toBeDefined()
        expect(typeof project.timeline).toBe('string')
      })
    })

    test('project positions are valid for curve mathematics', () => {
      projects.forEach(project => {
        // Position must be between 0 and 1 for proper curve positioning
        expect(project.position).toBeGreaterThanOrEqual(0)
        expect(project.position).toBeLessThanOrEqual(1)
      })
    })

    test('project categories match defined executive categories', () => {
      const validCategories = Object.keys(projectCategories)

      projects.forEach(project => {
        expect(validCategories).toContain(project.category)
      })
    })

    test('project timelines have corresponding timeline markers', () => {
      const validTimelines = Object.keys(timelineMarkers)

      projects.forEach(project => {
        expect(validTimelines).toContain(project.timeline)
      })
    })
  })

  describe('Executive Category Configuration', () => {
    test('all required CISO categories are defined', () => {
      const requiredCategories = [
        'Unplanned Work',
        'IS Projects',
        'IT/Business Projects',
        'Business-as-Usual'
      ]

      requiredCategories.forEach(category => {
        expect(projectCategories).toHaveProperty(category)
        expect(typeof projectCategories[category]).toBe('string')
      })
    })

    test('category colors are properly defined for executive visualization', () => {
      Object.values(projectCategories).forEach(color => {
        // Should be CSS color values for proper rendering
        expect(typeof color).toBe('string')
        expect(color.length).toBeGreaterThan(0)
      })
    })
  })

  describe('Timeline Configuration - Executive Planning Critical', () => {
    test('all executive timeline periods are represented', () => {
      const requiredTimelines = [
        'next month',
        'next quarter',
        'next half',
        'next year',
        'on hold'
      ]

      requiredTimelines.forEach(timeline => {
        expect(timelineMarkers).toHaveProperty(timeline)
        expect(typeof timelineMarkers[timeline]).toBe('string')
      })
    })

    test('timeline markers are single characters for clean visualization', () => {
      Object.values(timelineMarkers).forEach(marker => {
        expect(marker.length).toBe(1)
        // Should be Unicode symbols for professional appearance
        expect(marker).toMatch(/[○●△▲⊗]/)
      })
    })
  })

  describe('Data Quality - Executive Accuracy Standards', () => {
    test('no duplicate project names for clear executive identification', () => {
      const projectNames = projects.map(p => p.name)
      const uniqueNames = new Set(projectNames)

      expect(uniqueNames.size).toBe(projectNames.length)
    })

    test('projects are distributed across the curve for balanced visualization', () => {
      const positions = projects.map(p => p.position).sort()

      // Should have projects across different parts of the curve
      expect(positions[0]).toBeLessThan(0.3) // Some early stage
      expect(positions[positions.length - 1]).toBeGreaterThan(0.7) // Some mature
    })

    test('portfolio has appropriate mix of risk levels for executive overview', () => {
      const riskLevels = projects.map(p => p.risk)
      const riskCounts = {
        L: riskLevels.filter(r => r === 'L').length,
        M: riskLevels.filter(r => r === 'M').length,
        H: riskLevels.filter(r => r === 'H').length
      }

      // Should have variety of risk levels (not all high or all low)
      expect(Object.values(riskCounts).filter(count => count > 0).length).toBeGreaterThanOrEqual(2)
    })

    test('portfolio spans multiple categories for comprehensive CISO view', () => {
      const categories = projects.map(p => p.category)
      const uniqueCategories = new Set(categories)

      // Executive needs to see work across different areas
      expect(uniqueCategories.size).toBeGreaterThanOrEqual(2)
    })

    test('timeline distribution supports executive planning horizon', () => {
      const timelines = projects.map(p => p.timeline)
      const uniqueTimelines = new Set(timelines)

      // Should have projects in different time horizons
      expect(uniqueTimelines.size).toBeGreaterThanOrEqual(2)
    })
  })
})