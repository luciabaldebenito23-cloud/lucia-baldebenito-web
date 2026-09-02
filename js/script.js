/* =========================================================================
   Lucía Baldebenito — Corretaje Inmobiliario & LB Consultora
   script.js — Interactividad en JavaScript vanilla
   Contenido:
     1. Menú móvil (hamburguesa)
     2. Cierre de menú al navegar + link activo
     3. Filtros de propiedades
     4. Validación de formularios (Tasación y Contacto)
     5. Buscador simulado del hero
     6. Utilidades varias (año del footer, sombra de header al hacer scroll)
   ========================================================================= */

document.addEventListener('DOMContentLoaded', function () {

  /* -----------------------------------------------------------------------
     1. MENÚ MÓVIL (HAMBURGUESA)
     ----------------------------------------------------------------------- */
  var navToggle = document.getElementById('navToggle');
  var primaryNav = document.getElementById('primaryNav');

  function closeMenu() {
    primaryNav.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Abrir menú de navegación');
    document.body.style.overflow = '';
  }

  function openMenu() {
    primaryNav.classList.add('is-open');
    navToggle.setAttribute('aria-expanded', 'true');
    navToggle.setAttribute('aria-label', 'Cerrar menú de navegación');
    document.body.style.overflow = 'hidden';
  }

  if (navToggle && primaryNav) {
    navToggle.addEventListener('click', function () {
      var isOpen = primaryNav.classList.contains('is-open');
      if (isOpen) { closeMenu(); } else { openMenu(); }
    });

    /* 2. Cerrar el menú al elegir un link (solo relevante en mobile) */
    var navLinks = primaryNav.querySelectorAll('a');
    navLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        closeMenu();
      });
    });

    /* Cerrar con la tecla Escape */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && primaryNav.classList.contains('is-open')) {
        closeMenu();
      }
    });

    /* Si el usuario agranda la ventana a escritorio, aseguramos estado limpio */
    window.addEventListener('resize', function () {
      if (window.innerWidth >= 960) { closeMenu(); }
    });
  }

  /* -----------------------------------------------------------------------
     LINK ACTIVO SEGÚN LA SECCIÓN VISIBLE
     ----------------------------------------------------------------------- */
  var sections = document.querySelectorAll('main section[id]');
  var navAnchors = document.querySelectorAll('.nav-link');

  if ('IntersectionObserver' in window && sections.length) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = entry.target.getAttribute('id');
          navAnchors.forEach(function (a) {
            a.classList.toggle('is-active', a.getAttribute('href') === '#' + id);
          });
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });

    sections.forEach(function (section) { observer.observe(section); });
  }

  /* -----------------------------------------------------------------------
     SOMBRA / ESTILO DEL HEADER AL HACER SCROLL
     ----------------------------------------------------------------------- */
  var header = document.getElementById('site-header');
  function updateHeaderShadow() {
    if (!header) return;
    if (window.scrollY > 12) {
      header.style.boxShadow = '0 6px 20px rgba(13, 44, 74, 0.08)';
    } else {
      header.style.boxShadow = 'none';
    }
  }
  window.addEventListener('scroll', updateHeaderShadow, { passive: true });
  updateHeaderShadow();

  /* -----------------------------------------------------------------------
     3. FILTROS DE PROPIEDADES
     Dos grupos de filtro (operación y tipo) que se combinan entre sí.
     ----------------------------------------------------------------------- */
  var filterChips = document.querySelectorAll('.filter-chip');
  var propertyCards = document.querySelectorAll('.property-card');
  var emptyState = document.getElementById('propertiesEmpty');

  var activeFilters = { operacion: 'todas', tipo: 'todos' };

  function applyFilters() {
    var visibleCount = 0;

    propertyCards.forEach(function (card) {
      var matchesOperacion = activeFilters.operacion === 'todas' || card.dataset.operacion === activeFilters.operacion;
      var matchesTipo = activeFilters.tipo === 'todos' || card.dataset.tipo === activeFilters.tipo;
      var isVisible = matchesOperacion && matchesTipo;

      card.hidden = !isVisible;
      if (isVisible) { visibleCount++; }
    });

    if (emptyState) {
      emptyState.hidden = visibleCount !== 0;
    }
  }

  filterChips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      var group = chip.dataset.filterGroup;
      var value = chip.dataset.filterValue;

      /* Desactivar los demás chips del mismo grupo */
      document.querySelectorAll('.filter-chip[data-filter-group="' + group + '"]').forEach(function (c) {
        c.classList.remove('is-active');
        c.setAttribute('aria-pressed', 'false');
      });

      chip.classList.add('is-active');
      chip.setAttribute('aria-pressed', 'true');

      activeFilters[group] = value;
      applyFilters();
    });
  });

  /* -----------------------------------------------------------------------
     4. VALIDACIÓN DE FORMULARIOS
     ----------------------------------------------------------------------- */

  function showError(field, message) {
    var wrapper = field.closest('.field');
    if (!wrapper) return;
    wrapper.classList.add('has-error');
    var errorEl = wrapper.querySelector('.field-error');
    if (errorEl) { errorEl.textContent = message; }
  }

  function clearError(field) {
    var wrapper = field.closest('.field');
    if (!wrapper) return;
    wrapper.classList.remove('has-error');
    var errorEl = wrapper.querySelector('.field-error');
    if (errorEl) { errorEl.textContent = ''; }
  }

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function isValidPhone(value) {
    var digits = value.replace(/[^\d]/g, '');
    return digits.length >= 8;
  }

  /**
   * Valida un formulario genéricamente, recorriendo los campos requeridos.
   * Devuelve true si todo está OK.
   */
  function validateForm(form) {
    var valid = true;
    var fields = form.querySelectorAll('[required]');

    fields.forEach(function (field) {
      clearError(field);
      var value = field.value.trim();

      if (!value) {
        showError(field, 'Este campo es obligatorio.');
        valid = false;
        return;
      }

      if (field.type === 'email' && !isValidEmail(value)) {
        showError(field, 'Ingresá un email válido.');
        valid = false;
        return;
      }

      if (field.type === 'tel' && !isValidPhone(value)) {
        showError(field, 'Ingresá un teléfono válido (mínimo 8 dígitos).');
        valid = false;
        return;
      }

      if (field.type === 'number' && Number(value) <= 0) {
        showError(field, 'Ingresá un valor mayor a 0.');
        valid = false;
      }
    });

    return valid;
  }

  function attachLiveValidation(form) {
    form.querySelectorAll('input, select, textarea').forEach(function (field) {
      field.addEventListener('blur', function () {
        if (field.hasAttribute('required') && !field.value.trim()) {
          showError(field, 'Este campo es obligatorio.');
        } else {
          clearError(field);
        }
      });
      field.addEventListener('input', function () {
        var wrapper = field.closest('.field');
        if (wrapper && wrapper.classList.contains('has-error')) {
          clearError(field);
        }
      });
    });
  }

  function handleFormSubmit(formId, successId, errorId) {
    var form = document.getElementById(formId);
    var successEl = document.getElementById(successId);
    var errorEl = errorId ? document.getElementById(errorId) : null;
    if (!form) return;

    attachLiveValidation(form);

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      if (successEl) { successEl.hidden = true; }
      if (errorEl) { errorEl.hidden = true; }

      if (!validateForm(form)) {
        var firstError = form.querySelector('.has-error input, .has-error select, .has-error textarea');
        if (firstError) { firstError.focus(); }
        return;
      }

      /* Envío real del formulario vía FormSubmit.co (formulario-a-email,
         sin backend propio). El fetch con Accept: application/json evita
         la página intermedia de confirmación y devuelve JSON directo. */
      var submitBtn = form.querySelector('button[type="submit"]');
      var originalBtnText = submitBtn ? submitBtn.textContent : '';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Enviando...';
      }

      var formData = new FormData(form);

      fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      })
        .then(function (response) {
          if (!response.ok) { throw new Error('Envío no exitoso'); }
          if (successEl) {
            successEl.hidden = false;
            successEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
          form.reset();
        })
        .catch(function () {
          if (errorEl) {
            errorEl.hidden = false;
            errorEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
        })
        .finally(function () {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
          }
        });
    });
  }

  handleFormSubmit('tasacionForm', 'tasacionSuccess', 'tasacionError');
  handleFormSubmit('contactoForm', 'contactoSuccess', 'contactoError');

  /* -----------------------------------------------------------------------
     5. BUSCADOR SIMULADO DEL HERO
     Desplaza suavemente hasta "Propiedades" y aplica los filtros elegidos
     cuando existe un chip equivalente.
     ----------------------------------------------------------------------- */
  var heroSearchForm = document.getElementById('heroSearchForm');
  if (heroSearchForm) {
    heroSearchForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var operacion = document.getElementById('searchOperacion').value;
      var tipo = document.getElementById('searchTipo').value || 'todos';

      var opChip = document.querySelector('.filter-chip[data-filter-group="operacion"][data-filter-value="' + operacion + '"]');
      var tipoChip = document.querySelector('.filter-chip[data-filter-group="tipo"][data-filter-value="' + tipo + '"]');

      if (opChip) { opChip.click(); }
      if (tipoChip) { tipoChip.click(); }

      var target = document.getElementById('propiedades');
      if (target) { target.scrollIntoView({ behavior: 'smooth' }); }
    });
  }

  /* -----------------------------------------------------------------------
     6. UTILIDADES VARIAS
     ----------------------------------------------------------------------- */
  var yearEl = document.getElementById('year');
  if (yearEl) { yearEl.textContent = new Date().getFullYear(); }

});
