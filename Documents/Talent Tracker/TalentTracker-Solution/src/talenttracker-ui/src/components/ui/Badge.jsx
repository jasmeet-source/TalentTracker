import React from 'react';

const Badge = ({ children, color = "blue" }) => {
    const colors = {
        blue: "bg-blue-100 text-blue-800",
        green: "bg-green-100 text-green-800",
        red: "bg-red-100 text-red-800",
        yellow: "bg-yellow-100 text-yellow-800",
        gray: "bg-gray-100 text-gray-800",
        black: "bg-gray-800 text-white"
    };
    return (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${colors[color] || colors.gray}`}>
            {children}
        </span>
    );
};

export default Badge;
