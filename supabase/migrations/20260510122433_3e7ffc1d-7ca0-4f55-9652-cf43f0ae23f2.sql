
CREATE TABLE IF NOT EXISTS public.villages_raw (
  state_code text, state_name text,
  district_code text, district_name text,
  subdistrict_code text, subdistrict_name text,
  village_code text, village_name text
);
TRUNCATE public.villages_raw;
ALTER TABLE public.villages_raw DISABLE ROW LEVEL SECURITY;
