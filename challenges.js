const icons = {
  Teamwork: '<path d="m16 4 4 2 3 5-5 5-4-2-4 4-5-5 4-4 4 1 3-3Z"/><path d="m8 16-2 2 2 2 2-2m1 0 2 2 2-2m-1-4 3 3 2-2M2 7l4-3 3 5-4 4-3-6Z"/>',
  Communication: '<rect x="3" y="4" width="18" height="14" rx="5"/><path d="m8 18-3 4v-6m3-6h.01M12 10h.01M16 10h.01"/>',
  Resilience: '<path d="m2 21 8-16 5 10 3-6 6 12H2Z"/><path d="m7 11 3 2 3-2m3 2 2 2 2-2"/>',
  Support: '<path d="M12 21s-8-4.5-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 6.5-8 11-8 11Z"/><path d="M8 12h8m-4-4v8"/>'
};

const clock = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/></svg>';
const calendar = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="5" width="16" height="16" rx="2"/><path d="M8 3v4m8-4v4M4 10h16"/></svg>';
const challenges = [
  {
    id: 1, category: 'Teamwork', title: 'Community Clean-Up',
    description: 'Help clean a local park or community space with your team.',
    duration: '3 hours', due: '20 Apr 2027',
    detail: 'Bring your team together to give a local space a fresh start. Choose a park or community area and make a difference, one small action at a time.',
    steps: ['Choose a space with your team and ask permission to clean it.', 'Bring gloves, bags, and water. Have an adult supervise.', 'Sort litter safely and leave the space better than you found it.'],
    metrics: [{ id: 'plastic-collected', label: 'Plastic collected', unit: 'kg', target: 20 }, { id: 'plastic-reused', label: 'Plastic reused or recycled', unit: 'kg', target: 10 }],
    tags: ['teamwork', 'community', 'cleanup', 'plastic', 'environment']
  },
  {
    id: 2, category: 'Teamwork', title: 'Kit Share',
    description: 'Collect and pass on clean, good-condition football kit and equipment.',
    duration: '2 weeks', due: '27 Apr 2027',
    detail: 'Help teammates access usable football kit. Ask an adult to help organize collection and make sure items are clean and safe to use.',
    steps: ['Ask your coach or club adult to approve a collection point.', 'Collect clean kit and equipment in usable condition.', 'Record items shared and arrange distribution with an adult.'],
    metrics: [{ id: 'items-shared', label: 'Items reused by players', unit: 'items', target: 20 }, { id: 'players-helped', label: 'Players supported', unit: 'players', target: 10 }],
    tags: ['teamwork', 'kit', 'share', 'reuse', 'equipment']
  },
  {
    id: 3, category: 'Teamwork', title: 'Make Space Better',
    description: 'Work together on a small improvement for a shared team or community space.',
    duration: '1 week', due: '4 May 2027',
    detail: 'Choose a safe, practical improvement with your team. Ask the venue or an adult before moving or changing anything.',
    steps: ['Agree on one improvement with your team and an adult.', 'Share out small, safe tasks so everyone can contribute.', 'Record the finished improvement and thank everyone involved.'],
    metrics: [{ id: 'tasks-complete', label: 'Team tasks completed', unit: 'tasks', target: 12 }, { id: 'players-involved', label: 'Players involved', unit: 'players', target: 8 }],
    tags: ['teamwork', 'community', 'space', 'improvement']
  },
  {
    id: 4, category: 'Communication', title: 'Team Talk Circle',
    description: 'Have a short team discussion about how to support each other.',
    duration: '1 hour', due: '18 Apr 2027',
    detail: 'A strong team starts with listening. Make time for everyone to share what helps them feel included, encouraged, and ready to play.',
    steps: ['Gather in a circle where everyone can see each other.', 'Take turns sharing one thing your teammates do well.', 'Choose one way to support each other at your next session.'],
    metrics: [{ id: 'players-heard', label: 'Players who had a chance to speak', unit: 'players', target: 10 }, { id: 'ideas-agreed', label: 'Team support ideas agreed', unit: 'ideas', target: 3 }],
    tags: ['communication', 'team-talk', 'listening', 'support']
  },
  {
    id: 5, category: 'Communication', title: 'Positive Sideline',
    description: 'Share specific, encouraging feedback at training or a match.',
    duration: '1 week', due: '26 Apr 2027',
    detail: 'Notice effort, teamwork, and brave attempts. Keep feedback kind, specific, and focused on what a teammate can build on.',
    steps: ['Agree with your coach on a respectful way to encourage teammates.', 'Notice effort and share supportive words during team activities.', 'Reflect together on what made the team feel encouraged.'],
    metrics: [{ id: 'encouragements', label: 'Encouraging messages shared', unit: 'messages', target: 20 }, { id: 'players-encouraged', label: 'Players encouraged', unit: 'players', target: 8 }],
    tags: ['communication', 'encouragement', 'kindness', 'support']
  },
  {
    id: 6, category: 'Communication', title: 'Ideas Into Action',
    description: 'Listen to teammates and try one team idea at a practice session.',
    duration: '2 weeks', due: '2 May 2027',
    detail: 'Make space for different voices. With your coach, choose a safe team idea and give it a try during a planned session.',
    steps: ['Invite teammates to suggest a warm-up or team-building idea.', 'Choose one idea together and check it with your coach.', 'Try it and ask the team what they thought.'],
    metrics: [{ id: 'ideas-collected', label: 'Player ideas collected', unit: 'ideas', target: 10 }, { id: 'ideas-tried', label: 'Ideas tried as a team', unit: 'ideas', target: 3 }],
    tags: ['communication', 'ideas', 'listening', 'practice']
  },
  {
    id: 7, category: 'Resilience', title: 'The Balanced Week',
    description: 'Follow a coach-approved week with training, rest, and recovery.',
    duration: '1 week', due: '25 Apr 2027',
    detail: 'Build consistency without overdoing it. Your plan should include rest and suit your age, ability, and existing training schedule.',
    steps: ['Agree on a realistic plan with your coach and a parent or guardian.', 'Log planned sessions and recovery days, including rest.', 'Check in with your coach about how the week felt.'],
    metrics: [{ id: 'sessions-done', label: 'Planned sessions completed', unit: 'sessions', target: 4 }, { id: 'recovery-days', label: 'Recovery days taken', unit: 'days', target: 3 }],
    tags: ['resilience', 'training', 'recovery', 'balance']
  },
  {
    id: 8, category: 'Resilience', title: 'Small Skills, Steady Steps',
    description: 'Practise one football skill in short, focused sessions.',
    duration: '2 weeks', due: '2 May 2027',
    detail: 'Choose one skill with your coach and build it gradually. Quality and enjoyment matter more than pushing through tiredness.',
    steps: ['Pick one skill and a safe drill with your coach.', 'Practise in short sessions with rest as needed.', 'Note one thing that felt easier by the end.'],
    metrics: [{ id: 'practice-minutes', label: 'Focused practice time', unit: 'minutes', target: 120 }, { id: 'practice-sessions', label: 'Short sessions completed', unit: 'sessions', target: 4 }],
    tags: ['resilience', 'skills', 'practice', 'football']
  },
  {
    id: 9, category: 'Resilience', title: 'Progress Notes',
    description: 'Record small wins and lessons from training over two weeks.',
    duration: '2 weeks', due: '9 May 2027',
    detail: 'Progress is not always a straight line. Keep short notes about effort, learning, and how you felt; share only what you are comfortable sharing.',
    steps: ['Choose a skill or habit you would like to notice.', 'Write a brief note after a few planned sessions.', 'Look back and celebrate effort and lessons learned.'],
    metrics: [{ id: 'journal-entries', label: 'Progress notes written', unit: 'notes', target: 6 }, { id: 'goals-tried', label: 'Small goals tried', unit: 'goals', target: 3 }],
    tags: ['resilience', 'progress', 'reflection', 'goals']
  },
  {
    id: 10, category: 'Support', title: 'Welcome a Teammate',
    description: 'Help new or quieter players feel part of the team.',
    duration: '1 week', due: '30 Apr 2027',
    detail: 'Small gestures can help someone feel welcome. Keep it respectful, give people space, and invite rather than pressure.',
    steps: ['Ask your coach how best to welcome a teammate.', 'Offer a friendly introduction or invite them to join a team activity.', 'Check that they feel comfortable and include their ideas.'],
    metrics: [{ id: 'welcome-actions', label: 'Welcoming actions', unit: 'actions', target: 10 }, { id: 'players-welcomed', label: 'Players welcomed', unit: 'players', target: 5 }],
    tags: ['support', 'welcome', 'inclusion', 'community']
  },
  {
    id: 11, category: 'Support', title: 'Share the Gear',
    description: 'Help arrange a safe, fair way to share spare football equipment.',
    duration: '2 weeks', due: '7 May 2027',
    detail: 'With an adult or club leader, help teammates find clean, safe equipment they can use. Never share personal details publicly.',
    steps: ['Ask a club adult to coordinate a safe equipment share.', 'Check that donated items are clean and in good condition.', 'Record items reused and thank everyone who helped.'],
    metrics: [{ id: 'gear-reused', label: 'Equipment items reused', unit: 'items', target: 15 }, { id: 'players-supported', label: 'Players supported', unit: 'players', target: 8 }],
    tags: ['support', 'equipment', 'reuse', 'sharing']
  }
];

const STORAGE_KEY = 'u18-challenges-state-v1';
const iconsByCategory = icons;
const clockIcon = clock;
const calendarIcon = calendar;
const grid = document.querySelector('#challenge-grid');
const detailDialog = document.querySelector('#detail-dialog');
const detailContent = document.querySelector('#detail-content');
const certificateDialog = document.querySelector('#certificate-dialog');
const appStatus = document.querySelector('#app-status');
let category = 'All';
let query = '';

function showStatus(message, isError = false) {
  appStatus.textContent = message;
  appStatus.classList.toggle('is-error', isError);
}

function createEmptyState() {
  return { challenges: {} };
}

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return createEmptyState();
    const parsed = JSON.parse(saved);
    if (!parsed || typeof parsed !== 'object' || !parsed.challenges || typeof parsed.challenges !== 'object') {
      throw new Error('Saved challenge data has an unexpected format.');
    }
    return parsed;
  } catch (error) {
    showStatus(`Could not load saved challenge progress: ${error.message}`, true);
    return createEmptyState();
  }
}

const state = loadState();

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch (error) {
    showStatus(`Your update could not be saved in this browser: ${error.message}`, true);
    return false;
  }
}

function getRecord(item) {
  if (!state.challenges[item.id] || typeof state.challenges[item.id] !== 'object') {
    state.challenges[item.id] = {
      joined: false,
      completed: false,
      completedOrder: null,
      metrics: {},
      reflection: '',
      evidenceNames: []
    };
  }
  const record = state.challenges[item.id];
  if (!record.metrics || typeof record.metrics !== 'object') record.metrics = {};
  for (const metric of item.metrics) {
    if (!Number.isFinite(record.metrics[metric.id]) || record.metrics[metric.id] < 0) {
      record.metrics[metric.id] = 0;
    }
  }
  if (!Array.isArray(record.evidenceNames)) record.evidenceNames = [];
  if (!record.journeyPlan || typeof record.journeyPlan !== 'object') record.journeyPlan = null;
  return record;
}

function populateChallengeSelect(select) {
  select.innerHTML = challenges.map(item => `<option value="${item.id}">${escapeHTML(item.title)} · ${escapeHTML(item.category)}</option>`).join('');
}

function renderSavedJourneyPlans() {
  const container = document.querySelector('#saved-journey-plans');
  container.replaceChildren();
  challenges.forEach(item => {
    const plan = getRecord(item).journeyPlan;
    if (!plan) return;
    const card = document.createElement('article');
    card.className = 'saved-plan-card';
    const title = document.createElement('h3');
    title.textContent = item.title;
    const details = document.createElement('p');
    details.textContent = `Working on it for ${plan.duration} day${plan.duration === 1 ? '' : 's'} · Next session ${plan.nextDate} · With ${plan.withWhom} · Check-in with ${plan.accountability}`;
    card.append(title, details);
    container.append(card);
  });
}

function metricTotal(item, metric) {
  return Math.max(0, Number(getRecord(item).metrics[metric.id]) || 0);
}

function isTargetReached(item) {
  return item.metrics.every(metric => metricTotal(item, metric) >= metric.target);
}

function completionCount() {
  return Object.values(state.challenges).filter(record => record && record.completed === true).length;
}

function ordinalWord(number) {
  return ({ 1: 'first', 2: 'second', 3: 'third' })[number] || `${number}${number % 10 === 1 && number % 100 !== 11 ? 'st' : number % 10 === 2 && number % 100 !== 12 ? 'nd' : number % 10 === 3 && number % 100 !== 13 ? 'rd' : 'th'}`;
}

function challengeProgress(item) {
  const total = item.metrics.reduce((sum, metric) => sum + Math.min(metricTotal(item, metric), metric.target) / metric.target, 0);
  return Math.round(total / item.metrics.length * 100);
}

function featuredChallenges() {
  const featured = [];
  for (const challengeCategory of ['Teamwork', 'Communication', 'Resilience']) {
    const options = challenges.filter(item => item.category === challengeCategory);
    const activeFirst = options.filter(item => !getRecord(item).completed);
    const completedLast = options.filter(item => getRecord(item).completed);
    featured.push(...[...activeFirst, ...completedLast].slice(0, 2));
  }
  featured.push(...challenges.filter(item => item.category === 'Support'));
  return featured;
}

function visibleChallenges() {
  const source = category === 'All' && !query ? featuredChallenges() : challenges;
  const terms = query.split(/\s+/).filter(Boolean);
  return source.filter(item => {
    const searchableText = `${item.title} ${item.description} ${item.category} ${item.tags.join(' ')}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, ' ')
      .trim();
    return (category === 'All' || item.category === category) &&
      terms.every(term => searchableText.includes(term));
  });
}

function renderMetricSummary(item) {
  return item.metrics.map(metric => `<div class="card-metric"><span>${metric.label}</span><strong>${metricTotal(item, metric)} / ${metric.target} ${metric.unit}</strong></div>`).join('');
}

function renderCard(item) {
  const record = getRecord(item);
  const progress = challengeProgress(item);
  const status = record.completed ? `Completed as your ${ordinalWord(record.completedOrder)} challenge` : record.joined ? 'Joined by you' : 'Team challenge';
  return `<article class="challenge-card">
    <div class="card-category">
      <span class="category-icon"><svg viewBox="0 0 26 26" aria-hidden="true">${iconsByCategory[item.category]}</svg></span>
      <span class="category-label">${item.category}</span><span class="card-index">${String(item.id).padStart(2, '0')}</span>
    </div>
    <h3>${item.title}</h3><p class="card-description">${item.description}</p>
    <div class="card-meta"><span>${clockIcon}${item.duration}</span><span>${calendarIcon}Due ${item.due}</span></div>
    <div class="card-progress-heading"><span>${status}</span><strong>${progress}%</strong></div>
    <progress class="progress" max="100" value="${progress}" aria-label="${item.title} team progress">${progress}%</progress>
    <div class="card-metrics">${renderMetricSummary(item)}</div>
    <button class="button button-primary" data-detail="${item.id}">${record.joined ? 'View team progress' : 'View challenge'}<span class="arrow" aria-hidden="true">→</span></button>
  </article>`;
}

function renderChallenges() {
  const visible = visibleChallenges();
  grid.innerHTML = visible.map(renderCard).join('');
  document.querySelector('#result-count').textContent = `${visible.length} challenge${visible.length === 1 ? '' : 's'}`;
  document.querySelector('#empty-state').hidden = visible.length > 0;

  for (const filter of document.querySelectorAll('.filter-count')) {
    const filterCategory = filter.dataset.count;
    const count = filterCategory === 'All' ? featuredChallenges().length : challenges.filter(item => item.category === filterCategory).length;
    filter.textContent = count;
  }
}

function renderJoinedChallenges() {
  const joined = challenges.filter(item => getRecord(item).joined);
  const dashboard = document.querySelector('#team-dashboard');
  const joinedGrid = document.querySelector('#joined-grid');
  dashboard.hidden = joined.length === 0;
  joinedGrid.innerHTML = joined.map(item => {
    const record = getRecord(item);
    const progress = challengeProgress(item);
    const completion = record.completed ? `Completed · ${ordinalWord(record.completedOrder)} certificate earned` :
      isTargetReached(item) ? 'Targets reached · reflection needed' : `${progress}% of team targets`;
    return `<article class="joined-card">
      <div class="joined-card-heading"><span class="category-label">${item.category}</span><strong>${completion}</strong></div>
      <h3>${item.title}</h3>
      <div class="progress-label"><span>Team progress</span><strong>${progress}%</strong></div>
      <progress class="progress" max="100" value="${progress}" aria-label="${item.title} team progress">${progress}%</progress>
      <div class="joined-metrics">${renderMetricSummary(item)}</div>
      ${record.evidenceNames.length ? `<p class="saved-evidence">Evidence saved on this device: ${record.evidenceNames.map(escapeHTML).join(', ')}</p>` : ''}
      <button class="button button-primary" data-detail="${item.id}">${record.completed ? 'View completion' : isTargetReached(item) ? 'Submit reflection' : 'Add team update'}</button>
    </article>`;
  }).join('');
  renderSavedJourneyPlans();
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[character]);
}

function activeChallengeInCategory(item) {
  if (item.category === 'Support') return null;
  return challenges.find(other => other.category === item.category && other.id !== item.id &&
    getRecord(other).joined && !getRecord(other).completed);
}

function renderDetail(item) {
  const record = getRecord(item);
  const categoryConflict = activeChallengeInCategory(item);
  const progress = challengeProgress(item);
  const reached = isTargetReached(item);
  const status = record.completed
    ? `<div class="detail-status success">Completed as your ${ordinalWord(record.completedOrder)} challenge. Keep it up!</div>`
    : categoryConflict
      ? `<div class="detail-status">You already have an active ${item.category} challenge: <strong>${categoryConflict.title}</strong>. Finish it before joining another one in this category.</div>`
      : '';

  let actionContent = '';
  if (record.completed) {
    actionContent = `<button class="button button-secondary" type="button" data-show-certificate="${item.id}">View your certificate</button>
      <div class="reflection-saved"><h3>Your reflection</h3><p>${escapeHTML(record.reflection)}</p></div>`;
  } else if (!record.joined) {
    actionContent = `<button id="join-challenge" class="button button-primary" type="button" ${categoryConflict ? 'disabled' : ''}>Join Challenge <span class="arrow" aria-hidden="true">→</span></button>`;
  } else if (reached) {
    actionContent = `<section class="reflection-section">
      <span class="eyebrow">CHALLENGE TARGETS REACHED</span><h3>Submit your reflection</h3>
      <p>Think about the whole experience: what you did, what you learned, and how your team worked together.</p>
      <form id="reflection-form" class="reflection-form" data-challenge="${item.id}">
        <label for="reflection-text">Reflection and journey evidence <span>(at least 30 characters)</span></label>
        <textarea id="reflection-text" name="reflection" minlength="30" maxlength="2000" required placeholder="Describe what your team did, your part in it, what changed, and what you learned. What are you proud of?"></textarea>
        <label for="evidence-files">Document your journey <span>(optional files, up to 3 files of 5 MB each)</span></label>
        <input id="evidence-files" name="evidence" type="file" multiple accept="image/jpeg,image/png,image/webp,application/pdf,text/plain">
        <p class="privacy-note">Your written reflection is saved as the evidence record; extra files are optional. Evidence is stored in this browser only. Avoid personal details, location information, or photos of others unless they and a trusted adult have agreed.</p>
        <button class="button button-primary" type="submit">Submit reflection and earn certificate</button>
      </form>
    </section>`;
  } else {
    actionContent = `<form id="contribution-form" class="contribution-form" data-challenge="${item.id}">
      <h3>Log a team update</h3><p>Enter the new amount your team has added since its last update. Totals stay on this device.</p>
      ${item.metrics.map(metric => `<label for="metric-${metric.id}">${metric.label} <span>(${metric.unit}; target ${metric.target})</span>
        <input id="metric-${metric.id}" name="${metric.id}" type="number" min="0" step="0.1" inputmode="decimal" value="0">
      </label>`).join('')}
      <button class="button button-primary" type="submit">Save team update</button>
    </form>`;
  }

  detailContent.innerHTML = `<span class="eyebrow">${item.category.toUpperCase()}</span>
    <h2>${item.title}</h2><p>${item.detail}</p>
    <div class="card-meta"><span>${clockIcon}${item.duration}</span><span>${calendarIcon}Due ${item.due}</span></div>
    <h3 class="detail-subheading">Team progress · ${progress}%</h3>
    <div class="detail-metrics">${item.metrics.map(metric => {
      const value = metricTotal(item, metric);
      const metricProgress = Math.min(100, Math.round(value / metric.target * 100));
      return `<div class="detail-metric">
        <div class="progress-label"><span>${metric.label}</span><strong>${value} / ${metric.target} ${metric.unit}</strong></div>
        <progress class="progress" max="${metric.target}" value="${Math.min(value, metric.target)}" aria-label="${metric.label}: ${value} of ${metric.target} ${metric.unit}">${metricProgress}%</progress>
      </div>`;
    }).join('')}</div>
    <ol class="detail-steps">${item.steps.map(step => `<li>${step}</li>`).join('')}</ol>
    ${status}${actionContent}
    <p class="local-progress-note">Team totals and evidence in this prototype are stored in this browser, not shared live with other players.</p>`;

  const joinButton = detailContent.querySelector('#join-challenge');
  if (joinButton) joinButton.addEventListener('click', () => {
    getRecord(item).joined = true;
    const saved = saveState();
    renderDetail(item);
    renderChallenges();
    renderJoinedChallenges();
    loadSelectedJourneyPlan();
    if (saved) showStatus(`${item.title} joined. Your team progress tracker is ready.`);
  });

  const contributionForm = detailContent.querySelector('#contribution-form');
  if (contributionForm) contributionForm.addEventListener('submit', event => {
    event.preventDefault();
    const formData = new FormData(contributionForm);
    const additions = item.metrics.map(metric => {
      const value = Number(formData.get(metric.id));
      return { metric, value };
    });
    if (additions.some(entry => !Number.isFinite(entry.value) || entry.value < 0)) {
      showStatus('Enter zero or a positive number for every team update.', true);
      return;
    }
    if (!additions.some(entry => entry.value > 0)) {
      showStatus('Add at least one positive team update before saving.', true);
      return;
    }
    const record = getRecord(item);
    for (const entry of additions) {
      record.metrics[entry.metric.id] += entry.value;
    }
    const saved = saveState();
    renderDetail(item);
    renderChallenges();
    renderJoinedChallenges();
    if (saved) showStatus(isTargetReached(item) ? 'All team targets are reached. Submit a reflection to complete the challenge.' : 'Team progress updated on this device.');
  });

  const reflectionForm = detailContent.querySelector('#reflection-form');
  if (reflectionForm) reflectionForm.addEventListener('submit', async event => {
    event.preventDefault();
    const reflection = reflectionForm.elements.reflection.value.trim();
    const files = [...reflectionForm.elements.evidence.files];
    if (reflection.length < 30) {
      showStatus('Please write at least 30 characters in your reflection.', true);
      return;
    }
    if (files.length > 3 || files.some(file => file.size > 5 * 1024 * 1024)) {
      showStatus('Choose no more than 3 evidence files, each 5 MB or smaller.', true);
      return;
    }
    const nextOrder = completionCount() + 1;
    try {
      const evidenceIds = await saveEvidenceFiles(files, item.id, nextOrder);
      const record = getRecord(item);
      record.reflection = reflection;
      record.evidenceNames = files.map(file => file.name);
      record.evidenceIds = evidenceIds;
      record.completed = true;
      record.completedOrder = nextOrder;
      const saved = saveState();
      renderChallenges();
      renderJoinedChallenges();
      detailDialog.close();
      showCertificate(item, nextOrder);
      if (saved) showStatus(`Challenge complete. Congratulations on your ${ordinalWord(nextOrder)} challenge!`);
    } catch (error) {
      showStatus(`Could not save the evidence: ${error.message}. Your reflection has not been submitted.`, true);
    }
  });

  const certificateButton = detailContent.querySelector('[data-show-certificate]');
  if (certificateButton) certificateButton.addEventListener('click', () => showCertificate(item, record.completedOrder));
}

function saveEvidenceFiles(files, challengeId, completionNumber) {
  if (files.length === 0) return Promise.resolve([]);
  if (!window.indexedDB) return Promise.reject(new Error('This browser does not support local evidence storage.'));
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('u18-challenge-evidence', 1);
    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains('evidence')) database.createObjectStore('evidence', { keyPath: 'id' });
    };
    request.onerror = () => reject(request.error || new Error('Evidence storage could not be opened.'));
    request.onsuccess = () => {
      const database = request.result;
      const transaction = database.transaction('evidence', 'readwrite');
      const store = transaction.objectStore('evidence');
      const ids = files.map((file, index) => `${challengeId}-${completionNumber}-${Date.now()}-${index}`);
      files.forEach((file, index) => store.put({
        id: ids[index],
        challengeId,
        name: file.name,
        type: file.type,
        size: file.size,
        file
      }));
      transaction.oncomplete = () => {
        database.close();
        resolve(ids);
      };
      transaction.onerror = () => {
        const error = transaction.error || new Error('Evidence could not be saved.');
        database.close();
        reject(error);
      };
      transaction.onabort = () => {
        const error = transaction.error || new Error('Evidence saving was cancelled.');
        database.close();
        reject(error);
      };
    };
  });
}

function showCertificate(item, order) {
  document.querySelector('#certificate-count').textContent = ordinalWord(order);
  document.querySelector('#certificate-challenge').textContent = item.title;
  document.querySelector('#certificate-date').textContent = new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  certificateDialog.dataset.challenge = String(item.id);
  if (!certificateDialog.open) certificateDialog.showModal();
}

function downloadCertificate() {
  const item = challenges.find(challenge => challenge.id === Number(certificateDialog.dataset.challenge));
  if (!item) {
    showStatus('Could not find this certificate challenge.', true);
    return;
  }
  const record = getRecord(item);
  const order = ordinalWord(record.completedOrder);
  const title = escapeHTML(item.title);
  const page = `<!doctype html><html lang="en"><meta charset="utf-8"><title>RISE UP Certificate</title>
  <style>body{margin:0;padding:40px;background:#f1f7f2;font-family:Arial,sans-serif;color:#164b35}.certificate{max-width:760px;margin:auto;padding:64px 48px;text-align:center;border:8px double #17834f;background:white}.mark{font-size:48px}.eyebrow{letter-spacing:3px;font-size:12px}.title{font-size:34px;margin:25px 0}.challenge{font-size:22px;font-weight:bold}.message{font-size:20px;line-height:1.6}.date{margin-top:42px;color:#567565}@media print{body{padding:0;background:white}}</style>
  <article class="certificate"><div class="eyebrow">RISE UP · U18 FOOTBALL COMMUNITY</div><div class="mark">⚽</div><h1 class="title">Certificate of Achievement</h1><p class="message">Congratulations on completing your <strong>${order}</strong> challenge!</p><p>Awarded to Our U18 Team Player</p><p class="challenge">${title}</p><p class="message">Keep it up. Every step forward matters.</p><p class="date">${escapeHTML(new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }))}</p></article></html>`;
  const blob = new Blob([page], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `RISE-UP-${order}-challenge-certificate.html`;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  showStatus('Certificate downloaded. Open it and use Print to save it as a PDF.');
}

function filterCategory(next) {
  category = next;
  document.querySelectorAll('.filter').forEach(button => {
    const active = button.dataset.category === category;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  renderChallenges();
}

document.querySelectorAll('.filter').forEach(button => button.addEventListener('click', () => filterCategory(button.dataset.category)));

const currentPage = window.location.pathname.split('/').pop().toLowerCase();
document.querySelectorAll('.site-header nav a').forEach(link => {
  const linkPage = new URL(link.href, window.location.href).pathname.split('/').pop().toLowerCase();
  const isCurrentPage = linkPage === currentPage;
  link.classList.toggle('active', isCurrentPage);
  if (isCurrentPage) link.setAttribute('aria-current', 'page');
  else link.removeAttribute('aria-current');
});

const journeyForm = document.querySelector('#journey-form');
const journeyStatus = document.querySelector('#journey-status');
const journeyDate = document.querySelector('#journey-date');
const journeyChallenge = document.querySelector('#journey-challenge');

populateChallengeSelect(journeyChallenge);
const today = new Date();
const todayLocal = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
journeyDate.min = todayLocal;

function loadSelectedJourneyPlan() {
  const item = challenges.find(challenge => challenge.id === Number(journeyChallenge.value));
  if (!item) return;
  const plan = getRecord(item).journeyPlan;
  journeyForm.elements.duration.value = plan?.duration || 1;
  journeyDate.value = plan?.nextDate || '';
  journeyForm.elements.withWhom.value = plan?.withWhom || '';
  journeyForm.elements.accountability.value = plan?.accountability || '';
}

journeyChallenge.addEventListener('change', loadSelectedJourneyPlan);

journeyForm.addEventListener('submit', event => {
  event.preventDefault();
  const formData = new FormData(journeyForm);
  const item = challenges.find(challenge => challenge.id === Number(formData.get('challenge')));
  if (!item) {
    journeyStatus.textContent = 'Choose a valid challenge before saving your plan.';
    journeyStatus.classList.add('is-error');
    return;
  }
  const conflict = activeChallengeInCategory(item);
  if (conflict) {
    journeyStatus.textContent = `Finish your active ${item.category} challenge, “${conflict.title}”, before planning another one in this category.`;
    journeyStatus.classList.add('is-error');
    return;
  }
  const nextDate = String(formData.get('nextDate'));
  if (nextDate < todayLocal) {
    journeyStatus.textContent = 'Choose today or a future date for your next session.';
    journeyStatus.classList.add('is-error');
    return;
  }
  const record = getRecord(item);
  record.joined = true;
  record.journeyPlan = {
    duration: Number(formData.get('duration')),
    nextDate,
    withWhom: String(formData.get('withWhom')).trim(),
    accountability: String(formData.get('accountability')).trim()
  };
  const saved = saveState();
  renderChallenges();
  renderJoinedChallenges();
  if (saved) {
    journeyStatus.textContent = `Your plan for ${item.title} is saved. You’re ready to get started together.`;
    journeyStatus.classList.remove('is-error');
    showStatus('Challenge plan saved. Your team progress tracker is ready.');
  } else {
    journeyStatus.textContent = 'Your plan could not be saved on this device. Please try again.';
    journeyStatus.classList.add('is-error');
  }
});

for (const id of ['challenge-search', 'global-search']) {
  document.getElementById(id).addEventListener('input', event => {
    query = event.target.value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, ' ')
      .trim()
      .replace(/\s+/g, ' ');
    for (const otherId of ['challenge-search', 'global-search']) {
      if (otherId !== id) document.getElementById(otherId).value = event.target.value;
    }
    renderChallenges();
  });
}

document.querySelector('#clear-search').addEventListener('click', () => {
  query = '';
  document.querySelector('#challenge-search').value = '';
  document.querySelector('#global-search').value = '';
  filterCategory('All');
});

grid.addEventListener('click', event => {
  const button = event.target.closest('[data-detail]');
  if (!button) return;
  const item = challenges.find(challenge => challenge.id === Number(button.dataset.detail));
  if (!item) return;
  renderDetail(item);
  detailDialog.showModal();
});

function closeOnBackdrop(dialog) {
  dialog.addEventListener('click', event => {
    if (event.target === dialog) {
      const bounds = dialog.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
    }
  });
}

document.querySelectorAll('.close-dialog').forEach(button => button.addEventListener('click', () => button.closest('dialog').close()));
document.querySelectorAll('dialog').forEach(closeOnBackdrop);

document.querySelector('#print-certificate').addEventListener('click', () => window.print());
document.querySelector('#download-certificate').addEventListener('click', downloadCertificate);

const chatLauncher = document.querySelector('#chatLauncher');
const communityChat = document.querySelector('#communityChat');
const chatForm = document.querySelector('#chatForm');
const chatInput = document.querySelector('#chatInput');
const messages = document.querySelector('#messages');
let chatReplyTurn = 0;

function toggleCommunityChat(isOpen) {
  communityChat.hidden = !isOpen;
  chatLauncher.setAttribute('aria-expanded', String(isOpen));
}

chatLauncher.addEventListener('click', () => toggleCommunityChat(communityChat.hidden));
document.querySelector('#chatClose').addEventListener('click', () => toggleCommunityChat(false));

function getTeamChatReplies(message) {
  const lower = message.toLowerCase().replace(/[’']/g, "'");

  if (/\b(work together|working together|teamwork|together|all of us|everyone)\b/.test(lower)) {
    if (/\b(clean|plastic|park|litter|environment)\b/.test(lower)) {
      return [
        { author: 'Daniel', text: "Yeah, let's do it. We can split into small groups and keep track of what we collect." },
        { author: 'Aisha', text: "I'm in too! Let's check with a coach or an adult first, then make a plan together." }
      ];
    }
    if (/\b(kit|gear|equipment|share)\b/.test(lower)) {
      return [
        { author: 'Jayce', text: "Count me in. We could start by checking what kit people actually need." },
        { author: 'Aisha', text: "Good idea—let's ask the coach to help us organize it fairly." }
      ];
    }
    return [
      { author: 'Daniel', text: "Yeah, I'm in! What should we start with?" },
      { author: 'Jayce', text: "I'll help out. We can figure out everyone's part as a team." }
    ];
  }

  if (/\b(stressed|stress|overwhelmed|anxious|worried|nervous|burnt out|burned out|exhausted)\b/.test(lower)) {
    return [
      { author: 'Aisha', text: "That sounds like a lot to carry. It's okay to pause and take a breather—no need to solve everything right now." },
      { author: 'Ethan', text: "Want to tell us what's been the hardest part? And if this keeps feeling heavy, please talk with a trusted adult too." }
    ];
  }

  if (/\b(left out|excluded|lonely|don't belong|dont belong|not good enough|don't deserve|dont deserve)\b/.test(lower)) {
    return [
      { author: 'Aisha', text: "I'm glad you told us. You matter to this team, and you don't have to earn your place by being perfect." },
      { author: 'Daniel', text: "Has something happened recently that's made you feel this way? We're here to listen." }
    ];
  }

  if (/\b(clean|plastic|recycl|litter|park|environment)\b/.test(lower)) {
    return [
      { author: 'Daniel', text: "That could make a real difference. Have we picked a place and checked with an adult yet?" },
      { author: 'Aisha', text: "We can keep it safe and split the jobs up. What do you think we should tackle first?" }
    ];
  }

  if (/\b(kit|gear|equipment)\b/.test(lower)) {
    return [
      { author: 'Jayce', text: "We should see what people need before collecting anything. Then we can organize it with the coach." },
      { author: 'Aisha', text: "I can help make a list. What equipment should we start with?" }
    ];
  }

  if (/\b(challenge|progress|goal|target)\b/.test(lower)) {
    return [
      { author: 'Daniel', text: "Nice, how's it going so far? What's the next small step for the team?" },
      { author: 'Jayce', text: "If anyone's stuck, we can work it out together." }
    ];
  }

  if (/\b(hi|hello|hey)\b/.test(lower)) {
    return [
      { author: 'Aisha', text: "Hey! Good to see you. How's your week going?" },
      { author: 'Daniel', text: "Hey! What's been happening with you?" }
    ];
  }

  if (/\b(thanks|thank you)\b/.test(lower)) {
    return [{ author: 'Aisha', text: "Anytime 😊 That's what teammates are for." }];
  }

  const replies = [
    [
      { author: 'Daniel', text: "Oh, got you. What happened next?" },
      { author: 'Aisha', text: "I'm listening too—tell us a bit more if you want." }
    ],
    [
      { author: 'Aisha', text: "I hear you. What part feels most important to sort out first?" },
      { author: 'Jayce', text: "We can think it through together—no rush." }
    ],
    [
      { author: 'Ethan', text: "That makes sense. What would be helpful from us right now?" },
      { author: 'Daniel', text: "We're here with you." }
    ]
  ];
  const response = replies[chatReplyTurn % replies.length];
  chatReplyTurn += 1;
  return response;
}

function appendChatMessage(author, text, messageType) {
  const message = document.createElement('article');
  message.className = `chat-message ${messageType}`;
  const name = document.createElement('div');
  name.className = 'chat-name';
  name.textContent = author;
  const body = document.createElement('p');
  body.textContent = text;
  const time = document.createElement('small');
  time.textContent = 'Now';
  message.append(name, body, time);
  messages.append(message);
  messages.scrollTop = messages.scrollHeight;
}

chatForm.addEventListener('submit', event => {
  event.preventDefault();
  const text = chatInput.value.trim();
  if (!text) return;
  appendChatMessage('You', text, 'sent');
  chatInput.value = '';
  const replies = getTeamChatReplies(text);
  replies.forEach((reply, index) => {
    window.setTimeout(() => appendChatMessage(reply.author, reply.text, 'received'), 450 + index * 800);
  });
});

const hero = new URLSearchParams(window.location.search).get('hero');
if (hero && (hero.startsWith('/') || hero.startsWith('https://'))) document.querySelector('#hero-image').src = hero;

renderChallenges();
renderJoinedChallenges();
