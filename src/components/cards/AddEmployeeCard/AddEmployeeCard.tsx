'use client';

import Image from 'next/image'
import { useRef } from 'react'
import styles from './AddEmployeeCard.module.css'
import addIcon from '@/../public/add_icon.png'
import { FormItem } from '@/components/input/FormItem/FormItem';
import SubmitButton from '@/components/input/SubmitButton';
import { handleEmployeeCreation } from './actions';
import { useRouter } from 'next/navigation'

interface AddEmployeeCardProps {
    businessId: string
}

export default function AddEmployeeCard({ businessId }: AddEmployeeCardProps) {
    const dialog = useRef<HTMLDialogElement>(null);
    const form = useRef<HTMLFormElement>(null);
    const router = useRouter();

    async function handleFormSubmission(formData: FormData) {
        await handleEmployeeCreation(businessId, formData);
        dialog.current!.close();
        form.current!.reset();
        router.refresh();
    }

    return (
        <>
            <button onClick={() => dialog.current!.showModal()} className={styles.container}>
                <Image
                    src={addIcon}
                    width={80}
                    height={80}
                    alt='Profile picture' />
                <h2 className='no-margin text-center'>Add Employee</h2>
            </button>

            <dialog ref={dialog} className={styles.dialog}>
                <form action={handleFormSubmission} ref={form} className={styles.addEmployeeForm}>
                    <h3 className='no-margin'>Employee Information</h3>
                    <FormItem name='Name' />
                    <FormItem name='Bio' />
                    <FormItem name='Email Address' type='email' />
                    <FormItem name='Phone Number' type='tel' />

                    <h3 className='no-margin'>Account Credentials</h3>
                    <FormItem name='Username' />
                    <FormItem name='Password' type='password' />

                    <SubmitButton>Add Employee</SubmitButton>
                </form>
            </dialog>
        </>
    )
}