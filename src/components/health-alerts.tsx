export default function HealthAlerts() {
    return (
        <div className="rounded-2xl bg-white p-5 space-y-3 sec-ff shadow-sm">
            <h3 className="font-semibold">Health Alerts</h3>

            <div className="border-l-4 border-red-400 bg-red-50 p-3 rounded">
                <p className="font-medium text-sm text-red-700">Vaccination Due</p>
                <p className="text-xs text-red-600">
                    Rabies booster needed by Nov 30
                </p>
            </div>

            <div className="border-l-4 border-blue-400 bg-blue-50 p-3 rounded">
                <p className="font-medium text-sm text-blue-700">Medication Refill</p>
                <p className="text-xs text-blue-600">
                    Flea & tick prevention refill available
                </p>
            </div>
        </div>
    );
}