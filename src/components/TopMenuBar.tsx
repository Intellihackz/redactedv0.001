import React from 'react';
import { Button } from "@/components/ui/button";
import { File, Sun, Moon } from 'lucide-react';

interface TopMenuBarProps {
    isDarkMode: boolean;
    onThemeToggle: () => void;
    onExport: () => void;
    onMint: () => void;
}

const TopMenuBar: React.FC<TopMenuBarProps> = ({ isDarkMode, onThemeToggle, onExport, onMint }) => (
    <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 h-12 w-96 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'} border rounded-lg shadow-lg flex items-center px-4 justify-between z-50`}>
        <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="text-xs">
                <File className="w-3 h-3 mr-1" />
                File
            </Button>
            <Button variant="ghost" size="sm" className="text-xs">View</Button>
            <Button variant="ghost" size="sm" className="text-xs" onClick={onExport}>
                Export Selection
            </Button>
        </div>
        <div className="flex items-center space-x-2">
            <Button
                variant="ghost"
                size="icon"
                onClick={onThemeToggle}
            >
                {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Button size="sm" className="bg-green-500 hover:bg-green-600 text-white text-xs" onClick={onMint}>
                Mint
            </Button>
        </div>
    </div>
);

export default TopMenuBar;
