import React, { useState, useEffect, useMemo } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar 
} from 'recharts';
import { 
  LayoutDashboard, 
  Settings, 
  LogOut, 
  Plus, 
  Trash2, 
  RefreshCw, 
  ShieldCheck, 
  HardDrive, 
  Activity, 
  CreditCard, 
  Database,
  Mail,
  Moon,
  Sun,
  Key,
  CheckCircle2,
  AlertTriangle,
  Github,
  Chrome
} from 'lucide-react';

/**
 * Mock Data & Types
 */

type ServiceType = 'api' | 'subscription' | 'storage';
type Provider = 'openai' | 'google' | 'microsoft' | 'canva' | 'github' | 'vercel' | 'other';

interface UsagePoint {
  date: string;
  cost: number;
  requests?: number;
}

interface Service {
  id: string;
  name: string;
  provider: Provider;
  type: ServiceType;
  status: 'active' | 'inactive' | 'error';
  monthlyCost: number; // in JPY for simplicity in this demo
  currency: 'JPY' | 'USD';
  apiKeyMasked?: string;
  usageHistory: UsagePoint[];
  lastSynced: string;
}

interface User {
  name: string;
  email: string;
  avatar: string;
}

const MOCK_USAGE_DATA: UsagePoint[] = Array.from({ length: 30 }, (_, i) => ({
  date: `2024-05-${String(i + 1).padStart(2, '0')}`,
  cost: Math.floor(Math.random() * 500) + 100,
  requests: Math.floor(Math.random() * 1000) + 50,
}));

const INITIAL_SERVICES: Service[] = [
  {
    id: '1',
    name: 'OpenAI API',
    provider: 'openai',
    type: 'api',
    status: 'active',
    monthlyCost: 4500,
    currency: 'USD',
    apiKeyMasked: 'sk-proj...8B2a',
    usageHistory: MOCK_USAGE_DATA,
    lastSynced: '2024-05-30 10:00',
  },
  {
    id: '2',
    name: 'Google Workspace',
    provider: 'google',
    type: 'subscription',
    status: 'active',
    monthlyCost: 1360,
    currency: 'JPY',
    usageHistory: [],
    lastSynced: '2024-05-01 00:00',
  },
  {
    id: '3',
    name: 'Vercel Pro',
    provider: 'vercel',
    type: 'subscription',
    status: 'active',
    monthlyCost: 3000,
    currency: 'USD',
    usageHistory: [],
    lastSynced: '2024-05-01 00:00',
  },
  {
    id: '4',
    name: 'Canva Teams',
    provider: 'canva',
    type: 'subscription',
    status: 'active',
    monthlyCost: 1500,
    currency: 'JPY',
    usageHistory: [],
    lastSynced: '2024-05-01 00:00',
  },
];

/**
 * Components
 */

// --- Button Component ---
const Button = ({ 
  children, onClick, variant = 'primary', className = '', disabled = false 
}: { 
  children: React.ReactNode, onClick?: () => void, variant?: 'primary' | 'secondary' | 'danger' | 'ghost', className?: string, disabled?: boolean 
}) => {
  const baseStyle = "px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20",
    secondary: "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700",
    danger: "bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20",
    ghost: "hover:bg-slate-800 text-slate-400 hover:text-white"
  };

  return (
    <button onClick={onClick} className={`${baseStyle} ${variants[variant]} ${className}`} disabled={disabled}>
      {children}
    </button>
  );
};

// --- Card Component ---
const Card = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
  <div className={`bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm ${className}`}>
    {children}
  </div>
);

// --- Badge Component ---
const StatusBadge = ({ status }: { status: Service['status'] }) => {
  const styles = {
    active: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    inactive: "bg-slate-500/10 text-slate-400 border-slate-500/20",
    error: "bg-red-500/10 text-red-400 border-red-500/20",
  };
  
  const labels = {
    active: "稼働中",
    inactive: "停止中",
    error: "エラー",
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status]} flex items-center gap-1.5 w-fit`}>
      <span className={`w-1.5 h-1.5 rounded-full ${status === 'active' ? 'bg-emerald-400 animate-pulse' : status === 'error' ? 'bg-red-400' : 'bg-slate-400'}`}></span>
      {labels[status]}
    </span>
  );
};

// --- Login Screen ---
const LoginScreen = ({ onLogin }: { onLogin: () => void }) => {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white p-4 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px]" />

      <div className="max-w-md w-full z-10 space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 mb-4 shadow-xl shadow-blue-500/20">
            <Activity className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            SaaS Master
          </h1>
          <p className="text-slate-400">
            全サービスのAPIコストとサブスクリプションを一元管理
          </p>
        </div>

        <Card className="space-y-4 backdrop-blur-xl bg-slate-900/80">
          <button 
            onClick={onLogin}
            className="w-full bg-white text-slate-900 font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-3 hover:bg-slate-100 transition-colors"
          >
            <Chrome className="w-5 h-5" />
            Googleアカウントで続行
          </button>
          
          <button 
            onClick={onLogin}
            className="w-full bg-[#24292F] text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-3 hover:bg-[#24292F]/90 transition-colors"
          >
            <Github className="w-5 h-5" />
            GitHubアカウントで続行
          </button>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-700" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-slate-900 px-2 text-slate-500">またはメールアドレス</span>
            </div>
          </div>

          <div className="space-y-3">
            <input 
              type="email" 
              placeholder="name@company.com" 
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Button onClick={onLogin} className="w-full">
              メールでログイン
            </Button>
          </div>
        </Card>
        
        <p className="text-xs text-center text-slate-500">
          ログインすることで、利用規約とプライバシーポリシーに同意したものとみなされます。<br/>
          Vercel + Next.js Secure Environment
        </p>
      </div>
    </div>
  );
};

// --- Main Dashboard Component ---
export default function SaaS_Master_Dashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [services, setServices] = useState<Service[]>(INITIAL_SERVICES);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'services' | 'settings'>('dashboard');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [backupStatus, setBackupStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  // --- Mock Computed Stats ---
  const totalCost = useMemo(() => {
    return services.reduce((acc, service) => {
      // Simple Mock Exchange Rate: 1 USD = 150 JPY
      const costInJPY = service.currency === 'USD' ? service.monthlyCost * 150 : service.monthlyCost;
      return acc + costInJPY;
    }, 0);
  }, [services]);

  const activeServiceCount = services.filter(s => s.status === 'active').length;

  // --- Handlers ---
  const handleLogin = () => setIsLoggedIn(true);
  const handleLogout = () => setIsLoggedIn(false);

  const handleDeleteService = (id: string) => {
    if (confirm('このサービスを削除してよろしいですか？紐づいているAPIキーも削除されます。')) {
      setServices(prev => prev.filter(s => s.id !== id));
      setSelectedService(null);
    }
  };

  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate adding a service
    const newService: Service = {
      id: Math.random().toString(),
      name: 'New Added Service',
      provider: 'other',
      type: 'api',
      status: 'active',
      monthlyCost: 0,
      currency: 'JPY',
      usageHistory: [],
      lastSynced: new Date().toLocaleString(),
    };
    setServices([...services, newService]);
    setIsAddModalOpen(false);
  };

  const handleBackup = () => {
    setBackupStatus('loading');
    setTimeout(() => {
      setBackupStatus('success');
      setTimeout(() => setBackupStatus('idle'), 3000);
    }, 1500);
  };

  if (!isLoggedIn) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  // --- Main Layout ---
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans flex overflow-hidden">
      
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-slate-800 bg-slate-950 flex flex-col hidden md:flex">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg text-white tracking-tight">SaaS Master</span>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          <NavItem 
            icon={<LayoutDashboard size={20} />} 
            label="ダッシュボード" 
            isActive={activeTab === 'dashboard'} 
            onClick={() => setActiveTab('dashboard')} 
          />
          <NavItem 
            icon={<Database size={20} />} 
            label="連携サービス" 
            isActive={activeTab === 'services'} 
            onClick={() => setActiveTab('services')} 
          />
          <NavItem 
            icon={<Settings size={20} />} 
            label="設定・バックアップ" 
            isActive={activeTab === 'settings'} 
            onClick={() => setActiveTab('settings')} 
          />
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 px-2 py-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-blue-900/50 flex items-center justify-center text-blue-200 text-xs font-bold border border-blue-500/30">
              YO
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">Yuki O.</p>
              <p className="text-xs text-slate-500 truncate">admin@saas-master.io</p>
            </div>
          </div>
          <Button variant="ghost" onClick={handleLogout} className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-500/10">
            <LogOut size={18} />
            ログアウト
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Header (Mobile only mainly) */}
        <header className="h-16 border-b border-slate-800 bg-slate-950/50 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-20">
          <h2 className="font-semibold text-white text-lg">
            {activeTab === 'dashboard' && 'ダッシュボード'}
            {activeTab === 'services' && 'サービス管理'}
            {activeTab === 'settings' && '設定'}
          </h2>
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-white transition-colors">
              <Mail size={20} />
            </button>
            <div className="w-px h-6 bg-slate-800" />
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 shadow-lg shadow-blue-500/20 transition-all"
            >
              <Plus size={16} />
              <span className="hidden sm:inline">連携を追加</span>
            </button>
          </div>
        </header>

        {/* Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
          
          {activeTab === 'dashboard' && (
            <DashboardView 
              services={services} 
              totalCost={totalCost} 
              activeCount={activeServiceCount} 
              onManageClick={(s) => {
                setSelectedService(s);
                setActiveTab('services');
              }}
            />
          )}

          {activeTab === 'services' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-white flex items-center gap-2">
                  <Database size={20} className="text-blue-500" />
                  連携済みサービス一覧
                </h3>
                {services.map(service => (
                  <div 
                    key={service.id} 
                    onClick={() => setSelectedService(service)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${selectedService?.id === service.id ? 'bg-blue-600/10 border-blue-500/50' : 'bg-slate-900 border-slate-800 hover:border-slate-700'}`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <ServiceIcon provider={service.provider} />
                        <div>
                          <p className="font-semibold text-white">{service.name}</p>
                          <p className="text-xs text-slate-500 uppercase">{service.type}</p>
                        </div>
                      </div>
                      <StatusBadge status={service.status} />
                    </div>
                    <div className="mt-4 flex justify-between items-end">
                      <div className="text-sm text-slate-400">
                        最終同期: {service.lastSynced}
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-slate-500">今月のコスト</p>
                        <p className="font-mono text-lg text-white">
                          {service.currency === 'JPY' ? '¥' : '$'}
                          {service.monthlyCost.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="lg:h-full">
                {selectedService ? (
                  <Card className="h-full sticky top-6 border-blue-500/20 bg-slate-900/50">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-slate-800 rounded-lg">
                          <ServiceIcon provider={selectedService.provider} size={32} />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white">{selectedService.name}</h3>
                          <p className="text-slate-400 text-sm">ID: {selectedService.id}</p>
                        </div>
                      </div>
                      <Button variant="danger" onClick={() => handleDeleteService(selectedService.id)}>
                        <Trash2 size={16} />
                        削除
                      </Button>
                    </div>

                    <div className="space-y-6">
                      <div className="bg-slate-950 rounded-lg p-4 border border-slate-800">
                        <h4 className="text-sm font-medium text-slate-400 mb-2 uppercase tracking-wider">API Key Settings</h4>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-slate-300 font-mono bg-slate-900 px-3 py-1.5 rounded border border-slate-800">
                            <Key size={14} className="text-amber-500" />
                            {selectedService.apiKeyMasked || '••••••••••••••••'}
                          </div>
                          <Button variant="secondary" className="text-sm py-1">再設定</Button>
                        </div>
                        <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                          <ShieldCheck size={12} className="text-emerald-500" />
                          AES-256で暗号化されて保存されています
                        </p>
                      </div>

                      {selectedService.type === 'api' && (
                        <div>
                          <h4 className="text-sm font-medium text-slate-400 mb-4">利用状況 (直近30日)</h4>
                          <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={MOCK_USAGE_DATA.slice(-7)}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickFormatter={(v) => v.slice(8)} />
                                <YAxis stroke="#94a3b8" fontSize={12} />
                                <Tooltip 
                                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                                  cursor={{ fill: '#334155', opacity: 0.4 }}
                                />
                                <Bar dataKey="requests" fill="#3b82f6" radius={[4, 4, 0, 0]} name="リクエスト数" />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-slate-950 rounded-lg border border-slate-800">
                          <p className="text-xs text-slate-500">ステータス</p>
                          <p className="text-emerald-400 font-medium flex items-center gap-2 mt-1">
                            <CheckCircle2 size={16} />
                            正常稼働中
                          </p>
                        </div>
                        <div className="p-4 bg-slate-950 rounded-lg border border-slate-800">
                          <p className="text-xs text-slate-500">次回請求日</p>
                          <p className="text-white font-medium mt-1">2024/06/01</p>
                        </div>
                      </div>
                    </div>
                  </Card>
                ) : (
                  <div className="h-full flex items-center justify-center text-slate-500 border border-dashed border-slate-800 rounded-xl bg-slate-900/30">
                    <p>左のリストからサービスを選択して詳細を表示</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="max-w-3xl mx-auto space-y-8">
              <Card>
                <div className="flex items-start gap-4 mb-6">
                  <div className="p-3 bg-blue-500/10 rounded-xl">
                    <HardDrive size={32} className="text-blue-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Google Drive Backup</h3>
                    <p className="text-slate-400">設定データと課金履歴をGoogle Driveに自動バックアップします。</p>
                  </div>
                </div>

                <div className="bg-slate-950 rounded-xl p-6 border border-slate-800 flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                      {/* Fake Google Drive Icon */}
                      <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-b-[10px] border-l-transparent border-r-transparent border-b-green-500 relative -top-1"></div>
                    </div>
                    <div>
                      <p className="font-medium text-white">Google Drive連携</p>
                      <p className="text-xs text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 size={12} /> 接続済み (drive.file scope)
                      </p>
                    </div>
                  </div>
                  <Button variant="secondary" className="text-xs">接続解除</Button>
                </div>

                <div className="flex gap-4">
                  <Button 
                    onClick={handleBackup} 
                    disabled={backupStatus === 'loading'}
                    className="flex-1"
                  >
                    {backupStatus === 'loading' ? (
                      <RefreshCw className="animate-spin w-4 h-4" />
                    ) : backupStatus === 'success' ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <HardDrive className="w-4 h-4" />
                    )}
                    {backupStatus === 'loading' ? 'バックアップ中...' : backupStatus === 'success' ? '完了' : '今すぐバックアップ'}
                  </Button>
                  <Button variant="secondary" className="flex-1">
                    インポート
                  </Button>
                </div>
              </Card>

              <Card>
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Mail size={20} className="text-purple-500" />
                  通知設定
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-950 rounded-lg border border-slate-800">
                    <div>
                      <p className="font-medium text-white">月次サマリーレポート</p>
                      <p className="text-xs text-slate-500">毎月1日に利用状況の要約をメールで送信します</p>
                    </div>
                    <div className="w-12 h-6 bg-blue-600 rounded-full relative cursor-pointer">
                      <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-slate-950 rounded-lg border border-slate-800">
                    <div>
                      <p className="font-medium text-white">予算超過アラート</p>
                      <p className="text-xs text-slate-500">設定した予算を超えそうな場合に即時通知します</p>
                    </div>
                    <div className="w-12 h-6 bg-slate-700 rounded-full relative cursor-pointer">
                      <div className="absolute left-1 top-1 w-4 h-4 bg-slate-400 rounded-full shadow-sm"></div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>

        {/* Add Service Modal */}
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                <h3 className="text-lg font-bold text-white">新しいサービスを連携</h3>
                <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white">
                  <Plus size={24} className="rotate-45" />
                </button>
              </div>
              <form onSubmit={handleAddService} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">サービス名</label>
                  <input type="text" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none" placeholder="例: DeepL Pro" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">タイプ</label>
                    <select className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white outline-none">
                      <option value="subscription">サブスクリプション</option>
                      <option value="api">API従量課金</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">通貨</label>
                    <select className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white outline-none">
                      <option value="JPY">JPY (¥)</option>
                      <option value="USD">USD ($)</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">API Key (任意)</label>
                  <input type="password" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none" placeholder="sk-..." />
                  <p className="text-xs text-slate-500 mt-1">※API連携しない場合は手動でコストを入力できます</p>
                </div>
                <div className="pt-4 flex justify-end gap-3">
                  <Button variant="ghost" onClick={() => setIsAddModalOpen(false)}>キャンセル</Button>
                  <Button>追加する</Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// --- Dashboard Sub-Components ---

function DashboardView({ services, totalCost, activeCount, onManageClick }: { 
  services: Service[], totalCost: number, activeCount: number, onManageClick: (s: Service) => void 
}) {
  // Aggregate daily costs for the chart
  const chartData = useMemo(() => {
    const data = new Map<string, number>();
    // Initialize with some base values for the visual
    MOCK_USAGE_DATA.forEach(p => data.set(p.date, 0));
    
    // Sum up dummy data (in real app, sum all services)
    MOCK_USAGE_DATA.forEach(p => {
      data.set(p.date, (data.get(p.date) || 0) + p.cost);
    });

    return Array.from(data.entries()).map(([date, cost]) => ({ date, cost }));
  }, [services]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="relative overflow-hidden group">
          <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <CreditCard size={64} className="text-blue-500" />
          </div>
          <p className="text-slate-400 text-sm font-medium">今月の推定コスト合計</p>
          <p className="text-3xl font-bold text-white mt-1 font-mono tracking-tight">
            ¥{totalCost.toLocaleString()}
          </p>
          <div className="mt-4 flex items-center text-xs text-emerald-400 bg-emerald-500/10 w-fit px-2 py-1 rounded">
            <Activity size={12} className="mr-1" />
            先月比 +12.5%
          </div>
        </Card>

        <Card className="relative overflow-hidden group">
          <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Database size={64} className="text-purple-500" />
          </div>
          <p className="text-slate-400 text-sm font-medium">アクティブなサービス</p>
          <p className="text-3xl font-bold text-white mt-1 font-mono tracking-tight">
            {activeCount} <span className="text-lg text-slate-500 font-sans font-normal">/ {services.length}</span>
          </p>
          <div className="mt-4 text-xs text-slate-500">
            全システム正常稼働中
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-blue-900/40 to-slate-900 border-blue-500/20">
          <p className="text-blue-200 text-sm font-medium">システム通知</p>
          <div className="mt-3 space-y-2">
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <CheckCircle2 size={12} className="text-emerald-400" />
              <span>月次レポート送信済み (05/01)</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <CheckCircle2 size={12} className="text-emerald-400" />
              <span>バックアップ完了 (10:00)</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Chart */}
      <Card className="h-[350px] p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium text-white">日次コスト推移 (JPY)</h3>
          <select className="bg-slate-950 border border-slate-800 text-xs rounded px-2 py-1 text-slate-300 outline-none">
            <option>直近30日</option>
            <option>今月</option>
            <option>先月</option>
          </select>
        </div>
        <ResponsiveContainer width="100%" height="80%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis dataKey="date" stroke="#64748b" fontSize={12} tickFormatter={(str) => str.slice(8)} tickMargin={10} />
            <YAxis stroke="#64748b" fontSize={12} tickFormatter={(val) => `¥${val}`} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', color: '#f8fafc' }}
              itemStyle={{ color: '#60a5fa' }}
              formatter={(value: number) => [`¥${value.toLocaleString()}`, 'Cost']}
            />
            <Area type="monotone" dataKey="cost" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorCost)" />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      {/* Quick Service List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <div key={service.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between hover:border-slate-600 transition-colors">
            <div className="flex items-center gap-3">
              <ServiceIcon provider={service.provider} />
              <div>
                <p className="font-medium text-white text-sm">{service.name}</p>
                <p className="text-xs text-slate-500 font-mono mt-0.5">
                  {service.currency === 'JPY' ? '¥' : '$'}
                  {service.monthlyCost.toLocaleString()} / mo
                </p>
              </div>
            </div>
            <Button variant="secondary" className="px-3 py-1 text-xs h-8" onClick={() => onManageClick(service)}>
              管理
            </Button>
          </div>
        ))}
        
        <button 
          onClick={() => document.querySelector<HTMLButtonElement>('header button')?.click()}
          className="border border-dashed border-slate-800 rounded-xl p-4 flex items-center justify-center text-slate-500 hover:text-blue-400 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all group"
        >
          <div className="flex flex-col items-center gap-2">
            <Plus size={24} className="group-hover:scale-110 transition-transform" />
            <span className="text-xs font-medium">サービスを追加</span>
          </div>
        </button>
      </div>
    </div>
  );
}

// --- Utils ---

function NavItem({ icon, label, isActive, onClick }: { icon: React.ReactNode, label: string, isActive: boolean, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
        isActive 
          ? 'bg-blue-600/10 text-blue-400' 
          : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
      }`}
    >
      {React.cloneElement(icon as React.ReactElement, { size: 20 })}
      <span className="font-medium text-sm">{label}</span>
      {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.6)]" />}
    </button>
  );
}

function ServiceIcon({ provider, size = 20 }: { provider: Provider, size?: number }) {
  const wrapperClass = "w-10 h-10 rounded-lg flex items-center justify-center shrink-0";
  
  switch (provider) {
    case 'openai':
      return <div className={`${wrapperClass} bg-emerald-900/30 text-emerald-400`}><Activity size={size} /></div>; // Placeholder
    case 'google':
      return <div className={`${wrapperClass} bg-blue-900/30 text-blue-400`}><HardDrive size={size} /></div>;
    case 'github':
      return <div className={`${wrapperClass} bg-slate-700/30 text-slate-200`}><Github size={size} /></div>;
    case 'vercel':
      return <div className={`${wrapperClass} bg-black border border-slate-700 text-white`}><div className="w-0 h-0 border-l-[6px] border-r-[6px] border-b-[10px] border-l-transparent border-r-transparent border-b-white"></div></div>;
    case 'canva':
      return <div className={`${wrapperClass} bg-purple-900/30 text-purple-400`}><span className="font-bold text-xs">Cv</span></div>;
    default:
      return <div className={`${wrapperClass} bg-slate-800 text-slate-400`}><Database size={size} /></div>;
  }
}