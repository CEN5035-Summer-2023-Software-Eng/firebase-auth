import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";

import {
    getAuth,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    getIdToken
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";

const screens = {
    login: document.getElementById("login"),
    signup: document.getElementById("signup"),
    recipes: document.getElementById("recipes"),
}

// hide all
for (let screen in screens) {
    screens[screen].style.display = 'none';
}

function showLogin() {
    screens.login.style.display = "block";
    screens.signup.style.display = "none";
}

function showSignup() {
    screens.login.style.display = "none";
    screens.signup.style.display = "block";
}

document.getElementById("show-login").onclick = showLogin;
document.getElementById("show-signup").onclick = showSignup;


const firebaseConfig = {
    apiKey: "AIzaSyBtk7e5GH5GA3MhhSFyH7H07XkPYOs70Yw",
    authDomain: "login-fullstackweb.firebaseapp.com",
    projectId: "login-fullstackweb",
    storageBucket: "login-fullstackweb.appspot.com",
    messagingSenderId: "74446053361",
    appId: "1:74446053361:web:05feee80383b0fe6826e50",
    measurementId: "G-3MH120QW2D"
  };

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);


onAuthStateChanged(auth, user => {
    if (user) {
        // they're signed in
        screens.login.style.display = "none";
        screens.signup.style.display = "none";
        screens.recipes.style.display = "block";

        [...document.getElementsByClassName("user-email")]
            .forEach((el => el.textContent = user.email));

        getAll();
    } else {
        // not signed in
        screens.login.style.display = "block";
        screens.signup.style.display = "none";
        screens.recipes.style.display = "none";

        [...document.getElementsByClassName("user-email")]
            .forEach((el => el.textContent = ""));
    }
})

let login_form = document.getElementById('login-form');

login_form.addEventListener('submit', (event) => {
    event.preventDefault();
    let email_input = document.getElementById("login-email");
    let password_input = document.getElementById("login-password");

    // console.log(email_input.value)
    // console.log(password_input.value)

    signInWithEmailAndPassword(auth, email_input.value, password_input.value)
        .then(userCredential => {
            console.log(userCredential);
            document.getElementById("login-feedback").textContent = "";
            email_input.value = "";
            password_input.value = "";
        }).catch(error => {
            console.log(error);
            document.getElementById("login-feedback").textContent = error.message;
            password_input.value = "";
        })
})


let signup_form = document.getElementById('signup-form');

signup_form.addEventListener('submit', (event) => {
    event.preventDefault();
    let email_input = document.getElementById("signup-email");
    let password_input = document.getElementById("signup-password");
    let confirm_password_input = document.getElementById("signup-confirm-password");

    if (password_input.value !== confirm_password_input.value) {
        return document.getElementById("signup-feedback").textContent = "Passwords must be the same!";
    }

    // console.log(email_input.value)
    // console.log(password_input.value)

    createUserWithEmailAndPassword(auth, email_input.value, password_input.value)
        .then(userCredential => {
            console.log(userCredential);
            document.getElementById("signup-feedback").textContent = "";
            email_input.value = "";
            password_input.value = "";
            confirm_password_input.value = "";
        }).catch(error => {
            console.log(error);
            document.getElementById("signup-feedback").textContent = error.message;
            password_input.value = "";
            confirm_password_input.value = "";
        })
})

function getAll() {
    getIdToken(auth.currentUser)
        .then(token => {
            axios.get("http://localhost:5000/recipes", {
                headers: {
                    'Authorization': token,
                }
            }).then(response => {
                if (response.data && response.data.recipes) {
                    let contents = document.getElementById("get-contents");
                    contents.innerHTML = "";
                    for (let recipe of response.data.recipes) {
                        let p = document.createElement("p");

                        p.appendChild(document.createTextNode("Title: " + recipe.title))
                        p.appendChild(document.createElement("br"))
                        p.appendChild(document.createTextNode("Description: " + recipe.description))
                        p.appendChild(document.createElement("br"))
                        p.appendChild(document.createTextNode("Steps: " + recipe.steps))
                        p.classList.add("recipe");
                        contents.appendChild(p);
                    }

                } else {
                    console.log("uh?");
                }
            }).catch(err => {
                console.log(err.message);
                console.log("Could not make request! Error: " + (err.response && err.response.data && err.response.data.message) ? err.response.data.message : err.message)
            })
        }).catch(err => {
            setFeedback("Could not get ID token... are you logged in?")
            console.error("error! ", err.message)
        })
}


document.getElementById("signout-btn").addEventListener('click', (event) => {
    signOut(auth)
})