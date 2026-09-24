import React, { useState } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { NavigationProvider, useNavigation } from './context/NavigationContext';
import { PortfolioProvider } from './context/PortfolioContext';
import { AdminAuthProvider } from './context/AdminAuthContext';
import { LoadingScreen } from './components/LoadingScreen';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { ServicesPage } from './pages/ServicesPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { AboutPage } from './pages/AboutPage';
import { BlogPage } from './pages/BlogPage';
import { ContactPage } from './pages/ContactPage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { ArticleDetailPage } from './pages/ArticleDetailPage';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { ProjectItem } from './components/SelectedWorks';
import { JournalEntry } from './components/Journal';
import { ExplorationItem } from './components/Explorations';
import { ResumeModal } from './components/ResumeModal';
import { ProjectModal } from './components/ProjectModal';
import { ArticleModal } from './components/ArticleModal';
import { LightboxModal } from './components/LightboxModal';
import { ContactModal } from './components/ContactModal';

function AppContent() {
  const [isLoading, setIsLoading] = useState(true);
  const { activePage, navigate, navigateToProject, navigateToArticle } = useNavigation();

  // Modals state
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [selectedJournalEntry, setSelectedJournalEntry] = useState<JournalEntry | null>(null);
  const [selectedExploration, setSelectedExploration] = useState<ExplorationItem | null>(null);
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);

  // Dedicated standalone Admin Pages (No public Navbar / Footer)
  if (activePage === 'admin-login') {
    return <AdminLoginPage />;
  }

  if (activePage === 'admin-dashboard') {
    return <AdminDashboard />;
  }

  return (
    <div className="min-h-screen bg-bg text-text-primary selection:bg-[#4E85BF] selection:text-white relative flex flex-col justify-between">
      {/* Loading Screen */}
      {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}

      {/* Persistent Navbar across all public routes */}
      <Navbar />

      {/* Main Content Area Routing */}
      <main className="flex-grow">
        {activePage === 'home' && (
          <HomePage
            onSelectProject={(project) => navigateToProject(project.id)}
            onSelectJournalEntry={(entry) => navigateToArticle(entry.id)}
            onOpenLightbox={(item) => setSelectedExploration(item)}
          />
        )}

        {activePage === 'services' && <ServicesPage />}

        {activePage === 'projects' && (
          <ProjectsPage
            onSelectProject={(project) => navigateToProject(project.id)}
            onOpenLightbox={(item) => setSelectedExploration(item)}
          />
        )}

        {activePage === 'project-detail' && <ProjectDetailPage />}

        {activePage === 'about' && (
          <AboutPage onOpenResume={() => setIsResumeOpen(true)} />
        )}

        {activePage === 'blog' && (
          <BlogPage
            onSelectJournalEntry={(entry) => navigateToArticle(entry.id)}
          />
        )}

        {activePage === 'article-detail' && <ArticleDetailPage />}

        {activePage === 'contact' && <ContactPage />}
      </main>

      {/* Persistent Footer across all public routes */}
      <Footer onDirectMessage={() => navigate('/contact')} />

      {/* Global Modals & Overlays */}
      <ResumeModal
        isOpen={isResumeOpen}
        onClose={() => setIsResumeOpen(false)}
      />

      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />

      <ArticleModal
        entry={selectedJournalEntry}
        onClose={() => setSelectedJournalEntry(null)}
      />

      <LightboxModal
        item={selectedExploration}
        onClose={() => setSelectedExploration(null)}
      />

      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <PortfolioProvider>
        <AdminAuthProvider>
          <NavigationProvider>
            <AppContent />
          </NavigationProvider>
        </AdminAuthProvider>
      </PortfolioProvider>
    </LanguageProvider>
  );
}
