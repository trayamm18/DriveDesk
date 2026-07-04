import { create } from 'zustand';

export interface ServiceRecord {
  id: string;
  type: string; // 'Oil Change' | 'Battery' | 'Tyres' | 'Brake Pads' | 'Wheel Alignment' | 'Insurance' | 'Fitness' | 'PUC'
  date: string;
  odometer: number;
  cost: number;
  notes: string;
  performedBy: string;
}

export interface VehicleTimelineEvent {
  id: string;
  timestamp: string;
  type: 'booking' | 'maintenance' | 'transfer' | 'clean' | 'status_change';
  title: string;
  description: string;
  user: string;
}

export interface Vehicle {
  id: string;
  registrationNumber: string;
  model: string;
  variant: string;
  year: number;
  status: 'Available' | 'Reserved' | 'Picked Up' | 'Returning Today' | 'Cleaning' | 'Ready' | 'Maintenance' | 'Transfer' | 'Hold';
  currentBranch: string;
  fuelLevel: number; // 0 to 100
  odometer: number;
  insuranceExpiry: string;
  pucExpiry: string;
  rcNumber: string;
  fastagBalance: number;
  images: any[]; // gallery of 6 images
  damageMap: { part: string; severity: 'light' | 'medium' | 'heavy'; notes: string }[];
  serviceHistory: ServiceRecord[];
  timeline: VehicleTimelineEvent[];
  currentBookingId?: string;
  notes: string[];
  features: string[];
  holdUntil?: string | null;
}

export interface CustomerDocument {
  type: 'DL' | 'Aadhaar' | 'PAN' | 'Passport' | 'Selfie' | 'Signature';
  status: 'Verified' | 'Uploaded' | 'Rejected' | 'Not Uploaded';
  number?: string;
  expiryDate?: string;
  uploadDate?: string;
  fileUri?: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  status: 'Verified' | 'Pending' | 'Flagged';
  customerRating: string; // "Good Customer", "Excellent", "Late Returner", etc.
  address: string;
  emergencyContact: {
    name: string;
    phone: string;
    relation: string;
  };
  documents: {
    DL: CustomerDocument;
    Aadhaar: CustomerDocument;
    PAN: CustomerDocument;
    Passport: CustomerDocument;
    Selfie: CustomerDocument;
    Signature: CustomerDocument;
  };
  notes: string[];
  rentalHistory: string[]; // Booking IDs
}

export interface PaymentRecord {
  id: string;
  type: 'Advance' | 'Deposit' | 'Refund' | 'Pending';
  amount: number;
  method: 'UPI' | 'Cash' | 'Card' | 'Bank Transfer';
  status: 'Paid' | 'Pending' | 'Refunded';
  date: string;
  receiptNumber: string;
}

export interface Booking {
  id: string;
  customerId: string;
  vehicleId: string;
  status: 'Pending Documents' | 'Pending Inspection' | 'Pending Signature' | 'Active' | 'Returned' | 'Completed' | 'Cancelled';
  startDate: string;
  endDate: string;
  pickupBranch: string;
  returnBranch: string;
  totalAmount: number;
  securityDeposit: number;
  payments: PaymentRecord[];
  checklistPhotos?: {
    front?: string;
    rear?: string;
    left?: string;
    right?: string;
    dashboard?: string;
    interior?: string;
    odometer?: string;
    fuel?: string;
    [key: string]: string | undefined;
  };
  startOdometer?: number;
  endOdometer?: number;
  startFuelLevel?: number;
  endFuelLevel?: number;
  agreementSigned?: boolean;
  signatureUri?: string;
  notes?: string[];
  createdAt: string;
}

export interface Employee {
  id: string;
  name: string;
  phone: string;
  role: 'Manager' | 'Agent' | 'Driver';
  branch: string;
  status: 'Active' | 'Inactive';
}

export interface Branch {
  id: string;
  name: string;
  city: string;
  address: string;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  user: string;
  type: string;
  message: string;
  bookingId?: string;
  vehicleId?: string;
}

interface FleetState {
  currentUser: { name: string; phone: string; role: 'Owner' | 'Agent'; branch: string } | null;
  vehicles: Vehicle[];
  bookings: Booking[];
  customers: Customer[];
  employees: Employee[];
  branches: Branch[];
  activities: ActivityLog[];
  notifications: { id: string; type: string; title: string; body: string; timestamp: string; read: boolean }[];
  
  // Actions
  login: (phone: string, role: 'Owner' | 'Agent', name: string) => void;
  logout: () => void;
  
  addBooking: (booking: Booking) => void;
  updateBooking: (bookingId: string, updates: Partial<Booking>) => void;
  addPayment: (bookingId: string, payment: Omit<PaymentRecord, 'id' | 'date' | 'receiptNumber'>) => void;
  
  updateVehicleStatus: (vehicleId: string, status: Vehicle['status'], branch?: string) => void;
  addVehicleNote: (vehicleId: string, note: string) => void;
  addVehicleDamage: (vehicleId: string, damage: Vehicle['damageMap'][0]) => void;
  addVehicleService: (vehicleId: string, record: Omit<ServiceRecord, 'id' | 'date'>) => void;
  transferVehicle: (vehicleId: string, destinationBranch: string) => void;
  
  holdVehicle: (vehicleId: string) => void;
  releaseHold: (vehicleId: string) => void;
  reserveVehicle: (vehicleId: string) => void;
  cancelReservation: (vehicleId: string) => void;
  
  addCustomer: (customer: Customer) => void;
  updateCustomer: (customerId: string, updates: Partial<Customer>) => void;
  addCustomerNote: (customerId: string, note: string) => void;
  
  addActivity: (type: string, message: string, user?: string, bookingId?: string, vehicleId?: string) => void;
  addNotification: (type: string, title: string, body: string) => void;
  markNotificationsAsRead: () => void;
  
  toast: { visible: boolean; message: string; type: 'success' | 'error' | 'info' };
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  hideToast: () => void;
}


// ---------------- MOCK DATA ----------------

const mockBranches: Branch[] = [
  { id: 'b1', name: 'Pune', city: 'Pune', address: 'Senapati Bapat Road, Pune' },
  { id: 'b2', name: 'Mumbai', city: 'Mumbai', address: 'Bandra West, Mumbai' },
  { id: 'b3', name: 'Lonavala', city: 'Lonavala', address: 'Lonavala Market, Lonavala' },
  { id: 'b4', name: 'Mahabaleshwar', city: 'Mahabaleshwar', address: 'Venna Lake Road, Mahabaleshwar' },
  { id: 'b5', name: 'Alibaug', city: 'Alibaug', address: 'Varsoli Beach Road, Alibaug' },
];

const mockEmployees: Employee[] = [
  { id: 'e1', name: 'Rahul Sharma', phone: '9876543210', role: 'Manager', branch: 'Pune', status: 'Active' },
  { id: 'e2', name: 'Amit Verma', phone: '9876543211', role: 'Agent', branch: 'Pune', status: 'Active' },
  { id: 'e3', name: 'Sanjay Dutt', phone: '9876543212', role: 'Agent', branch: 'Pune', status: 'Active' },
  { id: 'e4', name: 'Priya Patel', phone: '9876543213', role: 'Agent', branch: 'Lonavala', status: 'Active' },
  { id: 'e5', name: 'Karan Johar', phone: '9876543214', role: 'Agent', branch: 'Mumbai', status: 'Active' },
];

const mockVehicles: Vehicle[] = [
  {
    id: 'v1',
    registrationNumber: 'MH-12-TR-8910',
    model: 'Mahindra Thar',
    variant: 'LX 4x4 Diesel AT',
    year: 2023,
    status: 'Available',
    currentBranch: 'Pune',
    fuelLevel: 85,
    odometer: 14230,
    images: [
      require('../../assets/images/thar.jpg'), // Local uploaded Thar photo
      'https://images.unsplash.com/photo-1588616142728-662ad75e5330?w=800&auto=format&fit=crop&q=80', // Black Jeep/Thar
      'https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?w=800&auto=format&fit=crop&q=80', // Green Jeep/Thar
    ],
    damageMap: [
      { part: 'Left Rear Door', severity: 'light', notes: 'Minor scratch near handle' },
    ],
    serviceHistory: [
      { id: 'sh1', type: 'Oil Change', date: '2026-04-10', odometer: 12100, cost: 4500, notes: 'Synthetic oil, replaced filter', performedBy: 'Sanjay Shinde' },
      { id: 'sh2', type: 'Wheel Alignment', date: '2026-01-15', odometer: 9400, cost: 1200, notes: 'Aligned front wheels', performedBy: 'Wheel Alignment Express' }
    ],
    timeline: [
      { id: 't1_1', timestamp: '2026-06-25T10:00:00Z', type: 'clean', title: 'Vehicle Cleaned', description: 'Deep cleaning done. Sanitized interior.', user: 'Amit Verma' },
      { id: 't1_2', timestamp: '2026-04-10T12:00:00Z', type: 'maintenance', title: 'Oil Service Completed', description: 'Replaced engine oil and filter.', user: 'Sanjay Shinde' },
    ],
    notes: ['Customer reported minor vibration at 100km/h. Alignment checked.', 'Spare tyre brand new.'],
    features: ['4x4', 'Convertible Hardtop', 'Automatic', 'Diesel', '4 Seater', 'Cruise Control', 'All-Terrain Tyres'],
    insuranceExpiry: '2026-11-15',
    pucExpiry: '2026-08-10',
    rcNumber: 'RC-MH12-984321',
    fastagBalance: 450,
  },
  {
    id: 'v2',
    registrationNumber: 'MH-12-QE-4567',
    model: 'Hyundai Creta',
    variant: 'SX (O) 1.5 CRDi AT',
    year: 2022,
    status: 'Picked Up',
    currentBranch: 'Pune',
    fuelLevel: 45,
    odometer: 32450,
    images: [
      require('../../assets/images/creta.png'), // Local uploaded Creta photo
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1617469167446-804b0adea37f?w=800&auto=format&fit=crop&q=80',
    ],
    damageMap: [],
    serviceHistory: [
      { id: 'sh3', type: 'Battery', date: '2026-02-18', odometer: 28900, cost: 7200, notes: 'Replaced with Amaron 50Ah battery (3yr warranty)', performedBy: 'Amaron Zone' }
    ],
    timeline: [
      { id: 't2_1', timestamp: '2026-06-29T09:30:00Z', type: 'booking', title: 'Vehicle Handed Over', description: 'Checked out for booking BK-102.', user: 'Amit Verma' }
    ],
    notes: ['FASTag recharged. Active booking till tomorrow.'],
    currentBookingId: 'bk2',
    features: ['Panoramic Sunroof', 'Automatic', 'Diesel', '5 Seater', 'Ventilated Seats', 'Wireless Charger', 'Bose Speakers'],
    insuranceExpiry: '2026-07-05',
    pucExpiry: '2026-09-20',
    rcNumber: 'RC-MH12-112233',
    fastagBalance: 1200,
  },
  {
    id: 'v3',
    registrationNumber: 'DL-3C-BA-8901',
    model: 'Toyota Fortuner',
    variant: 'Legender 2.8 4x2 AT',
    year: 2023,
    status: 'Maintenance',
    currentBranch: 'Pune',
    fuelLevel: 60,
    odometer: 28900,
    images: [
      require('../../assets/images/fortuner.png'), // Local uploaded Fortuner photo
      'https://images.unsplash.com/photo-1617469167446-804b0adea37f?w=800&auto=format&fit=crop&q=80', // Luxury SUV Interior
    ],
    damageMap: [
      { part: 'Front Bumper', severity: 'medium', notes: 'Scuff marks on lower lip' }
    ],
    serviceHistory: [
      { id: 'sh4', type: 'Tyres', date: '2026-05-12', odometer: 27500, cost: 42000, notes: 'Replaced 4 tyres with Bridgestone Dueler H/T', performedBy: 'Darshan Tyres' }
    ],
    timeline: [
      { id: 't3_1', timestamp: '2026-06-30T07:15:00Z', type: 'maintenance', title: 'Sent to Workshop', description: 'Brake pads replacement and wheel alignment.', user: 'Sanjay Dutt' }
    ],
    notes: ['Brake pads replacement due. Vehicle sent to service center today.'],
    features: ['4x4 Mode', 'Automatic', 'Diesel', '7 Seater', 'Power Tailgate', 'Ventilated Seats', 'Leather Upholstery'],
    insuranceExpiry: '2026-12-01',
    pucExpiry: '2026-07-02',
    rcNumber: 'RC-DL3C-334455',
    fastagBalance: 3200,
  },
  {
    id: 'v4',
    registrationNumber: 'KA-03-MJ-4321',
    model: 'Maruti Suzuki Swift',
    variant: 'ZXI+ Petrol MT',
    year: 2021,
    status: 'Available',
    currentBranch: 'Pune',
    fuelLevel: 90,
    odometer: 48900,
    images: [
      require('../../assets/images/swift.png'), // Local uploaded Swift photo
    ],
    damageMap: [],
    serviceHistory: [],
    timeline: [],
    notes: [],
    features: ['Manual Transmission', 'Petrol', '5 Seater', 'Touchscreen Infotainment', 'Reverse Camera', 'Keyless Entry'],
    insuranceExpiry: '2026-10-25',
    pucExpiry: '2026-12-15',
    rcNumber: 'RC-KA03-887766',
    fastagBalance: 150,
  },
  {
    id: 'v5',
    registrationNumber: 'MH-12-XF-0012',
    model: 'Maruti Suzuki Ertiga',
    variant: 'ZXI CNG MT',
    year: 2022,
    status: 'Available',
    currentBranch: 'Pune',
    fuelLevel: 75,
    odometer: 54100,
    images: [
      require('../../assets/images/ertiga.png'), // Local uploaded Ertiga photo
    ],
    damageMap: [],
    serviceHistory: [],
    timeline: [],
    notes: [],
    features: ['CNG + Petrol', 'Manual', '7 Seater', 'Roof AC Vents', 'Reverse Sensors', 'Steering Controls'],
    insuranceExpiry: '2027-02-18',
    pucExpiry: '2026-09-02',
    rcNumber: 'RC-MH12-998877',
    fastagBalance: 600,
  },
  {
    id: 'v6',
    registrationNumber: 'MH-12-YY-7788',
    model: 'Kia Seltos',
    variant: 'HTX 1.5 Petrol CVT',
    year: 2023,
    status: 'Returning Today',
    currentBranch: 'Lonavala',
    fuelLevel: 50,
    odometer: 18450,
    images: [
      require('../../assets/images/seltos.jpg'), // Local uploaded Seltos photo
    ],
    damageMap: [],
    serviceHistory: [],
    timeline: [],
    notes: [],
    currentBookingId: 'bk3',
    features: ['Sunroof', 'Automatic (CVT)', 'Petrol', '5 Seater', 'Bose Audio System', '360 Camera', 'Ambient Lighting'],
    insuranceExpiry: '2026-08-30',
    pucExpiry: '2026-09-12',
    rcNumber: 'RC-MH12-554433',
    fastagBalance: 980,
  },
  {
    id: 'v7',
    registrationNumber: 'MH-14-GH-1122',
    model: 'Tata Nexon',
    variant: 'Creative+ S EV',
    year: 2023,
    status: 'Cleaning',
    currentBranch: 'Mumbai',
    fuelLevel: 98,
    odometer: 11200,
    images: [
      require('../../assets/images/nexon.jpg'), // Local uploaded Nexon photo
    ],
    damageMap: [],
    serviceHistory: [],
    timeline: [],
    notes: [],
    features: ['Sunroof', 'EV (Electric)', 'Automatic', '5 Seater', 'Regenerative Braking', 'Digital Dashboard'],
    insuranceExpiry: '2026-11-20',
    pucExpiry: '2026-12-30',
    rcNumber: 'RC-MH14-232345',
    fastagBalance: 120,
  },
];

// Let's populate the remaining 15+ vehicles so the fleet feels very large and real.
const loopModelImages: { [key: string]: any[] } = {
  'Honda City': [
    require('../../assets/images/hondacity.png'), // Local uploaded Honda City photo 1
    require('../../assets/images/hondacity2.png'), // Local uploaded Honda City photo 2
  ],
  'Mahindra XUV700': [
    require('../../assets/images/xuv700.png'), // Local uploaded XUV700 photo 1
    require('../../assets/images/xuv700_2.png'), // Local uploaded XUV700 photo 2
  ],
  'Toyota Innova Crysta': [
    require('../../assets/images/innovacrysta.png'), // Local uploaded Innova Crysta photo
  ],
  'Tata Harrier': [
    require('../../assets/images/harrier.jpg'), // Local uploaded Harrier photo 1
    require('../../assets/images/harrier2.png'), // Local uploaded Harrier photo 2
  ],
  'Maruti Baleno': [
    require('../../assets/images/baleno.png'), // Local uploaded Baleno photo 1
    require('../../assets/images/baleno2.png'), // Local uploaded Baleno photo 2
  ]
};

const loopModelFeatures: { [key: string]: string[] } = {
  'Honda City': ['Sunroof', 'Automatic', 'Petrol', '5 Seater', 'ADAS Safety', 'Cruise Control'],
  'Mahindra XUV700': ['Panoramic Sunroof', 'Automatic', 'Diesel', '7 Seater', 'ADAS Safety', 'AWD', 'Memory Seats'],
  'Toyota Innova Crysta': ['Manual', 'Diesel', '7 Seater', 'Captain Seats', 'Dual Zone AC', 'Large Boot'],
  'Tata Harrier': ['Panoramic Sunroof', 'Automatic', 'Diesel', '5 Seater', 'Ventilated Seats', 'Harman Audio'],
  'Maruti Baleno': ['Manual', 'Petrol', '5 Seater', 'Heads-Up Display', '360 Camera', 'Smart Hybrid']
};

for (let i = 8; i <= 16; i++) {
  const models = ['Honda City', 'Mahindra XUV700', 'Toyota Innova Crysta', 'Tata Harrier', 'Maruti Baleno'];
  const model = models[i % models.length];
  const plates = [`MH-12-AS-${1000 + i}`, `DL-2C-CA-${3000 + i}`, `KA-01-ZX-${8000 + i}`];
  const plate = plates[i % plates.length];
  const statuses: Vehicle['status'][] = ['Available', 'Ready', 'Available', 'Cleaning', 'Available'];
  mockVehicles.push({
    id: `v${i}`,
    registrationNumber: plate,
    model: model,
    variant: 'Top Model AT',
    year: 2022 + (i % 2),
    status: statuses[i % statuses.length],
    currentBranch: i % 3 === 0 ? 'Pune' : (i % 3 === 1 ? 'Mumbai' : 'Lonavala'),
    fuelLevel: 80 - (i * 2),
    odometer: 12000 + (i * 3500),
    insuranceExpiry: '2026-12-15',
    pucExpiry: '2026-09-30',
    rcNumber: `RC-REG-${i * 9872}`,
    fastagBalance: 500 + (i * 100),
    images: loopModelImages[model] || ['https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800&auto=format&fit=crop&q=80'],
    damageMap: [],
    serviceHistory: [],
    timeline: [],
    notes: [],
    features: loopModelFeatures[model] || [],
  });
}

const mockCustomers: Customer[] = [
  {
    id: 'c1',
    name: 'Amit Trivedi',
    phone: '9822012345',
    email: 'amit.trivedi@outlook.com',
    status: 'Verified',
    customerRating: 'Good Customer',
    address: 'Flat 402, Rohan Mithila, Viman Nagar, Pune - 411014',
    emergencyContact: { name: 'Kirti Trivedi', phone: '9822098765', relation: 'Spouse' },
    documents: {
      DL: { type: 'DL', status: 'Verified', number: 'DL-MH12-20150043210', expiryDate: '2035-08-20', uploadDate: '2026-05-10', fileUri: 'dummy_dl_uri' },
      Aadhaar: { type: 'Aadhaar', status: 'Verified', number: '3422-9843-1120', uploadDate: '2026-05-10', fileUri: 'dummy_aadhaar_uri' },
      PAN: { type: 'PAN', status: 'Verified', number: 'ABCDE1234F', uploadDate: '2026-05-10', fileUri: 'dummy_pan_uri' },
      Passport: { type: 'Passport', status: 'Not Uploaded' },
      Selfie: { type: 'Selfie', status: 'Verified', uploadDate: '2026-05-10', fileUri: 'dummy_selfie_uri' },
      Signature: { type: 'Signature', status: 'Verified', uploadDate: '2026-05-10', fileUri: 'dummy_sig_uri' },
    },
    notes: ['Polite customer. Returns vehicle on time with full fuel tank.'],
    rentalHistory: ['bk1'],
  },
  {
    id: 'c2',
    name: 'Vikram Malhotra',
    phone: '9922099887',
    email: 'vikram@malhotragroup.in',
    status: 'Verified',
    customerRating: 'Excellent',
    address: 'Bungalow 9, Oakwood Hills, Senapati Bapat Road, Pune - 411016',
    emergencyContact: { name: 'Sunil Malhotra', phone: '9922011223', relation: 'Father' },
    documents: {
      DL: { type: 'DL', status: 'Verified', number: 'DL-MH14-20109988776', expiryDate: '2030-04-12', uploadDate: '2026-06-01', fileUri: 'dummy_dl_uri' },
      Aadhaar: { type: 'Aadhaar', status: 'Verified', number: '7845-3321-9980', uploadDate: '2026-06-01', fileUri: 'dummy_aadhaar_uri' },
      PAN: { type: 'PAN', status: 'Verified', number: 'XYZPQ9876S', uploadDate: '2026-06-01', fileUri: 'dummy_pan_uri' },
      Passport: { type: 'Passport', status: 'Verified', number: 'Z984321', expiryDate: '2033-09-15', uploadDate: '2026-06-01' },
      Selfie: { type: 'Selfie', status: 'Verified', uploadDate: '2026-06-01', fileUri: 'dummy_selfie_uri' },
      Signature: { type: 'Signature', status: 'Verified', uploadDate: '2026-06-01', fileUri: 'dummy_sig_uri' },
    },
    notes: ['Rents only SUVs. Prefers Fortuner or Thar.'],
    rentalHistory: ['bk2'],
  },
  {
    id: 'c3',
    name: 'Neha Deshmukh',
    phone: '9765432100',
    email: 'neha.d@gmail.com',
    status: 'Verified',
    customerRating: 'Good Customer',
    address: 'A-1204, Mega Metropolis, Hinjawadi Phase 1, Pune - 411057',
    emergencyContact: { name: 'Rajesh Deshmukh', phone: '9765411122', relation: 'Father' },
    documents: {
      DL: { type: 'DL', status: 'Verified', number: 'DL-MH12-20180099880', expiryDate: '2038-02-15', uploadDate: '2026-06-15', fileUri: 'dummy_dl_uri' },
      Aadhaar: { type: 'Aadhaar', status: 'Verified', number: '9087-4432-1112', uploadDate: '2026-06-15', fileUri: 'dummy_aadhaar_uri' },
      PAN: { type: 'PAN', status: 'Verified', number: 'PMNOK4321A', uploadDate: '2026-06-15', fileUri: 'dummy_pan_uri' },
      Passport: { type: 'Passport', status: 'Not Uploaded' },
      Selfie: { type: 'Selfie', status: 'Verified', uploadDate: '2026-06-15', fileUri: 'dummy_selfie_uri' },
      Signature: { type: 'Signature', status: 'Verified', uploadDate: '2026-06-15', fileUri: 'dummy_sig_uri' },
    },
    notes: ['Very gentle driver. Returns car extremely clean.'],
    rentalHistory: ['bk3'],
  },
  {
    id: 'c4',
    name: 'Suresh Raina',
    phone: '9845012345',
    email: 'suresh.raina@csk.com',
    status: 'Pending',
    customerRating: 'Late Returner',
    address: 'Indiranagar, Bangalore - 560038',
    emergencyContact: { name: 'Priyanka Raina', phone: '9845098765', relation: 'Spouse' },
    documents: {
      DL: { type: 'DL', status: 'Uploaded', number: 'DL-KA03-20120012345', expiryDate: '2032-05-10', uploadDate: '2026-06-28', fileUri: 'dummy_dl_uri' },
      Aadhaar: { type: 'Aadhaar', status: 'Uploaded', number: '1122-3344-5566', uploadDate: '2026-06-28', fileUri: 'dummy_aadhaar_uri' },
      PAN: { type: 'PAN', status: 'Not Uploaded' },
      Passport: { type: 'Passport', status: 'Not Uploaded' },
      Selfie: { type: 'Selfie', status: 'Uploaded', uploadDate: '2026-06-28', fileUri: 'dummy_selfie_uri' },
      Signature: { type: 'Signature', status: 'Not Uploaded' },
    },
    notes: ['Usually extends bookings by a few hours at the last minute.'],
    rentalHistory: [],
  }
];

// Let's populate remaining 20+ customers
for (let i = 5; i <= 20; i++) {
  const names = ['Kunal Kamra', 'Tanmay Bhat', 'Zakir Khan', 'Biswa Kalyan', 'Nikhil Kamath', 'Ashneer Grover', 'Anupam Mittal', 'Vineeta Singh'];
  const name = names[i % names.length] + ' ' + String.fromCharCode(65 + i);
  mockCustomers.push({
    id: `c${i}`,
    name: name,
    phone: `99887766${10 + i}`,
    email: `${name.toLowerCase().replace(' ', '.')}@gmail.com`,
    status: i % 4 === 0 ? 'Pending' : 'Verified',
    customerRating: i % 5 === 0 ? 'Late Returner' : 'Good Customer',
    address: `Street ${i}, HSR Layout, Sector ${i % 3}, Bangalore`,
    emergencyContact: { name: 'Emergency Contact', phone: '9988770000', relation: 'Friend' },
    documents: {
      DL: { type: 'DL', status: 'Verified', number: `DL-KA-REG-${i * 872}`, expiryDate: '2035-10-10', uploadDate: '2026-06-20', fileUri: 'dummy_dl_uri' },
      Aadhaar: { type: 'Aadhaar', status: 'Verified', number: `8899-${4321 + i}-9843`, uploadDate: '2026-06-20', fileUri: 'dummy_aadhaar_uri' },
      PAN: { type: 'PAN', status: 'Verified', number: `ABCDE${i * 123}F`, uploadDate: '2026-06-20', fileUri: 'dummy_pan_uri' },
      Passport: { type: 'Passport', status: 'Not Uploaded' },
      Selfie: { type: 'Selfie', status: 'Verified', uploadDate: '2026-06-20', fileUri: 'dummy_selfie_uri' },
      Signature: { type: 'Signature', status: 'Verified', uploadDate: '2026-06-20', fileUri: 'dummy_sig_uri' },
    },
    notes: ['Regular business client.'],
    rentalHistory: [],
  });
}

const mockBookings: Booking[] = [
  {
    id: 'BK-101',
    customerId: 'c1',
    vehicleId: 'v1',
    status: 'Completed',
    startDate: '2026-06-20',
    endDate: '2026-06-23',
    pickupBranch: 'Pune',
    returnBranch: 'Pune',
    totalAmount: 18000,
    securityDeposit: 5000,
    payments: [
      { id: 'p1', type: 'Advance', amount: 18000, method: 'UPI', status: 'Paid', date: '2026-06-20', receiptNumber: 'REC-101-01' },
      { id: 'p2', type: 'Deposit', amount: 5000, method: 'UPI', status: 'Paid', date: '2026-06-20', receiptNumber: 'REC-101-02' },
      { id: 'p3', type: 'Refund', amount: 5000, method: 'UPI', status: 'Refunded', date: '2026-06-23', receiptNumber: 'REC-101-03' },
    ],
    checklistPhotos: {
      front: 'dummy_ins_front',
      rear: 'dummy_ins_rear',
      left: 'dummy_ins_left',
      right: 'dummy_ins_right',
      dashboard: 'dummy_ins_dash',
      interior: 'dummy_ins_int',
    },
    startOdometer: 14000,
    endOdometer: 14230,
    agreementSigned: true,
    signatureUri: 'dummy_sig_uri',
    notes: ['Returned clean. Full fuel tank.'],
    createdAt: '2026-06-18T10:00:00Z',
  },
  {
    id: 'BK-102',
    customerId: 'c2',
    vehicleId: 'v2',
    status: 'Active',
    startDate: '2026-06-29',
    endDate: '2026-07-01',
    pickupBranch: 'Pune',
    returnBranch: 'Pune',
    totalAmount: 12000,
    securityDeposit: 5000,
    payments: [
      { id: 'p4', type: 'Advance', amount: 12000, method: 'Card', status: 'Paid', date: '2026-06-29', receiptNumber: 'REC-102-01' },
      { id: 'p5', type: 'Deposit', amount: 5000, method: 'Cash', status: 'Paid', date: '2026-06-29', receiptNumber: 'REC-102-02' },
    ],
    checklistPhotos: {
      front: 'dummy_ins_front',
      rear: 'dummy_ins_rear',
      left: 'dummy_ins_left',
      right: 'dummy_ins_right',
      dashboard: 'dummy_ins_dash',
      interior: 'dummy_ins_int',
      odometer: 'dummy_ins_odo',
    },
    startOdometer: 32300,
    agreementSigned: true,
    signatureUri: 'dummy_sig_uri',
    notes: ['Renter requested drop off by 4 PM on 1st July.'],
    createdAt: '2026-06-28T09:00:00Z',
  },
  {
    id: 'BK-103',
    customerId: 'c3',
    vehicleId: 'v6',
    status: 'Active',
    startDate: '2026-06-27',
    endDate: '2026-06-30', // Returning today!
    pickupBranch: 'Lonavala',
    returnBranch: 'Lonavala',
    totalAmount: 9000,
    securityDeposit: 5000,
    payments: [
      { id: 'p6', type: 'Advance', amount: 9000, method: 'UPI', status: 'Paid', date: '2026-06-27', receiptNumber: 'REC-103-01' },
      { id: 'p7', type: 'Deposit', amount: 5000, method: 'UPI', status: 'Paid', date: '2026-06-27', receiptNumber: 'REC-103-02' },
    ],
    checklistPhotos: {
      front: 'dummy_ins_front',
      rear: 'dummy_ins_rear',
      left: 'dummy_ins_left',
      right: 'dummy_ins_right',
      dashboard: 'dummy_ins_dash',
      interior: 'dummy_ins_int',
    },
    startOdometer: 18200,
    agreementSigned: true,
    signatureUri: 'dummy_sig_uri',
    notes: ['CNG model, customer informed about refuelling places.'],
    createdAt: '2026-06-26T15:00:00Z',
  },
  {
    id: 'BK-104',
    customerId: 'c4',
    vehicleId: 'v4',
    status: 'Pending Documents',
    startDate: '2026-07-02',
    endDate: '2026-07-05',
    pickupBranch: 'Pune Airport',
    returnBranch: 'Pune Airport',
    totalAmount: 7500,
    securityDeposit: 5000,
    payments: [
      { id: 'p8', type: 'Pending', amount: 7500, method: 'UPI', status: 'Pending', date: '2026-06-30', receiptNumber: 'REC-104-01' },
      { id: 'p9', type: 'Pending', amount: 5000, method: 'UPI', status: 'Pending', date: '2026-06-30', receiptNumber: 'REC-104-02' },
    ],
    agreementSigned: false,
    notes: ['Documents upload pending from customer.'],
    createdAt: '2026-06-30T11:00:00Z',
  }
];

// Let's populate remaining 20+ bookings to make history look massive and fully active.
for (let i = 5; i <= 22; i++) {
  const customerId = `c${(i % 15) + 1}`;
  const vehicleId = `v${(i % 10) + 1}`;
  const statuses: Booking['status'][] = ['Completed', 'Completed', 'Cancelled', 'Completed', 'Completed'];
  const status = statuses[i % statuses.length];
  mockBookings.push({
    id: `BK-${100 + i}`,
    customerId: customerId,
    vehicleId: vehicleId,
    status: status,
    startDate: `2026-05-${10 + (i % 15)}`,
    endDate: `2026-05-${13 + (i % 15)}`,
    pickupBranch: i % 2 === 0 ? 'Pune' : 'Mumbai',
    returnBranch: i % 2 === 0 ? 'Pune' : 'Mumbai',
    totalAmount: 6000 + (i * 500),
    securityDeposit: 3000,
    payments: [
      { id: `p_adv_${i}`, type: 'Advance', amount: 6000 + (i * 500), method: 'UPI', status: status === 'Cancelled' ? 'Pending' : 'Paid', date: '2026-05-10', receiptNumber: `REC-${100+i}-01` },
      { id: `p_dep_${i}`, type: 'Deposit', amount: 3000, method: 'Cash', status: status === 'Cancelled' ? 'Pending' : 'Paid', date: '2026-05-10', receiptNumber: `REC-${100+i}-02` }
    ],
    agreementSigned: status !== 'Cancelled',
    notes: [],
    createdAt: '2026-05-08T08:00:00Z',
  });
}

const mockActivities: ActivityLog[] = [
  { id: 'act1', timestamp: '2026-06-30T12:10:00Z', user: 'Amit Verma', type: 'payment_received', message: 'Payment of ₹9,000 received for Creta (BK-103)', bookingId: 'BK-103', vehicleId: 'v2' },
  { id: 'act2', timestamp: '2026-06-30T11:30:00Z', user: 'Amit Verma', type: 'vehicle_returned', message: 'Thar MH-12-TR-8910 returned by Amit Trivedi', bookingId: 'BK-101', vehicleId: 'v1' },
  { id: 'act3', timestamp: '2026-06-30T10:42:00Z', user: 'Rahul Sharma', type: 'booking_created', message: 'New booking BK-104 created for Suresh Raina', bookingId: 'BK-104', vehicleId: 'v4' },
  { id: 'act4', timestamp: '2026-06-30T09:15:00Z', user: 'Sanjay Dutt', type: 'maintenance_due', message: 'Fortuner DL-3C-BA-8901 sent to Workshop', vehicleId: 'v3' },
  { id: 'act5', timestamp: '2026-06-29T16:00:00Z', user: 'Amit Verma', type: 'transfer', message: 'Nexon MH-14-GH-1122 cleaned & ready', vehicleId: 'v7' },
  { id: 'act6', timestamp: '2026-06-29T10:00:00Z', user: 'Priya Patel', type: 'payment_received', message: 'Advance of ₹12,000 paid for BK-102', bookingId: 'BK-102', vehicleId: 'v2' },
];

const mockNotifications = [
  { id: 'n1', type: 'maintenance', title: 'Fortuner PUC Expired', body: 'Fortuner DL-3C-BA-8901 PUC expired on July 2nd.', timestamp: '2 hours ago', read: false },
  { id: 'n2', type: 'service', title: 'Creta Insurance Expiring', body: 'Hyundai Creta MH-12-QE-4567 insurance expires in 5 days.', timestamp: '4 hours ago', read: false },
  { id: 'n3', type: 'booking', title: 'Pending Payment Reminder', body: '₹18,000 payment pending for booking BK-104.', timestamp: '5 hours ago', read: false },
  { id: 'n4', type: 'status', title: '3 cars returning today', body: 'Seltos MH-12-YY-7788 and 2 other vehicles returning today.', timestamp: '1 day ago', read: true }
];

// ---------------- ZUSTAND STORE IMPLEMENTATION ----------------

export const useFleetStore = create<FleetState>((set) => ({
  currentUser: null,
  vehicles: mockVehicles,
  bookings: mockBookings,
  customers: mockCustomers,
  employees: mockEmployees,
  branches: mockBranches,
  activities: mockActivities,
  notifications: mockNotifications,

  login: (phone: string, role: 'Owner' | 'Agent', name: string) => {
    set({ currentUser: { name, phone, role, branch: 'Pune Airport' } });
  },

  logout: () => {
    set({ currentUser: null });
  },

  addBooking: (booking: Booking) => {
    set((state) => {
      // Add transaction booking and activity log
      const newActivities: ActivityLog[] = [
        {
          id: `act_${Date.now()}`,
          timestamp: new Date().toISOString(),
          user: state.currentUser?.name || 'System',
          type: 'booking_created',
          message: `Booking ${booking.id} created for ${state.customers.find(c => c.id === booking.customerId)?.name || 'New Customer'}`,
          bookingId: booking.id,
          vehicleId: booking.vehicleId,
        },
        ...state.activities,
      ];

      // Update vehicle status to Reserved
      const updatedVehicles = state.vehicles.map((v) =>
        v.id === booking.vehicleId ? { ...v, status: 'Reserved' as const, currentBookingId: booking.id } : v
      );

      // Add booking ID to customer's rental history
      const updatedCustomers = state.customers.map((c) =>
        c.id === booking.customerId
          ? { ...c, rentalHistory: [booking.id, ...c.rentalHistory] }
          : c
      );

      return {
        bookings: [booking, ...state.bookings],
        activities: newActivities,
        vehicles: updatedVehicles,
        customers: updatedCustomers,
      };
    });
  },

  updateBooking: (bookingId: string, updates: Partial<Booking>) => {
    set((state) => {
      const updatedBookings = state.bookings.map((b) =>
        b.id === bookingId ? { ...b, ...updates } : b
      );

      // Check if status changed to trigger state logic
      let updatedVehicles = state.vehicles;
      let newActivities = state.activities;

      const booking = state.bookings.find((b) => b.id === bookingId);
      if (booking && updates.status && updates.status !== booking.status) {
        newActivities = [
          {
            id: `act_${Date.now()}`,
            timestamp: new Date().toISOString(),
            user: state.currentUser?.name || 'System',
            type: 'status_change',
            message: `Booking ${bookingId} status updated to ${updates.status}`,
            bookingId: bookingId,
            vehicleId: booking.vehicleId,
          },
          ...state.activities,
        ];

        if (updates.status === 'Active') {
          updatedVehicles = state.vehicles.map((v) =>
            v.id === booking.vehicleId ? { ...v, status: 'Picked Up' as const } : v
          );
        } else if (updates.status === 'Returned' || updates.status === 'Completed') {
          updatedVehicles = state.vehicles.map((v) =>
            v.id === booking.vehicleId ? { ...v, status: 'Cleaning' as const } : v
          );
        } else if (updates.status === 'Cancelled') {
          updatedVehicles = state.vehicles.map((v) =>
            v.id === booking.vehicleId ? { ...v, status: 'Available' as const, currentBookingId: undefined } : v
          );
        }
      }

      return {
        bookings: updatedBookings,
        vehicles: updatedVehicles,
        activities: newActivities,
      };
    });
  },

  addPayment: (bookingId: string, payment: Omit<PaymentRecord, 'id' | 'date' | 'receiptNumber'>) => {
    set((state) => {
      const receiptNumber = `REC-${bookingId}-${Date.now().toString().slice(-4)}`;
      const newPaymentRecord: PaymentRecord = {
        ...payment,
        id: `pay_${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        receiptNumber,
      };

      const updatedBookings = state.bookings.map((b) => {
        if (b.id === bookingId) {
          const updatedPayments = [...b.payments, newPaymentRecord];
          
          // Calculate payment status
          const totalPaid = updatedPayments
            .filter((p) => p.type !== 'Refund' && p.status === 'Paid')
            .reduce((sum, p) => sum + p.amount, 0);
          const refundAmount = updatedPayments
            .filter((p) => p.type === 'Refund' && p.status === 'Refunded')
            .reduce((sum, p) => sum + p.amount, 0);

          let paymentStatus: Booking['payments'][0]['status'] = 'Pending';
          if (totalPaid >= b.totalAmount) {
            paymentStatus = 'Paid';
          } else if (totalPaid > 0) {
            paymentStatus = 'Paid'; // Represent partial paid or simplify for mock
          }

          return { ...b, payments: updatedPayments };
        }
        return b;
      });

      const booking = state.bookings.find((b) => b.id === bookingId);
      const activityMsg = `Payment of ₹${payment.amount} (${payment.type}) received for booking ${bookingId}`;
      const newActivities: ActivityLog[] = [
        {
          id: `act_${Date.now()}`,
          timestamp: new Date().toISOString(),
          user: state.currentUser?.name || 'System',
          type: 'payment_received',
          message: activityMsg,
          bookingId: bookingId,
          vehicleId: booking?.vehicleId,
        },
        ...state.activities,
      ];

      return {
        bookings: updatedBookings,
        activities: newActivities,
      };
    });
  },

  updateVehicleStatus: (vehicleId: string, status: Vehicle['status'], branch?: string) => {
    set((state) => {
      const updatedVehicles = state.vehicles.map((v) => {
        if (v.id === vehicleId) {
          const timelineEvent: VehicleTimelineEvent = {
            id: `evt_${Date.now()}`,
            timestamp: new Date().toISOString(),
            type: 'status_change',
            title: `Status Changed to ${status}`,
            description: `Vehicle state updated by ${state.currentUser?.name || 'System'}.`,
            user: state.currentUser?.name || 'System',
          };
          return {
            ...v,
            status,
            currentBranch: branch || v.currentBranch,
            timeline: [timelineEvent, ...v.timeline],
          };
        }
        return v;
      });

      const vehicle = state.vehicles.find((v) => v.id === vehicleId);
      const newActivities: ActivityLog[] = [
        {
          id: `act_${Date.now()}`,
          timestamp: new Date().toISOString(),
          user: state.currentUser?.name || 'System',
          type: 'vehicle_status_change',
          message: `Vehicle ${vehicle?.registrationNumber} status updated to ${status}`,
          vehicleId: vehicleId,
        },
        ...state.activities,
      ];

      return {
        vehicles: updatedVehicles,
        activities: newActivities,
      };
    });
  },

  addVehicleNote: (vehicleId: string, note: string) => {
    set((state) => ({
      vehicles: state.vehicles.map((v) =>
        v.id === vehicleId ? { ...v, notes: [note, ...v.notes] } : v
      ),
    }));
  },

  addVehicleDamage: (vehicleId: string, damage: Vehicle['damageMap'][0]) => {
    set((state) => ({
      vehicles: state.vehicles.map((v) =>
        v.id === vehicleId ? { ...v, damageMap: [damage, ...v.damageMap] } : v
      ),
    }));
  },

  addVehicleService: (vehicleId: string, record: Omit<ServiceRecord, 'id' | 'date'>) => {
    set((state) => {
      const newRecord: ServiceRecord = {
        ...record,
        id: `serv_${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
      };

      const updatedVehicles = state.vehicles.map((v) => {
        if (v.id === vehicleId) {
          const timelineEvent: VehicleTimelineEvent = {
            id: `evt_${Date.now()}`,
            timestamp: new Date().toISOString(),
            type: 'maintenance',
            title: `Service Performed: ${record.type}`,
            description: `${record.notes}. Odo: ${record.odometer} km. Cost: ₹${record.cost}`,
            user: state.currentUser?.name || 'System',
          };
          return {
            ...v,
            serviceHistory: [newRecord, ...v.serviceHistory],
            timeline: [timelineEvent, ...v.timeline],
            odometer: Math.max(v.odometer, record.odometer),
          };
        }
        return v;
      });

      const vehicle = state.vehicles.find((v) => v.id === vehicleId);
      const newActivities: ActivityLog[] = [
        {
          id: `act_${Date.now()}`,
          timestamp: new Date().toISOString(),
          user: state.currentUser?.name || 'System',
          type: 'service_completed',
          message: `Service '${record.type}' completed for ${vehicle?.registrationNumber}. Cost: ₹${record.cost}`,
          vehicleId: vehicleId,
        },
        ...state.activities,
      ];

      return {
        vehicles: updatedVehicles,
        activities: newActivities,
      };
    });
  },

  transferVehicle: (vehicleId: string, destinationBranch: string) => {
    set((state) => {
      const vehicle = state.vehicles.find((v) => v.id === vehicleId);
      const sourceBranch = vehicle?.currentBranch || 'Unknown';

      const updatedVehicles = state.vehicles.map((v) => {
        if (v.id === vehicleId) {
          const timelineEvent: VehicleTimelineEvent = {
            id: `evt_${Date.now()}`,
            timestamp: new Date().toISOString(),
            type: 'transfer',
            title: `Transferred to ${destinationBranch}`,
            description: `Moved from ${sourceBranch} to ${destinationBranch}.`,
            user: state.currentUser?.name || 'System',
          };
          return {
            ...v,
            currentBranch: destinationBranch,
            status: 'Available' as const, // Put it as available at the destination
            timeline: [timelineEvent, ...v.timeline],
          };
        }
        return v;
      });

      const newActivities: ActivityLog[] = [
        {
          id: `act_${Date.now()}`,
          timestamp: new Date().toISOString(),
          user: state.currentUser?.name || 'System',
          type: 'transfer',
          message: `Vehicle ${vehicle?.registrationNumber} transferred from ${sourceBranch} to ${destinationBranch}`,
          vehicleId: vehicleId,
        },
        ...state.activities,
      ];

      return {
        vehicles: updatedVehicles,
        activities: newActivities,
      };
    });
  },

  addCustomer: (customer: Customer) => {
    set((state) => ({
      customers: [customer, ...state.customers],
    }));
  },

  updateCustomer: (customerId: string, updates: Partial<Customer>) => {
    set((state) => ({
      customers: state.customers.map((c) =>
        c.id === customerId ? { ...c, ...updates } : c
      ),
    }));
  },

  addCustomerNote: (customerId: string, note: string) => {
    set((state) => ({
      customers: state.customers.map((c) =>
        c.id === customerId ? { ...c, notes: [note, ...c.notes] } : c
      ),
    }));
  },

  addActivity: (type: string, message: string, user?: string, bookingId?: string, vehicleId?: string) => {
    set((state) => ({
      activities: [
        {
          id: `act_${Date.now()}`,
          timestamp: new Date().toISOString(),
          user: user || state.currentUser?.name || 'System',
          type,
          message,
          bookingId,
          vehicleId,
        },
        ...state.activities,
      ],
    }));
  },

  addNotification: (type: string, title: string, body: string) => {
    set((state) => ({
      notifications: [
        {
          id: `notif_${Date.now()}`,
          type,
          title,
          body,
          timestamp: 'Just now',
          read: false,
        },
        ...state.notifications,
      ],
    }));
  },

  markNotificationsAsRead: () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
    }));
  },

  holdVehicle: (vehicleId: string) => {
    set((state) => {
      const updatedVehicles = state.vehicles.map((v) => {
        if (v.id === vehicleId) {
          const timelineEvent: VehicleTimelineEvent = {
            id: `evt_${Date.now()}`,
            timestamp: new Date().toISOString(),
            type: 'status_change',
            title: 'Vehicle Placed on Hold',
            description: `Vehicle put on a 5-minute hold by ${state.currentUser?.name || 'System'}.`,
            user: state.currentUser?.name || 'System',
          };
          return {
            ...v,
            status: 'Hold' as const,
            holdUntil: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
            timeline: [timelineEvent, ...v.timeline],
          };
        }
        return v;
      });
      return { vehicles: updatedVehicles };
    });
  },

  releaseHold: (vehicleId: string) => {
    set((state) => {
      const updatedVehicles = state.vehicles.map((v) => {
        if (v.id === vehicleId) {
          const timelineEvent: VehicleTimelineEvent = {
            id: `evt_${Date.now()}`,
            timestamp: new Date().toISOString(),
            type: 'status_change',
            title: 'Hold Released',
            description: `Vehicle hold released by ${state.currentUser?.name || 'System'}.`,
            user: state.currentUser?.name || 'System',
          };
          return {
            ...v,
            status: 'Available' as const,
            holdUntil: null,
            timeline: [timelineEvent, ...v.timeline],
          };
        }
        return v;
      });
      return { vehicles: updatedVehicles };
    });
  },

  reserveVehicle: (vehicleId: string) => {
    set((state) => {
      const updatedVehicles = state.vehicles.map((v) => {
        if (v.id === vehicleId) {
          const timelineEvent: VehicleTimelineEvent = {
            id: `evt_${Date.now()}`,
            timestamp: new Date().toISOString(),
            type: 'status_change',
            title: 'Vehicle Reserved (₹500 Paid)',
            description: `Advanced reservation completed by ${state.currentUser?.name || 'System'}.`,
            user: state.currentUser?.name || 'System',
          };
          return {
            ...v,
            status: 'Reserved' as const,
            holdUntil: null,
            timeline: [timelineEvent, ...v.timeline],
          };
        }
        return v;
      });
      return { vehicles: updatedVehicles };
    });
  },

  cancelReservation: (vehicleId: string) => {
    set((state) => {
      const updatedVehicles = state.vehicles.map((v) => {
        if (v.id === vehicleId) {
          const timelineEvent: VehicleTimelineEvent = {
            id: `evt_${Date.now()}`,
            timestamp: new Date().toISOString(),
            type: 'status_change',
            title: 'Reservation Cancelled',
            description: `Reservation cancelled and refunded. Vehicle is available.`,
            user: state.currentUser?.name || 'System',
          };
          return {
            ...v,
            status: 'Available' as const,
            holdUntil: null,
            timeline: [timelineEvent, ...v.timeline],
          };
        }
        return v;
      });
      return { vehicles: updatedVehicles };
    });
  },

  toast: { visible: false, message: '', type: 'success' },
  showToast: (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    set({ toast: { visible: true, message, type } });
    setTimeout(() => {
      set((state) => (state.toast.message === message ? { toast: { ...state.toast, visible: false } } : {}));
    }, 2500);
  },
  hideToast: () => {
    set((state) => ({ toast: { ...state.toast, visible: false } }));
  },
}));

