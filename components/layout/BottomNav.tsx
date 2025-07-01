import React from 'react';
import { NavLink } from 'react-router-dom';
import { ICONS } from '../../constants';

const navItems = [
    { path: '/', label: 'Home', icon: <ICONS.Home className="w-6 h-6 mx-auto mb-1" /> },
    { path: '/chill', label: 'Chill', icon: <ICONS.Sparkles className="w-6 h-6 mx-auto mb-1" /> },
    { path: '/analysis', label: 'Analysis', icon: <ICONS.ClipboardList className="w-6 h-6 mx-auto mb-1" /> },
];

const BottomNav = (): React.ReactNode => {
    const activeLinkClass = 'text-indigo-600';
    const inactiveLinkClass = 'text-slate-500 hover:text-indigo-500';

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-t border-slate-200 shadow-t-lg">
            <div className="flex justify-around max-w-lg mx-auto">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        end
                        className={({ isActive }) => 
                            `flex-1 text-center pt-3 pb-2 text-xs font-medium transition-colors duration-200 ${isActive ? activeLinkClass : inactiveLinkClass}`
                        }
                    >
                        {item.icon}
                        {item.label}
                    </NavLink>
                ))}
            </div>
        </nav>
    );
};

export default BottomNav;
