export type UserRole = 'admin' | 'nurse' | 'patient';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone: string;
  avatar?: string;
  patientId?: string;
  nurseId?: string;
}

export interface Patient {
  id: string;
  userId?: string;
  fullName: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  diagnosis: string;
  careType: string;
  hubLocation: 'Laxmi Nagar' | 'Janak Puri' | 'Indirapuram' | 'Noida';
  address: string;
  emergencyContact: string;
  attendingPhysician: string;
  status: 'active' | 'inquiry' | 'discharged';
  assignedNurseId?: string;
  assignedNurseName?: string;
  admissionDate: string;
}

export interface NurseStaff {
  id: string;
  fullName: string;
  qualification: string;
  experienceYears: number;
  phone: string;
  policeVerified: boolean;
  verificationId: string;
  councilRegistrationNo: string;
  hubLocation: string;
  specialties: string[];
  activeCases: number;
  rating: number;
  shiftAvailability: string;
  avatar: string;
}

export interface CareSchedule {
  id: string;
  patientId: string;
  patientName: string;
  nurseId: string;
  nurseName: string;
  shiftDate: string;
  shiftType: '12h Day' | '12h Night' | '24h Live-in';
  startTime: string;
  endTime: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  tasks: string[];
  notes?: string;
}

export interface VitalsRecord {
  id: string;
  patientId: string;
  patientName: string;
  nurseId: string;
  nurseName: string;
  recordedAt: string;
  vitals: {
    bpSystolic: number;
    bpDiastolic: number;
    pulseRate: number;
    spO2: number;
    temperatureF: number;
    bloodGlucoseMgDl?: number;
    respiratoryRate?: number;
  };
  medicationsAdministered: {
    name: string;
    dosage: string;
    route: string;
    time: string;
  }[];
  clinicalNotes: string;
  doctorInstructionsFollowed: boolean;
  hashSignature: string;
}

export interface ServiceRequest {
  id: string;
  fullName: string;
  phone: string;
  serviceNeeded: string;
  preferredLocation: string;
  shiftRequirement: string;
  conditionNotes: string;
  status: 'new' | 'contacted' | 'assigned' | 'completed';
  createdAt: string;
}

export interface ServiceCardItem {
  id: string;
  title: string;
  tag: string;
  tagType: string;
  description: string;
  metaLabel: string;
  metaValue: string;
  btnText: string;
  image: string;
}

export interface HubOffice {
  id: string;
  name: string;
  badge: string;
  address: string;
  servicingAreas: string;
  phone: string;
  headOffice?: boolean;
}

export interface TestimonialItem {
  id: string;
  name: string;
  location: string;
  quote: string;
  initials: string;
  rating: number;
}

export type MessageCategory = 'general' | 'vital_alert' | 'medication' | 'care_shift' | 'urgent_consult';

export interface ChatMessage {
  id: string;
  channelId: string;
  patientId: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  senderAvatar?: string;
  recipientRole?: UserRole | 'all';
  content: string;
  category: MessageCategory;
  timestamp: string;
  auditHash: string;
  isReadBy?: string[];
  isUrgent?: boolean;
}

export interface ChatChannel {
  id: string;
  patientId: string;
  patientName: string;
  assignedNurseId?: string;
  assignedNurseName?: string;
  diagnosis?: string;
  hubLocation?: string;
  lastMessage?: ChatMessage;
  unreadCount?: number;
}
