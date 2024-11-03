'use client';

import { HTMLInputTypeAttribute, useState, ChangeEvent, InvalidEvent } from "react";
import styles from './FormItem.module.css';
import { useFormStatus } from "react-dom";

function formatPhone(phone: string) {
    if (phone.length == 10) {
        let areaCode = phone.slice(0, 3);
        let segment2 = phone.slice(3, 6);
        let segment3 = phone.slice(6, 10);

        return `(${areaCode}) ${segment2}-${segment3}`;
    }

    if (phone.length == 11) {
        let countryCode = phone[0];
        let areaCode = phone.slice(1, 4);
        let segment2 = phone.slice(4, 7);
        let segment3 = phone.slice(7, 11);

        return `+${countryCode} (${areaCode}) ${segment2}-${segment3}`;
    }

    return phone;
}

interface FormItemStatus {
    isValid: boolean;
    invalidationReason?: string;
}

interface Props {
    name: string;
    units?: string;
    type?: HTMLInputTypeAttribute;
    optional?: boolean;
    pattern?: string;
    min?: number;
    max?: number;
    minLength?: number;
    maxLength?: number;
    customValidator?: (value: string) => string | void;
    inline?: boolean;
}


export default function FormItem({
    name,
    units,
    type,
    optional = false,
    pattern,
    min, max,
    minLength, maxLength,
    customValidator,
    inline = false
}: Props) {
    const [value, setValue] = useState<string>('');
    const [status, setStatus] = useState<FormItemStatus>({ isValid: true });
    const [isFocused, setFocused] = useState(false);
    const { pending } = useFormStatus();

    const labelText = units ? `${name} (${units}):` : `${name}:`;
    const encodedName = name.toLowerCase().replace(/\s/g, '-');
    const fieldId = `${encodedName}-field`;

    function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
        let value = event.target.value;
        if (type === 'tel') {
            // Strip all non-digit characters from the new value.
            value = value.replace(/\D/g, '');
        }

        if (customValidator) {
            const validity = customValidator(value);
            event.target.setCustomValidity(validity || '');
        }

        if (event.target.checkValidity()) {
            setStatus({ isValid: true });
        }

        setValue(value);
    }

    function handleInvalidation(event: InvalidEvent<HTMLInputElement>) {
        const nextStatus: FormItemStatus = { isValid: false }

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
        <div className={inline ? styles.containerInline : styles.container}>
            <label htmlFor={fieldId} className={status.isValid ? styles.label : styles.labelInvalid}>{labelText}</label>
            <input
                id={fieldId}
                name={type === 'tel' ? undefined : encodedName}
                type={type}
                value={type === 'tel' && !isFocused ? formatPhone(value) : value}
                required={!optional}
                min={min} max={max}
                minLength={minLength} maxLength={maxLength}
                pattern={pattern}
                readOnly={pending}
                className={status.isValid ? undefined : 'invalid'}
                onChange={handleInputChange}
                onInvalid={handleInvalidation}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)} />
            { type === 'tel' && <input type='hidden' name={encodedName} value={value} /> }
            { !status.isValid && <p className={styles.errorMessage}>{status.invalidationReason}</p> } 
        </div>
    );
}
