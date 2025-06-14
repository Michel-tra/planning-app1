import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

function ScannerBadge() {
    const [badge, setBadge] = useState('');
    const [message, setMessage] = useState('');
    const inputRef = useRef(null);

    const playBeep = (success = true) => {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = ctx.createOscillator();
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(success ? 600 : 200, ctx.currentTime); // 600 Hz pour success, 200 Hz pour erreur
        oscillator.connect(ctx.destination);
        oscillator.start();
        oscillator.stop(ctx.currentTime + (success ? 0.2 : 0.5)); // 0.2s pour success, 0.5s pour erreur
    };

    const handleScan = async (badgeCode) => {
        try {
            const res = await axios.post('http://localhost:5000/api/pointages/pointeur', {
                badge_code: badgeCode
            });
            setMessage(res.data.message);
            playBeep(true);
        } catch (err) {
            console.error('Erreur lors du pointage :', err);
            setMessage('Erreur lors du pointage.');
            playBeep(false);
        }
    };

    useEffect(() => {
        if (badge.length >= 3) {
            handleScan(badge);
            setBadge('');
        }
    }, [badge]);

    useEffect(() => {
        inputRef.current.focus();
    }, []);

    return (
        <div style={styles.container}>
            <div style={styles.box}>
                <h2 style={styles.title}>Scanner un badge</h2>
                <input
                    type="text"
                    ref={inputRef}
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    placeholder="Scannez ici..."
                    style={styles.input}
                    autoFocus
                />
                {message && <p style={styles.message}>{message}</p>}
            </div>
        </div>
    );
}

const styles = {
    container: {
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#f7f7f7',
    },
    box: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '2rem',
        borderRadius: '10px',
        background: '#fff',
        boxShadow: '0 0 15px rgba(0,0,0,0.1)',
    },
    title: {
        marginBottom: '1rem',
    },
    input: {
        padding: '0.7rem',
        fontSize: '1.2rem',
        width: '300px',
        textAlign: 'center',
    },
    message: {
        marginTop: '1rem',
        color: 'green',
        fontWeight: 'bold',
    },
};

export default ScannerBadge;
