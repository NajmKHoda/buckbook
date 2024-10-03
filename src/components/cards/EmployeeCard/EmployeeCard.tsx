'use client';

import { EmployeeObject } from "@/lib/database/models/employee";
import styles from './EmployeeCard.module.css'
import profilePicture from '@/../public/account_pfp.png'
import Image from "next/image";
import { useRef } from 'react';
import { handleEmployeeDeletion } from "./actions";
import { useRouter } from "next/navigation";

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
            <button onClick={() => dialog.current!.showModal()} className={styles.container}>
                <Image
                    src={profilePicture}
                    width={80}
                    height={80}
                    alt='Profile picture' />
                <h2 className='no-margin text-center'>{employee.name}</h2>
            </button>

            <dialog className={styles.dialog} ref={dialog}>
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
            </dialog>
        </>
    )
}