import React from 'react';
import { LOCATIONS } from '../data/barberiaData';
import { MapPin, Phone, Clock, MessageSquare, ExternalLink, Scissors } from 'lucide-react';

export const LocationsInfo: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Nuestras Sedes en <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400">Medellín</span>
        </h1>
        <p className="text-sm text-slate-400 mt-2">
          Ubicaciones estratégicas en El Poblado y Laureles con parqueadero gratis, bar, TV deportiva y la mejor atención de la ciudad.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {LOCATIONS.map((loc) => (
          <div
            key={loc.id}
            className="bg-slate-900/80 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between"
          >
            <div>
              <div className="relative h-52 overflow-hidden">
                <img
                  src={loc.image}
                  alt={loc.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest text-violet-300 bg-slate-950/80 border border-violet-500/40">
                    {loc.neighborhood}
                  </span>
                  <h3 className="text-2xl font-black text-white mt-1">{loc.name}</h3>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-violet-400 shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Dirección</h4>
                    <p className="text-sm text-white font-medium">{loc.address}</p>
                    <p className="text-xs text-slate-400">{loc.neighborhood}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-violet-400 shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Horario de Atención</h4>
                    <p className="text-xs text-slate-300 leading-relaxed mt-0.5">{loc.hours}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-violet-400 shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Teléfonos</h4>
                    <p className="text-xs text-slate-300">{loc.phone}</p>
                    <p className="text-xs text-emerald-400 font-semibold mt-0.5">WhatsApp: {loc.whatsapp}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 pt-0 flex gap-3">
              <a
                href={`https://wa.me/${loc.whatsapp.replace(/[^0-9]/g, '')}?text=Hola%20VANGUAR,%20quisiera%20consultar%20sobre%20citas`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-all shadow-md"
              >
                <MessageSquare className="w-4 h-4 fill-slate-950" />
                <span>WhatsApp Sede</span>
              </a>

              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(loc.mapQuery)}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center p-3 rounded-xl text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all"
                title="Ver en Google Maps"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
