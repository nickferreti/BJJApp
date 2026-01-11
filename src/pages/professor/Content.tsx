import React, { useState, useEffect } from 'react';
import { fetchProfessorVideos, createVideo, deleteVideo } from '../../services/api';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardContent } from '../../components/ui/Card';
import { Video as VideoIcon, Plus, Trash2, Edit, PlayCircle } from 'lucide-react';
import { Video } from '../../types';
import { Modal } from '../../components/ui/Modal';
import { ConfirmationModal } from '../../components/ui/ConfirmationModal';

export function ProfessorContent() {
    const [showForm, setShowForm] = useState(false);
    const [videos, setVideos] = useState<Video[]>([]);
    const [newVideo, setNewVideo] = useState({ title: '', category: 'Fundamentos', belt_level: 'Branca', url: '', tags: '' });
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const loadVideos = () => {
        fetchProfessorVideos().then(setVideos);
    };

    useEffect(() => {
        loadVideos();
    }, []);

    const handleCreate = async () => {
        if (!newVideo.title || !newVideo.url) return;
        await createVideo(newVideo);
        setShowForm(false);
        setNewVideo({ title: '', category: 'Fundamentos', belt_level: 'Branca', url: '', tags: '' });
        loadVideos();
    }

    const handleDelete = async () => {
        if (deleteId) {
            await deleteVideo(deleteId);
            setDeleteId(null);
            loadVideos();
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Biblioteca de Vídeos</h1>
                    <p className="text-sm text-gray-500">Gerencie o conteúdo técnico da plataforma</p>
                </div>
                <Button onClick={() => setShowForm(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Adicionar Vídeo
                </Button>
            </div>

            <Modal isOpen={showForm} onClose={() => setShowForm(false)} title="Adicionar Novo Vídeo">
                <div className="space-y-4">
                    <Input
                        placeholder="Título da Técnica"
                        value={newVideo.title}
                        onChange={e => setNewVideo({ ...newVideo, title: e.target.value })}
                    />
                    <Input
                        placeholder="URL do YouTube/Vimeo"
                        value={newVideo.url}
                        onChange={e => setNewVideo({ ...newVideo, url: e.target.value })}
                    />
                    <select
                        className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={newVideo.belt_level}
                        onChange={e => setNewVideo({ ...newVideo, belt_level: e.target.value })}
                    >
                        <option value="Branca">Faixa Branca</option>
                        <option value="Azul">Faixa Azul</option>
                        <option value="Roxa">Faixa Roxa</option>
                        <option value="Marrom">Faixa Marrom</option>
                        <option value="Preta">Faixa Preta</option>
                    </select>
                    <Input
                        placeholder="Tags (separadas por vírgula)"
                        value={newVideo.tags}
                        onChange={e => setNewVideo({ ...newVideo, tags: e.target.value })}
                    />
                    <Button className="w-full" onClick={handleCreate}>Salvar Vídeo</Button>
                </div>
            </Modal>

            <ConfirmationModal
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={handleDelete}
                title="Excluir Vídeo"
                message="Tem certeza que deseja remover este vídeo da biblioteca? Os alunos não terão mais acesso."
            />

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {videos.map((video) => (
                    <Card key={video.id} className="overflow-hidden hover:shadow-lg transition-all group">
                        <div className="relative aspect-video bg-black">
                            <img src={video.thumbnailUrl || 'https://placehold.co/600x400'} alt={video.title} className="h-full w-full object-cover opacity-80" />
                            <div className="absolute top-2 right-2">
                                <span className="rounded bg-black/70 px-2 py-1 text-xs font-medium text-white capitalize">{video.beltLevel || video.belt_level}</span>
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <PlayCircle className="h-12 w-12 text-white/50 group-hover:text-white transition-colors" />
                            </div>
                        </div>
                        <CardContent className="p-4">
                            <h3 className="font-semibold text-gray-900 line-clamp-1">{video.title}</h3>
                            <p className="text-sm text-gray-500">{video.category}</p>
                            <div className="mt-4 flex gap-2">
                                <Button size="sm" variant="outline" className="w-full">
                                    <Edit className="mr-2 h-3 w-3" /> Editar
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => setDeleteId(video.id)} className="w-full text-red-600 hover:bg-red-50 hover:text-red-700">
                                    <Trash2 className="mr-2 h-3 w-3" /> Excluir
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}

