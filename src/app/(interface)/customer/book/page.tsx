'use client';

import { useFormState } from "react-dom";
import { handleBusinessSearch } from "./actions";
import styles from './page.module.css';
import SubmitButton from "@/components/input/SubmitButton/SubmitButton";
import Icon from "@/components/Icon";
import Card from '@/components/cards/Card';

interface Props {
    searchParams: {
        edit?: string;
    }
}

export default function NewAppointmentPage({ searchParams }: Props) {
    const [businesses, formAction] = useFormState(handleBusinessSearch, [])
    
    const query = searchParams.edit ? `?edit=${searchParams.edit}` : '';

    return (
        <section>
            <h2 className='text-center'>Search for a business.</h2>
            <form action={formAction} className={styles.searchForm}>
                <label htmlFor='search-field'>Search by name:</label>
                <div className={styles.searchInput}>
                    <input id='search-field' name='search' className={styles.searchField} />
                    <SubmitButton className={styles.searchButton}>
                        <Icon className={styles.searchIcon} name='search' />
                    </SubmitButton>
                </div>
            </form>
            <div className={styles.searchResultsContainer}>
                {businesses.length == 0 ? 
                    <p className={styles.searchResultsPlaceholder}>Start searching to see results here.</p>
                    :
                    <div className={styles.businessesContainer}>
                        {businesses.map(business => (
                            <Card key={business.id} href={`./book/business/${business.id}${query}`}>
                                <Icon className={styles.businessIcon} name='apartment' />
                                <p className={styles.businessLabel}>{business.name}</p>
                            </Card>
                        ))}
                    </div>
                }
            </div>
        </section>
    )
}