
export const vehicles = [
  { id: 'v1', make: 'Toyota', model: 'Corolla', year: 2021, engine: '2.0 Flex', nickname: 'Corolla Prata', currentOdometer: 55650, dailyMileageKm: 42 },
  { id: 'v2', make: 'Honda', model: 'Civic', year: 2019, engine: '1.5 Turbo', nickname: 'Civic Preto', currentOdometer: 68200, dailyMileageKm: 38 },
  { id: 'v3', make: 'Jeep', model: 'Compass', year: 2022, engine: '1.3 Turbo', nickname: 'Compass Branco', currentOdometer: 31000, dailyMileageKm: 55 },
  { id: 'v4', make: 'Volkswagen', model: 'Golf GTI', year: 2020, engine: '2.0 TSI', nickname: 'Golf GTI Vermelho', currentOdometer: 47800, dailyMileageKm: 30 },
  { id: 'v5', make: 'Chevrolet', model: 'Onix Plus', year: 2021, engine: '1.0 Turbo', nickname: 'Onix Plus Azul', currentOdometer: 39500, dailyMileageKm: 48 },
  { id: 'v6', make: 'Hyundai', model: 'HB20', year: 2020, engine: '1.6 Flex', nickname: 'HB20 Cinza', currentOdometer: 51200, dailyMileageKm: 35 },
  { id: 'v7', make: 'Fiat', model: 'Toro', year: 2022, engine: '2.0 Diesel', nickname: 'Toro Freedom', currentOdometer: 28000, dailyMileageKm: 60 },
  { id: 'v8', make: 'Nissan', model: 'Kicks', year: 2019, engine: '1.6 Flex', nickname: 'Kicks SL', currentOdometer: 61500, dailyMileageKm: 33 },
];

export const refuelings = [
  // Corolla — Gasolina ~R$7,20/L, Etanol ~R$5,10/L
  { id: 'r1', vehicleId: 'v1', date: '2026-01-08', odometer: 42000, liters: 38.5, totalAmount: 277.20, fuelType: 'Gasolina' },
  { id: 'r2', vehicleId: 'v1', date: '2026-02-05', odometer: 43400, liters: 36.2, totalAmount: 260.64, fuelType: 'Gasolina' },
  { id: 'r3', vehicleId: 'v1', date: '2026-03-12', odometer: 44800, liters: 37.0, totalAmount: 266.40, fuelType: 'Gasolina' },
  { id: 'r4', vehicleId: 'v1', date: '2026-04-09', odometer: 46250, liters: 39.1, totalAmount: 281.52, fuelType: 'Gasolina' },
  { id: 'r5', vehicleId: 'v1', date: '2026-05-14', odometer: 47600, liters: 35.8, totalAmount: 182.58, fuelType: 'Etanol' },
  { id: 'r6', vehicleId: 'v1', date: '2026-06-11', odometer: 49100, liters: 38.0, totalAmount: 273.60, fuelType: 'Gasolina' },
  { id: 'r7', vehicleId: 'v1', date: '2026-07-16', odometer: 50500, liters: 36.5, totalAmount: 262.80, fuelType: 'Gasolina' },
  { id: 'r8', vehicleId: 'v1', date: '2026-08-13', odometer: 51950, liters: 37.2, totalAmount: 267.84, fuelType: 'Gasolina' },
  { id: 'r9', vehicleId: 'v1', date: '2026-09-10', odometer: 53400, liters: 38.8, totalAmount: 279.36, fuelType: 'Gasolina' },
  { id: 'r10', vehicleId: 'v1', date: '2026-10-15', odometer: 54900, liters: 37.5, totalAmount: 270.00, fuelType: 'Gasolina' },
  { id: 'r11', vehicleId: 'v1', date: '2026-10-26', odometer: 55650, liters: 25.3, totalAmount: 182.16, fuelType: 'Gasolina' },
  // Civic — Gasolina ~R$7,20/L, Etanol ~R$5,10/L
  { id: 'r12', vehicleId: 'v2', date: '2026-01-10', odometer: 60000, liters: 35.0, totalAmount: 252.00, fuelType: 'Gasolina' },
  { id: 'r13', vehicleId: 'v2', date: '2026-02-14', odometer: 61500, liters: 33.8, totalAmount: 243.36, fuelType: 'Gasolina' },
  { id: 'r14', vehicleId: 'v2', date: '2026-03-20', odometer: 63100, liters: 34.5, totalAmount: 248.40, fuelType: 'Gasolina' },
  { id: 'r15', vehicleId: 'v2', date: '2026-04-18', odometer: 64600, liters: 35.2, totalAmount: 253.44, fuelType: 'Gasolina' },
  { id: 'r16', vehicleId: 'v2', date: '2026-05-22', odometer: 66050, liters: 33.0, totalAmount: 168.30, fuelType: 'Etanol' },
  { id: 'r17', vehicleId: 'v2', date: '2026-06-25', odometer: 67500, liters: 34.8, totalAmount: 250.56, fuelType: 'Gasolina' },
  { id: 'r18', vehicleId: 'v2', date: '2026-07-28', odometer: 66050, liters: 33.5, totalAmount: 241.20, fuelType: 'Gasolina' },
  { id: 'r19', vehicleId: 'v2', date: '2026-09-02', odometer: 67500, liters: 35.0, totalAmount: 252.00, fuelType: 'Gasolina' },
  { id: 'r20', vehicleId: 'v2', date: '2026-10-20', odometer: 68200, liters: 22.0, totalAmount: 158.40, fuelType: 'Gasolina' },
  // Compass — Gasolina ~R$7,20/L
  { id: 'r21', vehicleId: 'v3', date: '2026-02-01', odometer: 20000, liters: 40.0, totalAmount: 288.00, fuelType: 'Gasolina' },
  { id: 'r22', vehicleId: 'v3', date: '2026-03-05', odometer: 22500, liters: 42.5, totalAmount: 306.00, fuelType: 'Gasolina' },
  { id: 'r23', vehicleId: 'v3', date: '2026-04-10', odometer: 25200, liters: 41.0, totalAmount: 295.20, fuelType: 'Gasolina' },
  { id: 'r24', vehicleId: 'v3', date: '2026-05-15', odometer: 28000, liters: 43.2, totalAmount: 311.04, fuelType: 'Gasolina' },
  { id: 'r25', vehicleId: 'v3', date: '2026-07-01', odometer: 31000, liters: 42.0, totalAmount: 302.40, fuelType: 'Gasolina' },
  // Golf GTI — Gasolina ~R$7,30/L (premium)
  { id: 'r26', vehicleId: 'v4', date: '2026-01-15', odometer: 38000, liters: 36.0, totalAmount: 262.80, fuelType: 'Gasolina' },
  { id: 'r27', vehicleId: 'v4', date: '2026-03-01', odometer: 39500, liters: 34.5, totalAmount: 251.85, fuelType: 'Gasolina' },
  { id: 'r28', vehicleId: 'v4', date: '2026-04-20', odometer: 41200, liters: 35.8, totalAmount: 261.34, fuelType: 'Gasolina' },
  { id: 'r29', vehicleId: 'v4', date: '2026-06-05', odometer: 43000, liters: 36.2, totalAmount: 264.26, fuelType: 'Gasolina' },
  { id: 'r30', vehicleId: 'v4', date: '2026-07-18', odometer: 44800, liters: 35.0, totalAmount: 255.50, fuelType: 'Gasolina' },
  { id: 'r31', vehicleId: 'v4', date: '2026-09-10', odometer: 46500, liters: 34.8, totalAmount: 254.04, fuelType: 'Gasolina' },
  { id: 'r32', vehicleId: 'v4', date: '2026-10-22', odometer: 47800, liters: 30.5, totalAmount: 222.65, fuelType: 'Gasolina' },
  // Onix Plus — Gasolina ~R$7,10/L, Etanol ~R$5,00/L
  { id: 'r33', vehicleId: 'v5', date: '2026-02-10', odometer: 28000, liters: 28.0, totalAmount: 198.80, fuelType: 'Gasolina' },
  { id: 'r34', vehicleId: 'v5', date: '2026-03-18', odometer: 29800, liters: 27.5, totalAmount: 137.50, fuelType: 'Etanol' },
  { id: 'r35', vehicleId: 'v5', date: '2026-05-01', odometer: 31800, liters: 28.8, totalAmount: 204.48, fuelType: 'Gasolina' },
  { id: 'r36', vehicleId: 'v5', date: '2026-06-14', odometer: 33800, liters: 27.0, totalAmount: 191.70, fuelType: 'Gasolina' },
  { id: 'r37', vehicleId: 'v5', date: '2026-08-01', odometer: 35800, liters: 28.2, totalAmount: 200.22, fuelType: 'Gasolina' },
  { id: 'r38', vehicleId: 'v5', date: '2026-09-15', odometer: 37800, liters: 27.5, totalAmount: 137.50, fuelType: 'Etanol' },
  { id: 'r39', vehicleId: 'v5', date: '2026-10-25', odometer: 39500, liters: 26.0, totalAmount: 184.60, fuelType: 'Gasolina' },
  // HB20 — Gasolina ~R$7,10/L, Etanol ~R$5,00/L
  { id: 'r40', vehicleId: 'v6', date: '2026-01-20', odometer: 38000, liters: 30.0, totalAmount: 213.00, fuelType: 'Gasolina' },
  { id: 'r41', vehicleId: 'v6', date: '2026-03-01', odometer: 39800, liters: 29.5, totalAmount: 209.45, fuelType: 'Gasolina' },
  { id: 'r42', vehicleId: 'v6', date: '2026-04-12', odometer: 41700, liters: 30.2, totalAmount: 214.42, fuelType: 'Gasolina' },
  { id: 'r43', vehicleId: 'v6', date: '2026-05-25', odometer: 43700, liters: 29.8, totalAmount: 149.00, fuelType: 'Etanol' },
  { id: 'r44', vehicleId: 'v6', date: '2026-07-08', odometer: 45600, liters: 30.5, totalAmount: 216.55, fuelType: 'Gasolina' },
  { id: 'r45', vehicleId: 'v6', date: '2026-08-20', odometer: 47600, liters: 30.0, totalAmount: 213.00, fuelType: 'Gasolina' },
  { id: 'r46', vehicleId: 'v6', date: '2026-10-05', odometer: 49500, liters: 29.5, totalAmount: 209.45, fuelType: 'Gasolina' },
  { id: 'r47', vehicleId: 'v6', date: '2026-10-27', odometer: 51200, liters: 28.0, totalAmount: 198.80, fuelType: 'Gasolina' },
  // Toro — Diesel ~R$6,50/L
  { id: 'r48', vehicleId: 'v7', date: '2026-02-15', odometer: 12000, liters: 38.0, totalAmount: 247.00, fuelType: 'Diesel' },
  { id: 'r49', vehicleId: 'v7', date: '2026-04-01', odometer: 15800, liters: 42.0, totalAmount: 273.00, fuelType: 'Diesel' },
  { id: 'r50', vehicleId: 'v7', date: '2026-05-20', odometer: 19800, liters: 44.0, totalAmount: 286.00, fuelType: 'Diesel' },
  { id: 'r51', vehicleId: 'v7', date: '2026-07-10', odometer: 24000, liters: 43.5, totalAmount: 282.75, fuelType: 'Diesel' },
  { id: 'r52', vehicleId: 'v7', date: '2026-09-01', odometer: 28000, liters: 42.0, totalAmount: 273.00, fuelType: 'Diesel' },
  // Kicks — Gasolina ~R$7,15/L, Etanol ~R$5,05/L
  { id: 'r53', vehicleId: 'v8', date: '2026-01-12', odometer: 52000, liters: 32.0, totalAmount: 228.80, fuelType: 'Gasolina' },
  { id: 'r54', vehicleId: 'v8', date: '2026-02-28', odometer: 53800, liters: 31.5, totalAmount: 225.23, fuelType: 'Gasolina' },
  { id: 'r55', vehicleId: 'v8', date: '2026-04-10', odometer: 55600, liters: 32.2, totalAmount: 230.23, fuelType: 'Gasolina' },
  { id: 'r56', vehicleId: 'v8', date: '2026-05-25', odometer: 57400, liters: 31.8, totalAmount: 160.59, fuelType: 'Etanol' },
  { id: 'r57', vehicleId: 'v8', date: '2026-07-12', odometer: 59200, liters: 32.0, totalAmount: 228.80, fuelType: 'Gasolina' },
  { id: 'r58', vehicleId: 'v8', date: '2026-09-01', odometer: 60300, liters: 31.0, totalAmount: 221.65, fuelType: 'Gasolina' },
  { id: 'r59', vehicleId: 'v8', date: '2026-10-24', odometer: 61500, liters: 29.0, totalAmount: 207.35, fuelType: 'Gasolina' },
];

export const maintenanceRecords = [
  // Corolla
  { id: 'm1', vehicleId: 'v1', date: '2026-02-20', title: 'Troca de Pastilhas de Freio Dianteiras', partName: 'Pastilha de Freio - Bosch', partCost: 180.0, laborCost: 120.0, odometer: 43400, category: 'Corretiva' },
  { id: 'm2', vehicleId: 'v1', date: '2026-04-15', title: 'Troca de Óleo do Motor', partName: 'Óleo Mobil 1 5W30 - 5L', partCost: 240.0, laborCost: 60.0, odometer: 46250, category: 'Preventiva' },
  { id: 'm3', vehicleId: 'v1', date: '2026-06-25', title: 'Revisão Completa - Filtros e Velas', partName: 'Kit Filtros + Velas NGK', partCost: 320.0, laborCost: 200.0, odometer: 49100, category: 'Preventiva' },
  { id: 'm4', vehicleId: 'v1', date: '2026-08-30', title: 'Troca de Correia Dentada', partName: 'Correia Dentada Gates', partCost: 450.0, laborCost: 350.0, odometer: 51950, category: 'Preventiva' },
  { id: 'm5', vehicleId: 'v1', date: '2026-10-05', title: 'Troca de Amortecedor Dianteiro Direito', partName: 'Amortecedor Cofap', partCost: 380.0, laborCost: 180.0, odometer: 54900, category: 'Corretiva' },
  // Civic
  { id: 'm6', vehicleId: 'v2', date: '2026-03-10', title: 'Troca de Óleo e Filtro', partName: 'Óleo Shell 5W40 + Filtro', partCost: 210.0, laborCost: 50.0, odometer: 63100, category: 'Preventiva' },
  { id: 'm7', vehicleId: 'v2', date: '2026-05-20', title: 'Troca de Pastilhas de Freio Traseiras', partName: 'Pastilha Bosch Traseira', partCost: 150.0, laborCost: 100.0, odometer: 66050, category: 'Corretiva' },
  { id: 'm8', vehicleId: 'v2', date: '2026-08-15', title: 'Alinhamento e Balanceamento', partName: 'Serviço de Alinhamento', partCost: 0, laborCost: 120.0, odometer: 67500, category: 'Preventiva' },
  // Compass
  { id: 'm9', vehicleId: 'v3', date: '2026-04-01', title: 'Primeira Revisão de Garantia', partName: 'Kit Revisão Jeep', partCost: 380.0, laborCost: 280.0, odometer: 22500, category: 'Preventiva' },
  { id: 'm10', vehicleId: 'v3', date: '2026-07-15', title: 'Troca de Óleo do Motor', partName: 'Óleo Castrol 5W40 - 5L', partCost: 260.0, laborCost: 60.0, odometer: 28000, category: 'Preventiva' },
  // Golf GTI
  { id: 'm11', vehicleId: 'v4', date: '2026-02-28', title: 'Troca de Óleo Sintético', partName: 'Óleo Liqui Moly 5W40 - 5L', partCost: 320.0, laborCost: 80.0, odometer: 39500, category: 'Preventiva' },
  { id: 'm12', vehicleId: 'v4', date: '2026-05-10', title: 'Troca de Discos de Freio Dianteiros', partName: 'Disco de Freio Zimmermann', partCost: 520.0, laborCost: 200.0, odometer: 43000, category: 'Corretiva' },
  { id: 'm13', vehicleId: 'v4', date: '2026-08-01', title: 'Troca de Filtro de Ar Esportivo', partName: 'Filtro K&N Esportivo', partCost: 290.0, laborCost: 40.0, odometer: 46500, category: 'Preventiva' },
  // Onix Plus
  { id: 'm14', vehicleId: 'v5', date: '2026-03-25', title: 'Troca de Óleo e Filtro', partName: 'Óleo Lubrax 5W30 + Filtro', partCost: 145.0, laborCost: 40.0, odometer: 29800, category: 'Preventiva' },
  { id: 'm15', vehicleId: 'v5', date: '2026-06-20', title: 'Troca de Velas de Ignição', partName: 'Velas NGK Iridium', partCost: 180.0, laborCost: 80.0, odometer: 33800, category: 'Preventiva' },
  { id: 'm16', vehicleId: 'v5', date: '2026-09-10', title: 'Troca de Pastilhas de Freio', partName: 'Pastilha Fras-le', partCost: 95.0, laborCost: 90.0, odometer: 37800, category: 'Corretiva' },
  // HB20
  { id: 'm17', vehicleId: 'v6', date: '2026-02-15', title: 'Troca de Óleo do Motor', partName: 'Óleo Shell 5W30 - 4L', partCost: 130.0, laborCost: 40.0, odometer: 39800, category: 'Preventiva' },
  { id: 'm18', vehicleId: 'v6', date: '2026-05-30', title: 'Revisão 50.000 km', partName: 'Kit Revisão Hyundai', partCost: 450.0, laborCost: 250.0, odometer: 45600, category: 'Preventiva' },
  { id: 'm19', vehicleId: 'v6', date: '2026-09-20', title: 'Troca de Bateria', partName: 'Bateria Moura 60Ah', partCost: 380.0, laborCost: 30.0, odometer: 49500, category: 'Corretiva' },
  // Toro
  { id: 'm20', vehicleId: 'v7', date: '2026-04-10', title: 'Revisão 15.000 km', partName: 'Kit Revisão Fiat Toro Diesel', partCost: 420.0, laborCost: 300.0, odometer: 15800, category: 'Preventiva' },
  { id: 'm21', vehicleId: 'v7', date: '2026-07-25', title: 'Troca de Óleo Diesel', partName: 'Óleo Mobil Delvac 5W40', partCost: 310.0, laborCost: 70.0, odometer: 24000, category: 'Preventiva' },
  // Kicks
  { id: 'm22', vehicleId: 'v8', date: '2026-03-05', title: 'Troca de Óleo e Filtros', partName: 'Óleo Nissan 5W30 + Kit Filtros', partCost: 280.0, laborCost: 120.0, odometer: 53800, category: 'Preventiva' },
  { id: 'm23', vehicleId: 'v8', date: '2026-06-10', title: 'Troca de Pastilhas e Discos', partName: 'Kit Freio Dianteiro Nakata', partCost: 340.0, laborCost: 180.0, odometer: 57400, category: 'Corretiva' },
  { id: 'm24', vehicleId: 'v8', date: '2026-09-15', title: 'Troca de Correia Auxiliar', partName: 'Correia Auxiliar Gates', partCost: 120.0, laborCost: 90.0, odometer: 60300, category: 'Preventiva' },
];

export const wearItems = [
  // Corolla
  { id: 'w1', vehicleId: 'v1', name: 'Óleo do Motor', replacementIntervalKm: 10000, lastReplacedOdometer: 46250 },
  { id: 'w2', vehicleId: 'v1', name: 'Filtro de Óleo', replacementIntervalKm: 10000, lastReplacedOdometer: 46250 },
  { id: 'w3', vehicleId: 'v1', name: 'Filtro de Ar', replacementIntervalKm: 20000, lastReplacedOdometer: 49100 },
  { id: 'w4', vehicleId: 'v1', name: 'Correia Dentada', replacementIntervalKm: 60000, lastReplacedOdometer: 51950 },
  { id: 'w5', vehicleId: 'v1', name: 'Pastilhas de Freio', replacementIntervalKm: 25000, lastReplacedOdometer: 43400 },
  { id: 'w6', vehicleId: 'v1', name: 'Velas de Ignição', replacementIntervalKm: 30000, lastReplacedOdometer: 49100 },
  // Civic
  { id: 'w7', vehicleId: 'v2', name: 'Óleo do Motor', replacementIntervalKm: 10000, lastReplacedOdometer: 63100 },
  { id: 'w8', vehicleId: 'v2', name: 'Filtro de Óleo', replacementIntervalKm: 10000, lastReplacedOdometer: 63100 },
  { id: 'w9', vehicleId: 'v2', name: 'Filtro de Ar', replacementIntervalKm: 20000, lastReplacedOdometer: 52000 },
  { id: 'w10', vehicleId: 'v2', name: 'Pastilhas de Freio', replacementIntervalKm: 30000, lastReplacedOdometer: 66050 },
  { id: 'w11', vehicleId: 'v2', name: 'Velas de Ignição', replacementIntervalKm: 40000, lastReplacedOdometer: 52000 },
  // Compass
  { id: 'w12', vehicleId: 'v3', name: 'Óleo do Motor', replacementIntervalKm: 10000, lastReplacedOdometer: 28000 },
  { id: 'w13', vehicleId: 'v3', name: 'Filtro de Óleo', replacementIntervalKm: 10000, lastReplacedOdometer: 28000 },
  { id: 'w14', vehicleId: 'v3', name: 'Filtro de Ar', replacementIntervalKm: 20000, lastReplacedOdometer: 22500 },
  { id: 'w15', vehicleId: 'v3', name: 'Pastilhas de Freio', replacementIntervalKm: 30000, lastReplacedOdometer: 12000 },
  { id: 'w16', vehicleId: 'v3', name: 'Correia Dentada', replacementIntervalKm: 80000, lastReplacedOdometer: 0 },
  // Golf GTI
  { id: 'w17', vehicleId: 'v4', name: 'Óleo do Motor', replacementIntervalKm: 10000, lastReplacedOdometer: 46500 },
  { id: 'w18', vehicleId: 'v4', name: 'Filtro de Óleo', replacementIntervalKm: 10000, lastReplacedOdometer: 46500 },
  { id: 'w19', vehicleId: 'v4', name: 'Filtro de Ar', replacementIntervalKm: 20000, lastReplacedOdometer: 46500 },
  { id: 'w20', vehicleId: 'v4', name: 'Discos de Freio', replacementIntervalKm: 40000, lastReplacedOdometer: 43000 },
  { id: 'w21', vehicleId: 'v4', name: 'Velas de Ignição', replacementIntervalKm: 30000, lastReplacedOdometer: 38000 },
  // Onix Plus
  { id: 'w22', vehicleId: 'v5', name: 'Óleo do Motor', replacementIntervalKm: 10000, lastReplacedOdometer: 33800 },
  { id: 'w23', vehicleId: 'v5', name: 'Filtro de Óleo', replacementIntervalKm: 10000, lastReplacedOdometer: 33800 },
  { id: 'w24', vehicleId: 'v5', name: 'Filtro de Ar', replacementIntervalKm: 20000, lastReplacedOdometer: 29800 },
  { id: 'w25', vehicleId: 'v5', name: 'Pastilhas de Freio', replacementIntervalKm: 25000, lastReplacedOdometer: 37800 },
  { id: 'w26', vehicleId: 'v5', name: 'Velas de Ignição', replacementIntervalKm: 30000, lastReplacedOdometer: 33800 },
  // HB20
  { id: 'w27', vehicleId: 'v6', name: 'Óleo do Motor', replacementIntervalKm: 10000, lastReplacedOdometer: 45600 },
  { id: 'w28', vehicleId: 'v6', name: 'Filtro de Óleo', replacementIntervalKm: 10000, lastReplacedOdometer: 45600 },
  { id: 'w29', vehicleId: 'v6', name: 'Filtro de Ar', replacementIntervalKm: 20000, lastReplacedOdometer: 39800 },
  { id: 'w30', vehicleId: 'v6', name: 'Bateria', replacementIntervalKm: 40000, lastReplacedOdometer: 49500 },
  { id: 'w31', vehicleId: 'v6', name: 'Pastilhas de Freio', replacementIntervalKm: 25000, lastReplacedOdometer: 39800 },
  // Toro
  { id: 'w32', vehicleId: 'v7', name: 'Óleo do Motor Diesel', replacementIntervalKm: 10000, lastReplacedOdometer: 24000 },
  { id: 'w33', vehicleId: 'v7', name: 'Filtro de Óleo', replacementIntervalKm: 10000, lastReplacedOdometer: 24000 },
  { id: 'w34', vehicleId: 'v7', name: 'Filtro de Ar', replacementIntervalKm: 20000, lastReplacedOdometer: 15800 },
  { id: 'w35', vehicleId: 'v7', name: 'Filtro de Combustível', replacementIntervalKm: 30000, lastReplacedOdometer: 12000 },
  // Kicks
  { id: 'w36', vehicleId: 'v8', name: 'Óleo do Motor', replacementIntervalKm: 10000, lastReplacedOdometer: 53800 },
  { id: 'w37', vehicleId: 'v8', name: 'Filtro de Óleo', replacementIntervalKm: 10000, lastReplacedOdometer: 53800 },
  { id: 'w38', vehicleId: 'v8', name: 'Pastilhas de Freio', replacementIntervalKm: 30000, lastReplacedOdometer: 57400 },
  { id: 'w39', vehicleId: 'v8', name: 'Correia Auxiliar', replacementIntervalKm: 50000, lastReplacedOdometer: 60300 },
  { id: 'w40', vehicleId: 'v8', name: 'Velas de Ignição', replacementIntervalKm: 40000, lastReplacedOdometer: 52000 },
];

const img = {
  brake: 'https://images.pexels.com/photos/4480505/pexels-photo-4480505.jpeg?auto=compress&cs=tinysrgb&w=400',
  shock: 'https://images.pexels.com/photos/3807277/pexels-photo-3807277.jpeg?auto=compress&cs=tinysrgb&w=400',
  oil: 'https://images.pexels.com/photos/6217600/pexels-photo-6217600.jpeg?auto=compress&cs=tinysrgb&w=400',
  belt: 'https://images.pexels.com/photos/3806249/pexels-photo-3806249.jpeg?auto=compress&cs=tinysrgb&w=400',
  battery: 'https://images.pexels.com/photos/4480505/pexels-photo-4480505.jpeg?auto=compress&cs=tinysrgb&w=400',
  plug: 'https://images.pexels.com/photos/3806249/pexels-photo-3806249.jpeg?auto=compress&cs=tinysrgb&w=400',
};

// Helper to generate parts for a vehicle with multiple store offers
function makeParts(baseId, name, category, image, compat, offers) {
  return offers.map((o, i) => ({
    id: `${baseId}-${i}`,
    name,
    brand: o.brand,
    category,
    price: o.price,
    freight: o.freight,
    deliveryDays: o.deliveryDays,
    storeName: o.storeName,
    trustBadge: o.trustBadge,
    rating: o.rating,
    salesCount: o.salesCount,
    compatibleVehicles: [compat],
    imageUrl: image,
  }));
}

export const parts = [
  // === Corolla parts ===
  ...makeParts('c1', 'Pastilha de Freio Dianteira', 'Freios', img.brake, { make: 'Toyota', model: 'Corolla', yearStart: 2019, yearEnd: 2023 }, [
    { brand: 'Cobreq', price: 89.9, freight: 15.0, deliveryDays: 3, storeName: 'AutoPeças Central', trustBadge: 'Loja Oficial', rating: 4.9, salesCount: 1240 },
    { brand: 'Bosch', price: 132.0, freight: 0, deliveryDays: 5, storeName: 'Bosch Oficial Brasil', trustBadge: 'Loja Oficial', rating: 5.0, salesCount: 3200 },
    { brand: 'Fras-le', price: 75.5, freight: 22.5, deliveryDays: 7, storeName: 'FrasLe Premium Store', trustBadge: 'Vendedor Platinum', rating: 4.7, salesCount: 890 },
    { brand: 'Alligator', price: 68.0, freight: 35.0, deliveryDays: 12, storeName: 'Peças & Cia', trustBadge: '5 Estrelas', rating: 4.5, salesCount: 420 },
  ]),
  ...makeParts('c2', 'Amortecedor Dianteiro', 'Suspensão', img.shock, { make: 'Toyota', model: 'Corolla', yearStart: 2019, yearEnd: 2023 }, [
    { brand: 'Cofap', price: 289.0, freight: 25.0, deliveryDays: 4, storeName: 'Cofap AutoStore', trustBadge: 'Loja Oficial', rating: 4.8, salesCount: 1560 },
    { brand: 'Monroe', price: 349.0, freight: 0, deliveryDays: 2, storeName: 'Monroe Brasil Oficial', trustBadge: 'Loja Oficial', rating: 4.9, salesCount: 2100 },
    { brand: 'Nakata', price: 245.0, freight: 30.0, deliveryDays: 6, storeName: 'Nakata Premium', trustBadge: 'Vendedor Platinum', rating: 4.6, salesCount: 730 },
  ]),
  ...makeParts('c3', 'Óleo do Motor 5W30 - 5L', 'Motor', img.oil, { make: 'Toyota', model: 'Corolla', yearStart: 2019, yearEnd: 2023 }, [
    { brand: 'Mobil 1', price: 239.9, freight: 0, deliveryDays: 3, storeName: 'Mobil 1 Oficial', trustBadge: 'Loja Oficial', rating: 5.0, salesCount: 5400 },
    { brand: 'Shell', price: 219.0, freight: 18.0, deliveryDays: 5, storeName: 'Shell Auto Center', trustBadge: 'Vendedor Platinum', rating: 4.7, salesCount: 1800 },
    { brand: 'Lubrax', price: 189.9, freight: 12.0, deliveryDays: 8, storeName: 'Lubrax Store', trustBadge: '5 Estrelas', rating: 4.4, salesCount: 950 },
  ]),
  ...makeParts('c4', 'Correia Dentada', 'Motor', img.belt, { make: 'Toyota', model: 'Corolla', yearStart: 2019, yearEnd: 2023 }, [
    { brand: 'Gates', price: 429.0, freight: 20.0, deliveryDays: 4, storeName: 'Gates Oficial Brasil', trustBadge: 'Loja Oficial', rating: 4.9, salesCount: 1100 },
    { brand: 'Contitech', price: 389.0, freight: 28.0, deliveryDays: 6, storeName: 'Peças Automotivas SP', trustBadge: 'Vendedor Platinum', rating: 4.6, salesCount: 640 },
  ]),
  ...makeParts('c5', 'Filtro de Ar', 'Filtros', img.brake, { make: 'Toyota', model: 'Corolla', yearStart: 2019, yearEnd: 2023 }, [
    { brand: 'Tecfil', price: 42.0, freight: 10.0, deliveryDays: 3, storeName: 'Tecfil Oficial', trustBadge: 'Loja Oficial', rating: 4.8, salesCount: 2800 },
    { brand: 'Mahle', price: 55.0, freight: 0, deliveryDays: 2, storeName: 'Mahle Premium Store', trustBadge: 'Vendedor Platinum', rating: 4.9, salesCount: 1900 },
    { brand: 'Wega', price: 35.0, freight: 18.0, deliveryDays: 9, storeName: 'AutoPeças Express', trustBadge: '5 Estrelas', rating: 4.3, salesCount: 510 },
  ]),

  // === Civic parts ===
  ...makeParts('civ1', 'Pastilha de Freio Dianteira', 'Freios', img.brake, { make: 'Honda', model: 'Civic', yearStart: 2016, yearEnd: 2021 }, [
    { brand: 'Bosch', price: 145.0, freight: 0, deliveryDays: 4, storeName: 'Bosch Oficial Brasil', trustBadge: 'Loja Oficial', rating: 5.0, salesCount: 2800 },
    { brand: 'Cobreq', price: 98.0, freight: 18.0, deliveryDays: 5, storeName: 'AutoPeças Central', trustBadge: 'Loja Oficial', rating: 4.8, salesCount: 1100 },
    { brand: 'Fras-le', price: 82.0, freight: 25.0, deliveryDays: 8, storeName: 'FrasLe Premium Store', trustBadge: 'Vendedor Platinum', rating: 4.6, salesCount: 670 },
  ]),
  ...makeParts('civ2', 'Óleo do Motor 5W40 - 5L', 'Motor', img.oil, { make: 'Honda', model: 'Civic', yearStart: 2016, yearEnd: 2021 }, [
    { brand: 'Shell', price: 229.0, freight: 0, deliveryDays: 3, storeName: 'Shell Auto Center', trustBadge: 'Loja Oficial', rating: 4.9, salesCount: 3200 },
    { brand: 'Mobil 1', price: 255.0, freight: 15.0, deliveryDays: 5, storeName: 'Mobil 1 Oficial', trustBadge: 'Loja Oficial', rating: 5.0, salesCount: 4100 },
    { brand: 'Lubrax', price: 195.0, freight: 14.0, deliveryDays: 7, storeName: 'Lubrax Store', trustBadge: 'Vendedor Platinum', rating: 4.5, salesCount: 880 },
  ]),
  ...makeParts('civ3', 'Velas de Ignição (Kit 4)', 'Motor', img.plug, { make: 'Honda', model: 'Civic', yearStart: 2016, yearEnd: 2021 }, [
    { brand: 'NGK', price: 120.0, freight: 10.0, deliveryDays: 3, storeName: 'NGK Oficial', trustBadge: 'Loja Oficial', rating: 5.0, salesCount: 4500 },
    { brand: 'Denso', price: 98.0, freight: 15.0, deliveryDays: 6, storeName: 'Denso AutoParts', trustBadge: 'Vendedor Platinum', rating: 4.7, salesCount: 1200 },
  ]),
  ...makeParts('civ4', 'Amortecedor Traseiro', 'Suspensão', img.shock, { make: 'Honda', model: 'Civic', yearStart: 2016, yearEnd: 2021 }, [
    { brand: 'Monroe', price: 299.0, freight: 0, deliveryDays: 3, storeName: 'Monroe Brasil Oficial', trustBadge: 'Loja Oficial', rating: 4.8, salesCount: 1700 },
    { brand: 'Cofap', price: 259.0, freight: 22.0, deliveryDays: 5, storeName: 'Cofap AutoStore', trustBadge: 'Vendedor Platinum', rating: 4.6, salesCount: 920 },
  ]),

  // === Compass parts ===
  ...makeParts('cmp1', 'Pastilha de Freio Dianteira', 'Freios', img.brake, { make: 'Jeep', model: 'Compass', yearStart: 2017, yearEnd: 2023 }, [
    { brand: 'Bosch', price: 155.0, freight: 0, deliveryDays: 4, storeName: 'Bosch Oficial Brasil', trustBadge: 'Loja Oficial', rating: 5.0, salesCount: 2200 },
    { brand: 'Fras-le', price: 105.0, freight: 20.0, deliveryDays: 6, storeName: 'FrasLe Premium Store', trustBadge: 'Loja Oficial', rating: 4.7, salesCount: 780 },
    { brand: 'Cobreq', price: 92.0, freight: 28.0, deliveryDays: 9, storeName: 'AutoPeças Central', trustBadge: '5 Estrelas', rating: 4.4, salesCount: 340 },
  ]),
  ...makeParts('cmp2', 'Óleo do Motor 5W40 - 5L', 'Motor', img.oil, { make: 'Jeep', model: 'Compass', yearStart: 2017, yearEnd: 2023 }, [
    { brand: 'Castrol', price: 249.0, freight: 0, deliveryDays: 3, storeName: 'Castrol Oficial', trustBadge: 'Loja Oficial', rating: 4.9, salesCount: 2600 },
    { brand: 'Shell', price: 235.0, freight: 16.0, deliveryDays: 5, storeName: 'Shell Auto Center', trustBadge: 'Vendedor Platinum', rating: 4.7, salesCount: 1400 },
  ]),
  ...makeParts('cmp3', 'Filtro de Ar Condicionado', 'Filtros', img.brake, { make: 'Jeep', model: 'Compass', yearStart: 2017, yearEnd: 2023 }, [
    { brand: 'Tecfil', price: 48.0, freight: 8.0, deliveryDays: 3, storeName: 'Tecfil Oficial', trustBadge: 'Loja Oficial', rating: 4.8, salesCount: 1600 },
    { brand: 'Mahle', price: 62.0, freight: 0, deliveryDays: 2, storeName: 'Mahle Premium Store', trustBadge: 'Vendedor Platinum', rating: 4.9, salesCount: 1200 },
  ]),

  // === Golf GTI parts ===
  ...makeParts('g1', 'Disco de Freio Dianteiro (Par)', 'Freios', img.brake, { make: 'Volkswagen', model: 'Golf GTI', yearStart: 2018, yearEnd: 2021 }, [
    { brand: 'Zimmermann', price: 580.0, freight: 0, deliveryDays: 4, storeName: 'Zimmermann BR', trustBadge: 'Loja Oficial', rating: 4.9, salesCount: 980 },
    { brand: 'Bosch', price: 460.0, freight: 25.0, deliveryDays: 5, storeName: 'Bosch Oficial Brasil', trustBadge: 'Loja Oficial', rating: 4.8, salesCount: 1500 },
    { brand: 'Fremax', price: 420.0, freight: 30.0, deliveryDays: 7, storeName: 'Fremax Store', trustBadge: 'Vendedor Platinum', rating: 4.6, salesCount: 620 },
  ]),
  ...makeParts('g2', 'Óleo do Motor 5W40 - 5L', 'Motor', img.oil, { make: 'Volkswagen', model: 'Golf GTI', yearStart: 2018, yearEnd: 2021 }, [
    { brand: 'Liqui Moly', price: 320.0, freight: 0, deliveryDays: 3, storeName: 'Liqui Moly Oficial', trustBadge: 'Loja Oficial', rating: 5.0, salesCount: 3100 },
    { brand: 'Mobil 1', price: 260.0, freight: 18.0, deliveryDays: 5, storeName: 'Mobil 1 Oficial', trustBadge: 'Loja Oficial', rating: 4.9, salesCount: 3800 },
  ]),
  ...makeParts('g3', 'Filtro de Ar Esportivo', 'Filtros', img.brake, { make: 'Volkswagen', model: 'Golf GTI', yearStart: 2018, yearEnd: 2021 }, [
    { brand: 'K&N', price: 290.0, freight: 0, deliveryDays: 4, storeName: 'K&N Performance', trustBadge: 'Loja Oficial', rating: 4.9, salesCount: 1400 },
    { brand: 'ITG', price: 245.0, freight: 20.0, deliveryDays: 8, storeName: 'ITG Filters', trustBadge: 'Vendedor Platinum', rating: 4.6, salesCount: 380 },
  ]),

  // === Onix Plus parts ===
  ...makeParts('o1', 'Pastilha de Freio Dianteira', 'Freios', img.brake, { make: 'Chevrolet', model: 'Onix Plus', yearStart: 2019, yearEnd: 2023 }, [
    { brand: 'Fras-le', price: 65.0, freight: 12.0, deliveryDays: 4, storeName: 'FrasLe Premium Store', trustBadge: 'Loja Oficial', rating: 4.7, salesCount: 1500 },
    { brand: 'Cobreq', price: 55.0, freight: 18.0, deliveryDays: 6, storeName: 'AutoPeças Central', trustBadge: 'Vendedor Platinum', rating: 4.5, salesCount: 720 },
    { brand: 'Alligator', price: 48.0, freight: 25.0, deliveryDays: 10, storeName: 'Peças & Cia', trustBadge: '5 Estrelas', rating: 4.2, salesCount: 280 },
  ]),
  ...makeParts('o2', 'Velas de Ignição Iridium (Kit 4)', 'Motor', img.plug, { make: 'Chevrolet', model: 'Onix Plus', yearStart: 2019, yearEnd: 2023 }, [
    { brand: 'NGK', price: 180.0, freight: 10.0, deliveryDays: 3, storeName: 'NGK Oficial', trustBadge: 'Loja Oficial', rating: 5.0, salesCount: 3200 },
    { brand: 'Denso', price: 155.0, freight: 15.0, deliveryDays: 6, storeName: 'Denso AutoParts', trustBadge: 'Vendedor Platinum', rating: 4.7, salesCount: 980 },
  ]),
  ...makeParts('o3', 'Óleo do Motor 5W30 - 4L', 'Motor', img.oil, { make: 'Chevrolet', model: 'Onix Plus', yearStart: 2019, yearEnd: 2023 }, [
    { brand: 'Lubrax', price: 145.0, freight: 0, deliveryDays: 3, storeName: 'Lubrax Store', trustBadge: 'Loja Oficial', rating: 4.6, salesCount: 2100 },
    { brand: 'Shell', price: 175.0, freight: 12.0, deliveryDays: 5, storeName: 'Shell Auto Center', trustBadge: 'Vendedor Platinum', rating: 4.8, salesCount: 1600 },
  ]),

  // === HB20 parts ===
  ...makeParts('h1', 'Pastilha de Freio Dianteira', 'Freios', img.brake, { make: 'Hyundai', model: 'HB20', yearStart: 2019, yearEnd: 2022 }, [
    { brand: 'Bosch', price: 110.0, freight: 0, deliveryDays: 4, storeName: 'Bosch Oficial Brasil', trustBadge: 'Loja Oficial', rating: 4.9, salesCount: 1900 },
    { brand: 'Fras-le', price: 78.0, freight: 16.0, deliveryDays: 6, storeName: 'FrasLe Premium Store', trustBadge: 'Vendedor Platinum', rating: 4.5, salesCount: 540 },
  ]),
  ...makeParts('h2', 'Bateria 60Ah', 'Elétrica', img.battery, { make: 'Hyundai', model: 'HB20', yearStart: 2019, yearEnd: 2022 }, [
    { brand: 'Moura', price: 380.0, freight: 0, deliveryDays: 2, storeName: 'Moura Oficial', trustBadge: 'Loja Oficial', rating: 4.9, salesCount: 4200 },
    { brand: 'Zetta', price: 320.0, freight: 30.0, deliveryDays: 5, storeName: 'Zetta Batteries', trustBadge: 'Vendedor Platinum', rating: 4.5, salesCount: 1100 },
  ]),
  ...makeParts('h3', 'Filtro de Ar', 'Filtros', img.brake, { make: 'Hyundai', model: 'HB20', yearStart: 2019, yearEnd: 2022 }, [
    { brand: 'Tecfil', price: 38.0, freight: 8.0, deliveryDays: 3, storeName: 'Tecfil Oficial', trustBadge: 'Loja Oficial', rating: 4.7, salesCount: 1700 },
    { brand: 'Mahle', price: 52.0, freight: 0, deliveryDays: 2, storeName: 'Mahle Premium Store', trustBadge: 'Vendedor Platinum', rating: 4.8, salesCount: 1300 },
  ]),

  // === Toro parts ===
  ...makeParts('t1', 'Pastilha de Freio Dianteira', 'Freios', img.brake, { make: 'Fiat', model: 'Toro', yearStart: 2017, yearEnd: 2023 }, [
    { brand: 'Fras-le', price: 115.0, freight: 0, deliveryDays: 4, storeName: 'FrasLe Premium Store', trustBadge: 'Loja Oficial', rating: 4.8, salesCount: 1300 },
    { brand: 'Bosch', price: 140.0, freight: 18.0, deliveryDays: 5, storeName: 'Bosch Oficial Brasil', trustBadge: 'Loja Oficial', rating: 4.9, salesCount: 2100 },
    { brand: 'Cobreq', price: 95.0, freight: 22.0, deliveryDays: 8, storeName: 'AutoPeças Central', trustBadge: '5 Estrelas', rating: 4.4, salesCount: 450 },
  ]),
  ...makeParts('t2', 'Óleo do Motor Diesel 5W40 - 6L', 'Motor', img.oil, { make: 'Fiat', model: 'Toro', yearStart: 2017, yearEnd: 2023 }, [
    { brand: 'Mobil Delvac', price: 310.0, freight: 0, deliveryDays: 3, storeName: 'Mobil Oficial', trustBadge: 'Loja Oficial', rating: 4.9, salesCount: 1800 },
    { brand: 'Shell Rimula', price: 285.0, freight: 20.0, deliveryDays: 5, storeName: 'Shell Auto Center', trustBadge: 'Vendedor Platinum', rating: 4.7, salesCount: 950 },
  ]),
  ...makeParts('t3', 'Filtro de Combustível Diesel', 'Filtros', img.brake, { make: 'Fiat', model: 'Toro', yearStart: 2017, yearEnd: 2023 }, [
    { brand: 'Bosch', price: 85.0, freight: 10.0, deliveryDays: 3, storeName: 'Bosch Oficial Brasil', trustBadge: 'Loja Oficial', rating: 4.8, salesCount: 1600 },
    { brand: 'Tecfil', price: 62.0, freight: 15.0, deliveryDays: 6, storeName: 'Tecfil Oficial', trustBadge: 'Vendedor Platinum', rating: 4.5, salesCount: 820 },
  ]),

  // === Kicks parts ===
  ...makeParts('k1', 'Pastilha de Freio Dianteira', 'Freios', img.brake, { make: 'Nissan', model: 'Kicks', yearStart: 2016, yearEnd: 2021 }, [
    { brand: 'Nakata', price: 105.0, freight: 0, deliveryDays: 4, storeName: 'Nakata Premium', trustBadge: 'Loja Oficial', rating: 4.7, salesCount: 1100 },
    { brand: 'Bosch', price: 135.0, freight: 15.0, deliveryDays: 5, storeName: 'Bosch Oficial Brasil', trustBadge: 'Loja Oficial', rating: 4.9, salesCount: 1900 },
  ]),
  ...makeParts('k2', 'Kit Freio Dianteiro (Pastilhas + Discos)', 'Freios', img.brake, { make: 'Nissan', model: 'Kicks', yearStart: 2016, yearEnd: 2021 }, [
    { brand: 'Nakata', price: 340.0, freight: 25.0, deliveryDays: 5, storeName: 'Nakata Premium', trustBadge: 'Loja Oficial', rating: 4.7, salesCount: 680 },
    { brand: 'Bosch', price: 420.0, freight: 0, deliveryDays: 4, storeName: 'Bosch Oficial Brasil', trustBadge: 'Loja Oficial', rating: 4.9, salesCount: 1200 },
  ]),
  ...makeParts('k3', 'Correia Auxiliar', 'Motor', img.belt, { make: 'Nissan', model: 'Kicks', yearStart: 2016, yearEnd: 2021 }, [
    { brand: 'Gates', price: 120.0, freight: 10.0, deliveryDays: 3, storeName: 'Gates Oficial Brasil', trustBadge: 'Loja Oficial', rating: 4.8, salesCount: 1500 },
    { brand: 'Contitech', price: 98.0, freight: 18.0, deliveryDays: 6, storeName: 'Peças Automotivas SP', trustBadge: 'Vendedor Platinum', rating: 4.5, salesCount: 520 },
  ]),
  ...makeParts('k4', 'Óleo do Motor 5W30 - 5L', 'Motor', img.oil, { make: 'Nissan', model: 'Kicks', yearStart: 2016, yearEnd: 2021 }, [
    { brand: 'Shell', price: 225.0, freight: 0, deliveryDays: 3, storeName: 'Shell Auto Center', trustBadge: 'Loja Oficial', rating: 4.8, salesCount: 2400 },
    { brand: 'Mobil 1', price: 250.0, freight: 15.0, deliveryDays: 5, storeName: 'Mobil 1 Oficial', trustBadge: 'Loja Oficial', rating: 4.9, salesCount: 3600 },
  ]),
];
