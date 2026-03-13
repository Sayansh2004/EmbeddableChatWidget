(function () {
  // Find the script tag that loaded this file
  const scripts = document.getElementsByTagName('script');
  let currentScript = null;
  let widgetId = null;

  for (let i = 0; i < scripts.length; i++) {
    const src = scripts[i].src;
    if (src && src.includes('chatbot.js')) {
      currentScript = scripts[i];
      widgetId = currentScript.getAttribute('data-widget-id');
      if (widgetId) break;
    }
  }

  if (!widgetId) {
    console.error('Chatbot Widget: Missing data-widget-id on script tag.');
    return;
  }

  // Construct the URL for the iframe
  // Use the origin from the script src to support both dev and prod
  const scriptUrl = new URL(currentScript.src);
  const iframeUrl = `${scriptUrl.origin}/embed/widget/${widgetId}`;

  // Create the iframe
  const iframe = document.createElement('iframe');
  iframe.src = iframeUrl;
  
  // Style the iframe to look like a fixed widget in the bottom corner
  Object.assign(iframe.style, {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    width: '100px', // Start small (assuming closed)
    height: '100px',
    border: 'none',
    zIndex: '999999',
    backgroundColor: 'transparent',
    colorScheme: 'light',
    transition: 'width 0.3s ease, height 0.3s ease',
  });

  // Listen for resize messages from the widget
  window.addEventListener('message', function(event) {
    if (event.data && event.data.type === 'WIDGET_RESIZE') {
      if (event.data.isOpen) {
        iframe.style.width = '380px';
        iframe.style.height = '600px';
      } else {
        iframe.style.width = '100px';
        iframe.style.height = '100px';
      }
    }
  });

  document.body.appendChild(iframe);
})();
