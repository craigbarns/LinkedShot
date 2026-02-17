
-- 1. Anti-Doublon: Unique Constraint on Provider ID
ALTER TABLE generations 
ADD COLUMN IF NOT EXISTS provider_request_id TEXT UNIQUE, -- Fal request ID
ADD COLUMN IF NOT EXISTS refunded_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS provider_latency_ms INTEGER,
ADD COLUMN IF NOT EXISTS error_code TEXT,
ADD COLUMN IF NOT EXISTS error_type TEXT; -- 'provider', 'user', 'internal'

-- 2. Safe Refund RPC
CREATE OR REPLACE FUNCTION refund_generation_credit(
    p_job_id UUID, 
    p_request_id TEXT, 
    p_error_code TEXT, 
    p_error_type TEXT DEFAULT 'provider'
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_existing_refund TIMESTAMP;
    v_job_exists BOOLEAN;
    updated_credits INTEGER;
BEGIN
    -- Check if Job exists
    SELECT EXISTS(SELECT 1 FROM jobs WHERE id = p_job_id) INTO v_job_exists;
    IF NOT v_job_exists THEN
        RETURN jsonb_build_object('success', false, 'error', 'Job not found');
    END IF;

    -- Check if this specific request was already refunded (idempotency)
    -- We use a dedicated table or check generations if we tracked failed ones there.
    -- For MVP, we'll use a new 'failed_generations' tracking or just trust the generations table if we insert failed rows.
    -- Better: Insert a record into generations with status 'failed' and 'refunded_at' populated.
    
    INSERT INTO generations (job_id, status, provider_request_id, error_code, error_type, refunded_at)
    VALUES (p_job_id, 'failed', p_request_id, p_error_code, p_error_type, NOW())
    ON CONFLICT (provider_request_id) DO NOTHING;
    
    -- If we inserted (or it was already failed/refunded), we need to ensure we don't double refund.
    -- The constraint protects concurrent inserts. Now strict logic:
    
    IF FOUND THEN
        -- Only refund if we just inserted a failure record (first time seeing this failure)
        UPDATE jobs
        SET credits_used = GREATEST(credits_used - 1, 0),
            updated_at = NOW()
        WHERE id = p_job_id
        RETURNING credits_used INTO updated_credits;
        
        RETURN jsonb_build_object('success', true, 'new_credits_used', updated_credits);
    ELSE
        RETURN jsonb_build_object('success', false, 'error', 'Already processed/refunded');
    END IF;
END;
$$;
