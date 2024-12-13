'use client';

import { useState } from 'react';
import { AppointmentDetails } from "../AppointmentCalendar";
import PartialDate from '@/lib/PartialDate';
import AppointmentView from './AppointmentView/AppointmentView';
import styles from './WeekView.module.css';
import NavControl from '../NavControl/NavControl';

interface Props {
    appointments: AppointmentDetails[];
    initialDate: PartialDate;
    duration: number;
}

const monthsLong = [
    "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
    "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"
]; 

const monthsShort = [
    "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
    "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"
]

const weekdays = [
    "SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"
];

const timeFormatter = Intl.DateTimeFormat('en-US', { timeStyle: 'short' });

export default function WeekView({ appointments, initialDate, duration }: Props) {
    const today = new PartialDate('day');

    // Initialize with the first Sunday on or before the given date
    const init = initialDate.adjust(0, 0, -initialDate.weekday!);

    // First and last days of the week
    const [firstDay, setFirstDay] = useState(init);
    const lastDay = firstDay.adjust(0, 0, 6);

    // Does this week border between two months?
    const monthBoundary = lastDay.month != firstDay.month;

    // Organize all appointments into the columns of each day of the week
    const apptElements: React.ReactNode[][] = [ [], [], [], [], [], [], [] ];
    for (const appointment of appointments) {
        const date = new PartialDate('minutes', appointment.date);

        // Skip this appointment if it isn't within the current week.
        if (PartialDate.compare(date, firstDay) < 0 || PartialDate.compare(date, lastDay) > 0) continue;

        apptElements[date.weekday!].push(
            <AppointmentView key={ date.toString() } details={ appointment } duration={ duration } />
        );
    }
    
    // Get the numbers of days in this week
    const dayNums: React.ReactNode[] = [];
    for (let i = 0; i < 7; i++) {
        const date = firstDay.adjust(0,0,i);
        dayNums.push(
            <p
                key={ date.toString() }
                className={ PartialDate.compare(date, today) === 0 ? styles.dayNumToday : styles.dayNum }>
                    { weekdays[i] }
                    <br/>
                    { date.day }
            </p>
        )
    }

    // get all divider times
    const dividerTimes: React.ReactNode[] = [];
    let time = new PartialDate(0, 0, 0, 0);
    for (let i = 0; i < 24; i++) {
        let timestring = timeFormatter.format(time.asDate());
        dividerTimes.push(
            <p key={ timestring } className={ styles.time }>
                { timestring }
            </p>
        );
        time = time.adjust(0, 0, 0, 1);
    }

    const dividers: React.ReactNode[] = [];
    for (let i = 0; i <= 24; i++) {
        dividers.push(<div key={ i } className={ styles.divider } />)
    }

    function adjustWeek(amount: number) {
        setFirstDay(firstDay.adjust(0,0, 7 * amount));
    }

    return (
        <div className={ styles.container }>
            <NavControl
                onBack={ () => adjustWeek(-1) }
                onForward={ () => adjustWeek(1) }
                backDisabled={ PartialDate.compare(firstDay, today) <= 0 }>
                    { monthBoundary ?
                        `${ monthsShort[firstDay.month!] } | ${ monthsShort[lastDay.month!] } ${ lastDay.year }` :
                        `${ monthsLong[lastDay.month!] } ${ lastDay.year }` }
            </NavControl>
            <div className={ styles.daysContainer }>
                <div className={ styles.timeColHeader } />
                { dayNums }
            </div>
            <div className={ styles.scrollContainer } >
                <div className={ styles.viewContainer }>
                    <div className={ styles.timesColumn }>
                        { dividerTimes }
                        <div />
                    </div>
                    {
                        apptElements.map((appts, day) => (
                            <div className={ styles.column } key={ day }>
                                { appts }
                            </div>
                        ))
                    }
                    <div className={ styles.dividerContainer }>
                        { dividers }
                    </div>
                </div>
            </div>
        </div>
    )
}