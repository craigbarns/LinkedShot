
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Admin Client
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    }
);

export async function GET() {
    try {
        const results = {
            projectUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'OK' : 'MISSING',
            serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'OK' : 'MISSING',
            buckets: [] as string[],
            tables: [] as string[]
        };

        // 1. Check/Create Bucket 'training-images'
        const { data: buckets, error: bucketError } = await supabaseAdmin.storage.listBuckets();
        if (bucketError) throw new Error(`Bucket listing failed: ${bucketError.message}`);

        const trainingBucketValues = buckets.map(b => b.name);
        results.buckets = trainingBucketValues;

        if (!trainingBucketValues.includes('training-images')) {
            const { error: createError } = await supabaseAdmin.storage.createBucket('training-images', {
                public: false,
                fileSizeLimit: 52428800, // 50MB
                allowedMimeTypes: ['application/zip', 'image/jpeg', 'image/png']
            });
            if (createError) throw new Error(`Failed to create bucket: ${createError.message}`);
            results.buckets.push('training-images (CREATED)');
        } else {
            results.buckets.push('training-images (EXISTS)');
        }

        // 2. Check Table 'jobs'
        // We can't really "check" table schema easily via API without SQL editor, but we can try a select
        const { error: tableError } = await supabaseAdmin.from('jobs').select('count', { count: 'exact', head: true });

        if (tableError) {
            results.tables.push(`Error accessing 'jobs': ${tableError.message}`);
        } else {
            results.tables.push(`Table 'jobs' is accessible.`);
        }

        return NextResponse.json({ success: true, ...results });

    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
