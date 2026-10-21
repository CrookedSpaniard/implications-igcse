FD.add({
  id: 'ai',
  title: 'AI and responsibility',
  tab: 'AI',
  icon: 'ai',
  color: '--c1',
  section: true,
  interactive: true,
  vocab: [
    ['Artificial intelligence (AI)', 'The ability of a computer program to make decisions that would otherwise be made by humans.'],
    ['Pedestrian', 'A person who is walking.'],
    ['Human judgement', 'The ability to apply common sense and take ethical or moral responsibility for decisions.'],
  ],
  mount(el) {
    el.innerHTML = `
      <div class="sim ai-s">
        <div class="ptabs" role="group" aria-label="Simulations">
          <button data-p="drive">🚗 Self-driving car</button><button data-p="react">⏱️ Reaction time</button><button data-p="dilemma">🤔 What should it do?</button>
        </div>

        <div data-panel="drive" class="sim">
          <div class="ai-grid">
            <div class="sim-box">
              <svg viewBox="0 0 600 200" class="ai-road" role="img" aria-label="A self-driving car on a road">
                <rect class="ai-tar" x="0" y="30" width="600" height="140"/>
                <line class="ai-edge" x1="0" y1="32" x2="600" y2="32"/><line class="ai-edge" x1="0" y1="168" x2="600" y2="168"/>
                <line class="ai-dash" id="dash" x1="0" y1="100" x2="600" y2="100"/>
                <g id="sign" opacity="0"><line class="ai-pole" x1="0" y1="30" x2="0" y2="8"/><circle class="ai-sign" cx="0" cy="8" r="14"/><text class="ai-signt" id="signT" x="0" y="9">50</text></g>
                <g id="lead" opacity="0"><rect class="ai-car2" x="-28" y="-15" width="56" height="30" rx="8"/><rect class="ai-brake" id="brk" x="-30" y="-12" width="4" height="24" rx="1"/></g>
                <g id="me"><path class="ai-beam" id="beam" d="M30 0 L170 -38 L170 38 Z"/><rect class="ai-car" x="-30" y="-16" width="60" height="32" rx="9"/><rect class="ai-glass" x="4" y="-12" width="14" height="24" rx="3"/><text class="emo" x="-10" y="1" font-size="13">🤖</text></g>
              </svg>
              <div class="ctrls">
                <button class="btn" data-sc="lane">↕️ Drift towards the lane divider</button>
                <button class="btn" data-sc="sign">🪧 Speed limit sign</button>
                <button class="btn" data-sc="brake">🚙 Car ahead brakes</button>
              </div>
            </div>
            <div class="sim-box ai-panel">
              <div class="readout"><div class="ro"><small>Speed</small><b id="spd">60 km/h</b></div><div class="ro"><small>Limit</small><b id="lim">70</b></div></div>
              <h5 class="mw-h">🤖 AI decisions</h5><ol class="ai-log" id="log"></ol>
            </div>
          </div>
        </div>

        <div data-panel="react" class="sim" hidden>
          <div class="sim-box ai-rx">
            <p class="note">The car in front will brake at a random moment. Press <b>BRAKE</b> as soon as you see its red lights.</p>
            <div class="ai-rcar" id="rcar"><span>🚙</span><i></i><i></i></div>
            <div class="chk-btns"><button class="btn primary" id="rGo">▶ Start</button><button class="btn ai-bb" id="rBrake" disabled>🛑 BRAKE!</button></div>
            <div class="readout"><div class="ro"><small>You</small><b id="rYou">–</b></div><div class="ro"><small>Computer (simulated)</small><b id="rPc">–</b></div></div>
            <p class="verdict" id="rMsg"></p>
          </div>
        </div>

        <div data-panel="dilemma" class="sim" hidden>
          <div class="two-col">
            <div class="sim-box ai-d"><h5 class="mw-h">1 · Over the speed limit?</h5>
              <p>A lorry is pulling out ahead. The only way to avoid it is to speed up past it, <b>over the speed limit</b>. The AI was told to stay under the limit.</p>
              <div class="chk-btns" data-d="1"><button class="mini-btn" data-v="a">Speed up</button><button class="mini-btn" data-v="b">Stay under the limit</button></div>
              <p class="note ai-ans" id="d1"></p></div>
            <div class="sim-box ai-d"><h5 class="mw-h">2 · Swerve?</h5>
              <p>The car must swerve to avoid another vehicle, but that would take it off the road towards a <b>pedestrian</b>.</p>
              <div class="chk-btns" data-d="2"><button class="mini-btn" data-v="a">Swerve</button><button class="mini-btn" data-v="b">Brake and stay in lane</button></div>
              <p class="note ai-ans" id="d2"></p></div>
          </div>
          <p class="note ai-key">🔑 <b>Key point:</b> people must be responsible in their use of digital technologies. Digital technologies are not yet capable of human judgement, so they are not yet capable of taking ethical or moral responsibility for their actions.</p>
        </div>
      </div>`;
    const root = el.querySelector('.ai-s'), $ = (s) => root.querySelector(s);
    const show = FD.panels(root);
    let dead = false, gen = 0, raf = 0, last = 0;
    // world state (speeds in km/h, positions in px)
    const W = { v: 60, tv: 60, y: 135, ty: 135, lim: 70, off: 0, sign: -1, signV: 50, lead: -1, leadV: 60, braking: false };

    function say(t, cls = '') { $('#log').prepend(FD.h(`<li class="new ${cls}">${t}</li>`)); while ($('#log').children.length > 6) $('#log').lastChild.remove(); }
    function frame(now) {
      if (dead) return;
      const dt = Math.min(0.05, (now - (last || now)) / 1000); last = now;
      W.v += FD.clamp(W.tv - W.v, -60 * dt, 25 * dt) * FD.speed;
      W.y += FD.clamp(W.ty - W.y, -40 * dt, 40 * dt) * FD.speed;
      const px = W.v * 2.2 * dt * FD.speed;
      W.off = (W.off + px) % 40;
      $('#dash').setAttribute('stroke-dashoffset', W.off);
      if (W.sign >= 0) { W.sign -= px; $('#sign').setAttribute('transform', `translate(${W.sign} 0)`); $('#sign').setAttribute('opacity', W.sign > -20 ? 1 : 0); if (W.sign < 330 && W.lim !== W.signV) { W.lim = W.signV; W.tv = Math.min(60, W.lim); say(W.lim < 60 ? `📷 Camera reads the sign: limit ${W.lim} km/h → <b>slow down</b> to ${W.lim}.` : `📷 Camera reads the sign: limit ${W.lim} km/h → keep below the limit.`); } if (W.sign < -20) W.sign = -1; }
      if (W.lead >= 0) {
        W.lead += (W.leadV - W.v) * 2.2 * dt * FD.speed;
        $('#lead').setAttribute('transform', `translate(${W.lead} 135)`); $('#lead').setAttribute('opacity', 1);
        if (W.braking && W.lead - 150 < 160 && W.tv > W.leadV) { W.tv = W.leadV; say('📡 Radar: the car ahead is slowing → <b>apply the brakes</b>.', 'warn'); }
      }
      $('#me').setAttribute('transform', `translate(150 ${W.y})`);
      $('#spd').textContent = Math.round(W.v) + ' km/h';
      $('#lim').textContent = W.lim;
      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);

    async function scenario(k) {
      const g = ++gen;
      root.querySelectorAll('[data-sc]').forEach((b) => b.classList.toggle('on', b.dataset.sc === k));
      if (k === 'lane') {
        W.ty = 112; say('⚠️ The car is drifting towards the lane divider…');
        await FD.wait(900); if (dead || g !== gen) return;
        say('📷 Sensors detect the lane divider → <b>steer back</b> into the lane.'); W.ty = 135;
      }
      if (k === 'sign') { W.signV = W.lim === 50 ? 70 : 50; W.sign = 600; $('#signT').textContent = W.signV; }
      if (k === 'brake') {
        W.lead = 470; W.leadV = W.v; W.braking = false; $('#brk').classList.remove('on');
        await FD.wait(700); if (dead || g !== gen) return;
        W.leadV = 25; W.braking = true; $('#brk').classList.add('on'); say('🚙 The car ahead brakes hard.');
        await FD.wait(3500); if (dead || g !== gen) return;
        W.lead = -1; $('#lead').setAttribute('opacity', 0); W.braking = false; W.tv = Math.min(60, W.lim);
      }
    }
    root.querySelectorAll('[data-sc]').forEach((b) => b.addEventListener('click', () => scenario(b.dataset.sc)));

    // ----- reaction time -----
    let tStart = 0, rTimer = 0;
    function rStart() {
      clearTimeout(rTimer); tStart = 0;
      $('#rcar').classList.remove('on'); $('#rBrake').disabled = false; $('#rYou').textContent = '…'; $('#rPc').textContent = '–'; $('#rMsg').innerHTML = 'Watch the car…';
      rTimer = setTimeout(() => { if (dead) return; $('#rcar').classList.add('on'); tStart = performance.now(); }, 1500 + Math.random() * 2500);
    }
    function rBrake() {
      if (!tStart) { clearTimeout(rTimer); $('#rBrake').disabled = true; $('#rMsg').className = 'verdict bad'; $('#rMsg').innerHTML = 'Too early! The lights were not on yet. Try again.'; return; }
      const s = (performance.now() - tStart) / 1000;
      tStart = 0; $('#rBrake').disabled = true;
      const m = (s * 50 / 3.6).toFixed(1);
      $('#rYou').textContent = s.toFixed(2) + ' s'; $('#rPc').textContent = '0.05 s';
      $('#rMsg').className = 'verdict';
      $('#rMsg').innerHTML = `At 50 km/h your car travelled <b>${m} m</b> before you started to brake. The computer reacts much faster than a human.`;
    }
    $('#rGo').addEventListener('click', rStart);
    $('#rBrake').addEventListener('click', rBrake);
    function rDemo() { $('#rcar').classList.add('on'); $('#rYou').textContent = '0.75 s (typical)'; $('#rPc').textContent = '0.05 s'; $('#rMsg').className = 'verdict'; $('#rMsg').innerHTML = 'A typical driver reacts in about three quarters of a second: 10.4 m at 50 km/h before braking even starts.'; }

    // ----- dilemmas -----
    const ANS = {
      1: { a: 'Would the AI software prevent the car from doing this if it was also supposed to stay under the speed limit? A human could use judgement here.', b: 'Following the rule could mean hitting the lorry. AI systems do not have human judgement and cannot apply common sense.' },
      2: { a: 'What would the computer decide to do in that situation? Can we know what it decided to do? Can we hold it responsible?', b: 'Is this the best choice? Who decided the car should behave like this: the programmers, the owner or the AI?' },
    };
    function decide(d, v) {
      const box = root.querySelector(`[data-d="${d}"]`);
      box.querySelectorAll('[data-v]').forEach((b) => b.classList.toggle('on', b.dataset.v === v));
      $('#d' + d).innerHTML = '💭 ' + ANS[d][v];
    }
    root.querySelectorAll('[data-d]').forEach((box) => box.addEventListener('click', (e) => { const b = e.target.closest('[data-v]'); if (b) decide(box.dataset.d, b.dataset.v); }));

    function reset() {
      gen++; Object.assign(W, { v: 60, tv: 60, y: 135, ty: 135, lim: 70, sign: -1, lead: -1, braking: false });
      $('#sign').setAttribute('opacity', 0); $('#lead').setAttribute('opacity', 0); $('#log').innerHTML = '';
      root.querySelectorAll('[data-sc]').forEach((b) => b.classList.remove('on'));
      clearTimeout(rTimer); tStart = 0; $('#rcar').classList.remove('on'); $('#rBrake').disabled = true; $('#rYou').textContent = '–'; $('#rPc').textContent = '–'; $('#rMsg').innerHTML = '';
      root.querySelectorAll('.ai-d [data-v]').forEach((b) => b.classList.remove('on')); $('#d1').innerHTML = ''; $('#d2').innerHTML = '';
    }
    show('drive'); reset();
    return { show, scenario, rDemo, decide, reset, destroy() { dead = true; cancelAnimationFrame(raf); clearTimeout(rTimer); } };
  },
  steps: [
    {
      title: 'Technology makes decisions',
      text: `<p>As we increase the number of decisions that technology makes for us, we reduce the control that we have over important decisions that can have an impact on our health and safety.</p>
             <p><strong>Artificial intelligence</strong> (AI) is the ability of a computer program to make decisions that would otherwise be made by humans. It is now used in <b>self-driving cars</b>.</p>`,
      tip: 'Try it: press the buttons under the road.',
      async on(a) { a.show('drive'); a.reset(); },
    },
    {
      title: 'Braking and swerving',
      text: `<p>A self-driving car’s AI can decide whether it should <b>apply the brakes</b> if it is likely to crash into the car ahead, or whether it should <b>swerve</b> to avoid another vehicle.</p>`,
      async on(a) { a.show('drive'); await a.scenario('brake'); },
    },
    {
      title: 'Lanes and speed limits',
      text: `<p>These cars use <b>sensors</b> to detect whether the car is crossing a <b>lane divider</b>, to stop it drifting into the wrong lane.</p>
             <p>AI can also <b>read speed limit signs</b>, adjusting the car’s speed so that it does not travel faster than the limit.</p>`,
      async on(a, ctx) { a.show('drive'); await a.scenario('lane'); if (!(await ctx.sleep(1500))) return; await a.scenario('sign'); },
    },
    {
      title: 'Faster than a human',
      text: `<p>💡 <b>Did you know?</b> It is estimated that <b>94%</b> of car accidents are caused by <b>human error</b>. However, a computer can react much faster than a human.</p>
             <p>But the longer people are not engaged in driving, the <b>slower their reaction times</b> get. Some people can even fall asleep, leaving the computer to control the vehicle.</p>`,
      tip: 'Try it: test your own reaction time.',
      async on(a) { a.show('react'); a.reset(); a.rDemo(); },
    },
    {
      title: 'No common sense',
      text: `<p>These are all useful tools. However, AI systems do <b>not have human judgement</b> and cannot apply <b>common sense</b>.</p>
             <ul><li>What if a car needs to go <b>over the speed limit</b>, perhaps to avoid a hazard?</li><li>What if it had to swerve, but veered off the road towards a <strong>pedestrian</strong>? Can we know what it decided to do? Can we hold it responsible?</li></ul>`,
      tip: 'Try it: decide what you would do in each situation.',
      async on(a, ctx) { a.show('dilemma'); a.reset(); a.decide('1', 'b'); if (!(await ctx.sleep(2200))) return; a.decide('2', 'a'); },
    },
  ],
});

FD.activities({
  section: 'ai',
  items: [
    {
      id: 'ai-autopilot',
      title: 'Using autopilot',
      task: '<p>Research the use of autopilot in aeroplanes. Do you think humans need to be in control of an aircraft at all times? Do you think the use of autopilot improves the health and safety of passengers and crew?</p>',
      fields: ['What autopilot does', 'Should humans be in control at all times? Why?', 'Does autopilot improve health and safety?'],
    },
  ],
});

FD.check({
  section: 'ai',
  items: [
    { type: 'mcq', q: 'What is <b>artificial intelligence</b> (AI)?', opts: ['The ability of a computer program to make decisions that would otherwise be made by humans', 'A sensor that reads number plates', 'A licence for self-driving cars', 'Software that monitors children’s online activity'], why: 'It is used in self-driving cars.' },
    { type: 'multi', q: 'What can the AI in a self-driving car do? Choose <b>three</b>.', need: 3, opts: [['Decide whether to apply the brakes', true], ['Detect a lane divider with sensors', true], ['Read speed limit signs', true], ['Take moral responsibility for its actions', false], ['Apply human common sense', false]], why: 'AI systems do not have human judgement.' },
    { type: 'tf', q: 'The longer people are not engaged in driving, the faster their reaction times get.', a: false, why: 'Their reaction times get slower; some even fall asleep.' },
  ],
});
