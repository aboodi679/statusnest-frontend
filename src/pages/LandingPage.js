import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  const handleSubmit = () => {
    if (username) navigate(`/status/${username}`);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { margin:0; padding:0; box-sizing:border-box; }
        body { font-family:'Inter',sans-serif; background:#020817; overflow-x:hidden; }
        input,button { font-family:'Inter',sans-serif; }
        input:focus { outline:none; border-color:#3b82f6 !important; box-shadow:0 0 0 3px rgba(59,130,246,0.15) !important; }
        @keyframes drift1 { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(30px,-20px) scale(1.05)} 66%{transform:translate(-20px,10px) scale(0.95)} }
        @keyframes drift2 { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(-40px,20px) scale(1.08)} 66%{transform:translate(20px,-30px) scale(0.92)} }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.6;transform:scale(1.3)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        .hero-title { animation: fadeUp 0.6s ease forwards; }
        .hero-sub { animation: fadeUp 0.6s ease 0.1s both; }
        .hero-card { animation: fadeUp 0.6s ease 0.2s both; }
        .hero-stats { animation: fadeUp 0.6s ease 0.3s both; }
        .view-btn:hover { transform:translateY(-2px) !important; box-shadow:0 12px 32px rgba(59,130,246,0.45) !important; background:linear-gradient(135deg,#2563eb,#6d28d9) !important; }
        .view-btn { transition:all 0.25s ease !important; }
        .login-btn:hover { background:rgba(255,255,255,0.08) !important; }
        .stat-card:hover { border-color:rgba(59,130,246,0.3) !important; transform:translateY(-2px); }
        .stat-card { transition:all 0.2s ease; }
      `}</style>

      <div style={{position:'fixed',inset:0,zIndex:0,overflow:'hidden',pointerEvents:'none'}}>
        <div style={{position:'absolute',width:'600px',height:'600px',borderRadius:'50%',background:'radial-gradient(circle,rgba(59,130,246,0.12) 0%,transparent 70%)',top:'-100px',left:'-100px',animation:'drift1 12s ease-in-out infinite'}} />
        <div style={{position:'absolute',width:'500px',height:'500px',borderRadius:'50%',background:'radial-gradient(circle,rgba(139,92,246,0.1) 0%,transparent 70%)',bottom:'-50px',right:'-50px',animation:'drift2 15s ease-in-out infinite'}} />
        <div style={{position:'absolute',inset:0,backgroundImage:'linear-gradient(rgba(255,255,255,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.02) 1px,transparent 1px)',backgroundSize:'48px 48px'}} />
      </div>

      <div style={{position:'relative',zIndex:1,minHeight:'100vh',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'40px 24px',fontFamily:'Inter,sans-serif'}}>

        <div style={{position:'absolute',top:'24px',right:'24px'}}>
          <button className="login-btn" onClick={() => navigate('/login')} style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)',color:'#94a3b8',cursor:'pointer',fontSize:'13px',padding:'8px 18px',borderRadius:'8px',transition:'all 0.2s',fontWeight:'500'}}>
            Login &rarr;
          </button>
        </div>

        <div className="hero-title" style={{display:'flex',alignItems:'center',gap:'8px',background:'rgba(34,197,94,0.08)',border:'1px solid rgba(34,197,94,0.2)',borderRadius:'999px',padding:'6px 16px',marginBottom:'32px'}}>
          <div style={{width:'8px',height:'8px',borderRadius:'50%',background:'#22c55e',boxShadow:'0 0 8px #22c55e',animation:'pulse 2s infinite'}} />
          <span style={{color:'#22c55e',fontSize:'13px',fontWeight:'600',letterSpacing:'0.3px'}}>Live Monitoring Active</span>
        </div>

        <h1 className="hero-title" style={{fontSize:'clamp(36px,6vw,64px)',fontWeight:'800',color:'#f8fafc',textAlign:'center',lineHeight:'1.1',letterSpacing:'-2px',marginBottom:'20px',maxWidth:'700px'}}>
          Monitor your services.{' '}
          <span style={{background:'linear-gradient(135deg,#3b82f6,#8b5cf6)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>
            Know before they do.
          </span>
        </h1>

        <p className="hero-sub" style={{color:'#64748b',fontSize:'18px',textAlign:'center',marginBottom:'48px',maxWidth:'480px',lineHeight:'1.6'}}>
          Beautiful public status pages powered by AWS ECS, Redis, and Lambda â€” built for developers.
        </p>

        <div className="hero-card" style={{position:'relative',width:'100%',maxWidth:'420px',marginBottom:'48px'}}>
          <div style={{position:'absolute',inset:'-1px',borderRadius:'17px',background:'linear-gradient(135deg,rgba(59,130,246,0.3),rgba(139,92,246,0.3))',zIndex:-1,filter:'blur(8px)',opacity:0.6}} />
          <div style={{background:'rgba(10,15,30,0.85)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'16px',padding:'36px',backdropFilter:'blur(24px)'}}>
            <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'24px'}}>
              <div style={{width:'32px',height:'32px',borderRadius:'8px',background:'linear-gradient(135deg,#3b82f6,#8b5cf6)',display:'flex',alignItems:'center',justifyContent:'center'}}>
                <div style={{width:'10px',height:'10px',borderRadius:'50%',background:'#fff'}} />
              </div>
              <span style={{fontSize:'20px',fontWeight:'700',color:'#f8fafc',letterSpacing:'-0.5px'}}>StatusNest</span>
            </div>

            <p style={{color:'#475569',fontSize:'13px',marginBottom:'20px'}}>Enter a username to view their live status page</p>

            <div style={{position:'relative',marginBottom:'12px'}}>
              <span style={{position:'absolute',left:'14px',top:'50%',transform:'translateY(-50%)',color:'#3b82f6',fontSize:'15px',fontWeight:'600'}}>@</span>
              <input
                style={{width:'100%',padding:'14px 14px 14px 32px',borderRadius:'10px',border:'1px solid rgba(255,255,255,0.08)',background:'rgba(255,255,255,0.03)',color:'#f8fafc',fontSize:'15px',transition:'all 0.2s'}}
                placeholder="username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              />
            </div>

            <button className="view-btn" style={{width:'100%',padding:'14px',borderRadius:'10px',border:'none',background:'linear-gradient(135deg,#3b82f6,#6d28d9)',color:'#fff',fontSize:'15px',fontWeight:'700',cursor:'pointer',letterSpacing:'0.2px',boxShadow:'0 4px 16px rgba(59,130,246,0.3)'}}
              onClick={handleSubmit}>
              View Status Page &rarr;
            </button>

            <div style={{borderTop:'1px solid rgba(255,255,255,0.06)',marginTop:'24px',paddingTop:'20px',textAlign:'center'}}>
              <p style={{color:'#334155',fontSize:'12px'}}>
                Built by{' '}
                <a href="https://github.com/aboodi679" target="_blank" rel="noreferrer" style={{color:'#3b82f6',textDecoration:'none',fontWeight:'600'}}>Muhammad Abdullah</a>
                {' '}&middot; Powered by AWS
              </p>
            </div>
          </div>
        </div>

        <div className="hero-stats" style={{display:'flex',gap:'16px',flexWrap:'wrap',justifyContent:'center'}}>
          {[
            { icon: 'Ã¢Å¡Â¡', label: 'Real-time monitoring', sub: 'Every 60 seconds' },
            { icon: 'Ã°Å¸""', label: 'Instant alerts', sub: 'Email via AWS SNS' },
            { icon: 'Ã¢ËœÃ¯Â¸', label: 'Fully serverless', sub: 'ECS + Lambda + Redis' },
          ].map((item, i) => (
            <div key={i} className="stat-card" style={{background:'rgba(15,23,42,0.6)',border:'1px solid rgba(255,255,255,0.06)',borderRadius:'12px',padding:'16px 20px',display:'flex',alignItems:'center',gap:'12px',backdropFilter:'blur(10px)'}}>
              <span style={{fontSize:'20px'}}>{item.icon}</span>
              <div>
                <div style={{color:'#94a3b8',fontSize:'13px',fontWeight:'600'}}>{item.label}</div>
                <div style={{color:'#334155',fontSize:'11px',marginTop:'2px'}}>{item.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}