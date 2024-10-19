'use client';

import { PropsWithChildren } from "react";
import { useFormStatus } from "react-dom";
import Icon from "@/components/Icon";
import styles from './SubmitButton.module.css';

interface Props extends PropsWithChildren {
    className?: string;
}

export default function SubmitButton({ className = '', children }: Props) {
    const { pending } = useFormStatus();
    return (
        <button className={className} disabled={pending}>
            { pending ? <Icon className={styles.spinningIcon} name='progress_activity' /> : children }
        </button>
    );
}