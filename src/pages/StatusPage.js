import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ServiceCard from '../components/ServiceCard';

const ALB = 'https://d1wwgn689544k.cloudfront.net';

export default function StatusPage() {
  const { username } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
axios.get(`${ALB}/api/status/${username}`)
      .then(res => setData(res.data))
      .catch(() => setError('Status page not found'))
      .finally(() => setLoading(false));
  }, [username]);

  const allUp = data?.services?.every(s => s.status === 'UP');
  const anyDown = data?.services?.some(s => s.status === 'DOWN');
  const upCount = data?.services?.filter(s => s.status === 'UP').length ?? 0;
  const total = data?.services?.length ?? 0;

  if (loading) return <div style={{color:'#94a3b8',textAlign:'center',marginTop:'100px',fontFamily:'Inter,sans-serif'}}>Loading...</div>;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { margin:0; padding:0; box-sizing:border-box; }
        body { font-family:'Inter',sans-serif; background:#020817; }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(1.4)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        .svc-card:hover { border-color:rgba(59,130,246,0.25) !important; transform:translateX(2px); }
        .svc-card { transition:all 0.2s ease; }
        .back-btn:hover { background:rgba(255,255,255,0.08) !important; }
        .fade { animation: fadeUp 0.5s ease forwards; }
      `}</style>

      <div style={{position:'relative',zIndex:1,minHeight:'100vh',padding:'0 24px 80px',fontFamily:'Inter,sans-serif'}}>
        <div style={{maxWidth:'760px',margin:'0 auto'}}>

          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'24px 0',marginBottom:'32px',borderBottom:'1px solid rgba(255,255,255,0.05)'}}>
            <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
              <div style={{width:'28px',height:'28px',borderRadius:'7px',background:'linear-gradient(135deg,#3b82f6,#8b5cf6)',display:'flex',alignItems:'center',justifyContent:'center'}}>
                <div style={{width:'8px',height:'8px',borderRadius:'50%',background:'#fff'}} />
              </div>
              <span style={{fontSize:'16px',fontWeight:'700',color:'#f8fafc'}}>StatusNest</span>
            </div>
            <button className="back-btn" onClick={() => navigate('/')} style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)',color:'#64748b',cursor:'pointer',fontSize:'13px',padding:'7px 16px',borderRadius:'8px',transition:'all 0.2s',fontWeight:'500'}}>
              &larr; Back
            </button>
          </div>

          <div style={{marginBottom:'32px'}}>
            <div style={{display:'flex',alignItems:'center',gap:'12px',marginBottom:'6px'}}>
              <h1 style={{fontSize:'32px',fontWeight:'800',color:'#f8fafc'}}>@{username}</h1>
              {anyDown && <span style={{background:'rgba(239,68,68,0.1)',border:'1px solid rgba(239,68,68,0.2)',color:'#ef4444',fontSize:'12px',fontWeight:'600',padding:'3px 10px',borderRadius:'999px'}}>Incident</span>}
            </div>
            <p style={{color:'#475569',fontSize:'14px'}}>Public Service Status Page</p>
          </div>

          {error && (
            <div style={{background:'rgba(239,68,68,0.06)',border:'1px solid rgba(239,68,68,0.15)',borderRadius:'12px',padding:'20px 24px',color:'#ef4444'}}>
              Status page not found
            </div>
          )}

          {data && (
            <>
              <div className="fade" style={{borderRadius:'14px',padding:'20px 24px',marginBottom:'32px',border:'1px solid',display:'flex',justifyContent:'space-between',alignItems:'center',
                background: anyDown ? 'rgba(239,68,68,0.06)' : 'rgba(34,197,94,0.06)',
                borderColor: anyDown ? 'rgba(239,68,68,0.15)' : 'rgba(34,197,94,0.15)',
              }}>
                <div style={{display:'flex',alignItems:'center',gap:'14px'}}>
                  <div style={{width:'12px',height:'12px',borderRadius:'50%',animation:'pulse 2s infinite',
                    background: anyDown ? '#ef4444' : '#22c55e',
                    boxShadow:`0 0 12px ${anyDown ? '#ef4444' : '#22c55e'}`,
                  }} />
                  <div>
                    <p style={{color:'#f1f5f9',fontWeight:'700',fontSize:'15px'}}>
                      {anyDown ? 'Incident in progress' : 'All systems operational'}
                    </p>
                    <p style={{color:'#475569',fontSize:'12px',marginTop:'2px'}}>Last updated just now</p>
                  </div>
                </div>
                <div style={{textAlign:'right'}}>
                  <p style={{color:'#f8fafc',fontWeight:'800',fontSize:'20px'}}>{total > 0 ? Math.round((upCount/total)*100) : 0}%</p>
                  <p style={{color:'#475569',fontSize:'12px'}}>{upCount}/{total} operational</p>
                </div>
              </div>

              <p style={{color:'#334155',fontSize:'11px',fontWeight:'700',letterSpacing:'1px',textTransform:'uppercase',marginBottom:'12px'}}>
                Services &mdash; {total} monitored
              </p>

              <div style={{display:'flex',flexDirection:'column',gap:'8px',marginBottom:'48px'}}>
                {(data.services || []).map(svc => (
                  <ServiceCard key={svc.service_id} service={svc} alb={ALB} username={username} />
                ))}
              </div>

              <div style={{textAlign:'center',paddingTop:'24px',borderTop:'1px solid rgba(255,255,255,0.05)'}}>
                <p style={{color:'#1e293b',fontSize:'12px'}}>
                  Built by <a href="https://github.com/aboodi679" style={{color:'#3b82f6',textDecoration:'none',fontWeight:'600'}}>Muhammad Abdullah</a> &middot; Powered by AWS ECS &middot; Redis &middot; Lambda
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}