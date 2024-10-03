'use client';

import { useState, ReactNode } from 'react';
import CalendarDate from '../CalendarDate';
import styles from './Calendar.module.css';

const weekDays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const monthNames = [
    'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 
    'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'
];

interface Props {
    selectedDate: CalendarDate,
    onSelectionChanged: (newDate: CalendarDate) => void;
    unavailableDates: string[],
    closedDays: number[]
}

export default function Calendar({ selectedDate, onSelectionChanged, unavailableDates, closedDays }: Props) {
    const nowDate = new Date();
    const [timeView, setTimeView] = useState({
        month: nowDate.getMonth(),
        year: nowDate.getFullYear()
    })

    function changeMonth(amount: number) {
        const date = new Date(timeView.year, timeView.month);
        date.setMonth(date.getMonth() + amount);
        setTimeView({
            month: date.getMonth(),
            year: date.getFullYear()
        })
    }

    // The first date in the calendar is the first Sunday on or before the first of the month.
    const date = new Date(timeView.year, timeView.month);
    date.setDate(1 - date.getDay());
    const gridElements: ReactNode[] = [];
    for (let i = 0; i < 42; i++) {
        const calendarDate = new CalendarDate(date);
        const key = `${calendarDate.month}/${calendarDate.day}`;
        
        if (calendarDate.equals(selectedDate)) {
            gridElements.push(<button key={key} className={styles.selectedDay}>{calendarDate.day}</button>);
        } else if (calendarDate.month != timeView.month) {
            gridElements.push(<div key={key} className={styles.emptyDay}></div>);
        } else if (closedDays.includes(calendarDate.weekDay) || unavailableDates.includes(calendarDate.toString())) {
            gridElements.push(<div key={key} className={styles.outDay}>{calendarDate.day}</div>);
        } else {
            gridElements.push(
                <button 
                    type='button'
                    onClick={() => onSelectionChanged(calendarDate)}
                    key={key}
                    className={styles.inDay}>
                    {calendarDate.day}
                </button>
            );
        }
        
        date.setDate(calendarDate.day + 1);
    }

    return (
        <div>
            <div className={styles.calendarHead}>
                <button onClick={() => changeMonth(-1)} className={styles.calendarNav} type='button'>{'<'}</button>
                <h1 className={styles.calendarMonth}>{monthNames[timeView.month]} {timeView.year}</h1>
                <button onClick={() => changeMonth(1)} className={styles.calendarNav} type='button'>{'>'}</button>
            </div>
            <div className={styles.calendarGrid}>
                {weekDays.map(day => <div key={day} className={styles.weekDay}>{day}</div>)}
                {gridElements}
            </div>
        </div>
    )
}