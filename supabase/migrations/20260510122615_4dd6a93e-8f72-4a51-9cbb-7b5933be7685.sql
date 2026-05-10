
DELETE FROM public.villages_raw
WHERE subdistrict_code IS NULL OR subdistrict_code = ''
   OR district_code IS NULL OR district_code = ''
   OR state_code IS NULL OR state_code = ''
   OR village_code IS NULL OR village_code = '';

INSERT INTO public.states (country_id, state_code, state_name)
SELECT (SELECT id FROM public.countries WHERE code='IN'), state_code, MAX(state_name)
FROM public.villages_raw
GROUP BY state_code
ON CONFLICT (country_id, state_code) DO NOTHING;

INSERT INTO public.districts (state_id, district_code, district_name)
SELECT s.id, r.district_code, MAX(r.district_name)
FROM public.villages_raw r
JOIN public.states s ON s.state_code = r.state_code
GROUP BY s.id, r.district_code
ON CONFLICT (state_id, district_code) DO NOTHING;

INSERT INTO public.sub_districts (district_id, subdistrict_code, subdistrict_name)
SELECT d.id, r.subdistrict_code, MAX(COALESCE(NULLIF(r.subdistrict_name,''), 'Unknown'))
FROM public.villages_raw r
JOIN public.states s ON s.state_code = r.state_code
JOIN public.districts d ON d.state_id = s.id AND d.district_code = r.district_code
GROUP BY d.id, r.subdistrict_code
ON CONFLICT (district_id, subdistrict_code) DO NOTHING;

INSERT INTO public.villages (subdistrict_id, village_code, village_name)
SELECT sd.id, r.village_code, COALESCE(NULLIF(r.village_name,''), 'Unknown')
FROM public.villages_raw r
JOIN public.states s ON s.state_code = r.state_code
JOIN public.districts d ON d.state_id = s.id AND d.district_code = r.district_code
JOIN public.sub_districts sd ON sd.district_id = d.id AND sd.subdistrict_code = r.subdistrict_code
ON CONFLICT (subdistrict_id, village_code) DO NOTHING;

DROP TABLE public.villages_raw;
