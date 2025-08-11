"use client";

import { Modal } from "@/components/Modal";
import { Button } from "@/components/Button";

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    confirmVariant?: "primary" | "secondary" | "danger" | "success" | "ghost";
}

export const ConfirmModal = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    confirmVariant = "primary",
}: ConfirmModalProps) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title}>
            <p className="mb-6 text-gray-600">{message}</p>
            <div className="flex justify-end gap-3">
                <Button variant="secondary" onClick={onClose}>
                    {cancelText}
                </Button>
                <Button
                    variant={confirmVariant}
                    onClick={() => {
                        onConfirm();
                        onClose();
                    }}
                >
                    {confirmText}
                </Button>
            </div>
        </Modal>
    );
};
