document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('registerForm').addEventListener('submit', function(event) {
    event.preventDefault();  // Empêche le rechargement de la page
  
    // Récupérer les valeurs des champs
    const username = document.getElementById('username').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
  
    // Requête POST
    fetch('http://192.168.65.103:5560/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
        email: email,
        password: password
      })
    })
    .then(response => response.json())
    .then(data => {
      const resultLabel = document.getElementById('result_label');
      
      if (data.success) {
        // Succès : utilisateur créé
        resultLabel.textContent = 'Utilisateur créé avec succès !';
        resultLabel.style.color = 'green';
        
        // Vider les champs
        document.getElementById('username').value = '';
        document.getElementById('register-email').value = '';
        document.getElementById('register-password').value = '';
      } else {
        // Gestion des différents types d'erreurs
        if (data.error === 'username_taken') {
          resultLabel.textContent = 'Nom d\'utilisateur déjà pris !';
        } else if (data.error === 'email_taken') {
          resultLabel.textContent = 'Email déjà pris !';
        } else {
          resultLabel.textContent = 'Échec de l\'enregistrement. Réessayez.';
        }
        resultLabel.style.color = 'red';
      }
    })
    .catch(error => {
      // Gérer les erreurs réseau ou autres
      const resultLabel = document.getElementById('result_label');
      resultLabel.textContent = 'Erreur réseau, veuillez réessayer.';
      resultLabel.style.color = 'red';
    });
  });
});