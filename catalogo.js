(() => {
  const filters = document.querySelector('.filters');
  const search = document.querySelector('#query');
  const market = document.querySelector('#market');
  const cover = document.querySelector('#cover');
  const results = document.querySelector('#results');
  const editionSelection = document.querySelector('#edition-selection');
  const pickers = [...document.querySelectorAll('.edition-picker')];
  const normalize = text => text.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
  const editions = [...document.querySelectorAll('.edition')].map(section => ({
    section,
    items: [...section.querySelectorAll('.work')].map(card => ({
      card,
      text: normalize(card.textContent)
    }))
  }));

  function update() {
    const terms = normalize(search.value).trim().split(/\s+/).filter(Boolean);
    const selectedEditions = new Set(pickers.filter(picker => picker.checked).map(picker => picker.value));
    let total = 0;
    for (const { section, items } of editions) {
      let count = 0;
      for (const { card, text } of items) {
        const { usa, ita, cover: hasCover, missing } = card.dataset;
        const languageMatch = {
          '': true, USA: usa === '1', ITA: ita === '1', both: usa === '1' && ita === '1'
        }[market.value];
        const coverMatch = { '': true, '1': hasCover === '1', '0': missing === '1' }[cover.value];
        const match = languageMatch && coverMatch && terms.every(term => text.includes(term));
        card.hidden = !match;
        if (match) count += 1;
      }
      const selected = selectedEditions.size === 0 || selectedEditions.has(section.dataset.edition);
      section.hidden = !selected || count === 0;
      section.querySelector('.section-title span').textContent = count === 1 ? '1 scheda' : count + ' schede';
      if (selected) total += count;
    }
    results.textContent = total === 0 ? 'Nessuna scheda corrispondente.' : total === 1 ? '1 scheda visibile' : total + ' schede visibili';
  }

  filters.addEventListener('input', update);
  for (const picker of pickers) picker.addEventListener('change', update);
  editionSelection.addEventListener('reset', () => setTimeout(update, 0));
  document.querySelector('#page-start').addEventListener('click', () => window.scrollTo(0, 0));
  document.querySelector('#reset').addEventListener('click', () => {
    search.value = '';
    market.value = '';
    cover.value = '';
    editionSelection.reset();
    update();
    search.focus();
  });
  filters.hidden = false;
  update();
})();
