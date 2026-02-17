
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Admin client for backend operations (webhooks, etc.)
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
export const supabaseAdmin = serviceRoleKey
    ? createClient(supabaseUrl, serviceRoleKey)
    : null;

// Helper function definitions
export type JobStatus = 'pending' | 'paid' | 'uploading' | 'training' | 'generating' | 'completed' | 'failed';

export async function createJob() {
    const { data, error } = await supabase
        .from('jobs')
        .insert([{ status: 'pending' }]) // Minimal start
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function updateJobStatus(id: string, status: JobStatus, extraData: any = {}) {
    const { error } = await supabase
        .from('jobs')
        .update({ status, updated_at: new Date().toISOString(), ...extraData })
        .eq('id', id);

    if (error) throw error;
}

export async function uploadTrainingZip(jobId: string, zipBlob: Blob) {
    const fileName = `${jobId}/training_data.zip`;

    const { error } = await supabase.storage
        .from('training-images')
        .upload(fileName, zipBlob, {
            contentType: 'application/zip',
            upsert: true
        });

    if (error) throw error;

    // Return a SIGNED URL for Fal (valid for 1 hour)
    const { data, error: signedError } = await supabase.storage
        .from('training-images')
        .createSignedUrl(fileName, 3600); // 1 hour validity

    if (signedError) throw signedError;

    console.log('Generated Signed URL:', data.signedUrl);
    return data.signedUrl;
}

export async function uploadTrainingImage(jobId: string, file: File) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${jobId}/${Math.random().toString(36).substring(7)}.${fileExt}`;

    const { error } = await supabase.storage
        .from('training-images')
        .upload(fileName, file);

    if (error) throw error;
    return fileName;
}
