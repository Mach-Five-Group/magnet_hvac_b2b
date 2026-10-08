// This page uses the hosted Magnet, owned by the Blackhawk Supply client.
const script = document.createElement('script');
script.src = 'https://machfivemagnet-saas.onrender.com/m5t/v5/coreSnippet?appguid=037f06d2-a862-414d-ac5b-44db4ee5bb85';
script.async = true;
const revealFallback = () => {
  if (document.getElementById('m5m-magnet-inline')) return;
  document.getElementById('guide-loading').hidden = true;
  document.getElementById('guide-fallback').hidden = false;
};
script.onerror = revealFallback;
document.head.appendChild(script);
setTimeout(revealFallback, 15000);
