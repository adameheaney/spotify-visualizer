import React from 'react';
import {useState, useEffect} from 'react';
import styles from './LoginModal.module.css';

const BACKEND_URL = 'http://localhost:3001';

const LoginModal = () => {
    const [accessToken, setAccessToken] = useState(null);

    useEffect(() => {
        // Extract tokens from URL
        const params = new URLSearchParams(window.location.search);
        const token = params.get('access_token');

        if (token) {
            localStorage.setItem('spotify_access_token', token);
            setAccessToken(token);
            window.history.replaceState({}, document.title, '/'); // Clean URL
        } else {
            const storedToken = localStorage.getItem('spotify_access_token');
            if (storedToken) setAccessToken(storedToken);
        }
    }, []);

    return (
        <div className={styles.modal}>
            <h1>Spotify Login</h1>
            {!accessToken ? (
                <a href={`${BACKEND_URL}/login`}>
                    <button>Login with Spotify</button>
                </a>
            ) : (
                <p>Logged in!</p>
            )}
        </div>
    );
};

export default LoginModal;