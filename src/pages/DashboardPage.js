import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ALB = 'https://d1wwgn689544k.cloudfront.net';

const api = (token) => ({
  headers: { Authorization: `Bearer ${token}` }
});

const S = {
  input: { width:'100%', padding:'11px 14px', borderRadius:'9px', border:'1px solid rgba(255,255,255,0.08)', background:'rgba(255,255,255,0.03)', color:'#f8fafc', fontSize:'14px', fontFamily:'Inter,sans-serif', transition:'all 0.2s' },
  btn: (variant='primary') => ({
    padding: variant==='sm' ? '7px 14px' : '11px 20px',
    borderRadius:'8px', border:'none', cursor:'pointer', fontSize:'13px', fontWeight:'600', fontFamily:'Inter,sans-serif', transition:'all 0.2s',
    background: variant==='primary' ? 'linear-gradient(135deg,#3b82f6,#6d28d9)' : variant==='danger' ? 'rgba(239,68,68,0.1)' : 'rgba(255,255,255,0.06)',
    color: variant==='danger' ? '#ef4444' : '#f8fafc',
    border: variant==='danger' ? '1px solid rgba(239,68,68,0.2)' : variant==='ghost' ? '1px solid rgba(255,255,255,0.08)' : 'none',
  }),
  card: { background:'rgba(15,23,42,0.6)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:'12px', padding:'20px 24px', marginBottom:'10px' },
  label: { display:'block', color:'#94a3b8', fontSize:'12px', fontWeight:'600', marginBottom:'7px', letterSpacing:'0.3px' },
  badge: (status) => ({
    padding:'3px 10px', borderRadius:'999px', fontSize:'11px', fontWeight:'700', letterSpacing:'0.3px',
    background: status==='UP' ? 'rgba(34,197,94,0.1)' : status==='DOWN' ? 'rgba(239,68,68,0.1)' : 'rgba(148,163,184,0.1)',
    color: status==='UP' ? '#22c55e' : status==='DOWN' ? '#ef4444' : '#94a3b8',
    border: `1px solid ${status==='UP' ? 'rgba(34,197,94,0.2)' : status==='DOWN' ? 'rgba(239,68,68,0.2)' : 'rgba(148,163,184,0.15)'}`,
  }),
};

function Modal({ title, onClose, children }) {
  return (
    <div style={{position:'fixed',inset:0,zIndex:50,display:'flex',alignItems:'center',justifyContent:'center',padding:'24px'}}>
      <div onClick={onClose} style={{position:'absolute',inset:0,background:'rgba(0,0,0,0.6)',backdropFilter:'blur(4px)'}} />
      <div style={{position:'relative',width:'100%',maxWidth:'420px',background:'#0d1526',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'16px',padding:'28px',zIndex:1}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'24px'}}>
          <h3 style={{color:'#f8fafc',fontSize:'16px',fontWeight:'700'}}>{title}</h3>
          {/* FIX 1: was garbled Ãƒâ€" encoding */}
          <button onClick={onClose} style={{background:'none',border:'none',color:'#475569',cursor:'pointer',fontSize:'20px',lineHeight:1}}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const email = localStorage.getItem('email') || 'User';

  const [tab, setTab] = useState('services');
  const [services, setServices] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    navigate('/login');
  };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [s, i, sub, st] = await Promise.all([
        axios.get(`${ALB}/api/monitor/services`, api(token)),
        axios.get(`${ALB}/api/monitor/incidents`, api(token)),
        axios.get(`${ALB}/api/monitor/subscribers`, api(token)),
        axios.get(`${ALB}/api/status/abood`),
      ]);
      const statusMap = {};
      (st.data?.services || []).forEach(x => { statusMap[x.id] = x.status; });
     setServices((s.data || []).map(svc => ({ ...svc, status: statusMap[svc.id] || 'UNKNOWN' })));
      setIncidents(i.data || []);
      setSubscribers(sub.data || []);
    } catch (e) {
      if (e.response?.status === 401) logout();
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { load(); }, [load]);

  const openModal = (type, item = null) => {
    setError('');
    setForm({});
    setSelected(item);
    setModal(type);
  };

  const closeModal = () => { setModal(null); setSelected(null); setForm({}); setError(''); };

  const handleAddService = async () => {
    if (!form.name || !form.url) return setError('Name and URL are required');
    setSaving(true);
    try {
      await axios.post(`${ALB}/api/monitor/services`, { name: form.name, url: form.url }, api(token));
      await load(); closeModal();
    } catch (e) { setError(e.response?.data?.detail || 'Failed to add service'); }
    finally { setSaving(false); }
  };

  const handleDeleteService = async (id) => {
    if (!window.confirm('Delete this service?')) return;
    try {
      await axios.delete(`${ALB}/api/monitor/services/${id}`, api(token));
      await load();
    } catch (e) { alert('Failed to delete service'); }
  };

  const handleAddIncident = async () => {
    if (!form.title || !form.service_id) return setError('Title and service are required');
    setSaving(true);
    try {
      await axios.post(`${ALB}/api/monitor/incidents`, { title: form.title, service_id: form.service_id, description: form.description || '' }, api(token));
      await load(); closeModal();
    } catch (e) { setError(e.response?.data?.detail || 'Failed to create incident'); }
    finally { setSaving(false); }
  };

  const handleUpdateIncident = async () => {
    if (!form.status) return setError('Status is required');
    setSaving(true);
    try {
      // FIX 2: was missing /api/monitor/ prefix
      await axios.patch(`${ALB}/api/monitor/incidents/${selected.incident_id}`, { status: form.status, message: form.message || '' }, api(token));
      await load(); closeModal();
    } catch (e) { setError(e.response?.data?.detail || 'Failed to update incident'); }
    finally { setSaving(false); }
  };

  const handleAddSubscriber = async () => {
    if (!form.email) return setError('Email is required');
    setSaving(true);
    try {
      // FIX 3: was missing /api/monitor/ prefix
      await axios.post(`${ALB}/api/monitor/subscribers`, { email: form.email }, api(token));
      await load(); closeModal();
    } catch (e) { setError(e.response?.data?.detail || 'Failed to add subscriber'); }
    finally { setSaving(false); }
  };

  const TABS = [
    { id:'services', label:'Services', count: services.length },
    { id:'incidents', label:'Incidents', count: incidents.length },
    { id:'subscribers', label:'Subscribers', count: subscribers.length },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { margin:0; padding:0; box-sizing:border-box; }
        body { font-family:'Inter',sans-serif; background:#020817; }
        input,select,button,textarea { font-family:'Inter',sans-serif; }
        input:focus,select:focus,textarea:focus { outline:none; border-color:#3b82f6 !important; box-shadow:0 0 0 3px rgba(59,130,246,0.15) !important; }
        select option { background:#0d1526; color:#f8fafc; }
        .tab-btn:hover { color:#94a3b8 !important; }
        .action-btn:hover { opacity:0.8; transform:translateY(-1px); }
        .row-card:hover { border-color:rgba(59,130,246,0.2) !important; }
        .row-card { transition: border-color 0.2s; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        .fade { animation: fadeUp 0.35s ease forwards; }
      `}</style>

      {/* Header */}
      <div style={{borderBottom:'1px solid rgba(255,255,255,0.06)',background:'rgba(2,8,23,0.95)',backdropFilter:'blur(20px)',position:'sticky',top:0,zIndex:10}}>
        <div style={{maxWidth:'960px',margin:'0 auto',padding:'0 24px',height:'60px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
            <div style={{width:'28px',height:'28px',borderRadius:'7px',background:'linear-gradient(135deg,#3b82f6,#8b5cf6)',display:'flex',alignItems:'center',justifyContent:'center'}}>
              <div style={{width:'8px',height:'8px',borderRadius:'50%',background:'#fff'}} />
            </div>
            <span style={{fontSize:'16px',fontWeight:'700',color:'#f8fafc',letterSpacing:'-0.3px'}}>StatusNest</span>
            <span style={{color:'#1e293b',fontSize:'14px',margin:'0 4px'}}>/</span>
            <span style={{color:'#475569',fontSize:'14px'}}>Dashboard</span>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
            <span style={{color:'#475569',fontSize:'13px'}}>{email}</span>
            <button onClick={logout} style={{...S.btn('ghost'),padding:'7px 14px',fontSize:'13px'}}>Logout</button>
          </div>
        </div>
      </div>

      <div style={{maxWidth:'960px',margin:'0 auto',padding:'32px 24px',fontFamily:'Inter,sans-serif'}}>

        {/* Tabs */}
        <div style={{display:'flex',gap:'4px',marginBottom:'28px',background:'rgba(15,23,42,0.5)',border:'1px solid rgba(255,255,255,0.06)',borderRadius:'10px',padding:'4px'}}>
          {TABS.map(t => (
            <button key={t.id} className="tab-btn" onClick={() => setTab(t.id)}
              style={{flex:1,padding:'9px 16px',borderRadius:'7px',border:'none',cursor:'pointer',fontSize:'13px',fontWeight:'600',transition:'all 0.2s',
                background: tab===t.id ? 'rgba(59,130,246,0.15)' : 'transparent',
                color: tab===t.id ? '#3b82f6' : '#475569',
              }}>
              {t.label}
              <span style={{marginLeft:'7px',background:'rgba(255,255,255,0.06)',borderRadius:'999px',padding:'1px 7px',fontSize:'11px',color:'#475569'}}>{t.count}</span>
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{textAlign:'center',color:'#334155',padding:'80px 0',fontSize:'14px'}}>Loading...</div>
        ) : (
          <>
            {/* SERVICES TAB */}
            {tab === 'services' && (
              <div className="fade">
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'20px'}}>
                  <div>
                    <h2 style={{color:'#f8fafc',fontSize:'18px',fontWeight:'700'}}>Services</h2>
                    <p style={{color:'#475569',fontSize:'13px',marginTop:'3px'}}>Monitored every 60 seconds via Lambda</p>
                  </div>
                  <button className="action-btn" style={S.btn('primary')} onClick={() => openModal('add-service')}>+ Add Service</button>
                </div>

                {services.length === 0 ? (
                  <div style={{...S.card, textAlign:'center', padding:'48px', color:'#334155'}}>No services yet. Add one to start monitoring.</div>
                ) : services.map(svc => (
                 <div key={svc.id} className="row-card" style={S.card}>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'4px'}}>
                          <span style={{color:'#f1f5f9',fontWeight:'600',fontSize:'14px'}}>{svc.name}</span>
                          <span style={S.badge(svc.status)}>{svc.status || 'UNKNOWN'}</span>
                        </div>
                        <p style={{color:'#334155',fontSize:'12px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{svc.url}</p>
                      </div>
                      <button className="action-btn" style={{...S.btn('danger'),marginLeft:'16px'}} onClick={() => handleDeleteService(svc.id)}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* INCIDENTS TAB */}
            {tab === 'incidents' && (
              <div className="fade">
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'20px'}}>
                  <div>
                    <h2 style={{color:'#f8fafc',fontSize:'18px',fontWeight:'700'}}>Incidents</h2>
                    <p style={{color:'#475569',fontSize:'13px',marginTop:'3px'}}>Track and communicate outages</p>
                  </div>
                  <button className="action-btn" style={S.btn('primary')} onClick={() => openModal('add-incident')}>+ New Incident</button>
                </div>

                {incidents.length === 0 ? (
                  <div style={{...S.card, textAlign:'center', padding:'48px', color:'#334155'}}>No incidents. All clear!</div>
                ) : incidents.map(inc => (
                  <div key={inc.incident_id} className="row-card" style={S.card}>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
                      <div style={{flex:1}}>
                        <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'6px'}}>
                          <span style={{color:'#f1f5f9',fontWeight:'600',fontSize:'14px'}}>{inc.title}</span>
                          <span style={S.badge(inc.status === 'resolved' ? 'UP' : 'DOWN')}>{inc.status}</span>
                        </div>
                        {inc.description && <p style={{color:'#475569',fontSize:'13px',marginBottom:'6px'}}>{inc.description}</p>}
                        <p style={{color:'#1e293b',fontSize:'12px'}}>{new Date(inc.created_at).toLocaleString()}</p>
                      </div>
                      <button className="action-btn" style={{...S.btn('ghost'),marginLeft:'16px'}} onClick={() => openModal('update-incident', inc)}>Update</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* SUBSCRIBERS TAB */}
            {tab === 'subscribers' && (
              <div className="fade">
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'20px'}}>
                  <div>
                    <h2 style={{color:'#f8fafc',fontSize:'18px',fontWeight:'700'}}>Subscribers</h2>
                    <p style={{color:'#475569',fontSize:'13px',marginTop:'3px'}}>Users subscribed to status alerts</p>
                  </div>
                  <button className="action-btn" style={S.btn('primary')} onClick={() => openModal('add-subscriber')}>+ Add Subscriber</button>
                </div>

                {subscribers.length === 0 ? (
                  <div style={{...S.card, textAlign:'center', padding:'48px', color:'#334155'}}>No subscribers yet.</div>
                ) : subscribers.map((sub, i) => (
                  <div key={sub.subscriber_id || i} className="row-card" style={S.card}>
                    <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
                      <div style={{width:'32px',height:'32px',borderRadius:'8px',background:'rgba(59,130,246,0.1)',border:'1px solid rgba(59,130,246,0.15)',display:'flex',alignItems:'center',justifyContent:'center',color:'#3b82f6',fontSize:'13px',fontWeight:'700',flexShrink:0}}>
                        {(sub.email||'?')[0].toUpperCase()}
                      </div>
                      <span style={{color:'#94a3b8',fontSize:'14px'}}>{sub.email}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* MODALS */}
      {modal === 'add-service' && (
        <Modal title="Add Service" onClose={closeModal}>
          {error && <p style={{color:'#ef4444',fontSize:'13px',marginBottom:'16px'}}>{error}</p>}
          <div style={{marginBottom:'16px'}}>
            <label style={S.label}>SERVICE NAME</label>
            <input style={S.input} placeholder="My API" value={form.name||''} onChange={e => setForm({...form, name:e.target.value})} />
          </div>
          <div style={{marginBottom:'24px'}}>
            <label style={S.label}>URL TO MONITOR</label>
            <input style={S.input} placeholder="https://api.example.com/health" value={form.url||''} onChange={e => setForm({...form, url:e.target.value})} />
          </div>
          <button style={{...S.btn('primary'), width:'100%'}} onClick={handleAddService} disabled={saving}>
            {saving ? 'Adding...' : 'Add Service'}
          </button>
        </Modal>
      )}

      {modal === 'add-incident' && (
        <Modal title="Create Incident" onClose={closeModal}>
          {error && <p style={{color:'#ef4444',fontSize:'13px',marginBottom:'16px'}}>{error}</p>}
          <div style={{marginBottom:'16px'}}>
            <label style={S.label}>TITLE</label>
            <input style={S.input} placeholder="API latency degraded" value={form.title||''} onChange={e => setForm({...form, title:e.target.value})} />
          </div>
          <div style={{marginBottom:'16px'}}>
            <label style={S.label}>SERVICE</label>
            <select style={{...S.input}} value={form.service_id||''} onChange={e => setForm({...form, service_id:e.target.value})}>
              <option value="">Select a service</option>
             {services.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div style={{marginBottom:'24px'}}>
            <label style={S.label}>DESCRIPTION (optional)</label>
            <textarea style={{...S.input, resize:'vertical', minHeight:'80px'}} placeholder="What happened?" value={form.description||''} onChange={e => setForm({...form, description:e.target.value})} />
          </div>
          <button style={{...S.btn('primary'), width:'100%'}} onClick={handleAddIncident} disabled={saving}>
            {saving ? 'Creating...' : 'Create Incident'}
          </button>
        </Modal>
      )}

      {modal === 'update-incident' && selected && (
        <Modal title="Update Incident" onClose={closeModal}>
          {error && <p style={{color:'#ef4444',fontSize:'13px',marginBottom:'16px'}}>{error}</p>}
          <p style={{color:'#475569',fontSize:'13px',marginBottom:'20px'}}>{selected.title}</p>
          <div style={{marginBottom:'16px'}}>
            <label style={S.label}>STATUS</label>
            <select style={{...S.input}} value={form.status||selected.status||''} onChange={e => setForm({...form, status:e.target.value})}>
              <option value="">Select status</option>
              <option value="investigating">Investigating</option>
              <option value="identified">Identified</option>
              <option value="monitoring">Monitoring</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
          <div style={{marginBottom:'24px'}}>
            <label style={S.label}>UPDATE MESSAGE (optional)</label>
            <textarea style={{...S.input, resize:'vertical', minHeight:'80px'}} placeholder="We have identified the issue..." value={form.message||''} onChange={e => setForm({...form, message:e.target.value})} />
          </div>
          <button style={{...S.btn('primary'), width:'100%'}} onClick={handleUpdateIncident} disabled={saving}>
            {saving ? 'Updating...' : 'Update Incident'}
          </button>
        </Modal>
      )}

      {modal === 'add-subscriber' && (
        <Modal title="Add Subscriber" onClose={closeModal}>
          {error && <p style={{color:'#ef4444',fontSize:'13px',marginBottom:'16px'}}>{error}</p>}
          <div style={{marginBottom:'24px'}}>
            <label style={S.label}>EMAIL ADDRESS</label>
            <input style={S.input} type="email" placeholder="subscriber@example.com" value={form.email||''} onChange={e => setForm({...form, email:e.target.value})} />
          </div>
          <button style={{...S.btn('primary'), width:'100%'}} onClick={handleAddSubscriber} disabled={saving}>
            {saving ? 'Adding...' : 'Add Subscriber'}
          </button>
        </Modal>
      )}
    </>
  );
}