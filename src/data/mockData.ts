import { Student, Professor, Video, Transaction, CalendarEvent } from '../types';

export const currentUser: Student = {
    id: 's1',
    name: 'João Silva',
    email: 'joao@bjj.com',
    role: 'student',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=joao',
    belt: 'Branca',
    stripes: 2,
    attendance: 24,
    requiredAttendance: 50, // for 3rd stripe
    isPaymentLate: false,
    nextClass: 'Segunda, 19:00',
};

export const adminUser: Professor = {
    id: 'p1',
    name: 'Mestre Carlos',
    email: 'mestre@bjj.com',
    role: 'professor',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mestre',
};

export const mockStudents: Student[] = [
    currentUser,
    {
        id: 's2',
        name: 'Maria Oliveira',
        email: 'maria@bjj.com',
        role: 'student',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=maria',
        belt: 'Azul',
        stripes: 1,
        attendance: 12,
        requiredAttendance: 100,
        isPaymentLate: true,
        nextClass: 'Terça, 07:00'
    }
];

export const mockVideos: Video[] = [
    {
        id: 'v1',
        title: 'Fuga de Quadril Básica',
        category: 'Fundamentos',
        beltLevel: 'Branca',
        url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Placeholder
        thumbnailUrl: 'https://img.youtube.com/vi/dQw4w9WgXcQ/0.jpg',
        tags: ['Aquecimento', 'Defesa']
    },
    {
        id: 'v2',
        title: 'Armlock da Guarda Fechada',
        category: 'Finalização',
        beltLevel: 'Branca',
        url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        thumbnailUrl: 'https://img.youtube.com/vi/dQw4w9WgXcQ/0.jpg',
        tags: ['Guarda Fechada', 'Braço']
    },
    {
        id: 'v3',
        title: 'Passagem Torreando',
        category: 'Passagem',
        beltLevel: 'Azul',
        url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        thumbnailUrl: 'https://img.youtube.com/vi/dQw4w9WgXcQ/0.jpg',
        tags: ['Passagem', 'Velocidade']
    }
];

export const mockTransactions: Transaction[] = [
    {
        id: 't1',
        studentId: 's1',
        studentName: 'João Silva',
        amount: 250.00,
        date: '2023-10-05',
        status: 'paid',
        description: 'Mensalidade Outubro'
    },
    {
        id: 't2',
        studentId: 's1',
        studentName: 'João Silva',
        amount: 250.00,
        date: '2023-11-05',
        status: 'pending',
        description: 'Mensalidade Novembro'
    },
    {
        id: 't3',
        studentId: 's2',
        studentName: 'Maria Oliveira',
        amount: 250.00,
        date: '2023-10-05',
        status: 'overdue',
        description: 'Mensalidade Outubro'
    }
];

export const mockEvents: CalendarEvent[] = [
    {
        id: 'e1',
        title: 'Seminário de Defesa Pessoal',
        date: '2023-12-10',
        description: 'Aprenda técnicas essenciais de defesa pessoal.',
        type: 'seminar'
    },
    {
        id: 'e2',
        title: 'Graduação de Final de Ano',
        date: '2023-12-20',
        description: 'Cerimônia de entrega de faixas e graus.',
        type: 'class'
    }
];
