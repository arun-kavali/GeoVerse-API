
-- Trigram indexes for fast ILIKE/similarity search
CREATE INDEX IF NOT EXISTS villages_name_trgm ON public.villages USING gin (village_name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS districts_name_trgm ON public.districts USING gin (district_name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS sub_districts_name_trgm ON public.sub_districts USING gin (subdistrict_name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS states_name_trgm ON public.states USING gin (state_name gin_trgm_ops);

-- Hierarchical village search with filters
CREATE OR REPLACE FUNCTION public.search_villages(
  q text DEFAULT NULL,
  p_state_id integer DEFAULT NULL,
  p_district_id integer DEFAULT NULL,
  p_subdistrict_id integer DEFAULT NULL,
  p_limit integer DEFAULT 50,
  p_offset integer DEFAULT 0
)
RETURNS TABLE (
  village_id bigint,
  village_code text,
  village_name text,
  subdistrict_id integer,
  subdistrict_name text,
  district_id integer,
  district_name text,
  state_id integer,
  state_name text,
  total_count bigint
)
LANGUAGE sql STABLE
SET search_path = public
AS $$
  WITH filtered AS (
    SELECT v.id AS village_id, v.village_code, v.village_name,
           sd.id AS subdistrict_id, sd.subdistrict_name,
           d.id AS district_id, d.district_name,
           s.id AS state_id, s.state_name
    FROM public.villages v
    JOIN public.sub_districts sd ON sd.id = v.subdistrict_id
    JOIN public.districts d ON d.id = sd.district_id
    JOIN public.states s ON s.id = d.state_id
    WHERE (q IS NULL OR q = '' OR v.village_name ILIKE q || '%')
      AND (p_subdistrict_id IS NULL OR sd.id = p_subdistrict_id)
      AND (p_district_id IS NULL OR d.id = p_district_id)
      AND (p_state_id IS NULL OR s.id = p_state_id)
  )
  SELECT f.*, COUNT(*) OVER() AS total_count
  FROM filtered f
  ORDER BY f.village_name
  LIMIT p_limit OFFSET p_offset;
$$;

-- Autocomplete (top-N prefix matches)
CREATE OR REPLACE FUNCTION public.autocomplete_villages(q text, p_limit integer DEFAULT 10)
RETURNS TABLE (
  village_id bigint,
  village_name text,
  district_name text,
  state_name text
)
LANGUAGE sql STABLE
SET search_path = public
AS $$
  SELECT v.id, v.village_name, d.district_name, s.state_name
  FROM public.villages v
  JOIN public.sub_districts sd ON sd.id = v.subdistrict_id
  JOIN public.districts d ON d.id = sd.district_id
  JOIN public.states s ON s.id = d.state_id
  WHERE v.village_name ILIKE q || '%'
  ORDER BY v.village_name
  LIMIT LEAST(p_limit, 25);
$$;

-- Validate API key and increment usage atomically; returns the key row when valid.
CREATE OR REPLACE FUNCTION public.consume_api_key(p_key text, p_endpoint text)
RETURNS TABLE (api_key_id uuid, user_id uuid, allowed boolean, reason text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  k record;
BEGIN
  SELECT id, user_id, status, usage_count, usage_limit
    INTO k
    FROM public.api_keys
    WHERE api_key = p_key
    FOR UPDATE;

  IF NOT FOUND THEN
    RETURN QUERY SELECT NULL::uuid, NULL::uuid, false, 'invalid_key';
    RETURN;
  END IF;

  IF k.status <> 'active' THEN
    RETURN QUERY SELECT k.id, k.user_id, false, 'inactive_key';
    RETURN;
  END IF;

  IF k.usage_count >= k.usage_limit THEN
    INSERT INTO public.api_logs(api_key_id, user_id, endpoint, status_code)
      VALUES (k.id, k.user_id, p_endpoint, 429);
    RETURN QUERY SELECT k.id, k.user_id, false, 'rate_limited';
    RETURN;
  END IF;

  UPDATE public.api_keys SET usage_count = usage_count + 1 WHERE id = k.id;
  RETURN QUERY SELECT k.id, k.user_id, true, 'ok'::text;
END;
$$;

-- Logger helper (security definer so anon can write logs)
CREATE OR REPLACE FUNCTION public.log_api_request(
  p_api_key_id uuid, p_user_id uuid, p_endpoint text,
  p_status_code integer, p_response_time_ms integer
)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  INSERT INTO public.api_logs(api_key_id, user_id, endpoint, status_code, response_time_ms)
  VALUES (p_api_key_id, p_user_id, p_endpoint, p_status_code, p_response_time_ms);
$$;
