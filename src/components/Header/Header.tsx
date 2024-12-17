import styles from './Header.module.css'
import { getAccount } from '@/lib/session';
import UserInfo from './UserInfo/UserInfo';

export default async function Header() {
    const name = (await getAccount(undefined, false))?.name;

    return (
        <header className={styles.container}>
            <h1 className={ styles.title }>BuckBook</h1>
            <UserInfo name={ name } />
        </header>
    )
}