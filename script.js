const header = document.querySelector('[data-header]');
const menuButton = document.querySelector('[data-menu]');
const navigation = document.querySelector('[data-nav]');

const closeMenu = () => {
  if (!menuButton || !navigation) return;
  navigation.classList.remove('open');
  document.body.classList.remove('menu-open');
  menuButton.setAttribute('aria-expanded', 'false');
};

if (menuButton && navigation) {
  menuButton.addEventListener('click', () => {
    const open = navigation.classList.toggle('open');
    document.body.classList.toggle('menu-open', open);
    menuButton.setAttribute('aria-expanded', String(open));
  });

  navigation.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
  window.addEventListener('resize', () => {
    if (window.innerWidth > 900) closeMenu();
  });
}

const updateHeader = () => {
  if (!header) return;
  header.classList.toggle('is-scrolled', window.scrollY > 70);
};

updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -35px' });

  revealItems.forEach((item, index) => {
    item.style.transitionDelay = `${Math.min(index % 4, 3) * 70}ms`;
    observer.observe(item);
  });
} else {
  revealItems.forEach((item) => item.classList.add('visible'));
}

const searchInput = document.querySelector('[data-vacancy-search]');
const vacancyCards = [...document.querySelectorAll('.vacancy-card')];
const filterButtons = [...document.querySelectorAll('[data-filter]')];
const emptyState = document.querySelector('[data-vacancy-empty]');
let activeFilter = 'all';

const normalize = (value) => value.toLocaleLowerCase('ru-RU').replace(/ё/g, 'е').trim();

const updateVacancies = () => {
  if (!vacancyCards.length) return;
  const query = normalize(searchInput?.value || '');
  let visibleCount = 0;

  vacancyCards.forEach((card) => {
    const matchesType = activeFilter === 'all' || card.dataset.type === activeFilter;
    const matchesSearch = !query || normalize(card.textContent).includes(query);
    const visible = matchesType && matchesSearch;
    card.hidden = !visible;
    if (visible) visibleCount += 1;
  });

  if (emptyState) emptyState.hidden = visibleCount !== 0;
};

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    activeFilter = button.dataset.filter;
    filterButtons.forEach((item) => item.classList.toggle('is-active', item === button));
    updateVacancies();
  });
});

searchInput?.addEventListener('input', updateVacancies);
