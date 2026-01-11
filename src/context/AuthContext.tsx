import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '../types';
import { login as apiLogin } from '../services/api';

interface AuthContextType {
    user: User | null;
    login: (role: 'student' | 'professor', email?: string, password?: string) => Promise<void>;
    logout: () => void;
    isLoading: boolean;
    error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const login = async (role: 'student' | 'professor', email?: string, password?: string) => { // Role arg kept for compatibility with Login.tsx for now, though API uses email
        setIsLoading(true);
        setError(null);
        try {
            // For MVP convenience, if no email/pass provided (like from the buttons in Login.tsx), use hardcoded defaults
            // In a real app, Login.tsx would capture inputs.
            // Let's modify Login.tsx to actually send these.
            // For now, if role is passed but no creds, auto-fill mock creds
            const finalEmail = email || (role === 'student' ? 'joao@bjj.com' : 'mestre@bjj.com');
            const finalPass = password || (role === 'student' ? 'aluno123' : 'admin123');

            const response = await apiLogin(finalEmail, finalPass);
            setUser(response.user);
        } catch (err) {
            setError('Login failed');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isLoading, error }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
