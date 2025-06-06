// Wir packen den gesamten Code in eine anonyme Funktion (IIFE).
(() => {
  const logPrefix = '[HSLU Auto-Login]';

  const waitForElement = (selector, callback) => {
    const interval = setInterval(() => {
      const element = document.querySelector(selector);
      if (element) { clearInterval(interval); callback(element); }
    }, 200);
  };

  chrome.storage.sync.get(['email', 'password'], (credentials) => {
    if (!credentials.email || !credentials.password) { return; }

    const currentUrl = window.location.href;

    // --- SCHRITT 1: Die Startseite (elearning.hslu.ch) ---
    if (currentUrl.includes('elearning.hslu.ch/ilias/login.php')) {
      console.log(`${logPrefix} Schritt 1: Startseite. Klicke Login.`);
      waitForElement('a.il-openid-login-button', (loginButton) => {
        loginButton.click();
      });
      return;
    }
    
    // --- SCHRITT 2: Die EMPFINDLICHE Seite (keycloak.hslu.ch) ---
    if (currentUrl.includes('keycloak.hslu.ch/realms/hslu/protocol/openid-connect/auth')) {
      console.log(`${logPrefix} Schritt 2: Empfindliche Seite erkannt. Führe nur Navigation durch.`);
      
      waitForElement('#social-edu-id', (switchButton) => {
        // Lies die Ziel-URL aus dem Link.
        const destination = switchButton.href;
        console.log(`${logPrefix} Ziel-URL gefunden: ${destination}`);
        
        // Navigiere direkt zu dieser URL. Dies verletzt keine Sicherheitsregeln.
        window.location.href = destination;
      });
      return;
    }

    // --- SCHRITT 3: Die finale Login-Seite (login.eduid.ch) ---
    if (currentUrl.includes('login.eduid.ch')) {
      console.log(`${logPrefix} Schritt 3: Finale Login-Seite.`);
      
      waitForElement('#username', (emailInput) => {
        emailInput.value = credentials.email;
        setTimeout(() => { document.querySelector('button#button-submit')?.click(); }, 300);
      });

      waitForElement('#password', (passwordInput) => {
        passwordInput.value = credentials.password;
        setTimeout(() => { document.querySelector('button#button-proceed')?.click(); }, 300);
      });
    }
  });
})();