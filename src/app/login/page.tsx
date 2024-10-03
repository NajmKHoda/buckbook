'use client';

import { useFormState } from 'react-dom';
import styles from './LoginPage.module.css';
import { handleLogin} from './actions';
import { FormItem } from '@/components/input/FormItem/FormItem';
import SubmitButton from '@/components/input/SubmitButton';

export default function LoginPage() {
    const [status, formAction] = useFormState(handleLogin, 'initial');

    function validateUsername(username: string) {
        if (!/^\w*$/.test(username)) {
            return 'Usernames can only contain letters, digits, and underscores.'
        }
    }

    let errorMessage: string;
    switch (status) {
        case 'user-not-found':
            console.log(status);
            errorMessage = 'That user does not exist.';
            break;
        case 'incorrect-password':
            errorMessage = 'Incorrect password.';
            break;
        case 'unknown-error':
            errorMessage = 'An unknown error occurred.';
            break;
        default:
            errorMessage = '';
            break;
    }

    return (
        <section>
            <h1 className='text-center'>Login</h1>
            <div className='flex-center'>
                <form action={formAction} className={styles.loginForm}>
                    {errorMessage ? <p className={styles.errorMessage}>{errorMessage}</p> : null}
                    <FormItem name='Username' minLength={5} maxLength={20} customValidator={validateUsername} />
                    <FormItem name='Password' type='password' />
                    <SubmitButton>Log In</SubmitButton>
                </form>
            </div>
        </section>
    );
}