-- UgnayPH Extended Schema
-- Run this AFTER the existing supabase-schema.sql
-- in your Supabase SQL Editor (https://supabase.com/dashboard)

-- ============================================
-- CHALLENGE #1: SMART MOBILITY & TRANSPORTATION
-- ============================================
CREATE TABLE IF NOT EXISTS public.mobility_reports (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    location TEXT NOT NULL,
    city TEXT NOT NULL DEFAULT 'Unknown',
    incident_type TEXT NOT NULL CHECK (incident_type IN ('traffic_jam', 'accident', 'road_closure', 'flooding', 'construction', 'other')),
    severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high')),
    description TEXT,
    upvotes INTEGER DEFAULT 0,
    is_resolved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_mobility_city ON public.mobility_reports(city);
CREATE INDEX IF NOT EXISTS idx_mobility_created ON public.mobility_reports(created_at DESC);

ALTER TABLE public.mobility_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view mobility reports" ON public.mobility_reports FOR SELECT USING (true);
CREATE POLICY "Anyone can insert mobility reports" ON public.mobility_reports FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update mobility reports" ON public.mobility_reports FOR UPDATE USING (true);

-- ============================================
-- CHALLENGE #3: TRANSPARENCY & GOOD GOVERNANCE
-- ============================================
CREATE TABLE IF NOT EXISTS public.governance_complaints (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('infrastructure', 'corruption', 'public_service', 'environment', 'health', 'education', 'other')),
    location TEXT,
    agency TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'under_review', 'resolved', 'dismissed')),
    upvotes INTEGER DEFAULT 0,
    is_anonymous BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_gov_category ON public.governance_complaints(category);
CREATE INDEX IF NOT EXISTS idx_gov_created ON public.governance_complaints(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_gov_upvotes ON public.governance_complaints(upvotes DESC);

ALTER TABLE public.governance_complaints ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view complaints" ON public.governance_complaints FOR SELECT USING (true);
CREATE POLICY "Anyone can insert complaints" ON public.governance_complaints FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update complaints" ON public.governance_complaints FOR UPDATE USING (true);

-- ============================================
-- CHALLENGE #4: EMPLOYMENT & ECONOMIC OPPORTUNITIES
-- ============================================
CREATE TABLE IF NOT EXISTS public.job_listings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    company TEXT NOT NULL,
    location TEXT NOT NULL,
    job_type TEXT NOT NULL CHECK (job_type IN ('full_time', 'part_time', 'freelance', 'internship', 'apprenticeship')),
    salary_min INTEGER,
    salary_max INTEGER,
    description TEXT NOT NULL,
    requirements TEXT,
    skills TEXT[],
    region TEXT NOT NULL DEFAULT 'NCR',
    contact_email TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_jobs_region ON public.job_listings(region);
CREATE INDEX IF NOT EXISTS idx_jobs_type ON public.job_listings(job_type);
CREATE INDEX IF NOT EXISTS idx_jobs_created ON public.job_listings(created_at DESC);

ALTER TABLE public.job_listings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view jobs" ON public.job_listings FOR SELECT USING (true);
CREATE POLICY "Anyone can insert jobs" ON public.job_listings FOR INSERT WITH CHECK (true);

-- ============================================
-- CHALLENGE #5: HEALTHCARE ACCESS
-- ============================================
CREATE TABLE IF NOT EXISTS public.health_centers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('hospital', 'rural_health_unit', 'barangay_health_center', 'clinic', 'lying_in')),
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    region TEXT NOT NULL,
    province TEXT,
    phone TEXT,
    services TEXT[],
    is_24h BOOLEAN DEFAULT FALSE,
    accepts_philhealth BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.health_appointments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    health_center_id UUID REFERENCES public.health_centers(id) ON DELETE SET NULL,
    patient_name TEXT NOT NULL,
    contact_number TEXT NOT NULL,
    concern TEXT NOT NULL,
    preferred_date DATE NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_health_centers_region ON public.health_centers(region);
CREATE INDEX IF NOT EXISTS idx_health_centers_city ON public.health_centers(city);
CREATE INDEX IF NOT EXISTS idx_health_appt_created ON public.health_appointments(created_at DESC);

ALTER TABLE public.health_centers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view health centers" ON public.health_centers FOR SELECT USING (true);

ALTER TABLE public.health_appointments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can insert appointments" ON public.health_appointments FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can view appointments" ON public.health_appointments FOR SELECT USING (true);

-- ============================================
-- CHALLENGE #6: SUSTAINABLE AGRICULTURE
-- ============================================
CREATE TABLE IF NOT EXISTS public.agri_prices (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    crop TEXT NOT NULL,
    price_per_kg DECIMAL(10,2) NOT NULL,
    unit TEXT DEFAULT 'kg',
    location TEXT NOT NULL,
    region TEXT NOT NULL DEFAULT 'Region IV-A',
    farmer_name TEXT,
    contact TEXT,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_agri_crop ON public.agri_prices(crop);
CREATE INDEX IF NOT EXISTS idx_agri_region ON public.agri_prices(region);
CREATE INDEX IF NOT EXISTS idx_agri_created ON public.agri_prices(created_at DESC);

ALTER TABLE public.agri_prices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view agri prices" ON public.agri_prices FOR SELECT USING (true);
CREATE POLICY "Anyone can insert agri prices" ON public.agri_prices FOR INSERT WITH CHECK (true);

-- ============================================
-- SEED DATA: HEALTH CENTERS (Sample PH Data)
-- ============================================
INSERT INTO public.health_centers (name, type, address, city, region, province, phone, services, is_24h, accepts_philhealth) VALUES
('Jose Reyes Memorial Medical Center', 'hospital', 'Rizal Avenue, Sta. Cruz', 'Manila', 'NCR', NULL, '(02) 711-9491', ARRAY['emergency', 'outpatient', 'surgery', 'pediatrics', 'obstetrics'], true, true),
('Batangas Regional Hospital', 'hospital', 'Kumintang Ibaba', 'Batangas City', 'Region IV-A', 'Batangas', '(043) 723-0224', ARRAY['emergency', 'outpatient', 'surgery', 'pediatrics', 'obstetrics'], true, true),
('Lipa City District Hospital', 'hospital', 'Marawoy, Lipa City', 'Lipa City', 'Region IV-A', 'Batangas', '(043) 756-1234', ARRAY['emergency', 'outpatient', 'maternity'], true, true),
('Tanauan City RHU', 'rural_health_unit', 'Tanauan City Hall Compound', 'Tanauan City', 'Region IV-A', 'Batangas', '(043) 778-5678', ARRAY['consultation', 'immunization', 'prenatal', 'family_planning'], false, true),
('Sto. Tomas Barangay Health Center', 'barangay_health_center', 'Poblacion, Sto. Tomas', 'Sto. Tomas', 'Region IV-A', 'Batangas', NULL, ARRAY['consultation', 'immunization', 'basic_medicines'], false, true),
('Cebu City Medical Center', 'hospital', 'Osmena Blvd.', 'Cebu City', 'Region VII', 'Cebu', '(032) 253-3330', ARRAY['emergency', 'outpatient', 'surgery', 'trauma'], true, true),
('Davao Regional Medical Center', 'hospital', 'Apokon Road', 'Tagum City', 'Region XI', 'Davao del Norte', '(084) 400-2121', ARRAY['emergency', 'outpatient', 'surgery', 'pediatrics'], true, true),
('Iloilo Doctors Hospital', 'hospital', 'West Avenue, Molo', 'Iloilo City', 'Region VI', 'Iloilo', '(033) 320-1416', ARRAY['emergency', 'outpatient', 'maternity', 'surgery'], true, true)
ON CONFLICT DO NOTHING;

-- ============================================
-- SEED DATA: SAMPLE JOB LISTINGS
-- ============================================
INSERT INTO public.job_listings (title, company, location, job_type, salary_min, salary_max, description, requirements, skills, region, contact_email) VALUES
('Web Developer', 'TechnoHub PH', 'Makati City', 'full_time', 25000, 50000, 'Looking for a skilled web developer to join our growing team. You will build and maintain web applications for clients across the Philippines.', 'Bachelor''s degree in Computer Science or related field. 1+ years of experience.', ARRAY['JavaScript', 'React', 'Node.js', 'SQL'], 'NCR', 'hr@technohub.ph'),
('Virtual Assistant', 'Global BPO Solutions', 'Work from Home', 'full_time', 18000, 25000, 'Join our team as a Virtual Assistant supporting international clients. No experience required, we train you!', 'Good communication skills in English. Stable internet connection.', ARRAY['English Communication', 'MS Office', 'Data Entry'], 'NCR', 'jobs@globalbpo.ph'),
('Farm Technician', 'AgriPH Cooperative', 'Batangas City', 'full_time', 15000, 22000, 'Assist local farmers with modern agricultural techniques and crop monitoring.', 'Agriculture graduate preferred. Willing to do fieldwork.', ARRAY['Agriculture', 'Crop Management', 'Irrigation'], 'Region IV-A', 'coop@agriph.com'),
('Data Encoder', 'LGU Batangas', 'Batangas City', 'part_time', 8000, 12000, 'Part-time data encoding job for the local government unit. Flexible hours.', 'High school graduate. Basic computer skills.', ARRAY['Data Entry', 'MS Excel', 'Typing'], 'Region IV-A', 'hr@batangas.gov.ph'),
('Delivery Rider', 'QuickDeliver PH', 'Nationwide', 'freelance', 500, 1500, 'Be your own boss! Earn per delivery. Flexible schedule. Motorcycle provided for qualified applicants.', 'Valid driver''s license. Motorcycle preferred.', ARRAY['Driving', 'Navigation', 'Customer Service'], 'NCR', 'riders@quickdeliver.ph')
ON CONFLICT DO NOTHING;

-- ============================================
-- SEED DATA: SAMPLE AGRI PRICES
-- ============================================
INSERT INTO public.agri_prices (crop, price_per_kg, unit, location, region, farmer_name, contact, is_available) VALUES
('Palay (Rice)', 19.50, 'kg', 'Nueva Ecija', 'Region III', 'Mang Onyok', '0917-123-4567', true),
('Kamatis (Tomato)', 35.00, 'kg', 'Benguet', 'CAR', 'Ate Lorna', '0918-234-5678', true),
('Sibuyas (Onion)', 120.00, 'kg', 'Nueva Ecija', 'Region III', 'Mang Ben', '0919-345-6789', true),
('Kangkong', 15.00, 'bundle', 'Pampanga', 'Region III', 'Aling Maria', '0920-456-7890', true),
('Mais (Corn)', 14.00, 'kg', 'Isabela', 'Region II', 'Mang Pedro', '0921-567-8901', true),
('Saging (Banana)', 25.00, 'kg', 'Davao del Sur', 'Region XI', 'Tatay Rico', '0922-678-9012', true),
('Mangga (Mango)', 65.00, 'kg', 'Guimaras', 'Region VI', 'Ate Selya', '0923-789-0123', true),
('Kamote (Sweet Potato)', 22.00, 'kg', 'Benguet', 'CAR', 'Mang Tomas', '0924-890-1234', true)
ON CONFLICT DO NOTHING;
