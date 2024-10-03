'use client';
import { HTMLInputTypeAttribute, useState, ChangeEvent, InvalidEvent, useEffect } from "react";
import styles from './FormItem.module.css';
import { useFormStatus } from "react-dom";

interface FormItemDescription {
    name: string;
    type?: HTMLInputTypeAttribute;
    optional?: boolean;
    pattern?: string;
    minLength?: number;
    maxLength?: number;
    customValidator?: (value: string) => string | void;
}
interface FormItemStatus {
    valid: boolean;
    invalidationReason?: string;
}

export function FormItem({
    name,
    type,
    optional = false,
    pattern,
    minLength,
    maxLength,
    customValidator
}: FormItemDescription) {
    const [value, setValue] = useState<string>('');
    const [status, setStatus] = useState<FormItemStatus>({ valid: true });
    const { pending } = useFormStatus();

    const encodedName = name.toLowerCase().replace(/\s/g, '-');
    const fieldId = `${encodedName}-field`;

    function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
        const value = event.target.value;
        if (customValidator) {
            const validity = customValidator(value);
            event.target.setCustomValidity(validity || '');
        }

        if (event.target.checkValidity()) {
            setStatus({ valid: true });
        }
        setValue(value);
    }

    function handleInvalidation(event: InvalidEvent<HTMLInputElement>) {
        const nextStatus: FormItemStatus = { valid: false }

        const validity = event.target.validity;
        if (validity.customError) {
            nextStatus.invalidationReason = event.target.validationMessage;
        } else if (validity.tooLong || validity.tooShort) {
            const properName = name[0].toUpperCase() + name.substring(1).toLowerCase();
            nextStatus.invalidationReason =
                `${properName} must be between ${minLength} and ${maxLength} characters.`;
        } else {
            nextStatus.invalidationReason = `Please enter a valid ${name.toLowerCase()}.`;
        }

        setStatus(nextStatus);

        event.target.focus();
        event.preventDefault();
    }

    return (
        <div className={styles.container}>
            <label htmlFor={fieldId} className={status.valid ? styles.label : styles.labelInvalid}>{`${name}: `}</label>
            <input
                id={fieldId}
                name={encodedName}
                type={type}
                value={value}
                required={!optional}
                minLength={minLength}
                maxLength={maxLength}
                pattern={pattern}
                readOnly={pending}
                className={status.valid ? '' : 'invalid'}
                onChange={handleInputChange}
                onInvalid={handleInvalidation}
            />
            {(status.invalidationReason && 
            <p className={styles.errorMessage}>{status.invalidationReason}</p>)}
        </div>
    );
}
