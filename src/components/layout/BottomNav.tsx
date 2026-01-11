import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../lib/utils';
import { Home, PlaySquare, User as UserIcon, Wallet, Menu } from 'lucide-react';

export function BottomNav() {
    const { user } = useAuth();

    if (!user) return null;

    // Simplified links for mobile
    const studentLinks = [
        { to: '/student/dashboard', icon: Home, label: 'Início' },
        { to: '/student/videos', icon: PlaySquare, label: 'Vídeos' },
        { to: '/student/financial', icon: Wallet, label: 'Financeiro' },
        { to: '/student/profile', icon: UserIcon, label: 'Perfil' },
    ];

    const professorLinks = [
        { to: '/professor/dashboard', icon: Home, label: 'Início' },
        { to: '/professor/students', icon: UserIcon, label: 'Alunos' },
        { to: '/professor/content', icon: PlaySquare, label: 'Vídeos' },
        { to: '/professor/financial', icon: Wallet, label: 'Finanças' },
    ];

    const links = user.role === 'student' ? studentLinks : professorLinks;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t bg-white px-2 shadow-[0_-1px_3px_rgba(0,0,0,0.1)] md:hidden">
            {links.map((link) => (
                <NavLink
                    key={link.to}
                    to={link.to}
                    className={({ isActive }) =>
                        cn(
                            'flex flex-col items-center justify-center space-y-1 px-3 py-1 text-xs font-medium transition-colors',
                            isActive ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900'
                        )
                    }
                >
                    <link.icon className="h-5 w-5" />
                    <span>{link.label}</span>
                </NavLink>
            ))}
        </div>
    );
}
