/* ElitePropX — progressive enhancement only. Nothing here is required to read the site. */
(function () {
  'use strict';

  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('primary-nav');

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A' && nav.classList.contains('is-open')) {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  // Smooth in-page anchors while respecting reduced motion.
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#"]');
    if (!a) return;
    var id = a.getAttribute('href');
    if (id.length < 2) return;
    var target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    history.pushState(null, '', id);
  });

  // Enquiry form: submit in place so a failed send never loses what was typed.
  // Without JavaScript the form posts natively and follows the redirect field.
  var form = document.querySelector('form[data-enquiry]');
  if (form && window.fetch) {
    var status = form.querySelector('.form-status');
    var submit = form.querySelector('button[type="submit"]');
    var label = submit ? submit.textContent : '';
    // Forms can word their own confirmation; the enquiry wording is the default.
    var successText =
      form.getAttribute('data-success') ||
      'Thank you — your enquiry has been sent. You will get a reply at the address you gave, usually within one business day.';
    var sentLabel = form.getAttribute('data-sent') || 'Enquiry sent';

    function say(text, kind) {
      if (!status) return;
      status.textContent = text;
      status.className = 'form-status' + (kind ? ' is-' + kind : '');
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      form.querySelectorAll('[aria-invalid]').forEach(function (el) {
        el.removeAttribute('aria-invalid');
      });
      if (!form.checkValidity()) {
        var first = form.querySelector(':invalid');
        if (first) first.setAttribute('aria-invalid', 'true');
        form.reportValidity();
        say('Please fill in the highlighted fields.', 'error');
        return;
      }

      var data = new FormData(form);
      data.delete('redirect');
      if (submit) {
        submit.disabled = true;
        submit.textContent = 'Sending…';
      }
      say('', '');

      fetch(form.action, { method: 'POST', body: data, headers: { Accept: 'application/json' } })
        .then(function (res) { return res.json().catch(function () { return {}; }).then(function (body) { return { ok: res.ok, body: body }; }); })
        .then(function (r) {
          if (r.ok && r.body.success) {
            form.reset();
            say(successText, 'success');
            if (submit) {
              submit.disabled = true;
              submit.textContent = sentLabel;
            }
            if (status) status.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
            return;
          }
          throw new Error((r.body && r.body.message) || 'send failed');
        })
        .catch(function () {
          if (submit) {
            submit.disabled = false;
            submit.textContent = label;
          }
          if (!status) return;
          status.className = 'form-status is-error';
          status.textContent = 'That did not send. Please try again, or email ';
          var link = document.createElement('a');
          link.href = 'mailto:support@elitepropx.com';
          link.textContent = 'support@elitepropx.com';
          status.appendChild(link);
          status.appendChild(document.createTextNode(' directly — the message you typed is still here.'));
        });
    });
  }
})();
