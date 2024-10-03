import styles from './Header.module.css'
import { getAccount } from '@/lib/session';

export default async function Header() {
    const name = (await getAccount())?.name ?? 'Sign in';

    return (
        <header className={styles.container}>
            <h1 className='no-margin'>BuckBook</h1>
            <h1 className='no-margin'>{name}</h1>
        </header>
    )
}