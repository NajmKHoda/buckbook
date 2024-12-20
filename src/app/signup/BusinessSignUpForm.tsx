'use client';

import FormItem from "@/components/input/FormItem/FormItem";
import styles from './SignUpPage.module.css';
import SubmitButton from "@/components/input/SubmitButton/SubmitButton";
import { TimeRangeInput } from "@/components/input/TimeRangeInput/TimeRangeInput";
import { handleBusinessSignUp } from "./actions";
import useMediaQuery from "@/lib/hooks/useMediaQuery";
import { Fragment } from "react";

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
function validateUsername(username: string) {
    if (!/^\w*$/.test(username)) {
        return 'Username can only contain letters, digits, and underscores.'
    }
}

export default function BusinessSignUpForm() {
    const tooSmall = useMediaQuery("screen and (width <= 1100px)");

    return (
        <form action={handleBusinessSignUp} className={styles.formSection}>
            <h3 className={styles.formSubsectionHeader}>Business Information</h3>
            <FormItem name='Business Name' />
            <FormItem name='Description' />
            <FormItem name='Phone Number' type='tel' />
            <FormItem name='Email Address' type='email' />
            
            <h3 className={styles.formSubsectionHeader}>Hours</h3>
            {tooSmall ? 
                <div className={styles.hoursMobile}>
                    {days.map((day, index) => (
                        <Fragment key={index}>
                            <h4 className="no-margin">{day}</h4>
                            <TimeRangeInput index={index} compact />
                        </Fragment>
                    ))}
                </div>
                :
                <table className={styles.hoursContainer}>
                    {days.map((day, index) => (
                        <tr key={index}>
                            <th className={styles.hoursDay}>{day}: </th>
                            <td><TimeRangeInput index={index} /></td>
                        </tr>
                    ))}
                </table>
            }
            <FormItem name='Appointment Duration' units='minutes' min={1} type='number' />

            <h3 className={styles.formSubsectionHeader}>Account Credentials</h3>
            <FormItem name='Username' minLength={5} maxLength={20} customValidator={validateUsername} />
            <FormItem name='Password' type='password'/>

            <SubmitButton>Sign Up</SubmitButton>
        </form>
    )
}