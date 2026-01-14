
import React, { useState, useEffect, useMemo } from 'react';
import { User, UserRole, CondoClient, Notification, Poll, Announcement, OperationalTask } from './types';
import { MOCK_USERS, MOCK_CLIENTS, MOCK_POLLS, MOCK_ANNOUNCEMENTS, MOCK_TASKS } from './constants';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import GatehouseView from './components/GatehouseView';
import PollsView from './components/PollsView';
import BoardView from './components/BoardView';
import OperationalView from './components/OperationalView';
import ManagementView from './components/ManagementView';
import VisitorsListView from './components/VisitorsListView';
import Login from './components/Login';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [clients, setClients] = useState<CondoClient[]>(MOCK_CLIENTS);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [polls, setPolls] = useState<Poll[]>(MOCK_POLLS);
  const [announcements, setAnnouncements] = useState<Announcement[]>(MOCK_ANNOUNCEMENTS);
  const [tasks, setTasks] = useState<OperationalTask[]>(MOCK_TASKS);
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('condo_theme') === 'dark');

  useEffect(() => {
    const savedUser = localStorage.getItem('condo_user');
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('condo_user');
      }
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
    localStorage.setItem('condo_theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('condo_user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('condo_user');
    setActiveTab('dashboard');
  };

  const isMasterAdmin = currentUser?.id === 'admin-fluxibi';

  // Otimização: Evita re-filtrar arrays em cada renderização se os dados não mudaram
  const filteredData = useMemo(() => {
    if (!currentUser) return { users: [], polls: [], announcements: [], tasks: [], notifications: [] };
    
    const cid = currentUser.clientId;
    return {
      users: isMasterAdmin ? users : users.filter(u => u.clientId === cid),
      polls: isMasterAdmin ? polls : polls.filter(p => p.clientId === cid),
      announcements: isMasterAdmin ? announcements : announcements.filter(a => a.clientId === cid),
      tasks: isMasterAdmin ? tasks : tasks.filter(t => t.clientId === cid),
      notifications: notifications.filter(n => 
        isMasterAdmin || (n.clientId === cid && (n.unitId === currentUser.unit || currentUser.role !== UserRole.MORADOR))
      )
    };
  }, [currentUser, users, polls, announcements, tasks, notifications, isMasterAdmin]);

  const renderContent = () => {
    if (!currentUser) return null;

    switch (activeTab) {
      case 'dashboard': 
        return <Dashboard 
          user={currentUser} 
          polls={filteredData.polls} 
          announcements={filteredData.announcements} 
          tasks={filteredData.tasks} 
          notifications={filteredData.notifications} 
          onNavigate={setActiveTab} 
        />;
      case 'visitors':
        return <VisitorsListView user={currentUser} />;
      case 'gatehouse': 
        return <GatehouseView 
          user={currentUser} 
          onSendNotification={(n) => setNotifications(prev => [n, ...prev])} 
        />;
      case 'polls': 
        return <PollsView user={currentUser} polls={filteredData.polls} setPolls={setPolls} />;
      case 'board': 
        return <BoardView user={currentUser} announcements={filteredData.announcements} setAnnouncements={setAnnouncements} />;
      case 'operational': 
        return <OperationalView user={currentUser} tasks={filteredData.tasks} setTasks={setTasks} />;
      case 'management': 
        return <ManagementView 
          users={users} 
          setUsers={setUsers} 
          clients={clients} 
          setClients={setClients} 
          currentUser={currentUser} 
        />;
      default: return null;
    }
  };

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className="min-h-screen flex flex-col md:flex-row bg-neutral-surface dark:bg-brand-1 transition-colors duration-300">
        {!currentUser ? (
          <Login onLogin={handleLogin} users={users} />
        ) : (
          <>
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} user={currentUser} onLogout={handleLogout} />
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
              <Navbar 
                user={currentUser} 
                isDarkMode={isDarkMode}
                toggleTheme={() => setIsDarkMode(!isDarkMode)}
                notifications={filteredData.notifications} 
              />
              <main className="flex-1 overflow-y-auto p-4 md:p-8">
                <div className="max-w-6xl mx-auto">
                  {renderContent()}
                </div>
              </main>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default App;
