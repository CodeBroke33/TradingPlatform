'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import InputField from '@/components/forms/InputField';
import FooterLink from '@/components/forms/FooterLink';
import OpenDevSocietyBranding from '@/components/OpenDevSocietyBranding';

type ForgotPasswordFormData = {
    email: string;
};

export default function ForgotPasswordPage() {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ForgotPasswordFormData>({
        defaultValues: { email: '' },
        mode: 'onBlur',
    });

    const onSubmit = async (data: ForgotPasswordFormData) => {
        try {
            const res = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await res.json().catch(() => null);

            if (res.ok && result?.success) {
                toast.success(
                    'If an account exists for that email, a reset link has been sent.'
                );
            } else {
                toast.error(
                    result?.error || 'Password reset unavailable'
                );
            }
        } catch {
            toast.error('Password reset unavailable');
        }
    };

    return (
        <>
            <h1 className="form-title">Forgot your password?</h1>

            <p className="text-sm text-gray-400 mb-6">
                Enter your email address and we’ll send you a password reset link.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <InputField
                    name="email"
                    label="Email"
                    placeholder="you@example.com"
                    register={register}
                    error={errors.email}
                    validation={{
                        required: 'Email is required',
                        pattern: {
                            value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/,
                            message: 'Please enter a valid email address',
                        },
                    }}
                />

                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="yellow-btn w-full mt-5"
                >
                    {isSubmitting ? 'Sending reset link...' : 'Send reset link'}
                </Button>

                <FooterLink
                    text="Remembered it?"
                    linkText="Sign in"
                    href="/sign-in"
                />

                <OpenDevSocietyBranding outerClassName="mt-10 flex justify-center" />
            </form>
        </>
    );
}