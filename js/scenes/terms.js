FD.add({
  id: 'terms',
  title: 'Key terms',
  tab: 'Key terms',
  icon: 'terms',
  color: '--accent',
  page: true,
  mount(el) {
    const T = [
      ['dataprot', 'Consent', 'Permission to do something.'],
      ['dataprot', 'Lawfully', 'Keeping to the law.'],
      ['dataprot', 'Specifically', 'In a detailed or exact way.'],
      ['dataprot', 'Data protection principles', 'Rules in the UK Data Protection Act that organisations using data must follow.'],
      ['dataprot', 'Adequate', 'Large enough in quantity or good enough in quality.'],
      ['dataprot', 'Rectified', 'Corrected.'],
      ['dataprot', 'Compensation', 'Money paid to someone because they have suffered injury or loss.'],
      ['dataprot', 'Breach', 'An action that breaks a law, rule or agreement.'],
      ['transfer', 'European Economic Area (EEA)', 'An area in which goods and services can be traded freely, formed in 1993 by the countries of the European Union (EU) with Norway and Iceland.'],
      ['transfer', 'Privacy Shield Framework', 'An EU–US agreement that aimed to protect data transferred between the USA and countries in the EU (replaced in 2023 by the EU–US Data Privacy Framework).'],
      ['copyright', 'Legislation', 'A law or set of laws.'],
      ['copyright', 'Copyright', 'A legal power that provides the creator of an original work with the sole authority to use and distribute it.'],
      ['copyright', 'Sole', 'Not shared with anyone else.'],
      ['copyright', 'Creative Commons licence', 'A free licence that lets owners distribute their work freely while saying how it can be used, shared and altered.'],
      ['fairuse', 'Exemption', 'Having permission to not obey a rule or law.'],
      ['fairuse', 'Fair use', 'An exemption from copyright, e.g. for libraries, archives, disability, private study and parody.'],
      ['fairuse', 'Parody', 'An exaggerated imitation for the purpose of humour.'],
      ['fairuse', 'Digital rights management (DRM)', 'Systems that check that the device on which a work is opened is allowed to open it.'],
      ['fairuse', 'Geoblocking', 'Limiting access to internet content based on the user’s geographical location (also known as geolocation rights management).'],
      ['movements', 'Controversial', 'Likely to provoke public disagreement.'],
      ['movements', 'Closed circuit television (CCTV)', 'A system of cameras placed in public buildings or in the street that are used to help prevent crime.'],
      ['movements', 'Automatic number plate recognition (ANPR)', 'Cameras that read vehicle number plates, used by law enforcement agencies such as the police.'],
      ['commsmon', 'Parental control software', 'Software that lets parents monitor their children’s online activity and use of applications.'],
      ['commsmon', 'Investigatory Powers Act 2016', 'A UK law that allows the police and many other agencies to access digital communications.'],
      ['sustain', 'Ecology', 'The biological science that looks at the way in which organisms interact with each other and their environment.'],
      ['sustain', 'Sustainability', 'Not using up natural resources until they run out; maintaining the balance of nature.'],
      ['sustain', 'Mitigate', 'Reduce the severity of a problem.'],
      ['sustain', 'Renewable energy', 'A source of energy that will not run out when it is used, such as wind power or solar power.'],
      ['sustain', 'Non-renewable energy', 'A source of energy that cannot be replaced once it has been used, such as coal or gas.'],
      ['sustain', 'Energy-efficient', 'Using as little energy as possible.'],
      ['sustain', 'Hydroelectric', 'Using water power to produce electricity.'],
      ['sustain', 'Implication', 'A possible future effect or result of an action, event or decision.'],
      ['health', 'Flicker', 'Shine with an unsteady light that goes on and off quickly.'],
      ['health', 'Glare', 'A bright unpleasant light that hurts the eyes.'],
      ['health', 'Repetitive strain injury (RSI)', 'Pain caused by repeating the same movement many times.'],
      ['health', 'Posture', 'The way in which you position your body while standing or sitting.'],
      ['health', 'Ergonomic', 'Designed for efficiency and comfort, especially in a working environment.'],
      ['health', 'Trip hazard', 'An object that a person could trip over.'],
      ['health', 'Trunking', 'Tubes or channels designed to contain cables.'],
      ['health', 'Residual current device (RCD)', 'A device that interrupts an electrical current to prevent electric shock.'],
      ['health', 'Overload', 'Put too much electricity through an electrical system or piece of equipment.'],
      ['health', 'Fire extinguisher', 'A metal container with water or chemicals in it, used for stopping small fires.'],
      ['health', 'Plug socket', 'A point in a wall where you can connect equipment to the supply of electricity.'],
      ['health', 'Fuse', 'A safety device used in plugs and plug sockets that breaks an electrical current if too much electrical current is supplied.'],
      ['ai', 'Artificial intelligence (AI)', 'The ability of a computer program to make decisions that would otherwise be made by humans.'],
      ['ai', 'Pedestrian', 'A person who is walking.'],
    ];
    const colorOf = (id) => (FD.section(id) || { color: '--accent' }).color;
    el.innerHTML = `
      <h2>Key terms</h2>
      <div class="terms-tools"><input type="search" id="tq" placeholder="Search a term…" aria-label="Search terms">
        <span class="seg" id="tp"><button data-v="all">All</button><button data-v="A">Part A</button><button data-v="B">Part B</button></span>
        <span class="small muted" id="tn"></span></div>
      <div class="terms" id="terms">${T.map(([f, t, d]) => `
        <article class="term" data-part="${FD.section(f).part}" style="--c:var(${colorOf(f)})"><h3>${t}</h3><p>${d}</p><button class="link-btn" data-go="${f}">${FD.icon[f]} See it</button></article>`).join('')}</div>`;
    const cards = [...el.querySelectorAll('.term')];
    const q = el.querySelector('#tq'), n = el.querySelector('#tn');
    let part = 'all';
    const filter = () => {
      const s = q.value.trim().toLowerCase();
      let k = 0;
      cards.forEach((c) => { const show = (!s || c.textContent.toLowerCase().includes(s)) && (part === 'all' || c.dataset.part === part); c.hidden = !show; k += show; });
      n.textContent = `${k} of ${cards.length} terms`;
      FD.segSet(el.querySelector('#tp'), part);
    };
    q.addEventListener('input', filter);
    el.querySelector('#tp').addEventListener('click', (e) => { const b = e.target.closest('button[data-v]'); if (b) { part = b.dataset.v; filter(); } });
    filter();
    el.querySelectorAll('[data-go]').forEach((b) => b.addEventListener('click', () => FD.goto(b.dataset.go)));
  },
});
