import { Wallet, UserCircle, ChevronRight, LucideIcon, Users } from "lucide-react";
import Link from "next/link";

type Action = {
    link: string;
    label: string;
    description: string;
    icon: LucideIcon;
    accent?: string;
};

const actions: Action[] = [
    {
        link: "/clinic/dashboard/settings",
        label: "Account Settings",
        description: "Manage your profile & security",
        icon: UserCircle,
    },
    {
        link: "/clinic/dashboard/account",
        label: "My Account",
        description: "Billing, payouts & wallet",
        icon: Wallet,
    },
    {
        link: "/clinic/dashboard/patients",
        label: "My Patients",
        description: "View and manage your patients",
        icon: Users,
    },
];

export default function SettingsAction() {
    return (
        <section className="px-4 mt-2 w-full">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">
                Actions
            </p>

            <div className="space-y-2">
                {actions.map(({ label, description, icon: Icon, link }) => (
                    <Link
                        href={link}
                        key={label}
                        className="bg-white rounded-2xl border border-slate-100 shadow-sm px-4 py-3.5 flex items-center justify-between hover:bg-slate-50/80 transition-colors group"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-[var(--acc-clr)] flex items-center justify-center shadow-sm flex-shrink-0">
                                <Icon className="w-4 h-4 text-white" />
                            </div>
                            <div>
                                <p className="text-[13px] font-semibold text-slate-800">{label}</p>
                                <p className="text-[11px] text-slate-400">{description}</p>
                            </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-400 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                    </Link>
                ))}
            </div>
        </section>
    );
}