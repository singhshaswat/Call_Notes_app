  const SEED = [
    { id:1, name:"Fatima Uma",  town:"Singapore", purpose:"Follow up on booking confirmation",  category:"Important", img:"https://i.pravatar.cc/100?img=47", bookings:3, createdAt: Date.now()-3600000  },
    { id:2, name:"Rohan Mehta", town:"Mumbai",    purpose:"Urgent visa query before departure",   category:"Urgent",    img:"https://i.pravatar.cc/100?img=12", bookings:1, createdAt: Date.now()-7200000  },
    { id:3, name:"Sara Lin",    town:"Toronto",   purpose:"Weekend wellness check-in",             category:"No Rush",   img:"https://i.pravatar.cc/100?img=23", bookings:5, createdAt: Date.now()-86400000 }
  ];

  function loadNotes() {
    try { const r = localStorage.getItem('callNotes'); if (r) return JSON.parse(r); } catch(e){}
    localStorage.setItem('callNotes', JSON.stringify(SEED));
    return [...SEED];
  }
  function saveNotes(a) { localStorage.setItem('callNotes', JSON.stringify(a)); }

  let notes = loadNotes(), cur = 0;

  const BADGE = { Emergency:'badge-emergency', Important:'badge-important', Urgent:'badge-urgent', 'No Rush':'badge-norush' };
  const initials = n => n.trim().split(/\s+/).map(w=>w[0]).join('').toUpperCase().slice(0,2);

  function buildCard(note) {
    const card = document.createElement('div');
    card.className = 'call-card';
    const av = note.img
      ? `<img class="avatar" src="${note.img}" alt="" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"><div class="avatar-fallback" style="display:none">${initials(note.name)}</div>`
      : `<div class="avatar-fallback">${initials(note.name)}</div>`;
    card.innerHTML = `
      <div class="card-header">
        ${av}
        <div class="card-name-block">
          <div class="card-name">${note.name}</div>
          <span class="card-badge ${BADGE[note.category]||'badge-norush'}">${note.category}</span>
        </div>
      </div>
      <div class="card-rows">
        <div class="card-row"><span class="label">Home town</span><span class="value">${note.town}</span></div>
        <div class="card-row"><span class="label">Bookings</span><span class="value">${note.bookings} time${note.bookings!==1?'s':''}</span></div>
      </div>
      ${note.purpose?`<div class="purpose-row">"${note.purpose}"</div>`:''}
      <div class="card-actions">
        <button class="btn-call">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.32.57 3.58.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.26.2 2.46.57 3.58.11.35.03.74-.24 1.02L6.6 10.8z"/></svg>
          Call
        </button>
        <button class="btn-msg">Message</button>
      </div>`;
    return card;
  }

  const carousel   = document.getElementById('carousel');
  const emptyState = document.getElementById('emptyState');
  const peek1      = document.getElementById('peek1');
  const peek2      = document.getElementById('peek2');
  let cards = [];

  function renderAll() {
    cards.forEach(c => c.remove()); cards = [];
    peek1.style.display = notes.length >= 2 ? 'block' : 'none';
    peek2.style.display = notes.length >= 3 ? 'block' : 'none';
    emptyState.style.display = notes.length === 0 ? 'flex' : 'none';
    if (!notes.length) return;
    notes.forEach(note => { const c = buildCard(note); carousel.appendChild(c); cards.push(c); });
    cards[cur].classList.add('active');
  }

  function showCard(next, dir) {
    const pi = cards.findIndex(c => c.classList.contains('active'));
    if (pi === next) return;
    if (pi !== -1) {
      const p = cards[pi];
      p.classList.remove('active');
      p.classList.add(dir==='up' ? 'exit-up' : 'exit-down');
      setTimeout(() => p.classList.remove('exit-up','exit-down'), 360);
    }
    cards[next].classList.add('active');
    cur = next;
  }

  document.getElementById('upBtn').addEventListener('click',   () => { if(notes.length) showCard((cur-1+notes.length)%notes.length,'up'); });
  document.getElementById('downBtn').addEventListener('click', () => { if(notes.length) showCard((cur+1)%notes.length,'down'); });

  // FORM
  const overlay = document.getElementById('overlay');
  const openForm  = () => { overlay.classList.add('open'); setTimeout(()=>document.getElementById('fName').focus(),120); };
  const closeForm = () => { overlay.classList.remove('open'); setTimeout(clearForm,280); };

  function clearForm() {
    ['fImg','fName','fTown','fPurpose'].forEach(id => { const e=document.getElementById(id); e.value=''; e.classList.remove('error'); });
    document.querySelectorAll('input[name="category"]').forEach(r=>r.checked=false);
    ['errName','errTown','errPurpose','errCat'].forEach(id=>document.getElementById(id).classList.remove('show'));
  }

  document.getElementById('addBtn').addEventListener('click', openForm);
  document.getElementById('btnClose').addEventListener('click', closeForm);
  overlay.addEventListener('click', e => { if(e.target===overlay) closeForm(); });

  const getVal = id => document.getElementById(id).value.trim();

  function setErr(iid, eid, show, msg) {
    document.getElementById(iid).classList.toggle('error', show);
    const e = document.getElementById(eid);
    e.classList.toggle('show', show);
    if (msg) e.textContent = msg;
  }

  document.getElementById('btnCreate').addEventListener('click', () => {
    const name=getVal('fName'), town=getVal('fTown'), purpose=getVal('fPurpose'), img=getVal('fImg');
    const catEl=document.querySelector('input[name="category"]:checked'), category=catEl?catEl.value:'';
    let ok = true;

    if (!name||name.length<2)               { setErr('fName','errName',true,'Name must be at least 2 characters.'); ok=false; }
    else if(!/^[a-zA-Z\s'\-]+$/.test(name)) { setErr('fName','errName',true,'Name can only contain letters.'); ok=false; }
    else                                      { setErr('fName','errName',false); }

    if (!town||town.length<2) { setErr('fTown','errTown',true,'Home town is required.'); ok=false; }
    else                       { setErr('fTown','errTown',false); }

    if (!purpose) { setErr('fPurpose','errPurpose',true,'Purpose is required.'); ok=false; }
    else           { setErr('fPurpose','errPurpose',false); }

    if (!category) { document.getElementById('errCat').classList.add('show'); ok=false; }
    else            { document.getElementById('errCat').classList.remove('show'); }

    if (!ok) return;

    notes.unshift({ id:Date.now(), name, town, purpose, category, img:img||'', bookings:1, createdAt:Date.now() });
    saveNotes(notes); cur=0; renderAll(); closeForm();
  });

  // COLOR DOTS
  document.querySelectorAll('.dot').forEach(dot => dot.addEventListener('click', () => {
    document.querySelectorAll('.dot').forEach(d=>d.classList.remove('active-dot'));
    dot.classList.add('active-dot');
    document.documentElement.style.setProperty('--text', dot.dataset.color);
  }));

  renderAll();