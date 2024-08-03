

async function checkUsername() {
    const username = document.getElementById('username').value;

    if(username)
    {
        const response = await fetch(`http://localhost:3000/check-username?username=${username}`);
        console.log(username);
        const data = await response.json();
        const messageElement = document.getElementById('username-message');
        messageElement.textContent = 'Username is already taken';
        console.log(username);
        if (data.exists) {
            messageElement.textContent = 'Username is already taken';
            messageElement.style.color = 'red';
        } else {
            messageElement.textContent = 'Username is available';
            messageElement.style.color = 'green';
        }
    } else
    {
        document.getElementById('username-message').textContent = '';
    }
}

