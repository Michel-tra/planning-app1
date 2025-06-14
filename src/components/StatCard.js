// components/StatCard.js
import React from 'react';

function StatCard({ icon, title, value, bgColor = 'bg-white' }) {
    return (
        <div className={`p-4 rounded shadow ${bgColor}`}>
            <div className="text-3xl mb-2">{icon}</div>
            <div className="text-sm text-gray-500">{title}</div>
            <div className="text-xl font-bold">{value}</div>
        </div>
    );
}

export default StatCard;
