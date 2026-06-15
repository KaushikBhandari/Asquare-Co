import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { isAdmin, ADMIN_EMAIL } from '../config/adminConfig';
import {
  getEnquiries, updateEnquiryStatus,
  saveAdminDestination, getAdminDestinations, updateAdminDestination, deleteAdminDestination,
  saveAdminPackage, getAdminPackages, updateAdminPackage, deleteAdminPackage,
  getUsers, getFeedback, uploadImage,
  getAdminTemplates, getItineraries
} from '../firebase/config';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, MessageSquare, MapPin, Package,
  CheckCircle, RefreshCw, Globe, LogIn, ArrowRight,
  Mail, Phone, Plus, Trash2, Star, Clock, Tag, X, Edit2,
  Eye, Calendar, Shield, TrendingUp, Send, FileText, Map
} from 'lucide-react';
import toast from 'react-hot-toast';
import FollowUpPanel from '../components/admin/FollowUpPanel';
import TemplateLibrary from '../components/admin/TemplateLibrary';
import ItineraryBuilder from '../components/admin/ItineraryBuilder';
import './AdminDashboard.css';

const CATEGORIES = ['Goa', 'India', 'Asia', 'Europe', 'Middle East', 'South America', 'Africa', 'Oceania'];
const PKG_COLORS = ['#FF6B35', '#00A896', '#3D5A99', '#F59E0B', '#E11D48', '#7C3AED'];

const EMPTY_DEST = { name:'', country:'', category:'Goa', duration:'', rating:'', tag:'', image:'', description:'', highlights:'' };
const EMPTY_PKG  = { name:'', destinations:'', duration:'', rating:'', tag:'', image:'', includes:'', color:'#FF6B35' };

// Build WhatsApp URL using whatsapp field first, fall back to phone
function buildWaUrl(enquiry, message) {
  const raw = enquiry.whatsapp || enquiry.phone || '';
  const num = raw.replace(/[^0-9]/g, '');
  return `https://wa.me/${num}?text=${encodeURIComponent(message)}`;
}

export default function AdminDashboard() {
  const { user, setShowAuthModal } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('overview');
  const [enquiries,  setEnquiries]  = useState([]);
  const [fbUsers,    setFbUsers]    = useState([]);
  const [adminDests, setAdminDests] = useState([]);
  const [adminPkgs,  setAdminPkgs]  = useState([]);
  const [feedbacks,  setFeedbacks]  = useState([]);
  const [adminTemplates, setAdminTemplates] = useState([]);
  const [itineraries, setItineraries] = useState([]);
  const [loading,    setLoading]    = useState(false);

  const [destModal,    setDestModal]    = useState(null);
  const [pkgModal,     setPkgModal]     = useState(null);
  const [viewEnquiry,  setViewEnquiry]  = useState(null);
  const [viewFeedback, setViewFeedback] = useState(null);
  const [destForm,     setDestForm]     = useState(EMPTY_DEST);
  const [pkgForm,      setPkgForm]      = useState(EMPTY_PKG);
  const [saving,       setSaving]       = useState(false);
  const [mobileNav,    setMobileNav]    = useState(false);
  const [logoModalOpen, setLogoModalOpen] = useState(false);

  const fetchData = async () => {
    if (!user) return;
    setLoading(true);
    const [enqs, usrs, adsts, apkgs, fbs, tpls, itins] = await Promise.all([
      getEnquiries(), getUsers(), getAdminDestinations(), getAdminPackages(), getFeedback(), getAdminTemplates(), getItineraries()
    ]);
    const localEnqs = JSON.parse(localStorage.getItem('wl_enquiries') || '[]');
    const merged = [...enqs, ...localEnqs.filter(le => !enqs.find(fe => fe.id === le.id))];
    setEnquiries(merged);
    setFbUsers(usrs);
    setAdminDests(adsts);
    setAdminPkgs(apkgs);
    setFeedbacks(fbs);
    setAdminTemplates(tpls);
    setItineraries(itins);
    setLoading(false);
  };

  useEffect(() => { if (user && isAdmin(user)) fetchData(); }, [user]);

  if (!user) {
    return (
      <div className="admin-gate">
        <div className="admin-gate-card">
          <Shield size={44} className="gate-icon" />
          <h2>Admin Access Only</h2>
          <p>This area is restricted. Please sign in with the admin account to continue.</p>
          <button className="btn-primary" onClick={() => setShowAuthModal(true)}>
            <LogIn size={16} /> Sign In
          </button>
        </div>
      </div>
    );
  }

  if (!isAdmin(user)) {
    return (
      <div className="admin-gate">
        <div className="admin-gate-card">
          <Shield size={44} className="gate-icon" style={{ color: '#DC2626' }} />
          <h2>Access Denied</h2>
          <p>You don't have permission to access the admin dashboard. Please contact <strong>{ADMIN_EMAIL}</strong>.</p>
          <button className="btn-primary" onClick={() => navigate('/')}>← Back to Home</button>
        </div>
      </div>
    );
  }

  const newEnq = enquiries.filter(e => e.status === 'new').length;

  const TABS = [
    { id: 'overview',      label: 'Overview',    icon: <LayoutDashboard size={15}/> },
    { id: 'enquiries',     label: `Enquiries${newEnq > 0 ? ` (${newEnq})` : ''}`, icon: <MessageSquare size={15}/> },
    { id: 'followups',     label: 'Follow-ups',  icon: <Send size={15}/> },
    { id: 'templates',     label: 'Quick Replies',    icon: <FileText size={15}/> },
    { id: 'itineraries',   label: 'Itineraries',  icon: <Map size={15}/> },
    { id: 'destinations',  label: 'Destinations', icon: <MapPin size={15}/> },
    { id: 'packages',      label: 'Packages',     icon: <Package size={15}/> },
    { id: 'users',         label: 'Users',        icon: <Users size={15}/> },
    { id: 'reviews',       label: 'Reviews',      icon: <Star size={15}/> },
  ];

  const openAddDest  = () => { setDestForm(EMPTY_DEST); setDestModal('add'); };
  const openEditDest = (d) => {
    setDestForm({ ...d, highlights: Array.isArray(d.highlights) ? d.highlights.join(', ') : d.highlights || '' });
    setDestModal(d);
  };
  const saveDest = async () => {
    if (!destForm.name || !destForm.country) { toast.error('Name & country are required'); return; }
    setSaving(true);
    const payload = { ...destForm, rating: Number(destForm.rating)||4.5, highlights: destForm.highlights.split(',').map(h=>h.trim()).filter(Boolean) };
    if (destModal === 'add') {
      const { id, error } = await saveAdminDestination(payload);
      if (!error) { toast.success('Destination added!'); await fetchData(); }
      else { toast.error('Saved locally'); const loc = JSON.parse(localStorage.getItem('wl_adminDests')||'[]'); localStorage.setItem('wl_adminDests', JSON.stringify([...loc, { ...payload, id:'D'+Date.now() }])); }
    } else {
      await updateAdminDestination(destModal.id, payload);
      toast.success('Destination updated!');
      await fetchData();
    }
    setDestModal(null); setSaving(false);
  };
  const deleteDest = async (id) => {
    if (!window.confirm('Delete this destination?')) return;
    await deleteAdminDestination(id);
    setAdminDests(p => p.filter(d => d.id !== id));
    toast.success('Deleted.');
  };

  const openAddPkg  = () => { setPkgForm(EMPTY_PKG); setPkgModal('add'); };
  const openEditPkg = (p) => {
    setPkgForm({ ...p, destinations: Array.isArray(p.destinations) ? p.destinations.join(', ') : p.destinations||'', includes: Array.isArray(p.includes) ? p.includes.join(', ') : p.includes||'' });
    setPkgModal(p);
  };
  const savePkg = async () => {
    if (!pkgForm.name) { toast.error('Package name is required'); return; }
    setSaving(true);
    const payload = { ...pkgForm, rating: Number(pkgForm.rating)||4.8, destinations: pkgForm.destinations.split(',').map(d=>d.trim()).filter(Boolean), includes: pkgForm.includes.split(',').map(i=>i.trim()).filter(Boolean) };
    if (pkgModal === 'add') {
      const { id, error } = await saveAdminPackage(payload);
      if (!error) { toast.success('Package added!'); await fetchData(); }
    } else {
      await updateAdminPackage(pkgModal.id, payload);
      toast.success('Package updated!');
      await fetchData();
    }
    setPkgModal(null); setSaving(false);
  };
  const deletePkg = async (id) => {
    if (!window.confirm('Delete this package?')) return;
    await deleteAdminPackage(id);
    setAdminPkgs(p => p.filter(pk => pk.id !== id));
    toast.success('Deleted.');
  };

  const updDest = (k, v) => setDestForm(f => ({ ...f, [k]: v }));
  const updPkg  = (k, v) => setPkgForm(f => ({ ...f, [k]: v }));

  const handleEnqStatus = async (id, status) => {
    await updateEnquiryStatus(id, status);
    setEnquiries(p => p.map(e => e.id === id ? { ...e, status } : e));
    toast.success(`Marked as ${status}`);
  };

  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [customMsg, setCustomMsg] = useState('');
  const [draftEnquiryForItinerary, setDraftEnquiryForItinerary] = useState(null);

  // Handle template selection and generate message
  useEffect(() => {
    if (selectedTemplate && viewEnquiry) {
      const template = adminTemplates.find(t => t.id === selectedTemplate);
      if (template) {
        let msg = template.content;
        msg = msg.replace(/\{\{clientName\}\}/g, viewEnquiry.customerName || 'Customer');
        msg = msg.replace(/\{\{package\}\}/g, viewEnquiry.selectedPackage || 'selected package');
        msg = msg.replace(/\{\{duration\}\}/g, viewEnquiry.packageDuration || 'the duration');
        msg = msg.replace(/\{\{budget\}\}/g, viewEnquiry.budget || 'your budget');
        setCustomMsg(msg);
      }
    } else {
      setCustomMsg('');
    }
  }, [selectedTemplate, viewEnquiry, adminTemplates]);

  const waMsg = (e) => customMsg ||
`Hi ${e.firstName || e.customerName},

Thank you for your enquiry with Asquaretravelgoa Tours & Travels!

We have reviewed your request for ${e.selectedPackage} and would love to help you plan this trip.

Could you let us know your available dates and we will share the best package options for you?

Looking forward to hearing from you!

Warm regards,
Asquaretravelgoa Tours & Travels`;

  const emailBody = (e) => customMsg ||
`Hi ${e.firstName || e.customerName},

Thank you for your enquiry with Asquaretravelgoa Tours & Travels!

We have reviewed your request for ${e.selectedPackage || 'your selected trip'} and are excited to help you plan this journey.

━━━ YOUR ENQUIRY SUMMARY ━━━
Package     : ${e.selectedPackage}
Destinations: ${e.packageDestinations}
Duration    : ${e.packageDuration}
Travelers   : ${e.travelers} person(s)
Departure   : ${e.departureDate || 'Flexible'}
Budget      : ${e.budget}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Based on your preferences, here is our recommended itinerary:

[ADD YOUR CUSTOM ITINERARY & QUOTE HERE]

To confirm or discuss any changes, simply reply to this email or call us.

Warm regards,
Asquaretravelgoa Tours & Travels
📞 +91 95293 38747
📧 info@asquaretravelgoa.com`;

  const switchTab = (id) => { setTab(id); setMobileNav(false); };

  return (
    <div className="admin-layout">

      {/* Mobile top bar */}
      <div className="admin-mobile-topbar">
        <div className="admin-mobile-brand" onClick={() => setLogoModalOpen(true)} style={{ cursor: 'pointer' }}>
          <img src="/logo.jpeg" alt="Asquaretravelgoa" className="sidebar-logo-img" />
          <span>Admin</span>
        </div>
        <button className="admin-hamburger" onClick={() => setMobileNav(o => !o)}>
          {mobileNav ? <X size={20}/> : <LayoutDashboard size={20}/>}
        </button>
      </div>

      {/* SIDEBAR */}
      <aside className={`admin-sidebar ${mobileNav ? 'mobile-open' : ''}`}>
        <div className="sidebar-brand" onClick={() => setLogoModalOpen(true)} style={{ cursor: 'pointer' }}>
          <img src="/logo.jpeg" alt="Asquaretravelgoa" className="sidebar-logo-img" />
          <div>
            <div className="sidebar-brand-name">Asquaretravelgoa</div>
            <div className="sidebar-brand-sub">Admin Panel</div>
          </div>
        </div>
        <nav className="sidebar-nav">
          {TABS.map(t => (
            <button key={t.id} className={`sidebar-link ${tab === t.id ? 'active' : ''}`} onClick={() => switchTab(t.id)}>
              {t.icon} {t.label}
            </button>
          ))}
          <div className="sidebar-divider" />
          <a
            href="https://expense-tracker-fjm5.onrender.com"
            target="_blank"
            rel="noreferrer"
            className="sidebar-expense-btn"
          >
            <TrendingUp size={15} /> Expense Tracker
          </a>
        </nav>
        <div className="sidebar-footer">
          <img src={user.photo} alt={user.name} className="sidebar-avatar" />
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">{user.name}</div>
            <div className="sidebar-user-role">Administrator</div>
          </div>
        </div>
      </aside>

      {mobileNav && <div className="sidebar-backdrop" onClick={() => setMobileNav(false)} />}

      {/* MAIN */}
      <main className="admin-main">
        <div className="admin-topbar">
          <div>
            <h1 className="admin-page-title">
              {tab === 'overview' ? 'Dashboard Overview' : tab === 'enquiries' ? 'Customer Enquiries' : tab === 'destinations' ? 'Manage Destinations' : tab === 'packages' ? 'Manage Packages' : tab === 'reviews' ? 'Customer Reviews' : 'Users'}
            </h1>
            <p className="admin-page-date">{new Date().toLocaleDateString('en-IN', { weekday:'long', year:'numeric', month:'long', day:'numeric' })}</p>
          </div>
          <div className="admin-topbar-actions">
            <button className={`admin-refresh-btn ${loading ? 'spinning' : ''}`} onClick={fetchData}><RefreshCw size={15}/></button>
            <a
              href="https://expense-tracker-fjm5.onrender.com"
              target="_blank"
              rel="noreferrer"
              className="expense-tracker-btn"
            >
              <TrendingUp size={14} /> Expense Tracker
            </a>
            <button className="btn-primary" onClick={() => navigate('/')} style={{ padding:'10px 20px', fontSize:'13px' }}>View Site <ArrowRight size={13}/></button>
          </div>
        </div>

        {/* OVERVIEW */}
        {tab === 'overview' && (
          <div className="admin-content animate-up">
            <div className="kpi-grid">
              {[
                { icon: <MessageSquare size={20}/>, label: 'New Enquiries',   value: newEnq,             color:'#FF6B35', bg:'#FFF0EB' },
                { icon: <MessageSquare size={20}/>, label: 'Total Enquiries', value: enquiries.length,   color:'#3D5A99', bg:'#EEF1F9' },
                { icon: <MapPin size={20}/>,        label: 'Destinations',    value: adminDests.length,  color:'#00A896', bg:'#E6F7F6' },
                { icon: <Package size={20}/>,       label: 'Packages',        value: adminPkgs.length,   color:'#F59E0B', bg:'#FFFBEB' },
              ].map((k,i) => (
                <div className="kpi-card" key={i}>
                  <div className="kpi-icon" style={{ background:k.bg, color:k.color }}>{k.icon}</div>
                  <div className="kpi-value" style={{ color:k.color }}>{k.value}</div>
                  <div className="kpi-label">{k.label}</div>
                </div>
              ))}
            </div>
            <div className="overview-grid">
              <div className="admin-widget">
                <div className="widget-head"><h3>Recent Enquiries</h3><button className="widget-link" onClick={() => setTab('enquiries')}>View all →</button></div>
                {enquiries.length === 0
                  ? <div className="empty-widget"><MessageSquare size={28}/><p>No enquiries yet.</p></div>
                  : <div className="recent-list">{enquiries.slice(0,5).map(e => (
                    <div key={e.id} className="recent-item">
                      <div className="eq-avatar-sm">{e.customerName?.[0]?.toUpperCase()||'?'}</div>
                      <div className="recent-info"><div className="recent-name">{e.customerName}</div><div className="recent-dest"><MapPin size={9}/> {e.selectedPackage}</div></div>
                      <span className={`status-badge ${e.status==='new'?'pending':e.status==='contacted'?'confirmed':'cancelled'}`}>{e.status}</span>
                    </div>
                  ))}</div>
                }
              </div>
              <div className="admin-widget">
                <div className="widget-head"><h3>Quick Actions</h3></div>
                <div className="quick-actions">
                  <button className="qa-btn" onClick={() => { setTab('destinations'); openAddDest(); }}><Plus size={14}/> Add Destination</button>
                  <button className="qa-btn" onClick={() => { setTab('packages'); openAddPkg(); }}><Plus size={14}/> Add Package</button>
                  <button className="qa-btn" onClick={() => setTab('enquiries')}><Eye size={14}/> View Enquiries</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ENQUIRIES */}
        {tab === 'enquiries' && (
          <div className="admin-content animate-up">
            <div className="content-toolbar">
              <div className="status-chips">
                <span className="sc total"><MessageSquare size={12}/> {enquiries.length} Total</span>
                <span className="sc pending">{newEnq} New</span>
                <span className="sc confirmed"><CheckCircle size={12}/> {enquiries.filter(e=>e.status==='contacted').length} Contacted</span>
              </div>
            </div>
            {enquiries.length === 0
              ? <div className="empty-page-state"><MessageSquare size={44}/><h3>No enquiries yet</h3><p>When customers submit trip requests, they'll appear here.</p></div>
              : <div className="enquiries-list">{enquiries.map(e => (
                <div key={e.id} className={`enquiry-card ${e.status==='new'?'is-new':''}`}>
                  <div className="eq-header">
                    <div className="eq-customer">
                      <div className="eq-avatar">{e.customerName?.[0]?.toUpperCase()||'?'}</div>
                      <div>
                        <div className="eq-name">{e.customerName}</div>
                        <div className="eq-time">{e.submittedAt ? new Date(e.submittedAt).toLocaleString('en-IN') : 'Just now'}</div>
                      </div>
                    </div>
                    <div className="eq-actions">
                      <span className={`status-badge ${e.status==='new'?'pending':e.status==='contacted'?'confirmed':'cancelled'}`}>{e.status}</span>
                      <button className="eq-action-btn view" onClick={() => setViewEnquiry(e)}><Eye size={14}/></button>
                      <select className="eq-status-sel" value={e.status} onChange={ev => handleEnqStatus(e.id, ev.target.value)}>
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="converted">Converted</option>
                        <option value="closed">Closed</option>
                      </select>
                    </div>
                  </div>
                  <div className="eq-body">
                    <div className="eq-section"><div className="eq-section-title">Contact</div>
                      <div className="eq-fields">
                        <div className="eq-field"><Mail size={11}/><span>{e.email}</span></div>
                        <div className="eq-field"><Phone size={11}/><span>{e.phone}</span></div>
                        {(e.whatsapp && e.whatsapp !== e.phone) && <div className="eq-field"><i class="fa-brands fa-whatsapp"></i><span>WA: {e.whatsapp}</span></div>}
                        {e.city && <div className="eq-field"><MapPin size={11}/><span>{e.city}</span></div>}
                      </div>
                    </div>
                    <div className="eq-section"><div className="eq-section-title">Selected Trip</div>
                      <div className="eq-fields">
                        <div className="eq-field"><Star size={11}/><span><strong>{e.selectedPackage}</strong></span></div>
                        <div className="eq-field"><MapPin size={11}/><span>{e.packageDestinations}</span></div>
                        <div className="eq-field"><Clock size={11}/><span>{e.packageDuration}</span></div>
                        <div className="eq-field"><Tag size={11}/><span>Budget: {e.budget}</span></div>
                      </div>
                    </div>
                    <div className="eq-section"><div className="eq-section-title">Trip Details</div>
                      <div className="eq-fields">
                        <div className="eq-field"><Users size={11}/><span>{e.travelers} travelers · {e.tripType}</span></div>
                        <div className="eq-field"><Calendar size={11}/><span>{e.departureDate} → {e.returnDate}</span></div>
                        <div className="eq-field"><Tag size={11}/><span>Room: {e.roomType}</span></div>
                        {e.customerMessage && e.customerMessage !== 'No special requests' &&
                          <div className="eq-field"><MessageSquare size={11}/><span><em>"{e.customerMessage}"</em></span></div>}
                      </div>
                    </div>
                  </div>
                  <div className="eq-footer">
                    <button className="btn-primary" onClick={() => { setDraftEnquiryForItinerary(e); setTab('itineraries'); }} style={{ background: '#3B82F6', borderColor: '#3B82F6' }}>
                      <Map size={13}/> Create Itinerary
                    </button>
                    <a href={buildWaUrl(e, waMsg(e))} target="_blank" rel="noreferrer" className="btn-primary eq-contact-btn whatsapp-btn">
                      <i class="fa-brands fa-whatsapp"></i> WhatsApp
                    </a>
                    <a
                      href={`mailto:${e.email}?subject=Your Asquaretravelgoa Trip Enquiry — ${encodeURIComponent(e.selectedPackage)}&body=${encodeURIComponent(emailBody(e))}`}
                      className="btn-primary eq-contact-btn"
                    ><Mail size={13}/> Email</a>
                  </div>
                </div>
              ))}</div>
            }
          </div>
        )}

        {/* FOLLOW-UPS */}
        {tab === 'followups' && (
          <div className="admin-content animate-up">
            <div className="content-toolbar">
              <h3 className="content-sub-title">Daily Follow-ups</h3>
            </div>
            <FollowUpPanel />
          </div>
        )}

        {/* TEMPLATES */}
        {tab === 'templates' && (
          <div className="admin-content animate-up">
            <TemplateLibrary templates={adminTemplates} enquiries={enquiries} fetchData={fetchData} />
          </div>
        )}

        {/* ITINERARIES */}
        {tab === 'itineraries' && (
          <div className="admin-content animate-up">
            <ItineraryBuilder itineraries={itineraries} fetchData={fetchData} draftEnquiry={draftEnquiryForItinerary} clearDraft={() => setDraftEnquiryForItinerary(null)} />
          </div>
        )}

        {/* DESTINATIONS */}
        {tab === 'destinations' && (
          <div className="admin-content animate-up">
            <div className="content-toolbar">
              <h3 className="content-sub-title">Destinations <span>({adminDests.length} added · shown on website)</span></h3>
              <button className="btn-primary" onClick={openAddDest} style={{ padding:'10px 20px', fontSize:'13px' }}>
                <Plus size={15}/> Add Destination
              </button>
            </div>
            {adminDests.length === 0
              ? <div className="empty-page-state"><MapPin size={44}/><h3>No destinations added yet</h3><p>Add destinations here — they appear instantly on the website.</p><button className="btn-primary" onClick={openAddDest} style={{ marginTop:16 }}><Plus size={15}/> Add First Destination</button></div>
              : <div className="admin-dest-grid">{adminDests.map(d => (
                <div key={d.id} className="admin-dest-card">
                  {d.image ? <img src={d.image} alt={d.name} className="adc-img" /> : <div className="adc-img-placeholder">🌍</div>}
                  <div className="adc-body">
                    <div className="adc-tag">{d.tag || d.category}</div>
                    <div className="adc-name">{d.name}</div>
                    <div className="adc-country"><MapPin size={10}/> {d.country}</div>
                    <div className="adc-meta"><span><Clock size={10}/> {d.duration}</span><span><Star size={10}/> {d.rating}</span></div>
                  </div>
                  <div className="adc-actions">
                    <button className="adc-btn edit" onClick={() => openEditDest(d)}><Edit2 size={13}/></button>
                    <button className="adc-btn delete" onClick={() => deleteDest(d.id)}><Trash2 size={13}/></button>
                  </div>
                </div>
              ))}</div>
            }
          </div>
        )}

        {/* PACKAGES */}
        {tab === 'packages' && (
          <div className="admin-content animate-up">
            <div className="content-toolbar">
              <h3 className="content-sub-title">Packages <span>({adminPkgs.length} added · shown on website)</span></h3>
              <button className="btn-primary" onClick={openAddPkg} style={{ padding:'10px 20px', fontSize:'13px' }}>
                <Plus size={15}/> Add Package
              </button>
            </div>
            {adminPkgs.length === 0
              ? <div className="empty-page-state"><Package size={44}/><h3>No packages added yet</h3><p>Add all-inclusive packages here — they appear on the website instantly.</p><button className="btn-primary" onClick={openAddPkg} style={{ marginTop:16 }}><Plus size={15}/> Add First Package</button></div>
              : <div className="admin-dest-grid">{adminPkgs.map(p => (
                <div key={p.id} className="admin-dest-card">
                  {p.image ? <img src={p.image} alt={p.name} className="adc-img" /> : <div className="adc-img-placeholder">📦</div>}
                  <div className="adc-body">
                    <div className="adc-tag" style={{ color: p.color||'var(--coral)' }}>{p.tag}</div>
                    <div className="adc-name">{p.name}</div>
                    <div className="adc-country"><MapPin size={10}/> {Array.isArray(p.destinations) ? p.destinations.join(', ') : p.destinations}</div>
                    <div className="adc-meta"><span><Clock size={10}/> {p.duration}</span><span><Star size={10}/> {p.rating}</span></div>
                  </div>
                  <div className="adc-actions">
                    <button className="adc-btn edit" onClick={() => openEditPkg(p)}><Edit2 size={13}/></button>
                    <button className="adc-btn delete" onClick={() => deletePkg(p.id)}><Trash2 size={13}/></button>
                  </div>
                </div>
              ))}</div>
            }
          </div>
        )}

        {/* USERS */}
        {tab === 'users' && (
          <div className="admin-content animate-up">
            <div className="user-stats-row">
              {[['Total Users', fbUsers.length||1], ['Enquiries', enquiries.length], ['Destinations', adminDests.length], ['Packages', adminPkgs.length]].map(([l,v]) => (
                <div key={l} className="user-stat-card"><div className="usc-val">{v}</div><div className="usc-label">{l}</div></div>
              ))}
            </div>
            <div className="data-table-wrap">
              <div className="users-table">
                <div className="ut-header"><span>User</span><span>Email</span><span>Provider</span><span>Joined</span><span>Enquiries</span></div>
                {[...(fbUsers.length ? fbUsers : [{ uid: user.uid, name: user.name, email: user.email, photo: user.photo, provider: 'google' }])].map(u => (
                  <div key={u.uid||u.id} className="ut-row">
                    <span className="ut-user"><img src={u.photo||`https://ui-avatars.com/api/?name=${encodeURIComponent(u.name||'U')}&background=FF6B35&color=fff`} alt=""/><div><div className="ut-name">{u.name} {u.email===ADMIN_EMAIL && <span className="admin-badge">Admin</span>}</div><div className="ut-uid">{u.uid?.slice(0,12)}...</div></div></span>
                    <span className="ut-email">{u.email}</span>
                    <span><span className={`provider-tag ${u.provider||'email'}`}>{u.provider||'email'}</span></span>
                    <span className="ut-date">{u.createdAt?.toDate?.() ? new Date(u.createdAt.toDate()).toLocaleDateString() : 'N/A'}</span>
                    <span>{enquiries.filter(e=>e.email===u.email).length}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* REVIEWS */}
        {tab === 'reviews' && (
          <div className="admin-content animate-up">
            <div className="content-toolbar">
              <h3 className="content-sub-title">Customer Feedback <span>({feedbacks.length} reviews)</span></h3>
            </div>
            {feedbacks.length === 0
              ? <div className="empty-page-state"><Star size={44}/><h3>No feedback yet</h3><p>When customers submit feedback after their trip, it will appear here.</p></div>
              : <div className="reviews-grid">
                  {feedbacks.map(f => (
                    <div key={f.id} className="review-card" onClick={() => setViewFeedback(f)} style={{cursor: 'pointer'}}>
                      <div className="review-header">
                        <div className="review-rating">
                           {[...Array(5)].map((_,i) => <Star key={i} size={14} fill={i < f.rating ? '#FFD700' : 'transparent'} color={i < f.rating ? '#FFD700' : '#E5E7EB'} />)}
                        </div>
                        <div className="review-date">{f.createdAt?.toDate ? new Date(f.createdAt.toDate()).toLocaleDateString() : 'Recent'}</div>
                      </div>
                      <div className="review-comments">
                        {f.comments && <p>"{f.comments}"</p>}
                        {f.highlight && <p style={{marginTop: f.comments ? '8px' : '0', fontSize: '13px', color: '#1A1A2E'}}><strong>Loved:</strong> {f.highlight}</p>}
                        {f.improvement && <p style={{marginTop: '4px', fontSize: '13px', color: '#1A1A2E'}}><strong>Needs work:</strong> {f.improvement}</p>}
                      </div>
                      <div className="review-footer">Booking ID: {f.bookingId || 'N/A'}</div>
                    </div>
                  ))}
                </div>
            }
          </div>
        )}

        {/* Modals & Overlays */}
        {destModal && (
          <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setDestModal(null)}>
            <div className="modal-content admin-modal">
              <div className="modal-header">
                <h2>{destModal === 'add' ? 'Add Destination' : 'Edit Destination'}</h2>
                <button className="modal-close" onClick={() => setDestModal(null)}><X size={20}/></button>
              </div>
              <div className="modal-body admin-form-grid">
                {/* Basic Details */}
                <div className="form-group">
                  <label>Name</label>
                  <input type="text" value={destForm.name} onChange={e=>updDest('name',e.target.value)} placeholder="e.g. North Goa"/>
                </div>
                <div className="form-group">
                  <label>Location / Country</label>
                  <input type="text" value={destForm.country} onChange={e=>updDest('country',e.target.value)} placeholder="e.g. Goa, India"/>
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <select value={destForm.category} onChange={e=>updDest('category',e.target.value)}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Duration (Optional)</label>
                  <input type="text" value={destForm.duration} onChange={e=>updDest('duration',e.target.value)} placeholder="e.g. 4 Days"/>
                </div>
                <div className="form-group">
                  <label>Rating (e.g. 4.9)</label>
                  <input type="number" step="0.1" value={destForm.rating} onChange={e=>updDest('rating',e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Tag (e.g. Most Popular)</label>
                  <input type="text" value={destForm.tag} onChange={e=>updDest('tag',e.target.value)} />
                </div>
                <div className="form-group" style={{ gridColumn:'1 / -1' }}>
                  <label>Image URL or Upload File</label>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <input type="text" value={destForm.image} onChange={e=>updDest('image',e.target.value)} placeholder="https://..." style={{ flex: 1 }}/>
                    <input type="file" accept="image/*" onChange={async (e) => {
                      const file = e.target.files[0];
                      if (!file) return;
                      toast.loading('Uploading image...', { id: 'img-upload' });
                      try {
                        const url = await uploadImage(file, 'destinations');
                        updDest('image', url);
                        toast.success('Image uploaded!', { id: 'img-upload' });
                      } catch (err) {
                        toast.error('Upload failed', { id: 'img-upload' });
                      }
                    }} style={{ flex: 1, padding: '7px' }} />
                  </div>
                  {destForm.image && <img src={destForm.image} alt="Preview" style={{ height: '60px', width: '90px', objectFit: 'cover', borderRadius: '6px', marginTop: '4px', border: '1px solid var(--sand)' }} />}
                </div>
                <div className="form-group" style={{ gridColumn:'1 / -1' }}>
                  <label>Highlights (Comma separated)</label>
                  <input type="text" value={destForm.highlights} onChange={e=>updDest('highlights',e.target.value)} placeholder="Beach, Nightlife, Shopping..."/>
                </div>
                <div className="form-group" style={{ gridColumn:'1 / -1' }}>
                  <label>Description</label>
                  <textarea value={destForm.description} onChange={e=>updDest('description',e.target.value)} rows={3}/>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn-ghost" onClick={() => setDestModal(null)}>Cancel</button>
                <button className={`btn-primary ${saving?'spinning':''}`} onClick={saveDest}>{saving ? <RefreshCw size={16}/> : 'Save Destination'}</button>
              </div>
            </div>
          </div>
        )}

        {pkgModal && (
          <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setPkgModal(null)}>
            <div className="modal-content admin-modal">
              <div className="modal-header">
                <h2>{pkgModal === 'add' ? 'Add Package' : 'Edit Package'}</h2>
                <button className="modal-close" onClick={() => setPkgModal(null)}><X size={20}/></button>
              </div>
              <div className="modal-body admin-form-grid">
                {/* Basic Details */}
                <div className="form-group" style={{ gridColumn:'1 / -1' }}>
                  <label>Package Name</label>
                  <input type="text" value={pkgForm.name} onChange={e=>updPkg('name',e.target.value)} placeholder="e.g. Goa Sun & Soul Escape"/>
                </div>
                <div className="form-group">
                  <label>Destinations (Comma separated)</label>
                  <input type="text" value={pkgForm.destinations} onChange={e=>updPkg('destinations',e.target.value)} placeholder="North Goa, South Goa"/>
                </div>
                <div className="form-group">
                  <label>Duration</label>
                  <input type="text" value={pkgForm.duration} onChange={e=>updPkg('duration',e.target.value)} placeholder="e.g. 5 Days / 4 Nights"/>
                </div>
                <div className="form-group">
                  <label>Rating (e.g. 4.9)</label>
                  <input type="number" step="0.1" value={pkgForm.rating} onChange={e=>updPkg('rating',e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Tag (e.g. 🌴 Goa Special)</label>
                  <input type="text" value={pkgForm.tag} onChange={e=>updPkg('tag',e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Color Code (e.g. #FF6B35)</label>
                  <select value={pkgForm.color} onChange={e=>updPkg('color',e.target.value)}>
                    {PKG_COLORS.map(c => <option key={c} value={c} style={{ background: c, color: '#fff' }}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group" style={{ gridColumn:'1 / -1' }}>
                  <label>Image URL or Upload File</label>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <input type="text" value={pkgForm.image} onChange={e=>updPkg('image',e.target.value)} placeholder="https://..." style={{ flex: 1 }}/>
                    <input type="file" accept="image/*" onChange={async (e) => {
                      const file = e.target.files[0];
                      if (!file) return;
                      toast.loading('Uploading image...', { id: 'img-upload' });
                      try {
                        const url = await uploadImage(file, 'packages');
                        updPkg('image', url);
                        toast.success('Image uploaded!', { id: 'img-upload' });
                      } catch (err) {
                        toast.error('Upload failed', { id: 'img-upload' });
                      }
                    }} style={{ flex: 1, padding: '7px' }} />
                  </div>
                  {pkgForm.image && <img src={pkgForm.image} alt="Preview" style={{ height: '60px', width: '90px', objectFit: 'cover', borderRadius: '6px', marginTop: '4px', border: '1px solid var(--sand)' }} />}
                </div>
                <div className="form-group" style={{ gridColumn:'1 / -1' }}>
                  <label>Includes (Comma separated)</label>
                  <input type="text" value={pkgForm.includes} onChange={e=>updPkg('includes',e.target.value)} placeholder="Beach Resort, Breakfast, Airport Transfers..."/>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn-ghost" onClick={() => setPkgModal(null)}>Cancel</button>
                <button className={`btn-primary ${saving?'spinning':''}`} onClick={savePkg}>{saving ? <RefreshCw size={16}/> : 'Save Package'}</button>
              </div>
            </div>
          </div>
        )}

      </main>


      {/* ENQUIRY DETAIL MODAL */}
      {viewEnquiry && (
        <div className="modal-overlay" onClick={e => { if (e.target===e.currentTarget) { setViewEnquiry(null); setSelectedTemplate(''); setCustomMsg(''); }}}>
          <div className="enquiry-detail-modal">
            <div className="modal-header">
              <h2 className="modal-title">Enquiry — {viewEnquiry.customerName}</h2>
              <button className="modal-close" onClick={() => { setViewEnquiry(null); setSelectedTemplate(''); setCustomMsg(''); }}><X size={18}/></button>
            </div>
            <div className="modal-body enq-detail-body">
              <div className="enq-detail-grid">
                {[
                  ['Name',        viewEnquiry.customerName],
                  ['Email',       viewEnquiry.email],
                  ['Phone',       viewEnquiry.phone],
                  ['WhatsApp',    viewEnquiry.whatsapp || viewEnquiry.phone],
                  ['City',        viewEnquiry.city||'—'],
                  ['Package',     viewEnquiry.selectedPackage],
                  ['Destinations',viewEnquiry.packageDestinations],
                  ['Duration',    viewEnquiry.packageDuration],
                  ['Travelers',   viewEnquiry.travelers],
                  ['Departure',   viewEnquiry.departureDate],
                  ['Return',      viewEnquiry.returnDate],
                  ['Trip Type',   viewEnquiry.tripType],
                  ['Room',        viewEnquiry.roomType],
                  ['Budget',      viewEnquiry.budget],
                  ['Status',      viewEnquiry.status],
                  ['Submitted',   viewEnquiry.submittedAt ? new Date(viewEnquiry.submittedAt).toLocaleString() : 'N/A'],
                ].map(([l,v]) => (
                  <div key={l} className="enq-detail-row"><span className="enq-detail-label">{l}</span><span className="enq-detail-val">{v}</span></div>
                ))}
              </div>
              {viewEnquiry.customerMessage && viewEnquiry.customerMessage!=='No special requests' && (
                <div className="enq-message-box"><div className="enq-detail-label">Customer Message</div><p>"{viewEnquiry.customerMessage}"</p></div>
              )}

              {/* Template Selector for Quick Reply */}
              <div className="quick-reply-section" style={{ marginTop: '20px', backgroundColor: '#F8FAFC', padding: '15px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                <div style={{ fontWeight: 600, color: '#1E293B', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <FileText size={14} /> Quick Reply
                </div>
                {adminTemplates.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <select 
                      value={selectedTemplate} 
                      onChange={e => setSelectedTemplate(e.target.value)}
                      style={{ padding: '8px', borderRadius: '6px', border: '1px solid #CBD5E1', width: '100%' }}
                    >
                      <option value="">Select a quick reply...</option>
                      {adminTemplates.map(t => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                      ))}
                    </select>
                    {customMsg && (
                      <textarea 
                        value={customMsg}
                        onChange={e => setCustomMsg(e.target.value)}
                        rows={6}
                        style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13px', resize: 'vertical' }}
                      />
                    )}
                  </div>
                ) : (
                  <div style={{ fontSize: '13px', color: '#64748B' }}>No quick replies available. Create some in the Quick Replies tab!</div>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <a href={buildWaUrl(viewEnquiry, waMsg(viewEnquiry))} target="_blank" rel="noreferrer" className="btn-primary whatsapp-btn">
                <i class="fa-brands fa-whatsapp"></i> WhatsApp
              </a>
              <a
                href={`mailto:${viewEnquiry.email}?subject=Your Asquaretravelgoa Trip Enquiry — ${encodeURIComponent(viewEnquiry.selectedPackage || '')}&body=${encodeURIComponent(emailBody(viewEnquiry))}`}
                className="btn-primary"
              ><Mail size={14}/> Reply via Email</a>
              <a href={`tel:${viewEnquiry.phone}`} className="btn-ghost"><Phone size={14}/> Call</a>
            </div>
          </div>
        </div>
      )}

      {/* FEEDBACK DETAIL MODAL */}
      {viewFeedback && (
        <div className="modal-overlay" onClick={e => e.target===e.currentTarget && setViewFeedback(null)}>
          <div className="enquiry-detail-modal">
            <div className="modal-header">
              <h2 className="modal-title">Review Details</h2>
              <button className="modal-close" onClick={() => setViewFeedback(null)}><X size={18}/></button>
            </div>
            <div className="modal-body enq-detail-body">
              <div className="enq-detail-grid">
                <div className="enq-detail-row">
                  <span className="enq-detail-label">Overall Rating</span>
                  <span className="enq-detail-val">{viewFeedback.rating}/5</span>
                </div>
                {viewFeedback.guideRating > 0 && (
                  <div className="enq-detail-row">
                    <span className="enq-detail-label">Tour Guide</span>
                    <span className="enq-detail-val">{viewFeedback.guideRating}/5</span>
                  </div>
                )}
                {viewFeedback.accommodationRating > 0 && (
                  <div className="enq-detail-row">
                    <span className="enq-detail-label">Accommodation</span>
                    <span className="enq-detail-val">{viewFeedback.accommodationRating}/5</span>
                  </div>
                )}
                {viewFeedback.transportRating > 0 && (
                  <div className="enq-detail-row">
                    <span className="enq-detail-label">Transport</span>
                    <span className="enq-detail-val">{viewFeedback.transportRating}/5</span>
                  </div>
                )}
                {viewFeedback.valueRating > 0 && (
                  <div className="enq-detail-row">
                    <span className="enq-detail-label">Value for Money</span>
                    <span className="enq-detail-val">{viewFeedback.valueRating}/5</span>
                  </div>
                )}
                <div className="enq-detail-row">
                  <span className="enq-detail-label">Booking ID</span>
                  <span className="enq-detail-val">{viewFeedback.bookingId || 'N/A'}</span>
                </div>
                <div className="enq-detail-row">
                  <span className="enq-detail-label">Submitted On</span>
                  <span className="enq-detail-val">{viewFeedback.createdAt?.toDate ? new Date(viewFeedback.createdAt.toDate()).toLocaleDateString() : 'Recent'}</span>
                </div>
              </div>
              
              {viewFeedback.highlight && (
                <div className="enq-message-box" style={{backgroundColor: '#F8FAFC'}}>
                  <div className="enq-detail-label" style={{color: '#0D9488'}}>Loved</div>
                  <p style={{fontStyle: 'normal', color: '#0F172A'}}>{viewFeedback.highlight}</p>
                </div>
              )}
              
              {viewFeedback.improvement && (
                <div className="enq-message-box" style={{backgroundColor: '#FFF1F2'}}>
                  <div className="enq-detail-label" style={{color: '#E11D48'}}>Needs Improvement</div>
                  <p style={{fontStyle: 'normal', color: '#0F172A'}}>{viewFeedback.improvement}</p>
                </div>
              )}
              
              {viewFeedback.comments && (
                <div className="enq-message-box">
                  <div className="enq-detail-label">Comments</div>
                  <p>"{viewFeedback.comments}"</p>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn-primary" style={{width: '100%', justifyContent: 'center'}} onClick={() => setViewFeedback(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Logo Modal */}
      {logoModalOpen && (
        <div className="logo-modal-overlay" onClick={e => e.target === e.currentTarget && setLogoModalOpen(false)}>
          <div className="logo-modal-content">
            <img src="/logo.jpeg" alt="Asquaretravelgoa Logo" className="logo-modal-img" />
            <div className="logo-modal-actions">
              <button className="btn-primary" onClick={() => { setLogoModalOpen(false); navigate('/'); }}>Go to Home</button>
              <button className="btn-ghost" onClick={() => setLogoModalOpen(false)}>Back</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}