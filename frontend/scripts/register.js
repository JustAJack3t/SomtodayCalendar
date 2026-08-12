// Document variables
const firstNameInput = document.getElementById("firstNameInput");
const lastNameInput = document.getElementById("lastNameInput");
const eMailInput = document.getElementById("eMailInput");
const passwordInput = document.getElementById("passwordInput");
const errorMessage = document.getElementById("errorMessage");
const createButton = document.getElementById("createButton");
const loadingBar = document.getElementById("loadingBar");



// Functions
async function createAccount(userFirstName, userLastName, userEMail, userPassword) {
    if (!userFirstName || !userLastName || !userEMail || !userPassword) return 1;

    // start loading animation
    startAnimation();

    try {
        // req to backend
        const result = await fetch("http://localhost:3000/api/auth/register/", {
            method: "POST",
            body: JSON.stringify({
                firstName: userFirstName,
                lastName: userLastName,
                eMail: userEMail,
                password: userPassword
            }),
            headers: { "Content-Type": "application/json" },
            credentials: "include"
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
        return 3;
    }
}


async function errorHandling(func) {
    if (!firstNameInput.value) firstNameInput.style.borderColor = "rgb(255, 88, 88)"; else firstNameInput.style.borderColor = "rgb(31, 31, 31)";
    if (!lastNameInput.value) lastNameInput.style.borderColor = "rgb(255, 88, 88)"; else lastNameInput.style.borderColor = "rgb(31, 31, 31)";
    if (!eMailInput.value) eMailInput.style.borderColor = "rgb(255, 88, 88)"; else eMailInput.style.borderColor = "rgb(31, 31, 31)";
    if (!passwordInput.value) passwordInput.style.borderColor = "rgb(255, 88, 88)"; else passwordInput.style.borderColor = "rgb(31, 31, 31)";

    res = await func;
    if (res == 1) {
        errorMessage.innerText = "Missing Inputs"; 
        errorMessage.style.position = "inherit";
    }
    else if (res == 2) {
        errorMessage.innerText = "An Error Occurred"; 
        errorMessage.style.position = "inherit";
    }
    else if (res == 3) {
        errorMessage.innerText = "Failed To Connect To Database"; 
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
createButton.addEventListener("click", () => {
    console.log(`Attempted to log in`);

    errorHandling(createAccount(firstNameInput.value, lastNameInput.value, eMailInput.value, passwordInput.value));
});