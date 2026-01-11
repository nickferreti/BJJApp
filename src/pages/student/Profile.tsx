import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Student } from '../../types';
import { Trophy, History } from 'lucide-react';

export function StudentProfile() {
    const { user } = useAuth();
    const student = user as Student;

    if (!student) return null;

    return (
        <div className="space-y-6">
            <div className="flex flex-col items-center space-y-4 md:flex-row md:space-x-6 md:space-y-0">
                <img src={student.avatarUrl} alt={student.name} className="h-24 w-24 rounded-full bg-gray-200 ring-4 ring-white shadow-lg" />
                <div className="text-center md:text-left">
                    <h1 className="text-2xl font-bold text-gray-900">{student.name}</h1>
                    <p className="text-gray-500">{student.email}</p>
                </div>
            </div>

            <Card>
                <CardHeader><CardTitle>Minha Graduação</CardTitle></CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between rounded-lg bg-gray-900 p-4 text-white">
                        <span className="text-lg font-bold">Faixa {student.belt}</span>
                        <div className="flex gap-1">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <div
                                    key={i}
                                    className={`h-4 w-1 rounded-sm ${i < student.stripes ? 'bg-white' : 'bg-gray-700'}`}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span>Progresso para o próximo grau</span>
                            <span className="font-medium">{Math.floor((student.attendance / student.requiredAttendance) * 100)}%</span>
                        </div>
                        <div className="h-3 w-full overflow-hidden rounded-full bg-gray-100">
                            <div
                                className="h-full bg-blue-600 transition-all duration-500"
                                style={{ width: `${(student.attendance / student.requiredAttendance) * 100}%` }}
                            />
                        </div>
                        <p className="text-xs text-gray-500">
                            {student.attendance} de {student.requiredAttendance} aulas necessárias. Continue treinando!
                        </p>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center gap-2">
                    <Trophy className="h-5 w-5 text-yellow-500" />
                    <CardTitle>Conquistas</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                        <div className="flex flex-col items-center rounded-lg border p-3 text-center">
                            <span className="text-2xl">🔥</span>
                            <span className="mt-2 text-xs font-medium text-gray-900">10 Aulas Seguidas</span>
                        </div>
                        <div className="flex flex-col items-center rounded-lg border p-3 text-center">
                            <span className="text-2xl">🥋</span>
                            <span className="mt-2 text-xs font-medium text-gray-900">Primeiro Grau</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center gap-2">
                    <History className="h-5 w-5 text-gray-500" />
                    <CardTitle>Histórico de Graduação</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="relative border-l border-gray-200 ml-2 space-y-8 pb-2">
                        {/* Mock history */}
                        <div className="relative pl-6">
                            <div className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full border border-white bg-blue-600" />
                            <p className="font-medium text-gray-900">Faixa Branca - 2º Grau</p>
                            <time className="text-xs text-gray-500">10 Out 2023</time>
                        </div>
                        <div className="relative pl-6">
                            <div className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full border border-white bg-gray-300" />
                            <p className="font-medium text-gray-900">Faixa Branca - 1º Grau</p>
                            <time className="text-xs text-gray-500">15 Jun 2023</time>
                        </div>
                        <div className="relative pl-6">
                            <div className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full border border-white bg-gray-300" />
                            <p className="font-medium text-gray-900">Início da Jornada</p>
                            <time className="text-xs text-gray-500">01 Jan 2023</time>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
