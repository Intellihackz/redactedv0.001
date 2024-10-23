import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Modal from './Modal';

interface SaveModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (fileName: string) => void;
    isDarkMode: boolean;
}

const SaveModal: React.FC<SaveModalProps> = ({ isOpen, onClose, onSave, isDarkMode }) => {
    const [fileName, setFileName] = useState('');

    const handleSave = () => {
        onSave(fileName);
        setFileName('');
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Save Canvas"
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
            <Button onClick={handleSave}>Save</Button>
        </Modal>
    );
};

export default SaveModal;
