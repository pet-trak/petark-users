// src/components/clinic/patient-directory.tsx
// all patients, showing their pets, and a button or link to view medical records (visits)

'use client';

import { useEffect, useState } from 'react';
import { Search, SlidersHorizontal, ExternalLink, PawPrint, ChevronLeft, ChevronRight } from 'lucide-react';

type Patient = {
    _id: string;
    petName: string;
    ownerName: string;
    breed: string;
    species: string;
    lastVisitDate: string | null;
    primaryDiagnosis: string | null;
    photo?: string;
};

const DIAGNOSIS_COLORS: Record<string, string> = {
    'Annual Checkup': 'bg-emerald-50 text-emerald-700',
    'Dental Cleaning': 'bg-yellow-50 text-yellow-700',
    'Ear Infection': 'bg-red-50 text-red-600',
    'Vaccination': 'bg-blue-50 text-blue-700',
    'Flea Treatment': 'bg-orange-50 text-orange-700',
};

function diagnosisPill(label: string | null) {
    if (!label) return null;
    const cls = DIAGNOSIS_COLORS[label] ?? 'bg-gray-100 text-gray-600';
    return (
        <span className={`inline-block rounded-full px-3 py-0.5 text-xs font-semibold ${cls}`}>
            {label}
        </span>
    );
}

const PAGE_SIZE = 5;

// ─── mock data — replace with real API ───────────────────────────────────────
const MOCK: Patient[] = [
    { _id: '1', petName: 'Maximus', ownerName: 'John Doe', breed: 'Golden Retriever', species: 'dog', lastVisitDate: '2023-10-24', primaryDiagnosis: 'Annual Checkup' },
    { _id: '2', petName: 'Luna', ownerName: 'Sarah Miller', breed: 'Siamese Cat', species: 'cat', lastVisitDate: '2023-11-02', primaryDiagnosis: 'Dental Cleaning' },
    { _id: '3', petName: 'Cooper', ownerName: 'Mike Ross', breed: 'Beagle', species: 'dog', lastVisitDate: '2023-10-15', primaryDiagnosis: 'Ear Infection' },
    { _id: '4', petName: 'Bella', ownerName: 'Emily Chen', breed: 'French Bulldog', species: 'dog', lastVisitDate: '2023-11-08', primaryDiagnosis: 'Vaccination' },
    { _id: '5', petName: 'Oliver', ownerName: 'James Wilson', breed: 'Maine Coon', species: 'cat', lastVisitDate: '2023-10-29', primaryDiagnosis: 'Flea Treatment' },
    { _id: '6', petName: 'Daisy', ownerName: 'Anna Brown', breed: 'Poodle', species: 'dog', lastVisitDate: '2023-09-18', primaryDiagnosis: 'Annual Checkup' },
    { _id: '7', petName: 'Milo', ownerName: 'Tom White', breed: 'Labrador', species: 'dog', lastVisitDate: '2023-08-30', primaryDiagnosis: 'Vaccination' },
];
// ─────────────────────────────────────────────────────────────────────────────

export default function PatientDirectory() {
    const [patients, setPatients] = useState<Patient[]>([]);
    const [search, setSearch] = useState('');
    const [breedFilter, setBreedFilter] = useState('All Breeds');
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        // Replace with real fetch:
        // fetch(`/api/patients?page=${page}&search=${search}&breed=${breedFilter}`)
        let filtered = MOCK;
        if (search) {
            const q = search.toLowerCase();
            filtered = filtered.filter(
                p =>
                    p.petName.toLowerCase().includes(q) ||
                    p.ownerName.toLowerCase().includes(q) ||
                    (p.primaryDiagnosis ?? '').toLowerCase().includes(q)
            );
        }
        if (breedFilter !== 'All Breeds') {
            filtered = filtered.filter(p => p.breed === breedFilter);
        }
        setTotal(filtered.length);
        setPatients(filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE));
    }, [search, breedFilter, page]);

    const totalPages = Math.ceil(total / PAGE_SIZE);
    const breeds = ['All Breeds', ...Array.from(new Set(MOCK.map(p => p.breed)))];

    return (
        <div className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="px-6 py-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-lg font-extrabold text-gray-900 pry-ff">Patient Directory</h2>
                    <p className="text-xs text-gray-400 mt-0.5">
                        Comprehensive list of all registered animals and medical history
                    </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                    {/* Breed filter */}
                    <div className="relative">
                        <SlidersHorizontal className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                        <select
                            value={breedFilter}
                            onChange={e => { setBreedFilter(e.target.value); setPage(1); }}
                            className="pl-8 pr-3 py-2 rounded-xl border border-gray-200 bg-gray-50 text-xs font-semibold text-gray-600 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 appearance-none cursor-pointer transition-all"
                        >
                            {breeds.map(b => <option key={b}>{b}</option>)}
                        </select>
                    </div>

                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by name, owner, or diagnosis..."
                            value={search}
                            onChange={e => { setSearch(e.target.value); setPage(1); }}
                            className="pl-9 pr-4 py-2 rounded-xl border border-gray-200 bg-gray-50 text-xs font-medium text-gray-700 placeholder:text-gray-300 focus:outline-none focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100 transition-all w-64"
                        />
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-100 bg-gray-50/60">
                            {['Pet Name', 'Breed / Species', 'Last Visit Date', 'Primary Diagnosis', 'Actions'].map(h => (
                                <th key={h} className="px-6 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400">
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {patients.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-sm text-gray-400">
                                    No patients found
                                </td>
                            </tr>
                        ) : patients.map(p => (
                            <tr key={p._id} className="hover:bg-gray-50/60 transition-colors">
                                {/* Pet Name */}
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
                                            {p.photo ? (
                                                <img src={p.photo} alt={p.petName} className="w-full h-full object-cover rounded-xl" />
                                            ) : (
                                                <PawPrint className="w-4 h-4 text-emerald-500" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-900">{p.petName}</p>
                                            <p className="text-xs text-gray-400">Owner: {p.ownerName}</p>
                                        </div>
                                    </div>
                                </td>

                                {/* Breed / Species */}
                                <td className="px-6 py-4 text-sm text-gray-600">{p.breed}</td>

                                {/* Last Visit */}
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    {p.lastVisitDate
                                        ? new Date(p.lastVisitDate).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
                                        : '—'}
                                </td>

                                {/* Diagnosis */}
                                <td className="px-6 py-4">
                                    {diagnosisPill(p.primaryDiagnosis)}
                                </td>

                                {/* Actions */}
                                <td className="px-6 py-4">
                                    <button className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-colors">
                                        View Full Record
                                        <ExternalLink className="w-3.5 h-3.5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                <p className="text-xs text-gray-400">
                    Showing {Math.min((page - 1) * PAGE_SIZE + 1, total)} to {Math.min(page * PAGE_SIZE, total)} of {total.toLocaleString()} entries
                </p>

                <div className="flex items-center gap-1">
                    <button
                        disabled={page === 1}
                        onClick={() => setPage(p => p - 1)}
                        className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    >
                        <ChevronLeft className="w-3.5 h-3.5 text-gray-500" />
                    </button>

                    {Array.from({ length: Math.min(totalPages, 3) }, (_, i) => i + 1).map(n => (
                        <button
                            key={n}
                            onClick={() => setPage(n)}
                            className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${page === n
                                    ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-200'
                                    : 'border border-gray-200 text-gray-500 hover:bg-gray-50'
                                }`}
                        >
                            {n}
                        </button>
                    ))}

                    {totalPages > 3 && (
                        <>
                            <span className="text-xs text-gray-400 px-1">...</span>
                            <button
                                onClick={() => setPage(totalPages)}
                                className={`w-7 h-7 rounded-lg text-xs font-bold border border-gray-200 text-gray-500 hover:bg-gray-50 transition-all`}
                            >
                                {totalPages}
                            </button>
                        </>
                    )}

                    <button
                        disabled={page === totalPages}
                        onClick={() => setPage(p => p + 1)}
                        className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    >
                        <ChevronRight className="w-3.5 h-3.5 text-gray-500" />
                    </button>
                </div>
            </div>
        </div>
    );
}