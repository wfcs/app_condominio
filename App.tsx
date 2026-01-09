
import React, { useState, useEffect } from 'react';
import { User, UserRole, Notification, Poll, Announcement, OperationalTask } from './types';
import { MOCK_USERS, MOCK_POLLS, MOCK_ANNOUNCEMENTS, MOCK_TASKS } from './constants';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import GatehouseView from './components/GatehouseView';
import PollsView from './components/PollsView';
import BoardView from './components/BoardView';
import OperationalView from './components/OperationalView';
import ManagementView from './components/ManagementView';
import Login from './components/Login';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [polls, setPolls] = useState<Poll[]>(MOCK_POLLS);
  const [announcements, setAnnouncements] = useState<Announcement[]>(MOCK_ANNOUNCEMENTS);
  const [tasks, setTasks] = useState<OperationalTask[]>(MOCK_TASKS);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('condo_theme') === 'dark';
  });

  useEffect(() => {
    const savedUser = localStorage.getItem('condo_user');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  useEffect(() => {
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

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  if (!currentUser) {
    return (
      <div className={isDarkMode ? 'dark' : ''}>
        <Login onLogin={handleLogin} users={users} />
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard user={currentUser} polls={polls} announcements={announcements} tasks={tasks} notifications={notifications} onNavigate={setActiveTab} />;
      case 'gatehouse': return <GatehouseView user={currentUser} onSendNotification={(n) => setNotifications([n, ...notifications])} />;
      case 'polls': return <PollsView user={currentUser} polls={polls} setPolls={setPolls} />;
      case 'board': return <BoardView user={currentUser} announcements={announcements} setAnnouncements={setAnnouncements} />;
      case 'operational': return <OperationalView user={currentUser} tasks={tasks} setTasks={setTasks} />;
      case 'management': return <ManagementView users={users} setUsers={setUsers} />;
      default: return <Dashboard user={currentUser} polls={polls} announcements={announcements} tasks={tasks} notifications={notifications} onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className={`${isDarkMode ? 'dark' : ''}`}>
      <div className="min-h-screen flex flex-col md:flex-row bg-neutral-surface dark:bg-brand-1 transition-colors duration-300">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} user={currentUser} onLogout={handleLogout} />
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <Navbar 
            user={currentUser} 
            isDarkMode={isDarkMode}
            toggleTheme={toggleTheme}
            notifications={notifications.filter(n => n.unitId === currentUser.unit || currentUser.role !== UserRole.MORADOR)} 
          />
          <main className="flex-1 overflow-y-auto p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
              {renderContent()}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default App;
