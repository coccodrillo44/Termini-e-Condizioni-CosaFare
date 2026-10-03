/**
 * CosaFare — Termini e Condizioni di Utilizzo
 * JavaScript: Interattività, Ricerca con Evidenziazione, Scrollspy, Dark Mode, Stampa
 */

document.addEventListener('DOMContentLoaded', () => {
  // =========================================================================
  // 1. Gestione Tema Chiaro / Scuro (Dark Mode)
  // =========================================================================
  const themeToggle = document.getElementById('themeToggle');
  const storedTheme = localStorage.getItem('cosafare_legal_theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  const currentTheme = storedTheme || (systemPrefersDark ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', currentTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const activeTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = activeTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('cosafare_legal_theme', newTheme);
    });
  }

  // =========================================================================
  // 2. Barra di Avanzamento Lettura
  // =========================================================================
  const readingProgressBar = document.getElementById('readingProgress');
  const backToTopBtn = document.getElementById('backToTopBtn');

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercentage = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

    if (readingProgressBar) {
      readingProgressBar.style.width = `${scrollPercentage}%`;
    }

    if (backToTopBtn) {
      if (scrollTop > 350) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }
  }, { passive: true });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // =========================================================================
  // 3. ScrollSpy per l'Indice dei Contenuti (TOC)
  // =========================================================================
  const sections = document.querySelectorAll('.legal-section');
  const tocLinks = document.querySelectorAll('.toc-link');

  const observerOptions = {
    root: null,
    rootMargin: '-80px 0px -70% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        tocLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
            // Mantieni il link visibile nella sidebar se questa ha lo scroll
            link.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' });
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));

  // =========================================================================
  // 4. Copia Link Paragrafo e Notifica Toast
  // =========================================================================
  const toastNotification = document.getElementById('toastNotification');
  const toastMessage = document.getElementById('toastMessage');
  let toastTimeout = null;

  function showToast(message) {
    if (!toastNotification) return;
    if (toastMessage) toastMessage.textContent = message;
    toastNotification.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toastNotification.classList.remove('show');
    }, 2800);
  }

  document.querySelectorAll('.copy-anchor-btn').forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = button.getAttribute('data-target');
      const url = new URL(window.location.href);
      url.hash = targetId;

      navigator.clipboard.writeText(url.toString()).then(() => {
        showToast('Link al paragrafo copiato negli appunti!');
      }).catch(() => {
        showToast('Impossibile copiare il link.');
      });
    });
  });

  // =========================================================================
  // 5. Ricerca Dinamica nel Testo Legale
  // =========================================================================
  const searchInput = document.getElementById('searchInput');
  const clearSearchBtn = document.getElementById('clearSearchBtn');
  const searchStatusBar = document.getElementById('searchStatusBar');
  const searchResultCount = document.getElementById('searchResultCount');
  const prevMatchBtn = document.getElementById('prevMatchBtn');
  const nextMatchBtn = document.getElementById('nextMatchBtn');
  const closeSearchAlertBtn = document.getElementById('closeSearchAlertBtn');
  const legalDocument = document.getElementById('legalDocument');

  let currentMatchIndex = -1;
  let matches = [];

  // Salva l'HTML originale per ripristinarlo all'azzeramento della ricerca
  const originalDocHTML = legalDocument ? legalDocument.innerHTML : '';

  function resetSearch() {
    if (!legalDocument) return;
    legalDocument.innerHTML = originalDocHTML;
    rebindEvents();
    matches = [];
    currentMatchIndex = -1;
    if (searchStatusBar) searchStatusBar.hidden = true;
    if (clearSearchBtn) clearSearchBtn.hidden = true;
  }

  function rebindEvents() {
    // Riassocia gli observer delle sezioni
    document.querySelectorAll('.legal-section').forEach(section => observer.observe(section));
    
    // Riassocia i pulsanti copia
    document.querySelectorAll('.copy-anchor-btn').forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = button.getAttribute('data-target');
        const url = new URL(window.location.href);
        url.hash = targetId;
        navigator.clipboard.writeText(url.toString()).then(() => {
          showToast('Link al paragrafo copiato negli appunti!');
        });
      });
    });
  }

  function performSearch(query) {
    if (!query || query.trim().length < 2) {
      resetSearch();
      return;
    }

    resetSearch();
    const cleanQuery = query.trim();
    const escapedQuery = cleanQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escapedQuery})`, 'gi');

    // Funzione ricorsiva per evidenziare il testo mantenendo la struttura dei nodi DOM
    function highlightNode(node) {
      if (node.nodeType === 3) { // Text Node
        const match = node.nodeValue.match(regex);
        if (match) {
          const span = document.createElement('span');
          span.innerHTML = node.nodeValue.replace(regex, '<mark class="search-highlight">$1</mark>');
          node.parentNode.replaceChild(span, node);
        }
      } else if (node.nodeType === 1 && !['SCRIPT', 'STYLE', 'BUTTON'].includes(node.nodeName)) {
        Array.from(node.childNodes).forEach(child => highlightNode(child));
      }
    }

    highlightNode(legalDocument);
    rebindEvents();

    matches = Array.from(document.querySelectorAll('mark.search-highlight'));

    if (searchStatusBar && searchResultCount) {
      searchStatusBar.hidden = false;
      if (clearSearchBtn) clearSearchBtn.hidden = false;

      if (matches.length > 0) {
        currentMatchIndex = 0;
        updateActiveMatch();
      } else {
        searchResultCount.textContent = `Nessun risultato per "${cleanQuery}"`;
      }
    }
  }

  function updateActiveMatch() {
    matches.forEach((m, idx) => {
      if (idx === currentMatchIndex) {
        m.classList.add('active-match');
        m.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        m.classList.remove('active-match');
      }
    });

    if (searchResultCount && matches.length > 0) {
      searchResultCount.textContent = `Risultato ${currentMatchIndex + 1} di ${matches.length} corrispondenze`;
    }
  }

  let searchDebounce = null;
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      clearTimeout(searchDebounce);
      searchDebounce = setTimeout(() => {
        performSearch(e.target.value);
      }, 250);
    });

    // Navigazione tramite invio
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        if (matches.length > 0) {
          if (e.shiftKey) {
            currentMatchIndex = (currentMatchIndex - 1 + matches.length) % matches.length;
          } else {
            currentMatchIndex = (currentMatchIndex + 1) % matches.length;
          }
          updateActiveMatch();
        }
      } else if (e.key === 'Escape') {
        searchInput.value = '';
        resetSearch();
      }
    });
  }

  if (clearSearchBtn) {
    clearSearchBtn.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      resetSearch();
      if (searchInput) searchInput.focus();
    });
  }

  if (closeSearchAlertBtn) {
    closeSearchAlertBtn.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      resetSearch();
    });
  }

  if (nextMatchBtn) {
    nextMatchBtn.addEventListener('click', () => {
      if (matches.length > 0) {
        currentMatchIndex = (currentMatchIndex + 1) % matches.length;
        updateActiveMatch();
      }
    });
  }

  if (prevMatchBtn) {
    prevMatchBtn.addEventListener('click', () => {
      if (matches.length > 0) {
        currentMatchIndex = (currentMatchIndex - 1 + matches.length) % matches.length;
        updateActiveMatch();
      }
    });
  }

  // Scorciatoia rapida da tastiera: premi '/' o 'Ctrl+K' per cercare
  window.addEventListener('keydown', (e) => {
    if ((e.key === '/' || (e.ctrlKey && e.key.toLowerCase() === 'k')) && document.activeElement !== searchInput) {
      e.preventDefault();
      if (searchInput) {
        searchInput.focus();
        searchInput.select();
      }
    }
  });

  // =========================================================================
  // 6. Stampa e Salvataggio PDF
  // =========================================================================
  const printBtn = document.getElementById('printBtn');
  if (printBtn) {
    printBtn.addEventListener('click', () => {
      window.print();
    });
  }

  // =========================================================================
  // 7. Menù Mobile per Indice dei Contenuti
  // =========================================================================
  const mobileTocToggle = document.getElementById('mobileTocToggle');
  const sidebarWrapper = document.getElementById('sidebarWrapper');

  if (mobileTocToggle && sidebarWrapper) {
    mobileTocToggle.addEventListener('click', () => {
      const isOpen = sidebarWrapper.classList.toggle('mobile-open');
      mobileTocToggle.setAttribute('aria-expanded', isOpen);
    });

    // Chiudi il menù mobile quando l'utente seleziona una sezione
    tocLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (sidebarWrapper.classList.contains('mobile-open')) {
          sidebarWrapper.classList.remove('mobile-open');
        }
      });
    });
  }
});
