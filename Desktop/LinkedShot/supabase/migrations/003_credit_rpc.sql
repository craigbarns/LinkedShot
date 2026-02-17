
-- RPC for Atomic Credit Increment
CREATE OR REPLACE FUNCTION increment_credits(job_id UUID, total_limit INTEGER)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    current_used INTEGER;
    updated_row jobs%ROWTYPE;
BEGIN
    -- Check current credits
    SELECT credits_used INTO current_used FROM jobs WHERE id = job_id;
    
    IF current_used IS NULL THEN
        current_used := 0;
    END IF;

    IF current_used >= total_limit THEN
        RETURN NULL; -- Limit Exceeded
    END IF;

    -- Increment
    UPDATE jobs
    SET credits_used = credits_used + 1,
        updated_at = NOW()
    WHERE id = job_id
    RETURNING * INTO updated_row;

    RETURN to_jsonb(updated_row);
END;
$$;
