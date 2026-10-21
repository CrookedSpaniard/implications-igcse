FD.add({
  id: 'dataprot',
  title: 'Data protection',
  tab: 'Data protection',
  icon: 'dataprot',
  color: '--c4',
  section: true,
  interactive: true,
  vocab: [
    ['Consent', 'Permission to do something.'],
    ['Lawfully', 'Keeping to the law.'],
    ['Specifically', 'In a detailed or exact way.'],
    ['Adequate', 'Large enough in quantity or good enough in quality.'],
    ['Rectified', 'Corrected.'],
    ['Compensation', 'Money paid to someone because they have suffered injury or loss.'],
    ['Breach', 'An action that breaks a law, rule or agreement.'],
  ],
  mount(el) {
    // UK data protection principles: [key, text, scenario that breaks it]
    const P = [
      ['fair', 'Used fairly and <b>lawfully</b>', 'A website secretly collects visitors’ email addresses without telling them.'],
      ['purpose', 'Used for limited, <b>specifically</b> stated purposes', 'A sports club uses members’ medical details to sell them holidays.'],
      ['adequate', '<b>Adequate</b>, relevant and not excessive', 'A library asks for your blood group before you can borrow a book.'],
      ['accurate', 'Accurate', 'A bank keeps a customer’s old address and never corrects it.'],
      ['time', 'Kept for no longer than is absolutely necessary', 'A gym keeps your details for 10 years after you leave.'],
      ['rights', 'Handled according to people’s data protection rights', 'A shop ignores a customer who asks for a copy of their data.'],
      ['secure', 'Kept safe and secure', 'A clinic leaves patient records on an unlocked laptop in a café.'],
      ['eea', 'Not transferred outside the <b>European Economic Area</b> without adequate protection', 'A company sends customer data to a country with no data protection laws.'],
    ];
    // Rights of individuals: [key, button, what happens to the record]
    const R = [
      ['access', '📄 Access a copy of my data', 'The organisation sends Sam a copy of all the personal data it holds.'],
      ['object', '✋ Object to processing that causes damage or distress', 'Processing that is causing Sam distress is stopped.'],
      ['market', '📭 Prevent direct marketing', 'No more newsletters or marketing emails are sent to Sam.'],
      ['auto', '🤖 Object to decisions taken by automated means', 'A person, not a computer program, reviews Sam’s loan application.'],
      ['rectify', '✏️ Have inaccurate data <b>rectified</b>', 'The wrong postcode is corrected (it could also be blocked, erased or destroyed).'],
      ['comp', '💷 Claim <b>compensation</b> for a <b>breach</b>', 'Sam’s data was leaked by mistake, so Sam can claim compensation for the damage.'],
    ];
    el.innerHTML = `
      <div class="sim dp-s">
        <div class="ptabs" role="group" aria-label="Simulations">
          <button data-p="consent">🇸🇬 Consent</button><button data-p="princ">🇬🇧 The principles</button><button data-p="rights">🙋 Your rights</button>
        </div>

        <div data-panel="consent" class="sim">
          <div class="two-col">
            <div class="win"><div class="win-bar"><span class="url">🔒 brightmart.example/join</span></div>
              <div class="win-body dp-form">
                <h5 class="mw-h">Join the BrightMart rewards club</h5>
                <label>Name <input type="text" value="Sam Lee" readonly></label>
                <label>Email <input type="text" value="sam.lee@example.com" readonly></label>
                <p class="dp-why" id="why">We will use your email <b>only</b> to send your reward points balance.</p>
                <label class="tgl"><input type="checkbox" id="ok"> I give my consent for BrightMart to collect and use these details</label>
                <button class="btn primary" id="send">Join</button>
              </div></div>
            <div class="sim-box"><h5 class="mw-h">Personal Data Protection Act (Singapore)</h5>
              <p class="note">Organisations must:</p>
              <ol class="dp-req" id="req">
                <li data-k="consent">have the individual’s <b>consent</b> to collect, use or disclose personal data</li>
                <li data-k="inform">collect, use or disclose it in an appropriate manner and <b>inform</b> the individual of their purposes</li>
                <li data-k="reason">only use it for purposes a <b>reasonable person</b> would consider appropriate</li>
              </ol>
              <p class="verdict" id="cMsg"></p></div>
          </div>
        </div>

        <div data-panel="princ" class="sim" hidden>
          <p class="note">In the UK, the <b>Data Protection Act</b> says organisations must follow the <b>data protection principles</b>. Pick a situation, then tap the principle it breaks.</p>
          <div class="dp-scen" id="scen"></div>
          <div class="dp-grid" id="princ">${P.map(([k, t], i) => `<button class="dp-p" data-k="${k}"><span class="qn">${i + 1}</span><span>${t}</span></button>`).join('')}</div>
          <p class="verdict" id="pMsg"></p>
        </div>

        <div data-panel="rights" class="sim" hidden>
          <div class="two-col">
            <div class="sim-box"><h5 class="mw-h">Sam’s rights under the Data Protection Act</h5>
              <div class="dp-rights">${R.map(([k, t]) => `<button class="btn dp-r" data-k="${k}">${t}</button>`).join('')}</div></div>
            <div class="sim-box dp-rec"><h5 class="mw-h">🗂️ Record held by Northfield Bank</h5>
              <dl class="dp-dl" id="rec"></dl>
              <p class="verdict" id="rMsg"></p></div>
          </div>
        </div>
      </div>`;
    const root = el.querySelector('.dp-s'), $ = (s) => root.querySelector(s);
    const show = FD.panels(root);
    let dead = false;

    // ----- consent -----
    function light(keys) { root.querySelectorAll('#req li').forEach((li) => li.classList.toggle('on', keys.includes(li.dataset.k))); }
    function join() {
      const ok = $('#ok').checked;
      $('#cMsg').className = 'verdict ' + (ok ? 'good' : 'bad');
      $('#cMsg').innerHTML = ok
        ? '✓ Sam gave consent and was told the purpose, so BrightMart may collect and use the data for that purpose.'
        : '✗ No consent: BrightMart must <b>not</b> collect, use or disclose Sam’s personal data.';
      light(ok ? ['consent', 'inform', 'reason'] : ['consent']);
    }
    function consent(on) { $('#ok').checked = on; }
    $('#send').addEventListener('click', join);

    // ----- principles -----
    let cur = 0;
    function scen(i) {
      cur = i;
      $('#scen').innerHTML = P.map((p, k) => `<button class="mini-btn ${k === i ? 'on' : ''}" data-s="${k}">${k + 1}</button>`).join('') + `<p class="dp-case">📰 ${P[i][2]}</p>`;
      root.querySelectorAll('.dp-p').forEach((b) => b.classList.remove('right', 'wrong'));
      $('#pMsg').innerHTML = '';
    }
    function answer(k) {
      const right = P[cur][0] === k;
      root.querySelectorAll('.dp-p').forEach((b) => b.classList.toggle(right ? 'right' : 'wrong', b.dataset.k === k));
      if (!right) root.querySelector(`.dp-p[data-k="${P[cur][0]}"]`).classList.add('right');
      $('#pMsg').className = 'verdict ' + (right ? 'good' : 'bad');
      $('#pMsg').innerHTML = right ? '✓ Correct: that principle is broken.' : `✗ Not that one. It breaks principle ${cur + 1}.`;
    }
    $('#scen').addEventListener('click', (e) => { const b = e.target.closest('[data-s]'); if (b) scen(+b.dataset.s); });
    $('#princ').addEventListener('click', (e) => { const b = e.target.closest('.dp-p'); if (b) answer(b.dataset.k); });

    // ----- rights -----
    const BASE = { Name: 'Sam Lee', Postcode: 'AB1 2CD ✗ (wrong)', Newsletter: 'Weekly offers', 'Loan decision': 'Refused by computer program', Status: 'Processing data for marketing' };
    let rec = {};
    function drawRec(hot) { $('#rec').innerHTML = Object.entries(rec).map(([k, v]) => `<dt>${k}</dt><dd class="${hot === k ? 'new hot-t' : ''}">${v}</dd>`).join(''); }
    function right(k) {
      const r = R.find((x) => x[0] === k);
      root.querySelectorAll('.dp-r').forEach((b) => b.classList.toggle('on', b.dataset.k === k));
      let hot = '';
      if (k === 'access') { hot = 'Status'; rec.Status = '📄 Copy sent to Sam'; }
      if (k === 'object') { hot = 'Status'; rec.Status = '⏸️ Processing stopped'; }
      if (k === 'market') { hot = 'Newsletter'; rec.Newsletter = '🚫 None'; }
      if (k === 'auto') { hot = 'Loan decision'; rec['Loan decision'] = '👩‍💼 Reviewed by a person'; }
      if (k === 'rectify') { hot = 'Postcode'; rec.Postcode = 'AB1 2CE ✓'; }
      if (k === 'comp') { hot = 'Status'; rec.Status = '⚠️ Data leaked: £ compensation claimed'; }
      drawRec(hot);
      $('#rMsg').className = 'verdict good';
      $('#rMsg').innerHTML = r[2];
    }
    root.querySelectorAll('.dp-r').forEach((b) => b.addEventListener('click', () => right(b.dataset.k)));

    function reset() {
      consent(false); light([]); $('#cMsg').innerHTML = '';
      scen(0);
      rec = { ...BASE }; drawRec(''); $('#rMsg').innerHTML = '';
      root.querySelectorAll('.dp-r').forEach((b) => b.classList.remove('on'));
    }
    show('consent'); reset();
    return {
      show, consent, join, light, scen, answer, right, reset,
      destroy() { dead = true; },
      get dead() { return dead; },
    };
  },
  steps: [
    {
      title: 'Why protect data?',
      text: `<p>Some countries have laws to make sure that, when data is stored about individuals, that data is <b>protected</b>.</p>
             <p>For example, in <b>Singapore</b>, the Personal Data Protection Act makes organisations ask for the individual’s <strong>consent</strong> (permission).</p>`,
      tip: 'Try it: press Join with and without ticking the consent box.',
      async on(a, ctx) { a.show('consent'); a.reset(); a.join(); if (!(await ctx.sleep(2200))) return; a.consent(true); a.join(); },
    },
    {
      title: 'Singapore: three rules',
      text: `<p>Organisations in Singapore must:</p>
             <ul><li>have the individual’s <b>consent</b> to collect, use or disclose personal data</li>
             <li>collect, use or disclose it in an appropriate manner and <b>inform</b> the individual of their purposes</li>
             <li>only use it for purposes that a <b>reasonable person</b> would consider appropriate.</li></ul>`,
      async on(a, ctx) { a.show('consent'); a.consent(true); a.light([]); for (const k of [['consent'], ['consent', 'inform'], ['consent', 'inform', 'reason']]) { a.light(k); if (!(await ctx.sleep(1100))) return; } },
    },
    {
      title: 'UK: the data protection principles',
      text: `<p>In the UK, the <b>Data Protection Act</b> says that organisations responsible for using data must follow rules called <strong>data protection principles</strong>. The information must be:</p>
             <ul><li>used fairly and <b>lawfully</b></li><li>used for limited, <b>specifically</b> stated purposes</li><li>used in a way that is <b>adequate</b>, relevant and not excessive</li><li>accurate</li></ul>`,
      tip: 'Try it: pick a situation, then tap the principle it breaks.',
      async on(a, ctx) { a.show('princ'); for (const i of [0, 1, 2, 3]) { a.scen(i); if (!(await ctx.sleep(1000))) return; a.answer(['fair', 'purpose', 'adequate', 'accurate'][i]); if (!(await ctx.sleep(1500))) return; } },
    },
    {
      title: 'More principles',
      text: `<p>The information must also be:</p>
             <ul><li>kept for no longer than is absolutely necessary</li><li>handled according to people’s data protection rights</li><li>kept safe and secure</li><li>not transferred outside the <b>European Economic Area</b> (EEA) without adequate protection.</li></ul>`,
      async on(a, ctx) { a.show('princ'); for (const i of [4, 5, 6, 7]) { a.scen(i); if (!(await ctx.sleep(1000))) return; a.answer(['time', 'rights', 'secure', 'eea'][i - 4]); if (!(await ctx.sleep(1500))) return; } },
    },
    {
      title: 'Your rights',
      text: `<p>Under the Data Protection Act, individuals whose data is stored by organisations have the right to:</p>
             <ul><li><b>access</b> a copy of their personal data</li><li><b>object</b> to processing likely to cause damage or distress</li><li><b>prevent</b> processing for direct marketing (newsletters, emails)</li></ul>`,
      tip: 'Try it: use each of Sam’s rights and watch the record.',
      async on(a, ctx) { a.show('rights'); a.reset(); for (const k of ['access', 'object', 'market']) { a.right(k); if (!(await ctx.sleep(1700))) return; } },
    },
    {
      title: 'More rights',
      text: `<p>Individuals also have the right to:</p>
             <ul><li>object to decisions taken by <b>automated means</b></li><li>have inaccurate personal data <strong>rectified</strong>, blocked, erased or destroyed in certain circumstances</li><li>claim <strong>compensation</strong> for damages caused by a <strong>breach</strong> of the Act.</li></ul>`,
      async on(a, ctx) { a.show('rights'); for (const k of ['auto', 'rectify', 'comp']) { a.right(k); if (!(await ctx.sleep(1700))) return; } },
    },
  ],
});

FD.activities({
  section: 'dataprot',
  items: [
    {
      id: 'dataprot-compare',
      title: 'Comparing data protection law',
      task: '<p>Compare the data protection laws from the UK and Singapore. What are the differences?</p>',
      fields: ['Similarities', 'Differences'],
      hint: 'Look again at the Singapore rules and the UK principles and rights in the simulation.',
      sim: ['dataprot', 'See the laws again'],
    },
    {
      id: 'dataprot-country',
      title: 'Data protection in your country',
      task: '<ol><li>Investigate whether your country has laws that protect the data that is stored about individuals.</li><li>Research a country that does not have data protection laws.</li></ol>',
      fields: ['1. Laws in my country', '2. A country without data protection laws'],
      hint: 'For example, Spain follows the EU’s General Data Protection Regulation (GDPR).',
    },
  ],
});

FD.check({
  section: 'dataprot',
  items: [
    { type: 'mcq', q: 'Under Singapore’s Personal Data Protection Act, what must an organisation have before it collects personal data?', opts: ['The individual’s consent', 'A web server', 'A copyright notice', 'An RCD'], why: 'Consent means permission to do something.' },
    { type: 'multi', q: 'Which are UK data protection principles? Choose <b>three</b>.', need: 3, opts: [['Kept safe and secure', true], ['Accurate', true], ['Kept for no longer than is absolutely necessary', true], ['Shared with as many companies as possible', false], ['Kept for at least 20 years', false]], why: 'There are eight principles: see the simulation.' },
    { type: 'sort', q: 'Which principle does each situation break?', bins: ['Not excessive', 'Kept no longer than necessary', 'Safe and secure'], rows: [['A library asks for your blood group', 0], ['A gym keeps your details 10 years after you leave', 1], ['Patient records left on an unlocked laptop in a café', 2]], why: 'Organisations must follow all the principles.' },
    { type: 'mcq', q: 'Sam’s postcode is wrong in a bank’s records. Which right lets Sam fix it?', opts: ['Having inaccurate data rectified', 'Preventing direct marketing', 'Claiming compensation', 'Objecting to automated decisions'], why: '<b>Rectified</b> means corrected.' },
    { type: 'tf', q: 'Individuals can claim compensation for damage caused by a breach of the Data Protection Act.', a: true, why: 'A breach is an action that breaks a law, rule or agreement.' },
  ],
});
