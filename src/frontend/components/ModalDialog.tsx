import { useEffect, useRef, type DetailedHTMLProps, type DialogHTMLAttributes } from "react";

type DialogModalProps = {
    isOpen: boolean,
    children: React.ReactNode,
}

export default function ModalDialog({isOpen, children} : DialogModalProps) {
    const dialogRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        if (dialogRef.current === null) return;

        if (isOpen) dialogRef.current.showModal();
        else dialogRef.current.close();
    }, [isOpen])

    return <dialog ref={dialogRef} className="backdrop:bg-black/50">
        {children}
    </dialog>
}