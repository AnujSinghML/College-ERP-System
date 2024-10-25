
    document.getElementById("login-form").addEventListener("submit", function(event) {
      event.preventDefault();  
      const data = {
        role: document.getElementById("role").value,
        username: document.getElementById("username").value,
        password: document.getElementById("password").value,
      };

	  fetch('http://localhost:3000/login', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(data)
	  })
	  .then(response => {
		if (response.status === 401) {
		  
		  document.getElementById("message").textContent = "Login failed: Invalid username or password";
		} else if (!response.ok) {
		  
		  throw new Error('Error during login');
		} else {
		  return response.json();
		}
	  })
	  .then((data) => {
		if (data && data.success) {
		 
		  window.location.href = data.redirectUrl;
		}
	  })
	  .catch((error) => {
		console.error('Error during login:', error);
		document.getElementById("message").textContent = "Error during login";
	  });
	  
    });
 