
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
    console.error('Missing Supabase Service Key');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey);

async function setupStorage() {
    console.log('Setting up storage...');

    // 1. Create Bucket if not exists
    const { data: bucket, error } = await supabase.storage.createBucket('training-images', {
        public: true,
        fileSizeLimit: 10485760, // 10MB
        allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp']
    });

    if (error) {
        if (error.message.includes('already exists')) {
            console.log('✅ Bucket "training-images" already exists.');
        } else {
            console.error('❌ Failed to create bucket:', error.message);
        }
    } else {
        console.log('✅ Bucket "training-images" created.');
    }

    // 2. Verify Jobs Table
    const { error: tableError } = await supabase.from('jobs').select('id').limit(1);
    if (tableError) {
        console.error('❌ Jobs table error:', tableError.message);
        // If table doesn't exist, we can't create it via client usually, user has to run SQL in dashboard.
        // But we gave them schema.sql.
    } else {
        console.log('✅ Jobs table is accessible.');
    }
}

setupStorage();
