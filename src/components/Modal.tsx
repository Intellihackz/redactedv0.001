import React from 'react';
import { X } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  isDarkMode: boolean;
  isMinting?: boolean;
  type: 'action' | 'info';
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, isDarkMode, isMinting, type }) => {
  if (!isOpen) return null;

  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && type === 'info') {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={handleOutsideClick}>
      <div className={`${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'} rounded-lg p-6 w-96`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{title}</h2>
          {type === 'action' && !isMinting && (
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-6 w-6" />
            </Button>
          )}
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
