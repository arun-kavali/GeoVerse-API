
-- Required extension for fuzzy search indexes
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Roles enum + user_roles
CREATE TYPE public.app_role AS ENUM ('admin', 'client');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "Users view own roles" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Admins view all roles" ON public.user_roles FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage roles" ON public.user_roles FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Profiles
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text,
  email text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own profile" ON public.profiles FOR SELECT TO authenticated USING (id = auth.uid());
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE TO authenticated USING (id = auth.uid());
CREATE POLICY "Admins view all profiles" ON public.profiles FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', NEW.email), NEW.email);
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'client');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Geography
CREATE TABLE public.countries (
  id serial PRIMARY KEY,
  code text NOT NULL UNIQUE,
  name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.states (
  id serial PRIMARY KEY,
  country_id int NOT NULL REFERENCES public.countries(id) ON DELETE CASCADE,
  state_code text NOT NULL,
  state_name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (country_id, state_code)
);
CREATE INDEX idx_states_name ON public.states USING gin (state_name gin_trgm_ops);

CREATE TABLE public.districts (
  id serial PRIMARY KEY,
  state_id int NOT NULL REFERENCES public.states(id) ON DELETE CASCADE,
  district_code text NOT NULL,
  district_name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (state_id, district_code)
);
CREATE INDEX idx_districts_state ON public.districts(state_id);
CREATE INDEX idx_districts_name ON public.districts USING gin (district_name gin_trgm_ops);

CREATE TABLE public.sub_districts (
  id serial PRIMARY KEY,
  district_id int NOT NULL REFERENCES public.districts(id) ON DELETE CASCADE,
  subdistrict_code text NOT NULL,
  subdistrict_name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (district_id, subdistrict_code)
);
CREATE INDEX idx_subdistricts_district ON public.sub_districts(district_id);
CREATE INDEX idx_subdistricts_name ON public.sub_districts USING gin (subdistrict_name gin_trgm_ops);

CREATE TABLE public.villages (
  id bigserial PRIMARY KEY,
  subdistrict_id int NOT NULL REFERENCES public.sub_districts(id) ON DELETE CASCADE,
  village_code text NOT NULL,
  village_name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (subdistrict_id, village_code)
);
CREATE INDEX idx_villages_subdistrict ON public.villages(subdistrict_id);
CREATE INDEX idx_villages_name_trgm ON public.villages USING gin (village_name gin_trgm_ops);

ALTER TABLE public.countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.states ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.districts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sub_districts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.villages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read countries" ON public.countries FOR SELECT USING (true);
CREATE POLICY "Public read states" ON public.states FOR SELECT USING (true);
CREATE POLICY "Public read districts" ON public.districts FOR SELECT USING (true);
CREATE POLICY "Public read sub_districts" ON public.sub_districts FOR SELECT USING (true);
CREATE POLICY "Public read villages" ON public.villages FOR SELECT USING (true);

CREATE POLICY "Admins write countries" ON public.countries FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins write states" ON public.states FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins write districts" ON public.districts FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins write sub_districts" ON public.sub_districts FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins write villages" ON public.villages FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- API Keys + Logs
CREATE TABLE public.api_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL DEFAULT 'Default',
  api_key text NOT NULL UNIQUE,
  usage_limit int NOT NULL DEFAULT 10000,
  usage_count int NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_api_keys_user ON public.api_keys(user_id);
CREATE INDEX idx_api_keys_key ON public.api_keys(api_key);
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own keys" ON public.api_keys FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users create own keys" ON public.api_keys FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users update own keys" ON public.api_keys FOR UPDATE TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users delete own keys" ON public.api_keys FOR DELETE TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Admins view all keys" ON public.api_keys FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.api_logs (
  id bigserial PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  api_key_id uuid REFERENCES public.api_keys(id) ON DELETE SET NULL,
  endpoint text NOT NULL,
  response_time_ms int,
  status_code int,
  request_time timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_api_logs_user_time ON public.api_logs(user_id, request_time DESC);
CREATE INDEX idx_api_logs_time ON public.api_logs(request_time DESC);
ALTER TABLE public.api_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own logs" ON public.api_logs FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Admins view all logs" ON public.api_logs FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

INSERT INTO public.countries (code, name) VALUES ('IN', 'India');
