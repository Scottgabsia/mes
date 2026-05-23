import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, 
  MapPin, 
  Phone, 
  FileText, 
  Mail, 
  LayoutDashboard,
  Layers,
  Activity,
  Users,
  Menu,
  X,
  ChevronRight,
  ChevronLeft,
  Terminal
} from 'lucide-react';
import { Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { HomeView } from './views/HomeView';
import { ServicesView } from './views/ServicesView';
import { IntelligenceView } from './views/IntelligenceView';
import { ClientPortalView } from './views/ClientPortalView';
import { RecoveryConfirmationView } from './views/RecoveryConfirmationView';
import { ClientDashboardView } from './views/ClientDashboardView';
import { ChainTraceabilityView } from './views/ChainTraceabilityView';
import { ExchangeRecoveryView } from './views/ExchangeRecoveryView';
import { LegalEnforcementView } from './views/LegalEnforcementView';
import { RiskMonitoringView } from './views/RiskMonitoringView';
import { ToolsView } from './views/ToolsView';
import { ISO27001View } from './views/ISO27001View';
import { SOC2View } from './views/SOC2View';
import { GDPRView } from './views/GDPRView';
import { AMLKYCView } from './views/AMLKYCView';
import { CaseLookupView } from './views/CaseLookupView';
import { AboutView } from './views/AboutView';
import { BlogView } from './views/BlogView';
import { PrivacyPolicyView } from './views/PrivacyPolicyView';
import { TermsOfServiceView } from './views/TermsOfServiceView';
import { ReviewsView } from './views/ReviewsView';
import { SubmitReviewView } from './views/SubmitReviewView';
import { AdminLoginView } from './views/AdminLoginView';
import { FAQView } from './views/FAQView';
import CaseManagerView from './views/AdminDashboardView';

type View = 
  | 'home' 
  | 'services' 
  | 'intelligence' 
  | 'about'
  | 'blog'
  | 'privacyPolicy'
  | 'termsOfService'
  | 'reviews'
  | 'submitReview'
  | 'faq'
  | 'admin'
  | 'clientPortal' 
  | 'recoveryConfirmation' 
  | 'clientDashboard' 
  | 'caseLookup'
  | 'chainTraceability' 
  | 'exchangeRecovery' 
  | 'legalEnforcement' 
  | 'riskMonitoring' 
  | 'tools'
  | 'iso27001'
  | 'soc2'
  | 'gdpr'
  | 'amlkyc';

const NavLink = ({ 
  children, 
  active = false, 
  onClick 
}: { 
  children: React.ReactNode; 
  active?: boolean;
  onClick?: () => void;
}) => (
  <button 
    onClick={onClick}
    className={`font-manrope text-sm font-bold tracking-widest uppercase transition-colors cursor-pointer ${
      active ? 'text-blue-500' : 'text-slate-400 hover:text-blue-400'
    }`}
  >
    {children}
  </button>
);

export default function App() {
  const [currentView, setCurrentView] = React.useState<View>('home');
  const [selectedCase, setSelectedCase] = React.useState<any>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();

  // Handle initial route
  React.useEffect(() => {
    const path = location.pathname;
    if (path === '/admin/login' || path === '/admin/dashboard') {
      setCurrentView('admin');
    }
  }, []);

  // Scroll to top and handle sidebar collapse on view change
  React.useEffect(() => {
    window.scrollTo(0, 0);
    
    // Auto collapse logic based on view
    const autoCollapseViews: View[] = [
      'intelligence', 
      'about',
      'blog',
      'privacyPolicy',
      'termsOfService',
      'clientPortal', 
      'recoveryConfirmation', 
      'clientDashboard', 
      'caseLookup',
      'chainTraceability', 
      'exchangeRecovery', 
      'legalEnforcement', 
      'riskMonitoring', 
      'tools',
      'iso27001',
      'soc2',
      'gdpr',
      'amlkyc',
      'admin'
    ];
    
    if (autoCollapseViews.includes(currentView)) {
      setIsSidebarCollapsed(true);
    } else {
      setIsSidebarCollapsed(false);
    }
  }, [currentView]);

  // Sync currentView with location for direct URL access
  React.useEffect(() => {
    let path = location.pathname;
    // Normalize path: remove trailing slash except for root
    if (path.length > 1 && path.endsWith('/')) {
      path = path.slice(0, -1);
    }

    const pathMapRev: Record<string, View> = {
      '/': 'home',
      '/about': 'about',
      '/blog': 'blog',
      '/services': 'services',
      '/intelligence': 'intelligence',
      '/contact': 'clientPortal',
      '/client-portal': 'clientPortal',
      '/admin/login': 'admin',
      '/admin/dashboard': 'admin',
      '/case-lookup': 'caseLookup',
      '/privacy': 'privacyPolicy',
      '/terms': 'termsOfService',
      '/reviews': 'reviews',
      '/reviews/submit': 'submitReview',
      '/faq': 'faq',
      '/traceability': 'chainTraceability',
      '/recovery': 'exchangeRecovery',
      '/legal': 'legalEnforcement',
      '/risk': 'riskMonitoring',
      '/tools': 'tools',
      '/iso27001': 'iso27001',
      '/soc2': 'soc2',
      '/gdpr': 'gdpr',
      '/amlkyc': 'amlkyc'
    };

    if (pathMapRev[path]) {
      setCurrentView(pathMapRev[path]);
    } else {
      // Fallback to home for unknown paths
      setCurrentView('home');
    }
  }, [location.pathname]);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);

  const handleNavClick = (view: View) => {
    setCurrentView(view);
    closeMobileMenu();
    window.scrollTo({ top: 0, behavior: 'instant' });
    
    // Navigation mapping
    const pathMap: Record<string, string> = {
      'home': '/',
      'about': '/about',
      'blog': '/blog',
      'services': '/services',
      'intelligence': '/intelligence',
      'clientPortal': '/contact',
      'admin': '/admin/login',
      'caseLookup': '/case-lookup',
      'privacyPolicy': '/privacy',
      'termsOfService': '/terms',
      'reviews': '/reviews',
      'submitReview': '/reviews/submit',
      'faq': '/faq',
      'chainTraceability': '/traceability',
      'exchangeRecovery': '/recovery',
      'legalEnforcement': '/legal',
      'riskMonitoring': '/risk',
      'tools': '/tools',
      'iso27001': '/iso27001',
      'soc2': '/soc2',
      'gdpr': '/gdpr',
      'amlkyc': '/amlkyc'
    };

    if (pathMap[view]) {
      navigate(pathMap[view]);
    }
  };

  // Dedicated Route handlers for Admin
  if (location.pathname === '/admin/login' || location.pathname === '/admin/login/') {
    return <AdminLoginView />;
  }

  if (location.pathname === '/admin/dashboard' || location.pathname === '/admin/dashboard/') {
    return <CaseManagerView />;
  }

  return (
    <div className={`min-h-screen ${currentView !== 'home' ? 'cyber-bg' : ''}`}>
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-2xl border-b border-white/10">
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 max-w-[1600px] mx-auto w-full">
            <div className="flex items-center gap-2 sm:gap-4 cursor-pointer group" onClick={() => handleNavClick('home')}>
              <div className="relative w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center">
                <div className="absolute inset-0 bg-blue-500/10 rounded-full blur-lg group-hover:bg-blue-500/30 transition-all"></div>
                <img 
                  src="/logo.png?v=3" 
                  alt="Crypto Recovery Assets Agency Logo" 
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 sm:w-14 sm:h-14 object-contain relative z-10" 
                />
              </div>
              <div className="flex flex-col">
              <div className="text-base sm:text-xl font-black tracking-tighter text-white uppercase font-manrope leading-none">
                Crypto Recovery <span className="text-blue-500">Assets</span>
              </div>
              <span className="text-[7px] sm:text-[8px] font-mono text-blue-400/80 tracking-[0.2em] uppercase mt-1 font-bold">Professional Forensic Analysis & Crypto Recovery Services</span>
            </div>
          </div>
          
          <nav className="hidden lg:flex items-center gap-10">
            <div className="flex flex-col items-end mr-4">
              <span className="font-fira text-[10px] text-blue-500/60 uppercase tracking-widest">Live Network Status</span>
              <span className="font-fira text-[11px] text-blue-400 animate-pulse">● SECURING NODE 8.21.03...</span>
            </div>
            <NavLink active={currentView === 'home'} onClick={() => handleNavClick('home')}>Home</NavLink>
            <NavLink active={currentView === 'about'} onClick={() => handleNavClick('about')}>About</NavLink>
            <NavLink active={currentView === 'services'} onClick={() => handleNavClick('services')}>Services</NavLink>
            <NavLink active={currentView === 'intelligence'} onClick={() => handleNavClick('intelligence')}>Intelligence</NavLink>
            <NavLink active={currentView === 'faq'} onClick={() => handleNavClick('faq')}>FAQ</NavLink>
            <NavLink active={currentView === 'clientPortal'} onClick={() => handleNavClick('clientPortal')}>Contact</NavLink>
            
            <button 
              onClick={() => handleNavClick('caseLookup')}
              className={`ml-4 mr-6 px-4 py-2 rounded-lg border font-manrope text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-2 ${
                currentView === 'caseLookup' 
                ? 'bg-blue-600 border-blue-500 text-white shadow-[0_0_15px_rgba(0,98,255,0.4)]' 
                : 'border-white/10 text-slate-400 hover:border-blue-500/50 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              Check Status
            </button>
          </nav>

          <div className="flex items-center gap-4 lg:gap-6">
            <div className="hidden xl:flex flex-col text-right">
              <span className="font-fira text-[10px] text-slate-500 uppercase">System Integrity</span>
              <span className="font-fira text-xs text-emerald-400">99.998% SECURE</span>
            </div>
            <button 
              className="flex w-10 h-10 rounded-full border border-blue-500/30 items-center justify-center active:scale-95 transition-transform ring-4 ring-blue-600/5 bg-blue-600/10 text-blue-500 hover:bg-blue-600/20 hover:text-white cursor-pointer" 
              onClick={() => handleNavClick('clientPortal')}
              title="Contact Support"
            >
              <Mail className="w-5 h-5" />
            </button>
            {/* Mobile Menu Toggle */}
            <button 
              onClick={toggleMobileMenu}
              className="lg:hidden p-2 text-slate-400 hover:text-blue-500 transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden bg-slate-950/95 border-b border-white/10 overflow-y-auto max-h-[calc(100vh-80px)]"
            >
              <nav className="flex flex-col p-6 gap-6">
                <div className="flex border-b border-white/5 pb-6">
                   <button 
                    onClick={() => handleNavClick('caseLookup')}
                    className="w-full py-4 bg-blue-600/10 border border-blue-500/30 rounded-xl text-blue-400 font-manrope text-xs font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3"
                  >
                    <FileText className="w-4 h-4" />
                    CHECK_STATUS_RECOVERY
                  </button>
                </div>
                <div className="flex items-center gap-4 mb-2">
                  <img 
                    src="/logo.png?v=3" 
                    alt="Crypto Recovery Assets Agency Logo" 
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 object-contain" 
                  />
                  <div className="flex flex-col">
                    <span className="text-white font-black text-sm uppercase tracking-tighter">Crypto Recovery</span>
                    <span className="text-blue-500 font-mono text-[9px] uppercase tracking-widest font-bold">Assets</span>
                  </div>
                </div>
                <div className="flex flex-col border-l-2 border-blue-500/30 pl-4 mb-2">
                  <span className="font-fira text-[10px] text-blue-500/60 uppercase tracking-widest">Network Status</span>
                  <span className="font-fira text-[11px] text-blue-400">● NODE 8.21.03 SECURED</span>
                </div>
                <button 
                  onClick={() => handleNavClick('home')}
                  className={`text-left font-manrope text-lg font-bold tracking-widest uppercase transition-colors ${
                    currentView === 'home' ? 'text-blue-500' : 'text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <LayoutDashboard className="w-5 h-5" /> Home
                  </div>
                </button>
                <button 
                  onClick={() => handleNavClick('about')}
                  className={`text-left font-manrope text-lg font-bold tracking-widest uppercase transition-colors ${
                    currentView === 'about' ? 'text-blue-500' : 'text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5" /> About Us
                  </div>
                </button>
                <button 
                  onClick={() => handleNavClick('services')}
                  className={`text-left font-manrope text-lg font-bold tracking-widest uppercase transition-colors ${
                    currentView === 'services' ? 'text-blue-500' : 'text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Layers className="w-5 h-5" /> Services
                  </div>
                </button>
                <button 
                  onClick={() => handleNavClick('intelligence')}
                  className={`text-left font-manrope text-lg font-bold tracking-widest uppercase transition-colors ${
                    currentView === 'intelligence' ? 'text-blue-500' : 'text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Activity className="w-5 h-5" /> Intelligence
                  </div>
                </button>
                <button 
                  onClick={() => handleNavClick('clientPortal')}
                  className={`text-left font-manrope text-lg font-bold tracking-widest uppercase transition-colors ${
                    currentView === 'clientPortal' ? 'text-blue-500' : 'text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5" /> Contact Us
                  </div>
                </button>
                <div className="pt-6 border-t border-white/5 space-y-4">
                  <div 
                    className="flex items-center gap-4 cursor-pointer group"
                    onClick={() => handleNavClick('clientPortal')}
                  >
                    <div className="w-10 h-10 rounded-full border border-blue-500/30 flex items-center justify-center bg-blue-600/10 text-blue-500 group-hover:bg-blue-600/20 transition-colors">
                      <Mail className="w-5 h-5" />
                    </div>
                    <span className="font-manrope text-white font-bold uppercase tracking-widest text-[11px]">Secure Channel</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-fira text-[10px] text-slate-500 uppercase">Integrity</span>
                    <span className="font-fira text-sm text-emerald-400 uppercase tracking-tighter font-bold">99.998% SECURE</span>
                  </div>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Services/Intelligence Sub-Header (Ticker) */}
      {(currentView === 'services' || currentView === 'intelligence') && (
        <div className="fixed top-[64px] w-full z-40 bg-slate-950/60 border-b border-white/5 backdrop-blur-md overflow-hidden h-10 flex items-center">
          <div className="flex items-center gap-4 px-6 border-r border-white/5 bg-slate-950/90 h-full">
            <span className={`w-2 h-2 rounded-full animate-pulse ${currentView === 'intelligence' ? 'bg-red-500 shadow-[0_0_8px_#ef4444]' : 'bg-emerald-500 shadow-[0_0_8px_#10b981]'}`}></span>
            <span className={`text-[9px] font-fira uppercase tracking-[0.2em] whitespace-nowrap ${currentView === 'intelligence' ? 'text-red-400' : 'text-primary'}`}>
              {currentView === 'intelligence' ? 'Network Threats: Critical' : 'Core Network: Online'}
            </span>
          </div>
          <div className="flex-1 flex whitespace-nowrap overflow-hidden items-center">
            <div className={`scrolling-ticker flex items-center gap-12 px-6 ${currentView === 'intelligence' ? 'animate-[scroll-fast_20s_linear_infinite]' : ''}`}>
              {currentView === 'intelligence' ? (
                <>
                  <span className="text-[10px] font-fira text-red-500 font-bold uppercase tracking-[0.2em]">CRITICAL ALERT: LARGE SCALE LIQUIDITY DRAIN DETECTED ON ETHEREUM MAINNET [0x4A...22E1]</span>
                  <span className="text-[10px] font-fira text-yellow-500 font-bold uppercase tracking-[0.2em]">WARNING: SUSPICIOUS NODE ACTIVITY IN SOUTH-EAST ASIA CLUSTER</span>
                  <span className="text-[10px] font-fira text-blue-400 font-bold uppercase tracking-[0.2em]">SYSTEM: HEURISTIC ENGINE UPGRADED TO V2.4.1</span>
                </>
              ) : (
                <>
                  <span className="text-[10px] font-fira text-slate-400"><span className="text-primary/60 font-bold">ENCRYPTION:</span> LEVEL 9 [AES-256-GCM]</span>
                  <span className="text-[10px] font-fira text-slate-400"><span className="text-red-400/60 font-bold">SCAM DETECTED:</span> 4.8 SECS AGO (REGION: EU)</span>
                  <span className="text-[10px] font-fira text-slate-400"><span className="text-emerald-400 font-bold">NODE OPS:</span> 4,129 ACTIVE INTERROGATORS</span>
                  <span className="text-[10px] font-fira text-slate-400"><span className="text-blue-400/60 font-bold">THROUGHPUT:</span> 1.4 GB/S FORENSIC STREAM</span>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Services/Intelligence/ClientPortal/Confirmation Sidebar */}
      {currentView !== 'home' && (
        <>
          <aside 
            className={`fixed left-0 top-0 h-full z-30 border-r border-white/5 bg-slate-950/40 backdrop-blur-3xl hidden md:flex flex-col pt-32 transition-all duration-500 ease-in-out ${
              isSidebarCollapsed ? 'w-0 -translate-x-full opacity-0' : 'w-72 translate-x-0 opacity-100'
            }`}
          >
            <div className="px-8 mb-10 min-w-[288px]">
              <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                <p className="text-[10px] font-bold text-primary mb-1 uppercase tracking-widest">Operator Identity</p>
                <p className="text-sm font-bold text-white font-manrope">Forensic Analyst 01</p>
                <div className="mt-3 flex items-center gap-2">
                  <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className="w-2/3 h-full bg-primary shadow-[0_0_8px_rgba(0,98,255,0.5)]"></div>
                  </div>
                  <span className="text-[9px] font-fira text-slate-500">LVL 04</span>
                </div>
              </div>
            </div>
            <nav className="flex flex-col flex-1 px-4 gap-1 min-w-[288px]">
              <button 
                onClick={() => handleNavClick('home')}
                className={`px-4 py-3 flex items-center gap-4 rounded-lg transition-all duration-200 font-manrope text-xs font-bold uppercase tracking-widest text-left cursor-pointer ${
                  currentView === 'home' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-400 hover:bg-primary/10 hover:text-primary'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" /> Home
              </button>
              <button 
                onClick={() => handleNavClick('services')}
                className={`px-4 py-3 flex items-center gap-4 rounded-lg transition-all duration-200 font-manrope text-xs font-bold uppercase tracking-widest text-left cursor-pointer ${
                  currentView === 'services' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-400 hover:bg-primary/10 hover:text-primary'
                }`}
              >
                <Layers className="w-4 h-4" /> Services
              </button>
              <button className="text-slate-400 px-4 py-3 flex items-center gap-4 hover:bg-primary/10 hover:text-primary rounded-lg transition-all duration-200 font-manrope text-xs font-bold uppercase tracking-widest text-left font-bold cursor-pointer">
                <Activity className="w-4 h-4" /> Operations
              </button>
              <button 
                onClick={() => handleNavClick('intelligence')}
                className={`px-4 py-3 flex items-center gap-4 rounded-lg transition-all duration-200 font-manrope text-xs font-bold uppercase tracking-widest text-left cursor-pointer ${
                  currentView === 'intelligence' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-400 hover:bg-primary/10 hover:text-primary'
                }`}
              >
                <Users className="w-4 h-4" /> Intelligence
              </button>
              <button 
                onClick={() => handleNavClick('clientPortal')}
                className={`px-4 py-3 flex items-center gap-4 rounded-lg transition-all duration-200 font-manrope text-xs font-bold uppercase tracking-widest text-left cursor-pointer ${
                  (currentView === 'clientPortal' || currentView === 'recoveryConfirmation' || currentView === 'clientDashboard') ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-400 hover:bg-primary/10 hover:text-primary'
                }`}
              >
                <ShieldCheck className="w-4 h-4" /> Client Portal
              </button>
              <button 
                onClick={() => handleNavClick('caseLookup')}
                className={`px-4 py-3 flex items-center gap-4 rounded-lg transition-all duration-200 font-manrope text-xs font-bold uppercase tracking-widest text-left cursor-pointer ${
                  currentView === 'caseLookup' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-400 hover:bg-primary/10 hover:text-primary'
                }`}
              >
                <FileText className="w-4 h-4" /> Check Status
              </button>
            </nav>
            {/* Collapse Trigger (internal when open) */}
            <button 
              onClick={toggleSidebar}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-8 h-12 bg-slate-900 border border-white/10 rounded-r-lg flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer group"
            >
              <ChevronLeft className="w-4 h-4 group-hover:scale-110 transition-transform" />
            </button>
          </aside>

          {/* Persistent Toggle Tab (visible when collapsed) */}
          {isSidebarCollapsed && (
            <button 
              onClick={toggleSidebar}
              className="fixed left-0 top-1/2 -translate-y-1/2 z-40 w-8 h-32 bg-blue-600/20 hover:bg-blue-600/30 border border-l-0 border-blue-500/30 rounded-r-xl flex flex-col items-center justify-center text-blue-400 hover:text-white transition-all cursor-pointer group backdrop-blur-md"
            >
              <div className="flex flex-col items-center gap-4">
                <span className="text-[9px] font-bold uppercase tracking-[0.2em] [writing-mode:vertical-lr] rotate-180">EXPLORE</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          )}
        </>
      )}

      <div className={`transition-all duration-500 ease-in-out ${
        currentView !== 'home' && !isSidebarCollapsed ? 'md:ml-72 md:pl-8' : ''
      }`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {currentView === 'home' && <HomeView onNavigate={(view) => handleNavClick(view)} />}
            {currentView === 'services' && <ServicesView onServiceClick={() => handleNavClick('clientPortal')} />}
            {currentView === 'intelligence' && <IntelligenceView />}
            {currentView === 'about' && <AboutView onContactClick={() => handleNavClick('clientPortal')} onNavigate={handleNavClick} />}
            {currentView === 'blog' && <BlogView />}
            {currentView === 'clientPortal' && <ClientPortalView onInitiateRecovery={() => handleNavClick('recoveryConfirmation')} onNavigate={handleNavClick} />}
            {currentView === 'recoveryConfirmation' && <RecoveryConfirmationView onBackToDashboard={() => handleNavClick('clientDashboard')} />}
            {currentView === 'caseLookup' && (
              <CaseLookupView onCaseFound={(data) => {
                setSelectedCase(data);
                handleNavClick('clientDashboard');
              }} />
            )}
            {currentView === 'clientDashboard' && <ClientDashboardView caseData={selectedCase} />}
            {currentView === 'chainTraceability' && <ChainTraceabilityView />}
            {currentView === 'exchangeRecovery' && <ExchangeRecoveryView />}
            {currentView === 'legalEnforcement' && <LegalEnforcementView />}
            {currentView === 'riskMonitoring' && <RiskMonitoringView />}
            {currentView === 'tools' && <ToolsView />}
            {currentView === 'iso27001' && <ISO27001View />}
            {currentView === 'soc2' && <SOC2View />}
            {currentView === 'gdpr' && <GDPRView />}
            {currentView === 'amlkyc' && <AMLKYCView />}
            {currentView === 'admin' && <CaseManagerView />}
            {currentView === 'privacyPolicy' && <PrivacyPolicyView />}
            {currentView === 'termsOfService' && <TermsOfServiceView />}
            {currentView === 'reviews' && <ReviewsView onNavigate={(view) => handleNavClick(view as any)} />}
            {currentView === 'submitReview' && <SubmitReviewView onBack={() => handleNavClick('reviews')} />}
            {currentView === 'faq' && <FAQView />}
          </motion.div>
        </AnimatePresence>

        {/* Footer */}
        <footer className="bg-slate-950/90 border-t border-white/10 pt-24 pb-12 px-6 relative z-50">
        <div className="max-w-[1600px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-stack-lg mb-12 sm:mb-20 relative z-10">
          <div className="space-y-8">
            <div className="flex items-center gap-4 cursor-pointer group" onClick={() => handleNavClick('home')}>
              <div className="relative w-14 h-14 flex items-center justify-center">
                <img 
                  src="/logo.png?v=3" 
                  alt="Crypto Recovery Assets Agency Logo" 
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 object-contain relative z-10" 
                />
              </div>
              <div className="flex flex-col">
                <h2 className="text-lg font-black tracking-tighter text-white uppercase font-manrope leading-none">Crypto Recovery <span className="text-blue-500">Assets</span></h2>
                <span className="text-[7px] font-mono text-blue-400/80 tracking-[0.2em] uppercase mt-0.5 font-bold">Professional Forensic Analysis & Crypto Recovery Services</span>
              </div>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed max-w-xs">
              Global leader in cryptocurrency investigation and recovery. Licensed and regulated to provide forensic services worldwide.
            </p>
            <div className="flex gap-4">
              <button 
                onClick={() => handleNavClick('clientPortal')}
                className="w-10 h-10 rounded-sm glass-panel flex items-center justify-center hover:bg-blue-600 transition-colors group cursor-pointer border-none"
                title="Open Case Portal"
              >
                <FileText className="text-slate-300 w-5 h-5 group-hover:text-white" />
              </button>
              <a 
                href="mailto:info@cryptorecoveryasset.com" 
                className="w-10 h-10 rounded-sm glass-panel flex items-center justify-center hover:bg-blue-600 transition-colors group cursor-pointer"
                title="Email Support"
              >
                <Mail className="text-slate-300 w-5 h-5 group-hover:text-white" />
              </a>
            </div>
          </div>
          
          <div className="space-y-8">
            <h5 className="text-white text-[10px] tracking-[0.2em] uppercase font-bold">Services</h5>
            <ul className="space-y-4 text-slate-400 text-sm font-medium">
              {[
                { label: 'Chain Traceability', view: 'chainTraceability' },
                { label: 'Exchange Recovery', view: 'exchangeRecovery' },
                { label: 'Legal Enforcement', view: 'legalEnforcement' },
                { label: 'Risk Monitoring', view: 'riskMonitoring' },
                { label: 'Forensic Toolkit', view: 'tools' }
              ].map((item, i) => (
                <li key={i}>
                  <button 
                    onClick={() => handleNavClick(item.view as View)}
                    className="hover:text-blue-400 transition-colors flex items-center gap-2 cursor-pointer text-left"
                  >
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" /> {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-8">
            <h5 className="text-white text-[10px] tracking-[0.2em] uppercase font-bold">Compliance</h5>
            <ul className="space-y-4 text-slate-400 text-sm font-medium">
              {[
                { label: 'ISO/IEC 27001', view: 'iso27001' },
                { label: 'SOC2 Type II', view: 'soc2' },
                { label: 'GDPR Protocol', view: 'gdpr' },
                { label: 'AML/KYC Stds', view: 'amlkyc' }
              ].map((item, i) => (
                <li key={i}>
                  <button 
                    onClick={() => handleNavClick(item.view as View)}
                    className="hover:text-blue-400 transition-colors flex items-center gap-2 cursor-pointer text-left"
                  >
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" /> {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-8">
            <h5 className="text-white text-[10px] tracking-[0.2em] uppercase font-bold">Headquarters</h5>
            <div className="text-slate-400 text-sm space-y-6">
              <div className="flex gap-4">
                <MapPin className="text-blue-500 w-5 h-5 flex-shrink-0" />
                <p className="leading-relaxed">One World Trade Center, Suite 850<br/>New York, NY 10007, USA</p>
              </div>
              <div className="flex gap-4">
                <Phone className="text-blue-500 w-5 h-5 flex-shrink-0" />
                <p className="font-fira font-bold text-slate-300">+1 (800) 555-DFNS</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="max-w-[1600px] mx-auto pt-10 border-t border-white/5 flex flex-col items-center justify-between lg:flex-row gap-8 relative z-10">
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-8">
            <button 
              onClick={() => handleNavClick('clientPortal')}
              className="text-slate-400 hover:text-blue-400 text-[11px] font-bold uppercase tracking-[0.2em] transition-colors cursor-pointer outline-none"
            >
              Contact Us
            </button>
            <button 
              onClick={() => handleNavClick('about')}
              className="text-slate-400 hover:text-blue-400 text-[11px] font-bold uppercase tracking-[0.2em] transition-colors cursor-pointer outline-none"
            >
              About Us
            </button>
            <button 
              onClick={() => handleNavClick('blog')}
              className="text-slate-400 hover:text-blue-400 text-[11px] font-bold uppercase tracking-[0.2em] transition-colors cursor-pointer outline-none"
            >
              Blog
            </button>
            <button 
              onClick={() => handleNavClick('faq')}
              className="text-slate-400 hover:text-blue-400 text-[11px] font-bold uppercase tracking-[0.2em] transition-colors cursor-pointer outline-none"
            >
              FAQ
            </button>
            <button 
              onClick={() => navigate('/admin/login')}
              className="text-slate-400 hover:text-blue-400 text-[11px] font-bold uppercase tracking-[0.2em] transition-colors cursor-pointer outline-none"
            >
              Admin Portal
            </button>
            <button 
              onClick={() => handleNavClick('privacyPolicy')}
              className="text-slate-400 hover:text-blue-400 text-[11px] font-bold uppercase tracking-[0.2em] transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <button 
              onClick={() => handleNavClick('termsOfService')}
              className="text-slate-400 hover:text-blue-400 text-[11px] font-bold uppercase tracking-[0.2em] transition-colors cursor-pointer"
            >
              Terms of Service
            </button>
          </div>
          <p className="text-slate-600 text-[10px] uppercase tracking-widest font-bold">
            © 2026 CRYPTO RECOVERY ASSETS // NEW HAMPSHIRE, USA REGISTERED LLC // ALL RIGHTS RESERVED // CLASSIFIED
          </p>
        </div>
      </footer>
    </div>
  </div>
  );
}
