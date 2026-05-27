// src/components/clinic/update-vitals.tsx

'use client';

import { useState, useMemo, useEffect } from 'react';
import { toast } from 'sonner';
import { updateVitals, completeVisit, type Visit } from '@/libs/api/clinic-visit';
import { getClinicProfile } from '@/libs/api/clinic';
import type { PricingItem } from '@/store/auth';
import {
    Activity, Thermometer, Heart, Wind,
    UtensilsCrossed, Zap, Loader2, Save, CheckCircle2,
} from 'lucide-react';
import Spinner from '@/components/ui/spinner';

type Props = {
    visit: Visit;
    onUpdated: (updated: Visit) => void;
};

const vitalFields = [
    { key: 'weight', label: 'Weight', unit: 'kg', placeholder: '0.0', icon: Activity },
    { key: 'temp', label: 'Temperature', unit: '°C', placeholder: '0.0', icon: Thermometer },
    { key: 'pulse', label: 'Pulse', unit: 'bpm', placeholder: '0', icon: Heart },
    { key: 'respiration', label: 'Respiration', unit: 'breaths/min', placeholder: '0', icon: Wind },
] as const;

function formatType(type: string) {
    return type.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase());
}

export default function UpdateVitals({ visit, onUpdated }: Props) {
    const [saving, setSaving] = useState(false);
    const [completing, setCompleting] = useState(false);
    const [loadingServices, setLoadingServices] = useState(true);
    const [services, setServices] = useState<string[]>([]);
    const [pricing, setPricing] = useState<PricingItem[]>([]);

    const [vitals, setVitals] = useState({
        weight: String(visit.vitals?.weight ?? ''),
        temp: String(visit.vitals?.temp ?? ''),
        pulse: String(visit.vitals?.pulse ?? ''),
        respiration: String(visit.vitals?.respiration ?? ''),
        appetite: visit.vitals?.appetite ?? '',
        activity: visit.vitals?.activity ?? '',
    });

    const [appointmentType, setAppointmentType] = useState<string>(
        (visit as any).appointmentType ?? ''
    );

    /* ── Fetch clinic services + pricing ── */
    useEffect(() => {
        getClinicProfile()
            .then(profile => {
                setServices(profile.servicesProvided ?? []);
                setPricing(profile.pricing ?? []);
            })
            .catch(() => toast.error('Failed to load clinic services'))
            .finally(() => setLoadingServices(false));
    }, []);

    /* ── Fee preview for selected type ── */
    const selectedPricing = useMemo(() => (
        pricing.find(p => p.type === appointmentType)
    ), [pricing, appointmentType]);

    const canComplete = useMemo(() => (
        appointmentType !== '' &&
        vitals.appetite.trim() !== '' &&
        vitals.activity.trim() !== ''
    ), [appointmentType, vitals.appetite, vitals.activity]);

    const handleSave = async () => {
        setSaving(true);
        try {
            const updated = await updateVitals(visit._id, {
                vitals: {
                    weight: Number(vitals.weight) || 0,
                    temp: Number(vitals.temp) || 0,
                    pulse: Number(vitals.pulse) || 0,
                    respiration: Number(vitals.respiration) || 0,
                    appetite: vitals.appetite.trim(),
                    activity: vitals.activity.trim(),
                },
                ...(appointmentType && { appointmentType }),
            });
            onUpdated(updated);
            toast.success('Visit updated');
        } catch (err: any) {
            toast.error(err?.message || 'Failed to update visit');
        } finally {
            setSaving(false);
        }
    };

    const handleComplete = async () => {
        if (!canComplete) {
            toast.error('Set appointment type, appetite, and activity before completing');
            return;
        }
        setCompleting(true);
        try {
            const updated = await updateVitals(visit._id, {
                vitals: {
                    weight: Number(vitals.weight) || 0,
                    temp: Number(vitals.temp) || 0,
                    pulse: Number(vitals.pulse) || 0,
                    respiration: Number(vitals.respiration) || 0,
                    appetite: vitals.appetite.trim(),
                    activity: vitals.activity.trim(),
                },
                appointmentType,
            });
            const completed = await completeVisit(updated._id);
            onUpdated(completed);
            toast.success('Visit completed');
        } catch (err: any) {
            toast.error(err?.message || 'Failed to complete visit');
        } finally {
            setCompleting(false);
        }
    };

    const isCompleted = visit.status === 'completed';

    return (
        <div className="rounded-2xl bg-white border border-slate-100 shadow-sm overflow-hidden pry-ff">
            {/* Header */}
            <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/60 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center shadow-sm shadow-emerald-200">
                        <Activity size={16} className="text-white" />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-slate-800 leading-none">Update Visit</h3>
                        <p className="text-xs text-slate-400 mt-0.5">
                            {isCompleted ? 'This visit has been completed' : 'Update vitals and set appointment type'}
                        </p>
                    </div>
                </div>
                <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-bold capitalize ${isCompleted
                        ? 'bg-green-50 text-green-700 border-green-200'
                        : 'bg-blue-50 text-blue-700 border-blue-200'
                    }`}>
                    {visit.status}
                </span>
            </div>

            <div className="p-6 space-y-6">

                {/* Appointment Type */}
                <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                        Appointment Type <span className="text-red-400">*</span>
                    </p>

                    {loadingServices ? (
                        <div className="flex items-center justify-center py-4">
                            <Spinner />
                        </div>
                    ) : services.length === 0 ? (
                        <p className="text-xs text-red-400 font-medium">
                            No services configured. Please update your clinic profile.
                        </p>
                    ) : (
                        <>
                            <select
                                disabled={isCompleted}
                                value={appointmentType}
                                onChange={e => setAppointmentType(e.target.value)}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-800 focus:outline-none focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                <option value="">Select appointment type...</option>
                                {services.map(type => (
                                    <option key={type} value={type}>
                                        {formatType(type)}
                                    </option>
                                ))}
                            </select>

                            {/* Fee preview */}
                            {selectedPricing && (
                                <p className="mt-2 text-xs text-slate-500 font-medium">
                                    Fee:{' '}
                                    <span className="text-emerald-600 font-bold">
                                        ₦{selectedPricing.fee.toLocaleString()}
                                    </span>
                                    <span className="ml-1 text-slate-400">(+ VAT applied at checkout)</span>
                                </p>
                            )}
                        </>
                    )}
                </div>

                {/* Vitals */}
                <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Vitals</p>
                    <div className="grid grid-cols-2 gap-3">
                        {vitalFields.map(({ key, label, unit, placeholder, icon: Icon }) => (
                            <div key={key}>
                                <label className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 mb-1.5">
                                    <Icon size={11} className="text-slate-400" />
                                    {label}
                                    <span className="font-normal text-slate-400">{unit}</span>
                                </label>
                                <input
                                    type="number"
                                    placeholder={placeholder}
                                    disabled={isCompleted}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                                    value={vitals[key]}
                                    onChange={e => setVitals({ ...vitals, [key]: e.target.value })}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Assessment */}
                <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                        Assessment <span className="text-red-400">*</span>
                    </p>
                    <div className="mb-3">
                        <label className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 mb-1.5">
                            <UtensilsCrossed size={11} className="text-slate-400" />
                            Appetite <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="text"
                            placeholder="e.g. normal, decreased"
                            disabled={isCompleted}
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                            value={vitals.appetite}
                            onChange={e => setVitals({ ...vitals, appetite: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 mb-1.5">
                            <Zap size={11} className="text-slate-400" />
                            Activity Level <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="text"
                            placeholder="e.g. active, lethargic"
                            disabled={isCompleted}
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                            value={vitals.activity}
                            onChange={e => setVitals({ ...vitals, activity: e.target.value })}
                        />
                    </div>
                </div>

                {/* Billing preview */}
                {(visit as any).billing?.total > 0 && (
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Billing</p>
                        <div className="rounded-xl border border-slate-100 overflow-hidden">
                            {[
                                { label: 'Professional Fee', value: visit.billing.professionalFee },
                                { label: 'VAT', value: visit.billing.vat },
                            ].map(({ label, value }) => (
                                <div key={label} className="flex items-center justify-between px-4 py-2.5 border-b border-slate-50 last:border-0 bg-white">
                                    <span className="text-xs text-slate-500">{label}</span>
                                    <span className="text-xs font-semibold text-slate-700">₦{value.toLocaleString()}</span>
                                </div>
                            ))}
                            <div className="flex items-center justify-between px-4 py-3 bg-slate-50">
                                <span className="text-xs font-bold text-slate-700">Total</span>
                                <span className="text-sm font-extrabold text-emerald-600">
                                    ₦{visit.billing.total.toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Actions */}
                {!isCompleted && (
                    <div className="flex gap-3">
                        <button
                            disabled={saving || completing}
                            onClick={handleSave}
                            className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-4 py-2.5 text-sm font-bold text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            {saving ? (
                                <><Loader2 size={14} className="animate-spin" /> Saving…</>
                            ) : (
                                <><Save size={14} /> Save Vitals</>
                            )}
                        </button>

                        <button
                            disabled={completing || saving || !canComplete}
                            onClick={handleComplete}
                            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm shadow-emerald-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            {completing ? (
                                <><Loader2 size={14} className="animate-spin" /> Completing…</>
                            ) : (
                                <><CheckCircle2 size={14} /> Complete Visit</>
                            )}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}