'use client';

import { useState, ReactNode } from 'react';
import styles from './Calendar.module.css';
import PartialDate from '../PartialDate';

const weekDays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const monthNames = [
    'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 
    'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'
];

interface Props {
    selectedDate?: PartialDate,
    onSelectionChanged: (newDate: PartialDate | undefined) => void;
    unavailableDates: string[],
    closedDays: number[]
}

export default function Calendar({ selectedDate, onSelectionChanged, unavailableDates, closedDays }: Props) {
    const [viewMonth, setViewMonth] = useState(new PartialDate('month'));
    const today = new PartialDate('day');

    // Changes the current view month.
    function changeViewMonth(amount: number) {
        const date = viewMonth.adjust(0, amount);
        setViewMonth(date);
    }

    // The first date in the calendar is the first Sunday on or before the first of the month.
    let startDate = new PartialDate(viewMonth.year, viewMonth.month, 1);
    startDate = startDate.adjust(0, 0, -startDate.weekday!);

    // Get all the calendar dates.
    const gridElements: ReactNode[] = [];
    for (let i = 0; i < 42; i++) {
        const date = startDate.adjust(0, 0, i);
        const key = `${date.month}/${date.day}`;

        // If the current date isn't within the viewing month...
        if (PartialDate.compare(date, viewMonth) !== 0) {
            gridElements.push(<div key={key} className={styles.emptyDay} />);
        // If the current date is the selected date...
        } else if (selectedDate && PartialDate.areEqual(date, selectedDate)) {
            gridElements.push(
                <button  
                    type='button'
                    key={key}
                    className={styles.selectedDay}>
                    {date.day}
                </button>
            );
        // If the current date is before today or is closed/unavailable...
        } else if (
            PartialDate.compare(date, today) < 0 ||
            closedDays.includes(date.weekday!) ||
            unavailableDates.includes(date.toString())
        ) {
            gridElements.push(<div key={key} className={styles.outDay}>{ date.day }</div>);
        // This date can be selected.
        } else {
            gridElements.push(
                <button 
                    type='button'
                    onClick={() => onSelectionChanged(date)}
                    key={key}
                    className={styles.inDay}>
                    {date.day}
                </button>
            );
        }
    }
    
    // The user can only use the back button if the current view month comes after today's month.
    const backDisabled = PartialDate.compare(viewMonth, today) <= 0;

    return (
        <div>
            <div className={styles.calendarHead}>
                <button
                    onClick={() => changeViewMonth(-1)}
                    className={styles.calendarNav}
                    type='button'
                    disabled={backDisabled}>
                    &lt;
                </button>
                <h1 className={styles.calendarMonth}>
                    { monthNames[viewMonth.month!] } { viewMonth.year }
                </h1>
                <button
                    onClick={() => changeViewMonth(1)}
                    className={styles.calendarNav}
                    type='button'>
                    &gt;
                </button>
            </div>
            <div className={styles.calendarGrid}>
                {weekDays.map(day => <div key={day} className={styles.weekDay}>{day}</div>)}
                {gridElements}
            </div>
        </div>
    )
}