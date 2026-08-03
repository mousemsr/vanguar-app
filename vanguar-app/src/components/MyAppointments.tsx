import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Appointment } from '../types';
import {
  Calendar,
  Clock,
  MapPin,
  XCircle,
  CheckCircle2,
  Share2,
  Copy,
  PlusCircle,
  Search,
  AlertTriangle,
  Scissors,
  Phone,
  FileText,
} from 'lucide-react';

interface MyAppointmentsProps {
  appointments: Appointment[];
  onCancelAppointment: (id: string) => void;
  onNewBookingClick: () => void;
}

export const MyAppointments: React.FC<MyAppointmentsProps> = ({
  appointments,
  onCancelAppointment,
  onNewBookingClick,
}) => {
  const [filter, setFilter] = useState<'todas' | 'confirmada' | 'cancelada'>('todas');
  const [searchTerm, setSearchTerm] = useState('');
  const [cancelTargetId, setCancelTargetId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredAppointments = appointments.filter((app) => {
    const matchesFilter = filter === 'todas' || app.status === filter;
    const matchesSearch =
      app.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.barberNickname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.locationName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleCopyText = (app: Appointment) => {
    const text = `💈 *CITA VANGUAR BARBERÍA*
📌 *Sede:* ${app.locationName}
✂️ *Servicio:* ${app.serviceName}
💈 *Barbero:* ${app.barberNickname}
📅 *Fecha:* ${app.date}
⏰ *Hora:* ${app.time}
👤 *Cliente:* ${app.clientName} (${app.clientPhone})`;

    navigator.clipboard.writeText(text);
    setCopiedId(app.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const getCalendarUrl = (app: Appointment) => {
    const title = encodeURIComponent(`Cita Barbería VANGUAR - ${app.serviceName}`);
    const details = encodeURIComponent(
      `Cita agendada en ${app.locationName} con ${app.barberNickname}. Servicio: ${app.serviceName}`
    );
    const location = encodeURIComponent(app.locationName);
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}`;
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <Calendar className="w-7 h-7 text-violet-400" />
            <span>Mis Citas Guardadas</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Administrá, consultá o cancelá tus citas agendadas en VANGUAR Barbería Medellín.
          </p>
        </div>

        <button
          onClick={onNewBookingClick}
          className="flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 shadow-lg shadow-blue-950/40 transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Agendar Nueva Cita</span>
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          {[
            { id: 'todas', label: 'Todas las Citas' },
            { id: 'confirmada', label: 'Próximas (Confirmadas)' },
            { id: 'cancelada', label: 'Canceladas' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id as any)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                filter === f.id
                  ? 'bg-slate-800 text-violet-300 border border-violet-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por cliente, barbero..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 pl-9 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
          />
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
        </div>
      </div>

      {/* Appointments List */}
      {filteredAppointments.length === 0 ? (
        <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-slate-500">
            <Scissors className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white">No encontramos citas guardadas</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {searchTerm || filter !== 'todas'
              ? 'Intentá cambiar los filtros o la búsqueda para encontrar tus citas.'
              : 'Aún no has agendado ninguna cita. ¡Agendate hoy y quedá melo con VANGUAR!'}
          </p>
          <button
            onClick={onNewBookingClick}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-violet-600 shadow-md"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Separar Mi Cita Ahora</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AnimatePresence>
            {filteredAppointments.map((app) => (
              <motion.div
                key={app.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`p-5 rounded-2xl border backdrop-blur-xl relative flex flex-col justify-between space-y-4 shadow-xl ${
                  app.status === 'confirmada'
                    ? 'bg-slate-900/90 border-slate-800 hover:border-violet-500/50'
                    : 'bg-slate-950/80 border-slate-900 opacity-60'
                }`}
              >
                {/* Header Badge */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-500 font-semibold">
                    #{app.id}
                  </span>

                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1 ${
                      app.status === 'confirmada'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                        : app.status === 'completada'
                        ? 'bg-blue-950 text-blue-300 border border-blue-500/40'
                        : 'bg-rose-950 text-rose-300 border border-rose-500/40'
                    }`}
                  >
                    {app.status === 'confirmada' && <CheckCircle2 className="w-3 h-3" />}
                    {app.status === 'cancelada' && <XCircle className="w-3 h-3" />}
                    {app.status}
                  </span>
                </div>

                {/* Barber & Service Info */}
                <div className="flex items-start gap-3">
                  <img
                    src={app.barberAvatar}
                    alt={app.barberNickname}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-700 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <h3 className="font-extrabold text-white text-base truncate">
                      {app.serviceName}
                    </h3>
                    <p className="text-xs text-violet-400 font-semibold">
                      Con {app.barberNickname}
                    </p>
                    <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3 text-slate-500" />
                      <span>{app.locationName}</span>
                    </p>
                  </div>
                </div>

                {/* Date Time & Client Details */}
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 block">FECHA & HORA</span>
                    <span className="font-bold text-violet-300 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-violet-400" />
                      {app.date} @ {app.time}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">CLIENTE</span>
                    <span className="font-bold text-slate-200 truncate block">
                      {app.clientName}
                    </span>
                  </div>

                  {app.clientNotes && (
                    <div className="col-span-2 pt-1 border-t border-slate-900 text-[11px] text-slate-400 italic">
                      "{app.clientNotes}"
                    </div>
                  )}
                </div>

                {/* Footer Controls */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                  <div className="text-sm font-black text-emerald-400">
                    ${app.servicePriceCOP.toLocaleString('es-CO')} COP
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopyText(app)}
                      className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                      title="Copiar detalles de la cita"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>

                    {app.status === 'confirmada' && (
                      <a
                        href={getCalendarUrl(app)}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                        title="Añadir a Google Calendar"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                      </a>
                    )}

                    {app.status === 'confirmada' && (
                      <button
                        onClick={() => setCancelTargetId(app.id)}
                        className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-rose-400 bg-rose-950/40 hover:bg-rose-950 border border-rose-800/50 transition-colors"
                      >
                        Cancelar
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {cancelTargetId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-rose-400">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-lg font-bold text-white">¿Cancelar Cita?</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              ¿Estás seguro de que deseas cancelar esta reserva? El cupo quedará libre para otro cliente en VANGUAR.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setCancelTargetId(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700"
              >
                No, Mantener Cita
              </button>
              <button
                onClick={() => {
                  onCancelAppointment(cancelTargetId);
                  setCancelTargetId(null);
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500"
              >
                Sí, Cancelar Cita
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
