'use client';

import LinkButton from '@/components/input/LinkButton/LinkButton';
import styles from './UserInfo.module.css';
import Icon from '@/components/Icon';
import { logout } from './actions';
import { useState } from 'react';
import useMediaQuery from '@/lib/hooks/useMediaQuery';

interface Props {
    name?: string
}

export default function UserInfo({ name }: Props) {
    const small = useMediaQuery('screen and (width <= 500px)');
    const [dropdownVisible, setDropdownVisible] = useState(false);

    function toggleDropdown() {
        setDropdownVisible(!dropdownVisible);
    }

    return name ?
    (
        <div className={ styles.container }>
            <button type='button' className={ styles.userButton } onClick={ toggleDropdown }>
                { small ? <Icon className={ styles.userIcon } name='account_circle' /> : name }
                <Icon className={ styles.userIcon } name={dropdownVisible ? 'arrow_drop_up' : 'arrow_drop_down' } />
            </button>
            {dropdownVisible &&
                <button type='button' className={ styles.userMenuButton } onClick={ () => logout() }>
                    <Icon name='logout' /> Log Out
                </button>}  
        </div>
    ) :
    (
        <LinkButton href='/login' className={ styles.loginContainer}>
            Log In
        </LinkButton>
    )
}