
-- RPC for Atomic Credit Refund
CREATE OR REPLACE FUNCTION increment_credits_refund(job_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    UPDATE jobs
    SET credits_used = GREATEST(credits_used - 1, 0),
        updated_at = NOW()
    WHERE id = job_id;
END;
$$;
