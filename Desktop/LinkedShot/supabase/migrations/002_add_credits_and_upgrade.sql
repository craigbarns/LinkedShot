
-- Add columns for Credit System and Upgrades
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS credits_total INTEGER DEFAULT 40;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS credits_used INTEGER DEFAULT 0;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS high_fidelity BOOLEAN DEFAULT FALSE;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS upgrade_paid_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS plan TEXT DEFAULT 'starter';

-- Simple Event Tracking (Optional but requested for monitoring)
CREATE TABLE IF NOT EXISTS job_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID REFERENCES jobs(id),
    event_type TEXT NOT NULL, -- 'paid', 'upload_completed', 'training_completed', 'generation', 'upgrade'
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
