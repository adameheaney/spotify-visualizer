import React from 'react';
import styles from './MainPage.module.css';
import { useState } from 'react';

const MainPage = ({children, onLogout}) => {
    return (
        <div className={styles.pageContainer}>
            <div className={styles.leftContainer}>
                <h2>Settings</h2>
                <button onClick={onLogout}>Log out</button>
            </div>
            <div className={styles.mainContent}>
                {children}
            </div>
            <div className={styles.rightContainer}>
                <h2>Currently Playing</h2>
                <div className={styles.currentSong}>
                    <p>Song Title</p>
                    <p>Artist Name</p>
                </div>
            </div>
        </div>
    );
};

export default MainPage;