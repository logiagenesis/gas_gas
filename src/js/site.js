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

  // The floating WhatsApp button must never sit on top of the quote form's
  // submit button or a footer link. It is fixed, so whether it covers one of
  // them depends on the scroll position: check for a real collision and step
  // the button aside only while there is one.
  var floater = document.querySelector('.wa-float');
  if (floater) {
    var guarded = [].slice.call(document.querySelectorAll('.quote-form button[type="submit"], .site-footer a'));
    var margin = 8;
    var queued = false;

    var settle = function () {
      queued = false;
      var box = floater.getBoundingClientRect();
      var top = box.top - margin;
      var bottom = box.bottom + margin;
      var left = box.left - margin;
      var right = box.right + margin;
      var viewportHeight = window.innerHeight || document.documentElement.clientHeight;

      var clash = guarded.some(function (element) {
        var rect = element.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return false;
        if (rect.bottom < 0 || rect.top > viewportHeight) return false;
        return !(rect.right < left || rect.left > right || rect.bottom < top || rect.top > bottom);
      });

      floater.classList.toggle('is-tucked', clash);
    };

    var schedule = function () {
      if (queued) return;
      queued = true;
      window.requestAnimationFrame(settle);
    };

    if (guarded.length) {
      window.addEventListener('scroll', schedule, { passive: true });
      window.addEventListener('resize', schedule);
      window.addEventListener('load', schedule);
      schedule();
    }
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
