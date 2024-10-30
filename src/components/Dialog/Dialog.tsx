'use client';

import { useRef, PropsWithChildren, forwardRef, useImperativeHandle } from 'react';
import Icon from '@/components/Icon';
import styles from './Dialog.module.css';

interface Props extends PropsWithChildren {
    className?: string;
}

const Dialog = forwardRef<HTMLDialogElement, Props>(
    function Dialog({ className, children }: Props, ref) {
        const dialog = useRef<HTMLDialogElement>(null);
        useImperativeHandle(ref, () => dialog.current!, [])

        return (
            <dialog ref={dialog} className={className}>
                <button
                    className={styles.cancelButton}
                    onClick={() => dialog.current!.close()} >
                        <Icon name='close' className={styles.cancelIcon} />
                </button>
                { children }
            </dialog>
        )
    }
)

export default Dialog;