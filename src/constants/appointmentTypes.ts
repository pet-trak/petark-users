// src/constants/appointmentTypes.ts

/* =========================
   Appointment Types
   Mirrors backend exactly
========================= */
export const APPOINTMENT_TYPES = [
  // General
  'consultation',
  'followUp',
  'teleConsultation',

  // Preventive care
  'vaccination',
  'deworming',
  'parasiteControl',
  'healthScreening',
  'nutritionConsultation',

  // Diagnostics
  'diagnostics',           // ✅ ADD THIS
  'laboratoryTest',
  'bloodTest',
  'urinalysis',
  'xRay',
  'ultrasound',

  // Treatment & procedures
  'medicalTreatment',
  'woundCare',
  'dentalCare',
  'nailTrimming',

  // Surgery
  'surgery',               // ✅ ADD THIS
  'minorSurgery',
  'majorSurgery',
  'spayNeuter',

  // Emergency & critical
  'emergency',
  'traumaCare',
  'poisoningTreatment',
  'intensiveCare',

  // Livestock / farm
  'livestockVisit',        // ✅ ADD THIS
  'herdHealth',
  'pregnancyDiagnosis',
  'artificialInsemination',
  'farmVisit',
  'diseaseControl',

  // Other services
  'grooming',
  'boarding',
  'homeVisit',
  'euthanasia',
  'postMortem',
] as const;

/* =========================
   Derived Type (NO DRIFT)
========================= */
export type AppointmentType = typeof APPOINTMENT_TYPES[number];