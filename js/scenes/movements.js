FD.add({
  id: 'movements',
  title: 'Monitoring movements',
  tab: 'Movements',
  icon: 'movements',
  color: '--c9',
  section: true,
  interactive: true,
  vocab: [
    ['Controversial', 'Likely to provoke public disagreement.'],
    ['Closed circuit television (CCTV)', 'A system of cameras placed in public buildings or in the street that are used to help prevent crime.'],
    ['ANPR', 'Automatic number plate recognition: cameras used by law enforcement agencies such as the police.'],
    ['GPS', 'Global Positioning System: satellites that let a device work out its location.'],
  ],
  mount(el) {
    // Places on Sam's route: [key, x, y, emoji, method, log text]
    const M = [
      ['gps', 60, 190, '🏠', '📍 GPS tracker on Sam’s bag', '07:58 · GPS tracker: Sam leaves home'],
      ['card', 170, 120, '🚌', '🎫 Travel card', '08:05 · Travel card tapped on bus 12'],
      ['anpr', 290, 190, '🚗', '🚔 ANPR camera', '08:14 · ANPR camera: Sam’s parents’ car, plate AB12 CDE'],
      ['cctv', 380, 90, '🛍️', '📹 CCTV with facial recognition', '08:22 · CCTV: face matched to Sam at the shopping centre'],
      ['bank', 470, 170, '☕', '💳 Bank card payment', '08:26 · Bank card used at a café'],
      ['ip', 560, 100, '🏫', '📶 IP / MAC address on the school Wi-Fi', '08:31 · Sam’s phone (MAC 3C:22:FB:…) joins the school network'],
      ['app', 560, 100, '📱', '👫 Friend finder app (GPS)', '08:32 · Friend finder: Sam’s location shared with 3 friends'],
    ];
    const PATH = [[60, 190], [170, 120], [290, 190], [380, 90], [470, 170], [560, 100]];
    el.innerHTML = `
      <div class="sim mv-s">
        <div class="ptabs" role="group" aria-label="Simulations">
          <button data-p="trail">🗺️ Sam’s data trail</button><button data-p="weigh">⚖️ Benefits and drawbacks</button>
        </div>

        <div data-panel="trail" class="sim">
          <div class="mv-grid">
            <div class="sim-box">
              <svg viewBox="0 0 620 240" class="mv-map" role="img" aria-label="A town map with Sam’s route">
                <path class="mv-road" d="M60 190 L170 120 L290 190 L380 90 L470 170 L560 100"/>
                ${M.slice(0, 6).map(([k, x, y, e]) => `<g class="mv-pl" data-k="${k}"><circle cx="${x}" cy="${y}" r="24"/><text class="emo" x="${x}" y="${y + 1}" font-size="24">${e}</text></g>`).join('')}
                <g id="sam"><circle r="13" class="mv-sam"/><text class="emo" y="1" font-size="15">🧒</text></g>
              </svg>
              <div class="ctrls"><button class="btn primary" id="go">▶ Walk to school</button><label class="tgl"><input type="checkbox" id="consent" checked> Sam gave consent to share location in the friend finder app</label></div>
            </div>
            <div class="sim-box mv-logbox"><h5 class="mw-h">🗂️ Records about Sam</h5><ol class="mv-log" id="log"></ol></div>
          </div>
        </div>

        <div data-panel="weigh" class="sim" hidden>
          <div class="two-col">
            <div class="sim-box mv-col good"><h5 class="mw-h">✓ Benefits</h5><ul id="ben"></ul></div>
            <div class="sim-box mv-col bad"><h5 class="mw-h">✗ Drawbacks</h5><ul id="dra"></ul></div>
          </div>
          <div class="mv-scale"><span id="bN">0</span><i id="beam"></i><span id="dN">0</span></div>
        </div>
      </div>`;
    const root = el.querySelector('.mv-s'), $ = (s) => root.querySelector(s);
    const show = FD.panels(root);
    let dead = false, gen = 0;
    const sam = $('#sam');
    const place = (x, y) => sam.setAttribute('transform', `translate(${x} ${y - 30})`);

    function log(i) {
      const m = M[i];
      if (m[0] === 'app' && !$('#consent').checked) { $('#log').appendChild(FD.h('<li class="new mv-no">08:32 · Friend finder: no consent, so the location is <b>not</b> shared</li>')); return; }
      $('#log').appendChild(FD.h(`<li class="new"><b>${m[4]}</b><span>${m[5]}</span></li>`));
      const pl = root.querySelector(`.mv-pl[data-k="${m[0]}"]`);
      if (pl) { pl.classList.add('hit'); }
      $('#log').scrollTop = 1e4;
    }
    async function walk() {
      const g = ++gen;
      clearTrail();
      for (let i = 0; i < PATH.length; i++) {
        if (i > 0) {
          const a = PATH[i - 1], b = PATH[i];
          await FD.tween(700, (t) => { if (g === gen && !dead) place(a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t); });
        }
        if (dead || g !== gen) return;
        log(i);
        if (i === PATH.length - 1) { await FD.wait(500); if (dead || g !== gen) return; log(6); }
        await FD.wait(350);
      }
    }
    function clearTrail() { $('#log').innerHTML = ''; root.querySelectorAll('.mv-pl').forEach((p) => p.classList.remove('hit')); place(...PATH[0]); }
    $('#go').addEventListener('click', walk);
    function consent(on) { $('#consent').checked = on; }

    const BEN = ['Find people who are lost, especially young children', 'Locate nearby friends to arrange to meet socially', 'Identify people on networks', 'Identify and locate potential criminals at events, e.g. violent fans at sporting events', 'Keep travellers safe, e.g. checking for potential criminals at airports', 'Verify individuals for financial transactions to reduce financial crime'];
    const DRA = ['Compromising people’s privacy', 'The expense of setting up, monitoring and maintaining systems', 'The energy consumption of the systems and the effect on the environment', 'Making people feel as though they are not trusted'];
    let nb = 0, nd = 0;
    function weigh(b, d) {
      nb = b; nd = d;
      $('#ben').innerHTML = BEN.slice(0, b).map((t) => `<li class="new">${t}</li>`).join('');
      $('#dra').innerHTML = DRA.slice(0, d).map((t) => `<li class="new">${t}</li>`).join('');
      $('#bN').textContent = b; $('#dN').textContent = d;
      $('#beam').style.transform = `rotate(${FD.clamp((d - b) * 4, -16, 16)}deg)`;
    }
    root.querySelector('[data-panel="weigh"]').addEventListener('click', (e) => {
      if (e.target.closest('.mv-col.good')) weigh(Math.min(BEN.length, nb + 1), nd);
      else if (e.target.closest('.mv-col.bad')) weigh(nb, Math.min(DRA.length, nd + 1));
    });

    function reset() { gen++; consent(true); clearTrail(); weigh(0, 0); }
    show('trail'); reset();
    return { show, walk, consent, weigh, reset, destroy() { dead = true; } };
  },
  steps: [
    {
      title: 'Monitoring is controversial',
      text: `<p>Digital technologies can be used to <b>monitor individuals</b>. This can have benefits, but it can also have significant drawbacks and is considered <strong>controversial</strong>.</p>
             <p>🔑 It is controversial because it affects people’s <b>right to privacy</b>.</p>`,
      tip: 'Try it: press “Walk to school” and watch the records grow.',
      async on(a) { a.show('trail'); a.reset(); },
    },
    {
      title: 'Cameras',
      text: `<p>Individuals’ movements can be monitored using:</p>
             <ul><li><strong>closed circuit television</strong> (CCTV), which sometimes uses <b>facial recognition</b> software</li>
             <li><b>automatic number plate recognition</b> (ANPR) cameras used by law enforcement agencies such as the police.</li></ul>`,
      async on(a) { a.show('trail'); await a.walk(); },
    },
    {
      title: 'Cards, addresses and GPS',
      text: `<p>Movements can also be monitored by:</p>
             <ul><li>the use of <b>identification cards, travel cards, passports</b> at borders and <b>bank card</b> transactions</li>
             <li>identifying devices on networks by their <b>IP or MAC address</b></li>
             <li><b>GPS</b> data shared by apps such as <b>friend finder</b> apps</li>
             <li>GPS trackers attached to items of clothing such as belts.</li></ul>`,
      tip: 'Try it: untick consent and walk again. Users usually have to give consent before an app shares their location (Figure 9.4).',
      async on(a) { a.show('trail'); a.consent(false); await a.walk(); },
    },
    {
      title: 'Benefits',
      text: `<p>Benefits of monitoring individuals’ movements include being able to:</p>
             <ul><li>find people who are lost, especially young children</li><li>locate nearby friends to meet socially</li><li>identify people on networks</li><li>identify and locate potential criminals at events</li><li>keep travellers safe, e.g. at airports</li><li>verify individuals for financial transactions to reduce financial crime.</li></ul>`,
      tip: 'Try it: tap each column to add the next point.',
      async on(a, ctx) { a.show('weigh'); a.weigh(0, 0); for (let i = 1; i <= 6; i++) { a.weigh(i, 0); if (!(await ctx.sleep(600))) return; } },
    },
    {
      title: 'Drawbacks',
      text: `<p>There are also drawbacks, such as:</p>
             <ul><li>compromising people’s <b>privacy</b></li><li>the <b>expense</b> of setting up, monitoring and maintaining systems</li><li>the <b>energy consumption</b> of the systems and the effect on the environment</li><li>making people feel as though they are <b>not trusted</b>.</li></ul>`,
      async on(a, ctx) { a.show('weigh'); for (let i = 1; i <= 4; i++) { a.weigh(6, i); if (!(await ctx.sleep(700))) return; } },
    },
  ],
});

FD.activities({
  section: 'movements',
  items: [
    {
      id: 'movements-clothing',
      title: 'Anti surveillance clothing',
      task: '<p>Some companies produce clothing that is designed to fool facial recognition systems. Clothing patterns can contain features that the software interprets as a face. This overloads the system with data, so it is less likely to recognise the actual face of the person wearing the clothing (Figure 9.3).</p><ol><li>Investigate how facial recognition software recognises points on a person’s face.</li><li>Search ‘Anti surveillance clothing revealed’ and find out how some clothing is designed to confuse facial recognition technology.</li><li>Investigate how some CCTV cameras use infra-red light to capture footage in low light or no light areas.</li><li>Search ‘Anti surveillance eyewear infrared’ and find out how some eyewear reflects the infra-red light used by CCTV cameras.</li></ol>',
      fields: ['1. Points on a face', '2. Anti surveillance clothing', '3. Infra-red CCTV', '4. Anti surveillance eyewear'],
    },
    {
      id: 'movements-location',
      title: 'Monitoring people’s location',
      task: '<p>Research the number of children that were reported missing in your country last year. Discuss whether you think it is right for parents to track their children’s location. Can you explain your reasons?</p>',
      fields: ['What I found out', 'My opinion and reasons'],
      hint: 'Some parents use locator devices that clip onto clothing or bags and send an alert if the child goes outside a pre-set range.',
    },
  ],
});

FD.check({
  section: 'movements',
  items: [
    { type: 'multi', q: 'Which can be used to monitor an individual’s movements? Choose <b>three</b>.', need: 3, opts: [['CCTV with facial recognition', true], ['ANPR cameras', true], ['GPS data from a friend finder app', true], ['A residual current device', false], ['A Creative Commons licence', false]], why: 'Also cards, passports, IP and MAC addresses and GPS trackers.' },
    { type: 'sort', q: 'Benefit or drawback of monitoring movements?', bins: ['Benefit', 'Drawback'], rows: [['Finding lost young children', 0], ['Compromising people’s privacy', 1], ['Keeping travellers safe at airports', 0], ['Making people feel they are not trusted', 1], ['The energy used by the systems', 1]], why: 'Monitoring is controversial because it has both.' },
    { type: 'mcq', q: 'Why should users be able to give consent before an app shares their location?', opts: ['Sharing location affects their privacy and safety, so they should decide who can see it', 'It makes the app run faster', 'It is needed for copyright', 'It reduces glare on the screen'], why: 'Chapter question 3.' },
  ],
});
