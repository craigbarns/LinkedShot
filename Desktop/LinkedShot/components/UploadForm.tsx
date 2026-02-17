'use client';

import { useState, useCallback, useEffect, type ChangeEvent, type DragEvent } from 'react';
import Image from 'next/image';
import { createJob, uploadTrainingZip } from '@/lib/supabase';
import JSZip from 'jszip';

interface UploadFormProps {
    jobId?: string; // Optional: If provided, uploads to this job. If not, creates a new one (dev/test mode).
}

export default function UploadForm({ jobId }: UploadFormProps) {
    const [files, setFiles] = useState<File[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState<string>('');

    const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const newFiles = Array.from(e.dataTransfer.files).filter((file: File) => file.type.startsWith('image/'));
            setFiles(prev => [...prev, ...newFiles].slice(0, 15)); // Max 15
        }
    }, []);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const newFiles = Array.from(e.target.files).filter((file: File) => file.type.startsWith('image/'));
            setFiles(prev => [...prev, ...newFiles].slice(0, 15));
        }
    };

    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    // Auto-Setup Check (Dev/First Run)
    useEffect(() => {
        fetch('/api/setup')
            .then(res => res.json())
            .then(data => {
                if (!data.success) console.warn('Supabase Setup Warning:', data);
                else console.log('Supabase Setup OK:', data);
            })
            .catch(err => console.error('Setup check failed', err));
    }, []);

    // Helper to resize image
    const resizeImage = (file: File): Promise<Blob> => {
        return new Promise((resolve, reject) => {
            const img = document.createElement('img');
            img.src = URL.createObjectURL(file);
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    reject(new Error('Canvas context failed'));
                    return;
                }

                // Max dimension 1500px
                const MAX_SIZE = 1500;
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > MAX_SIZE) {
                        height *= MAX_SIZE / width;
                        width = MAX_SIZE;
                    }
                } else {
                    if (height > MAX_SIZE) {
                        width *= MAX_SIZE / height;
                        height = MAX_SIZE;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                ctx.drawImage(img, 0, 0, width, height);

                canvas.toBlob((blob) => {
                    if (blob) resolve(blob);
                    else reject(new Error('Compression failed'));
                }, 'image/jpeg', 0.8); // 80% quality JPEG
            };
            img.onerror = (err) => reject(err);
        });
    };

    const handleUpload = async () => {
        if (files.length < 6) {
            alert('Please upload at least 6 photos for best results.');
            return;
        }

        setIsUploading(true);
        setUploadStatus('Initializing...');

        try {
            // 1. Use provided Job ID or Create a new one
            let finalJobId = jobId;

            if (!finalJobId) {
                const job = await createJob();
                if (!job) throw new Error('Failed to create job');
                finalJobId = job.id;
                console.log('Job created (client-side):', finalJobId);
            } else {
                console.log('Using existing Job:', finalJobId);
            }

            // 2. Resize and Zip Images
            setUploadStatus('Optimizing images (this may take a moment)...');
            const zip = new JSZip();

            // Process files in parallel
            const processedFiles = await Promise.all(files.map(async (file) => {
                setUploadStatus(`Compressing ${file.name}...`);
                const blob = await resizeImage(file);
                // Rename to jpg for consistency
                const newName = file.name.replace(/\.[^/.]+$/, "") + ".jpg";
                return { name: newName, blob };
            }));

            processedFiles.forEach(({ name, blob }) => {
                zip.file(name, blob);
            });

            setUploadStatus('Creating zip archive...');
            const zipBlob = await zip.generateAsync({ type: 'blob' });

            // Check zip size
            if (zipBlob.size > 50 * 1024 * 1024) {
                throw new Error(`Archive size (${(zipBlob.size / 1024 / 1024).toFixed(1)}MB) exceeds 50MB limit. Please recreate job with fewer photos.`);
            }

            // 3. Upload Zip
            setUploadStatus('Uploading training data...');
            const zipUrl = await uploadTrainingZip(finalJobId as string, zipBlob);
            console.log('Zip uploaded:', zipUrl);

            setUploadStatus('Archive uploaded! Starting AI training...');

            // 4. Trigger Training
            try {
                const trainRes = await fetch('/api/jobs/train', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ jobId: finalJobId, zipUrl: zipUrl })
                });

                if (!trainRes.ok) {
                    const errorText = await trainRes.text();
                    console.error('Server Error Status:', trainRes.status, trainRes.statusText);
                    console.error('Server Response Body:', errorText);

                    let errorMessage = `Server error: ${trainRes.status} ${trainRes.statusText}`;
                    try {
                        const json = JSON.parse(errorText);
                        if (json.error) errorMessage = json.error;
                    } catch (e) {
                        // Not JSON, use text
                        if (errorText) errorMessage = errorText;
                    }
                    throw new Error(errorMessage);
                }

                setUploadStatus('Training Started! Redirecting...');
                setTimeout(() => {
                    const params = new URLSearchParams();
                    if (jobId) params.set('jobId', jobId);
                    else if (finalJobId) params.set('jobId', finalJobId);

                    window.location.href = `/status?${params.toString()}`;
                }, 1500);

            } catch (err: any) {
                console.error('Training trigger failed:', err);
                setUploadStatus(`Upload done, but training failed to start: ${err.message}`);
                setIsUploading(false);
            }

        } catch (error: any) {
            console.error('Upload failed details:', JSON.stringify(error, null, 2));
            console.error('Upload failed object:', error);
            setUploadStatus(`Error: ${error.message || JSON.stringify(error)}`);
            setIsUploading(false);
        }
    };

    return (
        <section className="glass-panel" style={{ padding: '2rem', maxWidth: '800px', margin: '3rem auto' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '1rem' }} className="gradient-text text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-600">
                Start Your AI Headshot
            </h2>
            <div className="bg-blue-900/10 border border-blue-500/20 rounded-2xl p-6 mb-8 text-left">
                <h3 className="text-xl font-bold text-blue-300 mb-6 flex items-center gap-3 border-b border-blue-500/20 pb-4">
                    <span>📚</span> Guide for Perfect Likeness
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm text-gray-300">
                    <div className="space-y-2">
                        <h4 className="font-bold text-white flex items-center gap-2"><span className="text-blue-400">1.</span> Quantity: 15–20 Photos</h4>
                        <p className="opacity-80 text-xs leading-relaxed">The sweet spot. Less than 10 risks poor resemblance. More than 30 wastes training time.</p>
                    </div>

                    <div className="space-y-2">
                        <h4 className="font-bold text-white flex items-center gap-2"><span className="text-blue-400">2.</span> Angles & Expressions</h4>
                        <p className="opacity-80 text-xs leading-relaxed">Front, 3/4 view, and profile. Look at camera vs away. Smile vs neutral. Variety is key.</p>
                    </div>

                    <div className="space-y-2">
                        <h4 className="font-bold text-white flex items-center gap-2"><span className="text-blue-400">3.</span> Lighting</h4>
                        <p className="opacity-80 text-xs leading-relaxed">Soft, natural window light is best. Avoid harsh shadows, dark rooms, or yellow artificial light.</p>
                    </div>

                    <div className="space-y-2">
                        <h4 className="font-bold text-white flex items-center gap-2"><span className="text-blue-400">4.</span> Distance (Important)</h4>
                        <p className="opacity-80 text-xs leading-relaxed">Stay 1–2 meters away to avoid nose distortion. Use optical zoom, never digital zoom.</p>
                    </div>

                    <div className="space-y-2">
                        <h4 className="font-bold text-white flex items-center gap-2"><span className="text-blue-400">5.</span> Background</h4>
                        <p className="opacity-80 text-xs leading-relaxed">Simple plain wall (white/grey) is best. No distracting objects behind you.</p>
                    </div>

                    <div className="space-y-2">
                        <h4 className="font-bold text-white flex items-center gap-2"><span className="text-blue-400">6.</span> Consistency</h4>
                        <p className="opacity-80 text-xs leading-relaxed">Keep same hairstyle & beard in all shots. Avoid major look changes between photos.</p>
                    </div>

                    <div className="space-y-2">
                        <h4 className="font-bold text-white flex items-center gap-2"><span className="text-blue-400">7.</span> No Accessories</h4>
                        <p className="opacity-80 text-xs leading-relaxed">No sunglasses, hats, masks, or hands on face. Natural makeup only.</p>
                    </div>

                    <div className="space-y-2">
                        <h4 className="font-bold text-white flex items-center gap-2"><span className="text-blue-400">8.</span> Quality</h4>
                        <p className="opacity-80 text-xs leading-relaxed">Use rear camera (better sensor). Ensure sharpness. No motion blur.</p>
                    </div>

                    <div className="space-y-2">
                        <h4 className="font-bold text-white flex items-center gap-2"><span className="text-blue-400">9.</span> No Filters</h4>
                        <p className="opacity-80 text-xs leading-relaxed">No retouching or filters. The AI needs your raw, natural features.</p>
                    </div>
                </div>
            </div>

            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                style={{
                    border: `2px dashed ${isDragging ? 'var(--secondary)' : 'var(--glass-border)'}`,
                    borderRadius: 'var(--radius)',
                    padding: '4rem 2rem',
                    textAlign: 'center',
                    background: isDragging ? 'rgba(236, 72, 153, 0.1)' : 'transparent',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    opacity: isUploading ? 0.5 : 1,
                    pointerEvents: isUploading ? 'none' : 'auto'
                }}
                onClick={() => !isUploading && document.getElementById('file-input')?.click()}
            >
                <input
                    type="file"
                    id="file-input"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                />
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📸</div>
                <p style={{ fontSize: '1.2rem', fontWeight: 600 }}>
                    {isUploading ? 'Uploading...' : 'Drag & Drop or Click to Upload'}
                </p>
                <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)', marginTop: '0.5rem' }}>
                    Supports JPG, PNG (Max 15 photos)
                </p>
            </div>

            {files.length > 0 && (
                <div style={{ marginTop: '2rem' }}>
                    <h3 style={{ marginBottom: '1rem' }}>Selected Photos ({files.length}/10)</h3>
                    <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '1rem' }}>
                        {files.map((file, index) => (
                            <div key={index} style={{ position: 'relative', aspectRatio: '1', borderRadius: '0.5rem', overflow: 'hidden' }}>
                                <Image
                                    src={URL.createObjectURL(file)}
                                    alt={`Upload preview ${index + 1}`}
                                    fill
                                    style={{ objectFit: 'cover' }}
                                />
                                <button
                                    onClick={() => removeFile(index)}
                                    disabled={isUploading}
                                    style={{
                                        position: 'absolute',
                                        top: '4px',
                                        right: '4px',
                                        background: 'rgba(0,0,0,0.5)',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '50%',
                                        width: '24px',
                                        height: '24px',
                                        cursor: 'pointer',
                                        fontSize: '14px',
                                        display: isUploading ? 'none' : 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>

                    <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                        {isUploading && (
                            <p style={{ marginBottom: '1rem', color: 'var(--accent)' }}>{uploadStatus}</p>
                        )}
                        <button
                            className="primary-btn"
                            style={{ fontSize: '1.1rem', padding: '1rem 3rem' }}
                            onClick={handleUpload}
                            disabled={isUploading}
                        >
                            {isUploading ? 'Processing...' : 'Start Training →'}
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
}
