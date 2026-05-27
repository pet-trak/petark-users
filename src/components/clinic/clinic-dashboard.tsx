// ClinicDashboard.tsx
import GetAppointmentPage from "@/app/clinic/dashboard/appointments/get-appointment";
import AppointmentCounts from "./appointment-counts";
import GetVisits from "./get-visits";

export default function ClinicDashboard() {
    return (
        <main className="flex flex-col gap-4 sm:gap-6 px-3 sm:px-4 md:px-6 py-4 sm:py-6 min-h-screen bg-gray-50">

            {/* Stats Row */}
            <section>
                <AppointmentCounts />
            </section>

            {/* Main Content */}
            <section className="flex flex-col lg:flex-row gap-4 sm:gap-6 items-start">

                {/* Appointments panel — full width, grows on lg+ */}
                <div className="w-full flex-1 min-w-0">
                    <GetAppointmentPage />
                </div>

                {/* Visits sidebar — full width on mobile, fixed on lg+ */}
                <div className="w-full lg:w-80 xl:w-96 flex-shrink-0">
                    <GetVisits />
                </div>

            </section>
        </main>
    );
}