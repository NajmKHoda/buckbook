
import { CSSProperties } from "react";
import { AppointmentDetails } from "../../AppointmentCalendar"
import PartialDate from '@/lib/PartialDate'; 
import styles from './AppointmentView.module.css';

interface Props {
    details: AppointmentDetails;
    duration: number;
}

const timeFormatter = Intl.DateTimeFormat('en-US', { timeStyle: 'short' });

export default function AppointmentView({ details, duration }: Props) {
    const { customerName } = details;
    const startDate = new PartialDate('minutes', details.date);
    const endDate = startDate.adjust(0,0,0,0, duration);

    const topPercent = asPercent(startDate);
    const bottomPercent = 100.0 - asPercent(endDate);
    const style: CSSProperties = {
        top: `${topPercent}%`,
        bottom: `${bottomPercent}%`
    }

    const start = timeFormatter.format(startDate.asDate());
    const end = timeFormatter.format(endDate.asDate());
    return (
        <div style={style} className={ styles.container }>
            <p className='text-center no-margin'>{ customerName }</p>
            <p className='text-center no-margin'>{ start } to { end }</p>
        </div>
    )
}

function asPercent(date: PartialDate) {
    const minutes = date.hours! * 60 + date.minutes!;
    return minutes / 1440 * 100; // 1440 minutes in a day.
}