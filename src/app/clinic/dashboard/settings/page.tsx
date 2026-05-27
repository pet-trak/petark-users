import SettingsAction from "@/components/clinic/settings-action";
import SettingsPreference from "@/components/clinic/settings-preference";

export default function SettingsPage() {
    return (
        <main className="flex flex-col items-start justify-start w-full pry-ff bg-white">
            <SettingsAction />
            <SettingsPreference />
        </main>
    )
}