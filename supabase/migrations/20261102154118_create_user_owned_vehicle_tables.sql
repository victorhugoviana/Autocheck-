/*
# Create vehicle, refueling, maintenance and wear tables (owner-scoped)

1. New Tables
- `vehicles`: the cars a user registers (make, model, year, engine, nickname, current odometer, daily mileage).
- `refuelings`: fuel-up records linked to a vehicle (date, odometer, liters, total amount, fuel type).
- `maintenance_records`: service history linked to a vehicle (title, part, costs, odometer, category).
- `wear_items`: parts with a replacement interval, linked to a vehicle.

Every table has a `user_id` that defaults to the signed-in user, so inserts from the app do not need to pass it.

2. Security
- Row level security is enabled on all four tables.
- Only the `authenticated` role is granted access (the app requires sign-in).
- Each user can only read, add or delete rows they own. Child rows must belong to a vehicle the user owns as well.

3. Notes
- Deleting a vehicle removes its refuelings, maintenance records and wear items (cascade).
- Indexes are added on owner and vehicle columns to keep lookups fast.
*/

CREATE TABLE IF NOT EXISTS vehicles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  make text NOT NULL,
  model text NOT NULL,
  year integer NOT NULL,
  engine text NOT NULL,
  nickname text NOT NULL DEFAULT '',
  current_odometer integer NOT NULL DEFAULT 0,
  daily_mileage_km integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS refuelings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  vehicle_id uuid NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  date date NOT NULL,
  odometer integer NOT NULL,
  liters numeric(8,2) NOT NULL,
  total_amount numeric(10,2) NOT NULL,
  fuel_type text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS maintenance_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  vehicle_id uuid NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  date date NOT NULL,
  title text NOT NULL,
  part_name text NOT NULL DEFAULT '',
  part_cost numeric(10,2) NOT NULL DEFAULT 0,
  labor_cost numeric(10,2) NOT NULL DEFAULT 0,
  odometer integer NOT NULL DEFAULT 0,
  category text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS wear_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  vehicle_id uuid NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  name text NOT NULL,
  replacement_interval_km integer NOT NULL,
  last_replaced_odometer integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS vehicles_user_id_idx ON vehicles (user_id);
CREATE INDEX IF NOT EXISTS refuelings_vehicle_id_idx ON refuelings (vehicle_id);
CREATE INDEX IF NOT EXISTS maintenance_records_vehicle_id_idx ON maintenance_records (vehicle_id);
CREATE INDEX IF NOT EXISTS wear_items_vehicle_id_idx ON wear_items (vehicle_id);

ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE refuelings ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE wear_items ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT ON vehicles TO authenticated;
GRANT SELECT, INSERT, DELETE ON refuelings TO authenticated;
GRANT SELECT, INSERT, DELETE ON maintenance_records TO authenticated;
GRANT SELECT, INSERT ON wear_items TO authenticated;

DROP POLICY IF EXISTS "select_own_vehicles" ON vehicles;
CREATE POLICY "select_own_vehicles" ON vehicles FOR SELECT
  TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "insert_own_vehicles" ON vehicles;
CREATE POLICY "insert_own_vehicles" ON vehicles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "update_own_vehicles" ON vehicles;
CREATE POLICY "update_own_vehicles" ON vehicles FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "delete_own_vehicles" ON vehicles;
CREATE POLICY "delete_own_vehicles" ON vehicles FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "select_own_refuelings" ON refuelings;
CREATE POLICY "select_own_refuelings" ON refuelings FOR SELECT
  TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "insert_own_refuelings" ON refuelings;
CREATE POLICY "insert_own_refuelings" ON refuelings FOR INSERT
  TO authenticated WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (SELECT 1 FROM vehicles v WHERE v.id = vehicle_id AND v.user_id = auth.uid())
  );
DROP POLICY IF EXISTS "update_own_refuelings" ON refuelings;
CREATE POLICY "update_own_refuelings" ON refuelings FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "delete_own_refuelings" ON refuelings;
CREATE POLICY "delete_own_refuelings" ON refuelings FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "select_own_maintenance_records" ON maintenance_records;
CREATE POLICY "select_own_maintenance_records" ON maintenance_records FOR SELECT
  TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "insert_own_maintenance_records" ON maintenance_records;
CREATE POLICY "insert_own_maintenance_records" ON maintenance_records FOR INSERT
  TO authenticated WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (SELECT 1 FROM vehicles v WHERE v.id = vehicle_id AND v.user_id = auth.uid())
  );
DROP POLICY IF EXISTS "update_own_maintenance_records" ON maintenance_records;
CREATE POLICY "update_own_maintenance_records" ON maintenance_records FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "delete_own_maintenance_records" ON maintenance_records;
CREATE POLICY "delete_own_maintenance_records" ON maintenance_records FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "select_own_wear_items" ON wear_items;
CREATE POLICY "select_own_wear_items" ON wear_items FOR SELECT
  TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "insert_own_wear_items" ON wear_items;
CREATE POLICY "insert_own_wear_items" ON wear_items FOR INSERT
  TO authenticated WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (SELECT 1 FROM vehicles v WHERE v.id = vehicle_id AND v.user_id = auth.uid())
  );
DROP POLICY IF EXISTS "update_own_wear_items" ON wear_items;
CREATE POLICY "update_own_wear_items" ON wear_items FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "delete_own_wear_items" ON wear_items;
CREATE POLICY "delete_own_wear_items" ON wear_items FOR DELETE
  TO authenticated USING (auth.uid() = user_id);
