
'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import UploadForm from '@/components/UploadForm';
import { supabase } from '@/lib/supabase';

import { Suspense } from 'react';

function UploadContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const session_id = searchParams.get('session_id');
    const redo = searchParams.get('redo') === 'true';
    const existingJobId = searchParams.get('jobId');
    const plan = searchParams.get('plan') || 'starter'; // Default to starter if glitch
    const [jobId, setJobId] = useState<string | null>(null);
    const [verifying, setVerifying] = useState(true);

    useEffect(() => {
        const initJob = async () => {
            // If we have a session_id, we just assume payment is legit (MVP)
            // Ideally we create a job here LINKED TO THIS PLAN.

            try {
                // Create a job with the specific plan metadata
                const { data: job, error } = await supabase
                    .from('jobs')
                    .insert([{
                        status: 'paid', // Initial paid state
                        stripe_session_id: session_id,
                        plan: plan
                    }])
                    .select()
                    .single();

                if (error) {
                    // Maybe job already exists? Or table issue.
                    console.error('Job creation error:', error);
                    // Fallback: create meaningful job without ID if table allows, or fail.
                }

                if (job) {
                    setJobId(job.id);
                } else {
                    // Fallback for dev mode without payment
                    // We let UploadForm create one if needed, but we pass plan prop?
                    // UploadForm currently creates its own job if none passed.
                }
            } catch (err) {
                console.error('Init Job Error:', err);
            } finally {
                setVerifying(false);
            }
        };

        if (session_id) {
            initJob();
        } else if (existingJobId && redo) {
            // REDO FLOW: Just set the Job ID and skip creation
            setJobId(existingJobId);
            setVerifying(false);
        } else {
            // No payment session? Maybe direct access.
            // For now, redirect to home pricing unless in dev
            if (process.env.NODE_ENV === 'production') {
                router.push('/#pricing');
            } else {
                setVerifying(false); // Valid for testing
            }
        }
    }, [session_id, plan, router]);

    if (verifying && session_id && !redo) return (
        <div className="min-h-screen flex items-center justify-center bg-black text-white">
            <div className="animate-pulse">Verifying payment & setting up studio...</div>
        </div>
    );

    return (
        <div className="min-h-screen bg-black text-white pt-20 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold mb-2">
                        {redo ? 'Retrain Your Model 🔄' : 'Upload Your Photos 📸'}
                    </h1>
                    <p className="text-gray-400">
                        {redo ? 'Let\'s try again with a better set of photos. Check the guide below!' :
                            plan === 'pro' ? 'Pro Pack Active: 100 Photos + Editorial Mode Unlocked!' :
                                plan === 'teams' ? 'Teams Pack Active' :
                                    'Starter Pack Active: 40 Photos'}
                    </p>
                </div>

                {/* Pass the created JobID to UploadForm so it uploads to the right place */}
                <UploadForm jobId={jobId || undefined} />
            </div>
        </div>
    );
}

export default function UploadPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-black text-white">Loading...</div>}>
            <UploadContent />
        </Suspense>
    );
}
