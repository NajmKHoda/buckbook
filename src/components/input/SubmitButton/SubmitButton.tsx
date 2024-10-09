'use client';

import { PropsWithChildren } from "react";
import { useFormStatus } from "react-dom";
import Icon from "@/components/Icon";
import styles from './SubmitButton.module.css';

export default function SubmitButton({ children }: PropsWithChildren) {
    const { pending } = useFormStatus();
    return (
        <button disabled={pending}>
            { pending ? <Icon className={styles.spinningIcon} name='progress_activity' /> : children }
        </button>
    );
}