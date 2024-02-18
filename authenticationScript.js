document.getElementById("loginBtn").addEventListener("click", function(event) {
    event.preventDefault();
    

    // Get the email and password from the form
    let email = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    // Construct the request body
    let requestBody = {
        email: email,
        password: password
    };

    let url = "http://localhost:8080/login";

    authenticate(url , requestBody);
});



function authenticate(url , Objbody) {

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(Objbody)
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error("Invalid");
        }
    })
    .then(data => {
        console.log(data.jwtToken);
        window.location.href = `homePage.html?token=${data.jwtToken}`;
    })
    .catch(error => {
        alert("Invalid Credentails");
    });
    
}
