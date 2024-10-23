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

/**
 * A React functional component that renders a modal dialog for saving a canvas.
 *
 * @param isOpen - A boolean indicating whether the modal should be open or closed.
 * @param onClose - A function to be called when the modal is closed.
 * @param onSave - A function to be called when the user saves the canvas, taking the file name as a parameter.
 * @param isDarkMode - A boolean indicating whether the application is in dark mode.
 */
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
