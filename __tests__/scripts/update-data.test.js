// SPDX-License-Identifier: AGPL-3.0-or-later
// SPDX-FileCopyrightText: 2025 Alex Foley

const { validateRow, parseCsv, generateTypescriptData } = require('../../scripts/update-data.js');

describe('CSV Data Pipeline - Executive Workflow', () => {
  describe('CSV Parsing', () => {
    test('parses valid CSV with all fields', () => {
      const csvContent = `Project Name,Position,Category,Risk,Complexity,Timeline,Notes
Leadership,0.15,Unplanned Work,H,L,next month,Executive leadership initiative`;

      const result = parseCsv(csvContent);

      expect(result).toHaveLength(1);
      expect(result[0]['Project Name']).toBe('Leadership');
      expect(result[0].Position).toBe('0.15');
      expect(result[0].Category).toBe('Unplanned Work');
      expect(result[0].Risk).toBe('H');
      expect(result[0].Complexity).toBe('L');
      expect(result[0].Timeline).toBe('next month');
      expect(result[0].Notes).toBe('Executive leadership initiative');
    });

    test('parses multiple projects', () => {
      const csvContent = `Project Name,Position,Category,Risk,Complexity,Timeline,Notes
Leadership,0.15,Unplanned Work,H,L,next month,Note 1
Cyber Transformation,0.25,IS Projects,H,H,on hold,Note 2
LOB Support,0.32,IS Projects,L,L,next half,Note 3`;

      const result = parseCsv(csvContent);

      expect(result).toHaveLength(3);
      expect(result[0]['Project Name']).toBe('Leadership');
      expect(result[1]['Project Name']).toBe('Cyber Transformation');
      expect(result[2]['Project Name']).toBe('LOB Support');
    });

    test('handles empty Notes field', () => {
      const csvContent = `Project Name,Position,Category,Risk,Complexity,Timeline,Notes
Leadership,0.15,Unplanned Work,H,L,next month,`;

      const result = parseCsv(csvContent);

      expect(result[0].Notes).toBe('');
    });

    test('trims whitespace from all fields', () => {
      const csvContent = `Project Name,Position,Category,Risk,Complexity,Timeline,Notes
  Leadership  , 0.15 , Unplanned Work , H , L , next month , Note `;

      const result = parseCsv(csvContent);

      expect(result[0]['Project Name']).toBe('Leadership');
      expect(result[0].Position).toBe('0.15');
      expect(result[0].Category).toBe('Unplanned Work');
      expect(result[0].Risk).toBe('H');
      expect(result[0].Complexity).toBe('L');
      expect(result[0].Timeline).toBe('next month');
      expect(result[0].Notes).toBe('Note');
    });
  });

  describe('Validation - Project Name', () => {
    test('accepts valid project name', () => {
      const row = {
        'Project Name': 'Leadership Initiative',
        Position: '0.5',
        Category: 'Unplanned Work',
        Risk: 'H',
        Complexity: 'L',
        Timeline: 'next month'
      };

      const errors = validateRow(row, 0);
      expect(errors).toHaveLength(0);
    });

    test('rejects empty project name', () => {
      const row = {
        'Project Name': '',
        Position: '0.5',
        Category: 'Unplanned Work',
        Risk: 'H',
        Complexity: 'L',
        Timeline: 'next month'
      };

      const errors = validateRow(row, 0);
      expect(errors).toContain('Row 2: Project Name is required');
    });

    test('rejects whitespace-only project name', () => {
      const row = {
        'Project Name': '   ',
        Position: '0.5',
        Category: 'Unplanned Work',
        Risk: 'H',
        Complexity: 'L',
        Timeline: 'next month'
      };

      const errors = validateRow(row, 0);
      expect(errors).toContain('Row 2: Project Name is required');
    });
  });

  describe('Validation - Position', () => {
    test('accepts position 0.0', () => {
      const row = {
        'Project Name': 'Project',
        Position: '0.0',
        Category: 'Unplanned Work',
        Risk: 'H',
        Complexity: 'L',
        Timeline: 'next month'
      };

      const errors = validateRow(row, 0);
      expect(errors).toHaveLength(0);
    });

    test('accepts position 1.0', () => {
      const row = {
        'Project Name': 'Project',
        Position: '1.0',
        Category: 'Unplanned Work',
        Risk: 'H',
        Complexity: 'L',
        Timeline: 'next month'
      };

      const errors = validateRow(row, 0);
      expect(errors).toHaveLength(0);
    });

    test('accepts position 0.5', () => {
      const row = {
        'Project Name': 'Project',
        Position: '0.5',
        Category: 'Unplanned Work',
        Risk: 'H',
        Complexity: 'L',
        Timeline: 'next month'
      };

      const errors = validateRow(row, 0);
      expect(errors).toHaveLength(0);
    });

    test('rejects position below 0', () => {
      const row = {
        'Project Name': 'Project',
        Position: '-0.1',
        Category: 'Unplanned Work',
        Risk: 'H',
        Complexity: 'L',
        Timeline: 'next month'
      };

      const errors = validateRow(row, 0);
      expect(errors).toContain('Row 2: Position must be a number between 0.0 and 1.0');
    });

    test('rejects position above 1', () => {
      const row = {
        'Project Name': 'Project',
        Position: '1.5',
        Category: 'Unplanned Work',
        Risk: 'H',
        Complexity: 'L',
        Timeline: 'next month'
      };

      const errors = validateRow(row, 0);
      expect(errors).toContain('Row 2: Position must be a number between 0.0 and 1.0');
    });

    test('rejects non-numeric position', () => {
      const row = {
        'Project Name': 'Project',
        Position: 'abc',
        Category: 'Unplanned Work',
        Risk: 'H',
        Complexity: 'L',
        Timeline: 'next month'
      };

      const errors = validateRow(row, 0);
      expect(errors).toContain('Row 2: Position must be a number between 0.0 and 1.0');
    });
  });

  describe('Validation - Category', () => {
    test('accepts Unplanned Work', () => {
      const row = {
        'Project Name': 'Project',
        Position: '0.5',
        Category: 'Unplanned Work',
        Risk: 'H',
        Complexity: 'L',
        Timeline: 'next month'
      };

      const errors = validateRow(row, 0);
      expect(errors).toHaveLength(0);
    });

    test('accepts IS Projects', () => {
      const row = {
        'Project Name': 'Project',
        Position: '0.5',
        Category: 'IS Projects',
        Risk: 'H',
        Complexity: 'L',
        Timeline: 'next month'
      };

      const errors = validateRow(row, 0);
      expect(errors).toHaveLength(0);
    });

    test('accepts IT/Business Projects', () => {
      const row = {
        'Project Name': 'Project',
        Position: '0.5',
        Category: 'IT/Business Projects',
        Risk: 'H',
        Complexity: 'L',
        Timeline: 'next month'
      };

      const errors = validateRow(row, 0);
      expect(errors).toHaveLength(0);
    });

    test('accepts Business-as-Usual', () => {
      const row = {
        'Project Name': 'Project',
        Position: '0.5',
        Category: 'Business-as-Usual',
        Risk: 'H',
        Complexity: 'L',
        Timeline: 'next month'
      };

      const errors = validateRow(row, 0);
      expect(errors).toHaveLength(0);
    });

    test('rejects invalid category', () => {
      const row = {
        'Project Name': 'Project',
        Position: '0.5',
        Category: 'Invalid Category',
        Risk: 'H',
        Complexity: 'L',
        Timeline: 'next month'
      };

      const errors = validateRow(row, 0);
      expect(errors).toContain('Row 2: Category must be one of: Unplanned Work, IS Projects, IT/Business Projects, Business-as-Usual');
    });
  });

  describe('Validation - Risk Level', () => {
    test('accepts L (Low)', () => {
      const row = {
        'Project Name': 'Project',
        Position: '0.5',
        Category: 'Unplanned Work',
        Risk: 'L',
        Complexity: 'L',
        Timeline: 'next month'
      };

      const errors = validateRow(row, 0);
      expect(errors).toHaveLength(0);
    });

    test('accepts M (Medium)', () => {
      const row = {
        'Project Name': 'Project',
        Position: '0.5',
        Category: 'Unplanned Work',
        Risk: 'M',
        Complexity: 'L',
        Timeline: 'next month'
      };

      const errors = validateRow(row, 0);
      expect(errors).toHaveLength(0);
    });

    test('accepts H (High)', () => {
      const row = {
        'Project Name': 'Project',
        Position: '0.5',
        Category: 'Unplanned Work',
        Risk: 'H',
        Complexity: 'L',
        Timeline: 'next month'
      };

      const errors = validateRow(row, 0);
      expect(errors).toHaveLength(0);
    });

    test('rejects invalid risk level', () => {
      const row = {
        'Project Name': 'Project',
        Position: '0.5',
        Category: 'Unplanned Work',
        Risk: 'X',
        Complexity: 'L',
        Timeline: 'next month'
      };

      const errors = validateRow(row, 0);
      expect(errors).toContain('Row 2: Risk must be one of: L, M, H');
    });
  });

  describe('Validation - Complexity Level', () => {
    test('accepts L (Low)', () => {
      const row = {
        'Project Name': 'Project',
        Position: '0.5',
        Category: 'Unplanned Work',
        Risk: 'H',
        Complexity: 'L',
        Timeline: 'next month'
      };

      const errors = validateRow(row, 0);
      expect(errors).toHaveLength(0);
    });

    test('accepts M (Medium)', () => {
      const row = {
        'Project Name': 'Project',
        Position: '0.5',
        Category: 'Unplanned Work',
        Risk: 'H',
        Complexity: 'M',
        Timeline: 'next month'
      };

      const errors = validateRow(row, 0);
      expect(errors).toHaveLength(0);
    });

    test('accepts H (High)', () => {
      const row = {
        'Project Name': 'Project',
        Position: '0.5',
        Category: 'Unplanned Work',
        Risk: 'H',
        Complexity: 'H',
        Timeline: 'next month'
      };

      const errors = validateRow(row, 0);
      expect(errors).toHaveLength(0);
    });

    test('rejects invalid complexity level', () => {
      const row = {
        'Project Name': 'Project',
        Position: '0.5',
        Category: 'Unplanned Work',
        Risk: 'H',
        Complexity: 'X',
        Timeline: 'next month'
      };

      const errors = validateRow(row, 0);
      expect(errors).toContain('Row 2: Complexity must be one of: L, M, H');
    });
  });

  describe('Validation - Timeline', () => {
    test('accepts next month', () => {
      const row = {
        'Project Name': 'Project',
        Position: '0.5',
        Category: 'Unplanned Work',
        Risk: 'H',
        Complexity: 'L',
        Timeline: 'next month'
      };

      const errors = validateRow(row, 0);
      expect(errors).toHaveLength(0);
    });

    test('accepts next quarter', () => {
      const row = {
        'Project Name': 'Project',
        Position: '0.5',
        Category: 'Unplanned Work',
        Risk: 'H',
        Complexity: 'L',
        Timeline: 'next quarter'
      };

      const errors = validateRow(row, 0);
      expect(errors).toHaveLength(0);
    });

    test('accepts next half', () => {
      const row = {
        'Project Name': 'Project',
        Position: '0.5',
        Category: 'Unplanned Work',
        Risk: 'H',
        Complexity: 'L',
        Timeline: 'next half'
      };

      const errors = validateRow(row, 0);
      expect(errors).toHaveLength(0);
    });

    test('accepts next year', () => {
      const row = {
        'Project Name': 'Project',
        Position: '0.5',
        Category: 'Unplanned Work',
        Risk: 'H',
        Complexity: 'L',
        Timeline: 'next year'
      };

      const errors = validateRow(row, 0);
      expect(errors).toHaveLength(0);
    });

    test('accepts on hold', () => {
      const row = {
        'Project Name': 'Project',
        Position: '0.5',
        Category: 'Unplanned Work',
        Risk: 'H',
        Complexity: 'L',
        Timeline: 'on hold'
      };

      const errors = validateRow(row, 0);
      expect(errors).toHaveLength(0);
    });

    test('rejects invalid timeline', () => {
      const row = {
        'Project Name': 'Project',
        Position: '0.5',
        Category: 'Unplanned Work',
        Risk: 'H',
        Complexity: 'L',
        Timeline: 'invalid'
      };

      const errors = validateRow(row, 0);
      expect(errors).toContain('Row 2: Timeline must be one of: next month, next quarter, next half, next year, on hold');
    });
  });

  describe('TypeScript Generation', () => {
    test('generates correct TypeScript structure', () => {
      const projects = [{
        'Project Name': 'Leadership',
        Position: '0.15',
        Category: 'Unplanned Work',
        Risk: 'H',
        Complexity: 'L',
        Timeline: 'next month'
      }];

      const result = generateTypescriptData(projects);

      expect(result).toContain('export const projects = [');
      expect(result).toContain("name: 'Leadership'");
      expect(result).toContain('position: 0.15');
      expect(result).toContain("category: 'Unplanned Work'");
      expect(result).toContain("risk: 'H'");
      expect(result).toContain("complexity: 'L'");
      expect(result).toContain("timeline: 'next month' as const");
      expect(result).toContain('] as const;');
    });

    test('generates multiple projects correctly', () => {
      const projects = [
        {
          'Project Name': 'Project A',
          Position: '0.1',
          Category: 'Unplanned Work',
          Risk: 'H',
          Complexity: 'L',
          Timeline: 'next month'
        },
        {
          'Project Name': 'Project B',
          Position: '0.5',
          Category: 'IS Projects',
          Risk: 'M',
          Complexity: 'M',
          Timeline: 'next quarter'
        }
      ];

      const result = generateTypescriptData(projects);

      expect(result).toContain("name: 'Project A'");
      expect(result).toContain("name: 'Project B'");
      expect(result).toContain('position: 0.1');
      expect(result).toContain('position: 0.5');
    });

    test('includes type exports', () => {
      const projects = [{
        'Project Name': 'Test',
        Position: '0.5',
        Category: 'Unplanned Work',
        Risk: 'H',
        Complexity: 'L',
        Timeline: 'next month'
      }];

      const result = generateTypescriptData(projects);

      expect(result).toContain('export type Project = (typeof projects)[number];');
      expect(result).toContain("export type Timeline = (typeof projects)[number]['timeline'];");
    });

    test('includes timeline markers constant', () => {
      const projects = [{
        'Project Name': 'Test',
        Position: '0.5',
        Category: 'Unplanned Work',
        Risk: 'H',
        Complexity: 'L',
        Timeline: 'next month'
      }];

      const result = generateTypescriptData(projects);

      expect(result).toContain('export const timelineMarkers = {');
      expect(result).toContain("'next month': '○'");
      expect(result).toContain("'next quarter': '●'");
      expect(result).toContain("'next half': '△'");
      expect(result).toContain("'next year': '▲'");
      expect(result).toContain("'on hold': '⊗'");
    });

    test('includes project categories constant', () => {
      const projects = [{
        'Project Name': 'Test',
        Position: '0.5',
        Category: 'Unplanned Work',
        Risk: 'H',
        Complexity: 'L',
        Timeline: 'next month'
      }];

      const result = generateTypescriptData(projects);

      expect(result).toContain('export const projectCategories = {');
      expect(result).toContain("'Unplanned Work': 'hsl(var(--destructive))'");
      expect(result).toContain("'IS Projects': 'hsl(var(--primary))'");
      expect(result).toContain("'IT/Business Projects': 'hsl(var(--secondary))'");
      expect(result).toContain("'Business-as-Usual': 'hsl(var(--muted))'");
    });
  });

  describe('Multiple Validation Errors', () => {
    test('collects all validation errors', () => {
      const row = {
        'Project Name': '',
        Position: '5.0',
        Category: 'Invalid',
        Risk: 'X',
        Complexity: 'Y',
        Timeline: 'invalid'
      };

      const errors = validateRow(row, 0);

      expect(errors.length).toBe(6);
      expect(errors).toContain('Row 2: Project Name is required');
      expect(errors).toContain('Row 2: Position must be a number between 0.0 and 1.0');
      expect(errors).toContain('Row 2: Category must be one of: Unplanned Work, IS Projects, IT/Business Projects, Business-as-Usual');
      expect(errors).toContain('Row 2: Risk must be one of: L, M, H');
      expect(errors).toContain('Row 2: Complexity must be one of: L, M, H');
      expect(errors).toContain('Row 2: Timeline must be one of: next month, next quarter, next half, next year, on hold');
    });
  });
});
