import React, { useState, useEffect } from 'react';
import Modal  from './Modal';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ExportModalProps {
    isOpen: boolean;
    onClose: () => void;
    onExport: (fileName: string) => void;
    isDarkMode: boolean;
}

const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, onExport, isDarkMode }) => {
    const [fileName, setFileName] = useState('');

    useEffect(() => {
        if (isOpen) {
            setFileName(''); // Reset filename when modal opens
        }
    }, [isOpen]);

    const handleExport = () => {
        if (fileName.trim()) {
            onExport(fileName.trim());
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Export Image"
            isDarkMode={isDarkMode}
            isMinting={false}
            type="action"
        >
            <Input
                type="text"
                placeholder="Enter file name"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                className="mb-4"
            />
            <Button onClick={handleExport} disabled={!fileName.trim()}>Export</Button>
        </Modal>
    );
};

export default ExportModal;
