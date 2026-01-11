import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { fetchStudentFinancial } from '../../services/api';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { Transaction } from '../../types';

export function StudentFinancial() {
    const { user } = useAuth();
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    useEffect(() => {
        if (user) {
            fetchStudentFinancial(user.id).then(setTransactions);
        }
    }, [user]);

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Financeiro</h1>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader><CardTitle>Resumo</CardTitle></CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-gray-900">R$ 250,00</div>
                        <p className="text-sm text-gray-500">Mensalidade Atual</p>
                        <div className="mt-4 flex items-center gap-2 text-sm text-green-600">
                            <CheckCircle2 className="h-4 w-4" />
                            <span>Em dia</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Only show if there are pending payments */}
                {transactions.some(t => t.status === 'pending') && (
                    <Card className="border-yellow-200 bg-yellow-50">
                        <CardHeader><CardTitle className="text-yellow-800">Pagamentos Pendentes</CardTitle></CardHeader>
                        <CardContent>
                            <p className="text-sm text-yellow-700">Você tem mensalidades em aberto.</p>
                        </CardContent>
                    </Card>
                )}
            </div>

            <div className="rounded-md border bg-white">
                <div className="p-4 border-b">
                    <h3 className="font-semibold text-gray-900">Histórico de Pagamentos</h3>
                </div>
                <div className="divide-y">
                    {transactions.map((t) => (
                        <div key={t.id} className="flex items-center justify-between p-4">
                            <div className="flex items-center gap-3">
                                <div className={`flex h-10 w-10 items-center justify-center rounded-full ${t.status === 'paid' ? 'bg-green-100 text-green-600' :
                                        t.status === 'pending' ? 'bg-yellow-100 text-yellow-600' : 'bg-red-100 text-red-600'
                                    }`}>
                                    {t.status === 'paid' ? <CheckCircle2 className="h-5 w-5" /> :
                                        t.status === 'pending' ? <Clock className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">{t.description}</p>
                                    <p className="text-sm text-gray-500">{new Date(t.date).toLocaleDateString('pt-BR')}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-medium text-gray-900">R$ {t.amount.toFixed(2)}</p>
                                <p className={`text-xs capitalize ${t.status === 'paid' ? 'text-green-600' :
                                        t.status === 'pending' ? 'text-yellow-600' : 'text-red-600'
                                    }`}>
                                    {t.status === 'paid' ? 'Pago' : t.status === 'pending' ? 'Pendente' : 'Atrasado'}
                                </p>
                            </div>
                        </div>
                    ))}
                    {transactions.length === 0 && <div className="p-4 text-center text-gray-500">Nenhum registro encontrado.</div>}
                </div>
            </div>
        </div>
    );
}
