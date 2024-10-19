'use client';

import { handleSubmit } from "./actions";

interface Props {
    employeeId: string,
    datetime: string
}

export default function AppointmentConfirmButton({ employeeId, datetime }: Props) {
    return <button onClick={() => handleSubmit(employeeId, datetime)}>Book Appointment</button>
}