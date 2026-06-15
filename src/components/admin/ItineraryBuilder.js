import React, { useState } from 'react';
import { Plus, Edit2, Trash2, X, RefreshCw, MapPin, Eye, Copy, Link as LinkIcon, CheckCircle, Plane, Car, Bed, Clock, IndianRupee } from 'lucide-react';
import toast from 'react-hot-toast';
import { saveItinerary, uploadImage, updateItinerary, deleteItinerary } from '../../firebase/config';
import './ItineraryBuilder.css';

const EMPTY_DAY = { title: '', description: '', flight: '', transfer: '', hotel: '', activity: '', image: '' };
const EMPTY_ITINERARY = {
  clientName: '',
  title: '',
  summary: '',
  coverImage: '',
  totalPrice: '',
  checkIn: '',
  checkOut: '',
  days: [{ ...EMPTY_DAY }],
  inclusions: '',
  incBreakfast: false,
  incLunch: false,
  incDinner: false,
  exclusions: '',
  excBreakfast: false,
  excLunch: false,
  excDinner: false
};

export default function ItineraryBuilder({ itineraries, fetchData, draftEnquiry, clearDraft }) {
  const [modal, setModal] = useState(null); // null | 'add' | itinerary.id
  const [form, setForm] = useState(EMPTY_ITINERARY);
  const [saving, setSaving] = useState(false);

  // Auto-fill from enquiry if one is passed
  React.useEffect(() => {
    if (draftEnquiry) {
      setForm({
        ...EMPTY_ITINERARY,
        clientName: draftEnquiry.customerName || '',
        title: draftEnquiry.selectedPackage || '',
        checkIn: draftEnquiry.departureDate || '',
        checkOut: draftEnquiry.returnDate || '',
      });
      setModal('add');
      if (clearDraft) clearDraft();
    }
  }, [draftEnquiry, clearDraft]);

  const openAdd = () => {
    setForm(EMPTY_ITINERARY);
    setModal('add');
  };

  const openEdit = (it) => {
    setForm(it);
    setModal(it.id);
  };

  const removeItinerary = async (id) => {
    if (!window.confirm('Delete this itinerary?')) return;
    const { error } = await deleteItinerary(id);
    if (!error) {
      toast.success('Itinerary deleted');
      await fetchData();
    } else {
      toast.error('Failed to delete itinerary');
    }
  };

  const updateForm = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const addDay = () => {
    setForm(prev => ({ ...prev, days: [...prev.days, { ...EMPTY_DAY }] }));
  };

  const updateDay = (index, key, value) => {
    const newDays = [...form.days];
    newDays[index][key] = value;
    setForm(prev => ({ ...prev, days: newDays }));
  };

  const removeDay = (index) => {
    const newDays = form.days.filter((_, i) => i !== index);
    setForm(prev => ({ ...prev, days: newDays }));
  };

  const handleImageUpload = async (file, callback) => {
    if (!file) return;
    toast.loading('Uploading image...', { id: 'img-upload' });
    try {
      const url = await uploadImage(file);
      callback(url);
      toast.success('Image uploaded!', { id: 'img-upload' });
    } catch (err) {
      toast.error('Upload failed', { id: 'img-upload' });
    }
  };

  const save = async () => {
    if (!form.clientName || !form.title) {
      toast.error('Client name and package title are required');
      return;
    }
    setSaving(true);
    
    if (modal === 'add') {
      const { error } = await saveItinerary(form);
      if (!error) {
        toast.success('Itinerary saved and link generated!');
        await fetchData();
        setModal(null);
      } else {
        console.error('Failed to save itinerary:', error);
        toast.error('Failed to save itinerary: ' + error);
      }
    } else {
      const { error } = await updateItinerary(modal, form);
      if (!error) {
        toast.success('Itinerary updated!');
        await fetchData();
        setModal(null);
      } else {
        toast.error('Failed to update itinerary: ' + error);
      }
    }
    
    setSaving(false);
  };

  const copyLink = (id) => {
    const url = `${window.location.origin}/proposal/${id}`;
    navigator.clipboard.writeText(url);
    toast.success('Link copied to clipboard!');
  };

  return (
    <div className="itinerary-builder">
      <div className="content-toolbar">
        <h3 className="content-sub-title">Custom Itineraries <span>({itineraries.length})</span></h3>
        <button className="btn-primary" onClick={openAdd} style={{ padding: '10px 20px', fontSize: '13px' }}>
          <Plus size={15} /> Create Proposal
        </button>
      </div>

      {itineraries.length === 0 ? (
        <div className="empty-page-state">
          <MapPin size={44} />
          <h3>No itineraries created yet</h3>
          <p>Build custom day-by-day itineraries and send beautiful proposals to your clients.</p>
          <button className="btn-primary" onClick={openAdd} style={{ marginTop: 16 }}>
            <Plus size={15} /> Build First Itinerary
          </button>
        </div>
      ) : (
        <div className="itin-grid">
          {itineraries.map(it => (
            <div key={it.id} className="itin-card">
              
              <div className="itin-card-img-wrapper">
                <div className="itin-card-actions-top">
                  <button onClick={() => openEdit(it)} className="itin-action-icon edit" title="Edit">
                    <Edit2 size={16}/>
                  </button>
                  <button onClick={() => removeItinerary(it.id)} className="itin-action-icon delete" title="Delete">
                    <Trash2 size={16}/>
                  </button>
                </div>

                {it.coverImage ? (
                  <img src={it.coverImage} alt={it.title} className="itin-card-img" />
                ) : (
                  <div className="itin-card-placeholder">🏝️</div>
                )}
              </div>

              <div className="itin-card-body">
                <div className={`itin-status-badge ${it.status === 'confirmed' ? 'confirmed' : 'pending'}`}>
                  {it.status === 'confirmed' ? <><CheckCircle size={12}/> Confirmed</> : 'Pending'}
                </div>
                <div className="itin-client-name">{it.clientName}</div>
                <div className="itin-pkg-title">{it.title}</div>
                <div className="itin-meta">
                  <div className="itin-meta-item"><Clock size={14}/> {it.days?.length || 0} Days</div>
                  <div className="itin-meta-item"><IndianRupee size={14}/> {it.totalPrice}</div>
                </div>
              </div>

              <div className="itin-card-footer">
                <button className="itin-btn view" onClick={() => window.open(`/proposal/${it.id}`, '_blank')}>
                  <Eye size={16}/> View
                </button>
                <button className="itin-btn copy" onClick={() => copyLink(it.id)}>
                  <Copy size={16}/> Copy Link
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL */}
      {modal && (
        <div className="modal-overlay" style={{ zIndex: 1000 }} onClick={e => e.target === e.currentTarget && setModal(null)}>
          <div className="modal-content admin-modal" style={{ maxWidth: '800px', width: '90%', maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="modal-header" style={{ position: 'sticky', top: 0, backgroundColor: '#fff', zIndex: 10, borderBottom: '1px solid #E2E8F0', padding: '20px' }}>
              <h2>{modal === 'add' ? 'Build Custom Itinerary' : 'Edit Itinerary'}</h2>
              <button className="modal-close" onClick={() => setModal(null)}><X size={20}/></button>
            </div>
            <div className="modal-body" style={{ padding: '20px' }}>
              
              <h3 style={{ fontSize: '16px', marginBottom: '15px', color: '#1E293B', borderBottom: '1px solid #E2E8F0', paddingBottom: '8px' }}>Basic Details</h3>
              <div className="admin-form-grid" style={{ marginBottom: '30px' }}>
                <div className="form-group">
                  <label>Client Name</label>
                  <input type="text" value={form.clientName} onChange={e => updateForm('clientName', e.target.value)} placeholder="e.g. Rahul Sharma" />
                </div>
                <div className="form-group">
                  <label>Package Title</label>
                  <input type="text" value={form.title} onChange={e => updateForm('title', e.target.value)} placeholder="e.g. 5N/6D Maldives Escape" />
                </div>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label>Package Summary</label>
                  <textarea value={form.summary || ''} onChange={e => updateForm('summary', e.target.value)} rows={3} placeholder="A short description of the overall package experience..." />
                </div>
                <div className="form-group">
                  <label>Total Price</label>
                  <input type="text" value={form.totalPrice} onChange={e => updateForm('totalPrice', e.target.value)} placeholder="e.g. ₹1,45,000" />
                </div>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label>Cover Image URL or Upload File</label>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <input type="text" value={form.coverImage} onChange={e => updateForm('coverImage', e.target.value)} placeholder="https://..." style={{ flex: 1 }}/>
                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e.target.files[0], url => updateForm('coverImage', url))} style={{ flex: 1, padding: '7px' }} />
                  </div>
                  {form.coverImage && <img src={form.coverImage} alt="Cover Preview" style={{ height: '100px', width: '200px', objectFit: 'cover', borderRadius: '6px', marginTop: '10px', border: '1px solid #E2E8F0' }} />}
                </div>
                <div className="form-group">
                  <label>Check-In (Date/Time)</label>
                  <input type="text" value={form.checkIn || ''} onChange={e => updateForm('checkIn', e.target.value)} placeholder="e.g. 12 Aug, 2:00 PM" />
                </div>
                <div className="form-group">
                  <label>Check-Out (Date/Time)</label>
                  <input type="text" value={form.checkOut || ''} onChange={e => updateForm('checkOut', e.target.value)} placeholder="e.g. 16 Aug, 11:00 AM" />
                </div>
              </div>

              <h3 style={{ fontSize: '16px', marginBottom: '15px', color: '#1E293B', borderBottom: '1px solid #E2E8F0', paddingBottom: '8px' }}>Day-by-Day Plan (Modular)</h3>
              <p style={{ fontSize: '12px', color: '#64748B', marginBottom: '15px' }}>Fill only the fields that apply to each day. Empty fields will not be shown to the customer.</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '30px' }}>
                {form.days.map((day, index) => (
                  <div key={index} style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '15px', position: 'relative' }}>
                    {form.days.length > 1 && (
                      <button onClick={() => removeDay(index)} style={{ position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer' }}>
                        <Trash2 size={16} />
                      </button>
                    )}
                    <h4 style={{ fontSize: '14px', marginBottom: '15px', color: '#334155' }}>Day {index + 1}</h4>
                    <div className="admin-form-grid" style={{ gap: '15px' }}>
                      
                      <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                        <label>Day Title (Overview)</label>
                        <input type="text" value={day.title} onChange={e => updateDay(index, 'title', e.target.value)} placeholder="e.g. Arrival in Maldives" />
                      </div>
                      
                      <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                        <label>Day Description</label>
                        <textarea value={day.description || ''} onChange={e => updateDay(index, 'description', e.target.value)} rows={3} placeholder="Provide a brief overview of what this day entails..." />
                      </div>
                      
                      <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Plane size={14} color="#8B5CF6"/> Flight Details</label>
                        <input type="text" value={day.flight} onChange={e => updateDay(index, 'flight', e.target.value)} placeholder="e.g. IndiGo 6E-123 | Dep: 10:00 AM" />
                      </div>
                      
                      <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Car size={14} color="#F59E0B"/> Transfer Details</label>
                        <input type="text" value={day.transfer} onChange={e => updateDay(index, 'transfer', e.target.value)} placeholder="e.g. Speedboat Transfer from Airport to Resort" />
                      </div>
                      
                      <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Bed size={14} color="#3B82F6"/> Hotel / Resort Stay</label>
                        <textarea value={day.hotel} onChange={e => updateDay(index, 'hotel', e.target.value)} rows={2} placeholder="e.g. Taj Exotica Resort & Spa&#10;Water Villa with Pool | All Inclusive Meal Plan" />
                      </div>
                      
                      <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><MapPin size={14} color="#10B981"/> Activities & Leisure</label>
                        <textarea value={day.activity} onChange={e => updateDay(index, 'activity', e.target.value)} rows={6} placeholder="e.g. Spend the day at leisure enjoying the pristine beaches..." />
                      </div>

                      <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                        <label>Meals Included</label>
                        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                          <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 'normal', cursor: 'pointer' }}>
                            <input type="checkbox" checked={day.breakfast || false} onChange={e => updateDay(index, 'breakfast', e.target.checked)} /> Breakfast
                          </label>
                          <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 'normal', cursor: 'pointer' }}>
                            <input type="checkbox" checked={day.lunch || false} onChange={e => updateDay(index, 'lunch', e.target.checked)} /> Lunch
                          </label>
                          <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 'normal', cursor: 'pointer' }}>
                            <input type="checkbox" checked={day.dinner || false} onChange={e => updateDay(index, 'dinner', e.target.checked)} /> Dinner
                          </label>
                        </div>
                      </div>

                      <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                        <label>Day Image URL or Upload File</label>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                          <input type="text" value={day.image} onChange={e => updateDay(index, 'image', e.target.value)} placeholder="https://..." style={{ flex: 1 }}/>
                          <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e.target.files[0], url => updateDay(index, 'image', url))} style={{ flex: 1, padding: '7px' }} />
                        </div>
                        {day.image && <img src={day.image} alt="Day Preview" style={{ height: '80px', width: '120px', objectFit: 'cover', borderRadius: '6px', marginTop: '5px', border: '1px solid #E2E8F0' }} />}
                      </div>
                    </div>
                  </div>
                ))}
                <button type="button" onClick={addDay} style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '5px', background: 'none', border: '1px dashed #CBD5E1', color: '#0F172A', padding: '10px 15px', borderRadius: '6px', cursor: 'pointer', fontWeight: '500', fontSize: '13px' }}>
                  <Plus size={14} /> Add Another Day
                </button>
              </div>

              <h3 style={{ fontSize: '16px', marginBottom: '15px', color: '#1E293B', borderBottom: '1px solid #E2E8F0', paddingBottom: '8px' }}>Other Details</h3>
              <div className="admin-form-grid" style={{ marginBottom: '20px' }}>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label style={{ fontSize: '18px', color: '#000000', fontWeight: 'bold' }}>Inclusions (Comma separated or bullet points)</label>
                  <div style={{ display: 'flex', gap: '20px', marginBottom: '10px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 'normal', cursor: 'pointer' }}>
                      <input type="checkbox" checked={form.incBreakfast || false} onChange={e => updateForm('incBreakfast', e.target.checked)} /> Breakfast
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 'normal', cursor: 'pointer' }}>
                      <input type="checkbox" checked={form.incLunch || false} onChange={e => updateForm('incLunch', e.target.checked)} /> Lunch
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 'normal', cursor: 'pointer' }}>
                      <input type="checkbox" checked={form.incDinner || false} onChange={e => updateForm('incDinner', e.target.checked)} /> Dinner
                    </label>
                  </div>
                  <textarea value={form.inclusions} onChange={e => updateForm('inclusions', e.target.value)} rows={6} placeholder="Additional Inclusions (Return Economy Class Airfare, Speedboat Transfers...)" />
                </div>
                
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label style={{ fontSize: '18px', color: '#000000', fontWeight: 'bold' }}>Exclusions (Comma separated or bullet points)</label>
                  <div style={{ display: 'flex', gap: '20px', marginBottom: '10px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 'normal', cursor: 'pointer' }}>
                      <input type="checkbox" checked={form.excBreakfast || false} onChange={e => updateForm('excBreakfast', e.target.checked)} /> Breakfast
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 'normal', cursor: 'pointer' }}>
                      <input type="checkbox" checked={form.excLunch || false} onChange={e => updateForm('excLunch', e.target.checked)} /> Lunch
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 'normal', cursor: 'pointer' }}>
                      <input type="checkbox" checked={form.excDinner || false} onChange={e => updateForm('excDinner', e.target.checked)} /> Dinner
                    </label>
                  </div>
                  <textarea value={form.exclusions} onChange={e => updateForm('exclusions', e.target.value)} rows={6} placeholder="Additional Exclusions (Visa fees, Personal expenses...)" />
                </div>
              </div>

            </div>
            <div className="modal-footer" style={{ position: 'sticky', bottom: 0, backgroundColor: '#fff', zIndex: 10, borderTop: '1px solid #E2E8F0', padding: '20px' }}>
              <button className="btn-ghost" onClick={() => setModal(null)}>Cancel</button>
              <button className={`btn-primary ${saving ? 'spinning' : ''}`} onClick={save}>
                {saving ? <RefreshCw size={16} /> : modal === 'add' ? 'Save & Generate Link' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
