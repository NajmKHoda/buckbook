'use client';

import { useState } from 'react';
import MonthView from './MonthView/MonthView';
import WeekView from './WeekView/WeekView';
import PartialDate from '@/lib/PartialDate';
import styles from './AppointmentCalendar.module.css';

interface Props {
    appointments: AppointmentDetails[]
    duration: number;
}

export default function AppointmentCalendar({ appointments, duration }: Props) {
    const [viewSpan, setViewSpan] = useState<'week' | 'month'>('month');
    const [focusDay, setFocusDay] = useState(new PartialDate('day'));

    function onDateSelect(date: PartialDate) {
        setFocusDay(date);
        setViewSpan('week');
    }

    function onWeekViewSelect() {
        setFocusDay(new PartialDate('day'));
        setViewSpan('week');
    }

    return (
        <div className='flex-center' >
            <div className={ styles.container }>
                <div className={ styles.spanControls }>
                    <button
                        type='button'
                        className={ styles.spanButton }
                        onClick={ () => setViewSpan('month') }>
                            MONTH
                    </button>
                    <button
                        type='button'
                        className={ styles.spanButton }
                        onClick={ onWeekViewSelect }>
                            WEEK
                    </button>
                </div>
                {
                    viewSpan === 'month' ?
                    <MonthView appointments={ appointments } onSelect={ onDateSelect } /> :
                    <WeekView appointments={ appointments } initialDate={ focusDay } duration={ duration }/>
                }
            </div>
        </div>
    )
}

export interface AppointmentDetails {
    customerName: string,
    date: Date
}