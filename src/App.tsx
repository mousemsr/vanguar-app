import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { BookingWizard } from './components/BookingWizard';
import { MyAppointments } from './components/MyAppointments';
import { ServicesCatalog } from './components/ServicesCatalog';
import { BarbersList } from './components/BarbersList';
import { LocationsInfo } from './components/LocationsInfo';
import { GeminiPaisaChat } from './components/GeminiPaisaChat';
import { NotificationToast, ToastMessage } from './components/NotificationToast';
import { VanguarLogo } from './components/VanguarLogo';
import { LocationId, Appointment, BarberService, Barber } from './types';
import { INITIAL_APPOINTMENTS, LOCATIONS } from './data/barberiaData';
import {
  Scissors,
  Calendar,
  Sparkles,
  Bot,
  MapPin,
  Clock,
  ChevronRight,
  ShieldCheck,
  Star,
  Flame,
  Award,
} from 'lucide-react';

const STORAGE_KEY_APPOINTMENTS = 'vanguar_barberia_appointments';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('agendar');
  const [selectedLocation, setSelectedLocation] = useState<LocationId>('poblado');

  // Appointments State with Local Storage Persistence
  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_APPOINTMENTS);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error loading appointments from localStorage:', e);
    }
    return INITIAL_APPOINTMENTS;
  });

  // Save appointments to Local Storage on update
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_APPOINTMENTS, JSON.stringify(appointments));
    } catch (e) {
      console.error('Error saving appointments to localStorage:', e);
    }
  }, [appointments]);

  // Floating Chat Drawer State
  const [chatOpen, setChatOpen] = useState<boolean>(false);

  // Toast Notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'error' | 'info', title: string, description?: string) => {
    const id = `toast-${Date.now()}`;
    setToasts((prev) => [...prev, { id, type, title, description }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Create new appointment callback
  const handleAppointmentCreated = (newApp: Appointment) => {
    setAppointments((prev) => [newApp, ...prev]);
    addToast(
      'success',
      '¡Cita Agendada con Éxito!',
      `Te esperamos en ${newApp.locationName} el ${newApp.date} a las ${newApp.time}.`
    );
  };

  // Cancel appointment callback
  const handleCancelAppointment = (id: string) => {
    setAppointments((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status: 'cancelada' } : app))
    );
    addToast('info', 'Cita Cancelada', 'La reserva ha sido cancelada correctamente.');
  };

  // Active appointments counter
  const activeAppointmentsCount = appointments.filter((a) => a.status === 'confirmada').length;

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col font-sans selection:bg-purple-600 selection:text-white">
      {/* Top Bar Banner */}
      <div className="bg-gradient-to-r from-blue-900/60 via-indigo-950 to-purple-900/60 border-b border-violet-900/40 py-2 px-4 text-center text-xs text-slate-300 flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
        <span>
          <strong className="text-white">¡Sedes El Poblado y Laureles Abiertas!</strong> Parqueadero gratis para clientes VANGUAR.
        </span>
        <button
          onClick={() => setChatOpen(true)}
          className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-violet-300 hover:text-white underline ml-2"
        >
          <Bot className="w-3.5 h-3.5" /> Consultar con El Parcero AI
        </button>
      </div>

      {/* Main Header Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedLocation={selectedLocation}
        setSelectedLocation={setSelectedLocation}
        activeAppointmentsCount={activeAppointmentsCount}
        onOpenChat={() => setChatOpen(true)}
        onStartBooking={() => setActiveTab('agendar')}
      />

      {/* Main Content View Switcher */}
      <main className="flex-1">
        {activeTab === 'agendar' && (
          <div>
            {/* Optional Banner visual for Hero landing context */}
            <div className="relative border-b border-slate-800/80 bg-gradient-to-b from-slate-900/90 via-slate-950 to-[#070b14] py-8 sm:py-12 overflow-hidden">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-tr from-blue-600/15 via-purple-600/20 to-pink-600/10 rounded-full blur-3xl pointer-events-none" />

              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                  <div className="max-w-2xl space-y-4 text-center lg:text-left">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold text-violet-300 bg-violet-950/80 border border-violet-800/50 shadow-inner">
                      <Flame className="w-3.5 h-3.5 text-amber-400" />
                      <span>La Barbería con Más Estilo de Medellín</span>
                    </div>

                    <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                      Cortes con Actitud, <br className="hidden sm:block" />
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400">
                        Atención de Patrón
                      </span>
                    </h2>

                    <p className="text-sm text-slate-300 leading-relaxed max-w-xl mx-auto lg:mx-0">
                      Bienvenido a VANGUAR. Reservá tu cita en línea sin filas ni demoras. Experimentá cortes degradados perfectos, perfilado tradicional a navaja y el mejor ambiente paisa.
                    </p>

                    <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                      <button
                        onClick={() => setChatOpen(true)}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-purple-200 bg-slate-900 border border-purple-500/40 hover:border-purple-400 transition-all shadow-md"
                      >
                        <Bot className="w-4 h-4 text-purple-400" />
                        <span>Preguntarle al Asistente AI</span>
                      </button>

                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        <span>Confirmación Inmediata</span>
                      </div>
                    </div>
                  </div>

                  {/* Rating / Highlights Widget */}
                  <div className="grid grid-cols-2 gap-3 w-full lg:w-auto shrink-0">
                    <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-center space-y-1 shadow-lg">
                      <div className="text-2xl font-black text-amber-400 flex items-center justify-center gap-1">
                        <span>4.96</span>
                        <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                      </div>
                      <p className="text-[11px] font-bold text-slate-300">Más de 1,000 Clientes</p>
                      <p className="text-[10px] text-slate-500">Valoración en Medellín</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-center space-y-1 shadow-lg">
                      <div className="text-2xl font-black text-blue-400 flex items-center justify-center gap-1">
                        <span>2 Sedes</span>
                        <MapPin className="w-5 h-5 text-blue-400" />
                      </div>
                      <p className="text-[11px] font-bold text-slate-300">El Poblado & Laureles</p>
                      <p className="text-[10px] text-slate-500">Fácil Parqueadero</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Booking Wizard */}
            <BookingWizard
              selectedLocation={selectedLocation}
              setSelectedLocation={setSelectedLocation}
              onAppointmentCreated={handleAppointmentCreated}
              onViewAppointments={() => setActiveTab('citas')}
            />
          </div>
        )}

        {activeTab === 'citas' && (
          <MyAppointments
            appointments={appointments}
            onCancelAppointment={handleCancelAppointment}
            onNewBookingClick={() => setActiveTab('agendar')}
          />
        )}

        {activeTab === 'servicios' && (
          <ServicesCatalog
            onSelectServiceToBook={(service: BarberService) => {
              setActiveTab('agendar');
            }}
          />
        )}

        {activeTab === 'barberos' && (
          <BarbersList
            onSelectBarberToBook={(barber: Barber) => {
              setActiveTab('agendar');
            }}
          />
        )}

        {activeTab === 'ubicaciones' && <LocationsInfo />}

        {activeTab === 'chat' && (
          <div className="max-w-4xl mx-auto px-4 py-6">
            <GeminiPaisaChat
              isOpen={true}
              isFloatingDrawer={false}
              onNavigateBooking={() => setActiveTab('agendar')}
            />
          </div>
        )}
      </main>

      {/* Floating Chat Drawer Overlay */}
      <GeminiPaisaChat
        isOpen={chatOpen}
        onClose={() => setChatOpen(false)}
        isFloatingDrawer={true}
        onNavigateBooking={() => setActiveTab('agendar')}
      />

      {/* Toast Notification Container */}
      <NotificationToast toasts={toasts} onDismiss={handleDismissToast} />

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 mt-16 py-12 px-4 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <VanguarLogo size="sm" />
            <p className="text-slate-400 leading-relaxed">
              VANGUAR Barbería. Estilo urbano de vanguardia, ambiente exclusivo y la calidez característica de Medellín, Colombia.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white uppercase tracking-wider mb-3">Nuestras Sedes</h4>
            <ul className="space-y-2">
              {LOCATIONS.map((loc) => (
                <li key={loc.id} className="text-slate-400">
                  <strong className="text-slate-200">{loc.name}:</strong> {loc.address} ({loc.neighborhood})
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white uppercase tracking-wider mb-3">Horarios</h4>
            <p className="text-slate-400 leading-relaxed">
              Lunes a Sábado: 9:00 AM - 8:00 PM<br />
              Domingos: 10:00 AM - 4:00 PM (Sede El Poblado)
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white uppercase tracking-wider mb-3">Servicio AI Gemini</h4>
            <p className="text-slate-400 leading-relaxed mb-3">
              ¿Tenés dudas sobre cuál corte le va mejor a la forma de tu rostro?
            </p>
            <button
              onClick={() => setChatOpen(true)}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold text-purple-300 bg-purple-950/60 border border-purple-800/60 hover:bg-purple-900/60 transition-colors"
            >
              <Bot className="w-4 h-4 text-purple-400" />
              <span>Chatear con El Parcero AI</span>
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <p>© 2026 VANGUAR Barbería Medellín. Todos los derechos reservados.</p>
          <p className="flex items-center gap-1">
            <span>Hecho con actitud paisa en Medellín, Colombia 🇨🇴</span>
          </p>
        </div>
      </footer>
    </div>
  );
}
