import React, { useState } from 'react';
import { VanguarLogo } from './VanguarLogo';
import { LocationId } from '../types';
import { LOCATIONS } from '../data/barberiaData';
import {
  Calendar,
  Scissors,
  Users,
  MapPin,
  Bot,
  PlusCircle,
  Menu,
  X,
  ChevronDown,
  Sparkles,
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedLocation: LocationId;
  setSelectedLocation: (loc: LocationId) => void;
  activeAppointmentsCount: number;
  onOpenChat: () => void;
  onStartBooking: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  selectedLocation,
  setSelectedLocation,
  activeAppointmentsCount,
  onOpenChat,
  onStartBooking,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);

  const currentLocation = LOCATIONS.find((l) => l.id === selectedLocation) || LOCATIONS[0];

  const navItems = [
    { id: 'agendar', label: 'Agendar Cita', icon: PlusCircle, isPrimary: true },
    { id: 'citas', label: 'Mis Citas', icon: Calendar, badge: activeAppointmentsCount },
    { id: 'servicios', label: 'Servicios', icon: Scissors },
    { id: 'barberos', label: 'Barberos', icon: Users },
    { id: 'ubicaciones', label: 'Sedes', icon: MapPin },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo Brand */}
          <button
            onClick={() => setActiveTab('agendar')}
            className="flex items-center gap-3 text-left group focus:outline-none"
          >
            <VanguarLogo size="md" />
          </button>

          {/* Location Selector (Desktop) */}
          <div className="hidden lg:flex items-center relative">
            <button
              onClick={() => setLocationDropdownOpen(!locationDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium text-slate-300 bg-slate-900/90 border border-slate-800 hover:border-violet-500/50 hover:text-white transition-all shadow-inner"
            >
              <MapPin className="w-3.5 h-3.5 text-violet-400" />
              <span>{currentLocation.name}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {locationDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-60 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl py-1 z-50 overflow-hidden backdrop-blur-2xl">
                <div className="px-3 py-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                  Seleccionar Sede Medellín
                </div>
                {LOCATIONS.map((loc) => (
                  <button
                    key={loc.id}
                    onClick={() => {
                      setSelectedLocation(loc.id);
                      setLocationDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2.5 text-xs flex flex-col gap-0.5 transition-colors ${
                      selectedLocation === loc.id
                        ? 'bg-gradient-to-r from-blue-900/50 to-violet-900/50 text-white font-semibold'
                        : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                    }`}
                  >
                    <span className="flex items-center justify-between">
                      {loc.name}
                      {selectedLocation === loc.id && (
                        <span className="w-2 h-2 rounded-full bg-violet-400" />
                      )}
                    </span>
                    <span className="text-[10px] text-slate-400">{loc.address}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              if (item.isPrimary) {
                return (
                  <button
                    key={item.id}
                    onClick={onStartBooking}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 shadow-lg shadow-blue-950/50 hover:shadow-violet-900/50 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                  >
                    <Icon className="w-4 h-4 text-blue-200" />
                    <span>{item.label}</span>
                  </button>
                );
              }

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all relative ${
                    isActive
                      ? 'bg-slate-900 text-violet-300 border border-violet-500/30 shadow-md shadow-violet-950/20'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-violet-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}

            {/* Gemini Bot AI Button */}
            <button
              onClick={onOpenChat}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-purple-200 bg-slate-900/90 border border-purple-500/40 hover:border-purple-400 hover:bg-purple-950/40 transition-all shadow-md group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/20 to-pink-600/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <Bot className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
              <span>El Parcero AI</span>
              <Sparkles className="w-3 h-3 text-amber-300 animate-spin-slow" />
            </button>
          </nav>

          {/* Mobile Right Controls */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={onOpenChat}
              className="p-2 rounded-xl bg-purple-950/60 border border-purple-500/40 text-purple-300"
              title="El Parcero AI"
            >
              <Bot className="w-5 h-5" />
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-slate-900 text-slate-300 border border-slate-800"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-950/95 backdrop-blur-2xl px-4 pt-3 pb-6 space-y-3">
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-slate-300 font-medium">
              <MapPin className="w-4 h-4 text-violet-400" />
              <span>{currentLocation.name}</span>
            </div>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value as LocationId)}
              className="bg-slate-800 text-xs text-white rounded-lg px-2 py-1 border border-slate-700"
            >
              {LOCATIONS.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              if (item.isPrimary) {
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onStartBooking();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600"
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              }

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-semibold ${
                    isActive ? 'bg-slate-900 text-violet-300 border border-violet-500/40' : 'text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-violet-400" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="px-2 py-0.5 text-[10px] font-bold text-slate-950 bg-cyan-400 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
