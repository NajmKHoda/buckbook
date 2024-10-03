'use client';

import { FormItem } from "@/components/input/FormItem/FormItem";
import { handleCustomerSignUp } from "./actions";
import styles from './SignUpPage.module.css';
import SubmitButton from "@/components/input/SubmitButton";

function validateUsername(username: string) {
    if (!/^\w*$/.test(username)) {
        return 'Username can only contain letters, digits, and underscores.'
    }
}

export default function CustomerSignUpForm() {
    return (
        <form action={handleCustomerSignUp} className={styles.formSection}>
            <h3 className={styles.formSubsectionHeader}>Personal Information</h3>
            <FormItem name='Name' />
            <FormItem name='Email Address' type='email' />
            <FormItem name='Phone Number' type='tel' pattern='\d{3}-\d{3}-\d{4}'/>

            <h3 className={styles.formSubsectionHeader}>Account Credentials</h3>
            <FormItem name='Username' minLength={5} maxLength={20} customValidator={validateUsername} />
            <FormItem name='Password' type='password'/>

            <SubmitButton>Sign Up</SubmitButton>
        </form>
    )
}