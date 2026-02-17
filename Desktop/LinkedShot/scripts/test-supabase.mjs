
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials');
    console.log('URL:', supabaseUrl);
    console.log('Key:', supabaseKey);
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
    console.log('Testing connection to:', supabaseUrl);
    // Try to list buckets
    // Note: listing buckets requires specific permissions, but it's a good test.
    // We can also just select from the 'jobs' table if it exists
    const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();

    if (bucketError) {
        console.error('Bucket listing failed:', bucketError.message);
    } else {
        console.log('Connection success! Buckets found:', buckets.length);
        buckets.forEach(b => console.log(`- ${b.name} (${b.id})`));
    }

    // Also verify jobs table exists
    const { count, error: tableError } = await supabase
        .from('jobs')
        .select('*', { count: 'exact', head: true });

    if (tableError) {
        console.error('Jobs table check failed:', tableError.message);
    } else {
        console.log('Jobs table accessible. Row count:', count);
    }
}

testConnection();
