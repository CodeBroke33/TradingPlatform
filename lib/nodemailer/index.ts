import nodemailer from 'nodemailer';
import { WELCOME_EMAIL_TEMPLATE, NEWS_SUMMARY_EMAIL_TEMPLATE } from "@/lib/nodemailer/templates";

// ✅ Only create transporter (DO NOT run verify at import time)
export const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PASSWORD,
    },
    pool: true,
    maxConnections: 1,
    maxMessages: 3,
});

// ⚠️ Optional lazy verify (ONLY runs when called manually, not during build)
export const verifyEmailConnection = async () => {
    try {
        await transporter.verify();
        console.log('✅ Nodemailer transporter is ready');
    } catch (error) {
        console.error('❌ Nodemailer verification failed:', error);
    }
};

// -------------------- EMAILS --------------------

export const sendWelcomeEmail = async ({ email, name, intro }: any) => {
    try {
        if (!process.env.NODEMAILER_EMAIL || !process.env.NODEMAILER_PASSWORD) {
            throw new Error('Email credentials not configured');
        }

        const htmlTemplate = WELCOME_EMAIL_TEMPLATE
            .replace('{{name}}', name)
            .replace('{{intro}}', intro);

        return await transporter.sendMail({
            from: `"Openstock" <${process.env.NODEMAILER_EMAIL}>`,
            to: email,
            subject: `Welcome to Openstock`,
            text: 'Thanks for joining Openstock',
            html: htmlTemplate,
        });

    } catch (error) {
        console.error('❌ Failed to send welcome email:', error);
        throw error;
    }
};

export const sendNewsSummaryEmail = async (
    { email, date, newsContent }: { email: string; date: string; newsContent: string }
) => {
    try {
        if (!process.env.NODEMAILER_EMAIL || !process.env.NODEMAILER_PASSWORD) {
            throw new Error('Email credentials not configured');
        }

        const htmlTemplate = NEWS_SUMMARY_EMAIL_TEMPLATE
            .replace('{{date}}', date)
            .replace('{{newsContent}}', newsContent);

        return await transporter.sendMail({
            from: `"Openstock" <${process.env.NODEMAILER_EMAIL}>`,
            to: email,
            subject: `📈 Market News Summary - ${date}`,
            text: `Today's market news summary`,
            html: htmlTemplate,
        });

    } catch (error) {
        console.error('❌ Failed to send news summary email:', error);
        throw error;
    }
};