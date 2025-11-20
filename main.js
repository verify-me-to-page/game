// main.js — small client helpers
document.addEventListener('DOMContentLoaded', function(){
  const y = new Date().getFullYear();
  const yEl = document.getElementById('year');
  if (yEl) yEl.textContent = y;
  const y2 = document.getElementById('year2');
  if (y2) y2.textContent = y;
});

// simple client-side bot-detection hint (not a replacement for server checks)
(function(){
  // discourage basic scrapers: require JS to render main content (progressive enhancement)
  const noscript = document.createElement('meta');
  noscript.name = 'x-js-enabled';
  noscript.content = '1';
  document.head.appendChild(noscript);
})();
