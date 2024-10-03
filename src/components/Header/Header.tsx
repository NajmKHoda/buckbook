import styles from './Header.module.css'
import { getAccount } from '@/lib/session';
import Link from 'next/link';

export default async function Header() {
    const name = (await getAccount())?.name ?? 
        <>
            <Link className={styles.userLinks} href='/login'>Log in</Link>
            <> or </>
            <Link className={styles.userLinks} href='/signup'>Sign up</Link>
        </>;

    return (
        <header className={styles.container}>
            <h1 className='no-margin'>BuckBook</h1>
            <h1 className='no-margin'>{name}</h1>
        </header>
    )
}