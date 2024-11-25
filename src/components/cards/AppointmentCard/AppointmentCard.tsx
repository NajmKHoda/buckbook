'use client';

import { useRef } from 'react';
import { handleAppointmentDeletion } from './actions';
import styles from './AppointmentCard.module.css'
import { useRouter } from 'next/navigation';
import Card from '../Card';
import Dialog from '@/components/Dialog/Dialog'
import LinkButton from '@/components/input/LinkButton/LinkButton';

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
            <Card onClick={() => dialog.current!.showModal()}>
                <p className={styles.businessName}>{businessName}</p>
                <p className='no-margin'>{displayDate}</p>
                <p className='no-margin'>{displayTime}</p>
            </Card>
            
            <Dialog ref={dialog} className={styles.dialog}>
                <h1 className='no-margin'>Appointment Information</h1>
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
                    <LinkButton href={`book/confirm?edit=${appointmentId}`} >Edit</LinkButton>
                    <button onClick={handleDeleteButtonClick} className={styles.deleteButton}>Cancel</button>
                </div>
            </Dialog>
        </>
    )
}