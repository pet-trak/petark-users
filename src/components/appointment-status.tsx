// // src/components/AppointmentStatusButtons.tsx
// 'use client';
// import { useState } from 'react';
// import { Appointment, AppointmentStatus, updateAppointmentStatus } from '@/libs/api/appointment';

// type Props = {
//     appointment: Appointment;
//     onUpdate?: (updated: Appointment) => void; // optional callback
// };

// export default function AppointmentStatusButtons({ appointment, onUpdate }: Props) {
//     const [loading, setLoading] = useState(false);

//     const handleUpdate = async (status: AppointmentStatus) => {
//         setLoading(true);
//         try {
//             const updated = await updateAppointmentStatus(appointment._id, status);
//             if (onUpdate) onUpdate(updated);
//         } catch (err: any) {
//             console.error(err);
//             alert(err.response?.data?.message || err.message);
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Determine allowed buttons based on current status
//     const allowedButtons: { label: string; status: AppointmentStatus }[] = [];
//     if (appointment.status === 'pending') {
//         allowedButtons.push({ label: 'Confirm', status: 'confirmed' });
//         allowedButtons.push({ label: 'Cancel', status: 'cancelled' });
//     } else if (appointment.status === 'confirmed') {
//         allowedButtons.push({ label: 'Complete', status: 'completed' });
//         allowedButtons.push({ label: 'Cancel', status: 'cancelled' });
//     }

//     return (
//         <div className="flex gap-2">
//             {allowedButtons.map((btn) => (
//                 <button
//                     key={btn.status}
//                     onClick={() => handleUpdate(btn.status)}
//                     disabled={loading}
//                     className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
//                 >
//                     {btn.label}
//                 </button>
//             ))}
//         </div>
//     );
// }
