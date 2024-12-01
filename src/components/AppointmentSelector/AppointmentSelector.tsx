'use client';

import { Hours } from "@/lib/database/models/business";
import { useMemo, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Calendar from './Calendar/Calendar';
import styles from './AppointmentSelector.module.css';
import PartialDate from "./PartialDate";

interface Props {
    bookedTimes: string[],
    hours: Hours[],
    appointmentDuration: number,
    appointmentEditId?: string
}

const dateFormatter = Intl.DateTimeFormat('en-US', { dateStyle: 'full', timeStyle: 'short' });
const timeFormatter = Intl.DateTimeFormat('en-US', { timeStyle: 'short' });

export default function AppointmentSelector({ bookedTimes, hours, appointmentDuration, appointmentEditId }: Props) {
    const router = useRouter();
    const { employeeId } = useParams();
    const [selectedDate, setSelectedDate] = useState<PartialDate>();
    const query = appointmentEditId ? `&edit=${appointmentEditId}` : '';

    const unavailableDates = useMemo(() => {

        // Count the number of appointments for each date that has appointments booked already.
        const appointmentCounts: Record<string, [weekDay: number, count: number]> = {}
        for (const time in bookedTimes) {
            const date = new PartialDate('day', time);
            const dateString = date.toString();
            if (dateString in appointmentCounts) {
                appointmentCounts[dateString][1] += 1;
            } else {
                appointmentCounts[dateString] = [date.weekday!, 1];
            }
        }

        // Get an array of the maximum number of appointments on a given weekday.
        const maxAppointments = hours.map(day => {
            if (!day.isOpen) return 0;
            const opening = timeToMinutes(day.opening!);
            const closing = timeToMinutes(day.closing!);
            return Math.floor((closing - opening) / appointmentDuration);
        })

        // If the number of appointments on a given date equals/exceeds the max for that weekday, that date is unavailable.
        const unavailable: string[] = []
        for (const dateString in appointmentCounts) {
            const [day, count] = appointmentCounts[dateString];
            if (count >= maxAppointments[day]) unavailable.push(dateString);
        }

        return unavailable;

    }, [bookedTimes, hours, appointmentDuration]);

    // An array of weekdays for which this business is closed.
    const closedDays = hours.map((day, i) => !day.isOpen ? i : -1).filter(x => x != -1);

    const availableTimes = useMemo(() => {
        if (!selectedDate) return [];

        // Get all of the booked times (in minutes) for the selected date.
        const dayBookedTimes = bookedTimes
            .map(time => new PartialDate('minutes', time))
            .filter(time => PartialDate.areEqual(selectedDate, time))
            .map(time => time.hours! * 60 + time.minutes!);

        // Get the hours (opening and closing) for the selected day.
        const dayHours = hours[selectedDate.weekday!];
        if (!dayHours.isOpen) return [];
        const opening = timeToMinutes(dayHours.opening!);
        const closing = timeToMinutes(dayHours.closing!);

        // Get information about today's date and time.
        const today = new PartialDate('minutes');
        const todayMinutes = today.hours! * 60 + today.minutes!;
        const isToday = PartialDate.areEqual(selectedDate, today);
        
        const times = [];
        for (let time = opening; time < closing; time += appointmentDuration) {
            // If the time is already booked or before the current time, don't include it.
            if (dayBookedTimes.includes(time)) continue;
            if (isToday && time <= todayMinutes) continue;

            // Push the time to the times[] array;
            const hours = Math.floor(time / 60);
            const minutes = time % 60;
            times.push(new PartialDate(
                selectedDate.year,
                selectedDate.month,
                selectedDate.day,
                hours,
                minutes
            ));
        }

        return times;

    }, [bookedTimes, hours, selectedDate, appointmentDuration])

    function handleSubmission() {
        if (!selectedDate) return;

        const datestring = selectedDate.toISOString();    
        router.push(`../confirm/?employeeId=${employeeId}&datetime=${datestring}${query}`);
    }


    return (
        <div className={styles.controlContainer}>
            <Calendar
                    selectedDate={selectedDate}
                    onSelectionChanged={date => setSelectedDate(date)}
                    unavailableDates={unavailableDates}
                    closedDays={closedDays}/>
            { selectedDate &&
                <div className={styles.timesListContainer}>
                    <h2 className='no-margin'>Available Times</h2>
                    <ul className={styles.timesList}>
                        {availableTimes.map(time => 
                            <li key={time.toString()}>
                                <button
                                    className={
                                        selectedDate && PartialDate.areEqual(time, selectedDate, 'minutes') ?
                                        styles.selectedTime :
                                        styles.unselectedTime
                                    }
                                    onClick={() => setSelectedDate(time)}>
                                    { timeFormatter.format(time.asDate()) }
                                </button>
                            </li>
                        )}
                    </ul>
                    <p className={styles.timeCaption}>
                        {selectedDate?.specificity === 'minutes' ? 
                            dateFormatter.format(selectedDate.asDate()) :
                            'Please select a time.'}
                    </p>
                    <button
                        type='button'
                        onClick={handleSubmission}
                        disabled={selectedDate?.specificity !== 'minutes'}>
                        Next
                    </button>
                </div>
            }
        </div>
    )
}

function timeToMinutes(timeString: string) {
    const hours = Number(timeString.slice(0, 2));
    const minutes = Number(timeString.slice(3, 5));
    return hours * 60 + minutes;
}