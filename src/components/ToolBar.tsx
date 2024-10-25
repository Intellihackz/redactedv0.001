import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { MousePointer2, Brush, Square, Circle, Eraser, Type, ChevronRight, PenTool, Pencil, Edit3, Hexagon, Triangle, Octagon, Disc, Aperture, Image as ImageIcon } from 'lucide-react';

interface SubTool {
    id: string;
    name: string;
    icon: React.ElementType;
}

interface Tool {
    id: string;
    icon: React.ElementType;
    tooltip: string;
    hotkey: string;
    subTools?: SubTool[];
}

interface ToolBarProps {
    selectedTool: string;
    selectedSubTool: string | null;
    onToolSelect: (toolId: string, subToolId?: string) => void;
    onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
    isDarkMode: boolean;
}

const tools: Tool[] = [
    { 
        id: 'pointer', 
        icon: MousePointer2, 
        tooltip: 'Click, move and resize items on the canvas ', 
        hotkey: 'P'
    },
    { 
        id: 'brush', 
        icon: Brush, 
        tooltip: 'Draw freely on the canvas ', 
        hotkey: 'B',
        subTools: [
            { id: 'pencil', name: 'Pencil', icon: Pencil },
            { id: 'pen', name: 'Pen', icon: PenTool },
            { id: 'marker', name: 'Marker', icon: Edit3 },
        ]
    },
    { 
        id: 'rectangle', 
        icon: Square, 
        tooltip: 'Input rectangle shape on canvas ', 
        hotkey: 'R',
        subTools: [
            { id: 'rectangle', name: 'Rectangle', icon: Square },
            { id: 'square', name: 'Square', icon: Square },
            { id: 'parallelogram', name: 'Parallelogram', icon: Hexagon },
            { id: 'trapezoid', name: 'Trapezoid', icon: Triangle },
            { id: 'rhombus', name: 'Rhombus', icon: Octagon },
        ]
    },
    { 
        id: 'circle', 
        icon: Circle, 
        tooltip: 'Input circle shape on canvas ', 
        hotkey: 'C',
        subTools: [
            { id: 'circle', name: 'Circle', icon: Circle },
            { id: 'ellipse', name: 'Ellipse', icon: Circle },
            { id: 'semicircle', name: 'Semicircle', icon: Disc },
            { id: 'oval', name: 'Oval', icon: Circle },
            { id: 'arc', name: 'Arc', icon: Aperture },
        ]
    },
    { 
        id: 'eraser', 
        icon: Eraser, 
        tooltip: 'Clean canvas ', 
        hotkey: 'E'
    },
    { 
        id: 'text', 
        icon: Type, 
        tooltip: 'Add text to the canvas ', 
        hotkey: 'T'
    },
    { 
        id: 'image', 
        icon: ImageIcon, 
        tooltip: 'Add image to the canvas', 
        hotkey: 'I'
    },
];

const ToolBar: React.FC<ToolBarProps> = ({ selectedTool, selectedSubTool, onToolSelect, onImageUpload, isDarkMode }) => {
    const [activeSubMenu, setActiveSubMenu] = useState<string | null>(null);
    const subMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (subMenuRef.current && !subMenuRef.current.contains(event.target as Node)) {
                setActiveSubMenu(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleToolClick = (toolId: string) => {
        if (toolId === 'image') {
            fileInputRef.current?.click();
        } else {
            onToolSelect(toolId);
            setActiveSubMenu(null);
        }
    };

    const handleToolRightClick = (e: React.MouseEvent, toolId: string) => {
        e.preventDefault();
        if (tools.find(tool => tool.id === toolId)?.subTools) {
            setActiveSubMenu(activeSubMenu === toolId ? null : toolId);
        }
    };

    const handleSubToolSelect = (toolId: string, subToolId: string) => {
        onToolSelect(toolId, subToolId);
        setActiveSubMenu(null);
    };

    const getToolIcon = (toolId: string) => {
        const tool = tools.find(t => t.id === toolId);
        if (tool && tool.subTools && selectedSubTool) {
            const subTool = tool.subTools.find(st => st.id === selectedSubTool);
            return subTool ? subTool.icon : tool.icon;
        }
        return tool ? tool.icon : MousePointer2;
    };

    return (
        <div className={`fixed left-4 top-1/2 -translate-y-1/2 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'} rounded-lg shadow-lg p-2 flex flex-col space-y-2 z-50`}>
            {tools.map((tool) => {
                const ToolIcon = getToolIcon(tool.id);
                return (
                    <div key={tool.id} className="relative">
                        <Button
                            variant={selectedTool === tool.id ? "default" : "ghost"}
                            size="icon"
                            className={`w-10 h-10 ${selectedTool === tool.id ? 'bg-blue-500 text-white' : ''}`}
                            onClick={() => handleToolClick(tool.id)}
                            onContextMenu={(e) => handleToolRightClick(e, tool.id)}
                            title={`${tool.tooltip} (${tool.hotkey})`}
                        >
                            <ToolIcon className="w-5 h-5" />
                            {tool.subTools && <ChevronRight className="w-3 h-3 absolute bottom-1 right-1" />}
                        </Button>
                        {activeSubMenu === tool.id && tool.subTools && (
                            <div 
                                ref={subMenuRef}
                                className={`absolute left-full ml-2 top-0 ${isDarkMode ? 'bg-gray-700' : 'bg-white'} rounded-md shadow-lg p-2 z-50`}
                            >
                                {tool.subTools.map((subTool) => (
                                    <Button
                                        key={subTool.id}
                                        variant="ghost"
                                        size="sm"
                                        className={`w-full justify-start ${selectedSubTool === subTool.id ? 'bg-blue-500 text-white' : ''}`}
                                        onClick={() => handleSubToolSelect(tool.id, subTool.id)}
                                    >
                                        <subTool.icon className="w-4 h-4 mr-2" />
                                        {subTool.name}
                                    </Button>
                                ))}
                            </div>
                        )}
                    </div>
                );
            })}
            <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={onImageUpload}
                accept="image/*"
            />
        </div>
    );
};

export default ToolBar;
