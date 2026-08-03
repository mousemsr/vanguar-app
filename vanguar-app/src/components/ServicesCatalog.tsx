import React, { useState } from 'react';
import { BarberService } from '../types';
import { SERVICES } from '../data/barberiaData';
import {
  Scissors,
  Crown,
  Sparkles,
  UserCheck,
  Flame,
  Zap,
  Smile,
  Clock,
  PlusCircle,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react';

interface ServicesCatalogProps {
  onSelectServiceToBook: (service: BarberService) => void;
}

export const ServicesCatalog: React.FC<ServicesCatalogProps> = ({ onSelectServiceToBook }) => {
  const [activeCategory, setActiveCategory] = useState<string>('todos');

  const renderServiceIcon = (iconName: string) => {
    switch (iconName) {
      case 'Scissors':
        return <Scissors className="w-6 h-6 text-blue-400" />;
      case 'Crown':
        return <Crown className="w-6 h-6 text-amber-400" />;
      case 'Sparkles':
        return <Sparkles className="w-6 h-6 text-purple-400" />;
      case 'UserCheck':
        return <UserCheck className="w-6 h-6 text-teal-400" />;
      case 'Flame':
        return <Flame className="w-6 h-6 text-rose-400" />;
      case 'Zap':
        return <Zap className="w-6 h-6 text-cyan-400" />;
      case 'Smile':
        return <Smile className="w-6 h-6 text-emerald-400" />;
      default:
        return <Scissors className="w-6 h-6 text-blue-400" />;
    }
  };

  const filteredServices = SERVICES.filter((s) => {
    if (activeCategory === 'todos') return true;
    return s.category === activeCategory;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Catálogo de Servicios Finos <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400">VANGUAR</span>
        </h1>
        <p className="text-sm text-slate-400 mt-2">
          Cortes modernos, perfilados tradicionales de navaja, tratamientos faciales y la experiencia de un verdadero patrón en Medellín.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {[
          { id: 'todos', label: 'Todos los Servicios' },
          { id: 'corte', label: 'Cortes & Fades' },
          { id: 'combo', label: 'Combos Rey' },
          { id: 'barba', label: 'Barba & Ritual' },
          { id: 'especial', label: 'Especiales & Tintura' },
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
              activeCategory === cat.id
                ? 'bg-gradient-to-r from-blue-900/80 to-purple-900/80 text-white border border-violet-500/50 shadow-lg shadow-violet-950/50'
                : 'bg-slate-900/80 text-slate-400 border border-slate-800 hover:text-white hover:bg-slate-800'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service) => (
          <div
            key={service.id}
            className="bg-slate-900/80 border border-slate-800/90 rounded-2xl p-6 flex flex-col justify-between hover:border-violet-500/50 hover:bg-slate-900 transition-all shadow-xl group relative"
          >
            {service.popular && (
              <div className="absolute top-4 right-4 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider text-amber-300 bg-amber-950/80 border border-amber-500/40">
                ⭐ Recomendado
              </div>
            )}

            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 w-fit">
                {renderServiceIcon(service.iconName)}
              </div>

              <div>
                <h3 className="text-lg font-bold text-white group-hover:text-violet-300 transition-colors">
                  {service.name}
                </h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  {service.description}
                </p>
              </div>
            </div>

            <div className="pt-6 mt-4 border-t border-slate-800/80 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Clock className="w-4 h-4 text-violet-400" />
                  <span>{service.durationMin} Minutos</span>
                </div>

                <div className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-indigo-200 to-purple-300">
                  ${service.priceCOP.toLocaleString('es-CO')} COP
                </div>
              </div>

              <button
                onClick={() => onSelectServiceToBook(service)}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold text-white bg-slate-800 hover:bg-gradient-to-r hover:from-blue-600 hover:to-violet-600 border border-slate-700 hover:border-violet-500 transition-all shadow-md"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Agendar Este Servicio</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
