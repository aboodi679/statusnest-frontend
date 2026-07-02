import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ServiceCard from '../components/ServiceCard';

const ALB = 'http://statusnest-dev-alb-1293848550.us-east-1.elb.amazonaws.com';

export default function StatusPage({ username, onBack }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${ALB}/status/${username}`)
      .then(res => setData(res.data))
      .catch(() => setError('Status page not found'))
      .finally(() => setLoading(false));
  }, [username]);

  const allUp = data?.services?.every(s => s.status === 'UP');
  const anyDown = data?.services?.some(s => s.status === 'DOWN');
  const upCount = data?.services?.filter(s => s.status === 'UP').length ?? 0;
  const total = data?.services?.length ?? 0;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { margin:0; padding:0; box-sizing:border-box; }
        body { font-family:'Inter',sans-serif; background:#020817; }
        input,button { font-family:'Inter',sans-serif; }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(1.4)} }
        @keyframes spin { to{transform:rotate(360deg)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes drift1 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(20px,-15px)} }
        @keyframes drift2 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-20px,15px)} }
        .svc-card:hover { border-color:rgba(59,130,246,0.25) !important; transform:translateX(2px); }
        .svc-card { transition:all 0.2s ease; }
        .back-btn:hover { background:rgba(255,255,255,0.08) !important; color:#94a3b8 !important; }
        .hist-btn:hover { background:rgba(59,130,246,0.15) !important; border-color:rgba(59,130,246,0.3) !important; color:#3b82f6 !important; }
        .fade { animation: fadeUp 0.5s ease forwards; }
      `}</style>

      {/* Ambient */}
      <div style={{position:'fixed',inset:0,zIndex:0,pointerEvents:'none',overflow:'hidden'}}>
        <div style={{position:'absolute',width:'500px',height:'500px',borderRadius:'50%',background:'radial-gradient(circle,rgba(59,130,246,0.08) 0%,transparent 70%)',top:'-100px',right:'10%',animation:'drift1 14s ease-in-out infinite'}} />
        <div style={{position:'absolute',width:'400px',height:'400px',borderRadius:'50%',background:'radial-gradient(circle,rgba(139,92,246,0.07) 0%,transparent 70%)',bottom:'10%',left:'-50px',animation:'drift2 17s ease-in-out infinite'}} />
        <div style={{position:'absolute',inset:0,backgroundImage:'linear-gradient(rgba(255,255,255,0.015) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.015) 1px,transparent 1px)',backgroundSize:'48px 48px'}} />
      </div>

      <div style={{position:'relative',zIndex:1,minHeight:'100vh',padding:'0 24px 80px'}}>
        <div style={{maxWidth:'760px',margin:'0 auto'}}>

          {/* Nav */}
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'24px 0',marginBottom:'32px',borderBottom:'1px solid rgba(255,255,255,0.05)'}}>
            <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
              <div style={{width:'28px',height:'28px',borderRadius:'7px',background:'linear-gradient(135deg,#3b82f6,#8b5cf6)',display:'flex',alignItems:'center',justifyContent:'center'}}>
                <div style={{width:'8px',height:'8px',borderRadius:'50%',background:'#fff'}} />
              </div>
              <span style={{fontSize:'16px',fontWeight:'700',color:'#f8fafc',letterSpacing:'-0.3px'}}>StatusNest</span>
            </div>
            <button className="back-btn" onClick={onBack} style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)',color:'#64748b',cursor:'pointer',fontSize:'13px',padding:'7px 16px',borderRadius:'8px',transition:'all 0.2s',fontWeight:'500'}}>
              ← Back
            </button>
          </div>

          {/* Title */}
          <div className="fade" style={{marginBottom:'32px'}}>
            <div style={{display:'flex',alignItems:'center',gap:'12px',marginBottom:'8px'}}>
              <h1 style={{fontSize:'36px',fontWeight:'800',color:'#f8fafc',letterSpacing:'-1.5px'}}>@{username}</h1>
              {data && (
                <span style={{padding:'4px 12px',borderRadius:'999px',fontSize:'12px',fontWeight:'600',background: anyDown ? 'rgba(239,68,68,0.1)' : 'rgba(34,197,94,0.1)',color: anyDown ? '#ef4444' : '#22c55e',border:`1px solid ${anyDown ? 'rgba(239,68,68,0.2)' : 'rgba(34,197,94,0.2)'}`}}>
                  {anyDown ? 'Incident' : allUp ? 'Operational' : 'Checking'}
                </span>
              )}
            </div>
            <p style={{color:'#475569',fontSize:'14px'}}>Public Service Status Page</p>
          </div>

          {/* Loading */}
          {loading && (
            <div style={{display:'flex',flexDirection:'column',alignItems:'center',padding:'80px 0',gap:'16px'}}>
              <div style={{width:'36px',height:'36px',border:'3px solid rgba(255,255,255,0.06)',borderTop:'3px solid #3b82f6',borderRadius:'50%',animation:'spin 0.8s linear infinite'}} />
              <p style={{color:'#334155',fontSize:'13px'}}>Fetching status...</p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div style={{background:'rgba(239,68,68,0.06)',border:'1px solid rgba(239,68,68,0.15)',borderRadius:'12px',padding:'20px 24px',display:'flex',alignItems:'center',gap:'12px'}}>
              <span style={{fontSize:'20px'}}>⚠️</span>
              <div>
                <p style={{color:'#ef4444',fontWeight:'600',fontSize:'14px'}}>Page not found</p>
                <p style={{color:'#7f1d1d',fontSize:'13px',marginTop:'2px'}}>No status page exists for this username</p>
              </div>
            </div>
          )}

          {data && (
            <>
              {/* Banner */}
              <div className="fade" style={{borderRadius:'14px',padding:'20px 24px',marginBottom:'32px',border:'1px solid',display:'flex',justifyContent:'space-between',alignItems:'center',
                background: anyDown ? 'rgba(239,68,68,0.06)' : allUp ? 'rgba(34,197,94,0.06)' : 'rgba(148,163,184,0.06)',
                borderColor: anyDown ? 'rgba(239,68,68,0.15)' : allUp ? 'rgba(34,197,94,0.15)' : 'rgba(148,163,184,0.15)',
              }}>
                <div style={{display:'flex',alignItems:'center',gap:'14px'}}>
                  <div style={{width:'12px',height:'12px',borderRadius:'50%',animation:'pulse 2s infinite',
                    background: anyDown ? '#ef4444' : allUp ? '#22c55e' : '#94a3b8',
                    boxShadow:`0 0 12px ${anyDown ? '#ef4444' : allUp ? '#22c55e' : '#94a3b8'}`,
                  }} />
                  <div>
                    <p style={{color:'#f1f5f9',fontWeight:'700',fontSize:'15px'}}>
                      {anyDown ? '🔴 Incident in progress' : allUp ? '✅ All systems operational' : '⚪ Awaiting first check'}
                    </p>
                    <p style={{color:'#475569',fontSize:'12px',marginTop:'2px'}}>Last updated just now</p>
                  </div>
                </div>
                <div style={{textAlign:'right'}}>
                  <p style={{color:'#f1f5f9',fontWeight:'700',fontSize:'20px'}}>{total > 0 ? Math.round((upCount/total)*100) : 0}%</p>
                  <p style={{color:'#475569',fontSize:'11px'}}>{upCount}/{total} operational</p>
                </div>
              </div>

              {/* Services */}
              <div>
                <p style={{color:'#334155',fontSize:'11px',fontWeight:'600',letterSpacing:'1.5px',marginBottom:'12px'}}>SERVICES — {total} monitored</p>
                <div style={{display:'flex',flexDirection:'column',gap:'8px'}}>
                  {data.services.map(svc => (
                    <ServiceCard key={svc.service_id} service={svc} username={username} />
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Footer */}
          <div style={{textAlign:'center',marginTop:'64px',color:'#1e293b',fontSize:'12px'}}>
            Built by{' '}
            <a href="https://github.com/aboodi679" target="_blank" rel="noreferrer" style={{color:'#3b82f6',textDecoration:'none',fontWeight:'600'}}>
              Muhammad Abdullah
            </a>
            {' '}· Powered by AWS ECS · Redis · Lambda
          </div>
        </div>
      </div>
    </>
  );
}