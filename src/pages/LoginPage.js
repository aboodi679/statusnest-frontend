import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ALB = 'https://d1wwgn689544k.cloudfront.net';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) return;
    setLoading(true);
    setError('');
    try {
      const res = await axios.post(`${ALB}/auth/login`, { email, password });
      localStorage.setItem('token', res.data.access_token);
      localStorage.setItem('email', email);
      navigate('/dashboard');
    } catch (e) {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { margin:0; padding:0; box-sizing:border-box; }
        body { font-family:'Inter',sans-serif; background:#020817; }
        input { font-family:'Inter',sans-serif; }
        input:focus { outline:none; border-color:#3b82f6 !important; box-shadow:0 0 0 3px rgba(59,130,246,0.15) !important; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes drift1 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(20px,-15px)} }
        @keyframes drift2 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-20px,15px)} }
        .login-card { animation: fadeUp 0.5s ease forwards; }
        .submit-btn:hover { transform:translateY(-2px) !important; box-shadow:0 12px 32px rgba(59,130,246,0.45) !important; }
        .submit-btn { transition:all 0.25s ease !important; }
      `}</style>

      <div style={{position:'fixed',inset:0,zIndex:0,overflow:'hidden',pointerEvents:'none'}}>
        <div style={{position:'absolute',width:'600px',height:'600px',borderRadius:'50%',background:'radial-gradient(circle,rgba(59,130,246,0.1) 0%,transparent 70%)',top:'-100px',left:'-100px',animation:'drift1 12s ease-in-out infinite'}} />
        <div style={{position:'absolute',width:'500px',height:'500px',borderRadius:'50%',background:'radial-gradient(circle,rgba(139,92,246,0.08) 0%,transparent 70%)',bottom:'-50px',right:'-50px',animation:'drift2 15s ease-in-out infinite'}} />
      </div>

      <div style={{position:'relative',zIndex:1,minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',padding:'24px',fontFamily:'Inter,sans-serif'}}>
        <div className="login-card" style={{width:'100%',maxWidth:'400px'}}>

          <div style={{textAlign:'center',marginBottom:'32px'}}>
            <div style={{display:'inline-flex',alignItems:'center',gap:'10px',marginBottom:'16px'}}>
              <div style={{width:'36px',height:'36px',borderRadius:'9px',background:'linear-gradient(135deg,#3b82f6,#8b5cf6)',display:'flex',alignItems:'center',justifyContent:'center'}}>
                <div style={{width:'11px',height:'11px',borderRadius:'50%',background:'#fff'}} />
              </div>
              <span style={{fontSize:'22px',fontWeight:'800',color:'#f8fafc',letterSpacing:'-0.5px'}}>StatusNest</span>
            </div>
            <h2 style={{color:'#f1f5f9',fontSize:'20px',fontWeight:'700',marginBottom:'6px'}}>Welcome back</h2>
            <p style={{color:'#475569',fontSize:'14px'}}>Login to manage your status pages</p>
          </div>

          <div style={{background:'rgba(10,15,30,0.85)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:'16px',padding:'32px',backdropFilter:'blur(24px)'}}>

            {error && (
              <div style={{background:'rgba(239,68,68,0.08)',border:'1px solid rgba(239,68,68,0.2)',borderRadius:'8px',padding:'12px 16px',marginBottom:'20px',color:'#ef4444',fontSize:'13px',fontWeight:'500'}}>
                {error}
              </div>
            )}

            <div style={{marginBottom:'16px'}}>
              <label style={{display:'block',color:'#94a3b8',fontSize:'13px',fontWeight:'600',marginBottom:'8px'}}>Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
                style={{width:'100%',padding:'12px 14px',borderRadius:'9px',border:'1px solid rgba(255,255,255,0.08)',background:'rgba(255,255,255,0.03)',color:'#f8fafc',fontSize:'14px',transition:'all 0.2s'}}
              />
            </div>

            <div style={{marginBottom:'24px'}}>
              <label style={{display:'block',color:'#94a3b8',fontSize:'13px',fontWeight:'600',marginBottom:'8px'}}>Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
                style={{width:'100%',padding:'12px 14px',borderRadius:'9px',border:'1px solid rgba(255,255,255,0.08)',background:'rgba(255,255,255,0.03)',color:'#f8fafc',fontSize:'14px',transition:'all 0.2s'}}
              />
            </div>

            <button
              className="submit-btn"
              onClick={handleLogin}
              disabled={loading}
              style={{width:'100%',padding:'13px',borderRadius:'10px',border:'none',background:'linear-gradient(135deg,#3b82f6,#6d28d9)',color:'#fff',fontSize:'15px',fontWeight:'700',cursor:'pointer',boxShadow:'0 4px 16px rgba(59,130,246,0.3)',opacity: loading ? 0.7 : 1}}
            >
              {loading ? 'Logging in...' : 'Login →'}
            </button>

            <div style={{textAlign:'center',marginTop:'20px'}}>
              <button onClick={() => navigate('/')} style={{background:'none',border:'none',color:'#475569',fontSize:'13px',cursor:'pointer',fontFamily:'Inter,sans-serif'}}>
                &larr; Back to home
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}