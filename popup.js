// Funktion zum Speichern der Daten
function saveCredentials(event) {
  event.preventDefault(); // Verhindert das Neuladen der Seite beim Absenden
  
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  
  // Speichert die Daten im Chrome-Speicher
  chrome.storage.sync.set({ email: email, password: password }, () => {
    const status = document.getElementById('status');
    status.textContent = 'Gespeichert!';
    setTimeout(() => {
      status.textContent = '';
    }, 2000); // Nachricht nach 2 Sekunden ausblenden
  });
}

// Funktion zum Laden der gespeicherten Daten beim Öffnen des Popups
function loadCredentials() {
  chrome.storage.sync.get(['email', 'password'], (result) => {
    if (result.email) {
      document.getElementById('email').value = result.email;
    }
    if (result.password) {
      document.getElementById('password').value = result.password;
    }
  });
}

// Event Listener hinzufügen
document.addEventListener('DOMContentLoaded', loadCredentials);
document.getElementById('credentialsForm').addEventListener('submit', saveCredentials);