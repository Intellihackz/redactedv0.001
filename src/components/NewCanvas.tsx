/* eslint-disable */
"use client"
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Brush, Square, Circle, ChevronUp, ChevronDown, MousePointer2, Eye, EyeOff, Trash2, Layers, Settings, Eraser, ZoomIn, ZoomOut, Maximize, Copy, Clipboard, X, Download, Upload, Save, FolderOpen, Type, PenTool, Pencil, Edit3, Hexagon, Triangle, Octagon, Disc, Aperture, Image as ImageIcon } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { v4 as uuidv4 } from 'uuid';
import { wallet } from '@/utils/near-wallet';
import Modal from '@/components/Modal';
import { useHotkeys } from 'react-hotkeys-hook';
import { useRouter } from 'next/navigation';
import ToolBar from './ToolBar';
import TopMenuBar from './TopMenuBar';
import { debounce } from 'lodash';
import dynamic from 'next/dynamic';
import { saveAs } from 'file-saver';
import { Input } from "@/components/ui/input";
import ExportModal from './ExportModal';
import SaveModal from './SaveModal';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

interface Shape {
    id: string;
    tool: string;
    points?: { x: number; y: number }[];
    color: string;
    strokeWidth: number;
    startX?: number;
    startY?: number;
    width?: number;
    height?: number;
    isVisible: boolean;
    rectangleBorderRadius?: number;
    rectangleFill?: string;
    rectangleBorderColor?: string;
    rectangleBorderWidth?: number;
    rectangleOpacity?: number;
    rectangleRotation?: number;
    circleOpacity?: number;
    circleFill?: string;
    circleBorderColor?: string;
    circleBorderWidth?: number;
    circleRotation?: number;
    isSelected?: boolean;
    zIndex: number;
    text?: string;
    fontSize?: number;
    fontFamily?: string;
    subTool?: string;
    name?: string;
    imageUrl?: string;
}

const InfiniteCanvas2: React.FC = () => {
    const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
    const [selectedTool, setSelectedTool] = useState<string>('pointer');
    const [selectedSubTool, setSelectedSubTool] = useState<string | null>(null);
    const [isPropertiesOpen, setIsPropertiesOpen] = useState<boolean>(true);
    const [isLayersOpen, setIsLayersOpen] = useState<boolean>(true);
    const [shapes, setShapes] = useState<Shape[]>([]);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [selectedShapeId, setSelectedShapeId] = useState<string | null>(null);
    const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
    const [selectedShape, setSelectedShape] = useState<Shape | null>(null);
    const [isResizing, setIsResizing] = useState(false);
    const [resizeHandle, setResizeHandle] = useState<string | null>(null);
    const [isMoving, setIsMoving] = useState(false);
    const [moveStartX, setMoveStartX] = useState(0);
    const [moveStartY, setMoveStartY] = useState(0);
    const [isSignedIn, setIsSignedIn] = useState(false);
    const [accountId, setAccountId] = useState('');
    const [isSelecting, setIsSelecting] = useState(false);
    const [selectionStart, setSelectionStart] = useState<{ x: number; y: number } | null>(null);
    const [selectionEnd, setSelectionEnd] = useState<{ x: number; y: number } | null>(null);
    const selectionBoxRef = useRef<HTMLDivElement>(null);
    const [selectedShapes, setSelectedShapes] = useState<Shape[]>([]);
    const [eraserSize, setEraserSize] = useState<number>(20);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState<React.ReactNode>('');
    const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [isPanning, setIsPanning] = useState(false);
    const [isMinting, setIsMinting] = useState(false);
    const [zoomLevel, setZoomLevel] = useState(100);
    const [modalType, setModalType] = useState<'action' | 'info'>('info');
    const router = useRouter();
    const [canvasKey, setCanvasKey] = useState(Date.now());
    const [copiedShapes, setCopiedShapes] = useState<Shape[]>([]);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [confirmModalContent, setConfirmModalContent] = useState<React.ReactNode>(null);
    const [confirmModalAction, setConfirmModalAction] = useState<() => void>(() => { });
    const [exportFileName, setExportFileName] = useState('');
    const [saveFileName, setSaveFileName] = useState('');
    const [isExportModalOpen, setIsExportModalOpen] = useState(false);
    const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
    const [isAddingText, setIsAddingText] = useState(false);
    const [textInputPosition, setTextInputPosition] = useState<{ x: number; y: number } | null>(null);
    const [isEditingLayerName, setIsEditingLayerName] = useState<string | null>(null);

    const tools = [
        { id: 'pointer', icon: MousePointer2, tooltip: 'Click, move and resize items on the canvas (P)', hotkey: 'P' },
        { id: 'brush', icon: Brush, tooltip: 'Draw freely on the canvas (B)', hotkey: 'B' },
        { id: 'rectangle', icon: Square, tooltip: 'Input rectangle shape on canvas (R)', hotkey: 'R' },
        { id: 'circle', icon: Circle, tooltip: 'Input circle shape on canvas (C)', hotkey: 'C' },
        { id: 'eraser', icon: Eraser, tooltip: 'Clean canvas (E)', hotkey: 'E' },
        { id: 'text', icon: Type, tooltip: 'Add text to the canvas (T)', hotkey: 'T' },
        { id: 'image', icon: ImageIcon, tooltip: 'Add image to the canvas (I)', hotkey: 'I' },
    ];

    const subToolIcons = {
        pencil: Pencil,
        pen: PenTool,
        marker: Edit3,
        rectangle: Square,
        square: Square,
        parallelogram: Hexagon,
        trapezoid: Triangle,
        rhombus: Octagon,
        circle: Circle,
        ellipse: Circle,
        semicircle: Disc,
        oval: Circle,
        arc: Aperture,
    };

    const handleToolSelect = useCallback((toolId: string, subToolId?: string) => {
        console.log("Selected tool:", toolId, "Sub-tool:", subToolId);
        setSelectedTool(toolId);
        setSelectedSubTool(subToolId || null);
    }, []);

    useEffect(() => {
        const updateCanvasSize = () => {
            setCanvasSize({ width: window.innerWidth, height: window.innerHeight });
        };

        updateCanvasSize();
        window.addEventListener('resize', updateCanvasSize);

        return () => window.removeEventListener('resize', updateCanvasSize);
    }, []);

    useEffect(() => {
        const initWallet = async () => {
            if (wallet) {
                const signedIn = await wallet.startUp();
                setIsSignedIn(signedIn);
                if (signedIn) {
                    setAccountId(wallet.getAccountId());
                    showModal(`Welcome back, ${wallet.getAccountId()}!`);
                }
            }
        };

        initWallet();
    }, []);

    // Add these new functions
    const saveCanvasState = useCallback(
        debounce(() => {
            console.log('Saving canvas state:', shapes);
            localStorage.setItem('canvasData', JSON.stringify(shapes));
        }, 500),
        [shapes]
    );

    const loadCanvasState = useCallback(() => {
        const savedData = localStorage.getItem('canvasData');
        if (savedData) {
            const parsedData = JSON.parse(savedData);
            console.log('Loading canvas state:', parsedData);
            setShapes(parsedData);
            setCanvasKey(Date.now()); // Force re-render of canvas
        }
    }, []);

    // Add this useEffect to load the canvas state when the component mounts
    useEffect(() => {
        loadCanvasState();
    }, [loadCanvasState]);

    // Modify this useEffect to save the canvas state whenever shapes change
    useEffect(() => {
        if (shapes.length > 0) {
            saveCanvasState();
        }
    }, [shapes, saveCanvasState]);

    const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (e.button === 1 || (e.button === 0 && e.altKey)) {
            setIsPanning(true);
            setMoveStartX(e.clientX);
            setMoveStartY(e.clientY);
            return;
        }
        if (e.target !== e.currentTarget) return;

        const canvas = canvasRef.current;
        if (canvas) {
            const rect = canvas.getBoundingClientRect();
            const x = (e.clientX - rect.left - panOffset.x) / zoom;
            const y = (e.clientY - rect.top - panOffset.y) / zoom;

            if (selectedTool === 'text') {
                setTextInputPosition({ x, y });
                setIsAddingText(true);
                return; // Exit the function early for text tool
            }

            if (selectedTool === 'pointer') {
                const clickedShapes = shapes.filter(shape => {
                    if (shape.tool === 'brush' && shape.points) {
                        return shape.points.some(point => {
                            return x >= point.x && x <= point.x + shape.strokeWidth && y >= point.y && y <= point.y + shape.strokeWidth;
                        });
                    } else if ((shape.tool === 'rectangle' || shape.tool === 'circle' || shape.tool === 'image') && 
                               shape.startX !== undefined && shape.startY !== undefined && 
                               shape.width !== undefined && shape.height !== undefined) {
                        return x >= shape.startX && x <= shape.startX + shape.width && 
                               y >= shape.startY && y <= shape.startY + shape.height;
                    } else if (shape.tool === 'text' && shape.startX !== undefined && shape.startY !== undefined && shape.fontSize !== undefined) {
                        // Check if the click is within the text bounding box
                        const canvas = canvasRef.current;
                        if (canvas) {
                            const ctx = canvas.getContext('2d');
                            if (ctx) {
                                const textWidth = ctx.measureText(shape.text || '').width;
                                const textHeight = shape.fontSize;
                                return x >= shape.startX && x <= shape.startX + textWidth &&
                                    y >= shape.startY - textHeight && y <= shape.startY;
                            }
                        }
                        return false;
                    }
                    return false;
                }).sort((a, b) => b.zIndex - a.zIndex);

                if (clickedShapes.length > 0) {
                    const topShape = clickedShapes[0];
                    const resizeHandleCursor = isPointInResizeHandle(x, y, topShape);

                    if (resizeHandleCursor) {
                        setIsResizing(true);
                        setResizeHandle(resizeHandleCursor);
                        setSelectedShape(topShape);
                    } else {
                        handleShapeSelect(topShape.id, e.shiftKey);
                        setIsMoving(true);
                    }

                    setMoveStartX(x);
                    setMoveStartY(y);
                } else {
                    // Clicked outside any shape, deselect all
                    setSelectedShapes([]);
                    setSelectedShape(null);
                    setSelectedShapeId(null);

                    // Start multi-select
                    setIsSelecting(true);
                    setSelectionStart({ x, y });
                    setSelectionEnd({ x, y });
                }
            } else {
                // Deselect all when switching to a drawing tool
                setSelectedShapes([]);
                setSelectedShape(null);

                setIsDrawing(true);

                switch (selectedTool) {
                    case 'brush':
                        // Start drawing
                        const newShape: Shape = {
                            id: uuidv4(),
                            tool: 'brush',
                            points: [{ x, y }],
                            color: '#000000',
                            strokeWidth: 2,
                            isVisible: true,
                            isSelected: false,
                            zIndex: shapes.length, // Set zIndex to the current number of shapes
                        };
                        setShapes([...shapes, newShape]);
                        break;
                    case 'rectangle':
                        // Start drawing rectangle
                        const newRect: Shape = {
                            id: uuidv4(),
                            tool: 'rectangle',
                            subTool: selectedSubTool || 'rectangle',
                            startX: x,
                            startY: y,
                            width: 0,
                            height: 0,
                            color: '#ffffff',
                            strokeWidth: 1,
                            isVisible: true,
                            isSelected: false,
                            rectangleBorderColor: '#000000',
                            rectangleBorderRadius: 0,
                            rectangleOpacity: 100,
                            rectangleRotation: 0,
                            zIndex: shapes.length, // Set zIndex to the current number of shapes
                        };
                        setShapes([...shapes, newRect]);
                        break;
                    case 'circle':
                        // Start drawing circle
                        const newCircle: Shape = {
                            id: uuidv4(),
                            tool: 'circle',
                            subTool: selectedSubTool || 'circle',
                            startX: x,
                            startY: y,
                            width: 0,
                            height: 0,
                            color: '#ffffff',
                            strokeWidth: 1,
                            isVisible: true,
                            isSelected: false,
                            circleBorderColor: '#000000',
                            circleOpacity: 100,
                            circleRotation: 0,
                            zIndex: shapes.length, // Set zIndex to the current number of shapes
                        };
                        setShapes([...shapes, newCircle]);
                        break;
                    case 'eraser':
                        // Implement eraser logic
                        break;
                }
            }
        }
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (isPanning) {
            const dx = e.clientX - moveStartX;
            const dy = e.clientY - moveStartY;
            setPanOffset(prev => ({
                x: prev.x + dx,
                y: prev.y + dy
            }));
            setMoveStartX(e.clientX);
            setMoveStartY(e.clientY);
            return;
        }
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left - panOffset.x) / zoom;
        const y = (e.clientY - rect.top - panOffset.y) / zoom;

        if (isSelecting) {
            setSelectionEnd({ x, y });
        } else if (isMoving && selectedShapes.length > 0) {
            const dx = x - moveStartX;
            const dy = y - moveStartY;

            setShapes(prevShapes => prevShapes.map(shape =>
                selectedShapes.some(s => s.id === shape.id)
                    ? {
                        ...shape,
                        startX: (shape.startX || 0) + dx,
                        startY: (shape.startY || 0) + dy,
                        points: shape.points?.map(point => ({ x: point.x + dx, y: point.y + dy }))
                    }
                    : shape
            ));

            setSelectedShapes(prev => prev.map(shape => ({
                ...shape,
                startX: (shape.startX || 0) + dx,
                startY: (shape.startY || 0) + dy,
                points: shape.points?.map(point => ({ x: point.x + dx, y: point.y + dy }))
            })));

            setMoveStartX(x);
            setMoveStartY(y);
        } else if (isDrawing) {
            if (selectedTool === 'eraser') {
                // Eraser logic
                setShapes(prevShapes => prevShapes.map(shape => {
                    if (shape.tool === 'brush' && shape.points) {
                        // For brush strokes, remove points within eraser range
                        const newPoints = shape.points.filter(point => {
                            const distance = Math.sqrt((point.x - x) ** 2 + (point.y - y) ** 2);
                            return distance > eraserSize / 2;
                        });
                        return newPoints.length > 0 ? { ...shape, points: newPoints } : null;
                    } else if ((shape.tool === 'rectangle' || shape.tool === 'circle') &&
                        shape.startX !== undefined && shape.startY !== undefined &&
                        shape.width !== undefined && shape.height !== undefined) {
                        // For rectangles and circles, check if eraser touches them
                        const shapeLeft = shape.startX;
                        const shapeRight = shape.startX + shape.width;
                        const shapeTop = shape.startY;
                        const shapeBottom = shape.startY + shape.height;

                        if (x >= shapeLeft - eraserSize / 2 && x <= shapeRight + eraserSize / 2 &&
                            y >= shapeTop - eraserSize / 2 && y <= shapeBottom + eraserSize / 2) {
                            return null; // Erase the shape
                        }
                    }
                    return shape;
                }).filter(Boolean) as Shape[]); // Remove null values (erased shapes)
            } else {
                // Existing drawing logic for other tools
                const updatedShapes = [...shapes];
                const currentShape = updatedShapes[updatedShapes.length - 1];

                switch (selectedTool) {
                    case 'brush':
                        if (currentShape.points) {
                            currentShape.points.push({ x, y });
                        }
                        break;
                    case 'rectangle':
                    case 'circle':
                        if (currentShape.startX !== undefined && currentShape.startY !== undefined) {
                            currentShape.width = x - currentShape.startX;
                            currentShape.height = y - currentShape.startY;
                        }
                        break;
                }

                setShapes(updatedShapes);
            }
        }
    };

    const handleMouseUp = () => {
        if (isSelecting) {
            const newSelectedShapes = shapes.filter(shape => isShapeInSelection(shape));
            setSelectedShapes(prev => [...prev, ...newSelectedShapes]);
            setIsSelecting(false);
            setSelectionStart(null);
            setSelectionEnd(null);
        }
        setIsDrawing(false);
        setIsResizing(false);
        setIsMoving(false);
        setResizeHandle(null);
        setIsPanning(false);
        // Save the canvas state after any changes
        saveCanvasState();
    };

    const handleShapeSelect = (id: string, isMultiSelect: boolean = false) => {
        setShapes(prevShapes => prevShapes.map(shape => ({
            ...shape,
            isSelected: isMultiSelect ? (shape.id === id ? !shape.isSelected : shape.isSelected) : shape.id === id
        })));

        setSelectedShapes(prev => {
            const shape = shapes.find(s => s.id === id);
            if (shape) {
                if (isMultiSelect) {
                    const isAlreadySelected = prev.some(s => s.id === id);
                    if (isAlreadySelected) {
                        return prev.filter(s => s.id !== id);
                    } else {
                        return [...prev, shape];
                    }
                } else {
                    return [shape];
                }
            }
            return prev;
        });

        setSelectedShapeId(id);
        setSelectedShape(shapes.find(s => s.id === id) || null);
    };

    const handleShapeVisibilityToggle = (id: string) => {
        setShapes(shapes.map(shape =>
            shape.id === id ? { ...shape, isVisible: !shape.isVisible } : shape
        ));
    };

    const handleShapeDelete = (id: string) => {
        setShapes(prevShapes => {
            const newShapes = prevShapes.filter(shape => shape.id !== id);
            // Save the canvas state after deleting a shape
            saveCanvasState();
            return newShapes;
        });
        if (selectedShapeId === id) {
            setSelectedShapeId(null);
        }
    };

    const handlePropertyChange = (property: 'color' | 'strokeWidth', value: string | number) => {
        if (selectedShapeId) {
            setShapes(shapes.map(shape =>
                shape.id === selectedShapeId ? { ...shape, [property]: value } : shape
            ));
        }
    };

    const handleTextUpdate = (newText: string) => {
        if (selectedShape && selectedShape.tool === 'text') {
            handleSelectedShapePropertyChange('text', newText);
        }
    };

    const handleSelectedShapePropertyChange = (property: keyof Shape, value: any) => {
        if (selectedShape) {
            const updatedShape = { ...selectedShape, [property]: value };
            setShapes(shapes.map(shape => shape.id === selectedShape.id ? updatedShape : shape));
            setSelectedShape(updatedShape);
        }
    };

    const drawBackgroundDots = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
        const dotSpacing = 20; // Adjust this value to change the spacing between dots
        const dotRadius = 1; // Adjust this value to change the size of the dots

        ctx.fillStyle = isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)';

        const startX = Math.floor(-panOffset.x / zoom / dotSpacing) * dotSpacing;
        const startY = Math.floor(-panOffset.y / zoom / dotSpacing) * dotSpacing;
        const endX = startX + width + dotSpacing;
        const endY = startY + height + dotSpacing;

        for (let x = startX; x < endX; x += dotSpacing) {
            for (let y = startY; y < endY; y += dotSpacing) {
                ctx.beginPath();
                ctx.arc(x, y, dotRadius, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    };

    const drawShape = (ctx: CanvasRenderingContext2D, shape: Shape, isExporting: boolean = false) => {
        if (!shape.isVisible) return;

        ctx.fillStyle = shape.color;
        ctx.strokeStyle = shape.rectangleBorderColor || shape.circleBorderColor || shape.color;
        ctx.lineWidth = shape.strokeWidth;

        if (shape.tool === 'brush' && shape.points) {
            ctx.beginPath();
            ctx.moveTo(shape.points[0].x, shape.points[0].y);
            shape.points.forEach(point => {
                ctx.lineTo(point.x, point.y);
            });
            ctx.stroke();
        } else if (shape.tool === 'rectangle' && shape.startX !== undefined && shape.startY !== undefined && shape.width !== undefined && shape.height !== undefined) {
            ctx.beginPath();
            ctx.globalAlpha = (shape.rectangleOpacity || 100) / 100;

            switch (shape.subTool) {
                case 'rectangle':
                    ctx.rect(shape.startX, shape.startY, shape.width, shape.height);
                    break;
                case 'square':
                    const size = Math.min(Math.abs(shape.width), Math.abs(shape.height));
                    ctx.rect(shape.startX, shape.startY, size * Math.sign(shape.width), size * Math.sign(shape.height));
                    break;
                case 'parallelogram':
                    ctx.moveTo(shape.startX + shape.width * 0.2, shape.startY);
                    ctx.lineTo(shape.startX + shape.width, shape.startY);
                    ctx.lineTo(shape.startX + shape.width * 0.8, shape.startY + shape.height);
                    ctx.lineTo(shape.startX, shape.startY + shape.height);
                    ctx.closePath();
                    break;
                case 'trapezoid':
                    ctx.moveTo(shape.startX + shape.width * 0.2, shape.startY);
                    ctx.lineTo(shape.startX + shape.width * 0.8, shape.startY);
                    ctx.lineTo(shape.startX + shape.width, shape.startY + shape.height);
                    ctx.lineTo(shape.startX, shape.startY + shape.height);
                    ctx.closePath();
                    break;
                case 'rhombus':
                    ctx.moveTo(shape.startX + shape.width / 2, shape.startY);
                    ctx.lineTo(shape.startX + shape.width, shape.startY + shape.height / 2);
                    ctx.lineTo(shape.startX + shape.width / 2, shape.startY + shape.height);
                    ctx.lineTo(shape.startX, shape.startY + shape.height / 2);
                    ctx.closePath();
                    break;
                default:
                    ctx.rect(shape.startX, shape.startY, shape.width, shape.height);
            }

            ctx.fill();
            ctx.stroke();
            ctx.globalAlpha = 1;
        } else if (shape.tool === 'circle' && shape.startX !== undefined && shape.startY !== undefined && shape.width !== undefined && shape.height !== undefined) {
            ctx.beginPath();
            ctx.globalAlpha = (shape.circleOpacity || 100) / 100;

            const centerX = shape.startX + shape.width / 2;
            const centerY = shape.startY + shape.height / 2;
            const radiusX = Math.abs(shape.width / 2);
            const radiusY = Math.abs(shape.height / 2);

            switch (shape.subTool) {
                case 'circle':
                    ctx.arc(centerX, centerY, Math.min(radiusX, radiusY), 0, 2 * Math.PI);
                    break;
                case 'ellipse':
                    ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI);
                    break;
                case 'semicircle':
                    ctx.arc(centerX, centerY, Math.min(radiusX, radiusY), 0, Math.PI);
                    ctx.lineTo(shape.startX, centerY);
                    ctx.closePath();
                    break;
                case 'oval':
                    const controlX = radiusX * 0.5522848;
                    const controlY = radiusY * 0.5522848;
                    ctx.moveTo(centerX - radiusX, centerY);
                    ctx.bezierCurveTo(centerX - radiusX, centerY - controlY, centerX - controlX, centerY - radiusY, centerX, centerY - radiusY);
                    ctx.bezierCurveTo(centerX + controlX, centerY - radiusY, centerX + radiusX, centerY - controlY, centerX + radiusX, centerY);
                    ctx.bezierCurveTo(centerX + radiusX, centerY + controlY, centerX + controlX, centerY + radiusY, centerX, centerY + radiusY);
                    ctx.bezierCurveTo(centerX - controlX, centerY + radiusY, centerX - radiusX, centerY + controlY, centerX - radiusX, centerY);
                    break;
                case 'arc':
                    ctx.arc(centerX, centerY, Math.min(radiusX, radiusY), 0, Math.PI * 1.5);
                    break;
                default:
                    ctx.arc(centerX, centerY, Math.min(radiusX, radiusY), 0, 2 * Math.PI);
            }

            ctx.fill();
            ctx.stroke();
            ctx.globalAlpha = 1;
        } else if (shape.tool === 'text' && shape.text && shape.startX !== undefined && shape.startY !== undefined) {
            ctx.font = `${shape.fontSize}px ${shape.fontFamily}`;
            ctx.fillStyle = shape.color;
            ctx.fillText(shape.text, shape.startX, shape.startY);

            // Draw selection box for text if it's selected
            if (!isExporting && selectedShapes.find(s => s.id === shape.id)) {
                const textWidth = ctx.measureText(shape.text).width;
                const textHeight = shape.fontSize || 16; // Use default font size if not specified
                ctx.strokeStyle = '#00FFFF';
                ctx.lineWidth = 2;
                ctx.setLineDash([5, 5]);
                ctx.strokeRect(shape.startX - 2, shape.startY - textHeight - 2, textWidth + 4, textHeight + 4);
                ctx.setLineDash([]);
            }
        } else if (shape.tool === 'image' && shape.imageUrl && shape.startX !== undefined && shape.startY !== undefined && shape.width !== undefined && shape.height !== undefined) {
            const img = new Image();
            img.src = shape.imageUrl;
            ctx.drawImage(img, shape.startX, shape.startY, shape.width, shape.height);
            
            // Draw selection box if selected and not exporting
            if (!isExporting && selectedShapes.find(s => s.id === shape.id)) {
                ctx.strokeStyle = '#00FFFF';
                ctx.lineWidth = 2;
                ctx.setLineDash([5, 5]);
                ctx.strokeRect(shape.startX - 5, shape.startY - 5, shape.width + 10, shape.height + 10);
                ctx.setLineDash([]);
            }
        }

        // Only draw selection highlight if not exporting
        if (!isExporting && selectedShapes.find(s => s.id === shape.id)) {
            ctx.strokeStyle = '#00FFFF';
            ctx.lineWidth = 2;
            ctx.setLineDash([5, 5]);
            if (shape.tool === 'brush' && shape.points) {
                ctx.beginPath();
                ctx.moveTo(shape.points[0].x, shape.points[0].y);
                shape.points.forEach(point => {
                    ctx.lineTo(point.x, point.y);
                });
                ctx.stroke();
            } else if (shape.startX !== undefined && shape.startY !== undefined && shape.width !== undefined && shape.height !== undefined) {
                ctx.strokeRect(shape.startX - 5, shape.startY - 5, shape.width + 10, shape.height + 10);
            }
            ctx.setLineDash([]);
        }

        // Remove the eraser cursor visualization
        // The following code block has been removed:
        // if (!isExporting && selectedTool === 'eraser') {
        //     ctx.beginPath();
        //     ctx.arc(shape.startX || 0, shape.startY || 0, eraserSize / 2, 0, 2 * Math.PI);
        //     ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)';
        //     ctx.stroke();
        // }
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                ctx.save();
                ctx.translate(panOffset.x, panOffset.y);
                ctx.scale(zoom, zoom);

                // Draw background dots
                drawBackgroundDots(ctx, canvas.width / zoom, canvas.height / zoom);

                // Preload all images
                const imagePromises = shapes
                    .filter(shape => shape.tool === 'image' && shape.imageUrl)
                    .map(shape => new Promise((resolve, reject) => {
                            const img = new Image();
                        img.onload = resolve;
                        img.onerror = reject;
                        img.src = shape.imageUrl!;
                    }));

                Promise.all(imagePromises).then(() => {
                    // Draw all shapes after images are loaded
                    shapes.forEach(shape => drawShape(ctx, shape));
                ctx.restore();
                });
            }
        }
    }, [shapes, selectedShapes, selectedShape, panOffset, zoom, isDarkMode]);

    const handleSignIn = () => {
        console.log("Signing in");
        wallet?.signIn();
    };

    const handleSignOut = () => {
        if (wallet) {
            wallet.signOut().then(() => {
                setIsSignedIn(false);
                setAccountId('');
                showModal("You have been signed out successfully.");
            }).catch((error: Error) => {
                console.error("Sign out failed:", error);
                showModal("Sign out failed. Please try again.");
            });
        }
    };

    const isShapeInSelection = (shape: Shape): boolean => {
        if (!selectionStart || !selectionEnd) return false;

        const left = Math.min(selectionStart.x, selectionEnd.x);
        const right = Math.max(selectionStart.x, selectionEnd.x);
        const top = Math.min(selectionStart.y, selectionEnd.y);
        const bottom = Math.max(selectionStart.y, selectionEnd.y);

        if (shape.tool === 'brush' && shape.points) {
            return shape.points.some(point =>
                point.x >= left && point.x <= right && point.y >= top && point.y <= bottom
            );
        } else if (shape.startX !== undefined && shape.startY !== undefined && shape.width !== undefined && shape.height !== undefined) {
            const shapeLeft = shape.startX;
            const shapeRight = shape.startX + shape.width;
            const shapeTop = shape.startY;
            const shapeBottom = shape.startY + shape.height;

            return (
                (shapeLeft <= right && shapeRight >= left) &&
                (shapeTop <= bottom && shapeBottom >= top)
            );
        } else if (shape.tool === 'text' && shape.startX !== undefined && shape.startY !== undefined && shape.fontSize !== undefined && shape.text) {
            const canvas = canvasRef.current;
            if (canvas) {
                const ctx = canvas.getContext('2d');
                if (ctx) {
                    ctx.font = `${shape.fontSize}px ${shape.fontFamily || 'Arial'}`;
                    const textWidth = ctx.measureText(shape.text).width;
                    const textHeight = shape.fontSize;
                    const shapeLeft = shape.startX;
                    const shapeRight = shape.startX + textWidth;
                    const shapeTop = shape.startY - textHeight;
                    const shapeBottom = shape.startY;

                    return (
                        (shapeLeft <= right && shapeRight >= left) &&
                        (shapeTop <= bottom && shapeBottom >= top)
                    );
                }
            }
        }

        return false;
    };

    useEffect(() => {
        if (selectionBoxRef.current && selectionStart && selectionEnd) {
            const canvas = canvasRef.current;
            if (canvas) {
                const rect = canvas.getBoundingClientRect();
                const left = Math.min(selectionStart.x, selectionEnd.x) * zoom + panOffset.x + rect.left;
                const top = Math.min(selectionStart.y, selectionEnd.y) * zoom + panOffset.y + rect.top;
                const width = Math.abs(selectionEnd.x - selectionStart.x) * zoom;
                const height = Math.abs(selectionEnd.y - selectionStart.y) * zoom;

                selectionBoxRef.current.style.left = `${left}px`;
                selectionBoxRef.current.style.top = `${top}px`;
                selectionBoxRef.current.style.width = `${width}px`;
                selectionBoxRef.current.style.height = `${height}px`;
                selectionBoxRef.current.style.display = 'block';
            }
        } else if (selectionBoxRef.current) {
            selectionBoxRef.current.style.display = 'none';
        }
    }, [selectionStart, selectionEnd, zoom, panOffset]);

    const showModal = (content: React.ReactNode) => {
        setModalContent(content);
        setModalType('info');
        setIsModalOpen(true);
    };

    const showConfirmModal = (content: React.ReactNode, action: () => void) => {
        setConfirmModalContent(content);
        setConfirmModalAction(() => action);
        setIsConfirmModalOpen(true);
    };

    const showExportModal = () => {
        if (selectedShapes.length === 0) {
            showModal("No shapes selected. Please select shapes to export.");
            return;
        }
        setIsExportModalOpen(true);
    };

    const showSaveModal = () => {
        if (!isSignedIn) {
            showModal("Please connect your NEAR wallet to save the canvas.");
            return;
        }
        setIsSaveModalOpen(true);
    };

    const handleExport = (fileName: string) => {
        if (!fileName) {
            showModal("Please enter a file name.");
            return;
        }

        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        if (!tempCtx) return;

        // Calculate the bounding box of selected shapes
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        selectedShapes.forEach(shape => {
            if (shape.startX !== undefined && shape.startY !== undefined) {
                minX = Math.min(minX, shape.startX);
                minY = Math.min(minY, shape.startY);
                maxX = Math.max(maxX, shape.startX + (shape.width || 0));
                maxY = Math.max(maxY, shape.startY + (shape.height || 0));
            }
            if (shape.points) {
                shape.points.forEach(point => {
                    minX = Math.min(minX, point.x);
                    minY = Math.min(minY, point.y);
                    maxX = Math.max(maxX, point.x);
                    maxY = Math.max(maxY, point.y);
                });
            }
        });

        // Set the temp canvas size to the bounding box
        tempCanvas.width = maxX - minX;
        tempCanvas.height = maxY - minY;

        // Draw selected shapes on the temp canvas
        selectedShapes.forEach(shape => {
            drawShape(tempCtx, {
                ...shape,
                startX: shape.startX ? shape.startX - minX : undefined,
                startY: shape.startY ? shape.startY - minY : undefined,
                points: shape.points ? shape.points.map(p => ({ x: p.x - minX, y: p.y - minY })) : undefined,
            }, true);  // Pass true for isExporting
        });

        const dataUrl = tempCanvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `${fileName}.png`;
        link.href = dataUrl;
        link.click();

        setIsExportModalOpen(false);
    };

    const handleSaveCanvasState = (fileName: string) => {
        if (!isSignedIn) {
            showModal("Please connect your NEAR wallet to save the canvas.");
            return;
        }
        if (!fileName) {
            showModal("Please enter a file name.");
            return;
        }
        const canvasState = JSON.stringify(shapes);
        const blob = new Blob([canvasState], { type: 'application/json' });
        saveAs(blob, `${fileName}.nex`);
        showModal('Canvas state saved successfully.');
        setIsSaveModalOpen(false);
        saveCanvasState(); // Call the debounced function to save to localStorage
    };

    const handleMint = () => {
        if (!isSignedIn) {
            showModal("Please connect your NEAR wallet to mint.");
            return;
        }
        if (selectedShapes.length === 0) {
            showModal("No shapes selected. Please select shapes to mint as an NFT.");
            return;
        }
        setIsMinting(true);
        setModalType('action');
        setModalContent(
            <MintForm
                onMint={mintNFT}
                onClose={() => {
                    setIsModalOpen(false);
                    setIsMinting(false);
                }}
            />
        );
        setIsModalOpen(true);
    };

    const mintNFT = async (title: string, description: string) => {
        if (!title || !description) {
            showModal("Please provide a title and description for your NFT.");
            return;
        }

        setIsMinting(true);
        setModalType('info');
        showModal("Minting your NFT...");

        try {
            // Convert selected shapes to image
            const imageDataUrl = await convertSelectionToImage();

            // Generate a unique token ID
            const tokenId = `nft-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

            // Prepare metadata
            const metadata = {
                title: title,
                description: description,
                media: imageDataUrl,
            };

            // Call the mintNFT method from the wallet
            const result = await wallet?.callMethod({
                method: 'nft_mint',
                args: {
                    token_id: tokenId,
                    metadata: metadata,
                    receiver_id: wallet?.getAccountId(),
                },
                deposit: '700000000000000000000000',
            });

            router.push(`/?transactionHashes=${result.transaction.hash}`);
        } catch (error: unknown) {
            console.error('Error minting NFT:', error);
            if (error instanceof Error) {
                showModal(`Error minting NFT: ${error.message}`);
            } else {
                showModal(`An unknown error occurred while minting the NFT.`);
            }
        } finally {
            setIsMinting(false);
        }
    };

    const convertSelectionToImage = (): Promise<string> => {
        return new Promise((resolve, reject) => {
            const tempCanvas = document.createElement('canvas');
            const tempCtx = tempCanvas.getContext('2d');
            if (!tempCtx) {
                reject(new Error('Unable to create canvas context'));
                return;
            }

            // Calculate the bounding box of selected shapes
            let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
            selectedShapes.forEach(shape => {
                if (shape.startX !== undefined && shape.startY !== undefined) {
                    minX = Math.min(minX, shape.startX);
                    minY = Math.min(minY, shape.startY);
                    maxX = Math.max(maxX, shape.startX + (shape.width || 0));
                    maxY = Math.max(maxY, shape.startY + (shape.height || 0));
                }
                if (shape.points) {
                    shape.points.forEach(point => {
                        minX = Math.min(minX, point.x);
                        minY = Math.min(minY, point.y);
                        maxX = Math.max(maxX, point.x);
                        maxY = Math.max(maxY, point.y);
                    });
                }
            });

            // Set the temp canvas size to the bounding box
            tempCanvas.width = maxX - minX;
            tempCanvas.height = maxY - minY;

            // Draw selected shapes on the temp canvas
            selectedShapes.forEach(shape => {
                drawShape(tempCtx, {
                    ...shape,
                    startX: shape.startX ? shape.startX - minX : undefined,
                    startY: shape.startY ? shape.startY - minY : undefined,
                    points: shape.points ? shape.points.map(p => ({ x: p.x - minX, y: p.y - minY })) : undefined,
                }, true);
            });

            // Convert the temp canvas to a data URL
            const dataUrl = tempCanvas.toDataURL('image/png');
            resolve(dataUrl);
        });
    };

    const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
        e.preventDefault();
        const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
        const newZoom = Math.min(Math.max(zoom * zoomFactor, 0.1), 5);
        setZoom(newZoom);
        setZoomLevel(Math.round(newZoom * 100));
    };

    const handleZoomIn = () => {
        const newZoom = Math.min(zoom * 1.1, 5);
        setZoom(newZoom);
        setZoomLevel(Math.round(newZoom * 100));
    };

    const handleZoomOut = () => {
        const newZoom = Math.max(zoom * 0.9, 0.1);
        setZoom(newZoom);
        setZoomLevel(Math.round(newZoom * 100));
    };

    const handleResetZoom = () => {
        setZoom(1);
        setZoomLevel(100);
    };

    const handleCopy = useCallback(() => {
        const shapesToCopy = shapes.filter(shape => shape.isSelected);
        setCopiedShapes(shapesToCopy);
    }, [shapes]);

    const handlePaste = useCallback(() => {
        if (copiedShapes.length > 0) {
            const newShapes = copiedShapes.map((shape: Shape) => ({
                ...shape,
                id: uuidv4(),
                startX: (shape.startX || 0) + 20,
                startY: (shape.startY || 0) + 20,
                points: shape.points?.map((point: { x: number; y: number }) => ({ x: point.x + 20, y: point.y + 20 })),
                isSelected: false,
                zIndex: shapes.length + 1,
            }));
            setShapes([...shapes, ...newShapes]);
        }
    }, [copiedShapes, shapes]);

    // Add these new functions
    const handleToolHotkey = (toolId: string) => {
        setSelectedTool(toolId);
    };

    const handleDeleteSelected = () => {
        if (selectedShapes.length === 0) return;

        const selectedShapeIds = new Set(selectedShapes.map(shape => shape.id));
        const updatedShapes = shapes.filter(shape => !selectedShapeIds.has(shape.id));
        setShapes(updatedShapes);
        setSelectedShapes([]);
        setSelectedShape(null);
        setSelectedShapeId(null);
        saveCanvasState();
    };

    const handleHideSelected = () => {
        const updatedShapes = shapes.map(shape =>
            shape.isSelected ? { ...shape, isVisible: !shape.isVisible } : shape
        );
        setShapes(updatedShapes);
    };

    const handleMoveSelected = (dx: number, dy: number) => {
        const updatedShapes = shapes.map(shape =>
            shape.isSelected ? {
                ...shape,
                startX: (shape.startX || 0) + dx,
                startY: (shape.startY || 0) + dy,
                points: shape.points?.map(point => ({ x: point.x + dx, y: point.y + dy }))
            } : shape
        );
        setShapes(updatedShapes);
    };

    // Use the useHotkeys hook for handling hotkeys
    useHotkeys('p', () => handleToolHotkey('pointer'), []);
    useHotkeys('b', () => handleToolHotkey('brush'), []);
    useHotkeys('r', () => handleToolHotkey('rectangle'), []);
    useHotkeys('c', () => handleToolHotkey('circle'), []);
    useHotkeys('e', () => handleToolHotkey('eraser'), []);
    useHotkeys(['delete', 'backspace'], (event) => {
        event.preventDefault();
        handleDeleteSelected();
    }, { enableOnFormTags: true }, [shapes, selectedShapes]);
    useHotkeys('h', handleHideSelected, [shapes]);
    useHotkeys('up', () => handleMoveSelected(0, -1), [shapes]);
    useHotkeys('down', () => handleMoveSelected(0, 1), [shapes]);
    useHotkeys('left', () => handleMoveSelected(-1, 0), [shapes]);
    useHotkeys('right', () => handleMoveSelected(1, 0), [shapes]);

    // Add this new hotkey handler for the text tool
    useHotkeys('t', () => handleToolSelect('text'), [handleToolSelect]);

    const handleSelectAll = () => {
        const allShapes = shapes.map(shape => ({ ...shape, isSelected: true }));
        setShapes(allShapes);
        setSelectedShapes(allShapes);
    };

    // Update the existing useEffect hook for keyboard events
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.ctrlKey || e.metaKey) {
                switch (e.key.toLowerCase()) {
                    case 'c':
                        e.preventDefault();
                        handleCopy();
                        break;
                    case 'v':
                        e.preventDefault();
                        handlePaste();
                        break;
                    case 'a':
                        e.preventDefault();
                        handleSelectAll();
                        break;
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleCopy, handlePaste, handleSelectAll]);

    const handleLayerNameChange = (id: string, newName: string) => {
        setShapes(shapes.map(shape =>
            shape.id === id ? { ...shape, name: newName } : shape
        ));
        setIsEditingLayerName(null);
    };

    const onDragEnd = (result: any) => {
        if (!result.destination) {
            return;
        }

        const items = Array.from(shapes);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        // Reverse the order of items because we display layers from top to bottom
        const reversedItems = items.reverse();

        // Update zIndex for all shapes
        const updatedShapes = reversedItems.map((shape, index) => ({
            ...shape,
            zIndex: index
        }));

        setShapes(updatedShapes);
    };
    // Add this function near the other rendering functions
    const renderPropertiesPanel = () => {
        if (selectedShape) {
            switch (selectedShape.tool) {
                case 'brush':
                    return (
                        <>
                            <div className="mb-2">
                                <label className="text-sm font-medium">Brush Color</label>
                                <input
                                    type="color"
                                    className="block mt-1 w-full h-8 bg-white dark:bg-gray-700"
                                    value={selectedShape.color}
                                    onChange={(e) => handleSelectedShapePropertyChange('color', e.target.value)}
                                />
                            </div>
                            <div className="mb-2">
                                <label className="text-sm font-medium">Brush Size</label>
                                <input
                                    type="number"
                                    className="block mt-1 w-full text-black border border-gray-300 rounded-md p-2"
                                    min="1"
                                    max="50"
                                    value={selectedShape.strokeWidth}
                                    onChange={(e) => handleSelectedShapePropertyChange('strokeWidth', parseInt(e.target.value))}
                                />
                            </div>
                        </>
                    );
                case 'rectangle':
                case 'circle':
                    return (
                        <>
                            <div className="mb-2">
                                <label className="text-sm font-medium">Fill Color</label>
                                <input
                                    type="color"
                                    className="block mt-1 w-full h-8"
                                    value={selectedShape.color}
                                    onChange={(e) => handleSelectedShapePropertyChange('color', e.target.value)}
                                />
                            </div>
                            <div className="mb-2">
                                <label className="text-sm font-medium">Border Color</label>
                                <input
                                    type="color"
                                    className="block mt-1 w-full h-8"
                                    value={selectedShape.rectangleBorderColor || selectedShape.circleBorderColor || '#000000'}
                                    onChange={(e) => handleSelectedShapePropertyChange(selectedShape.tool === 'rectangle' ? 'rectangleBorderColor' : 'circleBorderColor', e.target.value)}
                                />
                            </div>
                            <div className="mb-2">
                                <label className="text-sm font-medium">Border Width</label>
                                <input
                                    type="number"
                                    className="block mt-1 w-full text-black border border-gray-300 rounded-md p-2"
                                    min="0"
                                    max="20"
                                    value={selectedShape.strokeWidth}
                                    onChange={(e) => handleSelectedShapePropertyChange('strokeWidth', parseInt(e.target.value))}
                                />
                            </div>
                            <div className="mb-2">
                                <label className="text-sm font-medium">Width</label>
                                <input
                                    type="number"
                                    className="block mt-1 w-full text-black border border-gray-300 rounded-md p-2"
                                    min="1"
                                    value={selectedShape.width}
                                    onChange={(e) => handleSelectedShapePropertyChange('width', parseInt(e.target.value))}
                                />
                            </div>
                            <div className="mb-2">
                                <label className="text-sm font-medium">Height</label>
                                <input
                                    type="number"
                                    className="block mt-1 w-full text-black border border-gray-300 rounded-md p-2"
                                    min="1"
                                    value={selectedShape.height}
                                    onChange={(e) => handleSelectedShapePropertyChange('height', parseInt(e.target.value))}
                                />
                            </div>
                            <div className="mb-2">
                                <label className="text-sm font-medium">Opacity (%)</label>
                                <input
                                    type="number"
                                    className="block mt-1 w-full text-black border border-gray-300 rounded-md p-2"
                                    min="0"
                                    max="100"
                                    value={selectedShape.tool === 'rectangle' ? selectedShape.rectangleOpacity : selectedShape.circleOpacity}
                                    onChange={(e) => handleSelectedShapePropertyChange(selectedShape.tool === 'rectangle' ? 'rectangleOpacity' : 'circleOpacity', parseInt(e.target.value))}
                                />
                            </div>
                        </>
                    );
                case 'text':
                    return (
                        <>
                            <div className="mb-2">
                                <label className="text-sm font-medium">Text Content</label>
                                <input
                                    type="text"
                                    className="block mt-1 w-full text-black border border-gray-300 rounded-md p-2"
                                    value={selectedShape.text || ''}
                                    onChange={(e) => handleSelectedShapePropertyChange('text', e.target.value)}
                                />
                            </div>
                            <div className="mb-2">
                                <label className="text-sm font-medium">Font Size</label>
                                <input
                                    type="number"
                                    className="block mt-1 w-full text-black border border-gray-300 rounded-md p-2"
                                    min="8"
                                    max="72"
                                    value={selectedShape.fontSize || 16}
                                    onChange={(e) => handleSelectedShapePropertyChange('fontSize', parseInt(e.target.value))}
                                />
                            </div>
                            <div className="mb-2">
                                <label className="text-sm font-medium">Text Color</label>
                                <input
                                    type="color"
                                    className="block mt-1 w-full h-8"
                                    value={selectedShape.color}
                                    onChange={(e) => handleSelectedShapePropertyChange('color', e.target.value)}
                                />
                            </div>
                        </>
                    );
                case 'image':
                    return (
                        <>
                            <div className="mb-2">
                                <label className="text-sm font-medium">Width</label>
                                <input
                                    type="number"
                                    className="block mt-1 w-full text-black border border-gray-300 rounded-md p-2"
                                    min="1"
                                    value={selectedShape.width}
                                    onChange={(e) => handleSelectedShapePropertyChange('width', parseInt(e.target.value))}
                                />
                            </div>
                            <div className="mb-2">
                                <label className="text-sm font-medium">Height</label>
                                <input
                                    type="number"
                                    className="block mt-1 w-full text-black border border-gray-300 rounded-md p-2"
                                    min="1"
                                    value={selectedShape.height}
                                    onChange={(e) => handleSelectedShapePropertyChange('height', parseInt(e.target.value))}
                                />
                            </div>
                        </>
                    );
                default:
                    return null;
            }
        } else {
            return (
                <div className="text-sm">
                    Select a shape to edit its properties.
                </div>
            );
        }
    };
    const renderLayers = () => (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="layers">
                {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                        <div className="flex justify-end mb-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleCopy}
                                disabled={selectedShapes.length === 0}
                                title="Copy selected shapes (Ctrl+C)"
                            >
                                <Copy className="w-4 h-4 mr-1" />
                                Copy
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handlePaste}
                                disabled={copiedShapes.length === 0}
                                title="Paste copied shapes (Ctrl+V)"
                            >
                                <Clipboard className="w-4 h-4 mr-1" />
                                Paste
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleSelectAll}
                                title="Select All (Ctrl+A)"
                            >
                                <MousePointer2 className="w-4 h-4 mr-1" />
                                Select All
                            </Button>
                        </div>
                        {shapes.map((shape, index) => (
                            <Draggable key={shape.id} draggableId={shape.id} index={index}>
                                {(provided) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        className={`flex items-center justify-between p-2 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded ${shape.isSelected ? 'border-2 border-blue-500' : ''}`}
                                        onClick={(e) => handleShapeSelect(shape.id, e.ctrlKey || e.metaKey)}
                                    >
                                        {isEditingLayerName === shape.id ? (
                                            <Input
                                                className='w-full text-black dark:text-white bg-transparent outline-none border-0 ring-0 focus:ring-0 focus:ring-offset-0 shadow-none focus:border-0 p-0'
                                                type="text"
                                                defaultValue={shape.name || `Layer ${shapes.length - index}: ${shape.tool}`}
                                                onBlur={(e) => handleLayerNameChange(shape.id, e.target.value)}
                                                onKeyPress={(e) => {
                                                    if (e.key === 'Enter') {
                                                        handleLayerNameChange(shape.id, e.currentTarget.value);
                                                    }
                                                }}
                                                autoFocus
                                            />
                                        ) : (
                                            <span
                                                className="text-sm truncate flex-grow cursor-pointer"
                                                onDoubleClick={() => setIsEditingLayerName(shape.id)}
                                            >
                                                {shape.name || `Layer ${shapes.length - index}: ${shape.tool}`}
                                            </span>
                                        )}
                                        <div className="flex space-x-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleShapeVisibilityToggle(shape.id);
                                                }}
                                            >
                                                {shape.isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleShapeDelete(shape.id);
                                                }}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    );

    const MintForm: React.FC<{ onMint: (title: string, description: string) => void; onClose: () => void }> = ({ onMint, onClose }) => {
        const [title, setTitle] = useState('');
        const [description, setDescription] = useState('');

        return (
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Mint Your NFT</h3>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                        <X className="h-5 w-5" />
                    </Button>
                </div>
                <input
                    type="text"
                    placeholder="NFT Title"
                    className="w-full p-2 mb-4 border rounded bg-white dark:bg-gray-700 text-black dark:text-white"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <textarea
                    placeholder="NFT Description"
                    className="w-full p-2 mb-4 border rounded bg-white dark:bg-gray-700 text-black dark:text-white"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <Button
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                    onClick={() => onMint(title, description)}
                >
                    Mint NFT
                </Button>
            </div>
        );
    };

    // Add this function to handle the transaction hash
    useEffect(() => {
        const handleTransactionHash = () => {
            const urlParams = new URLSearchParams(window.location.search);
            const transactionHashes = urlParams.get('transactionHashes');
            if (transactionHashes) {
                showModal(`NFT minted successfully! Transaction hash: ${transactionHashes}`);
                // Clear the URL parameter after showing the modal
                window.history.replaceState({}, '', window.location.pathname);
            }
        };

        handleTransactionHash();

        // Listen for route changes
        window.addEventListener('popstate', handleTransactionHash);

        return () => {
            window.removeEventListener('popstate', handleTransactionHash);
        };
    }, []);

    const handleClearCanvas = () => {
        showConfirmModal(
            <div>
                <p>Are you sure you want to clear the canvas?</p>
                <p>This action cannot be undone.</p>
            </div>,
            () => {
                setShapes([]);
                setSelectedShapes([]);
                setSelectedShape(null);
                setSelectedShapeId(null);
                saveCanvasState();
                setIsConfirmModalOpen(false);
            }
        );
    };

    const handleLoadCanvasState = () => {
        if (!isSignedIn) {
            showModal("Please connect your NEAR wallet to load a canvas.");
            return;
        }
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.nex';
        input.onchange = (e: Event) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const content = e.target?.result as string;
                    try {
                        const loadedShapes = JSON.parse(content);
                        setShapes(loadedShapes);
                        setCanvasKey(Date.now()); // Force re-render of canvas
                        saveCanvasState();
                        showModal('Canvas state loaded successfully.');
                    } catch (error) {
                        console.error('Error parsing canvas state:', error);
                        showModal('Error loading canvas state. The file may be corrupted.');
                    }
                };
                reader.readAsText(file);
            }
        };
        input.click();
    };

    // Add these new hotkey handlers
    useHotkeys('ctrl+e', (event) => {
        event.preventDefault();
        showExportModal();
    }, [selectedShapes]);

    useHotkeys('ctrl+m', (event) => {
        event.preventDefault();
        handleMint();
    }, [handleMint]);

    useHotkeys('ctrl+n', (event) => {
        event.preventDefault();
        handleClearCanvas();
    }, [handleClearCanvas]);

    useHotkeys('ctrl+s', (event) => {
        event.preventDefault();
        showSaveModal();
    }, [shapes, saveFileName]);

    useHotkeys('ctrl+o', (event) => {
        event.preventDefault();
        handleLoadCanvasState();
    }, [handleLoadCanvasState]);

    useHotkeys('ctrl+d', (event) => {
        event.preventDefault();
        setIsDarkMode(!isDarkMode);
    }, [isDarkMode]);

    const handleTextInput = (text: string) => {
        if (textInputPosition && text.trim() !== '') {
            const newShape: Shape = {
                id: uuidv4(),
                tool: 'text',
                startX: textInputPosition.x,
                startY: textInputPosition.y,
                text: text,
                color: '#000000',
                fontSize: 16,
                fontFamily: 'Arial',
                isVisible: true,
                isSelected: false,
                zIndex: shapes.length,
                strokeWidth: 1,
            };
            setShapes(prevShapes => [...prevShapes, newShape]);
            setIsAddingText(false);
            setTextInputPosition(null);
        }
    };

    const renderTextInput = () => {
        if (isAddingText && textInputPosition) {
            const inputStyle = {
                position: 'absolute' as 'absolute',
                left: `${textInputPosition.x * zoom + panOffset.x}px`,
                top: `${textInputPosition.y * zoom + panOffset.y}px`,
                zIndex: 1000,
            };

            return (
                <input
                    type="text"
                    autoFocus
                    style={{ ...inputStyle, backgroundColor: 'transparent' }}
                    onBlur={(e) => handleTextInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            handleTextInput(e.currentTarget.value);
                        }
                    }}
                    className="border border-gray-300 rounded p-1 text-black dark:text-white focus:border-gray-300"
                />
            );
        }
        return null;
    };

    const isPointInResizeHandle = (x: number, y: number, shape: Shape): string | null => {
        if (shape.startX === undefined || shape.startY === undefined || shape.width === undefined || shape.height === undefined) {
            return null;
        }

        const handleSize = 10;
        const handles = [
            { x: shape.startX, y: shape.startY, cursor: 'nwse-resize' },
            { x: shape.startX + shape.width, y: shape.startY, cursor: 'nesw-resize' },
            { x: shape.startX, y: shape.startY + shape.height, cursor: 'nesw-resize' },
            { x: shape.startX + shape.width, y: shape.startY + shape.height, cursor: 'nwse-resize' },
        ];

        for (const handle of handles) {
            if (Math.abs(x - handle.x) <= handleSize / 2 && Math.abs(y - handle.y) <= handleSize / 2) {
                return handle.cursor;
            }
        }

        return null;
    };

    useHotkeys('ctrl+a', (event) => {
        event.preventDefault();
        handleSelectAll();
    }, { enableOnFormTags: true }, [shapes]);

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    const newShape: Shape = {
                        id: uuidv4(),
                        tool: 'image',
                        startX: 0,
                        startY: 0,
                        width: img.width,
                        height: img.height,
                        imageUrl: e.target?.result as string,
                        isVisible: true,
                        isSelected: false,
                        zIndex: shapes.length,
                        color: '#000000',
                        strokeWidth: 1,
                    };
                    setShapes(prevShapes => [...prevShapes, newShape]);
                };
                img.src = e.target?.result as string;
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className={`h-screen w-screen overflow-hidden ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'}`}>
            <TopMenuBar
                isDarkMode={isDarkMode}
                onThemeToggle={() => setIsDarkMode(!isDarkMode)}
                onExport={showExportModal}
                onMint={handleMint}
                onClearCanvas={handleClearCanvas}
                onSaveCanvasState={showSaveModal}
                onLoadCanvasState={handleLoadCanvasState}
                isSignedIn={isSignedIn}
            />

            <div className="fixed top-4 right-4 z-50">
                {isSignedIn ? (
                    <div className="flex items-center space-x-2 bg-gray-800 text-white px-3 py-2 rounded-lg shadow-lg">
                        <span className="text-xs">{accountId}</span>
                        <Button size="sm" onClick={handleSignOut} className="bg-red-500 hover:bg-red-600 text-white text-xs">
                            Sign Out
                        </Button>
                    </div>
                ) : (
                    <Button size="sm" onClick={handleSignIn} className="bg-blue-500 hover:bg-blue-600 text-white">
                        Connect NEAR Wallet
                    </Button>
                )}
            </div>

            <ToolBar
                selectedTool={selectedTool}
                selectedSubTool={selectedSubTool}
                onToolSelect={handleToolSelect}
                onImageUpload={handleImageUpload}
                isDarkMode={isDarkMode}
            />

            <div className={`fixed right-4 top-20 bottom-4 w-64 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'} border rounded-lg shadow-lg overflow-hidden z-50 flex flex-col`}>
                <div className="flex-1 border-b overflow-y-auto">
                    <Button
                        variant="ghost"
                        className="w-full flex items-center justify-between p-4"
                        onClick={() => setIsPropertiesOpen(!isPropertiesOpen)}
                    >
                        <span className="flex items-center">
                            <Settings className="w-4 h-4 mr-2" />
                            Properties
                        </span>
                        {isPropertiesOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </Button>
                    {isPropertiesOpen && (
                        <div className="p-4">
                            <div className="space-y-4">
                                {renderPropertiesPanel()}
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex-1 overflow-y-auto">
                    <Button
                        variant="ghost"
                        className="w-full flex items-center justify-between p-4"
                        onClick={() => setIsLayersOpen(!isLayersOpen)}
                    >
                        <span className="flex items-center">
                            <Layers className="w-4 h-4 mr-2" />
                            Layers
                        </span>
                        {isLayersOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </Button>
                    {isLayersOpen && (
                        <div className="p-4">
                            {renderLayers()}
                        </div>
                    )}
                </div>
            </div>

            <div className={`fixed bottom-4 right-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-2 flex items-center space-x-2 z-50`}>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleZoomOut}
                    disabled={zoomLevel <= 10}
                    title="Zoom Out"
                >
                    <ZoomOut className="w-4 h-4" />
                </Button>
                <span className="text-sm font-medium">{zoomLevel}%</span>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleZoomIn}
                    disabled={zoomLevel >= 500}
                    title="Zoom In"
                >
                    <ZoomIn className="w-4 h-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleResetZoom}
                    title="Reset Zoom"
                >
                    <Maximize className="w-4 h-4" />
                </Button>
            </div>

            <canvas
                key={canvasKey}
                ref={canvasRef}
                className={`fixed inset-0 ${selectedTool === 'eraser' ? 'cursor-none' : ''}`}
                width={canvasSize.width}
                height={canvasSize.height}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onWheel={handleWheel}
                style={{
                    cursor: isPanning ? 'grabbing' : 'default'
                }}
            />

            <div
                ref={selectionBoxRef}
                className="fixed border-2 border-blue-500 bg-blue-200 opacity-30 pointer-events-none"
                style={{ display: 'none' }}
            />

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Information"
                isDarkMode={isDarkMode}
                isMinting={isMinting}
                type="info"
            >
                {modalContent}
            </Modal>

            <Modal
                isOpen={isConfirmModalOpen}
                onClose={() => setIsConfirmModalOpen(false)}
                title="Confirm Action"
                isDarkMode={isDarkMode}
                isMinting={false}
                type="action"
            >
                {confirmModalContent}
                <div className="flex justify-end mt-4 space-x-2">
                    <Button onClick={() => setIsConfirmModalOpen(false)}>Cancel</Button>
                    <Button onClick={confirmModalAction} className="bg-red-500 hover:bg-red-600 text-white">Confirm</Button>
                </div>
            </Modal>

            <ExportModal
                isOpen={isExportModalOpen}
                onClose={() => setIsExportModalOpen(false)}
                onExport={handleExport}
                isDarkMode={isDarkMode}
            />

            <SaveModal
                isOpen={isSaveModalOpen}
                onClose={() => setIsSaveModalOpen(false)}
                onSave={handleSaveCanvasState}
                isDarkMode={isDarkMode}
            />

            {renderTextInput()}
        </div>
    );
};

const NewCanvas = dynamic(() => Promise.resolve(InfiniteCanvas2), { ssr: false });

export default NewCanvas;
