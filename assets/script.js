document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.main-nav');

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  // Mobile: tap "About Us" to expand its dropdown instead of navigating away
  document.querySelectorAll('.has-dropdown > a').forEach(function (link) {
    link.addEventListener('click', function (e) {
      if (window.matchMedia('(max-width: 940px)').matches) {
        var parent = link.parentElement;
        var alreadyOpen = parent.classList.contains('open');
        if (!alreadyOpen) {
          e.preventDefault();
          document.querySelectorAll('.has-dropdown').forEach(function (d) { d.classList.remove('open'); });
          parent.classList.add('open');
        }
      }
    });
  });

  // Highlight current page in nav
  var here = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.main-nav a[href]').forEach(function (a) {
    var target = a.getAttribute('href').split('/').pop();
    if (target === here) a.classList.add('active');
  });

  // Simple pill filters (news / bookstore)
  document.querySelectorAll('[data-filter-group]').forEach(function (group) {
    var buttons = group.querySelectorAll('button');
    var targetSelector = group.getAttribute('data-filter-group');
    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        buttons.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        var value = btn.getAttribute('data-filter');
        document.querySelectorAll(targetSelector).forEach(function (item) {
          var cats = (item.getAttribute('data-category') || '').split(' ');
          item.style.display = (value === 'all' || cats.indexOf(value) > -1) ? '' : 'none';
        });
      });
    });
  });

  // Bookstore: tiny non-persistent cart counter
  var cartCount = 0;
  var cartEl = document.getElementById('cart-count');
  document.querySelectorAll('.add-to-cart').forEach(function (btn) {
    btn.addEventListener('click', function () {
      cartCount += 1;
      if (cartEl) cartEl.textContent = cartCount;
      var original = btn.textContent;
      btn.textContent = 'Added';
      setTimeout(function () { btn.textContent = original; }, 1200);
    });
  });

  // Donate page: amount chip selection fills the custom input
  document.querySelectorAll('.amount-chip').forEach(function (chip) {
    chip.addEventListener('click', function () {
      document.querySelectorAll('.amount-chip').forEach(function (c) { c.classList.remove('active'); });
      chip.classList.add('active');
      var input = document.getElementById('custom-amount');
      if (input) input.value = chip.getAttribute('data-amount');
    });
  });
});