
import { startFalTraining } from '@/lib/fal';

// Use this file as a template for new API routes
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    // Basic structure for new API routes
    try {
        const body = await req.json();
        // logic here
        return NextResponse.json({ success: true });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
