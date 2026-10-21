FD.add({
  id: 'sustain',
  title: 'Sustainability issues',
  tab: 'Sustainability',
  icon: 'sustain',
  color: '--c7',
  section: true,
  interactive: true,
  vocab: [
    ['Ecology', 'The biological science that looks at the way in which organisms interact with each other and their environment.'],
    ['Sustainability', 'Not using up natural resources until they run out; maintaining the balance of nature.'],
    ['Mitigate', 'Reduce the severity of a problem.'],
    ['Renewable energy', 'A source of energy that will not run out when it is used, such as wind power or solar power.'],
    ['Non-renewable energy', 'A source of energy that cannot be replaced once it has been used, such as coal or gas.'],
    ['Energy-efficient', 'Using as little energy as possible.'],
    ['Hydroelectric', 'Using water power to produce electricity.'],
  ],
  mount(el) {
    el.innerHTML = `
      <div class="sim su-s">
        <div class="ptabs" role="group" aria-label="Simulations">
          <button data-p="dc">🏭 Build a data centre</button><button data-p="waste">🗑️ Throwing devices away</button><button data-p="tbl">📋 Table 9.1</button>
        </div>

        <div data-panel="dc" class="sim">
          <div class="su-grid">
            <div class="sim-box su-opts">
              <p class="cr-qq">⚡ Power source</p><div class="seg" id="pw"><button data-v="coal">🏭 Coal / gas</button><button data-v="wind">🌬️ Wind / solar</button><button data-v="hydro">💧 Hydro-electric (next to a river)</button></div>
              <p class="cr-qq">📍 Location</p><div class="seg" id="loc"><button data-v="hot">☀️ Hot city</button><button data-v="cold">❄️ Cold climate</button></div>
              <p class="cr-qq">🖥️ Servers</p><div class="seg" id="srv"><button data-v="old">Old</button><button data-v="eff">Energy-efficient</button></div>
            </div>
            <div class="sim-box su-dc">
              <svg viewBox="0 0 300 170" class="su-pic" role="img" aria-label="Data centre">
                <rect class="su-sky" id="sky" x="0" y="0" width="300" height="170" rx="12"/>
                <text class="emo" id="sun" x="262" y="30" font-size="24">☀️</text>
                <rect class="su-bld" x="70" y="70" width="150" height="80" rx="6"/>
                ${[0, 1, 2, 3, 4].map((i) => `<rect class="su-rack" x="${84 + i * 27}" y="84" width="18" height="52" rx="2"/>`).join('')}
                <text class="emo" id="ac" x="236" y="96" font-size="22">🌀</text>
                <text class="emo" id="src" x="34" y="120" font-size="30">🏭</text>
                <g id="smoke"><circle class="su-smoke" cx="34" cy="86" r="8"/><circle class="su-smoke" cx="42" cy="70" r="10"/><circle class="su-smoke" cx="36" cy="52" r="12"/></g>
              </svg>
              <div class="su-meters">
                <label>Energy used<div class="rm-meter"><i id="mE"></i></div></label>
                <label>From non-renewable sources<div class="rm-meter"><i id="mN"></i></div></label>
              </div>
              <p class="verdict" id="sMsg"></p>
            </div>
          </div>
        </div>

        <div data-panel="waste" class="sim" hidden>
          <div class="su-path">
            <div class="mini" id="w0"><h5>📱 Old phone</h5><p>Contains poisonous substances such as <b>bromine, mercury and chlorine</b>.</p></div>
            <div class="su-fork">
              <button class="btn" id="bBin">🗑️ Throw it in the bin</button>
              <button class="btn" id="bRec">♻️ Take it to an e-waste recycling scheme</button>
            </div>
            <div class="mini" id="wOut"><h5 id="wH">…</h5><p id="wP">Choose what to do with the phone.</p></div>
          </div>
          <ul class="su-mit" id="mit"></ul>
        </div>

        <div data-panel="tbl" class="sim" hidden>
          <div class="tbl-wrap"><table class="tbl su-tbl"><thead><tr><th>Cause</th><th>Sustainability issue</th><th>Mitigation</th></tr></thead><tbody>
            <tr data-r="0"><th>Power requirements of digital devices</th><td>The power is produced using <b>non-renewable energies</b>, which reduce the planet’s natural resources</td><td>• Using <b>renewable energies</b><br>• Using more <b>energy-efficient</b> devices<br>• Building data centres next to rivers to use natural <b>hydro-electric</b> power</td></tr>
            <tr data-r="1"><th>Power requirements of cooling systems in data centres</th><td>Cooling systems use a lot of power, produced using non-renewable fuel sources, which reduces natural resources</td><td>Building data centres in <b>cold climates</b> to reduce the need to artificially cool the rooms using air conditioners, which use a lot of energy</td></tr>
            <tr data-r="2"><th>Use of poisonous substances such as bromine, mercury and chlorine in digital devices</th><td>When devices are thrown away, these chemicals leak out and can cause health risks to people’s cardiovascular and central nervous systems and to wildlife; they may also cause cancer and lung disease</td><td>• Education<br>• Recycling schemes<br>• Laws, such as the EU’s Waste Electrical and Electronic Equipment Directive<br>• Using harmless alternative materials for components</td></tr>
          </tbody></table></div>
        </div>
      </div>`;
    const root = el.querySelector('.su-s'), $ = (s) => root.querySelector(s);
    const show = FD.panels(root);
    let o = { pw: 'coal', loc: 'hot', srv: 'old' };

    function build(ch = {}) {
      o = { ...o, ...ch };
      ['pw', 'loc', 'srv'].forEach((k) => FD.segSet($('#' + k), o[k]));
      const cool = o.loc === 'hot' ? 45 : 12, run = o.srv === 'old' ? 55 : 33;
      const energy = run + cool, nonren = o.pw === 'coal' ? 100 : 8;
      $('#mE').style.width = Math.min(100, energy) + '%'; $('#mE').classList.toggle('bad', energy > 70);
      $('#mN').style.width = nonren + '%'; $('#mN').classList.toggle('bad', nonren > 50);
      $('#src').textContent = { coal: '🏭', wind: '🌬️', hydro: '💧' }[o.pw];
      $('#smoke').style.opacity = o.pw === 'coal' ? 1 : 0;
      $('#sun').textContent = o.loc === 'hot' ? '☀️' : '❄️';
      $('#sky').classList.toggle('cold', o.loc === 'cold');
      $('#ac').style.opacity = o.loc === 'hot' ? 1 : 0.15;
      root.querySelectorAll('.su-rack').forEach((r) => r.classList.toggle('eff', o.srv === 'eff'));
      const good = o.pw !== 'coal' && o.loc === 'cold' && o.srv === 'eff';
      $('#sMsg').className = 'verdict ' + (good ? 'good' : o.pw === 'coal' ? 'bad' : '');
      $('#sMsg').innerHTML = good
        ? '✓ Renewable power, energy-efficient servers and natural cooling: the effects are mitigated.'
        : [o.pw === 'coal' ? 'Coal and gas are <b>non-renewable</b>: they reduce the planet’s natural resources.' : '✓ Renewable power.',
          o.loc === 'hot' ? 'Air conditioners for cooling use a lot of energy.' : '✓ The cold climate cools the rooms.',
          o.srv === 'old' ? 'Old servers waste energy.' : '✓ Energy-efficient servers.'].join(' ');
    }
    ['pw', 'loc', 'srv'].forEach((k) => $('#' + k).addEventListener('click', (e) => { const b = e.target.closest('[data-v]'); if (b) build({ [k]: b.dataset.v }); }));

    const MIT = ['🎓 Education', '♻️ Recycling schemes', '📜 Laws, such as the EU’s Waste Electrical and Electronic Equipment (WEEE) Directive', '🧪 Using harmless alternative materials for components'];
    function waste(k) {
      $('#bBin').classList.toggle('on', k === 'bin'); $('#bRec').classList.toggle('on', k === 'rec');
      $('#wOut').className = 'mini ' + (k === 'bin' ? 'su-bad' : k === 'rec' ? 'su-good' : '');
      $('#wH').textContent = k === 'bin' ? '☠️ Landfill' : k === 'rec' ? '♻️ Recycled' : '…';
      $('#wP').innerHTML = k === 'bin'
        ? 'The chemicals leak out and can cause health risks to people’s <b>cardiovascular and central nervous systems</b> and to <b>wildlife</b>. They may also cause <b>cancer and lung disease</b>.'
        : k === 'rec' ? 'The materials are recovered safely and the poisonous substances do not leak into the environment.' : 'Choose what to do with the phone.';
      $('#mit').innerHTML = k ? MIT.map((m, i) => `<li class="new" style="animation-delay:${i * 120}ms">${m}</li>`).join('') : '';
    }
    $('#bBin').addEventListener('click', () => waste('bin'));
    $('#bRec').addEventListener('click', () => waste('rec'));

    function row(i) { root.querySelectorAll('.su-tbl tr[data-r]').forEach((r) => r.classList.toggle('hot', +r.dataset.r === i)); }
    root.querySelectorAll('.su-tbl tr[data-r]').forEach((r) => r.addEventListener('click', () => row(+r.dataset.r)));

    function reset() { build({ pw: 'coal', loc: 'hot', srv: 'old' }); waste(''); row(-1); }
    show('dc'); reset();
    return { show, build, waste, row, reset, destroy() {} };
  },
  steps: [
    {
      title: 'ICT and the environment',
      text: `<p>The use of ICT can negatively affect the environment. For example, it can use up <b>natural resources</b> and contribute to long-term harm to the <strong>ecology</strong> of the planet.</p>
             <p>Table 9.1 shows three ways in which ICT can cause <strong>sustainability</strong> issues and how the effects can be <strong>mitigated</strong> (reduced).</p>`,
      tip: 'Try it: build the most sustainable data centre you can.',
      async on(a) { a.show('dc'); a.reset(); },
    },
    {
      title: 'Power for digital devices',
      text: `<p>The power for digital devices is often produced using <strong>non-renewable energies</strong> (such as coal or gas), which reduce the planet’s natural resources.</p>
             <p><b>Mitigation:</b> use <strong>renewable energies</strong> (such as wind or solar), more <strong>energy-efficient</strong> devices, and build data centres next to rivers to use natural <strong>hydro-electric</strong> power.</p>`,
      async on(a, ctx) { a.show('dc'); a.build({ pw: 'coal', loc: 'hot', srv: 'old' }); for (const c of [{ pw: 'wind' }, { pw: 'hydro' }, { srv: 'eff' }]) { if (!(await ctx.sleep(1400))) return; a.build(c); } },
    },
    {
      title: 'Cooling data centres',
      text: `<p><b>Cooling systems</b> in data centres use a lot of power, produced using non-renewable fuel sources.</p>
             <p><b>Mitigation:</b> build data centres in <b>cold climates</b> to reduce the need for air conditioners. Facebook built a data centre in northern Sweden so it is cooled by the cold climate (Figure 9.6).</p>`,
      tip: '💡 Did you know? The world’s biggest data centre uses over 386 million litres of cooling fluid per year. Google uses recycled canal water and seawater to cool its data centres in Belgium and Finland.',
      async on(a, ctx) { a.show('dc'); a.build({ pw: 'hydro', srv: 'eff', loc: 'hot' }); if (!(await ctx.sleep(1500))) return; a.build({ loc: 'cold' }); },
    },
    {
      title: 'Poisonous substances',
      text: `<p>Digital devices contain poisonous substances such as <b>bromine, mercury and chlorine</b>. When devices are thrown away, these chemicals leak out and can cause health risks to people and wildlife.</p>
             <p><b>Mitigation:</b> education, recycling schemes, laws such as the EU’s <b>Waste Electrical and Electronic Equipment Directive</b>, and harmless alternative materials for components.</p>`,
      tip: 'Try it: throw the phone away, then recycle it.',
      async on(a, ctx) { a.show('waste'); a.waste('bin'); if (!(await ctx.sleep(2500))) return; a.waste('rec'); },
    },
    {
      title: 'Table 9.1 in summary',
      text: `<p>Learn the three rows of Table 9.1: <b>cause → sustainability issue → mitigation</b>.</p>
             <p>For more about the sustainability implications of digital technologies, see Unit 1 <i>Digital devices</i> (page 20).</p>`,
      tip: 'Tap a row to highlight it.',
      async on(a, ctx) { a.show('tbl'); for (const i of [0, 1, 2]) { a.row(i); if (!(await ctx.sleep(1500))) return; } },
    },
  ],
});

FD.activities({
  section: 'sustain',
  items: [
    {
      id: 'sustain-impact',
      title: 'Reducing the environmental impact',
      task: '<p>There are 62 different types of metals used in the average smartphone. In 2013, academics at Yale University tried to identify possible replacements for these metals to reduce the environmental impact of manufacturing smartphones. They concluded that 12 of these materials could not be replaced by any other substances.</p><ol><li>Investigate some of the metals used inside smartphones.</li><li>Search ‘Singapore NEA e-waste recycling’ to find out about Singapore’s guidance on recycling digital devices.</li><li>Does your country have an e-waste recycling system? What guidance on e-waste recycling is provided by your government?</li></ol>',
      fields: ['1. Metals inside smartphones', '2. Singapore’s guidance', '3. E-waste recycling in my country'],
    },
  ],
});

FD.check({
  section: 'sustain',
  items: [
    { type: 'sort', q: 'Match each cause to a mitigation from Table 9.1.', bins: ['Renewable energy / efficient devices', 'Cold climates', 'Recycling / WEEE laws'], rows: [['Power requirements of digital devices', 0], ['Power for cooling systems in data centres', 1], ['Poisonous substances in devices', 2]], why: 'See Table 9.1.' },
    { type: 'mcq', q: 'Which is a <b>renewable</b> energy source?', opts: ['Wind power', 'Coal', 'Gas', 'Oil'], why: 'Renewable energy will not run out when it is used.' },
    { type: 'multi', q: 'Which poisonous substances in digital devices are named in the book? Choose <b>three</b>.', need: 3, opts: [['Bromine', true], ['Mercury', true], ['Chlorine', true], ['Oxygen', false], ['Silicon dioxide sand', false]], why: 'They can leak out when devices are thrown away.' },
    { type: 'mcq', q: 'Why are some data centres built in cold climates?', opts: ['To reduce the need for air conditioners, which use a lot of energy', 'Because servers work only in the snow', 'To be closer to customers', 'To avoid copyright laws'], why: 'E.g. Facebook’s data centre in northern Sweden (Figure 9.6).' },
  ],
});
