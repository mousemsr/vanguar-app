import React from 'react';
import { Barber } from '../types';
import { BARBERS, LOCATIONS } from '../data/barberiaData';
import { Star, MapPin, Award, Calendar, ChevronRight, CheckCircle2 } from 'lucide-react';

interface BarbersListProps {
  onSelectBarberToBook: (barber: Barber) => void;
}

export const BarbersList: React.FC<BarbersListProps> = ({ onSelectBarberToBook }) => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Nuestros Barberos Pro <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400">VANGUAR</span>
        </h1>
        <p className="text-sm text-slate-400 mt-2">
          Especialistas con años de experiencia en tijera, navaja, colorimetría y diseño de imagen masculina en Medellín.
        </p>
      </div>

      {/* Barbers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {BARBERS.map((barber) => (
          <div
            key={barber.id}
            className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 flex flex-col sm:flex-row items-start gap-5 hover:border-violet-500/50 transition-all shadow-xl relative overflow-hidden group"
          >
            <div className="relative shrink-0 mx-auto sm:mx-0">
              <img
                src={barber.avatar}
                alt={barber.name}
                className="w-28 h-28 rounded-2xl object-cover border-2 border-slate-700 shadow-md group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-xs px-2 py-1 rounded-lg flex items-center gap-1 shadow-lg">
                <Star className="w-3.5 h-3.5 fill-slate-950" />
                <span>{barber.rating}</span>
                <span className="text-[10px] text-slate-900 font-semibold">({barber.reviewsCount})</span>
              </div>
            </div>

            <div className="flex-1 min-w-0 space-y-3 text-center sm:text-left">
              <div>
                <h3 className="text-xl font-black text-white">{barber.nickname}</h3>
                <p className="text-xs text-violet-400 font-bold">{barber.role}</p>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">{barber.bio}</p>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs space-y-1">
                <div className="text-slate-300 font-semibold flex items-center gap-1.5 justify-center sm:justify-start">
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  <span>Especialidad: {barber.specialty}</span>
                </div>
                <div className="text-slate-400 flex items-center gap-1.5 justify-center sm:justify-start">
                  <MapPin className="w-3.5 h-3.5 text-violet-400" />
                  <span>
                    Sedes:{' '}
                    {barber.locations
                      .map((loc) => LOCATIONS.find((l) => l.id === loc)?.name)
                      .join(' / ')}
                  </span>
                </div>
              </div>

              <button
                onClick={() => onSelectBarberToBook(barber)}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 transition-all shadow-md"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Agendar Cita con {barber.nickname.split(' ')[0]}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
