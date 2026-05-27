// 'use client';

// import { useState, useEffect } from "react";
// import { Clinic } from "@/libs/api/nearbyClinic";
// import { Search } from "lucide-react";

// interface FilterClinicProps {
//     clinics: Clinic[];
//     setFilteredClinics: React.Dispatch<React.SetStateAction<Clinic[]>>;
// }

// export default function FilterClinic({ clinics, setFilteredClinics }: FilterClinicProps) {
//     const [query, setQuery] = useState<string>("");

//     useEffect(() => {
//         if (!query) {
//             setFilteredClinics(clinics);
//             return;
//         }

//         const lowerQuery = query.toLowerCase();

//         const filtered = clinics.filter((clinic) => {
//             const nameMatch = clinic.clinicName.toLowerCase().includes(lowerQuery);
//             const serviceMatch = clinic.servicesProvided?.some((s) => s.toLowerCase().includes(lowerQuery));
//             const addressString = typeof clinic.address === "string"
//                 ? clinic.address.toLowerCase()
//                 : JSON.stringify(clinic.address).toLowerCase();
//             const addressMatch = addressString.includes(lowerQuery);

//             return nameMatch || serviceMatch || addressMatch;
//         });

//         setFilteredClinics(filtered);
//     }, [query, clinics]);

//     return (
//         <div className="relative w-full">
//             <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
//             <input
//                 type="text"
//                 placeholder="Search clinic or vet name..."
//                 value={query}
//                 onChange={(e) => setQuery(e.target.value)}
//                 className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-(--acc-clr)/30 focus:border-(--acc-clr) transition-all duration-150 sec-ff"
//             />
//         </div>
//     );
// }