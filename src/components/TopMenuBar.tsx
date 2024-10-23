import React from 'react';
import { Button } from "@/components/ui/button";
import { Sun, Moon, Download, Upload, Trash2, Save, FolderOpen } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface TopMenuBarProps {
    isDarkMode: boolean;
    onThemeToggle: () => void;
    onExport: () => void;
    onMint: () => void;
    onClearCanvas: () => void;
    onSaveCanvasState: () => void;
    onLoadCanvasState: () => void;
}

const TopMenuBar: React.FC<TopMenuBarProps> = ({
    isDarkMode,
    onThemeToggle,
    onExport,
    onMint,
    onClearCanvas,
    onSaveCanvasState,
    onLoadCanvasState
}) => {
    return (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
            <div className={`flex items-center space-x-2 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-full shadow-md px-4 py-2`}>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="sm" onClick={onThemeToggle}>
                                {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Toggle Theme (Ctrl+D)</p>
                        </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="sm" onClick={onExport}>
                                <Download className="h-5 w-5" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Export (Ctrl+E)</p>
                        </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="sm" onClick={onMint}>
                                <Upload className="h-5 w-5" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Mint NFT (Ctrl+M)</p>
                        </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="sm" onClick={onClearCanvas}>
                                <Trash2 className="h-5 w-5" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Clear Canvas (Ctrl+N)</p>
                        </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="sm" onClick={onSaveCanvasState}>
                                <Save className="h-5 w-5" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Save Canvas (Ctrl+S)</p>
                        </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="sm" onClick={onLoadCanvasState}>
                                <FolderOpen className="h-5 w-5" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Load Canvas (Ctrl+O)</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
        </div>
    );
};

export default TopMenuBar;
