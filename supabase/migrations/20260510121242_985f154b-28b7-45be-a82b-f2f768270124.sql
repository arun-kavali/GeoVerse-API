
-- Seed India
INSERT INTO public.countries (code, name)
VALUES ('IN', 'India')
ON CONFLICT DO NOTHING;

-- Foreign keys (idempotent)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'states_country_id_fkey') THEN
    ALTER TABLE public.states
      ADD CONSTRAINT states_country_id_fkey
      FOREIGN KEY (country_id) REFERENCES public.countries(id) ON DELETE CASCADE;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'districts_state_id_fkey') THEN
    ALTER TABLE public.districts
      ADD CONSTRAINT districts_state_id_fkey
      FOREIGN KEY (state_id) REFERENCES public.states(id) ON DELETE CASCADE;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'sub_districts_district_id_fkey') THEN
    ALTER TABLE public.sub_districts
      ADD CONSTRAINT sub_districts_district_id_fkey
      FOREIGN KEY (district_id) REFERENCES public.districts(id) ON DELETE CASCADE;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'villages_subdistrict_id_fkey') THEN
    ALTER TABLE public.villages
      ADD CONSTRAINT villages_subdistrict_id_fkey
      FOREIGN KEY (subdistrict_id) REFERENCES public.sub_districts(id) ON DELETE CASCADE;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'api_keys_user_id_fkey') THEN
    ALTER TABLE public.api_keys
      ADD CONSTRAINT api_keys_user_id_fkey
      FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'api_logs_api_key_id_fkey') THEN
    ALTER TABLE public.api_logs
      ADD CONSTRAINT api_logs_api_key_id_fkey
      FOREIGN KEY (api_key_id) REFERENCES public.api_keys(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Uniqueness within parent
CREATE UNIQUE INDEX IF NOT EXISTS countries_code_uniq ON public.countries(code);
CREATE UNIQUE INDEX IF NOT EXISTS states_country_code_uniq ON public.states(country_id, state_code);
CREATE UNIQUE INDEX IF NOT EXISTS districts_state_code_uniq ON public.districts(state_id, district_code);
CREATE UNIQUE INDEX IF NOT EXISTS sub_districts_district_code_uniq ON public.sub_districts(district_id, subdistrict_code);
CREATE UNIQUE INDEX IF NOT EXISTS villages_subdistrict_code_uniq ON public.villages(subdistrict_id, village_code);
CREATE UNIQUE INDEX IF NOT EXISTS api_keys_api_key_uniq ON public.api_keys(api_key);

-- FK / lookup indexes
CREATE INDEX IF NOT EXISTS states_country_id_idx ON public.states(country_id);
CREATE INDEX IF NOT EXISTS districts_state_id_idx ON public.districts(state_id);
CREATE INDEX IF NOT EXISTS sub_districts_district_id_idx ON public.sub_districts(district_id);
CREATE INDEX IF NOT EXISTS villages_subdistrict_id_idx ON public.villages(subdistrict_id);
CREATE INDEX IF NOT EXISTS api_keys_user_id_idx ON public.api_keys(user_id);
CREATE INDEX IF NOT EXISTS api_logs_user_id_idx ON public.api_logs(user_id);
CREATE INDEX IF NOT EXISTS api_logs_api_key_id_idx ON public.api_logs(api_key_id);
CREATE INDEX IF NOT EXISTS api_logs_request_time_idx ON public.api_logs(request_time DESC);
