'use client';

import { Hours } from "@/lib/database/models/business";
import { useMemo, useState } from "react";
import Calendar from './Calendar/Calendar';
import CalendarDate from "./CalendarDate";
import styles from './AppointmentSelector.module.css';
import { useParams } from "next/navigation";
import { handleAppointmentBooking } from "./actions";

interface Props {
    bookedTimes: string[],
    hours: Hours[],
    appointmentDuration: number
}

function timeToMinutes(timeString: string) {
    const hours = Number(timeString.slice(0, 2));
    const minutes = Number(timeString.slice(3, 5));
    return hours * 60 + minutes;
}

function to12HourString(time: string) {
    let hours = Number(time.slice(0, 2));
    const suffix = hours < 12 ? 'AM' : 'PM';
    hours %= 12;
    if (hours === 0) hours = 12;
    const minutes = time.slice(3, 5);
    return `${hours}:${minutes} ${suffix}`;
}

function datetimeToString(date: CalendarDate, time: string) {
    const hours = Number(time.slice(0, 2));
    const minutes = Number(time.slice(3, 5));
    const dateObj = new Date(date.year, date.month, date.day, hours, minutes);
    return dateObj.toLocaleString('en-US', { dateStyle: 'long', timeStyle: 'short'});
}

export default function AppointmentSelector({ bookedTimes, hours, appointmentDuration }: Props) {
    const [selectedDate, setSelectedDate] = useState(CalendarDate.now());
    const [selectedTime, setSelectedTime] = useState<string>();
    const params = useParams<{employeeId: string}>();

    const unavailableDates = useMemo(() => {
        const appointmentCounts: Record<string, [weekDay: number, count: number]> = {}
        for (const time in bookedTimes) {
            const calendarDate = new CalendarDate(Date.parse(time));
            const dateString = calendarDate.toString();
            if (dateString in appointmentCounts) {
                appointmentCounts[dateString][1] += 1;
            } else {
                appointmentCounts[dateString] = [calendarDate.weekDay, 1];
            }
        }

        const maxAppointments = hours.map(day => {
            if (!day.isOpen) return 0;
            const opening = timeToMinutes(day.opening!);
            const closing = timeToMinutes(day.closing!);
            return Math.floor((closing - opening) / appointmentDuration);
        })

        const unavailable: string[] = []
        for (const date in appointmentCounts) {
            const [day, count] = appointmentCounts[date];
            if (count >= maxAppointments[day]) unavailable.push(date);
        }
        return unavailable;

    }, [bookedTimes, hours, appointmentDuration]);

    const closedDays = useMemo(
        () => hours.map((day, i) => !day.isOpen ? i : -1).filter(x => x != -1),
        [hours]
    );
    
    const availableTimes = useMemo(() => {
        const dayBookedTimes = bookedTimes
            .map(time => new Date(time))
            .filter(date => selectedDate.equals(date))
            .map(date => date.getHours() * 60 + date.getMinutes());

        const dayHours = hours[selectedDate.weekDay];
        if (!dayHours.isOpen) return [];

        const opening = timeToMinutes(dayHours.opening!);
        const closing = timeToMinutes(dayHours.closing!);
        const times = [];
        for (let time = opening; time < closing; time += appointmentDuration) {
            if (dayBookedTimes.includes(time)) continue;
            const hourString = Math.floor(time / 60).toString().padStart(2, '0');
            const minuteString = (time % 60).toString().padStart(2, '0');
            times.push(`${hourString}:${minuteString}`);
        }

        return times;
    }, [bookedTimes, hours, selectedDate, appointmentDuration])

    function handleSubmission() {
        const hours = Number(selectedTime!.slice(0, 2));
        const minutes = Number(selectedTime!.slice(3, 5));
        const date = new Date(selectedDate.year, selectedDate.month, selectedDate.day, hours, minutes);
        handleAppointmentBooking(date.toISOString(), params.employeeId);
    }

    return (
        <div className={styles.controlContainer}>
            <Calendar
                    selectedDate={selectedDate}
                    onSelectionChanged={date => {
                        setSelectedDate(date);
                        setSelectedTime(undefined);
                    }}
                    unavailableDates={unavailableDates}
                    closedDays={closedDays}/>
            <div className={styles.timesListContainer}>
                <h2 className='no-margin'>Available Times</h2>
                <ul className={styles.timesList}>
                    {availableTimes.map(time =>
                        <li key={`${selectedDate.toString()} ${time}`}>
                            <button
                                className={selectedTime === time ? styles.selectedTime : styles.unselectedTime}
                                onClick={() => setSelectedTime(time)}>
                                {to12HourString(time)}
                            </button>
                        </li>)
                    }
                </ul>
                <p className={styles.timeCaption}>
                    {selectedTime ? 
                        datetimeToString(selectedDate, selectedTime) :
                        'Please select a time.'}
                </p>
                <button type='button' onClick={handleSubmission} disabled={!selectedTime}>Book Appointment</button>
            </div>
        </div>
    )
}