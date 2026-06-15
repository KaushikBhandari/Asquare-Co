import React, { useState } from 'react';
import { Plus, Edit2, Trash2, X, RefreshCw, MessageSquare, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import { saveAdminTemplate, updateAdminTemplate, deleteAdminTemplate } from '../../firebase/config';

const EMPTY_TEMPLATE = { name: '', content: '' };

export default function TemplateLibrary({ templates, enquiries = [], fetchData }) {
  const [modal, setModal] = useState(null); // 'add' | template object
  const [form, setForm] = useState(EMPTY_TEMPLATE);
  const [saving, setSaving] = useState(false);
  
  const [broadcastModal, setBroadcastModal] = useState(null);
  const [selectedEnquiries, setSelectedEnquiries] = useState({});
  const [broadcastStep, setBroadcastStep] = useState(1);

  const openBroadcast = (t) => {
    setBroadcastModal(t);
    setSelectedEnquiries({});
    setBroadcastStep(1);
  };

  const toggleEnquiry = (id) => {
    setSelectedEnquiries(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const buildParsedMessage = (enq, content) => {
    let msg = content || '';
    msg = msg.replace(/{{clientName}}/g, enq.customerName || enq.name || '');
    msg = msg.replace(/{{package}}/g, enq.selectedPackage || enq.packageDestinations || enq.destination || '');
    msg = msg.replace(/{{duration}}/g, enq.packageDuration || enq.duration || '');
    msg = msg.replace(/{{budget}}/g, enq.budget || '');
    return msg;
  };

  const openAdd = () => {
    setForm(EMPTY_TEMPLATE);
    setModal('add');
  };

  const openEdit = (t) => {
    setForm(t);
    setModal(t);
  };

  const save = async () => {
    if (!form.name || !form.content) {
      toast.error('Name and content are required');
      return;
    }
    setSaving(true);
    
    if (modal === 'add') {
      const { error } = await saveAdminTemplate(form);
      if (!error) {
        toast.success('Quick reply added!');
        await fetchData();
      } else {
        toast.error('Failed to save quick reply');
      }
    } else {
      const { error } = await updateAdminTemplate(modal.id, form);
      if (!error) {
        toast.success('Quick reply updated!');
        await fetchData();
      } else {
        toast.error('Failed to update quick reply');
      }
    }
    
    setModal(null);
    setSaving(false);
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this quick reply?')) return;
    const { error } = await deleteAdminTemplate(id);
    if (!error) {
      toast.success('Quick reply deleted');
      await fetchData();
    } else {
      toast.error('Failed to delete quick reply');
    }
  };

  const loadDefaults = async () => {
    setSaving(true);
    const defaults = [
      {
        name: '1. Initial Welcome & Details Request',
        content: `Hi {{clientName}},

Thank you for your enquiry with Asquaretravelgoa Tours & Travels!

We have received your request for the {{package}} package (Duration: {{duration}}, Budget: {{budget}}). 

To craft the perfect personalized itinerary for you, could you please confirm:
1. What are your exact or tentative travel dates?
2. Are you traveling with kids?
3. Are there any specific experiences or hotel preferences you have?

Looking forward to planning your dream trip!

Warm regards,
Asquaretravelgoa Tours & Travels`
      },
      {
        name: '2. Quotation Ready',
        content: `Hi {{clientName}},

Great news! We have customized a beautiful itinerary for your trip based on your preferences. 

You can view your detailed proposal here:
[INSERT PROPOSAL LINK HERE]

Please take a look and let us know if you'd like to make any adjustments. We are completely flexible and happy to modify it until it is perfect for you.

Warm regards,
Asquaretravelgoa Tours & Travels`
      },
      {
        name: '3. Follow Up (No Response)',
        content: `Hi {{clientName}},

We hope you're having a wonderful week! 

We recently sent you some details regarding your interest in the {{package}} package. We'd love to know if you had a chance to review the proposal and if you have any questions.

Let us know when would be a good time to connect, or simply reply to this message.

Warm regards,
Asquaretravelgoa Tours & Travels`
      }
    ];

    let successCount = 0;
    for (const t of defaults) {
      const { error } = await saveAdminTemplate(t);
      if (!error) successCount++;
    }
    
    if (successCount > 0) {
      toast.success('Default quick replies loaded!');
      await fetchData();
    } else {
      toast.error('Failed to load quick replies');
    }
    setSaving(false);
  };

  return (
    <div className="template-library">
      <div className="content-toolbar">
        <h3 className="content-sub-title">Quick Replies <span>({templates.length})</span></h3>
        <button className="btn-primary" onClick={openAdd} style={{ padding: '10px 20px', fontSize: '13px' }}>
          <Plus size={15} /> Add Quick Reply
        </button>
      </div>

      <div style={{ marginBottom: '20px', fontSize: '13px', color: '#64748B', backgroundColor: '#F8FAFC', padding: '12px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
        <strong>Available Placeholders:</strong> You can use {`{{clientName}}`}, {`{{package}}`}, {`{{duration}}`}, and {`{{budget}}`} in your quick reply content. These will be automatically replaced with the actual customer data when used.
      </div>

      {templates.length === 0 ? (
        <div className="empty-page-state">
          <MessageSquare size={44} />
          <h3>No quick replies yet</h3>
          <p>Create quick replies for common messages like welcome texts or standard quotes.</p>
          <div style={{ display: 'flex', gap: '10px', marginTop: 16 }}>
            <button className="btn-primary" onClick={openAdd}>
              <Plus size={15} /> Create First Quick Reply
            </button>
            <button className={`btn-ghost ${saving ? 'spinning' : ''}`} onClick={loadDefaults}>
              {saving ? <RefreshCw size={15}/> : <MessageSquare size={15}/>} Load Default Quick Replies
            </button>
          </div>
        </div>
      ) : (
        <div className="admin-dest-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
          {templates.map(t => (
            <div key={t.id} className="admin-dest-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ fontWeight: '600', fontSize: '15px', color: '#1E293B', borderBottom: '1px solid #E2E8F0', paddingBottom: '8px' }}>
                {t.name}
              </div>
              <div style={{ fontSize: '13px', color: '#475569', whiteSpace: 'pre-wrap', flex: 1, maxHeight: '100px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {t.content}
              </div>
              <div className="adc-actions" style={{ position: 'static', marginTop: '10px', justifyContent: 'flex-end', borderTop: 'none', padding: 0 }}>
                <button className="adc-btn edit" onClick={() => openBroadcast(t)} style={{ color: '#059669', borderColor: '#059669', marginRight: 'auto' }} title="Send to Customers"><Send size={13}/></button>
                <button className="adc-btn edit" onClick={() => openEdit(t)}><Edit2 size={13}/></button>
                <button className="adc-btn delete" onClick={() => remove(t.id)}><Trash2 size={13}/></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL */}
      {modal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setModal(null)}>
          <div className="modal-content admin-modal">
            <div className="modal-header">
              <h2>{modal === 'add' ? 'Add Quick Reply' : 'Edit Quick Reply'}</h2>
              <button className="modal-close" onClick={() => setModal(null)}><X size={20}/></button>
            </div>
            <div className="modal-body admin-form-grid">
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label>Quick Reply Name</label>
                <input 
                  type="text" 
                  value={form.name} 
                  onChange={e => setForm({ ...form, name: e.target.value })} 
                  placeholder="e.g. Welcome Message" 
                />
              </div>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label>Quick Reply Content</label>
                <textarea 
                  value={form.content} 
                  onChange={e => setForm({ ...form, content: e.target.value })} 
                  rows={8}
                  placeholder="Hi {{clientName}},&#10;Thank you for your interest in the {{package}} package..."
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-ghost" onClick={() => setModal(null)}>Cancel</button>
              <button className={`btn-primary ${saving ? 'spinning' : ''}`} onClick={save}>
                {saving ? <RefreshCw size={16} /> : 'Save Quick Reply'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BROADCAST MODAL */}
      {broadcastModal && (
        <div className="modal-overlay" style={{ zIndex: 1000 }} onClick={e => e.target === e.currentTarget && setBroadcastModal(null)}>
          <div className="modal-content admin-modal" style={{ maxWidth: '700px', width: '90%', maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="modal-header" style={{ position: 'sticky', top: 0, backgroundColor: '#fff', zIndex: 10 }}>
              <h2>{broadcastStep === 1 ? 'Select Customers to Message' : 'Review & Send'}</h2>
              <button className="modal-close" onClick={() => setBroadcastModal(null)}><X size={20}/></button>
            </div>
            
            <div className="modal-body" style={{ padding: '20px' }}>
              {broadcastStep === 1 ? (
                <>
                  <p style={{ marginBottom: '15px', color: '#475569', fontSize: '14px' }}>
                    Select the customers you want to send <strong>{broadcastModal.name}</strong> to.<br/>
                    <span style={{ color: '#DC2626', fontWeight: '500', display: 'inline-block', marginTop: '5px' }}>⚠️ WhatsApp Limit: To prevent your account from being blocked for spam, please select a maximum of 50 customers per batch.</span>
                  </p>
                  
                  {enquiries.length === 0 ? (
                    <p style={{ color: '#64748B' }}>No customers available.</p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {enquiries.map(enq => (
                        <label key={enq.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', border: '1px solid #E2E8F0', borderRadius: '8px', cursor: 'pointer', backgroundColor: selectedEnquiries[enq.id] ? '#F0FDF4' : '#fff', borderColor: selectedEnquiries[enq.id] ? '#86EFAC' : '#E2E8F0' }}>
                          <input 
                            type="checkbox" 
                            checked={!!selectedEnquiries[enq.id]}
                            onChange={() => toggleEnquiry(enq.id)}
                            style={{ width: '18px', height: '18px' }}
                          />
                          <div>
                            <div style={{ fontWeight: '600', color: '#1E293B', fontSize: '15px' }}>{enq.customerName || enq.name || 'Unknown Customer'} • {enq.phone}</div>
                            <div style={{ fontSize: '13px', color: '#64748B' }}>{enq.selectedPackage || enq.packageDestinations || enq.destination || 'No Package Specified'}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  )}
                  {Object.values(selectedEnquiries).filter(v => v).length > 50 && (
                    <div style={{ marginTop: '15px', padding: '12px', backgroundColor: '#FEF2F2', border: '1px solid #FCA5A5', color: '#DC2626', borderRadius: '6px', fontSize: '13px', fontWeight: '500' }}>
                      You have selected {Object.values(selectedEnquiries).filter(v => v).length} customers. Please deselect {Object.values(selectedEnquiries).filter(v => v).length - 50} customers to proceed within the safe WhatsApp limits.
                    </div>
                  )}
                </>
              ) : (
                <>
                  <p style={{ marginBottom: '15px', color: '#475569', fontSize: '14px' }}>Review the personalized messages below. Click Send to open WhatsApp for each customer.</p>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {enquiries.filter(e => selectedEnquiries[e.id]).map(enq => {
                      const parsedMsg = buildParsedMessage(enq, broadcastModal.content);
                      const waUrl = `https://wa.me/${(enq.phone||'').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(parsedMsg)}`;
                      
                      return (
                        <div key={enq.id} style={{ padding: '15px', border: '1px solid #E2E8F0', borderRadius: '8px', backgroundColor: '#F8FAFC' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                            <div>
                              <div style={{ fontWeight: '600', color: '#1E293B' }}>{enq.customerName || enq.name || 'Unknown Customer'}</div>
                              <div style={{ fontSize: '13px', color: '#64748B' }}>{enq.phone}</div>
                            </div>
                            <a href={waUrl} target="_blank" rel="noreferrer" className="btn-primary" style={{ padding: '8px 16px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <Send size={14}/> Send via WhatsApp
                            </a>
                          </div>
                          <div style={{ fontSize: '13px', color: '#475569', backgroundColor: '#fff', padding: '10px', borderRadius: '6px', border: '1px solid #CBD5E1', whiteSpace: 'pre-wrap' }}>
                            {parsedMsg}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            <div className="modal-footer" style={{ position: 'sticky', bottom: 0, backgroundColor: '#fff', zIndex: 10, borderTop: '1px solid #E2E8F0', padding: '20px' }}>
              <button className="btn-ghost" onClick={() => setBroadcastModal(null)}>Cancel</button>
              {broadcastStep === 1 && (
                <button 
                  className="btn-primary" 
                  onClick={() => setBroadcastStep(2)}
                  disabled={!Object.values(selectedEnquiries).some(v => v) || Object.values(selectedEnquiries).filter(v => v).length > 50}
                >
                  Review & Send ({Object.values(selectedEnquiries).filter(v => v).length} selected)
                </button>
              )}
              {broadcastStep === 2 && (
                <button className="btn-ghost" onClick={() => setBroadcastStep(1)}>← Back to Selection</button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
