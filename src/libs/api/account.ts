import axios, { AxiosError } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const PAYSTACK_PUBLIC_KEY = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;

// ─── Types ────────────────────────────────────────────────────────────────────

export type Bank = {
    name: string;
    code: string;
    slug: string;
};

export type SubaccountData = {
    subaccount_code: string | null;
    recipient_code: string | null;
    has_subaccount: boolean;
};

export type SubaccountByCodeData = {
    subaccount_code: string;
    recipient_code: string | null;
    clinicName: string;
    account_number: string;
    bank_code: string;
    bank_name?: string;
    settlement_bank?: string;
    percentage_charge: number;
    is_verified: boolean;
};

export type CreateSubaccountPayload = {
    clinicName: string;
    bank_code: string;
    account_number: string;
};

export type CreateSubaccountResponse = {
    subaccount_code: string;
    recipient_code: string;
};

export type ResolvedAccount = {
    account_name: string;
    account_number: string;
};

type ApiErrorResponse = {
    message: string;
    status?: boolean;
};

type PaystackErrorResponse = {
    message: string;
    status: boolean;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getAuthHeader() {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Not authenticated');
    return { Authorization: `Bearer ${token}` };
}

function extractApiError(error: unknown): never {
    if (axios.isAxiosError(error)) {
        const axiosErr = error as AxiosError<ApiErrorResponse>;
        const message = axiosErr.response?.data?.message || axiosErr.message;
        throw new Error(message);
    }
    throw error;
}

function extractPaystackError(error: unknown, fallback: string): never {
    if (axios.isAxiosError(error)) {
        const axiosErr = error as AxiosError<PaystackErrorResponse>;
        const message = axiosErr.response?.data?.message || fallback;
        throw new Error(message);
    }
    throw error;
}

// ─── 1. Create Subaccount ─────────────────────────────────────────────────────
// POST /visit/pay/create-subaccount

export async function createSubaccount(
    payload: CreateSubaccountPayload
): Promise<CreateSubaccountResponse> {
    try {
        const res = await axios.post<{ data: CreateSubaccountResponse }>(
            `${API_URL}/visit/pay/create-subaccount`,
            payload,
            { headers: getAuthHeader() }
        );
        return res.data.data;
    } catch (error) {
        extractApiError(error);
    }
}

// ─── 2. Get Subaccount (current clinic) ──────────────────────────────────────
// GET /visit/pay/subaccount  ← fixed from /visit/pay/subaccount

export async function getSubaccount(): Promise<SubaccountData> {
    try {
        const res = await axios.get<{ data: SubaccountData }>(
            `${API_URL}/visit/pay/subaccount`,
            { headers: getAuthHeader() }
        );
        return res.data.data;
    } catch (error) {
        extractApiError(error);
    }
}

// ─── 3. Get Subaccount by Code ────────────────────────────────────────────────
// GET /visit/pay/subaccount/:subaccount_code

export async function getSubaccountByCode(
    subaccount_code: string
): Promise<SubaccountByCodeData> {
    try {
        const res = await axios.get<{ data: SubaccountByCodeData }>(
            `${API_URL}/visit/pay/subaccount/${subaccount_code}`,
            { headers: getAuthHeader() }
        );
        return res.data.data;
    } catch (error) {
        extractApiError(error);
    }
}

// ─── 4. Get Bank List ─────────────────────────────────────────────────────────
// GET /visit/pay/banks  ← hits your backend, not Paystack directly

export async function getBankList(): Promise<Bank[]> {
    try {
        const res = await axios.get<{ data: Array<{ name: string; code: string; slug: string }> }>(
            `${API_URL}/visit/pay/banks`,
            { headers: getAuthHeader() }
        );
        return res.data.data.map((b): Bank => ({
            name: b.name,
            code: b.code,
            slug: b.slug,
        }));
    } catch (error) {
        extractApiError(error);
    }
}

// ─── 5. Resolve Account Name (Paystack direct) ────────────────────────────────
// Still hits Paystack directly — no backend route for this

export async function resolveAccountName(
    account_number: string,
    bank_code: string
): Promise<ResolvedAccount> {
    try {
        const res = await axios.get<{ data: ResolvedAccount }>(
            `${API_URL}/visit/pay/resolve-account?account_number=${account_number}&bank_code=${bank_code}`,
            { headers: getAuthHeader() }  // ← your backend, not Paystack
        );
        return res.data.data;
    } catch (error) {
        extractApiError(error);
    }
}