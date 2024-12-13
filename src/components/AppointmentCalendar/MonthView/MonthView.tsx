'use client';

import { useMemo, useState } from "react";
import { AppointmentDetails } from "../AppointmentCalendar";
import PartialDate from "@/lib/PartialDate";
import { CalendarDay } from './CalendarDay/CalendarDay';
import styles from './MonthView.module.css';
import NavControl from "../NavControl/NavControl";

interface Props {
    appointments: AppointmentDetails[];
    onSelect: (date: PartialDate) => unknown;
}

const months = [
    "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
    "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"
]; 

const weekdays = [ "SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT" ];

export default function MonthView({ appointments, onSelect }: Props) {
    const [viewMonth, setViewMonth] = useState(new PartialDate('month'));

    function adjustViewMonth(amount: number) {
        setViewMonth(viewMonth.adjust(0, amount));
    } 

    const appointmentCounts = useMemo(() => {
        const record: Record<string, number> = {};
        for (const appointment of appointments) {
            const calendarDate = new PartialDate('day', appointment.date).toString();
            if (calendarDate in record) {
                record[calendarDate]++;
            } else {
                record[calendarDate] = 1;
            }
        }
        return record;
    }, [appointments]);

    // First Sunday on or before the first of the month.
    let firstDate = new PartialDate(viewMonth.year, viewMonth.month, 1);
    firstDate = firstDate.adjust(0, 0, -firstDate.weekday!);

    const today = new PartialDate('day');
    const gridItems: React.ReactNode[] = []
    for (let i = 0; i < 42; i++) {
        const date = firstDate.adjust(0, 0, i);
        const count = appointmentCounts[date.toString()] ?? 0;
        
        let type: 'out' | 'in' | 'current';
        if (PartialDate.areEqual(today, date)) { type = 'current' }
        else if (PartialDate.areEqual(viewMonth, date)) { type = 'in'; } 
        else { type = 'out' }

        gridItems.push(
            <CalendarDay
                key={ date.toString() }
                day={ date.day! }
                onClick={ () => onSelect(date) }
                numAppointments={ count }
                type={ type } />
        );
    }


    return (
        <div className={ styles.container }>
            <NavControl
                onBack={ () => adjustViewMonth(-1) }
                onForward={ () => adjustViewMonth(1) }
                backDisabled= { PartialDate.compare(viewMonth, today) <= 0 }>
                    { months[viewMonth.month!] } { viewMonth.year }
            </NavControl>
            <div className={ styles.grid } >
                { weekdays.map(day => <p key={ day } className={ styles.weekday }>{ day }</p>) }
                { gridItems }
            </div>
        </div>
    )
}

