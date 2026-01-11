import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';

export function Layout() {
    return (
        <div className="flex h-screen w-full bg-gray-50">
            <Sidebar />
            <main className="flex-1 overflow-y-auto pb-16 md:pb-0">
                <div className="container mx-auto max-w-5xl p-4 md:p-8">
                    <Outlet />
                </div>
            </main>
            <BottomNav />
        </div>
    );
}
