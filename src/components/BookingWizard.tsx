import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LocationId, BarberService, Barber, Appointment } from '../types';
import { LOCATIONS, SERVICES, BARBERS, PAISA_PHRASES } from '../data/barberiaData';
import {
  MapPin,
  Scissors,
  Crown,
  Sparkles,
  UserCheck,
  Flame,
  Zap,
  Smile,
  Clock,
  CheckCircle2,
  Calendar as CalendarIcon,
  User,
  Phone,
  FileText,
  ChevronRight,
  ChevronLeft,
  Share2,
  Copy,
  PlusCircle,
  Star,
  Check,
} from 'lucide-react';

interface BookingWizardProps {
  selectedLocation: LocationId;
  setSelectedLocation: (loc: LocationId) => void;
  onAppointmentCreated: (appointment: Appointment) => void;
  onViewAppointments: () => void;
}

export const BookingWizard: React.FC<BookingWizardProps> = ({
  selectedLocation,
  setSelectedLocation,
  onAppointmentCreated,
  onViewAppointments,
}) => {
  const [step, setStep] = useState<number>(1);

  // Form State
  const [selectedService, setSelectedService] = useState<BarberService | null>(
    SERVICES[0]
  );
  const [selectedBarber, setSelectedBarber] = useState<Barber | null>(BARBERS[0]);
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [selectedTime, setSelectedTime] = useState<string>('10:00 AM');
  const [clientName, setClientName] = useState<string>('');
  const [clientPhone, setClientPhone] = useState<string>('');
  const [clientNotes, setClientNotes] = useState<string>('');

  // Category filter
  const [activeCategory, setActiveCategory] = useState<string>('todos');

  // Confirmed appointment state
  const [createdAppointment, setCreatedAppointment] = useState<Appointment | null>(null);
  const [copiedNotification, setCopiedNotification] = useState<boolean>(false);

  // Filter barbers by location
  const availableBarbers = BARBERS.filter((b) =>
    b.locations.includes(selectedLocation)
  );

  // Helper dates (next 7 days)
  const getNextDays = () => {
    const days = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(today.getDate() + i);
      const iso = d.toISOString().split('T')[0];
      const dayName =
        i === 0
          ? 'Hoy'
          : i === 1
          ? 'Mañana'
          : d.toLocaleDateString('es-CO', { weekday: 'short' });
      const dayNum = d.getDate();
      const monthName = d.toLocaleDateString('es-CO', { month: 'short' });
      days.push({ iso, dayName, dayNum, monthName });
    }
    return days;
  };

  const datesList = getNextDays();

  // Service icon mapper
  const renderServiceIcon = (iconName: string) => {
    switch (iconName) {
      case 'Scissors':
        return <Scissors className="w-5 h-5 text-blue-400" />;
      case 'Crown':
        return <Crown className="w-5 h-5 text-amber-400" />;
      case 'Sparkles':
        return <Sparkles className="w-5 h-5 text-purple-400" />;
      case 'UserCheck':
        return <UserCheck className="w-5 h-5 text-teal-400" />;
      case 'Flame':
        return <Flame className="w-5 h-5 text-rose-400" />;
      case 'Zap':
        return <Zap className="w-5 h-5 text-cyan-400" />;
      case 'Smile':
        return <Smile className="w-5 h-5 text-emerald-400" />;
      default:
        return <Scissors className="w-5 h-5 text-blue-400" />;
    }
  };

  const filteredServices = SERVICES.filter((s) => {
    if (activeCategory === 'todos') return true;
    return s.category === activeCategory;
  });

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService || !selectedBarber || !clientName || !clientPhone) {
      return;
    }

    const locationObj = LOCATIONS.find((l) => l.id === selectedLocation)!;

    const newAppointment: Appointment = {
      id: `cita-${Date.now().toString().slice(-5)}`,
      clientName: clientName.trim(),
      clientPhone: clientPhone.trim(),
      clientNotes: clientNotes.trim(),
      locationId: selectedLocation,
      locationName: locationObj.name,
      serviceId: selectedService.id,
      serviceName: selectedService.name,
      servicePriceCOP: selectedService.priceCOP,
      serviceDurationMin: selectedService.durationMin,
      barberId: selectedBarber.id,
      barberName: selectedBarber.name,
      barberNickname: selectedBarber.nickname,
      barberAvatar: selectedBarber.avatar,
      date: selectedDate,
      time: selectedTime,
      status: 'confirmada',
      createdAt: new Date().toISOString(),
    };

    onAppointmentCreated(newAppointment);
    setCreatedAppointment(newAppointment);
    setStep(5); // Confirmation Screen
  };

  const handleCopyReminder = () => {
    if (!createdAppointment) return;
    const text = `💈 *CITA VANGUAR BARBERÍA MEDELLÍN*
📌 *Sede:* ${createdAppointment.locationName}
✂️ *Servicio:* ${createdAppointment.serviceName}
💈 *Barbero:* ${createdAppointment.barberNickname}
📅 *Fecha:* ${createdAppointment.date}
⏰ *Hora:* ${createdAppointment.time}
👤 *Cliente:* ${createdAppointment.clientName}

¡Te esperamos parce! En VANGUAR quedas melo.`;

    navigator.clipboard.writeText(text);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Random Paisa Quote Header */}
      <div className="text-center mb-8">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-violet-300 bg-violet-950/60 border border-violet-800/50 shadow-inner mb-3">
          <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
          {PAISA_PHRASES[Math.floor(Math.random() * PAISA_PHRASES.length)]}
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Separar Tu Cita en <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400">VANGUAR</span>
        </h1>
        <p className="text-sm text-slate-400 mt-2 max-w-xl mx-auto">
          Agéndate en 4 sencillos pasos y asegura tu espacio con los mejores barberos de Medellín.
        </p>
      </div>

      {/* Stepper Progress Bar */}
      {step < 5 && (
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-2xl mx-auto mb-2 px-2">
            {[
              { num: 1, label: 'Servicio' },
              { num: 2, label: 'Barbero' },
              { num: 3, label: 'Fecha & Hora' },
              { num: 4, label: 'Tus Datos' },
            ].map((s) => (
              <div key={s.num} className="flex flex-col items-center gap-1">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-md ${
                    step === s.num
                      ? 'bg-gradient-to-r from-blue-600 to-violet-600 text-white ring-4 ring-violet-900/40 shadow-blue-900/50 scale-110'
                      : step > s.num
                      ? 'bg-emerald-500 text-slate-950 font-extrabold'
                      : 'bg-slate-900 text-slate-500 border border-slate-800'
                  }`}
                >
                  {step > s.num ? <Check className="w-4 h-4 stroke-[3]" /> : s.num}
                </div>
                <span
                  className={`text-[11px] font-medium hidden sm:inline ${
                    step === s.num ? 'text-violet-300 font-semibold' : 'text-slate-500'
                  }`}
                >
                  {s.label}
                </span>
              </div>
            ))}
          </div>

          <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden max-w-2xl mx-auto border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 transition-all duration-300"
              style={{ width: `${((step - 1) / 3) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* STEP 1: Servicio y Sede */}
      {step === 1 && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          {/* Location Picker Banner */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-violet-950/80 border border-violet-800/60 text-violet-400">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-violet-400">Sede Seleccionada</h3>
                <p className="text-base font-bold text-white">
                  {LOCATIONS.find((l) => l.id === selectedLocation)?.name}
                </p>
                <p className="text-xs text-slate-400">
                  {LOCATIONS.find((l) => l.id === selectedLocation)?.address} - {LOCATIONS.find((l) => l.id === selectedLocation)?.neighborhood}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800 self-stretch sm:self-auto">
              {LOCATIONS.map((loc) => (
                <button
                  key={loc.id}
                  onClick={() => setSelectedLocation(loc.id)}
                  className={`flex-1 sm:flex-initial px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
                    selectedLocation === loc.id
                      ? 'bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {loc.id === 'poblado' ? 'El Poblado' : 'Laureles'}
                </button>
              ))}
            </div>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {[
              { id: 'todos', label: 'Todos los Servicios' },
              { id: 'corte', label: 'Cortes' },
              { id: 'combo', label: 'Combos Rey' },
              { id: 'barba', label: 'Barba' },
              { id: 'especial', label: 'Especiales & Tintura' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  activeCategory === cat.id
                    ? 'bg-gradient-to-r from-blue-900/80 to-purple-900/80 text-white border border-violet-500/50 shadow-md shadow-violet-950/40'
                    : 'bg-slate-900/80 text-slate-400 border border-slate-800 hover:text-white hover:bg-slate-800'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Service Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredServices.map((service) => {
              const isSelected = selectedService?.id === service.id;
              return (
                <div
                  key={service.id}
                  onClick={() => setSelectedService(service)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                    isSelected
                      ? 'bg-slate-900/95 border-violet-500 ring-2 ring-violet-500/40 shadow-xl shadow-violet-950/50'
                      : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/90'
                  }`}
                >
                  {service.popular && (
                    <div className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider text-amber-300 bg-amber-950/80 border border-amber-500/40">
                      Popular
                    </div>
                  )}

                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                        {renderServiceIcon(service.iconName)}
                      </div>
                      <h3 className="font-bold text-slate-100 text-base">{service.name}</h3>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed mb-4">
                      {service.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 mt-2">
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <Clock className="w-3.5 h-3.5 text-violet-400" />
                      <span>{service.durationMin} min</span>
                    </div>

                    <div className="text-right">
                      <span className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300">
                        ${service.priceCOP.toLocaleString('es-CO')} COP
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Next Action */}
          <div className="flex justify-end pt-4">
            <button
              disabled={!selectedService}
              onClick={() => setStep(2)}
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 shadow-lg shadow-blue-950/50 transition-all disabled:opacity-50"
            >
              <span>Continuar a Elegir Barbero</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}

      {/* STEP 2: Elegir Barbero */}
      {step === 2 && (
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider">Servicio Elegido</p>
              <h3 className="text-base font-bold text-white">{selectedService?.name}</h3>
            </div>
            <span className="text-sm font-black text-violet-300">
              ${selectedService?.priceCOP.toLocaleString('es-CO')} COP
            </span>
          </div>

          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <span>Seleccioná Tu Barbero de Confianza</span>
            <span className="text-xs font-normal text-slate-400">({availableBarbers.length} disponibles)</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availableBarbers.map((barber) => {
              const isSelected = selectedBarber?.id === barber.id;
              return (
                <div
                  key={barber.id}
                  onClick={() => setSelectedBarber(barber)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer relative flex items-start gap-4 ${
                    isSelected
                      ? 'bg-slate-900/95 border-violet-500 ring-2 ring-violet-500/40 shadow-xl shadow-violet-950/50'
                      : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/90'
                  }`}
                >
                  <div className="relative shrink-0">
                    <img
                      src={barber.avatar}
                      alt={barber.name}
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-700"
                    />
                    <div className="absolute -bottom-1 -right-1 bg-amber-500 text-slate-950 text-[10px] font-black px-1.5 py-0.5 rounded-md flex items-center gap-0.5 shadow-md">
                      <Star className="w-3 h-3 fill-slate-950" />
                      {barber.rating}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-extrabold text-white text-base leading-snug">
                      {barber.nickname}
                    </h3>
                    <p className="text-xs text-violet-400 font-medium mb-1">{barber.role}</p>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {barber.bio}
                    </p>
                    <div className="mt-2 text-[11px] font-semibold text-slate-300 bg-slate-950/80 px-2.5 py-1 rounded-lg border border-slate-800/80 inline-block">
                      Especialidad: {barber.specialty}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-4">
            <button
              onClick={() => setStep(1)}
              className="flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Atrás</span>
            </button>

            <button
              disabled={!selectedBarber}
              onClick={() => setStep(3)}
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 shadow-lg transition-all"
            >
              <span>Continuar a Fecha y Hora</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}

      {/* STEP 3: Fecha y Hora */}
      {step === 3 && (
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          {/* Summary Banner */}
          <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <img
                src={selectedBarber?.avatar}
                alt={selectedBarber?.name}
                className="w-10 h-10 rounded-xl object-cover border border-slate-700"
              />
              <div>
                <p className="text-xs text-slate-400">Atendido por</p>
                <h4 className="text-sm font-bold text-white">{selectedBarber?.nickname}</h4>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-400">Servicio</p>
              <p className="text-sm font-bold text-violet-300">{selectedService?.name}</p>
            </div>
          </div>

          {/* Date Selector Pills */}
          <div>
            <label className="block text-sm font-bold text-slate-200 mb-3 flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-violet-400" />
              <span>Elegí el Día</span>
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
              {datesList.map((d) => {
                const isSelected = selectedDate === d.iso;
                return (
                  <button
                    key={d.iso}
                    onClick={() => setSelectedDate(d.iso)}
                    className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-0.5 ${
                      isSelected
                        ? 'bg-gradient-to-b from-blue-600 to-violet-600 border-violet-400 text-white shadow-lg ring-2 ring-violet-500/50'
                        : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800'
                    }`}
                  >
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 group-hover:text-white">
                      {d.dayName}
                    </span>
                    <span className="text-lg font-black">{d.dayNum}</span>
                    <span className="text-[10px] text-slate-400 uppercase">{d.monthName}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time Slot Picker */}
          <div>
            <label className="block text-sm font-bold text-slate-200 mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-violet-400" />
              <span>Horarios Disponibles para {selectedBarber?.nickname}</span>
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {selectedBarber?.availability.map((time) => {
                const isSelected = selectedTime === time;
                return (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={`px-4 py-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                      isSelected
                        ? 'bg-gradient-to-r from-blue-600 to-violet-600 border-violet-400 text-white shadow-md ring-2 ring-violet-500/40'
                        : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5 text-violet-400" />
                    <span>{time}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between pt-4">
            <button
              onClick={() => setStep(2)}
              className="flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Atrás</span>
            </button>

            <button
              disabled={!selectedTime || !selectedDate}
              onClick={() => setStep(4)}
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 shadow-lg transition-all"
            >
              <span>Ingresar Tus Datos</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}

      {/* STEP 4: Datos del Cliente */}
      {step === 4 && (
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6 max-w-2xl mx-auto"
        >
          <form onSubmit={handleConfirmBooking} className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-5 shadow-2xl">
            <h2 className="text-xl font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
              <User className="w-5 h-5 text-violet-400" />
              <span>Completar Tu Reserva</span>
            </h2>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Nombre Completo *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Ej: Juan Pablo Restrepo"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 pl-11 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                />
                <User className="w-4 h-4 text-slate-500 absolute left-4 top-3.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Celular / WhatsApp *
              </label>
              <div className="relative">
                <input
                  type="tel"
                  required
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  placeholder="Ej: 312 456 7890"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 pl-11 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                />
                <Phone className="w-4 h-4 text-slate-500 absolute left-4 top-3.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Notas Especiales (Opcional)
              </label>
              <div className="relative">
                <textarea
                  rows={3}
                  value={clientNotes}
                  onChange={(e) => setClientNotes(e.target.value)}
                  placeholder="Ej: Me gustaría un tintico sin azúcar, corte fade bajito..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 pl-11 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                />
                <FileText className="w-4 h-4 text-slate-500 absolute left-4 top-3.5" />
              </div>
            </div>

            {/* Final Booking Summary Box */}
            <div className="bg-slate-950/80 rounded-xl p-4 border border-slate-800/80 space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Lugar:</span>
                <span className="font-bold text-white">{LOCATIONS.find((l) => l.id === selectedLocation)?.name}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Servicio:</span>
                <span className="font-bold text-white">{selectedService?.name}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Barbero:</span>
                <span className="font-bold text-white">{selectedBarber?.nickname}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Fecha & Hora:</span>
                <span className="font-bold text-violet-300">{selectedDate} - {selectedTime}</span>
              </div>
              <div className="pt-2 border-t border-slate-800 flex justify-between text-sm font-bold">
                <span className="text-white">Total a pagar en barbería:</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300 text-base">
                  ${selectedService?.priceCOP.toLocaleString('es-CO')} COP
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Atrás</span>
              </button>

              <button
                type="submit"
                className="flex items-center gap-2 px-8 py-4 rounded-xl text-sm font-extrabold text-slate-950 bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 hover:brightness-110 shadow-lg shadow-emerald-950/60 transition-all transform hover:scale-[1.02]"
              >
                <CheckCircle2 className="w-5 h-5 text-slate-950" />
                <span> Confirmar Reserva Cita</span>
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* STEP 5: Confirmación / Ticket */}
      {step === 5 && createdAppointment && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-xl mx-auto space-y-6"
        >
          {/* Ticket Card */}
          <div className="bg-slate-900/95 border-2 border-emerald-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden text-center">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mx-auto mb-4 text-emerald-400 shadow-lg">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-widest text-emerald-300 bg-emerald-950/80 border border-emerald-500/30">
              ¡Cita Reservada con Éxito, Parce!
            </span>

            <h2 className="text-2xl font-black text-white mt-3">
              ¡Listo el Pollo! Quedaste Agendado
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-md mx-auto">
              Guardamos tu cita correctamente. Te esperamos en VANGUAR para dejarte con el mejor estilo paisa.
            </p>

            {/* Ticket details */}
            <div className="mt-6 bg-slate-950 p-5 rounded-2xl border border-slate-800/90 text-left space-y-3 font-mono text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                <span className="text-slate-500 uppercase tracking-wider text-[10px]">CÓDIGO CITA</span>
                <span className="text-violet-400 font-bold text-sm">#{createdAppointment.id}</span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <span className="text-slate-500 text-[10px] block">CLIENTE</span>
                  <span className="font-bold text-white text-sm">{createdAppointment.clientName}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">BARBERO</span>
                  <span className="font-bold text-white text-sm">{createdAppointment.barberNickname}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">FECHA & HORA</span>
                  <span className="font-bold text-violet-300 text-sm">
                    {createdAppointment.date} - {createdAppointment.time}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">SEDE</span>
                  <span className="font-bold text-white text-sm">{createdAppointment.locationName}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex justify-between items-center">
                <span className="text-slate-400 text-xs">VALOR SERVICIO:</span>
                <span className="text-base font-black text-emerald-400">
                  ${createdAppointment.servicePriceCOP.toLocaleString('es-CO')} COP
                </span>
              </div>
            </div>

            {/* Barcode graphic effect */}
            <div className="mt-5 pt-4 border-t border-dashed border-slate-800 flex flex-col items-center gap-1">
              <div className="flex gap-1 h-8 opacity-60">
                {Array.from({ length: 32 }).map((_, i) => (
                  <div
                    key={i}
                    className={`bg-slate-300 rounded-sm ${
                      i % 3 === 0 ? 'w-1.5' : i % 2 === 0 ? 'w-1' : 'w-0.5'
                    }`}
                  />
                ))}
              </div>
              <span className="text-[10px] font-mono text-slate-500">VANGUAR-MEDELLIN-VERIFIED-PASS</span>
            </div>

            {/* Actions */}
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleCopyReminder}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all"
              >
                <Copy className="w-4 h-4 text-violet-400" />
                <span>{copiedNotification ? '¡Copiado!' : 'Copiar Recordatorio WhatsApp'}</span>
              </button>

              <button
                onClick={onViewAppointments}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-blue-400 to-purple-400 hover:brightness-110 shadow-lg transition-all"
              >
                <CalendarIcon className="w-4 h-4" />
                <span>Ver Mis Citas Guardadas</span>
              </button>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={() => {
                setStep(1);
                setCreatedAppointment(null);
              }}
              className="inline-flex items-center gap-2 text-xs font-bold text-violet-400 hover:text-violet-300"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Agendar Otra Cita Nuevamente</span>
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};
