window.onload = function() {
  const ui = SwaggerUIBundle({
    url: "/api-docs/swagger.json",
    dom_id: '#swagger-ui',
    deepLinking: true,
    presets: [
      SwaggerUIBundle.presets.apis,
      SwaggerUIStandalonePreset
    ],
    plugins: [
      SwaggerUIBundle.plugins.DownloadUrl
    ],
    layout: "StandaloneLayout"
  });

  window.ui = ui;

  // Load the token from localStorage if it exists
  const token = localStorage.getItem('token');
  if (token) {
    ui.authActions.authorize({
      bearerAuth: {
        name: "bearerAuth",
        schema: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        },
        value: token
      }
    });
  }

  // Add event listener to save token when authorized
  ui.getSystem().on('auth-wrapper-component', function() {
    const authorizeBtn = document.querySelector('.auth-wrapper .authorize');
    const unlockIcon = document.querySelector('.auth-wrapper .unlocked');
    
    authorizeBtn.addEventListener('click', function() {
      setTimeout(() => {
        const token = document.querySelector('.auth-container input').value;
        localStorage.setItem('token', token);
      }, 100);
    });

    unlockIcon.addEventListener('click', function() {
      localStorage.removeItem('token');
    });
  });
};
