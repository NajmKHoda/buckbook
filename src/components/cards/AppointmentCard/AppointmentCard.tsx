'use client';

import { useRef } from 'react';
import { handleAppointmentDeletion } from './actions';
import styles from './AppointmentCard.module.css'
import { useRouter } from 'next/navigation';

interface Props {
    appointmentId: string
    businessName: string;
    employeeName: string;
    dateString: string;
}

export default function AppointmentCard({ appointmentId, businessName, employeeName, dateString }: Props) {
    const dialog = useRef<HTMLDialogElement>(null);
    const router = useRouter();

    const date = new Date(dateString);
    const displayDate = date.toLocaleDateString('en-US', { dateStyle: 'long' });
    const displayTime = date.toLocaleTimeString('en-US', { timeStyle: 'short' });

    async function handleDeleteButtonClick() {
        await handleAppointmentDeletion(appointmentId);
        router.refresh();
    }

    return (
        <>
            <button onClick={() => dialog.current!.showModal()} className={styles.card}>
                <h3 className='no-margin'>{businessName}</h3>
                <p className='no-margin'>{displayDate}</p>
                <p className='no-margin'>{displayTime}</p>
            </button>
            <dialog ref={dialog}>
                <h1 className={styles.dialogTitle}>Appointment Information</h1>
                <table className={styles.infoTable}>
                    <tbody>
                        <tr>
                            <th>Business</th>
                            <td>{businessName}</td>
                        </tr>
                        <tr>
                            <th>Employee</th>
                            <td>{employeeName}</td>
                        </tr>
                        <tr>
                            <th>Location</th>
                            <td>Unknown</td>
                        </tr>
                        <tr>
                            <th>Time</th>
                            <td>{displayDate} at {displayTime}</td>
                        </tr>
                    </tbody>
                </table>
                <div className={styles.dialogOptionContainer}>
                    <button autoFocus>Edit</button>
                    <button onClick={handleDeleteButtonClick} className={styles.deleteButton}>Cancel</button>
                </div>
            </dialog>
        </>
    )
}