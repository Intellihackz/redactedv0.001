import React from 'react';
import { Button } from "@/components/ui/button";
import { MousePointer2, Brush, Square, Circle, Eraser, Type } from 'lucide-react';

interface ToolBarProps {
    selectedTool: string;
    onToolSelect: (toolId: string) => void;
    isDarkMode: boolean;
}

const tools = [
    { id: 'pointer', icon: MousePointer2, tooltip: 'Click, move and resize items on the canvas ', hotkey: 'P' },
    { id: 'brush', icon: Brush, tooltip: 'Draw freely on the canvas ', hotkey: 'B' },
    { id: 'rectangle', icon: Square, tooltip: 'Input rectangle shape on canvas ', hotkey: 'R' },
    { id: 'circle', icon: Circle, tooltip: 'Input circle shape on canvas ', hotkey: 'C' },
    { id: 'eraser', icon: Eraser, tooltip: 'Clean canvas ', hotkey: 'E' },
    { id: 'text', icon: Type, tooltip: 'Add text to the canvas ', hotkey: 'T' },
];

const ToolBar: React.FC<ToolBarProps> = ({ selectedTool, onToolSelect, isDarkMode }) => (
    <div className={`fixed left-4 top-1/2 -translate-y-1/2 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'} rounded-lg shadow-lg p-2 flex flex-col space-y-2 z-50`}>
        {tools.map((tool) => (
            <Button
                key={tool.id}
                variant={selectedTool === tool.id ? "default" : "ghost"}
                size="icon"
                className={`w-10 h-10 ${selectedTool === tool.id ? 'bg-blue-500 text-white' : ''}`}
                onClick={() => onToolSelect(tool.id)}
                title={`${tool.tooltip} (${tool.hotkey})`}
            >
                <tool.icon className="w-5 h-5" />
            </Button>
        ))}
    </div>
);

export default ToolBar;
