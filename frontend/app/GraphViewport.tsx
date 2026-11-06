"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

const GRAPH_WIDTH = 1100;

export function GraphViewport({ children }: { children: ReactNode }) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const viewport = viewportRef.current;
    const canvas = canvasRef.current;
    if (!viewport || !canvas) return;

    // Keep the original coordinate system for both the lines and the nodes.
    const observer = new ResizeObserver(() => {
      setScale(canvas.clientWidth / GRAPH_WIDTH);
    });
    observer.observe(canvas);

    // Start on the central branch while keeping every branch reachable by touch.
    viewport.scrollLeft = (viewport.scrollWidth - viewport.clientWidth) / 2;

    return () => observer.disconnect();
  }, []);

  return (
    <div className="@container mx-auto w-full min-w-0 max-w-[1100px]">
      <p className="mb-4 text-xs text-secondary @min-[760px]:hidden">
        Swipe to explore the diagram
      </p>
      <div
        ref={viewportRef}
        role="region"
        aria-label="Aurelia process diagram, scroll horizontally to explore"
        tabIndex={0}
        className="w-full overflow-x-auto overscroll-x-contain rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue"
      >
        <div
          ref={canvasRef}
          className="relative aspect-[1100/520] w-full min-w-[760px] overflow-hidden"
        >
          <div
            className="absolute left-0 top-0 h-[520px] w-[1100px] origin-top-left"
            style={{ transform: `scale(${scale})` }}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
