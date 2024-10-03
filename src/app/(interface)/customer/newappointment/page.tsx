'use client';

import { useFormState } from "react-dom";
import { handleBusinessSearch } from "./actions";
import styles from './page.module.css';
import Link from "next/link";

export default function NewAppointmentPage() {
    const [businesses, formAction] = useFormState(handleBusinessSearch, [])

    return (
        <>
            <section className='flex-center'>
                <div className={styles.searchContainer}>
                    <label htmlFor='business-field'>Search for a business:</label>
                    <form className={styles.searchBar} action={formAction}>
                        <input type='text' name='search' id='business-field' required/>
                        <button type='submit'>Search</button>
                    </form>
                </div>
            </section>
            <section>
                <h1>Search Results ({businesses.length})</h1>
                <ul className={styles.businessList}>
                    {businesses.map(business => (
                        <li key={business.id}>
                            <Link href={`newappointment/business/${business.id}`} className={styles.listEntry}>
                                {business.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            </section>
        </>
    )
}