import React, { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface PageContainerProps {
  children: ReactNode;
}

export const PageContainer = ({ children }: PageContainerProps) => (
  <div className="flex min-h-screen bg-dark-bg text-slate-50 bg-radial-glow">
    <Sidebar />
    <div className="flex-1 md:ml-64 flex flex-col min-h-screen transition-all duration-300">
      <Header />
      <main className="flex-1 page-container w-full animate-in fade-in duration-300 z-10 relative">
        {children}
      </main>
    </div>
  </div>
);