'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import Spinner from '@/components/ui/spinner';

import {
  getAppointmentById,
  updateAppointmentStatus,
  type Appointment,
} from '@/libs/api/clinic-appointment';

import { getVisitByAppointmentId, type Visit } from '@/libs/api/clinic-visit';
import CreateVisit from '@/components/create-visit';
import VisitDetail from '@/components/clinic/get-visit-detail';
import UpdateVitals from '@/components/clinic/update-vitals';

import {
  Calendar,
  Heart,
  Clock,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowLeft,
  Mail,
  MapPin,
  Activity,
  Stethoscope,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

import Image from 'next/image';

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400">
      {children}
    </p>
  );
}

function InfoRow({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2.5 text-sm text-gray-600">
      <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md bg-gray-100">
        {icon}
      </div>
      <span className="leading-snug">{children}</span>
    </div>
  );
}

export default function AppointmentDetails() {
  const { appointmentId } = useParams() as { appointmentId: string };
  const router = useRouter();

  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [existingVisit, setExistingVisit] = useState<Visit | null>(null);
  const [visitChecked, setVisitChecked] = useState(false);

  /* ===================== FETCH APPOINTMENT ===================== */
  const fetchAppointment = async () => {
    try {
      const data = await getAppointmentById(appointmentId, 'clinic');
      setAppointment(data);
    } catch (err: any) {
      toast.error(err.message || 'Failed to fetch appointment');
    }
  };

  useEffect(() => {
    if (!appointmentId) return;
    setLoading(true);
    fetchAppointment().finally(() => setLoading(false));
  }, [appointmentId]);

  /* ===================== FETCH VISIT ===================== */
  useEffect(() => {
    if (!appointmentId) return;
    getVisitByAppointmentId(appointmentId)
      .then(setExistingVisit)
      .catch(() => setExistingVisit(null))
      .finally(() => setVisitChecked(true));
  }, [appointmentId]);

  /* ===================== STATUS UPDATE ===================== */
  const handleStatusUpdate = async (status: 'confirmed' | 'cancelled' | 'completed') => {
    if (!appointment) return;
    setUpdating(true);
    try {
      await updateAppointmentStatus(appointment._id, status);
      await fetchAppointment();
      toast.success(`Appointment ${status}`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setUpdating(false);
    }
  };

  /* ===================== STATUS CONFIG ===================== */
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'confirmed':
        return { bar: 'bg-emerald-500', pill: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: <CheckCircle className="w-4 h-4" />, label: 'Confirmed' };
      case 'completed':
        return { bar: 'bg-green-500', pill: 'bg-green-50 text-green-700 border-green-200', icon: <CheckCircle className="w-4 h-4" />, label: 'Completed' };
      case 'pending':
        return { bar: 'bg-yellow-400', pill: 'bg-yellow-50 text-yellow-700 border-yellow-200', icon: <AlertCircle className="w-4 h-4" />, label: 'Pending' };
      case 'cancelled':
        return { bar: 'bg-red-500', pill: 'bg-red-50 text-red-700 border-red-200', icon: <XCircle className="w-4 h-4" />, label: 'Cancelled' };
      default:
        return { bar: 'bg-gray-400', pill: 'bg-gray-50 text-gray-700 border-gray-200', icon: <Clock className="w-4 h-4" />, label: status };
    }
  };

  /* ===================== LOADING / EMPTY ===================== */
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#D7F9E5]">
        <Spinner />
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#D7F9E5]">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow">
            <AlertCircle className="h-8 w-8 text-gray-400" />
          </div>
          <p className="font-semibold text-gray-600 pry-ff">Appointment not found</p>
        </div>
      </div>
    );
  }

  const sc = getStatusConfig(appointment.status);

  const SidebarContent = () => (
    <div className="space-y-5 px-5 py-5">
      <div>
        <SectionLabel>Appointment ID</SectionLabel>
        <p className="inline-block rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 font-mono text-xs font-semibold text-gray-500">
          #{appointmentId.slice(0, 8).toUpperCase()}
        </p>
      </div>

      <div>
        <SectionLabel>Owner</SectionLabel>
        <p className="mb-2 font-semibold text-gray-900">
          {appointment.owner?.fullname ?? 'Unknown owner'}
        </p>
        {appointment.owner?.email && (
          <InfoRow icon={<Mail className="h-3 w-3 text-gray-400" />}>
            {appointment.owner.email}
          </InfoRow>
        )}
      </div>

      {appointment.clinic && (
        <div>
          <SectionLabel>Clinic</SectionLabel>
          <p className="mb-2 font-semibold text-gray-900">{appointment.clinic.clinicName}</p>
          {appointment.clinic.address && (
            <InfoRow icon={<MapPin className="h-3 w-3 text-gray-400" />}>
              {Object.values(appointment.clinic.address).filter(Boolean).join(', ')}
            </InfoRow>
          )}
        </div>
      )}

      <div>
        <SectionLabel>Schedule</SectionLabel>
        <div className="space-y-2">
          <InfoRow icon={<Calendar className="h-3 w-3 text-gray-400" />}>
            {new Date(appointment.date).toLocaleDateString()}
          </InfoRow>
          <InfoRow icon={<Clock className="h-3 w-3 text-gray-400" />}>
            {new Date(appointment.date).toLocaleTimeString()}
          </InfoRow>
          <InfoRow icon={<Activity className="h-3 w-3 text-gray-400" />}>
            30 mins
          </InfoRow>
          {appointment.type && (
            <InfoRow icon={<Stethoscope className="h-3 w-3 text-gray-400" />}>
              <span className="capitalize">{appointment.type}</span>
            </InfoRow>
          )}
        </div>
      </div>

      {appointment.notes && (
        <div>
          <SectionLabel>Notes</SectionLabel>
          <div className="flex items-start gap-2">
            <FileText className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-gray-400" />
            <p className="text-xs leading-relaxed text-gray-600">{appointment.notes}</p>
          </div>
        </div>
      )}
    </div>
  );

  /* ===================== RENDER ===================== */
  return (
    <div className="pry-ff flex h-[calc(100vh-56px)] flex-col overflow-hidden lg:flex-row">

      {/* MOBILE */}
      <div className="flex-shrink-0 border-b border-gray-200 bg-white lg:hidden">
        <div className="relative h-36 w-full overflow-hidden">
          {appointment.pet?.photo ? (
            <Image src={appointment.pet.photo} alt={appointment.pet.name} fill className="object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-emerald-100 to-green-200">
              <Heart className="h-12 w-12 text-emerald-300" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute bottom-0 left-0 p-3">
            <p className="text-[11px] font-semibold text-white/70">
              {appointment.pet?.breed ?? 'Breed not provided'}
            </p>
            <h2 className="text-lg font-extrabold leading-none text-white">
              {appointment.pet?.name ?? 'No pet assigned'}
            </h2>
          </div>
          <div className="absolute right-3 top-3">
            <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold ${sc.pill}`}>
              {sc.icon}{sc.label}
            </span>
          </div>
        </div>

        <button
          onClick={() => setSidebarOpen((v) => !v)}
          className="flex w-full items-center justify-between px-5 py-3 text-xs font-bold uppercase tracking-wider text-gray-500 hover:bg-gray-50 transition-colors"
        >
          <span>Patient Info</span>
          {sidebarOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>

        {sidebarOpen && (
          <div className="border-t border-gray-100">
            <SidebarContent />
          </div>
        )}
      </div>

      {/* DESKTOP SIDEBAR */}
      <aside className="hidden w-[320px] min-w-[320px] flex-col overflow-hidden border-r border-gray-200 bg-white lg:flex">
        <div className="relative h-44 flex-shrink-0">
          {appointment.pet?.photo ? (
            <Image src={appointment.pet.photo} alt={appointment.pet.name} fill className="object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-emerald-100 to-green-200">
              <Heart className="h-14 w-14 text-emerald-300" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <div className="absolute bottom-0 left-0 p-4">
            <p className="text-xs font-semibold text-white/70">
              {appointment.pet?.breed ?? 'Breed not provided'}
            </p>
            <h2 className="text-xl font-extrabold leading-none text-white">
              {appointment.pet?.name ?? 'No pet assigned'}
            </h2>
          </div>
          <div className="absolute right-3 top-3">
            <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold ${sc.pill}`}>
              {sc.icon}{sc.label}
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <SidebarContent />
        </div>

        <div className="flex-shrink-0 border-t border-gray-100 p-4">
          <button
            onClick={() => router.back()}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white py-2.5 text-[11px] font-bold uppercase tracking-wider text-gray-500 hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Appointments
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex flex-1 flex-col overflow-hidden bg-[#f0fdf6]">
        <div className="flex-shrink-0 border-b border-white/70 bg-[#f0fdf6] px-4 py-4 sm:px-8 sm:py-5 flex items-end justify-between">
          <div>
            <h1 className="text-xl font-extrabold leading-none text-gray-900 sm:text-2xl">
              Appointment Details
            </h1>
            <p className="mt-1.5 text-xs text-gray-500 sm:text-sm">
              View and manage this consultation.
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Session</p>
            <p className="font-mono text-xs font-bold text-emerald-600 sm:text-sm">
              #{appointmentId.slice(0, 8).toUpperCase()}
            </p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-8 sm:py-8">
          <div className="mx-auto max-w-2xl space-y-6">

            {/* Status card */}
            <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
              <div className={`${sc.bar} px-4 py-3 sm:px-6 sm:py-4 flex items-center justify-between`}>
                <div className="flex items-center gap-2 text-white">
                  <span className="opacity-90">{sc.icon}</span>
                  <span className="font-extrabold capitalize">{appointment.status}</span>
                </div>
                <span className="font-mono text-xs text-white/70">#{appointmentId.slice(0, 8)}</span>
              </div>

              {(appointment.status === 'pending' || appointment.status === 'confirmed') && (
                <div className="flex flex-wrap gap-2 px-4 py-4 sm:px-6">
                  {appointment.status === 'pending' && (
                    <>
                      <button
                        disabled={updating}
                        onClick={() => handleStatusUpdate('confirmed')}
                        className="flex items-center gap-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 active:scale-95 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-emerald-200 disabled:opacity-50 transition-all"
                      >
                        <CheckCircle className="w-4 h-4" /> Confirm
                      </button>
                      <button
                        disabled={updating}
                        onClick={() => handleStatusUpdate('cancelled')}
                        className="flex items-center gap-1.5 rounded-xl border border-red-200 bg-white hover:bg-red-50 active:scale-95 px-4 py-2 text-sm font-semibold text-red-500 disabled:opacity-50 transition-all"
                      >
                        <XCircle className="w-4 h-4" /> Cancel
                      </button>
                    </>
                  )}
                  {appointment.status === 'confirmed' && (
                    <>
                      <button
                        disabled={updating}
                        onClick={() => handleStatusUpdate('completed')}
                        className="flex items-center gap-1.5 rounded-xl bg-blue-500 hover:bg-blue-600 active:scale-95 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-blue-200 disabled:opacity-50 transition-all"
                      >
                        <CheckCircle className="w-4 h-4" /> Mark Complete
                      </button>
                      <button
                        disabled={updating}
                        onClick={() => handleStatusUpdate('cancelled')}
                        className="flex items-center gap-1.5 rounded-xl border border-red-200 bg-white hover:bg-red-50 active:scale-95 px-4 py-2 text-sm font-semibold text-red-500 disabled:opacity-50 transition-all"
                      >
                        <XCircle className="w-4 h-4" /> Cancel
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Visit section */}
            {appointment.status === 'confirmed' && appointment.pet?._id && (
              !visitChecked ? (
                // Still checking for existing visit
                <div className="rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center py-10">
                  <Spinner />
                </div>
              ) : existingVisit ? (
                // Visit exists — show detail + update form
                <>
                  <VisitDetail visit={existingVisit} />
                  <UpdateVitals
                    visit={existingVisit}
                    onUpdated={(updated) => setExistingVisit(updated)}
                  />
                </>
              ) : (
                // No visit yet — show create form
                <CreateVisit
                  appointmentId={appointment._id}
                  petId={appointment.pet._id}
                />
              )
            )}

          </div>
        </div>
      </main>
    </div>
  );
}