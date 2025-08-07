import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/api'; // Assure-toi que ce chemin est correct
import '../../styles/App.css'; // Assure-toi que ce chemin est correct

function ScannerBadge() {
    const [badge, setBadge] = useState('');
    const [message, setMessage] = useState('');
    const inputRef = useRef(null);
    const navigate = useNavigate();

    const playBeep = (success = true) => {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = ctx.createOscillator();
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(success ? 600 : 200, ctx.currentTime);
        oscillator.connect(ctx.destination);
        oscillator.start();
        oscillator.stop(ctx.currentTime + (success ? 0.2 : 0.5));
    };

    const handleScan = async (badgeCode) => {
        try {
            const res = await API.post(`/api/pointages/pointeur`, {
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
        <div className="scanner-container">
            <div className="scanner-box">
                <button className="back-btn" onClick={() => navigate('/pointeur')}>
                    ⬅ Retour au Dashboard
                </button>

                <h2 className="scanner-title">🔍 Scanner un badge</h2>
                <input
                    type="text"
                    ref={inputRef}
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    placeholder="Scannez ici..."
                    className="scanner-input"
                    autoFocus
                />
                {message && <p className="scanner-message">{message}</p>}
            </div>
        </div>
    );
}

export default ScannerBadge;
