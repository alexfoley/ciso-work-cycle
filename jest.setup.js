// SPDX-License-Identifier: AGPL-3.0-or-later
// SPDX-FileCopyrightText: 2025 Alex Foley

import '@testing-library/jest-dom'

// Mock IntersectionObserver (used by some UI components)
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
}

// Mock ResizeObserver (used for responsive components)
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
}

// Mock window.matchMedia (for responsive testing)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

// Mock HTMLCanvasElement.getContext (for SVG testing if needed)
HTMLCanvasElement.prototype.getContext = jest.fn()

// Mock SVGPathElement methods that JSDOM doesn't support
// Override createElementNS to add SVG path methods to all path elements
const originalCreateElementNS = document.createElementNS.bind(document)
document.createElementNS = function(namespaceURI, qualifiedName) {
  const element = originalCreateElementNS(namespaceURI, qualifiedName)

  if (qualifiedName === 'path') {
    element.getTotalLength = jest.fn(() => 1000)
    element.getPointAtLength = jest.fn((distance) => {
      const t = distance / 1000 // normalize to 0-1
      return {
        x: 100 + t * 800,
        y: 100 + Math.sin(t * Math.PI) * 200,
      }
    })
  }

  return element
}