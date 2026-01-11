import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { AlertTriangle } from 'lucide-react';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    variant?: 'danger' | 'warning' | 'info';
}

export function ConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmLabel = 'Confirmar',
    cancelLabel = 'Cancelar',
    variant = 'danger'
}: ConfirmationModalProps) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title}>
            <div className="flex flex-col items-center text-center sm:items-start sm:text-left sm:flex-row gap-4">
                <div className={`p-2 rounded-full ${variant === 'danger' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'}`}>
                    <AlertTriangle className="h-6 w-6" />
                </div>
                <div className="flex-1">
                    <p className="text-gray-500 mb-6">{message}</p>
                    <div className="flex justify-end gap-3">
                        <Button variant="ghost" onClick={onClose}>
                            {cancelLabel}
                        </Button>
                        <Button
                            className={variant === 'danger' ? 'bg-red-600 hover:bg-red-700 text-white' : ''}
                            onClick={() => {
                                onConfirm();
                                onClose();
                            }}
                        >
                            {confirmLabel}
                        </Button>
                    </div>
                </div>
            </div>
        </Modal>
    );
}
