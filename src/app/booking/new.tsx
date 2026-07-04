import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useFleetStore, Customer, Booking } from '@/store/useFleetStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { SignaturePad } from '@/components/ui/SignaturePad';
import { Feather } from '@expo/vector-icons';

export default function BookingWizard() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { vehicles, customers, addBooking, showToast, currentUser } = useFleetStore();

  const [step, setStep] = useState(1);

  // Form State
  const [selectedVehicleId, setSelectedVehicleId] = useState(params.vehicleId as string || '');
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [searchCust, setSearchCust] = useState('');
  const [showCustDropdown, setShowCustDropdown] = useState(false);

  // Pre-load default values based on vehicle/customer selection
  const vehicle = vehicles.find(v => v.id === selectedVehicleId);
  const customer = customers.find(c => c.id === selectedCustomerId);

  // New Customer Form (if creating new)
  const [newCustName, setNewCustName] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('');
  const [newCustAddress, setNewCustAddress] = useState('');

  // Local edit states for documents
  const [editingDoc, setEditingDoc] = useState<{ [key: string]: boolean }>({});
  
  // Local document input values
  const [dlNumber, setDlNumber] = useState('');
  const [dlExpiry, setDlExpiry] = useState('');
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [panNumber, setPanNumber] = useState('');
  
  // Local document photo URIs
  const [dlPhoto, setDlPhoto] = useState<string | null>(null);
  const [aadhaarPhoto, setAadhaarPhoto] = useState<string | null>(null);
  const [panPhoto, setPanPhoto] = useState<string | null>(null);

  // Sync state when customer is selected or updated
  useEffect(() => {
    if (customer) {
      setDlNumber(customer.documents.DL?.number || '');
      setDlExpiry(customer.documents.DL?.expiryDate || '2035-10-10');
      setDlPhoto(customer.documents.DL?.fileUri || null);

      setAadhaarNumber(customer.documents.Aadhaar?.number || '');
      setAadhaarPhoto(customer.documents.Aadhaar?.fileUri || null);

      setPanNumber(customer.documents.PAN?.number || '');
      setPanPhoto(customer.documents.PAN?.fileUri || null);
    } else {
      setDlNumber('');
      setDlExpiry('');
      setDlPhoto(null);
      setAadhaarNumber('');
      setAadhaarPhoto(null);
      setPanNumber('');
      setPanPhoto(null);
    }
  }, [selectedCustomerId, customer]);

  const handleSaveDocument = (type: 'DL' | 'Aadhaar' | 'PAN') => {
    if (!selectedCustomerId) return;
    
    const currentCust = useFleetStore.getState().customers.find(c => c.id === selectedCustomerId);
    if (!currentCust) return;

    let updatedDocObj = { ...currentCust.documents };
    if (type === 'DL') {
      if (!dlNumber) {
        showToast('Please enter Driving Licence number.', 'error');
        return;
      }
      updatedDocObj.DL = {
        type: 'DL',
        status: 'Verified',
        number: dlNumber,
        expiryDate: dlExpiry || '2035-10-10',
        uploadDate: new Date().toISOString().split('T')[0],
        fileUri: dlPhoto || 'simulated_dl_uri'
      };
    } else if (type === 'Aadhaar') {
      if (!aadhaarNumber) {
        showToast('Please enter Aadhaar number.', 'error');
        return;
      }
      updatedDocObj.Aadhaar = {
        type: 'Aadhaar',
        status: 'Verified',
        number: aadhaarNumber,
        uploadDate: new Date().toISOString().split('T')[0],
        fileUri: aadhaarPhoto || 'simulated_aadhaar_uri'
      };
    } else if (type === 'PAN') {
      if (!panNumber) {
        showToast('Please enter PAN card number.', 'error');
        return;
      }
      updatedDocObj.PAN = {
        type: 'PAN',
        status: 'Verified',
        number: panNumber,
        uploadDate: new Date().toISOString().split('T')[0],
        fileUri: panPhoto || 'simulated_pan_uri'
      };
    }

    useFleetStore.getState().updateCustomer(selectedCustomerId, { documents: updatedDocObj });
    setEditingDoc(prev => ({ ...prev, [type]: false }));
    showToast(`${type} document saved successfully.`, 'success');
  };

  // Step 3: Camera Mock states for Inspection
  const [activePhotoSlot, setActivePhotoSlot] = useState<string | null>(null);
  const [insPhotos, setInsPhotos] = useState<{ [key: string]: string }>({});
  const [checkoutOdo, setCheckoutOdo] = useState('14230');
  const [damagePart, setDamagePart] = useState('');
  const [damageSeverity, setDamageSeverity] = useState<'light' | 'medium' | 'heavy'>('light');
  const [damageNote, setDamageNote] = useState('');
  const [damageList, setDamageList] = useState<{ part: string; severity: 'light' | 'medium' | 'heavy'; notes: string }[]>([]);

  // Step 4: Signature State
  const [signatureUri, setSignatureUri] = useState<string | null>(null);
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Step 2: Customer Selfie Photo
  const [customerSelfie, setCustomerSelfie] = useState<string | null>(null);

  // Step 5: Payment state
  const [advancePaid, setAdvancePaid] = useState('12000');
  const [securityDeposit, setSecurityDeposit] = useState('5000');
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Cash' | 'Card' | 'Bank Transfer'>('UPI');
  const [receiptDownloaded, setReceiptDownloaded] = useState(false);
  const [finishing, setFinishing] = useState(false);



  useEffect(() => {
    if (vehicle) {
      setCheckoutOdo(String(vehicle.odometer));
      // Base pricing: Creta/Thar is typically ₹4,000/day
      setAdvancePaid('12000'); // Default 3 days rental
    }
  }, [selectedVehicleId]);

  const handleSelectCustomer = (c: Customer) => {
    setSelectedCustomerId(c.id);
    setSearchCust(c.name);
    setShowCustDropdown(false);
  };

  const handleCreateCustomer = () => {
    if (!newCustName || !newCustPhone) {
      showToast('Please fill Name and Phone.', 'error');
      return;
    }
    const newId = `c_${Date.now()}`;
    const newCust: Customer = {
      id: newId,
      name: newCustName,
      phone: newCustPhone,
      email: `${newCustName.toLowerCase().replace(/\s+/g, '.')}@mock.com`,
      status: 'Verified',
      customerRating: 'Good Customer',
      address: newCustAddress || 'Registered Address, Pune',
      emergencyContact: { name: 'Emergency Contact', phone: '9822011223', relation: 'Friend' },
      documents: {
        DL: { type: 'DL', status: 'Not Uploaded' },
        Aadhaar: { type: 'Aadhaar', status: 'Not Uploaded' },
        PAN: { type: 'PAN', status: 'Not Uploaded' },
        Passport: { type: 'Passport', status: 'Not Uploaded' },
        Selfie: { type: 'Selfie', status: 'Not Uploaded' },
        Signature: { type: 'Signature', status: 'Not Uploaded' },
      },
      notes: [],
      rentalHistory: [],
    };

    // Normally we'd push to customers list via store action
    useFleetStore.getState().addCustomer(newCust);
    setSelectedCustomerId(newId);
    setSearchCust(newCustName);
    showToast('Customer created successfully.', 'success');
  };

  // Step transitions
  const nextStep = () => {
    if (step === 1) {
      if (!selectedVehicleId) {
        showToast('Please select a vehicle first.', 'error');
        return;
      }
      if (!selectedCustomerId) {
        showToast('Please select or create a customer.', 'error');
        return;
      }
    }
    if (step === 2) {
      const hasDl = customer?.documents.DL?.status === 'Verified' || customer?.documents.DL?.status === 'Uploaded';
      const hasAadhaar = customer?.documents.Aadhaar?.status === 'Verified' || customer?.documents.Aadhaar?.status === 'Uploaded';
      const hasPan = customer?.documents.PAN?.status === 'Verified' || customer?.documents.PAN?.status === 'Uploaded';

      if (!hasDl || !hasAadhaar || !hasPan) {
        showToast('Please enter details, capture photo, and click Save for all documents.', 'error');
        return;
      }
      if (!customerSelfie) {
        showToast('Customer live photo capture is required.', 'error');
        return;
      }
    }
    if (step === 3) {
      const requiredSlots = ['front', 'rear', 'left', 'right', 'dashboard', 'interior'];
      const missing = requiredSlots.filter(slot => !insPhotos[slot]);
      if (missing.length > 0) {
        showToast(`Please capture photos for: ${missing.join(', ')}`, 'error');
        return;
      }
      if (!checkoutOdo) {
        showToast('Odometer reading is required.', 'error');
        return;
      }
    }
    if (step === 4) {
      if (!agreeTerms || !signatureUri) {
        showToast('Please agree to terms and sign to continue.', 'error');
        return;
      }
    }
    setStep(prev => prev + 1);
  };

  const prevStep = () => {
    setStep(prev => prev - 1);
  };

  // Capture simulated photos
  const simulatePhotoCapture = (slot: string) => {
    setActivePhotoSlot(slot);
  };

  const simulateSelfieCapture = () => {
    setCustomerSelfie('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500');
    showToast('Customer live photo captured.', 'success');
  };

  const handleConfirmPhoto = () => {
    if (!activePhotoSlot) return;
    
    if (activePhotoSlot === 'dl_front') {
      setDlPhoto('https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?w=400');
      showToast('Driving Licence photo captured.', 'success');
    } else if (activePhotoSlot === 'aadhaar_front') {
      setAadhaarPhoto('https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?w=400');
      showToast('Aadhaar Card photo captured.', 'success');
    } else if (activePhotoSlot === 'pan_front') {
      setPanPhoto('https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?w=400');
      showToast('PAN Card photo captured.', 'success');
    } else {
      setInsPhotos(prev => ({
        ...prev,
        [activePhotoSlot]: 'https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?w=400'
      }));
      showToast(`${activePhotoSlot.toUpperCase()} photo captured.`, 'success');
    }
    
    setActivePhotoSlot(null);
  };

  // Add damage in inspection
  const handleAddDamage = () => {
    if (!damagePart.trim()) return;
    setDamageList(prev => [...prev, { part: damagePart, severity: damageSeverity, notes: damageNote }]);
    setDamagePart('');
    setDamageNote('');
    showToast('Damage logged in checkout report.', 'info');
  };

  const handleFinishBooking = () => {
    setFinishing(true);
    setTimeout(() => {
      setFinishing(false);

      const bookingId = `BK-${Date.now().toString().slice(-4)}`;
      const newB: Booking = {
        id: bookingId,
        customerId: selectedCustomerId,
        vehicleId: selectedVehicleId,
        status: 'Active',
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 3 days
        pickupBranch: vehicle?.currentBranch || 'Pune Airport',
        returnBranch: vehicle?.currentBranch || 'Pune Airport',
        totalAmount: Number(advancePaid),
        securityDeposit: Number(securityDeposit),
        payments: [
          {
            id: `pay_${Date.now()}`,
            type: 'Advance',
            amount: Number(advancePaid),
            method: paymentMethod,
            status: 'Paid',
            date: new Date().toISOString().split('T')[0],
            receiptNumber: `REC-${bookingId}-01`,
          },
          {
            id: `pay_dep_${Date.now()}`,
            type: 'Deposit',
            amount: Number(securityDeposit),
            method: paymentMethod,
            status: 'Paid',
            date: new Date().toISOString().split('T')[0],
            receiptNumber: `REC-${bookingId}-02`,
          }
        ],
        checklistPhotos: insPhotos,
        startOdometer: Number(checkoutOdo),
        agreementSigned: true,
        signatureUri: signatureUri || 'sig_mock',
        notes: damageList.map(d => `${d.part} (${d.severity}): ${d.notes}`),
        createdAt: new Date().toISOString(),
      };

      // Add booking globally and update vehicle status
      addBooking(newB);
      useFleetStore.getState().updateVehicleStatus(selectedVehicleId, 'Picked Up');
      
      // Update vehicle damages and checkout details
      damageList.forEach(d => {
        useFleetStore.getState().addVehicleDamage(selectedVehicleId, d);
      });

      showToast('Booking complete. Vehicle Picked Up.', 'success');
      router.replace(currentUser?.role === 'Owner' ? '/(owner)' : '/(agent)');
    }, 1200);
  };

  return (
    <SafeAreaView style={{ flex: 1 }} className="bg-white">
      {/* Header */}
      <View className="flex-row justify-between items-center px-6 py-4 border-b border-slate-50 bg-white">
        <TouchableOpacity onPress={() => step > 1 ? prevStep() : router.back()} activeOpacity={0.7} className="w-10 h-10 border border-slate-100 rounded-xl items-center justify-center">
          <Feather name="arrow-left" size={16} color="#0F172A" />
        </TouchableOpacity>
        <View className="items-center">
          <Text className="text-slate-400 text-[9px] font-bold uppercase tracking-widest">
            STEP {step} OF 5
          </Text>
          <Text className="text-slate-900 font-extrabold text-sm tracking-tight mt-0.5">
            {step === 1 && 'Customer & Vehicle'}
            {step === 2 && 'Verify Documents'}
            {step === 3 && 'Inspection Report'}
            {step === 4 && 'Rental Agreement'}
            {step === 5 && 'Process Payment'}
          </Text>
        </View>
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7} className="w-10 h-10 border border-slate-100 rounded-xl items-center justify-center">
          <Feather name="x" size={16} color="#EF4444" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-grow px-6 pt-5" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        
        {/* STEP 1: CUSTOMER & VEHICLE */}
        {step === 1 && (
          <View className="space-y-4">
            <Text className="text-slate-400 text-[10px] font-extrabold uppercase tracking-widest mb-1">
              Select Vehicle
            </Text>
            <View className="border border-slate-200 rounded-xl p-3.5 bg-slate-50/50 flex-row items-center justify-between">
              {vehicle ? (
                <View className="flex-row items-center flex-1">
                  <Image source={typeof vehicle.images[0] === 'number' ? vehicle.images[0] : { uri: vehicle.images[0] }} className="w-12 h-12 rounded-lg bg-slate-200 mr-3" />
                  <View>
                    <Text className="text-slate-900 font-bold text-sm">{vehicle.model}</Text>
                    <Text className="text-slate-400 text-xs font-semibold uppercase mt-0.5">{vehicle.registrationNumber}</Text>
                  </View>
                </View>
              ) : (
                <Text className="text-slate-500 text-xs font-medium">Select a vehicle from fleet list</Text>
              )}
              
              <TouchableOpacity 
                onPress={() => router.push(currentUser?.role === 'Owner' ? '/(owner)/fleet' : '/(agent)/fleet')}
                className="bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800"
              >
                <Text className="text-white text-[10px] font-bold uppercase tracking-wide">Browse</Text>
              </TouchableOpacity>
            </View>

            <Text className="text-slate-400 text-[10px] font-extrabold uppercase tracking-widest mt-6 mb-1">
              Find Customer
            </Text>
            
            <View className="relative">
              <Input
                placeholder="Search name or mobile number..."
                value={searchCust}
                onChangeText={(text) => {
                  setSearchCust(text);
                  setShowCustDropdown(true);
                }}
                onFocus={() => setShowCustDropdown(true)}
                leftIcon={<Feather name="search" size={14} color="#94A3B8" />}
              />
              
              {showCustDropdown && searchCust.length > 0 && (
                <View className="absolute top-14 left-0 right-0 bg-white border border-slate-100 rounded-xl shadow-lg z-50 max-h-40 overflow-hidden">
                  <ScrollView nestedScrollEnabled>
                    {customers
                      .filter(c => c.name.toLowerCase().includes(searchCust.toLowerCase()) || c.phone.includes(searchCust))
                      .map(c => (
                        <TouchableOpacity
                          key={c.id}
                          onPress={() => handleSelectCustomer(c)}
                          className="px-4 py-3 border-b border-slate-50 active:bg-slate-50"
                        >
                          <Text className="text-slate-800 text-xs font-bold">{c.name}</Text>
                          <Text className="text-slate-400 text-[10px] font-semibold mt-0.5">+91 {c.phone} • {c.customerRating}</Text>
                        </TouchableOpacity>
                      ))}
                  </ScrollView>
                </View>
              )}
            </View>

            {selectedCustomerId && (
              <View className="bg-emerald-50/50 border border-emerald-100 p-4 rounded-xl flex-row justify-between items-center">
                <View>
                  <Text className="text-emerald-800 text-xs font-bold">Selected Customer: {customer?.name}</Text>
                  <Text className="text-emerald-600 text-[10px] font-semibold mt-0.5">+91 {customer?.phone}</Text>
                </View>
                <TouchableOpacity onPress={() => setSelectedCustomerId('')}>
                  <Feather name="trash-2" size={14} color="#EF4444" />
                </TouchableOpacity>
              </View>
            )}

            {!selectedCustomerId && (
              <View className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-3 mt-6">
                <Text className="text-slate-800 text-xs font-bold uppercase tracking-wide">Or Register New Customer</Text>
                <Input placeholder="Full Name" value={newCustName} onChangeText={setNewCustName} />
                <Input placeholder="Mobile Number" value={newCustPhone} onChangeText={setNewCustPhone} keyboardType="phone-pad" />
                <Input placeholder="Address Details" value={newCustAddress} onChangeText={setNewCustAddress} />
                <Button label="Register & Select" variant="outline" size="sm" onPress={handleCreateCustomer} />
              </View>
            )}

            <View className="pt-6">
              <Button label="Continue to Documents" onPress={nextStep} />
            </View>
          </View>
        )}

        {/* STEP 2: DOCUMENTS */}
        {step === 2 && (
          <View className="space-y-6">
            <Text className="text-slate-400 text-[10px] font-extrabold uppercase tracking-widest mb-1">
              Verify Customer Credentials
            </Text>

            {/* DL */}
            {(!customer?.documents.DL || customer.documents.DL.status === 'Not Uploaded' || editingDoc['DL']) ? (
              <View className="border border-slate-200 p-4 rounded-xl bg-slate-50/50 space-y-3">
                <View className="flex-row justify-between items-center">
                  <Text className="text-slate-800 text-xs font-bold">Driving Licence (DL) Details</Text>
                  {customer?.documents.DL?.status === 'Verified' && (
                    <TouchableOpacity onPress={() => setEditingDoc(prev => ({ ...prev, DL: false }))}>
                      <Text className="text-slate-400 text-xs font-bold">Cancel</Text>
                    </TouchableOpacity>
                  )}
                </View>
                <Input
                  placeholder="DL Number (e.g. DL-MH12-20150043210)"
                  value={dlNumber}
                  onChangeText={setDlNumber}
                />
                <Input
                  placeholder="Expiry Date (e.g. 2035-10-10)"
                  value={dlExpiry}
                  onChangeText={setDlExpiry}
                />
                <View className="flex-row items-center justify-between py-1">
                  <TouchableOpacity
                    onPress={() => simulatePhotoCapture('dl_front')}
                    className="flex-row items-center border border-slate-200 bg-white px-3 py-2 rounded-lg"
                  >
                    <Feather name="camera" size={14} color="#0F172A" />
                    <Text className="text-slate-800 text-xs font-bold ml-1.5">
                      {dlPhoto ? 'DL Photo Captured ✓' : 'Capture DL Photo'}
                    </Text>
                  </TouchableOpacity>
                  {dlPhoto && (
                    <Image source={{ uri: dlPhoto }} className="w-12 h-8 rounded border border-slate-200" />
                  )}
                </View>
                <Button label="Save & Verify DL" size="sm" onPress={() => handleSaveDocument('DL')} />
              </View>
            ) : (
              <View className="border border-slate-100 p-4 rounded-xl flex-row items-center justify-between bg-white shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                <View className="flex-1">
                  <Text className="text-slate-800 text-xs font-bold">Driving Licence (DL)</Text>
                  <Text className="text-slate-500 text-[10px] font-semibold mt-0.5">
                    {customer?.documents.DL?.number} • Exp: {customer?.documents.DL?.expiryDate}
                  </Text>
                  <Text className="text-emerald-600 text-[9px] font-extrabold mt-1">Verified ✓</Text>
                </View>
                <TouchableOpacity
                  onPress={() => setEditingDoc(prev => ({ ...prev, DL: true }))}
                  className="w-8 h-8 rounded-lg items-center justify-center border border-slate-100 bg-slate-50"
                >
                  <Feather name="edit-2" size={14} color="#64748B" />
                </TouchableOpacity>
              </View>
            )}

            {/* Aadhaar */}
            {(!customer?.documents.Aadhaar || customer.documents.Aadhaar.status === 'Not Uploaded' || editingDoc['Aadhaar']) ? (
              <View className="border border-slate-200 p-4 rounded-xl bg-slate-50/50 space-y-3">
                <View className="flex-row justify-between items-center">
                  <Text className="text-slate-800 text-xs font-bold">Aadhaar Card (UIDAI) Details</Text>
                  {customer?.documents.Aadhaar?.status === 'Verified' && (
                    <TouchableOpacity onPress={() => setEditingDoc(prev => ({ ...prev, Aadhaar: false }))}>
                      <Text className="text-slate-400 text-xs font-bold">Cancel</Text>
                    </TouchableOpacity>
                  )}
                </View>
                <Input
                  placeholder="12-digit Aadhaar Number (e.g. 3422-9843-1120)"
                  value={aadhaarNumber}
                  onChangeText={setAadhaarNumber}
                  keyboardType="numeric"
                />
                <View className="flex-row items-center justify-between py-1">
                  <TouchableOpacity
                    onPress={() => simulatePhotoCapture('aadhaar_front')}
                    className="flex-row items-center border border-slate-200 bg-white px-3 py-2 rounded-lg"
                  >
                    <Feather name="camera" size={14} color="#0F172A" />
                    <Text className="text-slate-800 text-xs font-bold ml-1.5">
                      {aadhaarPhoto ? 'Aadhaar Photo Captured ✓' : 'Capture Aadhaar Photo'}
                    </Text>
                  </TouchableOpacity>
                  {aadhaarPhoto && (
                    <Image source={{ uri: aadhaarPhoto }} className="w-12 h-8 rounded border border-slate-200" />
                  )}
                </View>
                <Button label="Save & Verify Aadhaar" size="sm" onPress={() => handleSaveDocument('Aadhaar')} />
              </View>
            ) : (
              <View className="border border-slate-100 p-4 rounded-xl flex-row items-center justify-between bg-white shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                <View className="flex-1">
                  <Text className="text-slate-800 text-xs font-bold">Aadhaar Card (UIDAI)</Text>
                  <Text className="text-slate-500 text-[10px] font-semibold mt-0.5">
                    {customer?.documents.Aadhaar?.number}
                  </Text>
                  <Text className="text-emerald-600 text-[9px] font-extrabold mt-1">Verified ✓</Text>
                </View>
                <TouchableOpacity
                  onPress={() => setEditingDoc(prev => ({ ...prev, Aadhaar: true }))}
                  className="w-8 h-8 rounded-lg items-center justify-center border border-slate-100 bg-slate-50"
                >
                  <Feather name="edit-2" size={14} color="#64748B" />
                </TouchableOpacity>
              </View>
            )}

            {/* PAN */}
            {(!customer?.documents.PAN || customer.documents.PAN.status === 'Not Uploaded' || editingDoc['PAN']) ? (
              <View className="border border-slate-200 p-4 rounded-xl bg-slate-50/50 space-y-3">
                <View className="flex-row justify-between items-center">
                  <Text className="text-slate-800 text-xs font-bold">PAN Card Details</Text>
                  {customer?.documents.PAN?.status === 'Verified' && (
                    <TouchableOpacity onPress={() => setEditingDoc(prev => ({ ...prev, PAN: false }))}>
                      <Text className="text-slate-400 text-xs font-bold">Cancel</Text>
                    </TouchableOpacity>
                  )}
                </View>
                <Input
                  placeholder="10-digit PAN Number (e.g. ABCDE1234F)"
                  value={panNumber}
                  onChangeText={setPanNumber}
                />
                <View className="flex-row items-center justify-between py-1">
                  <TouchableOpacity
                    onPress={() => simulatePhotoCapture('pan_front')}
                    className="flex-row items-center border border-slate-200 bg-white px-3 py-2 rounded-lg"
                  >
                    <Feather name="camera" size={14} color="#0F172A" />
                    <Text className="text-slate-800 text-xs font-bold ml-1.5">
                      {panPhoto ? 'PAN Photo Captured ✓' : 'Capture PAN Photo'}
                    </Text>
                  </TouchableOpacity>
                  {panPhoto && (
                    <Image source={{ uri: panPhoto }} className="w-12 h-8 rounded border border-slate-200" />
                  )}
                </View>
                <Button label="Save & Verify PAN" size="sm" onPress={() => handleSaveDocument('PAN')} />
              </View>
            ) : (
              <View className="border border-slate-100 p-4 rounded-xl flex-row items-center justify-between bg-white shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                <View className="flex-1">
                  <Text className="text-slate-800 text-xs font-bold">PAN Card</Text>
                  <Text className="text-slate-500 text-[10px] font-semibold mt-0.5">
                    {customer?.documents.PAN?.number}
                  </Text>
                  <Text className="text-emerald-600 text-[9px] font-extrabold mt-1">Verified ✓</Text>
                </View>
                <TouchableOpacity
                  onPress={() => setEditingDoc(prev => ({ ...prev, PAN: true }))}
                  className="w-8 h-8 rounded-lg items-center justify-center border border-slate-100 bg-slate-50"
                >
                  <Feather name="edit-2" size={14} color="#64748B" />
                </TouchableOpacity>
              </View>
            )}

            {/* Customer Selfie */}
            <Text className="text-slate-400 text-[10px] font-extrabold uppercase tracking-widest mt-2 mb-1">
              Identity Verification
            </Text>
            <View className="border border-slate-100 p-4 rounded-xl flex-row items-center justify-between bg-white">
              <View className="flex-1 pr-4">
                <Text className="text-slate-800 text-xs font-bold">Live Customer Photo</Text>
                <Text className="text-slate-400 text-[10px] font-semibold mt-0.5">Capture portrait of the customer for facial matching</Text>
                {customerSelfie ? (
                  <Text className="text-emerald-600 text-[9px] font-extrabold mt-1">Photo Captured Successfully</Text>
                ) : (
                  <Text className="text-red-500 text-[9px] font-extrabold mt-1">Capture Required</Text>
                )}
              </View>
              <TouchableOpacity 
                onPress={simulateSelfieCapture} 
                className={`w-14 h-14 rounded-xl items-center justify-center border ${
                  customerSelfie ? 'border-emerald-200 bg-emerald-50' : 'border-slate-200 bg-slate-50'
                } overflow-hidden`}
              >
                {customerSelfie ? (
                  <Image source={{ uri: customerSelfie }} className="w-full h-full" resizeMode="cover" />
                ) : (
                  <Feather name="camera" size={18} color="#64748B" />
                )}
              </TouchableOpacity>
            </View>

            <View className="pt-6 space-y-2">
              <Button label="Continue to Inspection" onPress={nextStep} />
              <Button label="Back" variant="ghost" onPress={prevStep} />
            </View>
          </View>
        )}

        {/* STEP 3: INSPECTION */}
        {step === 3 && (
          <View className="space-y-4">
            <Text className="text-slate-400 text-[10px] font-extrabold uppercase tracking-widest mb-1">
              Odometer Reading
            </Text>
            <Input
              placeholder="Odometer at checkout (km)"
              value={checkoutOdo}
              onChangeText={setCheckoutOdo}
              keyboardType="numeric"
              leftIcon={<Feather name="activity" size={14} color="#94A3B8" />}
            />

            <Text className="text-slate-400 text-[10px] font-extrabold uppercase tracking-widest mt-4 mb-2">
              Inspection Photos Grid (Camera Capture)
            </Text>
            
            <View className="flex-row flex-wrap justify-between">
              {['front', 'rear', 'left', 'right', 'dashboard', 'interior'].map((slot) => {
                const captured = insPhotos[slot];
                return (
                  <TouchableOpacity
                    key={slot}
                    onPress={() => simulatePhotoCapture(slot)}
                    activeOpacity={0.7}
                    className="w-[48%] h-28 border border-dashed border-slate-300 rounded-xl mb-3 items-center justify-center overflow-hidden bg-slate-50"
                  >
                    {captured ? (
                      <View className="w-full h-full relative">
                        <Image source={{ uri: captured }} className="w-full h-full" resizeMode="cover" />
                        <View className="absolute bottom-2 left-2 bg-slate-900/80 px-2 py-0.5 rounded">
                          <Text className="text-white text-[8px] font-bold uppercase tracking-wider">{slot}</Text>
                        </View>
                      </View>
                    ) : (
                      <View className="items-center">
                        <Feather name="camera" size={18} color="#64748B" />
                        <Text className="text-slate-500 text-[10px] font-bold uppercase tracking-wide mt-1.5">{slot}</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Damage Logger */}
            <Text className="text-slate-400 text-[10px] font-extrabold uppercase tracking-widest mt-6 mb-2">
              Log Damages & Dents
            </Text>
            <View className="border border-slate-200 p-4 rounded-xl bg-slate-50/50 space-y-3">
              <Input placeholder="Affected Part (e.g. Front Bumper)" value={damagePart} onChangeText={setDamagePart} />
              <Input placeholder="Details (e.g. 2-inch scratch)" value={damageNote} onChangeText={setDamageNote} />
              
              <View className="flex-row space-x-2">
                {['light', 'medium', 'heavy'].map((sev) => (
                  <TouchableOpacity
                    key={sev}
                    onPress={() => setDamageSeverity(sev as any)}
                    className={`flex-1 py-1.5 rounded-lg border items-center ${
                      damageSeverity === sev
                        ? 'bg-slate-900 border-slate-900'
                        : 'bg-white border-slate-200'
                    }`}
                  >
                    <Text className={`text-[10px] font-bold uppercase tracking-wide ${
                      damageSeverity === sev ? 'text-white' : 'text-slate-600'
                    }`}>
                      {sev}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Button label="Log Scratch/Dent" variant="outline" size="sm" onPress={handleAddDamage} />
            </View>

            {damageList.length > 0 && (
              <View className="bg-slate-50 border border-slate-100 rounded-xl p-3 space-y-1.5 mt-2">
                <Text className="text-slate-800 text-[10px] font-extrabold uppercase tracking-wide">Checkout Damages:</Text>
                {damageList.map((d, i) => (
                  <Text key={i} className="text-slate-600 text-xs">
                    • {d.part} ({d.severity}): {d.notes}
                  </Text>
                ))}
              </View>
            )}

            <View className="pt-6 space-y-2">
              <Button label="Continue to Agreement" onPress={nextStep} />
              <Button label="Back" variant="ghost" onPress={prevStep} />
            </View>
          </View>
        )}

        {/* STEP 4: AGREEMENT */}
        {step === 4 && (
          <View className="space-y-4">
            <Text className="text-slate-400 text-[10px] font-extrabold uppercase tracking-widest mb-1">
              Rental Agreement Policy
            </Text>

            <View className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 h-52">
              <ScrollView>
                <Text className="text-slate-800 font-extrabold text-xs mb-2">DRIVEDESK RENTAL CONTRACT TERMS</Text>
                <Text className="text-slate-600 text-[10px] leading-relaxed">
                  1. The renter agrees to return the vehicle in the same condition as received, except for normal wear.
                  {'\n\n'}
                  2. Speed limits must not exceed 100 km/h. High speeds incur penalties.
                  {'\n\n'}
                  3. Fuel level must be matched upon return. Any fuel deficit will be charged at current rates.
                  {'\n\n'}
                  4. The security deposit is refundable within 24 hours of checkout inspection.
                  {'\n\n'}
                  5. Renter is liable for all traffic citations, toll charges, or parking violations during the rental period.
                </Text>
              </ScrollView>
            </View>

            <TouchableOpacity 
              onPress={() => setAgreeTerms(!agreeTerms)}
              activeOpacity={0.7}
              className="flex-row items-center py-2"
            >
              <Feather name={agreeTerms ? 'check-square' : 'square'} size={16} color={agreeTerms ? '#10B981' : '#64748B'} />
              <Text className="text-slate-700 text-xs font-bold ml-2">
                I agree to the rental terms and policies.
              </Text>
            </TouchableOpacity>

            <SignaturePad
              customerName={customer?.name || 'Customer Name'}
              onSign={(uri) => setSignatureUri(uri)}
            />

            <View className="pt-6 space-y-2">
              <Button label="Continue to Payment" onPress={nextStep} />
              <Button label="Back" variant="ghost" onPress={prevStep} />
            </View>
          </View>
        )}

        {/* STEP 5: PAYMENT */}
        {step === 5 && (
          <View className="space-y-4">
            <Text className="text-slate-400 text-[10px] font-extrabold uppercase tracking-widest mb-1">
              Billing Information
            </Text>

            <Input
              label="Advance Rental Fee (INR)"
              value={advancePaid}
              onChangeText={setAdvancePaid}
              keyboardType="numeric"
            />

            <Input
              label="Refundable Security Deposit (INR)"
              value={securityDeposit}
              onChangeText={setSecurityDeposit}
              keyboardType="numeric"
            />

            <Text className="text-slate-400 text-[10px] font-extrabold uppercase tracking-widest mt-4 mb-2">
              Payment Method
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {['UPI', 'Cash', 'Card', 'Bank Transfer'].map((m) => (
                <TouchableOpacity
                  key={m}
                  onPress={() => setPaymentMethod(m as any)}
                  className={`px-4 py-2.5 rounded-xl border flex-1 items-center ${
                    paymentMethod === m
                      ? 'bg-slate-900 border-slate-900'
                      : 'bg-white border-slate-200'
                  }`}
                >
                  <Text className={`text-xs font-bold uppercase tracking-wider ${
                    paymentMethod === m ? 'text-white' : 'text-slate-600'
                  }`}>
                    {m}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View className="pt-6 border-t border-slate-100 mt-6 space-y-3">
              <Button 
                label={receiptDownloaded ? "Receipt Downloaded ✓" : "Download PDF Receipt"} 
                variant="outline" 
                icon={<Feather name="download" size={14} color="#0F172A" />}
                onPress={() => {
                  setReceiptDownloaded(true);
                  showToast('PDF Receipt downloaded to device.', 'success');
                }} 
              />
              
              <Button 
                label="Finish & Pick Up" 
                loading={finishing} 
                onPress={handleFinishBooking} 
              />
              
              <Button label="Back" variant="ghost" onPress={prevStep} />
            </View>
          </View>
        )}

      </ScrollView>

      {/* MOCK CAMERA OVERLAY */}
      {activePhotoSlot && (
        <View className="absolute inset-0 bg-black z-[999] justify-between p-6">
          <SafeAreaView style={{ flex: 1 }} className="justify-between">
            {/* Top Close */}
            <View className="flex-row justify-between items-center">
              <Text className="text-white text-xs font-bold uppercase tracking-widest">
                Capture {activePhotoSlot.toUpperCase()} Image
              </Text>
              <TouchableOpacity onPress={() => setActivePhotoSlot(null)}>
                <Feather name="x" size={20} color="#FFF" />
              </TouchableOpacity>
            </View>

            {/* Simulating viewfinder */}
            <View className="flex-1 border border-slate-800 rounded-2xl my-6 bg-slate-950 items-center justify-center overflow-hidden">
              <Text className="text-slate-400 text-xs italic">Viewfinder: Align vehicle {activePhotoSlot}</Text>
            </View>

            {/* Shutter controls */}
            <View className="items-center space-y-4">
              <TouchableOpacity 
                onPress={handleConfirmPhoto}
                className="w-16 h-16 rounded-full border-4 border-white bg-red-600 items-center justify-center"
              >
                {/* Simulated Shutter */}
              </TouchableOpacity>
              <Text className="text-white/60 text-[10px] uppercase font-bold tracking-widest">
                Tap shutter to capture photo
              </Text>
            </View>
          </SafeAreaView>
        </View>
      )}

    </SafeAreaView>
  );
}
