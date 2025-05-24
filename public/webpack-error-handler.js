// Webpack Error Handler
// This script catches errors related to chunk loading and redirects to our error page

(function() {
  // Save the original error handler
  const originalErrorHandler = window.onerror;

  // Function to handle chunk loading errors
  function handleChunkError(message, source, lineno, colno, error) {
    if (
      (message && (
        message.includes('chunk') ||
        message.includes('script') ||
        message.includes('module') ||
        message.includes('loading') ||
        message.includes('failed')
      )) ||
      (error && error.message && (
        error.message.includes('chunk') ||
        error.message.includes('script') ||
        error.message.includes('module') ||
        error.message.includes('loading') ||
        error.message.includes('failed')
      ))
    ) {
      console.error('Webpack chunk loading error detected:', message, error);
      
      // Redirect to our error page with error details
      const errorPage = '/webpack-error.html';
      const params = new URLSearchParams();
      
      params.set('message', message || 'Unknown error');
      params.set('chunk', source || 'Unknown source');
      params.set('url', window.location.href);
      
      // Redirect to the error page with error details
      window.location.href = `${errorPage}?${params.toString()}`;
      
      // Return true to prevent default error handling
      return true;
    }
    
    // If it's not a chunk loading error, call the original error handler
    if (originalErrorHandler) {
      return originalErrorHandler.call(window, message, source, lineno, colno, error);
    }
    
    // Default behavior
    return false;
  }

  // Override the global error handler
  window.onerror = handleChunkError;

  // Handle unhandledrejection for Promise-based errors
  window.addEventListener('unhandledrejection', function(event) {
    const err = event.reason;
    if (err && (
      (err.message && (
        err.message.includes('chunk') ||
        err.message.includes('script') ||
        err.message.includes('module') ||
        err.message.includes('loading') ||
        err.message.includes('failed')
      )) ||
      (err.name && err.name.includes('ChunkLoadError'))
    )) {
      console.error('Webpack chunk loading promise rejection:', err);
      
      // Redirect to our error page with error details
      const errorPage = '/webpack-error.html';
      const params = new URLSearchParams();
      
      params.set('message', err.message || 'Promise rejection');
      params.set('chunk', err.name || 'UnhandledRejection');
      params.set('url', window.location.href);
      
      // Redirect to the error page with error details
      window.location.href = `${errorPage}?${params.toString()}`;
      
      // Prevent the default handling
      event.preventDefault();
    }
  });

  // Inject special handling for script onload/onerror
  // This helps catch issues with dynamic imports
  const originalCreateElement = document.createElement;
  document.createElement = function() {
    const element = originalCreateElement.apply(document, arguments);
    
    // If this is a script element, add special error handling
    if (arguments[0]?.toLowerCase() === 'script') {
      const originalOnError = element.onerror;
      
      element.onerror = function(error) {
        console.error('Script loading error:', element.src, error);
        
        // Check if this looks like a webpack chunk
        if (element.src && (
          element.src.includes('chunk') ||
          element.src.includes('webpack') ||
          element.src.includes('.js')
        )) {
          // Redirect to error page
          const errorPage = '/webpack-error.html';
          const params = new URLSearchParams();
          
          params.set('message', 'Failed to load script');
          params.set('chunk', element.src);
          params.set('url', window.location.href);
          
          // Redirect after a small delay to allow other scripts to load
          setTimeout(() => {
            window.location.href = `${errorPage}?${params.toString()}`;
          }, 100);
          
          return true;
        }
        
        // Call original handler if exists
        if (originalOnError) {
          return originalOnError.apply(this, arguments);
        }
      };
    }
    
    return element;
  };

  console.log('Webpack error handler initialized');
})(); 