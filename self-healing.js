// Self-healing fallback for browsers with stale cached HTML
(function() {
  if (!window.__ALFARIZ_LOADED__) {
    var search = window.location.search;
    if (!search || search.indexOf('v=') === -1) {
      window.location.replace(window.location.pathname + '?v=' + Date.now() + window.location.hash);
    }
  }
})();
