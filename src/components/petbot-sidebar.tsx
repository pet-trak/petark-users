'use client';

import { useState, useEffect } from "react";
import { GetUserChatSession } from "@/libs/api/chatbot";
import Spinner from "./ui/spinner";
import { X, Menu } from "lucide-react";

interface ChatSession {
    sessionId: string;
    petName: string;
    messages: { sender: 'user' | 'ai'; text: string; timestamp: string }[];
}

interface PetBotSidebarProps {
    userId: string;
    onSelectSession: (session: ChatSession) => void;
}

export default function PetBotSidebar({ userId, onSelectSession }: Readonly<PetBotSidebarProps>) {
    const [sessions, setSessions] = useState<ChatSession[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [open, setOpen] = useState(true); // toggle state

    const fetchSessions = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await GetUserChatSession(userId);
            setSessions(data.data);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Failed to fetch sessions");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (userId) fetchSessions();
    }, [userId]);

    const handleSessionClick = (session: ChatSession) => {
        onSelectSession(session);

        // Auto-close on mobile
        if (window.innerWidth < 768) {
            setOpen(false);
        }
    };

    return (
        <div className="relative">
            {/* Toggle button */}
            <button
                className="absolute top-4 left-4 z-20 bg-(--acc-clr) text-white p-2 rounded-md hover:bg-(--acc-clr)/80 transition md:hidden"
                onClick={() => setOpen(!open)}
            >
                {open ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* Sidebar */}
            <aside
                className={`
                    fixed md:relative top-0 left-0 z-10 h-full w-64 border-r border-gray-200 p-4 overflow-y-auto bg-gray-50
                    transform transition-transform duration-300 ease-in-out
                    ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0
                `}
            >
                <h2 className="text-lg font-bold mb-4 pry-ff text-(--acc-clr)">Your Chat Sessions</h2>
                {loading && <Spinner />}
                {error && <p className="text-red-500">{error}</p>}
                <ul className="space-y-2">
                    {sessions.map((session) => (
                        <li
                            key={session.sessionId}
                            className="cursor-pointer p-2 rounded hover:bg-gray-200"
                            onClick={() => handleSessionClick(session)}
                        >
                            {session.petName} - {session.messages.length} message{session.messages.length !== 1 ? "s" : ""}
                        </li>
                    ))}
                    {sessions.length === 0 && !loading && <p className="text-gray-500">No sessions yet</p>}
                </ul>
            </aside>
        </div>
    );
}