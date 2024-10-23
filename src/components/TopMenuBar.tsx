/**
 * This is the main entry point for the React application.
 */
import React from 'react';
import { Button } from "@/components/ui/button";
import { Sun, Moon, Download, Upload, Save, FolderOpen, Trash2, CreditCard } from 'lucide-react';

interface TopMenuBarProps {
    isDarkMode: boolean;
    onThemeToggle: () => void;
    onExport: () => void;
    onMint: () => void;
    onClearCanvas: () => void;
    onSaveCanvasState: () => void;
    onLoadCanvasState: () => void;
    isSignedIn: boolean;
}

const TopMenuBar: React.FC<TopMenuBarProps> = ({
    isDarkMode,
    onThemeToggle,
    onExport,
    onMint,
    onClearCanvas,
    onSaveCanvasState,
    onLoadCanvasState,
    isSignedIn
}) => {
    return (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
            <div className={`flex space-x-2 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'} p-2 rounded-lg shadow-lg`}>
                <Button variant="ghost" size="icon" onClick={onThemeToggle} title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}>
                    {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </Button>
                <Button variant="ghost" size="icon" onClick={onExport} title="Export (Ctrl+E)">
                    <Download className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" onClick={onMint} title="Mint NFT (Ctrl+M)">
                    <CreditCard className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" onClick={onClearCanvas} title="Clear Canvas (Ctrl+N)">
                    <Trash2 className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" onClick={onSaveCanvasState} disabled={!isSignedIn} title={isSignedIn ? "Save Canvas (Ctrl+S)" : "Connect wallet to save"}>
                    <Save className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" onClick={onLoadCanvasState} disabled={!isSignedIn} title={isSignedIn ? "Load Canvas (Ctrl+O)" : "Connect wallet to load"}>
                    <FolderOpen className="h-5 w-5" />
                </Button>
            </div>
        </div>
    );
};

export default TopMenuBar;
