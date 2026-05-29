import { NextResponse } from 'next/server';
import { auth } from '@/lib/better-auth/auth';

export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json(
                { success: false, error: 'Email is required' },
                { status: 400 }
            );
        }

        await auth.api.requestPasswordReset({
            body: {
                email,
                redirectTo: `${process.env.BETTER_AUTH_URL || 'http://localhost:3000'}/reset-password`,
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Forgot password error:', error);

        return NextResponse.json(
            { success: false, error: 'Unable to send reset email' },
            { status: 500 }
        );
    }
}