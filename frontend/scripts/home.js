// Document variables
const greetText = document.getElementById("greetText");
const infoText = document.getElementById("infoText");
const navbarCalendar = document.getElementById("navbarCalendar");
const navbarHome = document.getElementById("navbarHome");
const navbarSettings = document.getElementById("navbarSettings");


// Functions
async function tokenLogin(csrfToken) {
    if (!csrfToken) window.location.href = "/frontend/login.html";

    try {
        // req to backend
        const result = await fetch("http://localhost:3000/api/auth/token/", {
            method: "POST",
            headers: { "X-Csrf-Token": csrfToken },
            credentials: 'include'
        });

        const data = await result.json();   
        console.log(data);
        return data;

    } catch (error) {
        window.location.href = "/frontend/login.html";
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

async function handleLogin() {
    let csrfToken = findCsrf();

    //redirect to login page
    if (!csrfToken) window.location.href = "/frontend/login.html";

    //attempt user login + parse data if login succesfol
    let user = await tokenLogin(csrfToken);


    renderData(user.message);
}

function renderData(user) {
    greetText.innerHTML = `Welcome ${user.firstName} ${user.lastName}`;
}



//event listeners
navbarCalendar.addEventListener("click", () => {
    window.location.href = "/frontend/calendar.html"
});


navbarSettings.addEventListener("click", () => {
    window.location.href = "/frontend/settings.html"
});



//execute when page loads:
handleLogin();