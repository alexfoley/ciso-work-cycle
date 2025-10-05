// SPDX-License-Identifier: AGPL-3.0-or-later
// SPDX-FileCopyrightText: 2025 Alex Foley

'use client';

import { useRef, useEffect, useState, useMemo } from 'react';
import { projects, timelineMarkers, type Project } from '@/lib/data';

// Base margins with responsive sizes
const MARGIN = {
  base: { top: 20, right: 20, bottom: 180, left: 40 },
  sm: { top: 30, right: 30, bottom: 160, left: 50 },
  lg: { top: 40, right: 40, bottom: 140, left: 60 }
};

// Text sizes based on viewport
const TEXT_SIZES = {
  marker: {
    base: 'text-[8px]',
    sm: 'sm:text-[15px]',
    lg: 'lg:text-[21px]',
  },
  axis: {
    base: 'text-[10px]',
    sm: 'sm:text-[11px]',
    lg: 'lg:text-[12px]',
  },
  legend: {
    base: 'text-[11px]',
    sm: 'sm:text-[12px]',
    lg: 'lg:text-[14px]',
  },
  legendMarker: {
    base: 'text-[16px]',
    sm: 'sm:text-[25px]',
    lg: 'lg:text-[25px]',
  }
};

const TOOLTIP_DIMENSIONS = {
  base: {
    width: 200,
    height: 80,
    padding: 10,
    titleSize: 12,
    categorySize: 11,
    metaSize: 10,
    offset: { x: 0, y: -20 }
  },
  sm: {
    width: 260,
    height: 90,
    padding: 12,
    titleSize: 13,
    categorySize: 12,
    metaSize: 11,
    offset: { x: 0, y: -15 }
  },
  lg: {
    width: 320,
    height: 100,
    padding: 15,
    titleSize: 15,
    categorySize: 13,
    metaSize: 12,
    offset: { x: 0, y: -10 }
  }
};

const LABEL_CONFIG = {
  base: {
    fontSize: 10,
    padding: 6,  // Increased padding for better spacing
    minDistance: 35,
    leaderLineLength: 20
  },
  sm: {
    fontSize: 11,
    padding: 8,  // Increased padding for better spacing
    minDistance: 40,
    leaderLineLength: 25
  },
  lg: {
    fontSize: 12,
    padding: 10,  // Increased padding for better spacing
    minDistance: 45,
    leaderLineLength: 30
  }
};

const BREAKPOINTS = {
  base: { min: 0, max: 700 },
  sm: { min: 600, max: 1100 },
  lg: { min: 1000, max: Infinity }
};

const xAxisLabels = [
  'Novel',
  'Top of Mind',
  '"Evolving"',
  'Momentum',
  'Maturity'
];

// Default dimensions for server-side rendering
const DEFAULT_DIMENSIONS = {
  width: 1200,
  height: 800
};

interface LabelPosition {
  x: number;
  y: number;
  anchor: 'start' | 'middle' | 'end';
  showLeader: boolean;
  leaderEndX: number;
  leaderEndY: number;
}

export function ProgressCurve() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const [mounted, setMounted] = useState(false);
  const [dimensions, setDimensions] = useState(DEFAULT_DIMENSIONS);
  const [projectPoints, setProjectPoints] = useState<Array<{ x: number; y: number; project: Project }>>([]);
  const [labelPositions, setLabelPositions] = useState<Map<string, LabelPosition>>(new Map());
  const [hoveredProject, setHoveredProject] = useState<Project | null>(null);
  const [breakpoint, setBreakpoint] = useState<'base' | 'sm' | 'lg'>('base');
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const resizeTimeoutRef = useRef<NodeJS.Timeout>();
  const lastWidthRef = useRef<number>(0);
  const lastBreakpointRef = useRef<'base' | 'sm' | 'lg'>('base');

  const getBreakpoint = (width: number): 'base' | 'sm' | 'lg' => {
    const currentBreakpoint = lastBreakpointRef.current;
    const widthDiff = Math.abs(width - lastWidthRef.current);
    
    if (widthDiff < 50 && width >= BREAKPOINTS[currentBreakpoint].min && width <= BREAKPOINTS[currentBreakpoint].max) {
      return currentBreakpoint;
    }

    if (width < BREAKPOINTS.sm.min) return 'base';
    if (width < BREAKPOINTS.lg.min) return 'sm';
    return 'lg';
  };

  const { margin, plotWidth, plotHeight } = useMemo(() => {
    const currentMargin = MARGIN[breakpoint];
    return {
      margin: currentMargin,
      plotWidth: dimensions.width - currentMargin.left - currentMargin.right,
      plotHeight: dimensions.height - currentMargin.top - currentMargin.bottom
    };
  }, [dimensions, breakpoint]);

  const pathString = useMemo(() => `
    M ${margin.left},${margin.top + plotHeight * 0.9}
    C ${margin.left + plotWidth * 0.15},${margin.top + plotHeight * 0.85}
      ${margin.left + plotWidth * 0.2},${margin.top + plotHeight * 0.4}
      ${margin.left + plotWidth * 0.23},${margin.top + plotHeight * 0.2}
    C ${margin.left + plotWidth * 0.25},${margin.top + plotHeight * 0.1}
      ${margin.left + plotWidth * 0.27},${margin.top + plotHeight * 0.05}
      ${margin.left + plotWidth * 0.3},${margin.top + plotHeight * 0.05}
    C ${margin.left + plotWidth * 0.35},${margin.top + plotHeight * 0.05}
      ${margin.left + plotWidth * 0.4},${margin.top + plotHeight * 0.15}
      ${margin.left + plotWidth * 0.5},${margin.top + plotHeight * 0.7}
    C ${margin.left + plotWidth * 0.55},${margin.top + plotHeight * 0.9}
      ${margin.left + plotWidth * 0.65},${margin.top + plotHeight * 0.85}
      ${margin.left + plotWidth * 0.75},${margin.top + plotHeight * 0.8}
    C ${margin.left + plotWidth * 0.85},${margin.top + plotHeight * 0.75}
      ${margin.left + plotWidth * 0.92},${margin.top + plotHeight * 0.73}
      ${margin.left + plotWidth},${margin.top + plotHeight * 0.7}
  `, [margin, plotWidth, plotHeight]);

  const calculateSmartLabelPositions = useMemo(() => {
    const config = LABEL_CONFIG[breakpoint];
    const positions = new Map<string, LabelPosition>();

    // Guard against empty projectPoints
    if (!projectPoints || projectPoints.length === 0) {
      return positions;
    }

    // Wrap text into multiple lines for long labels
    const wrapText = (text: string, maxCharsPerLine: number = 40): string[] => {
      if (text.length <= maxCharsPerLine) return [text];

      const words = text.split(' ');
      const lines: string[] = [];
      let currentLine = '';

      for (const word of words) {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        if (testLine.length <= maxCharsPerLine) {
          currentLine = testLine;
        } else {
          if (currentLine) lines.push(currentLine);
          currentLine = word;
        }
      }
      if (currentLine) lines.push(currentLine);

      return lines;
    };

    // Estimate label width (width of the longest line)
    const estimateLabelWidth = (text: string) => {
      const lines = wrapText(text);
      const maxLineLength = Math.max(...lines.map(line => line.length));
      return maxLineLength * config.fontSize * 0.65;
    };

    // Calculate label height based on number of lines
    const calculateLabelHeight = (text: string) => {
      const lines = wrapText(text);
      const lineHeight = config.fontSize * 1.2; // 1.2 line height
      return lines.length * lineHeight; // No padding - just the text height
    };

    // Check if two rectangles overlap (with minimal buffer for clearer separation)
    const rectOverlaps = (r1: { x: number; y: number; width: number; height: number },
                           r2: { x: number; y: number; width: number; height: number }) => {
      const buffer = 1; // Minimal pixels of separation between labels
      return !(r1.x + r1.width + buffer < r2.x ||
               r2.x + r2.width + buffer < r1.x ||
               r1.y + r1.height + buffer < r2.y ||
               r2.y + r2.height + buffer < r1.y);
    };

    // Sort projects by position on curve to ensure predictable collision detection
    const sortedProjectPoints = [...projectPoints].sort((a, b) => a.project.position - b.project.position);

    sortedProjectPoints.forEach(({ x, y, project }) => {
      // Smart position priorities based on project location on curve
      // Early curve (0-0.33): prefer left positions
      // Top of curve (0.33-0.45): prefer diagonal upward positions (10:30 and 1:30)
      // Descent (0.45-0.7): prefer right/top/bottom
      // Late curve (0.7-1.0): prefer right positions
      const labelOffsets = project.position < 0.33
        ? [
            // Early curve: prioritize left side positions
            { angle: 180, anchor: 'end' as const },      // Left (9 o'clock)
            { angle: -135, anchor: 'end' as const },     // Top-left (10:30)
            { angle: 135, anchor: 'end' as const },      // Bottom-left (7:30)
            { angle: -90, anchor: 'middle' as const },   // Top (12 o'clock)
            { angle: 90, anchor: 'middle' as const },    // Bottom (6 o'clock)
            { angle: 0, anchor: 'start' as const },      // Right (3 o'clock)
            { angle: -45, anchor: 'start' as const },    // Top-right (1:30)
            { angle: 45, anchor: 'start' as const },     // Bottom-right (4:30)
          ]
        : project.position < 0.45
        ? [
            // Top of curve: prioritize diagonal upward positions (avoid straight top for better spacing)
            { angle: -135, anchor: 'end' as const },     // Top-left (10:30) - FIRST PRIORITY
            { angle: -45, anchor: 'start' as const },    // Top-right (1:30)
            { angle: -90, anchor: 'middle' as const },   // Top (12 o'clock)
            { angle: 0, anchor: 'start' as const },      // Right (3 o'clock)
            { angle: 180, anchor: 'end' as const },      // Left (9 o'clock)
            { angle: 90, anchor: 'middle' as const },    // Bottom (6 o'clock)
            { angle: 135, anchor: 'end' as const },      // Bottom-left (7:30)
            { angle: 45, anchor: 'start' as const },     // Bottom-right (4:30)
          ]
        : [
            // Mid/late curve: prefer right side positions
            { angle: 0, anchor: 'start' as const },      // Right (3 o'clock)
            { angle: -45, anchor: 'start' as const },    // Top-right (1:30)
            { angle: 45, anchor: 'start' as const },     // Bottom-right (4:30)
            { angle: -90, anchor: 'middle' as const },   // Top (12 o'clock)
            { angle: 90, anchor: 'middle' as const },    // Bottom (6 o'clock)
            { angle: 180, anchor: 'end' as const },      // Left (9 o'clock)
            { angle: -135, anchor: 'end' as const },     // Top-left (10:30)
            { angle: 135, anchor: 'end' as const },      // Bottom-left (7:30)
          ];

      const labelWidth = estimateLabelWidth(project.name);
      const labelHeight = calculateLabelHeight(project.name);
      let bestPosition: LabelPosition | null = null;

      // Try each offset position until we find one without collisions
      for (const { angle, anchor } of labelOffsets) {
        const radians = (angle * Math.PI) / 180;
        const distance = config.leaderLineLength;
        const labelX = x + Math.cos(radians) * distance;
        const labelY = y + Math.sin(radians) * distance;

        // Calculate label bounding box based on anchor
        let rectX = labelX;
        if (anchor === 'middle') rectX = labelX - labelWidth / 2;
        else if (anchor === 'end') rectX = labelX - labelWidth;

        const candidateRect = {
          x: rectX - config.padding,
          y: labelY - labelHeight / 2 - 2, // Minimal vertical padding (2px)
          width: labelWidth + config.padding * 2,
          height: labelHeight + 4 // Minimal vertical padding (2px top + 2px bottom)
        };

        // Check if this position collides with existing labels
        let hasCollision = false;
        for (const [existingName, existingPos] of Array.from(positions.entries())) {
          const existingProjectName = projects.find(p => p.name === existingName)!.name;
          const existingWidth = estimateLabelWidth(existingProjectName);
          const existingHeight = calculateLabelHeight(existingProjectName);
          let existingRectX = existingPos.x;
          if (existingPos.anchor === 'middle') existingRectX = existingPos.x - existingWidth / 2;
          else if (existingPos.anchor === 'end') existingRectX = existingPos.x - existingWidth;

          const existingRect = {
            x: existingRectX - config.padding,
            y: existingPos.y - existingHeight / 2 - 2, // Minimal vertical padding (2px)
            width: existingWidth + config.padding * 2,
            height: existingHeight + 4 // Minimal vertical padding (2px top + 2px bottom)
          };

          if (rectOverlaps(candidateRect, existingRect)) {
            hasCollision = true;
            break;
          }
        }

        // Also check if label is within bounds
        const inBounds = rectX >= margin.left &&
                        rectX + labelWidth <= dimensions.width - margin.right &&
                        labelY - labelHeight / 2 >= margin.top &&
                        labelY + labelHeight / 2 <= dimensions.height - margin.bottom;

        if (!hasCollision && inBounds) {
          bestPosition = {
            x: labelX,
            y: labelY,
            anchor,
            showLeader: Math.abs(angle) > 10, // Show leader line if not directly to the right
            leaderEndX: x,
            leaderEndY: y
          };
          break;
        }
      }

      // Fallback: if no good position found, try progressively further positions
      if (!bestPosition) {

        // Try horizontal positions first (further right)
        const horizontalDistances = [
          config.leaderLineLength * 1.5,
          config.leaderLineLength * 2,
          config.leaderLineLength * 2.5,
          config.leaderLineLength * 3
        ];

        for (const distance of horizontalDistances) {
          const fallbackX = x + distance;
          const fallbackRect = {
            x: fallbackX - config.padding,
            y: y - labelHeight / 2 - 2, // Minimal vertical padding (2px)
            width: labelWidth + config.padding * 2,
            height: labelHeight + 4 // Minimal vertical padding (2px top + 2px bottom)
          };

          let hasCollision = false;
          for (const [existingName, existingPos] of Array.from(positions.entries())) {
            const existingProjectName = projects.find(p => p.name === existingName)!.name;
            const existingWidth = estimateLabelWidth(existingProjectName);
            const existingHeight = calculateLabelHeight(existingProjectName);
            let existingRectX = existingPos.x;
            if (existingPos.anchor === 'middle') existingRectX = existingPos.x - existingWidth / 2;
            else if (existingPos.anchor === 'end') existingRectX = existingPos.x - existingWidth;

            const existingRect = {
              x: existingRectX - config.padding,
              y: existingPos.y - existingHeight / 2 - 2, // Minimal vertical padding (2px)
              width: existingWidth + config.padding * 2,
              height: existingHeight + 4 // Minimal vertical padding (2px top + 2px bottom)
            };

            if (rectOverlaps(fallbackRect, existingRect)) {
              hasCollision = true;
              break;
            }
          }

          if (!hasCollision) {
            bestPosition = {
              x: fallbackX,
              y: y,
              anchor: 'start',
              showLeader: true,
              leaderEndX: x,
              leaderEndY: y
            };
            break;
          }
        }

        // Try vertical stacking (up and down) if horizontal didn't work
        if (!bestPosition) {
          const verticalOffsets = [
            { offsetY: -config.leaderLineLength * 2, label: 'above' },
            { offsetY: config.leaderLineLength * 2, label: 'below' },
            { offsetY: -config.leaderLineLength * 3, label: 'far above' },
            { offsetY: config.leaderLineLength * 3, label: 'far below' }
          ];

          for (const { offsetY, label: posLabel } of verticalOffsets) {
            const fallbackX = x + config.leaderLineLength;
            const fallbackY = y + offsetY;
            const fallbackRect = {
              x: fallbackX - config.padding,
              y: fallbackY - labelHeight / 2 - 2, // Minimal vertical padding (2px)
              width: labelWidth + config.padding * 2,
              height: labelHeight + 4 // Minimal vertical padding (2px top + 2px bottom)
            };

            // Check bounds first
            const inBounds = fallbackX >= margin.left &&
                            fallbackX + labelWidth <= dimensions.width - margin.right &&
                            fallbackY - labelHeight / 2 >= margin.top &&
                            fallbackY + labelHeight / 2 <= dimensions.height - margin.bottom;

            if (!inBounds) continue;

            let hasCollision = false;
            for (const [existingName, existingPos] of Array.from(positions.entries())) {
              const existingProjectName = projects.find(p => p.name === existingName)!.name;
              const existingWidth = estimateLabelWidth(existingProjectName);
              const existingHeight = calculateLabelHeight(existingProjectName);
              let existingRectX = existingPos.x;
              if (existingPos.anchor === 'middle') existingRectX = existingPos.x - existingWidth / 2;
              else if (existingPos.anchor === 'end') existingRectX = existingPos.x - existingWidth;

              const existingRect = {
                x: existingRectX - config.padding,
                y: existingPos.y - existingHeight / 2 - 2, // Minimal vertical padding (2px)
                width: existingWidth + config.padding * 2,
                height: existingHeight + 4 // Minimal vertical padding (2px top + 2px bottom)
              };

              if (rectOverlaps(fallbackRect, existingRect)) {
                hasCollision = true;
                break;
              }
            }

            if (!hasCollision) {
              bestPosition = {
                x: fallbackX,
                y: fallbackY,
                anchor: 'start',
                showLeader: true,
                leaderEndX: x,
                leaderEndY: y
              };
              break;
            }
          }
        }

        // Ultimate fallback if still no position found (force position, may overlap)
        if (!bestPosition) {
          bestPosition = {
            x: x + config.leaderLineLength * 3,
            y: y,
            anchor: 'start',
            showLeader: true,
            leaderEndX: x,
            leaderEndY: y
          };
        }
      }

      positions.set(project.name, bestPosition);
    });

    return positions;
  }, [projectPoints, breakpoint, dimensions, margin, projects]);

  const gridLines = useMemo(() => {
    const lines = [];
    for (let i = 0; i <= 100; i += 20) {
      const y = margin.top + (plotHeight * (100 - i)) / 100;
      lines.push(
        <line
          key={`grid-${i}`}
          x1={margin.left}
          y1={y}
          x2={margin.left + plotWidth}
          y2={y}
          stroke="#e5e7eb"
          strokeDasharray="4,4"
        />
      );
    }
    return lines;
  }, [margin, plotWidth, plotHeight]);

  // Handle initial mount
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const updateLayout = () => {
      const container = containerRef.current;
      if (!container) return;

      const width = container.clientWidth;
      const newBreakpoint = getBreakpoint(width);
      
      if (Math.abs(width - lastWidthRef.current) > 5 || newBreakpoint !== lastBreakpointRef.current) {
        lastWidthRef.current = width;
        lastBreakpointRef.current = newBreakpoint;
        
        const height = width < BREAKPOINTS.sm.min ? width * 0.8 : width * 0.6;
        
        setBreakpoint(newBreakpoint);
        setDimensions({
          width: Math.round(width),
          height: Math.round(height)
        });
      }
    };

    updateLayout();

    const handleResize = () => {
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
      resizeTimeoutRef.current = setTimeout(updateLayout, 200);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(containerRef.current!);
    
    return () => {
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
      resizeObserver.disconnect();
    };
  }, [mounted]);

  useEffect(() => {
    if (pathRef.current) {
      const pathLength = pathRef.current.getTotalLength();
      const points = projects.map(project => {
        const point = pathRef.current!.getPointAtLength(pathLength * project.position);
        return { x: point.x, y: point.y, project };
      });
      setProjectPoints(points);
    }
  }, [pathString]);

  // Update label positions when smart positions are recalculated
  useEffect(() => {
    setLabelPositions(calculateSmartLabelPositions);
  }, [calculateSmartLabelPositions]);

  const getWrappedText = (text: string, maxWidth: number, fontSize: number) => {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = words[0];
    const charsPerLine = Math.floor(maxWidth / (fontSize * 0.6));

    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      if ((currentLine + ' ' + word).length <= charsPerLine) {
        currentLine += ' ' + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    lines.push(currentLine);
    return lines;
  };

  const calculateTooltipPosition = (point: { x: number; y: number; project: Project }) => {
    const tooltipDims = TOOLTIP_DIMENSIONS[breakpoint];
    const containerWidth = dimensions.width;
    
    let tooltipX = point.x + tooltipDims.offset.x;
    let tooltipY = point.y + tooltipDims.offset.y;

    tooltipX = Math.min(
      Math.max(tooltipX - tooltipDims.width/2, margin.left),
      containerWidth - margin.right - tooltipDims.width
    );

    tooltipY = Math.max(
      tooltipY - tooltipDims.height,
      margin.top
    );

    return { x: tooltipX, y: tooltipY };
  };

  const handleProjectHover = (point: { x: number; y: number; project: Project } | null) => {
    if (!point) {
      setHoveredProject(null);
      return;
    }

    const position = calculateTooltipPosition(point);
    setTooltipPosition(position);
    setHoveredProject(point.project);
  };

  const getLegendLayout = () => {
    const entries = Object.entries(timelineMarkers);

    const layout = {
      base: {
        columns: 2,
        spacing: { x: plotWidth / 2.2, y: 35 },
        startY: dimensions.height - margin.bottom + 80
      },
      sm: {
        columns: 2,
        spacing: { x: plotWidth / 2, y: 35 },
        startY: dimensions.height - margin.bottom + 80
      },
      lg: {
        columns: 5,
        spacing: { x: plotWidth / 5.5, y: 35 },
        startY: dimensions.height - margin.bottom + 80
      }
    }[breakpoint];

    return entries.map(([label, symbol], index) => {
      const col = index % layout.columns;
      const row = Math.floor(index / layout.columns);
      
      return {
        symbol,
        label,
        x: margin.left + (col * layout.spacing.x),
        y: layout.startY + (row * layout.spacing.y)
      };
    });
  };

  // Only render client-side content after mount
  if (!mounted) {
    return (
      <div 
        ref={containerRef}
        className="w-full bg-white p-2 sm:p-4 lg:p-6 rounded-lg border"
        style={{ height: DEFAULT_DIMENSIONS.height }}
      />
    );
  }

  return (
    <div ref={containerRef} className="w-full bg-white p-2 sm:p-4 lg:p-6 rounded-lg border">
      <div 
        className="w-full transition-opacity duration-300"
        style={{ height: dimensions.height }}
      >
        <svg
          viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
          className="w-full h-full"
          preserveAspectRatio="xMidYMin meet"
        >
          {gridLines}

          <text
            x={-plotHeight / 2}
            y={margin.left / 2}
            transform={`rotate(-90)`}
            textAnchor="middle"
            className={`${TEXT_SIZES.axis[breakpoint]} font-medium tracking-tight`}
          >
            Expectations / Visibility
          </text>

          {xAxisLabels.map((label, i) => (
            <text
              key={label}
              x={margin.left + (plotWidth * i) / (xAxisLabels.length - 1)}
              y={dimensions.height - margin.bottom + 30}
              textAnchor="middle"
              className={`${TEXT_SIZES.axis[breakpoint]} font-medium tracking-tight`}
            >
              {label}
            </text>
          ))}

          <path
            ref={pathRef}
            d={pathString}
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="4"
          />

          {[...projectPoints].reverse().map(({ x, y, project }) => (
            <g 
              key={project.name}
              transform={`translate(${x},${y})`}
              onMouseEnter={() => handleProjectHover({ x, y, project })}
              onMouseLeave={() => handleProjectHover(null)}
              style={{ cursor: 'pointer' }}
            >
              <text
                x="0"
                y="0"
                textAnchor="middle"
                dominantBaseline="central"
                className={`${TEXT_SIZES.marker[breakpoint]} font-bold`}
                stroke="white"
                strokeWidth="8"
                fill="white"
              >
                {timelineMarkers[project.timeline]}
              </text>
              
              <text
                x="0"
                y="0"
                textAnchor="middle"
                dominantBaseline="central"
                className={`${TEXT_SIZES.marker[breakpoint]} font-bold`}
                fill="hsl(var(--primary))"
                pointerEvents="none"
              >
                {timelineMarkers[project.timeline]}
              </text>
            </g>
          ))}

          {/* Project Labels with Smart Positioning */}
          {projectPoints.map(({ project }) => {
            const labelPos = labelPositions.get(project.name);
            if (!labelPos) return null;

            const config = LABEL_CONFIG[breakpoint];

            return (
              <g key={`label-${project.name}`}>
                {/* Leader line if label is offset */}
                {labelPos.showLeader && (
                  <line
                    x1={labelPos.leaderEndX}
                    y1={labelPos.leaderEndY}
                    x2={labelPos.x}
                    y2={labelPos.y}
                    stroke="black"
                    strokeWidth="1"
                  />
                )}

                {/* Label background for better readability */}
                <text
                  x={labelPos.x}
                  y={labelPos.y}
                  textAnchor={labelPos.anchor}
                  fontSize={config.fontSize}
                  className="font-medium"
                  stroke="white"
                  strokeWidth="3"
                  fill="white"
                  opacity="0.9"
                >
                  {(() => {
                    const lines = project.name.length > 40 ? (() => {
                      const words = project.name.split(' ');
                      const result: string[] = [];
                      let currentLine = '';
                      for (const word of words) {
                        const testLine = currentLine ? `${currentLine} ${word}` : word;
                        if (testLine.length <= 40) {
                          currentLine = testLine;
                        } else {
                          if (currentLine) result.push(currentLine);
                          currentLine = word;
                        }
                      }
                      if (currentLine) result.push(currentLine);
                      return result;
                    })() : [project.name];

                    const lineHeight = config.fontSize * 1.2;
                    const totalHeight = lines.length * lineHeight;

                    return lines.map((line, i) => (
                      <tspan
                        key={i}
                        x={labelPos.x}
                        y={labelPos.y - (totalHeight / 2) + (i * lineHeight) + (lineHeight / 2)}
                      >
                        {line}
                      </tspan>
                    ));
                  })()}
                </text>

                {/* Actual label text */}
                <text
                  x={labelPos.x}
                  y={labelPos.y}
                  textAnchor={labelPos.anchor}
                  fontSize={config.fontSize}
                  className="font-medium"
                  fill="hsl(var(--foreground))"
                >
                  {(() => {
                    const lines = project.name.length > 40 ? (() => {
                      const words = project.name.split(' ');
                      const result: string[] = [];
                      let currentLine = '';
                      for (const word of words) {
                        const testLine = currentLine ? `${currentLine} ${word}` : word;
                        if (testLine.length <= 40) {
                          currentLine = testLine;
                        } else {
                          if (currentLine) result.push(currentLine);
                          currentLine = word;
                        }
                      }
                      if (currentLine) result.push(currentLine);
                      return result;
                    })() : [project.name];

                    const lineHeight = config.fontSize * 1.2;
                    const totalHeight = lines.length * lineHeight;

                    return lines.map((line, i) => (
                      <tspan
                        key={i}
                        x={labelPos.x}
                        y={labelPos.y - (totalHeight / 2) + (i * lineHeight) + (lineHeight / 2)}
                      >
                        {line}
                      </tspan>
                    ));
                  })()}
                </text>
              </g>
            );
          })}

          <g>
            <text
              x={margin.left}
              y={dimensions.height - margin.bottom + 60}
              className={`${TEXT_SIZES.legend[breakpoint]} font-semibold tracking-tight`}
            >
              Next plateau:
            </text>
            {getLegendLayout().map(({ symbol, label, x, y }) => (
              <g key={label} transform={`translate(${x}, ${y})`}>
                <text
                  className={`${TEXT_SIZES.legendMarker[breakpoint]} font-bold`}
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  {symbol}
                </text>
                <text
                  x={30}
                  className={`${TEXT_SIZES.legend[breakpoint]} font-medium tracking-tight`}
                  dominantBaseline="middle"
                >
                  {label}
                </text>
              </g>
            ))}
          </g>

          {hoveredProject && (
            <g
              transform={`translate(${tooltipPosition.x}, ${tooltipPosition.y})`}
              className="transition-transform duration-150 ease-in-out"
              pointerEvents="none"
            >
              {/* Drop shadow */}
              <rect
                x={2}
                y={2}
                width={TOOLTIP_DIMENSIONS[breakpoint].width}
                height={TOOLTIP_DIMENSIONS[breakpoint].height}
                fill="rgba(0, 0, 0, 0.1)"
                rx="8"
                filter="blur(4px)"
              />

              {/* Main tooltip background */}
              <rect
                x={0}
                y={0}
                width={TOOLTIP_DIMENSIONS[breakpoint].width}
                height={TOOLTIP_DIMENSIONS[breakpoint].height}
                fill="white"
                stroke="hsl(var(--border))"
                strokeWidth="1"
                rx="8"
              />

              {/* Title */}
              {getWrappedText(
                hoveredProject.name,
                TOOLTIP_DIMENSIONS[breakpoint].width - TOOLTIP_DIMENSIONS[breakpoint].padding * 2,
                TOOLTIP_DIMENSIONS[breakpoint].titleSize
              ).map((line, i) => (
                <text
                  key={`title-${i}`}
                  x={TOOLTIP_DIMENSIONS[breakpoint].padding}
                  y={TOOLTIP_DIMENSIONS[breakpoint].padding + (i * TOOLTIP_DIMENSIONS[breakpoint].titleSize * 1.3)}
                  dominantBaseline="hanging"
                  className="font-bold tracking-tight"
                  style={{ fontSize: TOOLTIP_DIMENSIONS[breakpoint].titleSize }}
                  fill="hsl(var(--foreground))"
                >
                  {line}
                </text>
              ))}

              {/* Category */}
              {getWrappedText(
                hoveredProject.category,
                TOOLTIP_DIMENSIONS[breakpoint].width - TOOLTIP_DIMENSIONS[breakpoint].padding * 2,
                TOOLTIP_DIMENSIONS[breakpoint].categorySize
              ).map((line, i) => (
                <text
                  key={`category-${i}`}
                  x={TOOLTIP_DIMENSIONS[breakpoint].padding}
                  y={TOOLTIP_DIMENSIONS[breakpoint].padding +
                     (getWrappedText(hoveredProject.name, TOOLTIP_DIMENSIONS[breakpoint].width - TOOLTIP_DIMENSIONS[breakpoint].padding * 2, TOOLTIP_DIMENSIONS[breakpoint].titleSize).length * TOOLTIP_DIMENSIONS[breakpoint].titleSize * 1.3) +
                     6 +
                     (i * TOOLTIP_DIMENSIONS[breakpoint].categorySize * 1.2)}
                  dominantBaseline="hanging"
                  className="font-medium"
                  style={{ fontSize: TOOLTIP_DIMENSIONS[breakpoint].categorySize }}
                  fill="hsl(var(--muted-foreground))"
                >
                  {line}
                </text>
              ))}

              {/* Risk badge */}
              <rect
                x={TOOLTIP_DIMENSIONS[breakpoint].padding}
                y={TOOLTIP_DIMENSIONS[breakpoint].height - TOOLTIP_DIMENSIONS[breakpoint].padding - 20}
                width={50}
                height={20}
                rx="10"
                fill={hoveredProject.risk === 'H' ? '#fee2e2' : hoveredProject.risk === 'M' ? '#fef3c7' : '#dcfce7'}
              />
              <text
                x={TOOLTIP_DIMENSIONS[breakpoint].padding + 25}
                y={TOOLTIP_DIMENSIONS[breakpoint].height - TOOLTIP_DIMENSIONS[breakpoint].padding - 10}
                textAnchor="middle"
                dominantBaseline="middle"
                className="font-semibold"
                style={{ fontSize: TOOLTIP_DIMENSIONS[breakpoint].metaSize }}
                fill={hoveredProject.risk === 'H' ? '#991b1b' : hoveredProject.risk === 'M' ? '#92400e' : '#166534'}
              >
                Risk: {hoveredProject.risk}
              </text>

              {/* Complexity badge */}
              <rect
                x={TOOLTIP_DIMENSIONS[breakpoint].padding + 56}
                y={TOOLTIP_DIMENSIONS[breakpoint].height - TOOLTIP_DIMENSIONS[breakpoint].padding - 20}
                width={70}
                height={20}
                rx="10"
                fill={hoveredProject.complexity === 'H' ? '#fee2e2' : hoveredProject.complexity === 'M' ? '#fef3c7' : '#dcfce7'}
              />
              <text
                x={TOOLTIP_DIMENSIONS[breakpoint].padding + 91}
                y={TOOLTIP_DIMENSIONS[breakpoint].height - TOOLTIP_DIMENSIONS[breakpoint].padding - 10}
                textAnchor="middle"
                dominantBaseline="middle"
                className="font-semibold"
                style={{ fontSize: TOOLTIP_DIMENSIONS[breakpoint].metaSize }}
                fill={hoveredProject.complexity === 'H' ? '#991b1b' : hoveredProject.complexity === 'M' ? '#92400e' : '#166534'}
              >
                Complex: {hoveredProject.complexity}
              </text>
            </g>
          )}
        </svg>
      </div>
    </div>
  );
}