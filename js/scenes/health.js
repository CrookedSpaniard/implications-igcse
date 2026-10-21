FD.add({
  id: 'health',
  title: 'Health and safety',
  tab: 'Health & safety',
  icon: 'health',
  color: '--c2',
  section: true,
  interactive: true,
  vocab: [
    ['Repetitive strain injury (RSI)', 'Pain caused by repeating the same movement many times.'],
    ['Posture', 'The way in which you position your body while standing or sitting.'],
    ['Ergonomic', 'Designed for efficiency and comfort, especially in a working environment.'],
    ['Flicker', 'Shine with an unsteady light that goes on and off quickly.'],
    ['Glare', 'A bright unpleasant light that hurts the eyes.'],
    ['Trip hazard', 'An object that a person could trip over.'],
    ['Trunking', 'Tubes or channels designed to contain cables.'],
    ['Residual current device (RCD)', 'A device that interrupts an electrical current to prevent electric shock.'],
    ['Overload', 'Put too much electricity through an electrical system or piece of equipment.'],
    ['Fuse', 'A safety device in plugs and plug sockets that breaks an electrical current if too much current is supplied.'],
  ],
  mount(el) {
    // Table 9.2: [key, emoji (risk), emoji (fixed), position x%, y%, risk, cause, how to minimise]
    const H = [
      ['eye', '🥵', '😌', 30, 22, 'Eye dryness and eye fatigue', 'Looking at a screen for long periods of time. Eyes are sensitive to the short wavelength (blue and blue-green) light from LEDs in digital devices; some scientists say this can affect our sleep.', ['Take breaks and look away from the screen into the distance regularly', 'Make sure the screen is not too close', 'Use a large enough screen', 'Use blue light filters', 'Use screens that do not <b>flicker</b>', 'Use suitable lighting and reduce <b>glare</b> of sunlight through windows']],
      ['rsi', '🖱️', '✅', 64, 47, 'Repetitive strain injury (RSI), such as carpal tunnel syndrome: pain caused by compressing the nerve in the wrist', 'Using devices incorrectly; poor <b>posture</b> (Figure 9.8)', ['Use <b>ergonomic</b> devices', 'Use ergonomic supports such as wrist pads (Figure 9.9)']],
      ['back', '🙇', '✅', 44, 55, 'Back and neck ache', 'Poor posture', ['Maintain correct posture when using devices (Figure 9.7)']],
      ['trip', '➰', '✅', 52, 90, 'Trip hazards', 'Trailing wires', ['Good cable management', 'Tidy and secure cables in <b>trunking</b> (Figure 9.10)']],
      ['shock', '🥤', '✅', 77, 40, 'Electric shock', 'Damaged cables; liquid on devices', ['Use <b>residual current devices</b> (RCDs) on the supply to the electrical circuit', 'Regular cable inspections', 'Repair or replace damaged cables', 'No liquids near devices']],
      ['fire', '🔌', '🧯', 88, 80, 'Fire', 'Overheating; <b>overloaded</b> plug sockets', ['Use cooling devices', 'Regular maintenance', 'Install <b>fire extinguishers</b>', 'Make sure plug sockets contain <b>fuses</b> suitable for the devices plugged into them']],
      ['road', '📱', '✅', 12, 78, 'Injury or death', 'Failing to notice immediate danger because of distractions caused by a digital device such as a smartphone', ['Do not use or be distracted by devices when near roads and other hazards']],
    ];
    el.innerHTML = `
      <div class="sim hs-s">
        <div class="ptabs" role="group" aria-label="Simulations">
          <button data-p="room">🏢 Spot the risks</button><button data-p="post">🪑 Good posture</button><button data-p="tbl">📋 Table 9.2</button>
        </div>

        <div data-panel="room" class="sim">
          <div class="hs-grid">
            <div class="hs-room" id="room" aria-label="An office with risks to health and safety">
              <div class="hs-win">🪟<small>sunlight</small></div>
              <div class="hs-desk"></div><div class="hs-mon">🖥️</div><div class="hs-street">🚗 road</div>
              ${H.map(([k, e, , x, y]) => `<button class="hs-hz" data-k="${k}" style="left:${x}%;top:${y}%" aria-label="Risk">${e}</button>`).join('')}
            </div>
            <div class="sim-box hs-info" id="info"><p class="note">Tap a risk in the office (7 to find). <b id="found">0</b> / 7 made safe.</p><div id="card"></div></div>
          </div>
        </div>

        <div data-panel="post" class="sim" hidden>
          <div class="hs-grid">
            <div class="sim-box"><svg viewBox="0 0 420 240" class="hs-svg" id="fig" role="img" aria-label="A person sitting at a computer"></svg></div>
            <div class="sim-box hs-ctrls">
              <label class="rng"><span>Seat height</span><input type="range" id="seat" min="0" max="100" value="15"></label>
              <label class="rng"><span>Monitor angle</span><input type="range" id="ang" min="0" max="35" value="0"><b id="angV"></b></label>
              <label class="rng"><span>Viewing distance</span><input type="range" id="dist" min="0" max="100" value="5"></label>
              <label class="tgl"><input type="checkbox" id="rest"> Sit back against the adjustable backrest</label>
              <ul class="hs-list" id="list"></ul>
            </div>
          </div>
          <div class="cards3 hs-avoid">
            <div class="mini"><h5><span class="bad-t">AVOID</span> tight elbow angle</h5></div>
            <div class="mini"><h5><span class="bad-t">AVOID</span> wrist bent upwards</h5></div>
            <div class="mini"><h5><span class="bad-t">AVOID</span> pressure on elbow or wrist</h5></div>
          </div>
        </div>

        <div data-panel="tbl" class="sim" hidden>
          <div class="tbl-wrap"><table class="tbl hs-tbl"><thead><tr><th>Risk</th><th>Cause</th><th>How to minimise</th></tr></thead><tbody>
            ${H.map(([k, , , , , r, c, m]) => `<tr data-k="${k}"><th>${r}</th><td>${c}</td><td><ul>${m.map((x) => `<li>${x}</li>`).join('')}</ul></td></tr>`).join('')}
          </tbody></table></div>
        </div>
      </div>`;
    const root = el.querySelector('.hs-s'), $ = (s) => root.querySelector(s);
    const show = FD.panels(root);

    // ----- spot the risks -----
    function fix(k) {
      const h = H.find((x) => x[0] === k), b = root.querySelector(`.hs-hz[data-k="${k}"]`);
      b.classList.add('fixed'); b.textContent = h[2];
      root.querySelectorAll('.hs-hz').forEach((x) => x.classList.toggle('on', x === b));
      $('#card').innerHTML = `<div class="hs-card new"><p class="kick">Risk</p><h4>${h[5]}</h4><p><b>Cause:</b> ${h[6]}</p><p><b>How to minimise:</b></p><ul>${h[7].map((m) => `<li>${m}</li>`).join('')}</ul></div>`;
      $('#found').textContent = root.querySelectorAll('.hs-hz.fixed').length;
    }
    root.querySelectorAll('.hs-hz').forEach((b) => b.addEventListener('click', () => fix(b.dataset.k)));
    function clearRoom() { root.querySelectorAll('.hs-hz').forEach((b) => { const h = H.find((x) => x[0] === b.dataset.k); b.className = 'hs-hz'; b.textContent = h[1]; }); $('#card').innerHTML = ''; $('#found').textContent = 0; }

    // ----- posture (Figure 9.7) -----
    function pose(v = {}) {
      if (v.seat != null) $('#seat').value = v.seat;
      if (v.ang != null) $('#ang').value = v.ang;
      if (v.dist != null) $('#dist').value = v.dist;
      if (v.rest != null) $('#rest').checked = v.rest;
      const seat = +$('#seat').value, ang = +$('#ang').value, dist = +$('#dist').value, rest = $('#rest').checked;
      $('#angV').textContent = ang + '°';
      const seatY = 175 - seat * 0.6;                       // 175 (low) … 115 (high)
      const kneeY = 150, footY = 220;
      const dangle = seatY < kneeY - 4;
      const knee = dangle ? [232, seatY + 4] : [232, kneeY];
      const foot = dangle ? [238, seatY + 72] : [238, footY];
      const hip = [150, seatY];
      const lean = rest ? 0 : 22;
      const sh = [hip[0] + lean, seatY - 70];
      const head = [sh[0] + 6 + lean * 0.4, sh[1] - 20];
      const elbow = [sh[0] + 8, sh[1] + 42];
      const kbY = 122, monX = 300 + dist * 0.9;
      const hand = [268, kbY - 2];
      const ok = {
        thighs: Math.abs(seatY - kneeY) <= 6,
        feet: !dangle,
        elbow: Math.abs(elbow[1] - kbY) <= 9,
        angle: ang >= 10 && ang <= 20,
        dist: dist >= 35 && dist <= 70,
        back: rest,
      };
      const svg = `
        <line class="hs-floor" x1="10" y1="222" x2="410" y2="222"/>
        <path class="hs-deskp" d="M240 ${kbY + 2}h170M392 ${kbY + 2}v98"/>
        <rect class="hs-kb ${ok.elbow ? 'ok' : 'no'}" x="250" y="${kbY - 4}" width="40" height="5" rx="1"/>
        <g transform="rotate(${-ang} ${monX} ${kbY - 20})"><rect class="hs-monr" x="${monX - 3}" y="${kbY - 78}" width="8" height="58" rx="2"/></g>
        <path class="hs-monr" d="M${monX + 6} ${kbY - 20}v18M${monX - 6} ${kbY}h24"/>
        <line class="hs-sight ${ok.dist ? 'ok' : 'no'}" x1="${head[0] + 8}" y1="${head[1]}" x2="${monX - 4}" y2="${head[1]}"/>
        <path class="hs-chair" d="M${hip[0] - 34} ${seatY + 6}h70M${hip[0] - 32} ${seatY + 6}V${seatY - 66}M${hip[0]} ${seatY + 8}V205M${hip[0] - 35} 215h70"/>
        <circle class="hs-gear" cx="${hip[0] - 22}" cy="${(seatY + 205) / 2}" r="6"/>
        <path class="hs-body" d="M${foot[0]} ${foot[1]}L${knee[0]} ${knee[1]}L${hip[0]} ${hip[1]}L${sh[0]} ${sh[1]}M${sh[0]} ${sh[1]}L${elbow[0]} ${elbow[1]}L${hand[0]} ${hand[1]}"/>
        <path class="hs-foot" d="M${foot[0] - 4} ${foot[1]}h18"/>
        <circle class="hs-head" cx="${head[0]}" cy="${head[1]}" r="14"/>
        <text class="svg-sm" x="${monX - 22}" y="${kbY - 84}">${ang}°</text>`;
      $('#fig').innerHTML = svg;
      const L = [
        ['back', 'Adjustable backrest supports the back'],
        ['thighs', 'Upper thighs parallel to the floor (adjustable seat height)'],
        ['feet', 'Feet flat on the floor'],
        ['elbow', 'Keyboard at elbow height'],
        ['angle', '10°–20° monitor angle'],
        ['dist', 'A suitable viewing distance from the monitor'],
      ];
      $('#list').innerHTML = L.map(([k, t]) => `<li class="${ok[k] ? 'ok' : 'no'}">${ok[k] ? '✓' : '✗'} ${t}</li>`).join('');
      return Object.values(ok).every(Boolean);
    }
    ['seat', 'ang', 'dist', 'rest'].forEach((k) => $('#' + k).addEventListener('input', () => pose()));

    function row(k) { root.querySelectorAll('.hs-tbl tr[data-k]').forEach((r) => r.classList.toggle('hot', r.dataset.k === k)); }

    function reset() { clearRoom(); pose({ seat: 15, ang: 0, dist: 5, rest: false }); row(''); }
    show('room'); reset();
    return { show, fix, clearRoom, pose, row, reset, destroy() {} };
  },
  steps: [
    {
      title: 'Risks to health and safety',
      text: `<p>It is important to know about the <b>health and safety risks</b> of digital technologies, for yourself and for others. You also need to know <b>what causes</b> those risks and <b>how to minimise</b> them (Table 9.2).</p>`,
      tip: 'Try it: tap each risk in the office to make it safe.',
      async on(a) { a.show('room'); a.reset(); },
    },
    {
      title: 'Eyes',
      text: `<p><b>Eye dryness and eye fatigue</b> are caused by looking at a screen for long periods. Eyes are sensitive to the blue and blue-green light emitted by LEDs.</p>
             <p>Take regular <b>breaks</b> and look into the distance, keep the screen not too close, use a large enough screen, <b>blue light filters</b>, screens that do not <strong>flicker</strong> and suitable lighting to reduce <strong>glare</strong>.</p>`,
      async on(a) { a.show('room'); a.fix('eye'); },
    },
    {
      title: 'RSI, back and neck ache',
      text: `<p><strong>Repetitive strain injury</strong> (RSI), such as carpal tunnel syndrome, is caused by using devices incorrectly and poor <strong>posture</strong>. Use <strong>ergonomic</strong> devices and supports such as <b>wrist pads</b>.</p>
             <p><b>Back and neck ache</b> are caused by poor posture: maintain correct posture.</p>`,
      async on(a, ctx) { a.show('room'); a.fix('rsi'); if (!(await ctx.sleep(2000))) return; a.fix('back'); },
    },
    {
      title: 'Good posture',
      text: `<p>Figure 9.7 shows how to maintain good posture when sitting at a computer: an adjustable <b>backrest</b>, arm rests and <b>seat height</b>, upper thighs <b>parallel to the floor</b>, feet <b>flat on the floor</b>, keyboard at <b>elbow height</b>, a <b>10°–20° monitor angle</b> and a suitable viewing distance.</p>`,
      tip: 'Try it: move the sliders until every point is ✓. Figure 9.8 shows what to avoid.',
      async on(a, ctx) {
        a.show('post'); a.pose({ seat: 15, ang: 0, dist: 5, rest: false });
        for (const v of [{ rest: true }, { seat: 42 }, { ang: 15 }, { dist: 50 }]) { if (!(await ctx.sleep(1100))) return; a.pose(v); }
      },
    },
    {
      title: 'Trips, shocks and fire',
      text: `<ul><li><strong>Trip hazards</strong> come from trailing wires: use good cable management and <strong>trunking</strong>.</li>
             <li><b>Electric shock</b> comes from damaged cables and liquid on devices: use <strong>RCDs</strong>, inspect and repair cables, no liquids near devices.</li>
             <li><b>Fire</b> comes from overheating and <strong>overloaded</strong> plug sockets: cooling devices, maintenance, <b>fire extinguishers</b> and suitable <strong>fuses</strong>.</li></ul>`,
      async on(a, ctx) { a.show('room'); for (const k of ['trip', 'shock', 'fire']) { a.fix(k); if (!(await ctx.sleep(1800))) return; } },
    },
    {
      title: 'Distracted by a device',
      text: `<p><b>Injury or death</b> can be caused by failing to notice immediate danger because of distractions caused by a digital device such as a smartphone.</p>
             <p>Do not use or be distracted by devices when near <b>roads</b> and other hazards.</p>`,
      async on(a, ctx) { a.show('room'); a.fix('road'); if (!(await ctx.sleep(2500))) return; a.show('tbl'); },
    },
  ],
});

FD.activities({
  section: 'health',
  items: [
    {
      id: 'health-walking',
      title: 'Digital devices and personal safety',
      task: '<p>Search ‘ABC News texting while walking’ to find an ABC News report, <i>Texting While Walking Accidents</i>. Watch the video and then discuss the safety issues related to texting while walking and driving.</p>',
      fields: ['Safety issues: texting while walking', 'Safety issues: texting while driving'],
    },
    {
      id: 'health-sockets',
      title: 'Using sockets safely',
      task: '<p>Search ‘electrical safety first’ and find their guide to avoiding overloading electrical sockets. What do you think of this advice? Is it helpful?</p>',
      lines: 4,
    },
  ],
});

FD.check({
  section: 'health',
  items: [
    { type: 'spot', q: 'Which parts of this description of Ana’s desk are risks to health and safety?', html: `<div class="spot-mail"><p><span data-spot="1" data-why="Trailing wires are a trip hazard: use cable management and trunking.">A cable runs across the floor to the printer.</span> <span data-spot="0" data-why="">Ana uses a wrist pad with her mouse.</span> <span data-spot="1" data-why="Liquid near devices can cause an electric shock.">A full glass of water stands next to the keyboard.</span></p><p><span data-spot="1" data-why="An overloaded plug socket can cause a fire.">Eight plugs are connected to one socket with adaptors.</span> <span data-spot="0" data-why="">Her feet are flat on the floor.</span> <span data-spot="1" data-why="Long periods at a screen cause eye dryness and eye fatigue: take breaks.">She has worked at the screen for four hours without a break.</span></p></div>`, why: 'See Table 9.2.' },
    { type: 'mcq', q: 'Which one of these is used to reduce the risk to health and safety?', opts: ['Using an RCD', 'Using a small monitor', 'Increasing the amount of blue light emitted by a screen', 'Working in a room with low-level lighting'], why: 'Chapter question 1: an RCD interrupts the current to prevent electric shock.' },
    { type: 'sort', q: 'Match each risk to a way of minimising it.', bins: ['Wrist pads / ergonomic devices', 'Trunking', 'Blue light filters / breaks'], rows: [['RSI', 0], ['Trip hazards', 1], ['Eye fatigue', 2]], why: 'See Table 9.2.' },
    { type: 'mcq', q: 'What is the recommended monitor angle in Figure 9.7?', opts: ['10°–20°', '0°', '45°', '90°'], why: 'Also keep the keyboard at elbow height and feet flat on the floor.' },
  ],
});
