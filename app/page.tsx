// SPDX-License-Identifier: AGPL-3.0-or-later
// SPDX-FileCopyrightText: 2025 Alex Foley

import { ProgressCurve } from '@/components/features/ProgressCurve';
import { Sidebar } from '@/components/layout/Sidebar';

export default function Home() {
  return (
    <div className="space-y-3 p-2 sm:p-4">
      {/* Title */}
      <div>
        {/*<h2 className="text-lg sm:text-xl lg:text-2xl font-bold tracking-tight">CISO Work Cycle</h2>*/}
        <p className="text-xs sm:text-sm lg:text-base text-muted-foreground">
          Track project progress and implementation phases
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[240px_1fr_240px] gap-2 sm:gap-4">
        {/* Main Content - Always first in the DOM order */}
        <div className="order-first md:col-span-2 lg:col-span-1 lg:order-2">
          <ProgressCurve />
        </div>

        {/* Left Sidebar */}
        <div className="order-2 md:col-span-1 lg:order-1">
          <Sidebar position="left" />
        </div>

        {/* Right Sidebar */}
        <div className="order-3 md:col-span-1 lg:order-3">
          <Sidebar position="right" />
        </div>
      </div>
    </div>
  );
}