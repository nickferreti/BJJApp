import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { fetchStudentDashboard, checkInClass } from '../../services/api';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { MapPin, Calendar, Activity, CheckCircle2 } from 'lucide-react';
import { Student } from '../../types';

export function StudentDashboard() {
    const { user } = useAuth();
    const [student, setStudent] = useState<Student | null>(user as Student);
    const [checkedIn, setCheckedIn] = useState(false);

    useEffect(() => {
        if (user) {
            fetchStudentDashboard(user.id).then(data => {
                setStudent({ ...user, ...data });
                if (data.checkedIn) setCheckedIn(true);
            });
        }
    }, [user]);

    const handleCheckIn = async () => {
        if (!student) return;
        try {
            await checkInClass(student.id);
            setCheckedIn(true);
            // Refresh data to show updated attendance
            const data = await fetchStudentDashboard(student.id);
            setStudent({ ...student, ...data });
        } catch (e) {
            console.error(e);
        }
    };

    if (!student) return <div>Carregando...</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Olá, {student.name.split(' ')[0]} 👋</h1>
                <div className="text-sm text-gray-500">{new Date().toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {/* Check-in Card */}
                <Card className="border-blue-100 bg-blue-50/50">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-blue-900">Check-in de Aula</CardTitle>
                        <MapPin className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-700">Faça sua presença</div>
                        <p className="text-xs text-blue-600/80 mb-4">Confirme que você está no tatame.</p>
                        {checkedIn ? (
                            <Button className="w-full bg-green-600 hover:bg-green-700" disabled>
                                <CheckCircle2 className="mr-2 h-4 w-4" />
                                Confirmado
                            </Button>
                        ) : (
                            <Button className="w-full" onClick={handleCheckIn}>
                                Realizar Check-in
                            </Button>
                        )}
                    </CardContent>
                </Card>

                {/* Next Class Card */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Próxima Aula</CardTitle>
                        <Calendar className="h-4 w-4 text-gray-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{student.nextClass || "Não agendado"}</div>
                        <p className="text-xs text-gray-500">Fundamentos - Todos os Níveis</p>
                    </CardContent>
                </Card>

                {/* Belt Status Card */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Minha Evolução</CardTitle>
                        <Activity className="h-4 w-4 text-gray-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold flex items-center gap-2">
                            Faixa {student.belt}
                            {student.stripes > 0 && <span className="flex gap-1">{Array.from({ length: student.stripes }).map((_, i) => <div key={i} className="h-3 w-1 bg-gray-900 rounded-sm" />)}</span>}
                        </div>
                        <div className="mt-2 h-2 w-full rounded-full bg-gray-100">
                            <div
                                className="h-2 rounded-full bg-blue-600 transition-all"
                                style={{ width: `${(student.attendance / student.requiredAttendance) * 100}%` }}
                            />
                        </div>
                        <p className="mt-1 text-xs text-gray-500">
                            {student.attendance}/{student.requiredAttendance} aulas para o próximo grau
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions / Recent Videos (Optional) */}
            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader><CardTitle>Avisos</CardTitle></CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {student.isPaymentLate && (
                                <div className="rounded-md bg-red-50 p-3 text-sm text-red-700 border border-red-100">
                                    ⚠️ Você possui mensalidades pendentes. Favor verificar o financeiro.
                                </div>
                            )}
                            <div className="rounded-md bg-gray-50 p-3 text-sm text-gray-700">
                                🥋 Seminário com Mestre Carlos dia 20/12.
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
