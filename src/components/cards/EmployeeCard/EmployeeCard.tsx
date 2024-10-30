'use client';

import { EmployeeObject } from "@/lib/database/models/employee";
import styles from './EmployeeCard.module.css'
import { useRef } from 'react';
import { handleEmployeeDeletion } from "./actions";
import { useRouter } from "next/navigation";
import Card from '../Card';
import Icon from '@/components/Icon';
import Dialog from '@/components/Dialog/Dialog';

interface EmployeeCardProps {
    employeeJSON: string
}

export default function EmployeeCard({ employeeJSON }: EmployeeCardProps) {
    const employee: EmployeeObject = JSON.parse(employeeJSON);
    const dialog = useRef<HTMLDialogElement>(null);
    const router = useRouter();

    async function handleRemoveButtonClick() {
        await handleEmployeeDeletion(employee._id);
        dialog.current!.close();
        router.refresh();
    }

    return (
        <>
            <Card onClick={() => dialog.current!.showModal()} >
                <Icon name='account_circle' className={styles.employeeIcon} />
                <p className={styles.label}>{employee.name}</p>
            </Card>

            <Dialog className={styles.dialog} ref={dialog}>
                <h2 className='no-margin'>{employee.name}</h2>
                <p className='no-margin'>Phone Number: {employee.phone}</p>
                <p className='no-margin'>Email Address: {employee.email}</p>
                <div className={styles.dialogButtonContainer}>
                    <button onClick={() => dialog.current!.close()} autoFocus>Close</button>
                    <button
                        onClick={handleRemoveButtonClick}
                        className={styles.removeEmployeeButton}
                        autoFocus>
                        Remove
                    </button>
                </div>
            </Dialog>
        </>
    )
}