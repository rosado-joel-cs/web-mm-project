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

  // Highlight current page in nav.
  // Resolve each link's href against the actual current URL so links that
  // share the same filename in different folders (e.g. "about/index.html"
  // vs "index.html") don't both get marked active.
  var currentPath = window.location.pathname.replace(/^\/+/, '');

  document.querySelectorAll('.main-nav a[href]').forEach(function (a) {
    var href = a.getAttribute('href');
    var resolvedPath = new URL(href, window.location.href).pathname.replace(/^\/+/, '');
    if (resolvedPath === currentPath) a.classList.add('active');
  });

  // Keep "About Us" highlighted whenever we're on ANY page inside the
  // about/ section (Our Story, Meet Our Teachers, News), even though
  // those are separate pages and only one of them can match exactly above.
  var currentFolderPath = new URL('.', window.location.href).pathname.replace(/^\/+/, '');
  if (currentFolderPath.indexOf('about/') !== -1 || currentPath.indexOf('about/') === 0) {
    var aboutTopLink = document.querySelector('.has-dropdown > a');
    if (aboutTopLink) aboutTopLink.classList.add('active');
  }

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

  // ---------- Live prayer times (Aladhan API — Atlantic City, NJ, ISNA method) ----------
  function formatTime12h(time24) {
    if (!time24) return '--:--';
    var cleanTime = time24.split(' ')[0]; // strip any timezone suffix Aladhan appends
    var parts = cleanTime.split(':').map(Number);
    var hours = parts[0], minutes = parts[1];
    var period = hours >= 12 ? 'PM' : 'AM';
    var hours12 = hours % 12 || 12;
    return hours12 + ':' + minutes.toString().padStart(2, '0') + ' ' + period;
  }

  function fetchPrayerTimes() {
    // Atlantic City, NJ coordinates. method=2 = Islamic Society of North America (ISNA).
    var apiUrl = 'https://api.aladhan.com/v1/timings?latitude=39.3643&longitude=-74.4229&method=2';

    fetch(apiUrl)
      .then(function (response) { return response.json(); })
      .then(function (data) {
        var timings = data && data.data && data.data.timings;
        if (!timings) return;

        var ids = {
          Fajr: 'fajr-time',
          Dhuhr: 'dhuhr-time',
          Asr: 'asr-time',
          Maghrib: 'maghrib-time',
          Isha: 'isha-time'
        };
        Object.keys(ids).forEach(function (prayer) {
          var el = document.getElementById(ids[prayer]);
          if (el) el.textContent = formatTime12h(timings[prayer]);
        });
      })
      .catch(function (error) {
        console.error('Error fetching prayer times:', error);
      });
  }

  fetchPrayerTimes();
});