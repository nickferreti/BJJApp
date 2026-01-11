import React, { useState, useEffect } from 'react';
import { fetchProfessorStudents, createStudent, deleteStudent } from '../../services/api';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Search, Plus, Trash2, UserPlus } from 'lucide-react';
import { Student } from '../../types';
import { Modal } from '../../components/ui/Modal';
import { ConfirmationModal } from '../../components/ui/ConfirmationModal';

export function ProfessorStudents() {
    const [searchTerm, setSearchTerm] = useState('');
    const [students, setStudents] = useState<Student[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [newStudent, setNewStudent] = useState({ name: '', email: '', belt: 'Branca' });
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const loadStudents = () => {
        fetchProfessorStudents().then(setStudents);
    };

    useEffect(() => {
        loadStudents();
    }, []);

    const handleCreate = async () => {
        if (!newStudent.name || !newStudent.email) return;
        await createStudent(newStudent);
        setShowForm(false);
        setNewStudent({ name: '', email: '', belt: 'Branca' });
        loadStudents();
    };

    const handleDelete = async () => {
        if (deleteId) {
            await deleteStudent(deleteId);
            setDeleteId(null);
            loadStudents();
        }
    };

    const filteredStudents = students.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Alunos</h1>
                    <p className="text-sm text-gray-500">Gerencie matrículas e graduações</p>
                </div>
                <Button onClick={() => setShowForm(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Novo Aluno
                </Button>
            </div>

            <Modal isOpen={showForm} onClose={() => setShowForm(false)} title="Matricular Novo Aluno">
                <div className="space-y-4">
                    <div className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg mb-4">
                        <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                            <UserPlus className="h-8 w-8 text-blue-600" />
                        </div>
                        <p className="text-sm text-gray-500 text-center">O aluno receberá um email com a senha padrão <strong>aluno123</strong></p>
                    </div>
                    <Input
                        placeholder="Nome Completo"
                        value={newStudent.name}
                        onChange={e => setNewStudent({ ...newStudent, name: e.target.value })}
                    />
                    <Input
                        placeholder="Email"
                        value={newStudent.email}
                        onChange={e => setNewStudent({ ...newStudent, email: e.target.value })}
                    />
                    <select
                        className="flex h-10 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={newStudent.belt}
                        onChange={e => setNewStudent({ ...newStudent, belt: e.target.value })}
                    >
                        <option value="Branca">Branca</option>
                        <option value="Azul">Azul</option>
                        <option value="Roxa">Roxa</option>
                        <option value="Marrom">Marrom</option>
                        <option value="Preta">Preta</option>
                    </select>
                    <Button className="w-full" onClick={handleCreate}>Confirmar Matrícula</Button>
                </div>
            </Modal>

            <ConfirmationModal
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={handleDelete}
                title="Excluir Aluno"
                message="Tem certeza que deseja excluir este aluno? Todo o histórico de aulas e pagamentos será perdido."
                confirmLabel="Sim, Excluir Aluno"
            />

            <div className="flex items-center space-x-2">
                <div className="relative flex-1 md:max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                        placeholder="Buscar por nome ou email..."
                        className="pl-9"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <Card className="overflow-hidden border-0 shadow-sm ring-1 ring-gray-200">
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-500">
                            <thead className="bg-gray-50 text-xs uppercase text-gray-700">
                                <tr>
                                    <th className="px-6 py-3">Aluno</th>
                                    <th className="px-6 py-3">Faixa</th>
                                    <th className="px-6 py-3">Graus</th>
                                    <th className="px-6 py-3">Frequência</th>
                                    <th className="px-6 py-3">Status</th>
                                    <th className="px-6 py-3 text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {filteredStudents.map((student) => (
                                    <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <img src={student.avatarUrl} alt="" className="h-10 w-10 rounded-full bg-gray-200 border-2 border-white shadow-sm" />
                                                <div>
                                                    <div className="font-medium text-gray-900">{student.name}</div>
                                                    <div className="text-gray-500">{student.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-800 border border-slate-200">
                                                {student.belt}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-1">
                                                {Array.from({ length: 4 }).map((_, i) => (
                                                    <div key={i} className={`h-2 w-2 rounded-full ring-1 ring-inset ring-black/10 transition-all ${i < student.stripes ? 'bg-black' : 'bg-gray-100'}`} />
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="h-1.5 w-16 rounded-full bg-gray-100 overflow-hidden">
                                                    <div className="h-1.5 rounded-full bg-blue-600 transition-all duration-500" style={{ width: `${(student.attendance / student.requiredAttendance) * 100}%` }} />
                                                </div>
                                                <span className="text-xs font-medium">{student.attendance}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {student.isPaymentLate ? (
                                                <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10 animate-pulse">Pendente</span>
                                            ) : (
                                                <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">Ativo</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Button variant="ghost" size="sm" onClick={() => setDeleteId(student.id)} className="text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
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

