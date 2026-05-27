import axios, { AxiosError } from 'axios';

interface ChatResponse {
    status: string;
    data: {
        sessionId: string;
        userMessage: string;
        aiResponse: string;
        followUpQuestions: string[];
    };
}

export async function ChatWithPetBot(
    message: string,
    userId: string,
    petId: string,
    sessionId?: string
) {
    try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found');

        const url = `${process.env.NEXT_PUBLIC_API_URL}/chat/${userId}/${petId}/chat${sessionId ? `?sessionId=${sessionId}` : ''
            }`;

        const response = await axios.post<ChatResponse>(
            url,
            { message },
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );

        return response.data.data; // return the inner `data` object directly
    } catch (error: unknown) {
        let errMsg = 'Something went wrong';
        if (error instanceof AxiosError) {
            errMsg = error.response?.data?.message ?? error.message ?? errMsg;
        }
        throw new Error(errMsg);
    }
}

export async function GetUserChatSession(userId: string) {
    try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found');
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/chat/user/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        return response.data;
    } catch (error: unknown) {
        let message = 'Failed to save chat';
        if (error instanceof AxiosError) {
            message =
                error.response?.data?.message ??
                error.message ??
                message;
        }
        throw new Error(message);
    }
}