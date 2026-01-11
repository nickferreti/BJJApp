import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { fetchStudentVideos } from '../../services/api';
import { Input } from '../../components/ui/Input';
import { Card, CardContent } from '../../components/ui/Card';
import { Student, Video } from '../../types';
import { PlayCircle, BadgeInfo, Search } from 'lucide-react';

export function StudentVideos() {
    const { user } = useAuth();
    const student = user as Student;
    const [searchTerm, setSearchTerm] = useState('');
    const [videos, setVideos] = useState<Video[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchStudentVideos(user.id).then(data => {
                setVideos(data);
                setLoading(false);
            });
        }
    }, [user]);

    if (!student) return null;

    const filteredVideos = videos.filter(video => {
        // Backend already filters by belt (conceptually), but we filter by search here
        const searchMatch = video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            video.tags.toString().toLowerCase().includes(searchTerm.toLowerCase()); // tags came as string from SQLite maybe?
        return searchMatch;
    });

    const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

    const getEmbedUrl = (url: string) => {
        if (!url) return '';
        // YouTube
        const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/watch\?v=)([^&]+)/);
        if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1`;

        // Vimeo
        const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
        if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`;

        return url;
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Biblioteca Técnica</h1>
                    <p className="text-sm text-gray-500">Conteúdo exclusivo para Faixa {student.belt}</p>
                </div>
                {/* ... search input ... */}
                <div className="w-full md:w-64">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                        <Input
                            placeholder="Buscar técnica..."
                            className="pl-9"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {loading ? (
                <div>Carregando vídeos...</div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredVideos.length > 0 ? (
                        filteredVideos.map((video) => (
                            <Card
                                key={video.id}
                                className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer group"
                                onClick={() => setSelectedVideo(video)}
                            >
                                <div className="relative aspect-video bg-black">
                                    <img
                                        src={video.thumbnailUrl || 'https://placehold.co/600x400'}
                                        alt={video.title}
                                        className="h-full w-full object-cover opacity-80 transition-opacity group-hover:opacity-60"
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <PlayCircle className="h-12 w-12 text-white opacity-90 group-hover:scale-110 transition-transform" />
                                    </div>
                                    <div className="absolute top-2 right-2">
                                        <span className="rounded bg-black/70 px-2 py-1 text-xs font-medium text-white capitalize">{video.category}</span>
                                    </div>
                                </div>
                                <CardContent className="p-4">
                                    <h3 className="font-semibold text-gray-900 line-clamp-1">{video.title}</h3>
                                    <div className="mt-2 flex flex-wrap gap-1">
                                        {video.tags && video.tags.toString().split(',').map(tag => (
                                            <span key={tag} className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
                                                #{tag.trim()}
                                            </span>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                            <BadgeInfo className="h-12 w-12 text-gray-300 mb-4" />
                            <p className="text-lg font-medium text-gray-900">Nenhum vídeo encontrado</p>
                            <p className="text-sm text-gray-500">Tente buscar por outro termo ou aguarde novos conteúdos.</p>
                        </div>
                    )}
                </div>
            )}

            {/* Video Player Modal */}
            {selectedVideo && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={() => setSelectedVideo(null)}>
                    <div className="relative w-full max-w-4xl overflow-hidden rounded-lg bg-black shadow-2xl" onClick={e => e.stopPropagation()}>
                        <div className="aspect-video w-full">
                            <iframe
                                src={getEmbedUrl(selectedVideo.url)}
                                title={selectedVideo.title}
                                className="h-full w-full"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        </div>
                        <div className="flex items-start justify-between bg-white p-4">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">{selectedVideo.title}</h3>
                                <p className="text-gray-500">{selectedVideo.category}</p>
                            </div>
                            <button
                                onClick={() => setSelectedVideo(null)}
                                className="rounded-full p-2 hover:bg-gray-100"
                            >
                                <span className="text-2xl font-bold leading-none">&times;</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
