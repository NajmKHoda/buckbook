import BookingProgressCue from "@/components/BookingProgressCue/BookingProgressCue";
import { PropsWithChildren } from "react";


export default function NewAppointmentLayout({ children }: PropsWithChildren) {
    return (
        <>
            <h1 className='text-center'>Book an Appointment</h1>
            <BookingProgressCue />
            {children}
        </>
    )
}