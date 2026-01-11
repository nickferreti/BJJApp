import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { User, Shield } from 'lucide-react';

export function Login() {
    const { login, isLoading, user } = useAuth();
    const navigate = useNavigate();

    React.useEffect(() => {
        if (user) {
            if (user.role === 'student') navigate('/student/dashboard');
            else navigate('/professor/dashboard');
        }
    }, [user, navigate]);

    const handleLogin = (role: 'student' | 'professor') => {
        login(role);
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                        <Shield className="h-8 w-8 text-blue-600" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-gray-900">BJJ Academy</CardTitle>
                    <p className="text-sm text-gray-500">Faça login para continuar</p>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Button
                        onClick={() => handleLogin('student')}
                        isLoading={isLoading}
                        className="w-full text-lg h-12"
                    >
                        <User className="mr-2 h-5 w-5" />
                        Entrar como Aluno
                    </Button>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-gray-200" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white px-2 text-gray-500">Ou</span>
                        </div>
                    </div>

                    <Button
                        onClick={() => handleLogin('professor')}
                        isLoading={isLoading}
                        variant="outline"
                        className="w-full text-lg h-12"
                    >
                        <Shield className="mr-2 h-5 w-5" />
                        Entrar como Professor
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
