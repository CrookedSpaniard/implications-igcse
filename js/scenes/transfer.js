FD.add({
  id: 'transfer',
  title: 'Data across borders',
  tab: 'Across borders',
  icon: 'transfer',
  color: '--c5',
  section: true,
  interactive: true,
  vocab: [
    ['European Economic Area (EEA)', 'An area in which goods and services can be traded freely, formed in 1993 by the countries of the European Union (EU) with Norway and Iceland.'],
    ['International agreement', 'An agreement between countries, e.g. so that data transferred between them receives adequate protection.'],
    ['Privacy Shield Framework', 'An EU–US agreement that aimed to protect data transferred between the USA and countries in the EU.'],
  ],
  mount(el) {
    // Destinations: [key, label, point, inEEA]
    const D = {
      ie: { n: 'a data centre in the Republic of Ireland', p: [380, 112], eea: true },
      us: { n: 'a data centre in the USA', p: [100, 150], eea: false },
      x: { n: 'a data centre in Country X (no data protection laws)', p: [535, 160], eea: false, nolaw: true },
    };
    const HOME = [290, 172];
    el.innerHTML = `
      <div class="sim tr-s">
        <div class="sim-box">
          <svg viewBox="0 0 600 280" class="tr-map" role="img" aria-label="Personal data sent from Spain to Ireland, the USA or Country X">
            <rect class="tr-us" x="15" y="60" width="170" height="170" rx="26"/>
            <text class="svg-lbl" x="100" y="88">🇺🇸 United States</text>
            <rect class="tr-eea" x="205" y="40" width="260" height="215" rx="26"/>
            <text class="svg-lbl" x="335" y="66">🇪🇺 European Economic Area</text>
            <text class="svg-sm tr-note" x="335" y="242" style="text-anchor:middle">EU countries + Norway, Iceland…</text>
            <rect class="tr-x" x="480" y="80" width="112" height="150" rx="26"/>
            <text class="svg-lbl" x="536" y="106">Country X</text>
            <text class="emo" x="${HOME[0]}" y="${HOME[1]}" font-size="30">📱</text><text class="svg-sm" x="${HOME[0]}" y="${HOME[1] + 30}" style="text-anchor:middle">🇪🇸 You, in Spain</text>
            <text class="emo" x="380" y="112" font-size="30">🗄️</text><text class="svg-sm" x="380" y="144" style="text-anchor:middle">🇮🇪 Ireland</text>
            <text class="emo" x="100" y="150" font-size="30">🗄️</text>
            <text class="emo" x="535" y="160" font-size="30">🗄️</text>
            <path class="tr-bridge" id="bridge" d="M205 150 H185"/>
            <g id="pkt" class="tr-pkt" opacity="0"><rect x="-22" y="-13" width="44" height="26" rx="6"/><text class="emo" x="0" y="1" font-size="15">👤</text></g>
            <text class="emo tr-badge" id="badge" x="0" y="0" font-size="26" opacity="0"></text>
          </svg>
          <div class="ctrls">
            <button class="btn" data-to="ie">🇮🇪 Store in Ireland</button>
            <button class="btn" data-to="us">🇺🇸 Send to the USA</button>
            <button class="btn" data-to="x">🏳️ Send to Country X</button>
            <label class="tgl"><input type="checkbox" id="deal" checked> EU–US agreement in place</label>
          </div>
          <p class="verdict" id="tMsg"></p>
        </div>
        <p class="note tr-upd">🗓️ <b>Update:</b> in 2020 the EU Court of Justice decided that the Privacy Shield did not give adequate protection. Since 2023 the <b>EU–US Data Privacy Framework</b> does this job. The idea is the same: an agreement so that data keeps its protection.</p>
      </div>`;
    const root = el.querySelector('.tr-s'), $ = (s) => root.querySelector(s);
    let dead = false, gen = 0;
    const pkt = $('#pkt'), badge = $('#badge');

    function deal(on) { $('#deal').checked = on; $('#bridge').classList.toggle('on', on); }
    async function send(to) {
      const g = ++gen, d = D[to];
      root.querySelectorAll('[data-to]').forEach((b) => b.classList.toggle('on', b.dataset.to === to));
      badge.setAttribute('opacity', 0);
      $('#tMsg').className = 'verdict'; $('#tMsg').innerHTML = `Sending your personal data to ${d.n}…`;
      pkt.setAttribute('opacity', 1);
      const path = [HOME, [HOME[0], 138], [d.p[0], 138], d.p];
      await FD.tween(1500, (t) => { if (g !== gen || dead) return; const [x, y] = FD.along(path, t); pkt.setAttribute('transform', `translate(${x} ${y})`); });
      if (g !== gen || dead) return;
      pkt.setAttribute('opacity', 0);
      const safe = d.eea || (to === 'us' && $('#deal').checked);
      badge.textContent = safe ? '🔒' : '⚠️';
      badge.setAttribute('x', d.p[0] + 26); badge.setAttribute('y', d.p[1] - 22); badge.setAttribute('opacity', 1);
      $('#tMsg').className = 'verdict ' + (safe ? 'good' : 'bad');
      $('#tMsg').innerHTML = d.eea
        ? '✓ Inside the EEA, the data stays protected by the same kind of laws.'
        : to === 'us' && safe
          ? '✓ An <b>international agreement</b> means the data still receives adequate protection in the USA.'
          : to === 'us'
            ? '✗ Without an agreement, there is no guarantee of adequate protection in the USA.'
            : '✗ In a country with no data protection laws, you could not take action if your rights were abused.';
    }
    root.querySelectorAll('[data-to]').forEach((b) => b.addEventListener('click', () => send(b.dataset.to)));
    $('#deal').addEventListener('change', (e) => deal(e.target.checked));

    function reset() { gen++; deal(true); pkt.setAttribute('opacity', 0); badge.setAttribute('opacity', 0); $('#tMsg').innerHTML = ''; root.querySelectorAll('[data-to]').forEach((b) => b.classList.remove('on')); }
    reset();
    return { send, deal, reset, destroy() { dead = true; } };
  },
  steps: [
    {
      title: 'Data does not stay in one country',
      text: `<p>Depending on the online services you use, your data could be stored in <b>other countries</b>. The UK principle says data must not be transferred outside the <strong>European Economic Area</strong> (EEA) without adequate protection.</p>`,
      tip: 'Try it: store your data in Ireland.',
      async on(a) { a.reset(); await a.send('ie'); },
    },
    {
      title: 'International agreements',
      text: `<p>Some countries have <b>international agreements</b> that mean data can be transferred between countries in the knowledge that it will receive <b>adequate protection</b>.</p>
             <p>One example was the <strong>EU–US Privacy Shield Framework</strong>, which aimed to protect data transferred between the USA and countries in the EU.</p>`,
      tip: 'Try it: send your data to the USA with and without the agreement.',
      async on(a, ctx) { a.deal(true); await a.send('us'); if (!(await ctx.sleep(1800))) return; a.deal(false); await a.send('us'); },
    },
    {
      title: 'Why it matters',
      text: `<p>This is important for American companies like Microsoft, Amazon, Twitter and Google, which have large data storage centres in the Republic of Ireland.</p>
             <p>International agreements are very important to make sure that international organisations can act <b>lawfully</b>.</p>`,
      async on(a, ctx) { a.deal(true); await a.send('ie'); if (!(await ctx.sleep(1200))) return; await a.send('us'); },
    },
    {
      title: 'Countries without data protection laws',
      text: `<p>Your data could be stored in countries that have <b>different data protection laws</b> or <b>no data protection laws at all</b>.</p>
             <p>This means that you would not be able to take action if your rights were abused.</p>`,
      async on(a) { await a.send('x'); },
    },
  ],
});

FD.activities({
  section: 'transfer',
  items: [
    {
      id: 'transfer-shield',
      title: 'The Privacy Shield Framework',
      task: '<p>Research how the Privacy Shield Framework protects data transferred between the United States of America and countries in the EU.</p>',
      lines: 5,
      hint: 'Also find out what replaced it (the EU–US Data Privacy Framework) and why.',
    },
  ],
});

FD.check({
  section: 'transfer',
  items: [
    { type: 'mcq', q: 'What is the <b>European Economic Area</b> (EEA)?', opts: ['An area in which goods and services can be traded freely, formed by the EU countries with Norway and Iceland', 'A data centre in Ireland', 'A law in Singapore', 'A type of copyright licence'], why: 'It was formed in 1993.' },
    { type: 'mcq', q: 'Why are international agreements about data important?', opts: ['So data transferred between countries receives adequate protection and organisations can act lawfully', 'So data can be sold to any country', 'So data never leaves a device', 'So users do not need passwords'], why: 'For example, the EU–US Privacy Shield Framework.' },
    { type: 'tf', q: 'If your data is stored in a country with no data protection laws, you may not be able to take action if your rights are abused.', a: true, why: 'Depending on the online services you use, your data could be stored anywhere.' },
  ],
});
