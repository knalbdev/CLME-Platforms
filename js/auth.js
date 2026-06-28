const CLME_AUTH = (() => {
  const USERS = [
    { id:'P001', email:'sari@clme.id',      password:'peserta123', role:'peserta',  name:'Sari Rahayu, S.Pd.',    school:'SMP Negeri 1 Bandung',    avatar:'SR', subject:'IPA',            years:8  },
    { id:'P002', email:'budi@clme.id',      password:'peserta123', role:'peserta',  name:'Budi Hartono, M.Pd.',   school:'SMAN 5 Bandung',           avatar:'BH', subject:'Matematika',     years:15 },
    { id:'P003', email:'rini@clme.id',      password:'peserta123', role:'peserta',  name:'Rini Wulandari, S.Pd.', school:'SMPN 3 Bandung',           avatar:'RW', subject:'Bhs. Indonesia', years:5  },
    { id:'E001', email:'prof.ahmad@clme.id',password:'ahli123',    role:'ahli',     name:'Prof. Ahmad Fauzan',    institution:'UPI Bandung',          avatar:'AF' },
    { id:'R001', email:'yudi@clme.id',      password:'peneliti123',role:'peneliti', name:'Yudi Setiawan, M.Pd.',  institution:'PPS PTK UPI Bandung', avatar:'YS' },
    { id:'A001', email:'admin@clme.id',     password:'admin123',   role:'admin',    name:'Super Admin',            institution:'CLME Platform',       avatar:'SA' },
  ];

  function login(email, password) {
    const u = USERS.find(x => x.email.toLowerCase() === email.toLowerCase() && x.password === password);
    if (!u) return { success:false, error:'Email atau kata sandi tidak valid.' };
    const session = Object.assign({}, u); delete session.password;
    localStorage.setItem('clme_session', JSON.stringify(session));
    return { success:true, user:session };
  }

  function logout() {
    localStorage.removeItem('clme_session');
    window.location.href = 'index.html';
  }

  function getSession() {
    try { const s = localStorage.getItem('clme_session'); return s ? JSON.parse(s) : null; }
    catch { return null; }
  }

  function requireRole(role) {
    const s = getSession();
    if (!s) { window.location.href = 'index.html'; return null; }
    if (role && s.role !== role) { window.location.href = 'index.html'; return null; }
    return s;
  }

  function getAllUsers() {
    return USERS.map(u => { const x = Object.assign({},u); delete x.password; return x; });
  }

  return { login, logout, getSession, requireRole, getAllUsers };
})();
