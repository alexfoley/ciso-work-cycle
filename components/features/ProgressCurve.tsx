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
    base: 'text-[16px]',
    sm: 'sm:text-[30px]',
    lg: 'lg:text-[42px]',
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
    padding: 4,
    minDistance: 35,
    leaderLineLength: 20
  },
  sm: {
    fontSize: 11,
    padding: 5,
    minDistance: 40,
    leaderLineLength: 25
  },
  lg: {
    fontSize: 12,
    padding: 6,
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

    // Estimate label width (rough approximation: char count * fontSize * 0.6)
    const estimateLabelWidth = (text: string) => text.length * config.fontSize * 0.6;

    // Check if two rectangles overlap
    const rectOverlaps = (r1: { x: number; y: number; width: number; height: number },
                           r2: { x: number; y: number; width: number; height: number }) => {
      return !(r1.x + r1.width < r2.x ||
               r2.x + r2.width < r1.x ||
               r1.y + r1.height < r2.y ||
               r2.y + r2.height < r1.y);
    };

    // Possible label positions relative to point (angle in degrees)
    const labelOffsets = [
      { angle: 0, anchor: 'start' as const },      // Right
      { angle: -45, anchor: 'start' as const },    // Top-right
      { angle: 45, anchor: 'start' as const },     // Bottom-right
      { angle: -90, anchor: 'middle' as const },   // Top
      { angle: 90, anchor: 'middle' as const },    // Bottom
      { angle: 180, anchor: 'end' as const },      // Left
      { angle: -135, anchor: 'end' as const },     // Top-left
      { angle: 135, anchor: 'end' as const },      // Bottom-left
    ];

    projectPoints.forEach(({ x, y, project }) => {
      const labelWidth = estimateLabelWidth(project.name);
      const labelHeight = config.fontSize + config.padding * 2;
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
          y: labelY - labelHeight / 2 - config.padding,
          width: labelWidth + config.padding * 2,
          height: labelHeight + config.padding * 2
        };

        // Check if this position collides with existing labels
        let hasCollision = false;
        for (const [existingName, existingPos] of Array.from(positions.entries())) {
          const existingWidth = estimateLabelWidth(projects.find(p => p.name === existingName)!.name);
          let existingRectX = existingPos.x;
          if (existingPos.anchor === 'middle') existingRectX = existingPos.x - existingWidth / 2;
          else if (existingPos.anchor === 'end') existingRectX = existingPos.x - existingWidth;

          const existingRect = {
            x: existingRectX - config.padding,
            y: existingPos.y - labelHeight / 2 - config.padding,
            width: existingWidth + config.padding * 2,
            height: labelHeight + config.padding * 2
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

      // Fallback: if no good position found, place to the right with leader
      if (!bestPosition) {
        bestPosition = {
          x: x + config.leaderLineLength,
          y: y,
          anchor: 'start',
          showLeader: true,
          leaderEndX: x,
          leaderEndY: y
        };
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
                    stroke="hsl(var(--muted-foreground))"
                    strokeWidth="1"
                    strokeDasharray="2,2"
                    opacity="0.5"
                  />
                )}

                {/* Label background for better readability */}
                <text
                  x={labelPos.x}
                  y={labelPos.y}
                  textAnchor={labelPos.anchor}
                  dominantBaseline="middle"
                  fontSize={config.fontSize}
                  className="font-medium"
                  stroke="white"
                  strokeWidth="3"
                  fill="white"
                  opacity="0.9"
                >
                  {project.name}
                </text>

                {/* Actual label text */}
                <text
                  x={labelPos.x}
                  y={labelPos.y}
                  textAnchor={labelPos.anchor}
                  dominantBaseline="middle"
                  fontSize={config.fontSize}
                  className="font-medium"
                  fill="hsl(var(--foreground))"
                >
                  {project.name}
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
              <rect
                x={0}
                y={0}
                width={TOOLTIP_DIMENSIONS[breakpoint].width}
                height={TOOLTIP_DIMENSIONS[breakpoint].height}
                fill="white"
                stroke="hsl(var(--primary))"
                strokeWidth="1"
                rx="4"
              />
              {getWrappedText(
                hoveredProject.name,
                TOOLTIP_DIMENSIONS[breakpoint].width - TOOLTIP_DIMENSIONS[breakpoint].padding * 2,
                TOOLTIP_DIMENSIONS[breakpoint].titleSize
              ).map((line, i) => (
                <text
                  key={`title-${i}`}
                  x={TOOLTIP_DIMENSIONS[breakpoint].padding}
                  y={TOOLTIP_DIMENSIONS[breakpoint].padding + (i * TOOLTIP_DIMENSIONS[breakpoint].titleSize * 1.2)}
                  className="font-semibold tracking-tight"
                  style={{ fontSize: TOOLTIP_DIMENSIONS[breakpoint].titleSize }}
                >
                  {line}
                </text>
              ))}
              {getWrappedText(
                hoveredProject.category,
                TOOLTIP_DIMENSIONS[breakpoint].width - TOOLTIP_DIMENSIONS[breakpoint].padding * 2,
                TOOLTIP_DIMENSIONS[breakpoint].categorySize
              ).map((line, i) => (
                <text
                  key={`category-${i}`}
                  x={TOOLTIP_DIMENSIONS[breakpoint].padding}
                  y={TOOLTIP_DIMENSIONS[breakpoint].padding +
                     (getWrappedText(hoveredProject.name, TOOLTIP_DIMENSIONS[breakpoint].width - TOOLTIP_DIMENSIONS[breakpoint].padding * 2, TOOLTIP_DIMENSIONS[breakpoint].titleSize).length * TOOLTIP_DIMENSIONS[breakpoint].titleSize * 1.2) +
                     (i * TOOLTIP_DIMENSIONS[breakpoint].categorySize * 1.2)}
                  className="text-muted-foreground"
                  style={{ fontSize: TOOLTIP_DIMENSIONS[breakpoint].categorySize }}
                >
                  {line}
                </text>
              ))}
              <text
                x={TOOLTIP_DIMENSIONS[breakpoint].padding}
                y={TOOLTIP_DIMENSIONS[breakpoint].height - TOOLTIP_DIMENSIONS[breakpoint].padding}
                className="uppercase tracking-wider text-muted-foreground"
                style={{ fontSize: TOOLTIP_DIMENSIONS[breakpoint].metaSize }}
              >
                RISK: {hoveredProject.risk} / COMPLEXITY: {hoveredProject.complexity}
              </text>
            </g>
          )}
        </svg>
      </div>
    </div>
  );
}