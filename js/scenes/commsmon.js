FD.add({
  id: 'commsmon',
  title: 'Monitoring communications',
  tab: 'Communications',
  icon: 'commsmon',
  color: '--c8',
  section: true,
  interactive: true,
  vocab: [
    ['Parental control software', 'Software that lets parents monitor their children’s online activity and use of applications.'],
    ['Investigatory Powers Act 2016', 'A UK law that allows the police and many other agencies to access people’s digital communications.'],
    ['Web history', 'A record of the websites that have been visited.'],
  ],
  mount(el) {
    // Sam's day: [time, emoji, kind, text]
    const DAY = [
      ['16:02', '💬', 'Text message', 'To Mum: “At the library, home by 6”'],
      ['16:15', '🌐', 'Web history', 'Visited: revision-maths.example'],
      ['16:40', '📧', 'Email', 'To Mr Ortiz: “ICT homework attached”'],
      ['17:05', '📸', 'Social media post', 'Posted a photo: “Finally finished!”'],
      ['17:12', '🗨️', 'Blog comment', 'Commented on a gaming blog'],
      ['17:30', '🌐', 'Web history', 'Visited: videos.example (2 h 10 min)'],
    ];
    const WORDS = [['privacy', 34, '--c4'], ['data', 38, '--c3'], ['interception', 26, '--c7'], ['Act', 40, '--c5'], ['warrants', 22, '--c9'], ['oversight', 18, '--c7'], ['powers', 20, '--c2'], ['equipment', 17, '--c6'], ['offence', 16, '--c8'], ['protections', 21, '--c1'], ['personal', 18, '--c2'], ['computer', 17, '--c9'], ['law', 19, '--c3'], ['obtaining', 22, '--c1']];
    el.innerHTML = `
      <div class="sim cm-s">
        <div class="ptabs" role="group" aria-label="Simulations">
          <button data-p="parent">👪 Parental control</button><button data-p="isp">🗄️ The provider’s record</button><button data-p="act">⚖️ The law</button>
        </div>

        <div data-panel="parent" class="sim">
          <div class="two-col">
            <div class="sim-box"><h5 class="mw-h">📱 Sam’s phone</h5><ol class="cm-feed" id="feed"></ol>
              <button class="btn primary" id="bDay">▶ Use the phone</button></div>
            <div class="sim-box cm-dash"><h5 class="mw-h">👪 Parent’s app</h5>
              <label class="tgl"><input type="checkbox" id="pc" checked> Parental control software on</label>
              <div class="readout"><div class="ro"><small>Screen time</small><b id="st">0 min</b></div><div class="ro"><small>Apps used</small><b id="ap">0</b></div><div class="ro"><small>Sites visited</small><b id="sv">0</b></div></div>
              <ul class="cm-seen" id="seen"></ul></div>
          </div>
        </div>

        <div data-panel="isp" class="sim" hidden>
          <div class="sim-box"><h5 class="mw-h">🗄️ Mobile and internet service provider: records kept for <b>one year</b></h5>
            <table class="tbl cm-tbl"><thead><tr><th>Time</th><th>Type</th><th>Record</th></tr></thead><tbody id="rows"></tbody></table>
            <div class="chk-btns"><button class="btn" id="bReq">👮 Request access under the Investigatory Powers Act</button></div>
            <p class="verdict" id="iMsg"></p></div>
        </div>

        <div data-panel="act" class="sim" hidden>
          <div class="sim-box cm-cloud" id="cloud" aria-label="Common terms in the Investigatory Powers Act 2016 (like Figure 9.5)">${WORDS.map(([w, s, c], i) => `<span style="font-size:${s / 16}rem;color:var(${c});--d:${i * 80}ms">${w}</span>`).join(' ')}</div>
          <div class="cm-bal">
            <div class="mini" id="kPriv"><h5>🙋 The right to privacy</h5><p>Human rights organisations have voiced concerns about these powers.</p></div>
            <span class="cm-vs">vs</span>
            <div class="mini" id="kProt"><h5>🏛️ Protecting citizens</h5><p>Governments are responsible for protecting their citizens, e.g. from crime and terrorism.</p></div>
          </div>
        </div>
      </div>`;
    const root = el.querySelector('.cm-s'), $ = (s) => root.querySelector(s);
    const show = FD.panels(root);
    let dead = false, gen = 0, n = 0;

    function addItem(i) {
      const [t, e, k, x] = DAY[i];
      $('#feed').appendChild(FD.h(`<li class="new"><span>${e}</span><div><b>${k}</b> <small>${t}</small><br>${x}</div></li>`));
      if ($('#pc').checked) {
        n++;
        $('#seen').appendChild(FD.h(`<li class="new">${e} ${t} ${k}: ${x}</li>`));
        $('#st').textContent = [12, 25, 38, 44, 50, 180][i] + ' min';
        $('#ap').textContent = new Set(DAY.slice(0, i + 1).map((d) => d[2] === 'Web history' ? 'Browser' : d[2])).size;
        $('#sv').textContent = DAY.slice(0, i + 1).filter((d) => d[2] === 'Web history').length;
      }
    }
    async function day() {
      const g = ++gen;
      $('#feed').innerHTML = ''; $('#seen').innerHTML = ''; $('#st').textContent = '0 min'; $('#ap').textContent = '0'; $('#sv').textContent = '0';
      if (!$('#pc').checked) $('#seen').innerHTML = '<li class="note">Parental control is off: nothing is monitored.</li>';
      for (let i = 0; i < DAY.length; i++) { await FD.wait(650); if (dead || g !== gen) return; addItem(i); }
    }
    $('#bDay').addEventListener('click', day);
    function pc(on) { $('#pc').checked = on; }

    async function records() {
      const g = ++gen;
      $('#rows').innerHTML = ''; $('#iMsg').innerHTML = '';
      for (const [t, e, k, x] of DAY) { await FD.wait(300); if (dead || g !== gen) return; $('#rows').appendChild(FD.h(`<tr class="new"><td>${t}</td><td>${e} ${k}</td><td>${x}</td></tr>`)); }
    }
    function request() {
      if (!$('#rows').children.length) DAY.forEach(([t, e, k, x]) => $('#rows').appendChild(FD.h(`<tr><td>${t}</td><td>${e} ${k}</td><td>${x}</td></tr>`)));
      root.querySelectorAll('#rows tr').forEach((r) => r.classList.add('cm-hl'));
      $('#iMsg').className = 'verdict bad';
      $('#iMsg').innerHTML = '👮 Access granted: the Investigatory Powers Act 2016 allows the police and many other agencies to access these kinds of digital communication.';
    }
    $('#bReq').addEventListener('click', request);

    function cloud() { const c = $('#cloud'); c.classList.remove('in'); void c.offsetWidth; c.classList.add('in'); }
    function weigh(k) { $('#kPriv').classList.toggle('hot', k === 'priv' || k === 'both'); $('#kProt').classList.toggle('hot', k === 'prot' || k === 'both'); }
    root.querySelector('.cm-bal').addEventListener('click', (e) => { const m = e.target.closest('.mini'); if (m) weigh(m.id === 'kPriv' ? 'priv' : 'prot'); });

    function reset() { gen++; pc(true); $('#feed').innerHTML = ''; $('#seen').innerHTML = ''; $('#rows').innerHTML = ''; $('#iMsg').innerHTML = ''; weigh(''); }
    show('parent'); reset();
    return { show, day, pc, records, request, cloud, weigh, reset, destroy() { dead = true; } };
  },
  steps: [
    {
      title: 'Parental control',
      text: `<p>There are many ways in which individuals’ <b>communication</b> can be monitored.</p>
             <p>For example, parents can use <strong>parental control software</strong> to monitor their children’s online activity and use of applications.</p>`,
      tip: 'Try it: use the phone with parental control on, then off.',
      async on(a) { a.show('parent'); a.reset(); await a.day(); },
    },
    {
      title: 'What can be monitored?',
      text: `<p><b>Text messages, emails, posts</b> on social networking sites, <b>comments on blogs</b> and <b>web histories</b> are just a few examples of communications that can be monitored and recorded.</p>`,
      async on(a) { a.show('isp'); await a.records(); },
    },
    {
      title: 'Records kept for a year',
      text: `<p>💡 <b>Did you know?</b> UK mobile phone and internet service providers must keep a record of all customers’ phone and online activity for <b>one year</b>.</p>
             <p>In the UK, the <strong>Investigatory Powers Act 2016</strong> allows the police and many other agencies to access these kinds of digital communication.</p>`,
      tip: 'Try it: request access to the records.',
      async on(a, ctx) { a.show('isp'); await a.records(); if (!(await ctx.sleep(600))) return; a.request(); },
    },
    {
      title: 'A controversial law',
      text: `<p>This law is <b>controversial</b>, and human rights organisations have voiced concerns about the use of these powers.</p>
             <p>Figure 9.5 shows some of the most common terms used in the Act: <i>privacy, data, interception, warrants, oversight…</i></p>`,
      async on(a) { a.show('act'); a.weigh(''); a.cloud(); },
    },
    {
      title: 'Privacy or protection?',
      text: `<p>🔑 <b>Key point:</b> the <b>right to privacy</b> is in conflict with governments’ responsibility to <b>protect their citizens</b>.</p>
             <p><b>Safe and responsible practice:</b> digital technologies offer great opportunities for individuals, but there are risks associated with their use (see pages 116–119 of the book).</p>`,
      tip: 'Try it: tap each side.',
      async on(a, ctx) { a.show('act'); a.weigh('priv'); if (!(await ctx.sleep(1400))) return; a.weigh('prot'); if (!(await ctx.sleep(1400))) return; a.weigh('both'); },
    },
  ],
});

FD.check({
  section: 'commsmon',
  items: [
    { type: 'multi', q: 'Which communications can be monitored and recorded? Choose <b>three</b>.', need: 3, opts: [['Text messages', true], ['Web histories', true], ['Comments on blogs', true], ['Thoughts you have not written down', false], ['The colour of your monitor', false]], why: 'Also emails and posts on social networking sites.' },
    { type: 'mcq', q: 'In the UK, for how long must mobile phone and internet service providers keep a record of customers’ activity?', opts: ['One year', 'One week', 'Ten years', 'They must not keep any record'], why: 'See the Did you know? feature on page 152.' },
    { type: 'mcq', q: 'Which UK law allows the police and many other agencies to access digital communications?', opts: ['The Investigatory Powers Act 2016', 'The Data Protection Act', 'The Personal Data Protection Act', 'The Waste Electrical and Electronic Equipment Directive'], why: 'It is controversial: human rights organisations have voiced concerns.' },
    { type: 'tf', q: 'The right to privacy is in conflict with governments’ responsibility to protect their citizens.', a: true, why: 'This is the key point on page 153.' },
  ],
});
