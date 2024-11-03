'use client';

import { useState, useRef, FormEvent } from "react";
import styles from './TimeRangeInput.module.css';

interface TimeRangeInputProps {
    index: number;
    compact?: boolean
}

export function TimeRangeInput({ index, compact=false }: TimeRangeInputProps) {
    const [isOpen, setIsOpen] = useState(true);
    const [isInvalid, setIsInvalid] = useState(false);
    const openingInput = useRef<HTMLInputElement>(null);
    const closingInput = useRef<HTMLInputElement>(null);

    function handleToggle() {
        if (isOpen) {
            setIsInvalid(false);
        }

        setIsOpen(!isOpen);
    }

    function handleChange() {
        const openingTime = openingInput.current!.value;
        const closingTime = closingInput.current!.value;

        const isValid = !openingTime || !closingTime || openingTime < closingTime;
        openingInput.current!.setCustomValidity(isValid ? '' : 'Invalid time range.');
        setIsInvalid(!isValid);
    }

    function handleInvalidation(event: FormEvent) {
        setIsInvalid(true);
        event.preventDefault();
    }

    return (
        <div className={styles.container}>
            <p>
                <input type='checkbox' checked={isOpen} onChange={handleToggle} />
                {isOpen ? 
                <>
                    {!compact && <> Open from </>}
                    <input
                        name={`opening${index}`}
                        title='Opening time'
                        type='time'
                        className={isInvalid ? 'invalid' : ''}
                        ref={openingInput}
                        onChange={handleChange}
                        onInvalid={handleInvalidation}
                        required />
                    <> to </>
                    <input
                        name={`closing${index}`}
                        title='Closing time'
                        type='time'
                        className={isInvalid ? 'invalid' : ''}
                        ref={closingInput}
                        onChange={handleChange}
                        onInvalid={handleInvalidation}
                        required />
                </> :
                <> Closed</>}
            </p>
        </div>
    );

}
