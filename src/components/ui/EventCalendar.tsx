import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Clock, MapPin } from 'lucide-react';
import { CalendarEvent } from '../../types';
import { Button } from './Button';

interface EventCalendarProps {
    events: CalendarEvent[];
    onEventSelect: (event: CalendarEvent) => void;
}

const DAYS_OF_WEEK = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const MONTHS = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

export function EventCalendar({ events, onEventSelect }: EventCalendarProps) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [activeDay, setActiveDay] = useState<number | null>(null);

    const getDaysInMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
        setActiveDay(null); // Reset active popup on month change
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
        setActiveDay(null);
    };

    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);

    // Generate calendar grid
    const days = [];
    for (let i = 0; i < firstDay; i++) {
        days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
        days.push(i);
    }

    const getEventsForDay = (day: number) => {
        return events.filter(event => {
            const eventDate = new Date(event.date);
            return eventDate.getDate() === day &&
                eventDate.getMonth() === currentDate.getMonth() &&
                eventDate.getFullYear() === currentDate.getFullYear();
        });
    };

    return (
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                    {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h2>
                <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={prevMonth}>
                        <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={nextMonth}>
                        <ChevronRight className="h-5 w-5" />
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center mb-2">
                {DAYS_OF_WEEK.map(day => (
                    <div key={day} className="text-xs sm:text-sm font-semibold text-gray-500 py-2">
                        {day}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-1 sm:gap-2">
                {days.map((day, index) => {
                    const dayEvents = day ? getEventsForDay(day) : [];
                    const hasEvents = dayEvents.length > 0;
                    const isActive = activeDay === day;

                    return (
                        <div
                            key={index}
                            onClick={() => {
                                if (hasEvents && day) {
                                    setActiveDay(isActive ? null : day);
                                }
                            }}
                            className={`
                                relative min-h-[60px] sm:min-h-[100px] border rounded-lg p-1 sm:p-2 transition-colors cursor-pointer
                                ${!day ? 'bg-transparent border-transparent cursor-default' : 'bg-gray-50 border-gray-100 hover:bg-gray-100'}
                                ${hasEvents ? 'bg-blue-50/50 border-blue-100' : ''}
                                ${isActive ? 'ring-2 ring-blue-500 ring-offset-1 z-10' : ''}
                            `}
                        >
                            {day && (
                                <>
                                    <span className={`
                                        text-sm font-medium block mb-1
                                        ${hasEvents ? 'text-blue-700' : 'text-gray-700'}
                                    `}>
                                        {day}
                                    </span>

                                    {hasEvents && (
                                        <div>
                                            {/* Mobile Indicator */}
                                            <div className="flex justify-center sm:hidden">
                                                <div className="h-1.5 w-1.5 rounded-full bg-blue-600"></div>
                                            </div>

                                            {/* Desktop Preview */}
                                            <div className="hidden sm:block space-y-1">
                                                {dayEvents.map(event => (
                                                    <div key={event.id} className="text-[10px] bg-blue-100 text-blue-800 rounded px-1 py-0.5 truncate">
                                                        {event.title}
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Active Card (Tooltip replacement) */}
                                            {isActive && (
                                                <div
                                                    className="absolute z-20 bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-white rounded-lg shadow-xl border border-gray-100 p-4"
                                                    onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside popup
                                                >
                                                    <div className="flex justify-between items-center mb-2 border-b pb-2">
                                                        <span className="text-xs font-semibold text-gray-500 uppercase">Eventos do dia {day}</span>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setActiveDay(null);
                                                            }}
                                                            className="text-gray-400 hover:text-gray-600"
                                                        >
                                                            &times;
                                                        </button>
                                                    </div>
                                                    <div className="text-left space-y-3 max-h-[200px] overflow-y-auto">
                                                        {dayEvents.map(event => (
                                                            <div key={event.id} className="border-b last:border-0 pb-3 last:pb-0">
                                                                <h4 className="font-bold text-gray-900 text-sm">{event.title}</h4>
                                                                <div className="mt-1 space-y-1 text-xs text-gray-500 mb-2">
                                                                    <div className="flex items-center gap-1">
                                                                        <Clock className="h-3 w-3" />
                                                                        <span>{event.time || '19:00'}</span>
                                                                    </div>
                                                                    <div className="flex items-center gap-1">
                                                                        <MapPin className="h-3 w-3" />
                                                                        <span className="truncate max-w-[150px]">{event.location || 'Local a definir'}</span>
                                                                    </div>
                                                                </div>
                                                                <button
                                                                    onClick={() => onEventSelect(event)}
                                                                    className="w-full text-xs bg-blue-600 text-white py-1.5 rounded hover:bg-blue-700 transition-colors"
                                                                >
                                                                    Ver Detalhes
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    {/* Arrow */}
                                                    <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-white"></div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
