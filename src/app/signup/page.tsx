'use client';

import React, { PropsWithChildren, useState } from "react";
import styles from './SignUpPage.module.css';
import CustomerSignUpForm from "./CustomerSignUpForm";
import BusinessSignUpForm from "./BusinessSignUpForm";

interface TabProps extends PropsWithChildren {
    isSelected: boolean,
    onSelect: () => void
}

enum TabOption {
    Customer,
    Employee,
    Business
}

function Tab({isSelected, onSelect, children}: TabProps) {
    return isSelected ? 
        <div className={styles.tabSelected}>{children}</div> :
        <button className={styles.tabUnselected} onClick={onSelect}>{children}</button>
}

export default function SignUpPage() {
    const [currentTab, setCurrentTab] = useState(TabOption.Customer);

    let form: React.JSX.Element;
    switch (currentTab) {
        case TabOption.Customer:
            form = <CustomerSignUpForm />;
            break;
        case TabOption.Employee:
            form = <p className={styles.formSection}>
                Employee accounts can only be created through business accounts.
                Contact your business administrator to obtain your own account.
            </p>;
            break;
        case TabOption.Business:
            form = <BusinessSignUpForm />;
            break;
    }

    return (
        <section>
            <h1 className='text-center'>Sign Up</h1>
            <h2 className='text-center'>I&apos;m signing up as a(n)...</h2>
            <div className='flex-center'>
                <div className={styles.container}>
                    <div className={styles.tabSection}>
                        <Tab
                            isSelected={currentTab === TabOption.Customer}
                            onSelect={() => setCurrentTab(TabOption.Customer)}>
                            Customer
                        </Tab>
                        <Tab
                            isSelected={currentTab === TabOption.Employee}
                            onSelect={() => setCurrentTab(TabOption.Employee)}>
                            Employee
                        </Tab>
                        <Tab
                            isSelected={currentTab === TabOption.Business}
                            onSelect={() => setCurrentTab(TabOption.Business)}>
                            Business
                        </Tab>
                    </div>
                    {form}
                </div>
            </div>
        </section>
    )
}