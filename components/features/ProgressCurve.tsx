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

export function ProgressCurve() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const [mounted, setMounted] = useState(false);
  const [dimensions, setDimensions] = useState(DEFAULT_DIMENSIONS);
  const [projectPoints, setProjectPoints] = useState<Array<{ x: number; y: number; project: Project }>>([]);
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
    const totalItems = entries.length;
    
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

          <g>
            <text
              x={margin.left}
              y={dimensions.height - margin.bottom + 60}
              className={`${TEXT_SIZES.legend[breakpoint]} font-semibold tracking-tight`}
            >
              Next plateau:
            </text>
            {getLegendLayout().map(({ symbol, label, x, y }, index) => (
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