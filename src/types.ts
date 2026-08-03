export type LocationId = 'poblado' | 'laureles';

export interface LocationInfo {
  id: LocationId;
  name: string;
  address: string;
  neighborhood: string;
  phone: string;
  whatsapp: string;
  hours: string;
  mapQuery: string;
  image: string;
}

export interface BarberService {
  id: string;
  name: string;
  category: 'corte' | 'barba' | 'combo' | 'especial';
  priceCOP: number;
  durationMin: number;
  description: string;
  popular?: boolean;
  iconName: string;
}

export interface Barber {
  id: string;
  name: string;
  nickname: string;
  role: string;
  experienceYears: number;
  rating: number;
  reviewsCount: number;
  avatar: string;
  specialty: string;
  bio: string;
  locations: LocationId[];
  availability: string[];
}

export type AppointmentStatus = 'confirmada' | 'completada' | 'cancelada';

export interface Appointment {
  id: string;
  clientName: string;
  clientPhone: string;
  clientNotes?: string;
  locationId: LocationId;
  locationName: string;
  serviceId: string;
  serviceName: string;
  servicePriceCOP: number;
  serviceDurationMin: number;
  barberId: string;
  barberName: string;
  barberNickname: string;
  barberAvatar: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM AM/PM
  status: AppointmentStatus;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
}
