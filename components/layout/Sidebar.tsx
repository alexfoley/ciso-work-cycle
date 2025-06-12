'use client';

import { Shield, Briefcase, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { projects, type Project } from '@/lib/data';

interface SidebarProps {
  position: 'left' | 'right';
}

export function Sidebar({ position }: SidebarProps) {
  const categoriesToShow = position === 'left' 
    ? ['Unplanned Work', 'IS Projects']
    : ['IT/Business Projects', 'Business-as-Usual'];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Unplanned Work':
        return AlertTriangle;
      case 'IS Projects':
        return Shield;
      default:
        return Briefcase;
    }
  };

  const filteredProjects = projects.filter(project => 
    categoriesToShow.includes(project.category)
  );

  const groupedProjects = categoriesToShow.map(category => ({
    name: category,
    icon: getCategoryIcon(category),
    projects: filteredProjects.filter(project => project.category === category)
  }));

  return (
    <div className={cn(
      "bg-background rounded-lg border",
      "h-auto lg:h-[calc(100vh-8rem)]",
      "overflow-y-auto",
      "p-2 sm:p-3 lg:p-4"
    )}>
      <div className="space-y-3 sm:space-y-4 lg:space-y-6">
        {groupedProjects.map((category) => (
          <div key={category.name} className="space-y-1.5 sm:space-y-2 lg:space-y-3">
            <div className="flex items-center gap-2 sm:gap-2.5 lg:gap-3 p-1">
              <category.icon className="h-4 w-4 sm:h-4.5 sm:w-4.5 lg:h-5 lg:w-5 flex-shrink-0" />
              <span className="text-xs sm:text-sm lg:text-base font-semibold tracking-tight">{category.name}</span>
            </div>
            <div className="space-y-2 pl-4 sm:pl-5 lg:pl-6">
              {category.projects.map((project) => (
                <div key={project.name} className="space-y-0.5">
                  <div className="text-[11px] sm:text-xs lg:text-sm font-medium leading-tight">{project.name}</div>
                  <div className="text-[9px] sm:text-[10px] lg:text-[11px] uppercase tracking-wider text-muted-foreground">
                    RISK: {project.risk} / COMPLEXITY: {project.complexity}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}