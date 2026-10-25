// Medición del sitio: Google Analytics 4 + píxel de Meta.
// Cuenta como contacto cada salida a WhatsApp (enlace o window.open) y como lead el formulario del informe.
(function () {
  var GA_ID = 'G-9TY1V1Y5GG';
  var PIXEL_ID = '1088594830674125';

  // Google Analytics 4
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { dataLayer.push(arguments); };
  gtag('js', new Date());
  gtag('config', GA_ID);
  var ga = document.createElement('script');
  ga.async = true;
  ga.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
  document.head.appendChild(ga);

  // Píxel de Meta (código base oficial)
  !function (f, b, e, v, n, t, s) {
    if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments) };
    if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = [];
    t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s)
  }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', PIXEL_ID);
  fbq('track', 'PageView');

  // Código de origen que va en el mensaje de WhatsApp («CODE:WEB-CRM»)
  function codigo(url) {
    try {
      var texto = new URL(url).searchParams.get('text') || '';
      var m = texto.match(/CODE:([A-Z0-9-]+)/);
      return m ? m[1] : 'SIN-CODIGO';
    } catch (e) { return 'SIN-CODIGO'; }
  }

  function contactoWhatsApp(url) {
    var code = codigo(url);
    gtag('event', 'generate_lead', { method: 'whatsapp', lead_source: code, page_path: location.pathname });
    fbq('track', 'Contact', { content_name: code, content_category: 'whatsapp' });
  }

  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href*="wa.me/"]');
    if (a) contactoWhatsApp(a.href);
  }, true);

  // El formulario «Que me llamen» abre WhatsApp con window.open
  var abrir = window.open;
  window.open = function (url) {
    if (typeof url === 'string' && url.indexOf('wa.me/') !== -1) contactoWhatsApp(url);
    return abrir.apply(window, arguments);
  };

  // Formulario del informe (Mautic): lead cuando aparece el mensaje de confirmación
  document.addEventListener('DOMContentLoaded', function () {
    var aviso = document.getElementById('mauticform_informe_wh_message');
    if (!aviso || !('MutationObserver' in window)) return;
    var enviado = false;
    new MutationObserver(function () {
      if (enviado || !aviso.textContent.trim()) return;
      enviado = true;
      gtag('event', 'generate_lead', { method: 'email', lead_source: 'WEB-INFORME-FORM', page_path: location.pathname });
      fbq('track', 'Lead', { content_name: 'WEB-INFORME-FORM' });
    }).observe(aviso, { childList: true, characterData: true, subtree: true });
  });
})();
