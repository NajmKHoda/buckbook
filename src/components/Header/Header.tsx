import styles from './Header.module.css'
import { getAccount } from '@/lib/session';
import Link from 'next/link';

export default async function Header() {
    const name = (await getAccount(undefined, false))?.name ?? <Link href='/login'>Log In</Link>;

    return (
        <header className={styles.container}>
            <h1 className='no-margin'>BuckBook</h1>
            <p className={styles.name}>{name}</p>
        </header>
    )
}