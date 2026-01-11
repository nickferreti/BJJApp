export type Role = 'student' | 'professor';

export type Belt = 'Branca' | 'Azul' | 'Roxa' | 'Marrom' | 'Preta';

export interface User {
    id: string;
    name: string;
    email: string;
    role: Role;
    avatarUrl?: string;
}

export interface Student extends User {
    role: 'student';
    belt: Belt;
    stripes: number; // 0-4
    attendance: number; // class count
    requiredAttendance: number; // for next belt/stripe
    isPaymentLate: boolean;
    nextClass?: string; // e.g. "Hoje, 19:30"
}

export interface Professor extends User {
    role: 'professor';
}

export interface Video {
    id: string;
    title: string;
    category: string; // e.g., 'Passagem', 'Guarda'
    beltLevel: Belt;
    url: string; // youtube/vimeo link
    thumbnailUrl: string;
    tags: string[];
}

export interface Transaction {
    id: string;
    studentId: string;
    studentName: string;
    amount: number;
    date: string;
    status: 'paid' | 'pending' | 'overdue';
    description: string;
}

export interface CalendarEvent {
    id: string;
    title: string;
    date: string;
    time?: string;
    location?: string;
    mapsLink?: string;
    description: string;
    type: 'seminar' | 'class' | 'tournament';
}
