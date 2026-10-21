FD.add({
  id: 'copyright',
  title: 'Copyright',
  tab: 'Copyright',
  icon: 'copyright',
  color: '--c3',
  section: true,
  interactive: true,
  vocab: [
    ['Copyright', 'A legal power that provides the creator of an original work with the sole authority to use and distribute it.'],
    ['Legislation', 'A law or set of laws.'],
    ['Sole', 'Not shared with anyone else.'],
    ['Creative Commons licence', 'A free licence that lets owners distribute their work freely but still say how it can be used, shared and altered.'],
  ],
  mount(el) {
    el.innerHTML = `
      <div class="sim cr-s">
        <div class="ptabs" role="group" aria-label="Simulations">
          <button data-p="own">© Who owns it?</button><button data-p="buy">🛒 Paid licence</button><button data-p="cc">🅭 Creative Commons</button>
        </div>

        <div data-panel="own" class="sim">
          <div class="cr-row">
            <div class="cr-work" id="work"><span class="cr-art">🎵</span><b>“Sunrise”</b><small>an original song by Lena</small><span class="cr-c" id="cmark">©</span></div>
            <div class="cr-use">
              <button class="btn" id="bDown">⬇️ Download it from a sharing site without permission</button>
              <div class="seg" id="law"><button data-v="law">Country with copyright laws</button><button data-v="agree">Country in an international agreement</button><button data-v="none">Country with no agreement</button></div>
              <p class="verdict" id="oMsg"></p>
            </div>
          </div>
        </div>

        <div data-panel="buy" class="sim" hidden>
          <div class="two-col">
            <div class="win"><div class="win-bar"><span class="url">🔒 tunestore.example</span></div>
              <div class="win-body"><div class="cr-shop"><span class="cr-art">🎵</span><div><b>Sunrise</b><small>Lena · 3:41</small></div><button class="btn primary" id="bBuy">Buy £0.99</button></div>
              <p class="note">Copyright owners can distribute their work under licences that users must <b>pay for</b>, like a music track or an app from an online store.</p></div></div>
            <div class="sim-box"><h5 class="mw-h">🎧 My library</h5>
              <div class="cr-acts">
                <button class="btn" data-a="play" disabled>▶️ Play it on my phone</button>
                <button class="btn" data-a="share" disabled>📤 Send copies to 20 friends</button>
                <button class="btn" data-a="sell" disabled>💷 Sell it on my website</button>
              </div>
              <p class="verdict" id="bMsg"></p></div>
          </div>
        </div>

        <div data-panel="cc" class="sim" hidden>
          <div class="two-col">
            <div class="sim-box"><h5 class="mw-h">Lena chooses a free licence for her photo 📷</h5>
              <p class="note">🅭 <b>Attribution (BY)</b> is always included: people must credit Lena.</p>
              <p class="cr-qq">Allow people to use it to make money?</p>
              <div class="seg" id="qNC"><button data-v="yes">Yes</button><button data-v="no">No (NC)</button></div>
              <p class="cr-qq">Allow people to change it?</p>
              <div class="seg" id="qND"><button data-v="yes">Yes</button><button data-v="sa">Yes, if they share alike (SA)</button><button data-v="no">No (ND)</button></div>
            </div>
            <div class="sim-box cr-lic"><p class="kick">Creative Commons licence</p><h4 id="ccName">CC BY</h4>
              <ul class="cr-can" id="can"></ul></div>
          </div>
        </div>
      </div>`;
    const root = el.querySelector('.cr-s'), $ = (s) => root.querySelector(s);
    const show = FD.panels(root);

    // ----- ownership -----
    let place = 'law';
    function setLaw(v) { place = v; FD.segSet($('#law'), v); }
    function download() {
      $('#oMsg').className = 'verdict ' + (place === 'none' ? '' : 'bad');
      $('#oMsg').innerHTML = place === 'none'
        ? 'The song is protected where Lena lives, but this country has no agreement with hers, so Lena may not be able to act here. That is why <b>international agreements</b> are increasingly important.'
        : '⚠️ Using someone else’s work without permission could result in the user facing <b>legal action</b> from the copyright owner.';
      FD.pulse($('#work'));
    }
    $('#law').addEventListener('click', (e) => { const b = e.target.closest('[data-v]'); if (b) { setLaw(b.dataset.v); $('#oMsg').innerHTML = ''; } });
    $('#bDown').addEventListener('click', download);
    function mark(on) { $('#cmark').classList.toggle('on', on); }

    // ----- paid licence -----
    let bought = false;
    function buy() { bought = true; root.querySelectorAll('[data-a]').forEach((b) => { b.disabled = false; }); $('#bBuy').textContent = '✓ Bought'; $('#bBuy').disabled = true; $('#bMsg').className = 'verdict'; $('#bMsg').innerHTML = 'You paid for a licence. What does it let you do?'; }
    function act(k) {
      if (!bought) return;
      root.querySelectorAll('[data-a]').forEach((b) => b.classList.toggle('on', b.dataset.a === k));
      const ok = k === 'play';
      $('#bMsg').className = 'verdict ' + (ok ? 'good' : 'bad');
      $('#bMsg').innerHTML = ok ? '✓ You paid for the <b>right to use</b> the song.' : '✗ Paying does not usually include the <b>right to distribute</b> the work to others.';
    }
    $('#bBuy').addEventListener('click', buy);
    root.querySelectorAll('[data-a]').forEach((b) => b.addEventListener('click', () => act(b.dataset.a)));

    // ----- Creative Commons -----
    let nc = 'yes', nd = 'yes';
    function cc(a, b) {
      if (a) nc = a; if (b) nd = b;
      FD.segSet($('#qNC'), nc); FD.segSet($('#qND'), nd);
      const name = 'CC BY' + (nc === 'no' ? '-NC' : '') + (nd === 'sa' ? '-SA' : nd === 'no' ? '-ND' : '');
      $('#ccName').textContent = name; FD.pulse($('#ccName'));
      const rows = [
        [true, 'Copy and share it, free of charge'],
        [true, 'Must credit Lena (attribution)'],
        [nc === 'yes', 'Use it to make money'],
        [nd !== 'no', 'Change it or use it in a new work' + (nd === 'sa' ? ', but the new work must use the same licence' : '')],
      ];
      $('#can').innerHTML = rows.map(([ok, t]) => `<li class="${ok ? 'ok' : 'no'}">${ok ? '✓' : '✗'} ${t}</li>`).join('');
    }
    $('#qNC').addEventListener('click', (e) => { const b = e.target.closest('[data-v]'); if (b) cc(b.dataset.v); });
    $('#qND').addEventListener('click', (e) => { const b = e.target.closest('[data-v]'); if (b) cc(null, b.dataset.v); });

    function reset() {
      setLaw('law'); mark(false); $('#oMsg').innerHTML = '';
      bought = false; $('#bBuy').textContent = 'Buy £0.99'; $('#bBuy').disabled = false; root.querySelectorAll('[data-a]').forEach((b) => { b.disabled = true; b.classList.remove('on'); }); $('#bMsg').innerHTML = '';
      cc('yes', 'yes');
    }
    show('own'); reset();
    return { show, setLaw, download, mark, buy, act, cc, reset, destroy() {} };
  },
  steps: [
    {
      title: 'What is copyright?',
      text: `<p><strong>Copyright</strong> is a legal power that provides the creator of an original work with the <b>sole</b> authority to use and distribute it.</p>
             <p>A <b>copyright notice</b> © can be used to inform users that work is protected by <strong>legislation</strong> (Figure 9.1).</p>`,
      async on(a, ctx) { a.show('own'); a.reset(); if (!(await ctx.sleep(900))) return; a.mark(true); },
    },
    {
      title: 'Laws in different countries',
      text: `<p>Individual countries have their own copyright laws, and individuals and organisations must obey the laws of the countries in which they operate.</p>
             <p>Some countries have <b>agreements</b> to stop a publisher stealing work from an author in one country and publishing it in another. Like data protection agreements, these are becoming more important as business becomes more international, partly thanks to the internet.</p>`,
      async on(a) { a.show('own'); a.mark(true); a.setLaw('none'); a.download(); },
    },
    {
      title: 'Downloading original work',
      text: `<p>When a user downloads original work such as <b>software, books, music, images or videos</b>, it may be protected by copyright.</p>
             <p>In a country with copyright laws, or one in an international agreement, using someone else’s work <b>without permission</b> could result in <b>legal action</b> from the copyright owner.</p>`,
      tip: 'Try it: change the country and download again.',
      async on(a, ctx) { a.show('own'); a.mark(true); a.setLaw('law'); a.download(); if (!(await ctx.sleep(1800))) return; a.setLaw('agree'); a.download(); },
    },
    {
      title: 'Paying for a licence',
      text: `<p>Copyright owners can distribute their works under licences that users <b>must pay for</b>, such as when buying a music track or an app from an online store.</p>
             <p>When a customer pays, they pay for the <b>right to use</b> the work, but this does not usually include the <b>right to distribute</b> it to others.</p>`,
      tip: 'Try it: buy the song, then try each action.',
      async on(a, ctx) { a.show('buy'); a.reset(); if (!(await ctx.sleep(800))) return; a.buy(); for (const k of ['play', 'share', 'sell']) { if (!(await ctx.sleep(1300))) return; a.act(k); } },
    },
    {
      title: 'Free licences',
      text: `<p>Owners can also choose <b>free licences</b>, such as <b>open source</b> or <strong>Creative Commons</strong> licences. These allow the owner to distribute their work without payment and say <b>how their work can be used</b>.</p>
             <p>Creative Commons licences protect the owner’s rights by specifying how the work can be used, shared and altered by other people.</p>`,
      tip: 'Try it: build Lena’s Creative Commons licence.',
      async on(a, ctx) { a.show('cc'); a.cc('yes', 'yes'); for (const [x, y] of [['no', 'yes'], ['no', 'sa'], ['no', 'no']]) { if (!(await ctx.sleep(1600))) return; a.cc(x, y); } },
    },
    {
      title: 'Permission',
      text: `<p>🔑 <b>Key point:</b> to protect owners’ rights, people must be sure they have the <b>permission</b> to download, use or distribute work.</p>
             <p>Free software licences have also made it cheaper to access technology, helping to narrow the <b>digital divide</b> and the information gap.</p>`,
      async on(a) { a.show('cc'); a.cc('yes', 'sa'); },
    },
  ],
});

FD.activities({
  section: 'copyright',
  items: [
    {
      id: 'copyright-cc',
      title: 'Creative Commons licences',
      task: '<ol><li>Research Creative Commons licences. You could do an internet search using the key terms ‘creative commons kiwi video’ to find the video <i>Creative Commons Kiwi</i>, which explains how the different licences work.</li><li>Create a poster that explains the different types of Creative Commons licences that are available.</li></ol>',
      fields: ['1. What I found out about the licences', '2. Plan for my poster (licences and symbols)'],
      sim: ['copyright', 'Try the licence builder again'],
    },
  ],
});

FD.check({
  section: 'copyright',
  items: [
    { type: 'mcq', q: 'What is <b>copyright</b>?', opts: ['A legal power that gives the creator of an original work the sole authority to use and distribute it', 'A free licence for all software', 'A way to store data in other countries', 'A device that interrupts an electrical current'], why: '<b>Sole</b> means not shared with anyone else.' },
    { type: 'multi', q: 'Which types of digital information can be protected by copyright? Choose <b>three</b>.', need: 3, opts: [['Music', true], ['Software', true], ['Videos', true], ['A trip hazard', false], ['An IP address', false]], why: 'Also books and images (chapter question 4).' },
    { type: 'mcq', q: 'You buy a song from an online store. What have you usually paid for?', opts: ['The right to use it', 'The right to distribute it to others', 'The copyright of the song', 'The right to sell it'], why: 'Paying does not usually include the right to distribute.' },
    { type: 'mcq', q: 'What do <b>Creative Commons</b> licences let owners do?', opts: ['Distribute their work freely but say how it can be used, shared and altered', 'Charge a fee for every copy', 'Block users in other countries', 'Stop all copying of their work'], why: 'They still protect the owner’s rights.' },
  ],
});
