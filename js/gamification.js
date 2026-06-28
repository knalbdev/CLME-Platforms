const CLME_GAME = (() => {
  const LEVELS = [
    { level:1, name:'Pemula',          emoji:'🌱', minXP:0   },
    { level:2, name:'Aware Educator',  emoji:'📚', minXP:200 },
    { level:3, name:'Cyber Guardian',  emoji:'🛡️', minXP:500 },
    { level:4, name:'Expert Defender', emoji:'⚔️', minXP:800 },
    { level:5, name:'Security Champion',emoji:'🏆',minXP:1200},
  ];

  const BADGES = {
    pemula:    { name:'Pemula',           emoji:'🎯', color:'#E1F5EE', text:'#085041', desc:'Bergabung dengan CLME' },
    pretest:   { name:'Pre-Test',         emoji:'📋', color:'#FEF3D5', text:'#92400E', desc:'Selesaikan pre-test pertama' },
    diskusi:   { name:'Diskusi Aktif',    emoji:'💬', color:'#EEEDFE', text:'#5849C4', desc:'Berpartisipasi dalam diskusi' },
    guardian:  { name:'Password Guardian',emoji:'🔐', color:'#E1F5EE', text:'#085041', desc:'Selesaikan Modul 1' },
    emaildef:  { name:'Email Defender',   emoji:'🛡️', color:'#FEF3D5', text:'#92400E', desc:'Selesaikan Modul 2' },
    crisis:    { name:'Crisis Responder', emoji:'🚨', color:'#FDEEE9', text:'#D84F30', desc:'Selesaikan Modul 3' },
    graduate:  { name:'CLME Graduate',    emoji:'🎓', color:'#0F1E3C', text:'#fff',    desc:'Selesaikan semua modul' },
  };

  function getProgress(uid) {
    try {
      const saved = localStorage.getItem('clme_prog_' + uid);
      if (saved) return JSON.parse(saved);
    } catch {}
    const def = { uid, xp:0, level:1, streak:1, badges:['pemula'], done:[], modules:[], scores:{}, dates:[new Date().toDateString()] };
    saveProgress(uid, def); return def;
  }

  function saveProgress(uid, p) {
    localStorage.setItem('clme_prog_' + uid, JSON.stringify(p));
  }

  function getLevel(xp) {
    for (let i = LEVELS.length-1; i >= 0; i--) if (xp >= LEVELS[i].minXP) return LEVELS[i];
    return LEVELS[0];
  }

  function getLevelProgress(xp) {
    const cur = getLevel(xp); const idx = LEVELS.indexOf(cur);
    if (idx >= LEVELS.length-1) return 100;
    const next = LEVELS[idx+1];
    return Math.round(((xp - cur.minXP) / (next.minXP - cur.minXP)) * 100);
  }

  function addXP(uid, amount, badgeId) {
    const p = getProgress(uid);
    const oldLevel = p.level;
    p.xp += amount;
    const lv = getLevel(p.xp);
    p.level = lv.level;
    if (badgeId && !p.badges.includes(badgeId)) p.badges.push(badgeId);
    saveProgress(uid, p);
    return { p, leveledUp: lv.level > oldLevel, newLevel: lv };
  }

  function markLesson(uid, lessonId, xp, badgeId) {
    const p = getProgress(uid);
    if (!p.done.includes(lessonId)) p.done.push(lessonId);
    saveProgress(uid, p);
    return addXP(uid, xp, badgeId);
  }

  function markModule(uid, moduleId, badgeId) {
    const p = getProgress(uid);
    if (!p.modules.includes(moduleId)) p.modules.push(moduleId);
    if (badgeId && !p.badges.includes(badgeId)) p.badges.push(badgeId);
    if (p.modules.length >= 3 && !p.badges.includes('graduate')) p.badges.push('graduate');
    saveProgress(uid, p);
  }

  function saveScore(uid, key, score) {
    const p = getProgress(uid);
    p.scores[key] = score;
    saveProgress(uid, p);
  }

  function updateStreak(uid) {
    const p = getProgress(uid);
    const today = new Date().toDateString();
    if (!p.dates) p.dates = [];
    if (!p.dates.includes(today)) {
      p.dates.push(today);
      const sorted = [...p.dates].sort((a,b) => new Date(a)-new Date(b));
      let streak = 1;
      for (let i = sorted.length-1; i > 0; i--) {
        const diff = (new Date(sorted[i]) - new Date(sorted[i-1])) / 86400000;
        if (diff === 1) streak++; else break;
      }
      p.streak = streak;
    }
    saveProgress(uid, p);
    return p.streak;
  }

  function getAllProgress() {
    const users = CLME_AUTH.getAllUsers().filter(u => u.role === 'peserta');
    return users.map(u => ({ user: u, prog: getProgress(u.id) }));
  }

  return { getProgress, saveProgress, getLevel, getLevelProgress, addXP, markLesson, markModule, saveScore, updateStreak, getAllProgress, LEVELS, BADGES };
})();
