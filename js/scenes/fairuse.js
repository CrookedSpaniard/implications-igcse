FD.add({
  id: 'fairuse',
  title: 'Fair use, DRM and geoblocking',
  tab: 'Fair use & DRM',
  icon: 'fairuse',
  color: '--c6',
  section: true,
  interactive: true,
  vocab: [
    ['Exemption', 'Having permission to not obey a rule or law.'],
    ['Fair use', 'An exemption from copyright in some countries, such as the UK.'],
    ['Parody', 'An exaggerated imitation for the purpose of humour.'],
    ['Digital rights management (DRM)', 'Systems that check that the device on which a work is opened is allowed to open it.'],
    ['Geoblocking', 'Limiting access to internet content based on the user’s geographical location (also known as geolocation rights management).'],
  ],
  mount(el) {
    // [use, isFairUse, reason]
    const U = [
      ['📚 A library makes a copy of a book chapter', true, 'Copies made by libraries, educational establishments, museums or archives.'],
      ['📼 A museum records a TV broadcast for its archive', true, 'Recordings of broadcasts for archive purposes.'],
      ['🦻 A charity makes a large-print copy for people with poor sight', true, 'Uses for the benefit of people with a disability.'],
      ['📝 You copy a paragraph for your private study notes', true, 'Non-commercial research or private study.'],
      ['😂 A comedian makes a funny version of a famous song', true, 'When used in parody.'],
      ['💿 A shop sells copies of a new film', false, 'This is commercial and needs the owner’s permission.'],
      ['📤 You upload a whole album for everyone to download', false, 'Distributing the work needs the owner’s permission.'],
    ];
    const C = [['uk', '🇬🇧 United Kingdom'], ['es', '🇪🇸 Spain'], ['us', '🇺🇸 United States']];
    el.innerHTML = `
      <div class="sim fu-s">
        <div class="ptabs" role="group" aria-label="Simulations">
          <button data-p="fair">⚖️ Fair use</button><button data-p="drm">🔐 DRM</button><button data-p="geo">🌍 Geoblocking</button>
        </div>

        <div data-panel="fair" class="sim">
          <p class="note">Is it <b>fair use</b> (an exemption from copyright in the UK)? Tap ✓ or ✗ for each one.</p>
          <ul class="fu-list" id="uses">${U.map(([t], i) => `<li data-i="${i}"><span>${t}</span><span class="fu-b"><button class="mini-btn" data-v="1" aria-label="Fair use">✓</button><button class="mini-btn" data-v="0" aria-label="Not fair use">✗</button></span><small class="fu-why"></small></li>`).join('')}</ul>
          <p class="verdict" id="fMsg"></p>
        </div>

        <div data-panel="drm" class="sim" hidden>
          <div class="fu-drm">
            <div class="fu-file" id="file">🎵<b>Sunrise.m4a</b><small>🔒 protected with DRM<br>licensed to: Sam’s phone</small></div>
            <div class="fu-devs">
              <button class="fu-dev" data-d="phone"><span>📱</span>Sam’s phone<small>authorised</small></button>
              <button class="fu-dev" data-d="laptop"><span>💻</span>A friend’s laptop<small>not authorised</small></button>
            </div>
          </div>
          <p class="verdict" id="dMsg"></p>
        </div>

        <div data-panel="geo" class="sim" hidden>
          <div class="seg" id="ctry">${C.map(([k, n]) => `<button data-v="${k}">${n}</button>`).join('')}</div>
          <div class="fu-tv" id="tv">
            <div class="fu-screen" id="scr"></div>
            <div class="fu-ctl">▷ ▮▮</div>
          </div>
          <p class="note">🎬 <b>The Lighthouse</b> is licensed for streaming in the United Kingdom only.</p>
        </div>
      </div>`;
    const root = el.querySelector('.fu-s'), $ = (s) => root.querySelector(s);
    const show = FD.panels(root);
    let dead = false, gen = 0;

    // ----- fair use -----
    function judge(i, v) {
      const li = root.querySelector(`.fu-list li[data-i="${i}"]`), [, fair, why] = U[i];
      const right = (v === 1) === fair;
      li.className = right ? 'ok' : 'no';
      li.querySelectorAll('[data-v]').forEach((b) => b.classList.toggle('on', +b.dataset.v === v));
      li.querySelector('.fu-why').innerHTML = `${right ? '✓' : '✗'} ${fair ? '<b>Fair use</b>: ' : '<b>Not fair use</b>: '}${why}`;
      const done = root.querySelectorAll('.fu-list li.ok, .fu-list li.no').length, ok = root.querySelectorAll('.fu-list li.ok').length;
      $('#fMsg').className = 'verdict'; $('#fMsg').innerHTML = `${ok} / ${done} right so far.`;
    }
    $('#uses').addEventListener('click', (e) => { const b = e.target.closest('[data-v]'); if (b) judge(+b.closest('li').dataset.i, +b.dataset.v); });
    function clearFair() { root.querySelectorAll('.fu-list li').forEach((li) => { li.className = ''; li.querySelector('.fu-why').innerHTML = ''; li.querySelectorAll('[data-v]').forEach((b) => b.classList.remove('on')); }); $('#fMsg').innerHTML = ''; }

    // ----- DRM -----
    async function open(d) {
      const g = ++gen;
      root.querySelectorAll('.fu-dev').forEach((b) => b.classList.toggle('on', b.dataset.d === d));
      $('#dMsg').className = 'verdict'; $('#dMsg').innerHTML = '🔐 Checking that this device is allowed to open the file…';
      FD.pulse($('#file'));
      await FD.wait(1100);
      if (dead || g !== gen) return;
      const ok = d === 'phone';
      $('#dMsg').className = 'verdict ' + (ok ? 'good' : 'bad');
      $('#dMsg').innerHTML = ok ? '▶️ ♪ Playing “Sunrise”: this device is allowed to open it.' : '⛔ This device is not authorised to play this file.';
      if (ok) FD.beep(660, 120, 'sine', 0.05);
    }
    root.querySelectorAll('.fu-dev').forEach((b) => b.addEventListener('click', () => open(b.dataset.d)));

    // ----- geoblocking -----
    function where(k) {
      FD.segSet($('#ctry'), k);
      const ok = k === 'uk';
      $('#tv').classList.toggle('blocked', !ok);
      $('#scr').innerHTML = ok ? '<span class="fu-play">🌊🏠💡</span><small>▶ Playing: The Lighthouse</small>' : '<span class="fu-box">This media is unavailable in your area</span>';
    }
    $('#ctry').addEventListener('click', (e) => { const b = e.target.closest('[data-v]'); if (b) where(b.dataset.v); });

    function reset() { gen++; clearFair(); root.querySelectorAll('.fu-dev').forEach((b) => b.classList.remove('on')); $('#dMsg').innerHTML = ''; where('uk'); }
    show('fair'); reset();
    return { show, judge, clearFair, open, where, reset, destroy() { dead = true; } };
  },
  steps: [
    {
      title: 'Exemption from copyright',
      text: `<p><strong>Exemption</strong> from copyright applies in some situations. In many countries, such as the UK, an example of this is <strong>fair use</strong>.</p>
             <p>Some examples of fair use are copies, such as copies of books or documents, made by <b>libraries, educational establishments, museums or archives</b>, and <b>recordings of broadcasts</b> for archive purposes.</p>`,
      tip: 'Try it: decide whether each use is fair use.',
      async on(a, ctx) { a.show('fair'); a.reset(); a.judge(0, 1); if (!(await ctx.sleep(1200))) return; a.judge(1, 1); },
    },
    {
      title: 'More examples of fair use',
      text: `<p>Fair use also includes:</p>
             <ul><li>uses for the benefit of people with a <b>disability</b></li><li><b>non-commercial</b> research or private study</li><li>when used in <strong>parody</strong> (an exaggerated imitation for the purpose of humour).</li></ul>`,
      async on(a, ctx) { a.show('fair'); for (const i of [2, 3, 4]) { a.judge(i, 1); if (!(await ctx.sleep(1100))) return; } a.judge(5, 0); },
    },
    {
      title: 'Digital rights management (DRM)',
      text: `<p>To check that copyright law is not being broken, owners can protect their work using <b>copy protection</b> and <strong>digital rights management</strong> (DRM).</p>
             <p>These systems check that the <b>device</b> on which the work is opened is <b>allowed</b> to open it. For example, music files downloaded using Apple iTunes are often protected with DRM.</p>`,
      tip: 'Try it: open the song on each device.',
      async on(a, ctx) { a.show('drm'); await a.open('phone'); if (!(await ctx.sleep(1500))) return; await a.open('laptop'); },
    },
    {
      title: 'Geoblocking',
      text: `<p><strong>Geoblocking</strong> is often used to prevent online users from accessing digital content based on their <b>geographical location</b>. It is also called geolocation rights management.</p>
             <p>This prevents users in countries with <b>different legal frameworks</b> from accessing copyrighted work (Figure 9.2).</p>`,
      tip: 'Try it: watch from a different country.',
      async on(a, ctx) { a.show('geo'); a.where('uk'); if (!(await ctx.sleep(1500))) return; a.where('es'); if (!(await ctx.sleep(1500))) return; a.where('us'); },
    },
  ],
});

FD.check({
  section: 'fairuse',
  items: [
    { type: 'sort', q: 'Fair use or not?', bins: ['Fair use', 'Not fair use'], rows: [['Copies made by a school for teaching', 0], ['Recording a broadcast for an archive', 0], ['Selling copies of a film you bought', 1], ['A parody of a song', 0], ['Uploading an album for everyone to download', 1]], why: 'Fair use covers libraries and education, archives, disability, non-commercial research or private study, and parody.' },
    { type: 'mcq', q: 'What does <b>DRM</b> check?', opts: ['That the device on which a work is opened is allowed to open it', 'That the user is in the right country', 'That the file has no viruses', 'That the monitor does not flicker'], why: 'DRM = digital rights management.' },
    { type: 'mcq', q: 'What is <b>geoblocking</b>?', opts: ['Limiting access to internet content based on the user’s geographical location', 'Blocking a GPS tracker', 'Stopping data leaving the EEA', 'A type of fire extinguisher'], why: 'It is also called geolocation rights management.' },
    { type: 'mcq', q: 'What is an <b>exemption</b>?', opts: ['Having permission to not obey a rule or law', 'A type of licence you pay for', 'An exaggerated imitation for humour', 'A breach of copyright'], why: 'Fair use is an example of an exemption from copyright.' },
  ],
});
