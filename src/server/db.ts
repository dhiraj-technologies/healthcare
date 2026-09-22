import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { ChatMessage, MessageCategory } from '../types.js';

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: 'admin' | 'nurse' | 'patient';
  phone: string;
  avatar?: string;
  patientId?: string; // If role is patient
  nurseId?: string; // If role is nurse
  createdAt: string;
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
  userId?: string;
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

interface DatabaseSchema {
  users: User[];
  patients: Patient[];
  nurses: NurseStaff[];
  schedules: CareSchedule[];
  records: VitalsRecord[];
  requests: ServiceRequest[];
  messages: ChatMessage[];
}

const DB_FILE = path.resolve(process.cwd(), 'database.json');

// Initial seed data
function getInitialData(): DatabaseSchema {
  const adminHash = bcrypt.hashSync('admin123', 10);
  const nurseHash = bcrypt.hashSync('nurse123', 10);
  const patientHash = bcrypt.hashSync('patient123', 10);

  const initialNurses: NurseStaff[] = [
    {
      id: 'nurse-1',
      fullName: 'Sister Priya Sharma',
      qualification: 'B.Sc Nursing, ICU & Critical Care Diploma',
      experienceYears: 8,
      phone: '+91-9876543210',
      policeVerified: true,
      verificationId: 'DL-POL-VER-2023-8841',
      councilRegistrationNo: 'DNC-RN-48291',
      hubLocation: 'Janak Puri (West Delhi)',
      specialties: ['ICU Setup', 'Tracheostomy Care', 'BiPAP & Ventilator Management', 'Infusion Pumps'],
      activeCases: 1,
      rating: 4.9,
      shiftAvailability: '12h Day / 12h Night',
      avatar: 'https://carehealthnursing.com/images/gallery/003.jpg'
    },
    {
      id: 'nurse-2',
      fullName: 'Nurse Rajesh Kumar',
      qualification: 'GNM (General Nursing & Midwifery), Post-Op Specialist',
      experienceYears: 6,
      phone: '+91-9811223344',
      policeVerified: true,
      verificationId: 'DL-POL-VER-2022-5104',
      councilRegistrationNo: 'UPNC-RN-92014',
      hubLocation: 'Noida Hub (Sector 62)',
      specialties: ['Male Attendant Support', 'Stroke Rehabilitation', 'Catheter & Ryle Tube', 'Wound Dressing'],
      activeCases: 1,
      rating: 4.8,
      shiftAvailability: '24h Live-in',
      avatar: 'https://carehealthnursing.com/images/gallery/006.jpg'
    },
    {
      id: 'nurse-3',
      fullName: 'Sister Anita Massey',
      qualification: 'B.Sc Nursing, Geriatric Companion Care',
      experienceYears: 10,
      phone: '+91-9822334455',
      policeVerified: true,
      verificationId: 'DL-POL-VER-2021-9923',
      councilRegistrationNo: 'DNC-RN-31942',
      hubLocation: 'Indirapuram (Ghaziabad)',
      specialties: ['Elderly Dementia Care', 'Palliative Support', 'Diabetic Management', 'Post-Op Care'],
      activeCases: 2,
      rating: 5.0,
      shiftAvailability: '12h Day Shift',
      avatar: 'https://carehealthnursing.com/images/gallery/016.jpg'
    },
    {
      id: 'nurse-4',
      fullName: 'Brother Sunil Verma',
      qualification: 'Certified Male Attendant & Emergency Triage',
      experienceYears: 5,
      phone: '+91-9833445566',
      policeVerified: true,
      verificationId: 'DL-POL-VER-2023-1102',
      councilRegistrationNo: 'HSDC-ATT-7741',
      hubLocation: 'Laxmi Nagar (East Delhi)',
      specialties: ['Bedridden Patient Care', 'Sponge Bath & Hygiene', 'Wheelchair Transfer', 'Feeding Assistance'],
      activeCases: 1,
      rating: 4.9,
      shiftAvailability: '24h Live-in',
      avatar: 'https://carehealthnursing.com/images/gallery/017.jpg'
    }
  ];

  const initialPatients: Patient[] = [
    {
      id: 'patient-1',
      userId: 'user-patient-1',
      fullName: 'Ramesh Khanna',
      age: 72,
      gender: 'Male',
      diagnosis: 'Acute Ischemic Stroke with Left Hemiparesis, Post-Tracheostomy & Ryle Tube Feeding',
      careType: 'Critical ICU Bedside Nursing (24h Live-in)',
      hubLocation: 'Janak Puri',
      address: 'B-4/112, Janak Puri District Centre, West Delhi - 110058',
      emergencyContact: 'Rajesh Khanna (Son): +91-9876543210',
      attendingPhysician: 'Dr. Vivek Mehra (Senior Neurologist, Max Healthcare)',
      status: 'active',
      assignedNurseId: 'nurse-1',
      assignedNurseName: 'Sister Priya Sharma',
      admissionDate: '2025-08-15'
    },
    {
      id: 'patient-2',
      userId: 'user-patient-2',
      fullName: 'Mrs. Shakuntala Devi',
      age: 68,
      gender: 'Female',
      diagnosis: 'Post Total Knee Arthroplasty (Bilateral TKR) & Type 2 Diabetes',
      careType: 'Post-Surgical Dressing & Physical Rehabilitation (12h Day)',
      hubLocation: 'Noida',
      address: 'Flat 402, Tower B, Sector 62, Noida, U.P. - 201309',
      emergencyContact: 'Amit Sharma (Son): +91-9988776655',
      attendingPhysician: 'Dr. Arvind Singhal (Orthopedic Surgeon, Fortis Hospital)',
      status: 'active',
      assignedNurseId: 'nurse-3',
      assignedNurseName: 'Sister Anita Massey',
      admissionDate: '2025-09-02'
    }
  ];

  const initialUsers: User[] = [
    {
      id: 'user-admin',
      name: 'Dr. Alok Verma',
      email: 'admin@carehealth.com',
      passwordHash: adminHash,
      role: 'admin',
      phone: '+91-9999790231',
      avatar: 'https://carehealthnursing.com/images/gallery/005.jpg',
      createdAt: new Date().toISOString()
    },
    {
      id: 'user-nurse-1',
      name: 'Sister Priya Sharma',
      email: 'nurse.priya@carehealth.com',
      passwordHash: nurseHash,
      role: 'nurse',
      nurseId: 'nurse-1',
      phone: '+91-9876543210',
      avatar: 'https://carehealthnursing.com/images/gallery/003.jpg',
      createdAt: new Date().toISOString()
    },
    {
      id: 'user-patient-1',
      name: 'Rajesh Khanna (Family Rep)',
      email: 'family.khanna@carehealth.com',
      passwordHash: patientHash,
      role: 'patient',
      patientId: 'patient-1',
      phone: '+91-9876543210',
      createdAt: new Date().toISOString()
    }
  ];

  const now = new Date();
  const formatD = (d: Date) => d.toISOString().split('T')[0];

  const todayStr = formatD(now);
  const dMinus2 = new Date(now);
  dMinus2.setDate(dMinus2.getDate() - 2);
  const twoDaysAgoStr = formatD(dMinus2);

  const dMinus1 = new Date(now);
  dMinus1.setDate(dMinus1.getDate() - 1);
  const yesterdayStr = formatD(dMinus1);

  const dPlus1 = new Date(now);
  dPlus1.setDate(dPlus1.getDate() + 1);
  const tomorrowStr = formatD(dPlus1);

  const dPlus2 = new Date(now);
  dPlus2.setDate(dPlus2.getDate() + 2);
  const dayAfterTomorrowStr = formatD(dPlus2);

  const dPlus3 = new Date(now);
  dPlus3.setDate(dPlus3.getDate() + 3);
  const threeDaysLaterStr = formatD(dPlus3);

  const initialSchedules: CareSchedule[] = [
    // Completed shifts (Service History)
    {
      id: 'sched-097',
      patientId: 'patient-1',
      patientName: 'Ramesh Khanna',
      nurseId: 'nurse-1',
      nurseName: 'Sister Priya Sharma',
      shiftDate: twoDaysAgoStr,
      shiftType: '12h Day',
      startTime: '08:00 AM',
      endTime: '08:00 PM',
      status: 'completed',
      tasks: [
        'Tracheostomy tube inner cannula cleaning & dressing change',
        'Morning vitals check & respiratory sound assessment',
        'Ryle tube feed 250ml diabetic nutritional formula',
        'Sponge bath & skin pressure care (back massage)',
        'Physiotherapy: Active-assisted arm & leg range-of-motion'
      ],
      notes: 'Duty completed with excellence. Patient showed good responsiveness during physiotherapy session.'
    },
    {
      id: 'sched-098',
      patientId: 'patient-1',
      patientName: 'Ramesh Khanna',
      nurseId: 'nurse-2',
      nurseName: 'Nurse Rajesh Kumar',
      shiftDate: twoDaysAgoStr,
      shiftType: '12h Night',
      startTime: '08:00 PM',
      endTime: '08:00 AM',
      status: 'completed',
      tasks: [
        'Nighttime continuous SpO2 and pulse monitoring',
        'Administered evening medications through enteral tube',
        'Scheduled 2-hourly lateral posture repositioning',
        'BiPAP mode checked at IPAP 12, EPAP 4'
      ],
      notes: 'Uneventful night shift. Patient rested comfortably with no respiratory distress observed.'
    },
    {
      id: 'sched-099',
      patientId: 'patient-1',
      patientName: 'Ramesh Khanna',
      nurseId: 'nurse-1',
      nurseName: 'Sister Priya Sharma',
      shiftDate: yesterdayStr,
      shiftType: '12h Day',
      startTime: '08:00 AM',
      endTime: '08:00 PM',
      status: 'completed',
      tasks: [
        'Tracheostomy suctioning performed per schedule',
        'Bedside glucose monitoring (Fasting & Post-lunch)',
        'Catheter hygiene & urine drainage bag measurement (1,450ml total)',
        'Assisted wheelchair transfer and 20-min sun sitting in balcony',
        'Oral hygiene and antiseptic gargle swab'
      ],
      notes: 'Family attended session. Patient sat in wheelchair for 20 minutes with stable vitals.'
    },
    {
      id: 'sched-100',
      patientId: 'patient-1',
      patientName: 'Ramesh Khanna',
      nurseId: 'nurse-2',
      nurseName: 'Nurse Rajesh Kumar',
      shiftDate: yesterdayStr,
      shiftType: '12h Night',
      startTime: '08:00 PM',
      endTime: '08:00 AM',
      status: 'completed',
      tasks: [
        'Periodic vitals monitoring at 22:00, 02:00, 06:00',
        'Bed position alteration and back massage for circulation',
        'Enteral hydration 100ml warm water post-medication',
        'Morning oral hygiene prior to shift handover'
      ],
      notes: 'Smooth transition. Handover given to Sister Priya Sharma with vitals log signed.'
    },
    // Today's active & upcoming shifts
    {
      id: 'sched-101',
      patientId: 'patient-1',
      patientName: 'Ramesh Khanna',
      nurseId: 'nurse-1',
      nurseName: 'Sister Priya Sharma',
      shiftDate: todayStr,
      shiftType: '12h Day',
      startTime: '08:00 AM',
      endTime: '08:00 PM',
      status: 'in-progress',
      tasks: [
        'Tracheostomy tube suctioning every 3 hours',
        'Vitals recording every 4 hours (BP, SpO2, Heart rate)',
        'Ryle Tube feeding 250ml diabetic formulated feed at 09:00, 13:00, 17:00',
        'Passive limb mobilization exercises with physiotherapist guidance',
        'Position change every 2 hours for bed-sore prevention'
      ],
      notes: 'Patient stable, alert, responding to hand pressure. BiPAP tolerated well during night.'
    },
    {
      id: 'sched-102',
      patientId: 'patient-1',
      patientName: 'Ramesh Khanna',
      nurseId: 'nurse-2',
      nurseName: 'Nurse Rajesh Kumar',
      shiftDate: todayStr,
      shiftType: '12h Night',
      startTime: '08:00 PM',
      endTime: '08:00 AM',
      status: 'scheduled',
      tasks: [
        'Nighttime vitals check at 22:00, 02:00, 06:00',
        'Maintain continuous BiPAP monitoring, check mask fit and skin pressure points',
        'Bed position alteration and back massage',
        'Emergency medication standby (Injection Mannitol IV if BP spikes)'
      ],
      notes: 'Keep oxygen concentrator on standby set to 2 L/min.'
    },
    // Upcoming appointments
    {
      id: 'sched-104',
      patientId: 'patient-1',
      patientName: 'Ramesh Khanna',
      nurseId: 'nurse-1',
      nurseName: 'Sister Priya Sharma',
      shiftDate: tomorrowStr,
      shiftType: '12h Day',
      startTime: '08:00 AM',
      endTime: '08:00 PM',
      status: 'scheduled',
      tasks: [
        'Weekly tracheostomy tube tie replacement with sterile gauze padding',
        'Fasting blood sugar test at 08:30 AM',
        'Full body sponge bath and moisturizing for decubitus prevention',
        'Enteral feed management (3 sessions)',
        'Physiotherapy guided passive motion'
      ],
      notes: 'Dr. Vivek Mehra review scheduled via tele-consultation at 04:00 PM.'
    },
    {
      id: 'sched-105',
      patientId: 'patient-1',
      patientName: 'Ramesh Khanna',
      nurseId: 'nurse-2',
      nurseName: 'Nurse Rajesh Kumar',
      shiftDate: tomorrowStr,
      shiftType: '12h Night',
      startTime: '08:00 PM',
      endTime: '08:00 AM',
      status: 'scheduled',
      tasks: [
        'Continuous BiPAP ventilation monitoring',
        'Night medication via Ryle tube',
        'Repositioning at 00:00, 03:00, 06:00',
        'Vitals recording'
      ],
      notes: 'Night shift routine care.'
    },
    {
      id: 'sched-106',
      patientId: 'patient-1',
      patientName: 'Ramesh Khanna',
      nurseId: 'nurse-1',
      nurseName: 'Sister Priya Sharma',
      shiftDate: dayAfterTomorrowStr,
      shiftType: '12h Day',
      startTime: '08:00 AM',
      endTime: '08:00 PM',
      status: 'scheduled',
      tasks: [
        'Bedside vitals & SpO2 monitoring',
        'Tracheostomy care and oral hygiene',
        'Enteral feed 3 sessions',
        'Physiotherapy session with rehabilitation specialist'
      ],
      notes: 'Confirmed schedule.'
    },
    {
      id: 'sched-107',
      patientId: 'patient-1',
      patientName: 'Ramesh Khanna',
      nurseId: 'nurse-1',
      nurseName: 'Sister Priya Sharma',
      shiftDate: threeDaysLaterStr,
      shiftType: '12h Day',
      startTime: '08:00 AM',
      endTime: '08:00 PM',
      status: 'scheduled',
      tasks: [
        'Regular ICU bedside nursing care',
        'Medication administration',
        'Patient hygiene & limb mobilization'
      ],
      notes: 'Weekly routine care cycle.'
    },
    {
      id: 'sched-103',
      patientId: 'patient-2',
      patientName: 'Mrs. Shakuntala Devi',
      nurseId: 'nurse-3',
      nurseName: 'Sister Anita Massey',
      shiftDate: tomorrowStr,
      shiftType: '12h Day',
      startTime: '09:00 AM',
      endTime: '09:00 PM',
      status: 'scheduled',
      tasks: [
        'Bilateral knee wound dressing with sterile povidone-iodine and dry gauze',
        'Assisted walker ambulation for 15 minutes twice daily',
        'Fasting and post-prandial blood sugar tracking',
        'Administer oral anticoagulants and analgesics as prescribed'
      ],
      notes: 'Ensure ice-pack compression applied post-ambulation.'
    }
  ];

  const initialRecords: VitalsRecord[] = [
    {
      id: 'rec-098',
      patientId: 'patient-1',
      patientName: 'Ramesh Khanna',
      nurseId: 'nurse-1',
      nurseName: 'Sister Priya Sharma',
      recordedAt: new Date(Date.now() - 48 * 3600000).toISOString(),
      vitals: {
        bpSystolic: 128,
        bpDiastolic: 84,
        pulseRate: 76,
        spO2: 97,
        temperatureF: 98.6,
        bloodGlucoseMgDl: 145,
        respiratoryRate: 18
      },
      medicationsAdministered: [
        { name: 'Tab Amlodipine 5mg', dosage: '5mg via Ryle tube', route: 'Enteral', time: '09:00 AM' },
        { name: 'Inj Clexane 40mg', dosage: '0.4ml', route: 'Subcutaneous', time: '10:00 AM' }
      ],
      clinicalNotes: 'Initial check of the day. Stoma intact, no bleeding or purulence. Ryle tube aspiration clear gastric residual.',
      doctorInstructionsFollowed: true,
      hashSignature: 'sha256:3a1b9c8d7e6f543210abcedf0123456789abcdef'
    },
    {
      id: 'rec-099',
      patientId: 'patient-1',
      patientName: 'Ramesh Khanna',
      nurseId: 'nurse-1',
      nurseName: 'Sister Priya Sharma',
      recordedAt: new Date(Date.now() - 24 * 3600000).toISOString(),
      vitals: {
        bpSystolic: 124,
        bpDiastolic: 80,
        pulseRate: 75,
        spO2: 98,
        temperatureF: 98.4,
        bloodGlucoseMgDl: 136,
        respiratoryRate: 17
      },
      medicationsAdministered: [
        { name: 'Tab Amlodipine 5mg', dosage: '5mg via Ryle tube', route: 'Enteral', time: '09:00 AM' },
        { name: 'Inj Clexane 40mg', dosage: '0.4ml', route: 'Subcutaneous', time: '10:00 AM' },
        { name: 'Pantocid 40mg IV', dosage: '40mg in 10ml sterile water', route: 'IV Slow Push', time: '08:30 AM' }
      ],
      clinicalNotes: 'Morning vitals recorded prior to enteral feeding. SpO2 on room air 96%, increased to 98% with 1.5L nasal prong.',
      doctorInstructionsFollowed: true,
      hashSignature: 'sha256:7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d'
    },
    {
      id: 'rec-1',
      patientId: 'patient-1',
      patientName: 'Ramesh Khanna',
      nurseId: 'nurse-1',
      nurseName: 'Sister Priya Sharma',
      recordedAt: new Date(Date.now() - 4 * 3600000).toISOString(),
      vitals: {
        bpSystolic: 126,
        bpDiastolic: 82,
        pulseRate: 74,
        spO2: 98,
        temperatureF: 98.4,
        bloodGlucoseMgDl: 138,
        respiratoryRate: 18
      },
      medicationsAdministered: [
        { name: 'Tab Amlodipine 5mg', dosage: '5mg via Ryle tube', route: 'Enteral', time: '09:00 AM' },
        { name: 'Inj Clexane 40mg', dosage: '0.4ml', route: 'Subcutaneous', time: '10:00 AM' },
        { name: 'Multivitamin Infusion', dosage: '1 vial in 100ml NS', route: 'IV Piggyback', time: '11:30 AM' }
      ],
      clinicalNotes: 'Tracheostomy stoma site clean without discharge. Chest sounds bilateral air entry clear post-suction. Urine output 450ml over 4 hours, clear amber.',
      doctorInstructionsFollowed: true,
      hashSignature: 'sha256:d8a94b5e8c1f0923eab97c11a6f8b910e527a'
    },
    {
      id: 'rec-2',
      patientId: 'patient-1',
      patientName: 'Ramesh Khanna',
      nurseId: 'nurse-1',
      nurseName: 'Sister Priya Sharma',
      recordedAt: new Date(Date.now() - 1 * 3600000).toISOString(),
      vitals: {
        bpSystolic: 122,
        bpDiastolic: 78,
        pulseRate: 72,
        spO2: 99,
        temperatureF: 98.6,
        bloodGlucoseMgDl: 142,
        respiratoryRate: 17
      },
      medicationsAdministered: [
        { name: 'Syrup Citralka 10ml', dosage: '10ml in water', route: 'Enteral', time: '01:30 PM' }
      ],
      clinicalNotes: 'Post-lunch feeding tolerated well without reflux. Pupil reflex normal. Extremity tone improved on passive extension.',
      doctorInstructionsFollowed: true,
      hashSignature: 'sha256:49c011e3bfa89a9c0499e9008bc3e143bcf22'
    },
    {
      id: 'rec-3',
      patientId: 'patient-2',
      patientName: 'Mrs. Shakuntala Devi',
      nurseId: 'nurse-3',
      nurseName: 'Sister Anita Massey',
      recordedAt: new Date(Date.now() - 12 * 3600000).toISOString(),
      vitals: {
        bpSystolic: 130,
        bpDiastolic: 84,
        pulseRate: 78,
        spO2: 98,
        temperatureF: 98.2,
        bloodGlucoseMgDl: 124,
        respiratoryRate: 16
      },
      medicationsAdministered: [
        { name: 'Tab Ultracet', dosage: '1 tab', route: 'Oral', time: '08:00 AM' },
        { name: 'Tab Metformin 500mg', dosage: '500mg', route: 'Oral', time: '08:30 AM' }
      ],
      clinicalNotes: 'Surgical staples dry and intact on both knees. No active erythema or hematoma. Walked 20 steps with walker support.',
      doctorInstructionsFollowed: true,
      hashSignature: 'sha256:7b92f91ec0847b2c0199e190ba33d014bc910'
    }
  ];

  const initialRequests: ServiceRequest[] = [
    {
      id: 'req-1',
      fullName: 'Vikram Grover',
      phone: '+91-9810123456',
      serviceNeeded: 'ICU Patient Care At Home',
      preferredLocation: 'Janak Puri (West Delhi)',
      shiftRequirement: '24h Live-in',
      conditionNotes: 'Mother discharged from ventilator support. Needs tracheostomy suctioning and 24h nurse immediately.',
      status: 'contacted',
      createdAt: new Date(Date.now() - 3600000).toISOString()
    },
    {
      id: 'req-2',
      fullName: 'Deepika Malhotra',
      phone: '+91-9871198765',
      serviceNeeded: 'Elderly & Senior Citizen Care',
      preferredLocation: 'Noida Hub (Sector 62)',
      shiftRequirement: '12h Day Shift',
      conditionNotes: '84 year old grandfather with mild Alzheimer requiring companion and medication supervision.',
      status: 'new',
      createdAt: new Date(Date.now() - 1800000).toISOString()
    }
  ];

  const initialMessages: ChatMessage[] = [
    {
      id: 'msg-101',
      channelId: 'patient-1',
      patientId: 'patient-1',
      senderId: 'user-patient',
      senderName: 'Rajesh Khanna (Family Rep)',
      senderRole: 'patient',
      senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
      recipientRole: 'all',
      content: 'Good morning Sister Priya & Dr. Alok. Wanted to check if father has received his 09:00 AM prescribed blood pressure tablet (Amlodipine 5mg) and morning chest physiotherapy?',
      category: 'medication',
      timestamp: new Date(Date.now() - 3 * 3600000).toISOString(),
      auditHash: 'sha256:' + crypto.createHash('sha256').update('Good morning Sister Priya & Dr. Alok|user-patient|patient-1').digest('hex'),
      isReadBy: ['user-patient', 'user-nurse', 'user-admin'],
      isUrgent: false
    },
    {
      id: 'msg-102',
      channelId: 'patient-1',
      patientId: 'patient-1',
      senderId: 'user-nurse',
      senderName: 'Sister Priya Sharma',
      senderRole: 'nurse',
      senderAvatar: 'https://carehealthnursing.com/images/gallery/003.jpg',
      recipientRole: 'all',
      content: 'Namaste Rajesh ji. Yes, Tab Amlodipine 5mg was crushed and administered through Ryle tube at 09:12 AM following pre-dose vitals check (BP 126/82 mmHg, Pulse 74 bpm, SpO2 98%). Tracheostomy suctioning was completed with clear secretion and lungs are clear on auscultation.',
      category: 'medication',
      timestamp: new Date(Date.now() - 2.5 * 3600000).toISOString(),
      auditHash: 'sha256:' + crypto.createHash('sha256').update('Namaste Rajesh ji|user-nurse|patient-1').digest('hex'),
      isReadBy: ['user-patient', 'user-nurse', 'user-admin'],
      isUrgent: false
    },
    {
      id: 'msg-103',
      channelId: 'patient-1',
      patientId: 'patient-1',
      senderId: 'user-admin',
      senderName: 'Dr. Alok Verma (Service Coordinator)',
      senderRole: 'admin',
      senderAvatar: 'https://carehealthnursing.com/images/gallery/005.jpg',
      recipientRole: 'all',
      content: 'Clinical Coordination Update: Tele-consultation review with Dr. Vivek Mehra (Senior Neurologist) is confirmed for 04:00 PM today. Sister Priya, please have today\'s blood sugar chart and airway observation records ready on screen.',
      category: 'care_shift',
      timestamp: new Date(Date.now() - 1.2 * 3600000).toISOString(),
      auditHash: 'sha256:' + crypto.createHash('sha256').update('Clinical Coordination Update|user-admin|patient-1').digest('hex'),
      isReadBy: ['user-nurse', 'user-admin'],
      isUrgent: false
    },
    {
      id: 'msg-104',
      channelId: 'patient-1',
      patientId: 'patient-1',
      senderId: 'user-nurse',
      senderName: 'Sister Priya Sharma',
      senderRole: 'nurse',
      senderAvatar: 'https://carehealthnursing.com/images/gallery/003.jpg',
      recipientRole: 'all',
      content: 'Understood Dr. Alok. All parameters including fasting blood glucose (138 mg/dL) and continuous BiPAP compliance logs are synchronized in the Clinical Portal.',
      category: 'general',
      timestamp: new Date(Date.now() - 45 * 60000).toISOString(),
      auditHash: 'sha256:' + crypto.createHash('sha256').update('Understood Dr. Alok|user-nurse|patient-1').digest('hex'),
      isReadBy: ['user-nurse', 'user-admin'],
      isUrgent: false
    },
    {
      id: 'msg-201',
      channelId: 'patient-2',
      patientId: 'patient-2',
      senderId: 'user-nurse-3',
      senderName: 'Sister Anita Massey',
      senderRole: 'nurse',
      senderAvatar: 'https://carehealthnursing.com/images/gallery/016.jpg',
      recipientRole: 'all',
      content: 'Morning wound inspection of bilateral knee incisions completed. Stitches are intact, zero swelling or discharge. Passive knee flexion exercises tolerated for 15 minutes without discomfort.',
      category: 'vital_alert',
      timestamp: new Date(Date.now() - 3.5 * 3600000).toISOString(),
      auditHash: 'sha256:' + crypto.createHash('sha256').update('Morning wound inspection|user-nurse-3|patient-2').digest('hex'),
      isReadBy: ['user-admin'],
      isUrgent: false
    }
  ];

  return {
    users: initialUsers,
    patients: initialPatients,
    nurses: initialNurses,
    schedules: initialSchedules,
    records: initialRecords,
    requests: initialRequests,
    messages: initialMessages
  };
}

class DatabaseManager {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.load();
  }

  private load(): DatabaseSchema {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        if (!parsed.messages || !Array.isArray(parsed.messages) || parsed.messages.length === 0) {
          const initial = getInitialData();
          parsed.messages = initial.messages;
          this.save(parsed);
        }
        return parsed;
      }
    } catch (err) {
      console.warn('Failed to load database.json, initializing default seed data:', err);
    }
    const initial = getInitialData();
    this.save(initial);
    return initial;
  }

  private save(data: DatabaseSchema) {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error saving database.json:', err);
    }
  }

  // Users
  getUsers() { return this.data.users; }
  getUserById(id: string) { return this.data.users.find(u => u.id === id); }
  getUserByEmail(email: string) {
    const q = (email || '').toLowerCase().trim();
    return this.data.users.find(u =>
      u.email.toLowerCase() === q ||
      (q === 'admin' && u.role === 'admin') ||
      (q === 'nurse' && u.role === 'nurse') ||
      (q === 'patient' && u.role === 'patient')
    );
  }
  createUser(user: User) {
    this.data.users.push(user);
    this.save(this.data);
    return user;
  }
  updateUser(id: string, updates: Partial<User>) {
    const idx = this.data.users.findIndex(u => u.id === id);
    if (idx !== -1) {
      this.data.users[idx] = { ...this.data.users[idx], ...updates };
      this.save(this.data);
      return this.data.users[idx];
    }
    return null;
  }

  // Patients
  getPatients() { return this.data.patients; }
  getPatientById(id: string) { return this.data.patients.find(p => p.id === id); }
  createPatient(patient: Patient) {
    this.data.patients.push(patient);
    this.save(this.data);
    return patient;
  }
  updatePatient(id: string, updates: Partial<Patient>) {
    const idx = this.data.patients.findIndex(p => p.id === id);
    if (idx !== -1) {
      this.data.patients[idx] = { ...this.data.patients[idx], ...updates };
      this.save(this.data);
      return this.data.patients[idx];
    }
    return null;
  }
  deletePatient(id: string) {
    const idx = this.data.patients.findIndex(p => p.id === id);
    if (idx !== -1) {
      const removed = this.data.patients.splice(idx, 1)[0];
      this.save(this.data);
      return removed;
    }
    return null;
  }

  // Nurses
  getNurses() { return this.data.nurses; }
  getNurseById(id: string) { return this.data.nurses.find(n => n.id === id); }
  createNurse(nurse: NurseStaff) {
    this.data.nurses.unshift(nurse);
    this.save(this.data);
    return nurse;
  }
  updateNurse(id: string, updates: Partial<NurseStaff>) {
    const idx = this.data.nurses.findIndex(n => n.id === id);
    if (idx !== -1) {
      this.data.nurses[idx] = { ...this.data.nurses[idx], ...updates };
      this.save(this.data);
      return this.data.nurses[idx];
    }
    return null;
  }
  deleteNurse(id: string) {
    const idx = this.data.nurses.findIndex(n => n.id === id);
    if (idx !== -1) {
      const removed = this.data.nurses.splice(idx, 1)[0];
      this.save(this.data);
      return removed;
    }
    return null;
  }

  // Schedules
  getSchedules() { return this.data.schedules; }
  getScheduleById(id: string) { return this.data.schedules.find(s => s.id === id); }
  createSchedule(schedule: CareSchedule) {
    this.data.schedules.push(schedule);
    this.save(this.data);
    return schedule;
  }
  updateSchedule(id: string, updates: Partial<CareSchedule>) {
    const idx = this.data.schedules.findIndex(s => s.id === id);
    if (idx !== -1) {
      this.data.schedules[idx] = { ...this.data.schedules[idx], ...updates };
      this.save(this.data);
      return this.data.schedules[idx];
    }
    return null;
  }
  deleteSchedule(id: string) {
    const idx = this.data.schedules.findIndex(s => s.id === id);
    if (idx !== -1) {
      const removed = this.data.schedules.splice(idx, 1)[0];
      this.save(this.data);
      return removed;
    }
    return null;
  }

  // Records
  getRecords() { return this.data.records; }
  getRecordById(id: string) { return this.data.records.find(r => r.id === id); }
  createRecord(record: VitalsRecord) {
    this.data.records.unshift(record);
    this.save(this.data);
    return record;
  }
  deleteRecord(id: string) {
    const idx = this.data.records.findIndex(r => r.id === id);
    if (idx !== -1) {
      const removed = this.data.records.splice(idx, 1)[0];
      this.save(this.data);
      return removed;
    }
    return null;
  }

  // Requests
  getRequests() { return this.data.requests; }
  createRequest(request: ServiceRequest) {
    this.data.requests.unshift(request);
    this.save(this.data);
    return request;
  }
  updateRequestStatus(id: string, status: ServiceRequest['status']) {
    const idx = this.data.requests.findIndex(r => r.id === id);
    if (idx !== -1) {
      this.data.requests[idx].status = status;
      this.save(this.data);
      return this.data.requests[idx];
    }
    return null;
  }
  // Messages
  getMessages(channelId?: string) {
    if (channelId) {
      return this.data.messages.filter(m => m.channelId === channelId);
    }
    return this.data.messages;
  }
  getMessageById(id: string) {
    return this.data.messages.find(m => m.id === id);
  }
  createMessage(message: ChatMessage) {
    this.data.messages.push(message);
    this.save(this.data);
    return message;
  }
  markMessageRead(messageId: string, userId: string) {
    const msg = this.data.messages.find(m => m.id === messageId);
    if (msg) {
      msg.isReadBy = msg.isReadBy || [];
      if (!msg.isReadBy.includes(userId)) {
        msg.isReadBy.push(userId);
        this.save(this.data);
      }
      return msg;
    }
    return null;
  }
  markChannelRead(channelId: string, userId: string) {
    let updated = false;
    this.data.messages.forEach(m => {
      if (m.channelId === channelId) {
        m.isReadBy = m.isReadBy || [];
        if (!m.isReadBy.includes(userId)) {
          m.isReadBy.push(userId);
          updated = true;
        }
      }
    });
    if (updated) {
      this.save(this.data);
    }
    return true;
  }
}

export const db = new DatabaseManager();
