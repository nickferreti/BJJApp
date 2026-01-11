import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { fetchStudentEvents } from '../../services/api';
import { Card, CardContent } from '../../components/ui/Card';
import { Calendar as CalendarIcon, MapPin, Clock } from 'lucide-react';
import { CalendarEvent } from '../../types';
import { Modal } from '../../components/ui/Modal';
import { EventCalendar } from '../../components/ui/EventCalendar';

export function StudentEvents() {
    const { user } = useAuth();
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

    useEffect(() => {
        if (user) {
            fetchStudentEvents(user.id).then(setEvents);
        }
    }, [user]);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Eventos & Seminários</h1>
                <p className="text-sm text-gray-500">Fique por dentro do que acontece na academia</p>
            </div>

            <EventCalendar events={events} onEventSelect={setSelectedEvent} />

            {/* Event Details Modal */}
            <Modal isOpen={!!selectedEvent} onClose={() => setSelectedEvent(null)} title="Detalhes do Evento">
                {/* ... (Modal content matches previous implementation, can be refactored later if reused much) ... */}
                {selectedEvent && (
                    <div className="space-y-6">
                        <div className="flex flex-col items-center bg-blue-50 p-6 rounded-xl border border-blue-100">
                            <div className="flex flex-col items-center justify-center mb-2">
                                <CalendarIcon className="h-8 w-8 text-blue-600 mb-1" />
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
                            <button
                                onClick={() => setSelectedEvent(null)}
                                className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                            >
                                Fechar
                            </button>
                        </div>
                    </div>
                )}
            </Modal>


        </div>
    );
}
