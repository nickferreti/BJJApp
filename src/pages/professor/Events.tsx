import React, { useState, useEffect } from 'react';
import { fetchProfessorEvents, createEvent, deleteEvent } from '../../services/api';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Plus, Trash2, Calendar, MapPin, Clock } from 'lucide-react';
import { CalendarEvent } from '../../types';
import { Modal } from '../../components/ui/Modal';
import { ConfirmationModal } from '../../components/ui/ConfirmationModal';

export function ProfessorEvents() {
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [newEvent, setNewEvent] = useState({ title: '', date: '', time: '', location: '', mapsLink: '', description: '' });
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const loadEvents = () => {
        fetchProfessorEvents().then(setEvents);
    };

    useEffect(() => {
        loadEvents();
    }, []);

    const handleCreate = async () => {
        if (!newEvent.title || !newEvent.date) return;
        await createEvent(newEvent);
        setShowForm(false);
        setNewEvent({ title: '', date: '', time: '', location: '', mapsLink: '', description: '' });
        loadEvents();
    }

    const handleDelete = async () => {
        if (deleteId) {
            await deleteEvent(deleteId);
            setDeleteId(null);
            loadEvents();
        }
    }

    const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

    // ... existing loadEvents ...

    return (
        <div className="space-y-6">
            {/* ... Header and Create Button ... */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Eventos da Academia</h1>
                    <p className="text-sm text-gray-500">Divulgue seminários, graduações e campeonatos</p>
                </div>
                <Button onClick={() => setShowForm(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Novo Evento
                </Button>
            </div>

            {/* Create Modal */}
            <Modal isOpen={showForm} onClose={() => setShowForm(false)} title="Agendar Novo Evento">
                {/* ... existing form content ... */}
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Título do Evento</label>
                        <Input
                            placeholder="Ex: Seminário de Defesa Pessoal"
                            value={newEvent.title}
                            onChange={e => setNewEvent({ ...newEvent, title: e.target.value })}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Data</label>
                            <Input
                                type="date"
                                value={newEvent.date}
                                onChange={e => setNewEvent({ ...newEvent, date: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Horário</label>
                            <Input
                                type="time"
                                value={newEvent.time}
                                onChange={e => setNewEvent({ ...newEvent, time: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Local</label>
                        <Input
                            placeholder="Ex: Tatame Principal / Unidade 2"
                            value={newEvent.location}
                            onChange={e => setNewEvent({ ...newEvent, location: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Link do Google Maps (Opcional)</label>
                        <Input
                            placeholder="Cole o link aqui..."
                            value={newEvent.mapsLink}
                            onChange={e => setNewEvent({ ...newEvent, mapsLink: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Descrição</label>
                        <textarea
                            className="flex min-h-[80px] w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="Detalhes sobre o evento, cronograma..."
                            value={newEvent.description}
                            onChange={e => setNewEvent({ ...newEvent, description: e.target.value })}
                        />
                    </div>
                    <Button className="w-full mt-4" onClick={handleCreate}>
                        Confirmar Agendamento
                    </Button>
                </div>
            </Modal>

            {/* Event Details Modal */}
            <Modal isOpen={!!selectedEvent} onClose={() => setSelectedEvent(null)} title="Detalhes do Evento">
                {selectedEvent && (
                    <div className="space-y-6">
                        <div className="flex flex-col items-center bg-blue-50 p-6 rounded-xl border border-blue-100">
                            <div className="flex flex-col items-center justify-center mb-2">
                                <Calendar className="h-8 w-8 text-blue-600 mb-1" />
                                <span className="text-2xl font-bold text-blue-900">
                                    {new Date(selectedEvent.date).toLocaleDateString('pt-BR')}
                                </span>
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 text-center">{selectedEvent.title}</h2>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-gray-600">
                                <Clock className="h-5 w-5 text-gray-400" />
                                <span className="font-medium">{selectedEvent.time || 'Horário a definir'}</span>
                            </div>
                            <div className="flex flex-col items-start gap-1 text-gray-600">
                                <div className="flex items-center gap-3">
                                    <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                                    <span className="font-medium">{selectedEvent.location || 'Local a definir'}</span>
                                </div>
                                {selectedEvent.mapsLink && (
                                    <a
                                        href={selectedEvent.mapsLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-blue-600 hover:text-blue-800 hover:underline ml-8 flex items-center gap-1"
                                    >
                                        Ver no Google Maps &rarr;
                                    </a>
                                )}
                            </div>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="text-sm font-semibold text-gray-900 mb-2 uppercase tracking-wide">Sobre o Evento</h4>
                            <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{selectedEvent.description}</p>
                        </div>

                        <div className="pt-4 flex justify-end">
                            <Button onClick={() => setSelectedEvent(null)} className="w-full sm:w-auto">
                                Fechar
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Delete Confirmation */}
            <ConfirmationModal
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={handleDelete}
                title="Cancelar Evento"
                message="Tem certeza que deseja cancelar este evento? Esta ação não pode ser desfeita e notificará os alunos."
                confirmLabel="Sim, Cancelar Evento"
                variant="danger"
            />

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
                {events.map((event) => (
                    <Card
                        key={event.id}
                        className="group relative overflow-hidden border-l-4 border-l-blue-600 hover:shadow-lg transition-all duration-300 cursor-pointer"
                        onClick={() => setSelectedEvent(event)}
                    >
                        <CardContent className="p-6">
                            <div className="flex justify-between items-start">
                                <div className="flex gap-4">
                                    <div className="flex flex-col items-center justify-center h-16 w-16 bg-blue-50 rounded-xl text-blue-700 font-bold border border-blue-100 shadow-sm">
                                        <span className="text-sm uppercase tracking-wider">{new Date(event.date).toLocaleString('pt-BR', { month: 'short' }).replace('.', '')}</span>
                                        <span className="text-2xl">{new Date(event.date).getUTCDate()}</span>
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-700 transition-colors">{event.title}</h3>
                                        <div className="flex items-center text-sm text-gray-500 gap-4">
                                            <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {event.time || '19:00'}</span>
                                            <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {event.location || 'Tatame'}</span>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-2 line-clamp-2">{event.description}</p>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-gray-400 hover:text-red-600 hover:bg-red-50 -mr-2"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setDeleteId(event.id);
                                    }}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {events.length === 0 && (
                    <div className="col-span-full py-12 text-center border-2 border-dashed border-gray-200 rounded-lg">
                        <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                        <h3 className="text-lg font-medium text-gray-900">Sem eventos programados</h3>
                        <p className="text-gray-500">Adicione novos eventos para engajar seus alunos.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
