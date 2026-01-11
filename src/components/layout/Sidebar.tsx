import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../lib/utils';
import { Home, PlaySquare, User as UserIcon, Wallet, CalendarDays, Users, Upload, LogOut } from 'lucide-react';

export function Sidebar() {
    const { user, logout } = useAuth();

    if (!user) return null;

    const studentLinks = [
        { to: '/student/dashboard', icon: Home, label: 'Início' },
        { to: '/student/videos', icon: PlaySquare, label: 'Vídeos' },
        { to: '/student/profile', icon: UserIcon, label: 'Perfil' },
        { to: '/student/financial', icon: Wallet, label: 'Financeiro' },
        { to: '/student/events', icon: CalendarDays, label: 'Eventos' },
    ];

    const professorLinks = [
        { to: '/professor/dashboard', icon: Home, label: 'Visão Geral' },
        { to: '/professor/students', icon: Users, label: 'Alunos' },
        { to: '/professor/content', icon: Upload, label: 'Conteúdo' },
        { to: '/professor/financial', icon: Wallet, label: 'Financeiro' },
        { to: '/professor/events', icon: CalendarDays, label: 'Eventos' },
    ];

    const links = user.role === 'student' ? studentLinks : professorLinks;

    return (
        <div className="hidden h-screen w-64 flex-col border-r bg-white md:flex">
            <div className="p-6">
                <h1 className="text-2xl font-bold text-gray-900">BJJ Academy</h1>
                <p className="text-sm text-gray-500">Sistema de Gestão</p>
            </div>

            <nav className="flex-1 space-y-1 px-4">
                {links.map((link) => (
                    <NavLink
                        key={link.to}
                        to={link.to}
                        className={({ isActive }) =>
                            cn(
                                'flex items-center space-x-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                                isActive
                                    ? 'bg-blue-50 text-blue-600'
                                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                            )
                        }
                    >
                        <link.icon className="h-5 w-5" />
                        <span>{link.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="border-t p-4">
                <div className="flex items-center space-x-3 px-2 py-3">
                    <img src={user.avatarUrl} alt={user.name} className="h-8 w-8 rounded-full bg-gray-200" />
                    <div className="flex-1 overflow-hidden">
                        <p className="truncate text-sm font-medium text-gray-900">{user.name}</p>
                        <p className="truncate text-xs text-gray-500 capitalize">{user.role === 'student' ? 'Aluno' : 'Professor'}</p>
                    </div>
                </div>
                <button
                    onClick={logout}
                    className="flex w-full items-center space-x-3 rounded-md px-2 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                >
                    <LogOut className="h-5 w-5" />
                    <span>Sair</span>
                </button>
            </div>
        </div>
    );
}
