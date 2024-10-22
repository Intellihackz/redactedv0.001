"use client"
import { Circle, Lightbulb, Moon, MousePointer, Square, Triangle } from 'lucide-react';
import React, { useState, useRef, useEffect, useCallback } from 'react';

interface Point {
  x: number;
  y: number;
}

interface Shape {
  id: string;
  type: 'rectangle' | 'circle' | 'triangle';
  points: Point[];
  fillColor: string;
  strokeColor: string;
  strokeWidth: number;
  position: Point;
  size: { width: number; height: number };
  radius?: number;
  opacity: number;
}

interface CanvasState {
  offset: Point;
  scale: number;
  isDragging: boolean;
  startPan: Point;
  isDrawing: boolean;
  currentShape: Shape | null;
  selectedShapes: Shape[];
  isResizing: boolean;
  resizeHandle: string | null;
  isMovingShapes: boolean;
  moveStart: Point | null;
  isSelecting: boolean;
  selectionBox: { start: Point; end: Point } | null;
}

type Theme = 'light' | 'dark';

// Component for the floating dock
const FloatingDock: React.FC<{
  selectedTool: string;
  onToolSelect: (tool: string) => void;
}> = ({ selectedTool, onToolSelect }) => (
  <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2 flex gap-2">
    <button
      className={`p-2 rounded ${selectedTool === 'rectangle' ? 'bg-blue-100 dark:bg-blue-900' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
      onClick={() => onToolSelect('rectangle')}
      title="Rectangle (R)"
    >
      <Square className="w-6 h-6 text-gray-800 dark:text-gray-200" />
    </button>

    <button
      className={`p-2 rounded ${selectedTool === 'circle' ? 'bg-blue-100 dark:bg-blue-900' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
      onClick={() => onToolSelect('circle')}
      title="Circle (C)"
    >
      <Circle className="w-6 h-6 text-gray-800 dark:text-gray-200" />
    </button>

    <button
      className={`p-2 rounded ${selectedTool === 'triangle' ? 'bg-blue-100 dark:bg-blue-900' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
      onClick={() => onToolSelect('triangle')}
      title="Triangle (T)"
    >
      <Triangle className="w-6 h-6 text-gray-800 dark:text-gray-200" />
    </button>

    <button
      className={`p-2 rounded ${selectedTool === 'select' ? 'bg-blue-100 dark:bg-blue-900' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
      onClick={() => onToolSelect('select')}
      title="Select (S)"
    >
      <MousePointer className="w-6 h-6 text-gray-800 dark:text-gray-200" />
    </button>
  </div>
);

// Component for the floating sidebar (now on the right with two sections)
const FloatingSidebar: React.FC<{
  shapes: Shape[];
  selectedShapes: Shape[];
  onDeleteShapes: (ids: string[]) => void;
  onEditShape: (id: string, updates: Partial<Shape>) => void;
  onCopyShapes: (ids: string[]) => void;
  onSelectShape: (shape: Shape, isMultiSelect: boolean) => void;
}> = ({ shapes, selectedShapes, onDeleteShapes, onEditShape, onCopyShapes, onSelectShape }) => (
  <div className="fixed right-4 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 w-64 flex flex-col h-3/4">
    {/* Top section: Shape properties */}
    <div className="flex-1 overflow-y-auto mb-4">
      <h3 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300 ">Shape Properties</h3>
      {selectedShapes.map(shape => (
        <div key={shape.id} className="mb-4">
          <span className="text-sm text-gray-600 dark:text-gray-300">{shape.type}</span>
          <div className="mt-2">
            <label className="text-xs text-gray-500 dark:text-gray-400">Fill Color</label>
            <input
              type="color"
              value={shape.fillColor}
              onChange={(e) => onEditShape(shape.id, { fillColor: e.target.value })}
              className="w-full"
            />
          </div>
          <div className="mt-2">
            <label className="text-xs text-gray-500 dark:text-gray-400">Stroke Color</label>
            <input
              type="color"
              value={shape.strokeColor}
              onChange={(e) => onEditShape(shape.id, { strokeColor: e.target.value })}
              className="w-full"
            />
          </div>
          <div className="mt-2">
            <label className="text-xs text-gray-500 dark:text-gray-400">Stroke Width</label>
            <input
              type="range"
              min="1"
              max="10"
              value={shape.strokeWidth}
              onChange={(e) => onEditShape(shape.id, { strokeWidth: Number(e.target.value) })}
              className="w-full"
            />
          </div>
          <div className="mt-2">
            <label className="text-xs text-gray-500 dark:text-gray-400">Width</label>
            <input
              type="number"
              value={shape.size.width}
              onChange={(e) => onEditShape(shape.id, { size: { ...shape.size, width: Number(e.target.value) } })}
              className="w-full bg-gray-100 dark:bg-gray-700 rounded px-2 py-1"
            />
          </div>
          <div className="mt-2">
            <label className="text-xs text-gray-500 dark:text-gray-400">Height</label>
            <input
              type="number"
              value={shape.size.height}
              onChange={(e) => onEditShape(shape.id, { size: { ...shape.size, height: Number(e.target.value) } })}
              className="w-full bg-gray-100 dark:bg-gray-700 rounded px-2 py-1"
            />
          </div>
          {shape.type === 'circle' && (
            <div className="mt-2">
              <label className="text-xs text-gray-500 dark:text-gray-400">Radius</label>
              <input
                type="number"
                value={shape.radius}
                onChange={(e) => onEditShape(shape.id, { radius: Number(e.target.value) })}
                className="w-full bg-gray-100 dark:bg-gray-700 rounded px-2 py-1"
              />
            </div>
          )}
          <div className="mt-2">
            <label className="text-xs text-gray-500 dark:text-gray-400">Opacity</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={shape.opacity}
              onChange={(e) => onEditShape(shape.id, { opacity: Number(e.target.value) })}
              className="w-full"
            />
          </div>
          <div className="flex justify-between mt-2">
            <button
              onClick={() => onCopyShapes([shape.id])}
              className="text-blue-500 hover:text-blue-700 dark:hover:text-blue-400"
            >
              Copy
            </button>
            <button
              onClick={() => onDeleteShapes([shape.id])}
              className="text-red-500 hover:text-red-700 dark:hover:text-red-400"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>

    {/* Bottom section: Layers */}
    <div className="flex-1 overflow-y-auto">
      <h3 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Layers</h3>
      <div className="space-y-2">
        {shapes.map(shape => (
          <div
            key={shape.id}
            className={`flex items-center p-2 rounded cursor-pointer ${selectedShapes.some(s => s.id === shape.id)
              ? 'bg-blue-100 dark:bg-blue-900'
              : 'bg-gray-50 dark:bg-gray-700'
              }`}
            onClick={(e) => onSelectShape(shape, e.ctrlKey || e.metaKey)}
          >
            <span className="text-sm text-gray-600 dark:text-gray-300 flex-grow">{shape.type}</span>
            <div className="w-4 h-4" style={{ backgroundColor: shape.fillColor }}></div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Component for the floating menubar
const FloatingMenubar: React.FC<{
  theme: Theme;
  onThemeToggle: () => void;
  onExport: (format: 'png' | 'jpg') => void;
  hasSelectedShapes: boolean;
}> = ({ theme, onThemeToggle, onExport, hasSelectedShapes }) => (
  <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2 flex gap-4">
    <button className="px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-sm text-gray-700 dark:text-gray-300">File</button>
    <button className="px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-sm text-gray-700 dark:text-gray-300">View</button>
    <div className="relative group">
      <button className="px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-sm text-gray-700 dark:text-gray-300">Share</button>
      {hasSelectedShapes && (
        <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 hidden group-hover:block">
          <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
            <button
              onClick={() => onExport('png')}
              className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
              role="menuitem"
            >
              Export as PNG
            </button>
            <button
              onClick={() => onExport('jpg')}
              className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
              role="menuitem"
            >
              Export as JPG
            </button>
          </div>
        </div>
      )}
    </div>
    <button
      onClick={onThemeToggle}
      className="px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-sm text-gray-700 dark:text-gray-300 flex items-center gap-2"
    >
      {theme === 'light' ? (
       <Lightbulb />
      ) : (
       <Moon />
      )}
      Theme
    </button>
  </div>
);

const InfiniteCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [theme, setTheme] = useState<Theme>('light');
  const [selectedTool, setSelectedTool] = useState<string>('');
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [state, setState] = useState<CanvasState>({
    offset: { x: 0, y: 0 },
    scale: 1,
    isDragging: false,
    startPan: { x: 0, y: 0 },
    isDrawing: false,
    currentShape: null,
    selectedShapes: [],
    isResizing: false,
    resizeHandle: null,
    isMovingShapes: false,
    moveStart: null,
    isSelecting: false,
    selectionBox: null,
  });

  // Theme toggle handler
  const handleThemeToggle = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Shape creation handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 1 || (e.button === 0 && !selectedTool)) {
      setState(prev => ({
        ...prev,
        isDragging: true,
        startPan: { x: e.clientX - prev.offset.x, y: e.clientY - prev.offset.y },
      }));
    } else if (selectedTool && e.button === 0) {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        const x = (e.clientX - rect.left - state.offset.x) / state.scale;
        const y = (e.clientY - rect.top - state.offset.y) / state.scale;

        if (selectedTool === 'select') {
          const clickedShape = shapes.find(shape => isPointInShape({ x, y }, shape));
          if (clickedShape && state.selectedShapes.some(s => s.id === clickedShape.id)) {
            setState(prev => ({
              ...prev,
              isMovingShapes: true,
              moveStart: { x, y }
            }));
          } else {
            setState(prev => ({
              ...prev,
              isSelecting: true,
              selectionBox: { start: { x, y }, end: { x, y } },
              selectedShapes: e.ctrlKey || e.metaKey ? prev.selectedShapes : []
            }));
          }
        } else {
          const newShape: Shape = {
            id: Date.now().toString(),
            type: selectedTool as Shape['type'],
            points: [{ x, y }],
            fillColor: theme === 'light' ? '#000000' : '#FFFFFF',
            strokeColor: theme === 'light' ? '#000000' : '#FFFFFF',
            strokeWidth: 2,
            position: { x, y },
            size: { width: 0, height: 0 },
            opacity: 1,
          };

          setState(prev => ({ ...prev, isDrawing: true, currentShape: newShape }));
        }
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      const x = (e.clientX - rect.left - state.offset.x) / state.scale;
      const y = (e.clientY - rect.top - state.offset.y) / state.scale;

      if (state.isDragging) {
        setState(prev => ({
          ...prev,
          offset: {
            x: e.clientX - prev.startPan.x,
            y: e.clientY - prev.startPan.y,
          },
        }));
      } else if (state.isDrawing && state.currentShape) {
        setState(prev => ({
          ...prev,
          currentShape: {
            ...prev.currentShape!,
            points: [...prev.currentShape!.points, { x, y }],
            size: {
              width: x - prev.currentShape!.position.x,
              height: y - prev.currentShape!.position.y,
            },
          },
        }));
      } else if (state.isSelecting && state.selectionBox) {
        setState(prev => ({
          ...prev,
          selectionBox: { ...prev.selectionBox!, end: { x, y } }
        }));
      } else if (state.isMovingShapes && state.moveStart) {
        const dx = x - state.moveStart.x;
        const dy = y - state.moveStart.y;
        setShapes(prev => prev.map(shape =>
          state.selectedShapes.some(s => s.id === shape.id)
            ? {
              ...shape,
              position: {
                x: shape.position.x + dx,
                y: shape.position.y + dy
              }
            }
            : shape
        ));
        setState(prev => ({
          ...prev,
          moveStart: { x, y },
          selectedShapes: prev.selectedShapes.map(shape => ({
            ...shape,
            position: {
              x: shape.position.x + dx,
              y: shape.position.y + dy
            }
          }))
        }));
      }
    }
  };

  const handleMouseUp = () => {
    if (state.isDrawing && state.currentShape) {
      setShapes(prev => [...prev, state.currentShape!]);
    } else if (state.isSelecting && state.selectionBox) {
      const selectedShapes = shapes.filter(shape =>
        isShapeInSelectionBox(shape, state.selectionBox!)
      );
      setState(prev => ({
        ...prev,
        selectedShapes: [...prev.selectedShapes, ...selectedShapes],
        isSelecting: false,
        selectionBox: null
      }));
    }
    setState(prev => ({
      ...prev,
      isDragging: false,
      isDrawing: false,
      currentShape: null,
      isResizing: false,
      resizeHandle: null,
      isMovingShapes: false,
      moveStart: null,
      isSelecting: false,
    }));
  };

  const isPointInShape = (point: Point, shape: Shape) => {
    return (
      point.x >= shape.position.x &&
      point.x <= shape.position.x + shape.size.width &&
      point.y >= shape.position.y &&
      point.y <= shape.position.y + shape.size.height
    );
  };

  const isShapeInSelectionBox = (shape: Shape, selectionBox: { start: Point; end: Point }) => {
    const { start, end } = selectionBox;
    const minX = Math.min(start.x, end.x);
    const maxX = Math.max(start.x, end.x);
    const minY = Math.min(start.y, end.y);
    const maxY = Math.max(start.y, end.y);

    return (
      shape.position.x >= minX &&
      shape.position.x + shape.size.width <= maxX &&
      shape.position.y >= minY &&
      shape.position.y + shape.size.height <= maxY
    );
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setState(prev => ({
      ...prev,
      scale: Math.min(Math.max(0.1, prev.scale * delta), 5),
    }));
  };

  const handleDeleteShapes = (ids: string[]) => {
    setShapes(prev => prev.filter(shape => !ids.includes(shape.id)));
    setState(prev => ({ ...prev, selectedShapes: [] }));
  };

  const handleEditShape = (id: string, updates: Partial<Shape>) => {
    setShapes(prev => prev.map(shape =>
      shape.id === id ? { ...shape, ...updates } : shape
    ));
  };

  const handleCopyShapes = (ids: string[]) => {
    const shapesToCopy = shapes.filter(shape => ids.includes(shape.id));
    const newShapes = shapesToCopy.map(shape => ({
      ...shape,
      id: Date.now().toString(),
      position: {
        x: shape.position.x + 20,
        y: shape.position.y + 20,
      },
    }));
    setShapes(prev => [...prev, ...newShapes]);
  };

  const handleSelectShape = (shape: Shape, isMultiSelect: boolean) => {
    setState(prev => ({
      ...prev,
      selectedShapes: isMultiSelect
        ? [...prev.selectedShapes, shape]
        : [shape]
    }));
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    switch (e.key) {
      case 'r':
        setSelectedTool('rectangle');
        break;
      case 'c':
        setSelectedTool('circle');
        break;
      case 't':
        setSelectedTool('triangle');
        break;
      case 's':
        setSelectedTool('select');
        break;
      case 'Delete':
        handleDeleteShapes(state.selectedShapes.map(s => s.id));
        break;
      case 'Escape':
        setState(prev => ({ ...prev, selectedShapes: [] }));
        break;
    }
  }, [state.selectedShapes]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener('wheel', handleWheel as never, { passive: false });
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      if (canvas) {
        canvas.removeEventListener('wheel', handleWheel as never);
      }
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  // Apply theme to document and update shape colors
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    setShapes(prev => prev.map(shape => ({
      ...shape,
      strokeColor: theme === 'light' ? '#FFFFFF' : '#000000',
      fillColor: theme === 'light' ? '#000000' : '#FFFFFF'
    })));
  }, [theme]);

  // Determine cursor style based on current state and selected tool
  const getCursorStyle = () => {
    if (state.isDragging) return 'grabbing';
    if (state.isMovingShapes) return 'move';
    if (state.isResizing) return 'nwse-resize';
    if (selectedTool === 'select') return 'default';
    if (selectedTool) return 'crosshair';
    return 'grab';
  };

  const handleExport = (format: 'png' | 'jpg') => {
    if (state.selectedShapes.length === 0) return;

    // Create a new SVG element for export
    const exportSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");

    // Calculate the bounding box of selected shapes
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    state.selectedShapes.forEach(shape => {
      minX = Math.min(minX, shape.position.x);
      minY = Math.min(minY, shape.position.y);
      maxX = Math.max(maxX, shape.position.x + shape.size.width);
      maxY = Math.max(maxY, shape.position.y + shape.size.height);
    });

    // Set the viewBox and size of the export SVG
    const width = maxX - minX;
    const height = maxY - minY;
    exportSvg.setAttribute('viewBox', `${minX} ${minY} ${width} ${height}`);
    exportSvg.setAttribute('width', width.toString());
    exportSvg.setAttribute('height', height.toString());

    // Set the background color based on the current theme
    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute('x', minX.toString());
    rect.setAttribute('y', minY.toString());
    rect.setAttribute('width', width.toString());
    rect.setAttribute('height', height.toString());
    rect.setAttribute('fill', theme === 'light' ? '#F3F4F6' : '#111827');
    exportSvg.appendChild(rect);

    // Add selected shapes to the export SVG
    state.selectedShapes.forEach(shape => {
      let element;
      if (shape.type === 'circle') {
        element = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        element.setAttribute('cx', (shape.position.x + shape.size.width / 2).toString());
        element.setAttribute('cy', (shape.position.y + shape.size.height / 2).toString());
        element.setAttribute('r', (Math.min(shape.size.width, shape.size.height) / 2).toString());
      } else if (shape.type === 'triangle') {
        element = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
        const points = `${shape.position.x},${shape.position.y + shape.size.height} ${shape.position.x + shape.size.width / 2},${shape.position.y} ${shape.position.x + shape.size.width},${shape.position.y + shape.size.height}`;
        element.setAttribute('points', points);
      } else {
        element = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        element.setAttribute('x', shape.position.x.toString());
        element.setAttribute('y', shape.position.y.toString());
        element.setAttribute('width', shape.size.width.toString());
        element.setAttribute('height', shape.size.height.toString());
      }
      element.setAttribute('stroke', shape.strokeColor);
      element.setAttribute('stroke-width', shape.strokeWidth.toString());
      element.setAttribute('fill', 'none');
      exportSvg.appendChild(element);
    });

    // Convert SVG to data URL
    const svgData = new XMLSerializer().serializeToString(exportSvg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const dataUrl = canvas.toDataURL(`image/${format}`);
      const link = document.createElement('a');
      link.download = `export.${format}`;
      link.href = dataUrl;
      link.click();
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    if (state.selectedShapes.length > 0) {
      // Show context menu with export options
      // For simplicity, we'll just show an alert here
      const format = window.confirm('Export as PNG? Click OK for PNG, Cancel for JPG') ? 'png' : 'jpg';
      handleExport(format);
    }
  };

  return (
    <div className={`w-screen h-screen overflow-hidden ${theme === 'light' ? 'bg-gray-100' : 'bg-gray-900'}`}>
      <div
        ref={canvasRef}
        className="w-full h-full"
        style={{ cursor: getCursorStyle() }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onContextMenu={handleContextMenu}
      >
        <svg
          style={{
            transform: `translate(${state.offset.x}px, ${state.offset.y}px) scale(${state.scale})`,
            transformOrigin: '0 0',
          }}
          className="absolute"
          width="2000"
          height="2000"
        >
          {/* Grid pattern */}
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="1" fill={theme === 'light' ? 'gray' : 'white'} />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Render shapes */}
          {shapes.map(shape => {
            if (shape.type === 'circle') {
              return (
                <circle
                  key={shape.id}
                  cx={shape.position.x + shape.size.width / 2}
                  cy={shape.position.y + shape.size.height / 2}
                  r={Math.min(shape.size.width, shape.size.height) / 2}
                  stroke={shape.strokeColor}
                  strokeWidth={shape.strokeWidth}
                  fill={shape.fillColor}
                />
              );
            } else if (shape.type === 'triangle') {
              const points = `${shape.position.x},${shape.position.y + shape.size.height} ${shape.position.x + shape.size.width / 2},${shape.position.y} ${shape.position.x + shape.size.width},${shape.position.y + shape.size.height}`;
              return (
                <polygon
                  key={shape.id}
                  points={points}
                  stroke={shape.strokeColor}
                  strokeWidth={shape.strokeWidth}
                  fill={shape.fillColor}
                />
              );
            } else {
              return (
                <rect
                  key={shape.id}
                  x={shape.position.x}
                  y={shape.position.y}
                  width={shape.size.width}
                  height={shape.size.height}
                  stroke={shape.strokeColor}
                  strokeWidth={shape.strokeWidth}
                  fill={shape.fillColor}
                />
              );
            }
          })}
          {state.currentShape && (
            <rect
              x={state.currentShape.position.x}
              y={state.currentShape.position.y}
              width={state.currentShape.size.width}
              height={state.currentShape.size.height}
              stroke={state.currentShape.strokeColor}
              strokeWidth={state.currentShape.strokeWidth}
              fill={state.currentShape.fillColor}
            />
          )}
          {state.selectedShapes.map(shape => (
            <rect
              key={`selection-${shape.id}`}
              x={shape.position.x - 5}
              y={shape.position.y - 5}
              width={shape.size.width + 10}
              height={shape.size.height + 10}
              stroke="blue"
              strokeWidth="2"
              fill="none"
              strokeDasharray="5,5"
            />
          ))}
          {state.selectionBox && (
            <rect
              x={Math.min(state.selectionBox.start.x, state.selectionBox.end.x)}
              y={Math.min(state.selectionBox.start.y, state.selectionBox.end.y)}
              width={Math.abs(state.selectionBox.end.x - state.selectionBox.start.x)}
              height={Math.abs(state.selectionBox.end.y - state.selectionBox.start.y)}
              stroke="blue"
              strokeWidth="1"
              fill="blue"
              fillOpacity="0.1"
            />
          )}
        </svg>
      </div>

      {/* Floating UI components */}
      <FloatingMenubar
        theme={theme}
        onThemeToggle={handleThemeToggle}
        onExport={handleExport}
        hasSelectedShapes={state.selectedShapes.length > 0}
      />
      <FloatingSidebar
        shapes={shapes}
        selectedShapes={state.selectedShapes}
        onDeleteShapes={handleDeleteShapes}
        onEditShape={handleEditShape}
        onCopyShapes={handleCopyShapes}
        onSelectShape={handleSelectShape}
      />
      <FloatingDock selectedTool={selectedTool} onToolSelect={setSelectedTool} />
    </div>
  );
};

export default InfiniteCanvas;