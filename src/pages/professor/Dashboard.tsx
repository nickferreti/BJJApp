import React, { useEffect, useState } from 'react';
import { fetchProfessorStats } from '../../services/api';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Users, AlertCircle, TrendingUp, DollarSign } from 'lucide-react';

export function ProfessorDashboard() {
    const [stats, setStats] = useState({
        totalStudents: 0,
        latePayments: 0,
        activeStudents: 0,
        revenueMonth: 0
    });

    useEffect(() => {
        fetchProfessorStats().then(setStats);
    }, []);

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Visão Geral</h1>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total de Alunos</CardTitle>
                        <Users className="h-4 w-4 text-gray-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalStudents}</div>
                        <p className="text-xs text-gray-500">+ new this month</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Alunos Ativos</CardTitle>
                        <TrendingUp className="h-4 w-4 text-gray-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.activeStudents}</div>
                        <p className="text-xs text-gray-500">Regularidade alta</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Financeiro</CardTitle>
                        <DollarSign className="h-4 w-4 text-gray-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">R$ {stats.revenueMonth}</div>
                        <p className="text-xs text-gray-500">Receita Total Estimada</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pendências</CardTitle>
                        <AlertCircle className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">{stats.latePayments}</div>
                        <p className="text-xs text-gray-500">Alunos com mensalidade atrasada</p>
                    </CardContent>
                </Card>
            </div>

            {/* Placeholder for recent activity or charts */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-full">
                    <CardHeader>
                        <CardTitle>Painel Administrativo com Dados Reais</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-500">Os dados acima estão sendo puxados do banco de dados SQLite via PHP.</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
