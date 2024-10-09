'use client';

import { usePathname } from "next/navigation";
import BookingStepCue from "./BookingStepCue";
import styles from './BookingProgressCue.module.css';


const steps = [
    'Find a business',
    'Select an employee',
    'Choose a date',
    'Confirm appointment'
]
export default function BookingProgressCue() {
    const pathname = usePathname();
    let stage = 0;

    if (pathname.includes('business')) {
        stage = 1;
    } else if (pathname.includes('employee')) {
        stage = 2;
    }

    return (
        <section className='flex-center'>
            <div className={styles.container}>
                {steps.map((description, index) => {
                    let state: 'incomplete' | 'current' | 'finished' = 'incomplete';
                    if (index == stage) {
                        state = 'current';
                    } else if (index < stage) {
                        state = 'finished';
                    }
                    return <BookingStepCue key={index} state={state} description={description}/>
                })}
            </div>
        </section>
    )
}