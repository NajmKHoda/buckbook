'use client'

import Icon from '@/components/Icon';
import styles from './NavControl.module.css';
import { PropsWithChildren } from 'react';

interface Props extends PropsWithChildren {
    backDisabled: boolean,
    onBack: () => unknown;
    onForward: () => unknown;
}

export default function NavControl({ backDisabled, onBack, onForward, children }: Props) {
    return (
        <div className={ styles.navigation }>
            <button
                type='button'
                className={ styles.navButton }
                onClick={ onBack }
                disabled={ backDisabled }>
                <Icon name='arrow_back' />
            </button>
            <p className={ styles.label }>{ children }</p>
            <button
                type='button'
                className={ styles.navButton }
                onClick={ onForward }>
                <Icon name='arrow_forward' />
            </button>
        </div>
    )
}