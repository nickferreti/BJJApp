import React from 'react';
import { mockTransactions } from '../../data/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Mail, CheckCircle2, AlertCircle, Clock } from 'lucide-react';

export function ProfessorFinancial() {
    const pendingTransactions = mockTransactions.filter(t => t.status !== 'paid');
    const paidTransactions = mockTransactions.filter(t => t.status === 'paid');

    return (
        <div className="space-y-6">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Financeiro</h1>
                    <p className="text-sm text-gray-500">Controle de mensalidades e pagamentos</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">Relatório Completo</Button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card className="bg-green-50 border-green-100">
                    <CardContent className="p-6">
                        <div className="text-2xl font-bold text-green-700">R$ {paidTransactions.reduce((acc, t) => acc + t.amount, 0).toFixed(2)}</div>
                        <p className="text-sm text-green-600">Recebido este mês</p>
                    </CardContent>
                </Card>
                <Card className="bg-yellow-50 border-yellow-100">
                    <CardContent className="p-6">
                        <div className="text-2xl font-bold text-yellow-700">R$ {pendingTransactions.filter(t => t.status === 'pending').reduce((acc, t) => acc + t.amount, 0).toFixed(2)}</div>
                        <p className="text-sm text-yellow-600">Previsto (Pendente)</p>
                    </CardContent>
                </Card>
                <Card className="bg-red-50 border-red-100">
                    <CardContent className="p-6">
                        <div className="text-2xl font-bold text-red-700">R$ {pendingTransactions.filter(t => t.status === 'overdue').reduce((acc, t) => acc + t.amount, 0).toFixed(2)}</div>
                        <p className="text-sm text-red-600">Em Atraso</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader><CardTitle>Pagamentos Recentes</CardTitle></CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-500">
                            <thead className="bg-gray-50 text-xs uppercase text-gray-700">
                                <tr>
                                    <th className="px-6 py-3">Aluno</th>
                                    <th className="px-6 py-3">Referência</th>
                                    <th className="px-6 py-3">Valor</th>
                                    <th className="px-6 py-3">Status</th>
                                    <th className="px-6 py-3 text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {mockTransactions.map((t) => (
                                    <tr key={t.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium text-gray-900">{t.studentName}</td>
                                        <td className="px-6 py-4">{t.description}</td>
                                        <td className="px-6 py-4">R$ {t.amount.toFixed(2)}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${t.status === 'paid' ? 'bg-green-50 text-green-700 ring-green-600/20' :
                                                    t.status === 'pending' ? 'bg-yellow-50 text-yellow-700 ring-yellow-600/20' :
                                                        'bg-red-50 text-red-700 ring-red-600/20'
                                                }`}>
                                                {t.status === 'paid' ? 'Pago' : t.status === 'pending' ? 'Pendente' : 'Atrasado'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {t.status !== 'paid' && (
                                                <button className="flex items-center justify-end gap-1 text-blue-600 hover:text-blue-800 ml-auto">
                                                    <Mail className="h-4 w-4" />
                                                    <span>Cobrar</span>
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
