FD.add({
  id: 'start',
  title: 'Start here',
  tab: 'Start',
  icon: 'start',
  color: '--accent',
  page: true,
  mount(el) {
    const S = FD.state;
    const part = (p) => `
      <section class="card st-part">
        <h3>Part ${p} · ${FD.PARTS[p].name} <small>${FD.PARTS[p].pages}</small></h3>
        <ul class="st-list">${FD.SECTIONS.filter((s) => s.part === p).map((s) => `
          <li><button data-go="${s.id}" style="--c:var(${s.color})">${FD.icon[s.id]}<span><b>${FD.SECTIONS.indexOf(s) + 1}. ${s.name}</b><small>${s.line}</small></span>${FD.state.checks['check-' + s.id] ? '<span class="st-done" title="Check done">✓</span>' : ''}</button></li>`).join('')}
          <li><button data-go="test${p}" style="--c:var(--red-ui)">${FD.icon.final}<span><b>Test Part ${p}</b><small>Multiple choice + exam-style questions</small></span>${S.tests['test' + p] && S.tests['test' + p].done ? '<span class="st-done">✓</span>' : ''}</button></li>
        </ul>
      </section>`;
    el.innerHTML = `
      <section class="card st-hero">
        <div>
          <p class="kick">Unit 3 · Operating online · Chapter 9 · Pearson Edexcel International GCSE ICT</p>
          <h2>Implications of digital technologies</h2>
          <p>Digital technologies are incredibly powerful tools. How we use them decides whether they help to build a better society. In this lesson you will explore <b>data protection</b> and <b>copyright</b>, how people’s <b>movements and communications can be monitored</b>, the effect of ICT on the <b>environment</b>, the <b>health and safety</b> risks of using devices and the decisions now made by <b>artificial intelligence</b>.</p>
          <div class="who">
            <label>Your name<input id="sName" autocomplete="name" placeholder="First name and surname" value="${FD.esc(S.name)}"></label>
            <label>Class<input id="sClass" placeholder="e.g. 10B" value="${FD.esc(S.cls)}"></label>
          </div>
          <p class="small" id="sMsg">Your name goes on the results you send to your teacher.</p>
          <div class="chk-btns">
            <button class="btn primary" id="sGo">${S.last && S.last !== 'start' ? '▶ Continue where I left off' : '▶ Start Part A'}</button>
            <button class="btn ghost" id="sProg" style="color:#fff;border-color:rgb(255 255 255 / .4)">${FD.icon.progress} My progress</button>
          </div>
        </div>
        <svg class="st-net st-flow" viewBox="0 0 420 230" role="img" aria-label="Nine implications of digital technologies">
          <g><rect class="nd" x="10" y="8" width="127" height="60" rx="10"><animate attributeName="fill" values="rgb(255 255 255 / .07);rgb(246 201 76 / .35);rgb(255 255 255 / .07)" dur="9s" begin="0s" repeatCount="indefinite"/></rect><text x="73.5" y="44">🛡️ Data protection</text></g>
          <g><rect class="nd" x="147" y="8" width="127" height="60" rx="10"><animate attributeName="fill" values="rgb(255 255 255 / .07);rgb(246 201 76 / .35);rgb(255 255 255 / .07)" dur="9s" begin="1s" repeatCount="indefinite"/></rect><text x="210.5" y="44">🌍 Across borders</text></g>
          <g><rect class="nd" x="284" y="8" width="127" height="60" rx="10"><animate attributeName="fill" values="rgb(255 255 255 / .07);rgb(246 201 76 / .35);rgb(255 255 255 / .07)" dur="9s" begin="2s" repeatCount="indefinite"/></rect><text x="347.5" y="44">©️ Copyright</text></g>
          <g><rect class="nd" x="10" y="80" width="127" height="60" rx="10"><animate attributeName="fill" values="rgb(255 255 255 / .07);rgb(246 201 76 / .35);rgb(255 255 255 / .07)" dur="9s" begin="3s" repeatCount="indefinite"/></rect><text x="73.5" y="116">📺 DRM & geoblocking</text></g>
          <g><rect class="nd" x="147" y="80" width="127" height="60" rx="10"><animate attributeName="fill" values="rgb(255 255 255 / .07);rgb(246 201 76 / .35);rgb(255 255 255 / .07)" dur="9s" begin="4s" repeatCount="indefinite"/></rect><text x="210.5" y="116">📹 Movements</text></g>
          <g><rect class="nd" x="284" y="80" width="127" height="60" rx="10"><animate attributeName="fill" values="rgb(255 255 255 / .07);rgb(246 201 76 / .35);rgb(255 255 255 / .07)" dur="9s" begin="5s" repeatCount="indefinite"/></rect><text x="347.5" y="116">💬 Communications</text></g>
          <g><rect class="nd" x="10" y="152" width="127" height="60" rx="10"><animate attributeName="fill" values="rgb(255 255 255 / .07);rgb(246 201 76 / .35);rgb(255 255 255 / .07)" dur="9s" begin="6s" repeatCount="indefinite"/></rect><text x="73.5" y="188">🌱 Sustainability</text></g>
          <g><rect class="nd" x="147" y="152" width="127" height="60" rx="10"><animate attributeName="fill" values="rgb(255 255 255 / .07);rgb(246 201 76 / .35);rgb(255 255 255 / .07)" dur="9s" begin="7s" repeatCount="indefinite"/></rect><text x="210.5" y="188">⛑️ Health & safety</text></g>
          <g><rect class="nd" x="284" y="152" width="127" height="60" rx="10"><animate attributeName="fill" values="rgb(255 255 255 / .07);rgb(246 201 76 / .35);rgb(255 255 255 / .07)" dur="9s" begin="8s" repeatCount="indefinite"/></rect><text x="347.5" y="188">🚗 AI decisions</text></g>
        </svg>
      </section>

      <section class="card">
        <h3>How to use this website on your own</h3>
        ${FD.HOWTO}
      </section>

      <div class="st-cols">${part('A')}${part('B')}</div>
      <p class="small muted">Your progress is saved in this browser only. Nothing is sent to the internet. People, companies and places in the simulations are made up, and the simulations are simplified so you can see how each idea works.</p>`;
    const $ = (s) => el.querySelector(s);
    $('#sName').addEventListener('input', (e) => { FD.state.name = e.target.value; FD.save(); });
    $('#sClass').addEventListener('input', (e) => { FD.state.cls = e.target.value; FD.save(); });
    $('#sGo').addEventListener('click', () => {
      if (FD.state.last && FD.state.last !== 'start') FD.goto(FD.state.last, FD.state.step || 0);
      else FD.goto('dataprot');
    });
    $('#sProg').addEventListener('click', FD.openProgress);
    el.querySelectorAll('[data-go]').forEach((b) => b.addEventListener('click', () => FD.goto(b.dataset.go)));
  },
});
