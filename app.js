'use strict';
const $ = (selector) => document.querySelector(selector);
const escapeHTML = (value) => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const safeURL = (value) => { try { const url = new URL(value); return url.protocol === 'https:' ? escapeHTML(url.href) : '#sources'; } catch { return '#sources'; } };
let edition, selectedSlate = 'early', selectedRisk = 'balanced', requestVersion = 0;
const currentSlate = () => edition.slates.find(s => s.id === selectedSlate) || edition.slates[0];
const currentCard = () => currentSlate().parlays[selectedRisk];
async function getJSON(path) { const response = await fetch(path); if (!response.ok) throw new Error('Research data is unavailable.'); return response.json(); }
function renderSlate() {
 const s = currentSlate();
 document.querySelectorAll('[data-slate]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.slate === s.id)));
 $('#slate-content').innerHTML = `<div class="window-caption"><strong>${escapeHTML(s.name)}</strong><span>${s.games.length} MATCHUPS · ${escapeHTML(s.time)}</span></div><div class="matchups" aria-label="${escapeHTML(s.name)} matchups">${s.games.map(g => `<div class="matchup">${escapeHTML(g.teams)}<span>${escapeHTML(g.time)}</span></div>`).join('')}</div><div class="anchor"><div><p class="eyebrow">${escapeHTML(s.anchorRead)}</p><h3>${escapeHTML(s.anchor)}</h3><span class="position">${escapeHTML(s.anchorTeam)} / ANYTIME TD</span></div><p>${escapeHTML(s.intro)}</p><img class="anchor-icon" src="./crest.svg" alt="" width="56" height="63"></div><div class="cards-top"><h3>Touchdown watchlist <span class="muted">/ ${String(s.players.length).padStart(2,'0')}</span></h3><p>Original qualitative reads · Approximate snapshot odds</p></div><div class="scorers">${s.players.map(p => `<article class="scorer"><div class="scorer-top"><span class="team">${escapeHTML(p.team)} / ${escapeHTML(p.position)}</span><span class="badge ${p.read === 'Strongest' ? 'strongest' : p.read === 'Value' ? 'value' : ''}">${escapeHTML(p.read)}</span></div><h4>${escapeHTML(p.name)}</h4><p>${escapeHTML(p.note)}</p><div class="market"><span>Anytime TD<small>${escapeHTML(p.matchup)} · Snapshot</small></span><strong>${escapeHTML(p.odds)}</strong></div><details><summary>Supporting stat / context</summary><p>${escapeHTML(p.stat)}. Not independently verified as current.</p></details></article>`).join('')}</div>`;
 $('#notes-content').innerHTML = s.notes.map(n => `<article class="field-note"><p class="eyebrow">${escapeHTML(n.type)}</p><h3>${escapeHTML(n.title)}</h3><p>${escapeHTML(n.text)}</p>${n.url ? `<a href="${safeURL(n.url)}" target="_blank" rel="noopener noreferrer">Review source ↗</a>` : ''}</article>`).join('');
 renderParlay();
}
function renderParlay() {
 const p = currentCard();
 document.querySelectorAll('[data-risk]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.risk === selectedRisk)));
 $('#parlay-content').innerHTML = `<div class="ticket-head"><div><p class="eyebrow">${escapeHTML(currentSlate().label)} / ${escapeHTML(selectedRisk)} CARD</p><h3>${escapeHTML(p.title)}</h3><p>${escapeHTML(p.risk)}</p></div><span class="leg-count">${String(p.legs.length).padStart(2,'0')}<small>LEGS</small></span></div><ol class="leg-list">${p.legs.map(l => `<li><strong>${escapeHTML(l[0])}</strong><span>${escapeHTML(l[1])}</span></li>`).join('')}</ol><p class="ticket-note">${escapeHTML(p.note)}</p><div class="ticket-actions"><span>RESEARCH CARD · NO WAGER PLACED</span><button class="copy-button" type="button" id="copy-card">Copy card ↗</button></div>`;
 $('#copy-card').addEventListener('click', copyCard);
}
async function copyCard() {
 const p = currentCard();
 const text = `LEONECORE / ${edition.label} / ${currentSlate().label}\n${selectedRisk.toUpperCase()} — ${p.legs.length} LEGS\n${p.legs.map((l,i)=>`${i+1}. ${l[0]} — ${l[1]}`).join('\n')}\n\nResearch snapshot: ${edition.snapshot}. Not live lines. Betting involves risk. Wager responsibly.\n${p.note}`;
 try { await navigator.clipboard.writeText(text); $('#app-status').textContent = 'Research card copied. Review current lines and player availability before any wager.'; }
 catch { $('#app-status').innerHTML = '<label for="copy-fallback">Copy the research card below:</label><textarea id="copy-fallback" readonly rows="13" style="width:100%;margin-top:10px"></textarea>'; $('#copy-fallback').value = text; $('#copy-fallback').focus(); $('#copy-fallback').select(); }
}
async function loadEdition(date) {
 const version = ++requestVersion;
 document.querySelectorAll('[data-slate],[data-risk]').forEach(b => b.disabled = true);
 $('#app-status').textContent = 'Loading edition…';
 try {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error('Invalid edition date.');
  const next = await getJSON(`./data/slates/${date}.json`);
  if (version !== requestVersion) return;
  edition = next;
  $('#date-label').textContent = edition.label;
  $('#week').textContent = edition.week.toUpperCase();
  $('#edition-number').textContent = edition.edition.toUpperCase();
  $('#snapshot-status').textContent = edition.status + '.';
  $('#snapshot-time').textContent = edition.snapshot + '.';
  $('#source-note').textContent = edition.sourceNote;
  $('#data-link').href = `./data/slates/${edition.date}.json`;
  document.title = `LeoneCore | ${edition.label} — The Sunday Read`;
  renderSlate();
  $('#app-status').textContent = '';
 } catch {
  $('#app-status').textContent = 'This edition could not be loaded. Please refresh or try another edition.';
  if (!edition) $('#slate-content').innerHTML = '<p class="error">The research board is temporarily unavailable. Please refresh to retry.</p>';
  else $('#edition-select').value = edition.date;
 } finally {
  if (version === requestVersion) document.querySelectorAll('[data-slate],[data-risk]').forEach(b => b.disabled = !edition);
 }
}
document.querySelectorAll('[data-slate]').forEach(b => b.addEventListener('click', () => { if (!edition) return; selectedSlate = b.dataset.slate; $('#app-status').textContent = ''; renderSlate(); }));
document.querySelectorAll('[data-risk]').forEach(b => b.addEventListener('click', () => { if (!edition) return; selectedRisk = b.dataset.risk; $('#app-status').textContent = ''; renderParlay(); }));
$('#edition-select').addEventListener('change', e => loadEdition(e.target.value));
(async function init() {
 try {
  const manifest = await getJSON('./data/index.json');
  $('#edition-select').innerHTML = manifest.editions.map(e => `<option value="${escapeHTML(e.date)}">${escapeHTML(e.label)}</option>`).join('');
  $('#edition-select').value = manifest.latest;
  await loadEdition(manifest.latest);
 } catch { $('#slate-content').innerHTML = '<p class="error">The research archive could not be loaded. Please refresh to retry.</p>'; $('#app-status').textContent = 'Research data unavailable.'; }
})();
