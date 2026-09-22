// Gas Designs — site behaviour.
// Two jobs: the mobile menu, and pre-filling the quote form from ?service=.

(function () {
  'use strict';

  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    nav.addEventListener('click', function (event) {
      if (event.target.tagName === 'A') {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && nav.classList.contains('is-open')) {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
      }
    });
  }

  var select = document.getElementById('service');
  if (select) {
    var requested = new URLSearchParams(window.location.search).get('service');
    if (requested) {
      var wanted = requested.trim().toLowerCase();
      for (var i = 0; i < select.options.length; i += 1) {
        var option = select.options[i];
        if (option.value.toLowerCase() === wanted || option.dataset.slug === wanted) {
          select.selectedIndex = i;
          break;
        }
      }
    }
  }
})();
