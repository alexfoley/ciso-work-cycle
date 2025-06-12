// Project data with relative positions (0-1 along the curve)
export const projects = [
  {
    name: 'Leadership',
    position: 0.15,
    category: 'Unplanned Work',
    risk: 'H',
    complexity: 'L',
    timeline: 'next month' as const
  },
  {
    name: 'Cyber Transformation',
    position: 0.25,
    category: 'IS Projects',
    risk: 'H',
    complexity: 'H',
    timeline: 'on hold' as const
  },
  {
    name: 'LOB Support Model',
    position: 0.32,
    category: 'IS Projects',
    risk: 'L',
    complexity: 'L',
    timeline: 'next half' as const
  },
  {
    name: 'Microsoft 365',
    position: 0.4,
    category: 'IT/Business Projects',
    risk: 'H',
    complexity: 'H',
    timeline: 'next year' as const
  },
  {
    name: 'Cloud Operating Model',
    position: 0.55,
    category: 'Unplanned Work',
    risk: 'H',
    complexity: 'H',
    timeline: 'next quarter' as const
  },
  {
    name: 'New Data Center',
    position: 0.75,
    category: 'IT/Business Projects',
    risk: 'H',
    complexity: 'H',
    timeline: 'next year' as const
  },
  {
    name: 'Issue Management Program',
    position: 0.85,
    category: 'IT/Business Projects',
    risk: 'H',
    complexity: 'H',
    timeline: 'next year' as const
  },
  {
    name: 'Sector / Government Engagements',
    position: 0.45,
    category: 'Business-as-Usual',
    risk: 'M',
    complexity: 'M',
    timeline: 'next quarter' as const
  },
  {
    name: 'Regulatory Engagement / Assessment',
    position: 0.35,
    category: 'Business-as-Usual',
    risk: 'M',
    complexity: 'H',
    timeline: 'next half' as const
  },
  {
    name: 'Vulnerability Management',
    position: 0.65,
    category: 'Business-as-Usual',
    risk: 'M',
    complexity: 'M',
    timeline: 'next quarter' as const
  }
] as const;

export type Project = (typeof projects)[number];
export type Timeline = (typeof projects)[number]['timeline'];

// Timeline markers for the curve
export const timelineMarkers = {
  'next month': '○',
  'next quarter': '●',
  'next half': '△',
  'next year': '▲',
  'on hold': '⊗'
} as const;