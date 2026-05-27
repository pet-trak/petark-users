// src/components/create-visit.tsx

'use client';

import { useState, useMemo } from 'react';
import { toast } from 'sonner';
import { createVisit } from '@/libs/api/clinic-visit';
import { CheckCircle2, Plus, Loader2 } from 'lucide-react';

type Props = {
    appointmentId: string;
    petId: string;
};

const vitalFields = [
    { key: 'weight', label: 'Weight', unit: 'kg', placeholder: '0.0' },
    { key: 'temp', label: 'Temperature', unit: '°C', placeholder: '0.0' },
    { key: 'pulse', label: 'Pulse', unit: 'bpm', placeholder: '0' },
    { key: 'respiration', label: 'Respiration', unit: 'breaths/min', placeholder: '0' },
] as const;

export default function CreateVisit({ appointmentId, petId }: Props) {
    const [loading, setLoading] = useState(false);
    const [notes, setNotes] = useState('');

    const [vitals, setVitals] = useState({
        weight: '',
        temp: '',
        pulse: '',
        respiration: '',
        appetite: '',
        activity: '',
    });

    /**
     * ✅ Required validation (apart from vitals)
     */
    const isFormValid = useMemo(() => {
        return (
            vitals.appetite.trim() !== '' &&
            vitals.activity.trim() !== '' &&
            notes.trim() !== ''
        );
    }, [vitals.appetite, vitals.activity, notes]);

    const handleCreateVisit = async () => {
        if (!isFormValid) {
            toast.error('Appetite, activity, and visit notes are required');
            return;
        }

        try {
            setLoading(true);

            const data = await createVisit({
                appointmentId,
                petId,
                vitals: {
                    weight: Number(vitals.weight) || 0,
                    temp: Number(vitals.temp) || 0,
                    pulse: Number(vitals.pulse) || 0,
                    respiration: Number(vitals.respiration) || 0,
                    appetite: vitals.appetite.trim(),
                    activity: vitals.activity.trim(),
                },
                notes: notes.trim(),
            });

            toast.success('Visit created successfully');
            console.log('Visit ID:', data._id);

            setNotes('');
            setVitals({
                weight: '',
                temp: '',
                pulse: '',
                respiration: '',
                appetite: '',
                activity: '',
            });
        } catch (err: any) {
            toast.error(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="rounded-2xl bg-white border border-slate-100 shadow-sm overflow-hidden pry-ff">
            {/* Header */}
            <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/60 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center shadow-sm shadow-emerald-200">
                    <CheckCircle2 size={16} className="text-white" />
                </div>
                <div>
                    <h3 className="text-sm font-bold text-slate-800 leading-none">
                        Create Visit
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                        Record vitals and clinical notes
                    </p>
                </div>
            </div>

            <div className="p-6 space-y-6">
                {/* Vitals (NOT required) */}
                <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                        Vitals
                    </p>

                    <div className="grid grid-cols-2 gap-3">
                        {vitalFields.map(({ key, label, unit, placeholder }) => (
                            <div key={key}>
                                <label className="block text-[11px] font-semibold text-slate-500 mb-1.5">
                                    {label}
                                    <span className="ml-1 font-normal text-slate-400">
                                        {unit}
                                    </span>
                                </label>

                                <input
                                    type="number"
                                    placeholder={placeholder}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100 transition-all"
                                    value={vitals[key]}
                                    onChange={(e) =>
                                        setVitals({ ...vitals, [key]: e.target.value })
                                    }
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Assessment (REQUIRED) */}
                <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                        Assessment <span className="text-red-400">*</span>
                    </p>

                    {/* Appetite */}
                    <div className="mb-3">
                        <label className="block text-[11px] font-semibold text-slate-500 mb-1.5">
                            Appetite <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="text"
                            required
                            placeholder="e.g. normal, decreased"
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100 transition-all"
                            value={vitals.appetite}
                            onChange={(e) =>
                                setVitals({ ...vitals, appetite: e.target.value })
                            }
                        />
                    </div>

                    {/* Activity */}
                    <div>
                        <label className="block text-[11px] font-semibold text-slate-500 mb-1.5">
                            Activity Level <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="text"
                            required
                            placeholder="e.g. active, lethargic"
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100 transition-all"
                            value={vitals.activity}
                            onChange={(e) =>
                                setVitals({ ...vitals, activity: e.target.value })
                            }
                        />
                    </div>
                </div>

                {/* Notes (REQUIRED) */}
                <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                        Visit Notes <span className="text-red-400">*</span>
                    </p>

                    <textarea
                        rows={4}
                        required
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Add clinical observations, symptoms, or treatment plan..."
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100 transition-all resize-none"
                    />
                </div>

                {/* Submit */}
                <button
                    disabled={loading || !isFormValid}
                    onClick={handleCreateVisit}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm shadow-emerald-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
                >
                    {loading ? (
                        <>
                            <Loader2 size={14} className="animate-spin" />
                            Creating Visit…
                        </>
                    ) : (
                        <>
                            <Plus size={14} />
                            Start Visit
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}