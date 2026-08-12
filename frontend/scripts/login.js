// Document variables
const eMailInput = document.getElementById("eMailInput");
const passwordInput = document.getElementById("passwordInput");
const errorMessage = document.getElementById("errorMessage");
const loginButton = document.getElementById("loginButton");
const loadingBar = document.getElementById("loadingBar");



// Functions
async function loginAccount(userEMail, userPassword) {
    if (!userEMail || !userPassword) return 1;

    // start loading animation
    startAnimation();

    try {
        // req to backend
        const result = await fetch("http://localhost:3000/api/auth/login/", {
            method: "POST",
            body: JSON.stringify({
                eMail: userEMail,
                password: userPassword
            }),
            headers: { "Content-Type": "application/json" },
            credentials: 'include'
        });

        const status = await new Promise((resolve) => {
            setTimeout(async () => {
                if (result.status == 401) {
                    resolve(3); 
                    stopAnimation();
                    return;
                }
                else if (!result.ok) {
                    resolve(2); 
                    stopAnimation();
                    return;
                }

                const data = await result.json();
                console.log(data);
                stopAnimation();

                resolve(0);
            }, 2000)
        });

        if (status === 0) {
            window.location.href = "/frontend/home.html"
        } else {
            return status;
        }

    } catch (error) {
        stopAnimation();
        return 2;
    }
}

async function tokenLogin(csrfToken) {
    if (!csrfToken) return 1;

    try {
        // req to backend
        const result = await fetch("http://localhost:3000/api/auth/token/", {
            method: "POST",
            headers: { "X-Csrf-Token": csrfToken },
            credentials: 'include'
        });

        const data = await result.json();   
        console.log(data);

        window.location.href = "/frontend/home.html"

    } catch (error) {
        return 2;
    }
}

function findCsrf() {
    let cookie = document.cookie;

    if (cookie.includes("csrf_token")) {
        let clist = [];
        clist = document.cookie.split("; ");

        for (let i = 0; i < clist.length; i++) {
            if (clist[i].includes("csrf_token")) {
                let csrfToken = clist[i].split("=")[1];

                return csrfToken;
            }
        }
    } else {
        return false;
    }
}

async function errorHandling(func) {
    if (!eMailInput.value) eMailInput.style.borderColor = "rgb(255, 88, 88)"; else eMailInput.style.borderColor = "rgb(31, 31, 31)";
    if (!passwordInput.value) passwordInput.style.borderColor = "rgb(255, 88, 88)"; else passwordInput.style.borderColor = "rgb(31, 31, 31)";

    res = await func;
    console.log(res);
    if (res == 1) {
        errorMessage.innerText = "Missing Inputs"; 
        errorMessage.style.position = "inherit";
    }
    else if (res == 2) {
        errorMessage.innerText = "An Error Occurred"; 
        errorMessage.style.position = "inherit";
    }
    else if (res == 3) {
        eMailInput.style.borderColor = "rgb(255, 88, 88)";
        passwordInput.style.borderColor = "rgb(255, 88, 88)";
        errorMessage.innerText = "Invalid Credentials"; 
        errorMessage.style.position = "inherit";
    }
    else {
        errorMessage.innerText = ""; 
        errorMessage.style.position = "absolute";
    }
}


function startAnimation() {
    console.log(`start animation`);
    loadingBar.style.backgroundColor = "rgb(112, 252, 158)";
    loadingBar.style.animationPlayState = "running";
}


function stopAnimation() {
    loadingBar.style.animationPlayState = "paused";
    loadingBar.style.backgroundColor = "rgba(0, 0, 0, 0)"
    console.log(`stop animation`);
}



// Event listeners
loginButton.addEventListener("click", () => {
    console.log(`Attempted to log in`);

    errorHandling(loginAccount(eMailInput.value, passwordInput.value));
});


//execute when page loads:
let csrfToken = findCsrf();
if (csrfToken) {
    tokenLogin(csrfToken)
} 