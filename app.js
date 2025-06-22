// Firebase initialization
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyA9jd74SINKKmkHhmvQfTx0nKiL7NTUF8w",
  authDomain: "tunera-b3efa.firebaseapp.com",
  projectId: "tunera-b3efa",
  storageBucket: "tunera-b3efa.appspot.com",
  messagingSenderId: "4289124219",
  appId: "1:4289124219:web:507e539fe707e35b814fde",
  measurementId: "G-0HLQQKY6L5"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Handle Registration
const registerForm = document.getElementById("registerForm");
if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("registerEmail").value;
    const password = document.getElementById("registerPassword").value;
    const nickname = document.getElementById("nickname").value;

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      localStorage.setItem("nickname", nickname);
      alert("Registration successful!");
      window.location.href = "#home";
    } catch (error) {
      alert(error.message);
    }
  });
}

// Handle Login
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      alert("Login successful!");
      window.location.href = "#home";
    } catch (error) {
      alert(error.message);
    }
  });
}

// Show nickname if logged in
onAuthStateChanged(auth, (user) => {
  const displayName = document.getElementById("displayName");
  if (user && displayName) {
    const nickname = localStorage.getItem("nickname") || "User";
    displayName.textContent = `Welcome, ${nickname}!`;
  }
});

// Handle logout
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    signOut(auth);
    alert("Logged out successfully");
    window.location.reload();
  });
}

// Password reset
const resetBtn = document.getElementById("resetPasswordBtn");
if (resetBtn) {
  resetBtn.addEventListener("click", () => {
    const email = prompt("Enter your email for password reset:");
    if (email) {
      sendPasswordResetEmail(auth, email)
        .then(() => alert("Reset email sent!"))
        .catch((err) => alert(err.message));
    }
  });
}

// Show Artists by Genre
async function loadArtists() {
  const res = await fetch("artists.json");
  return res.json();
}

window.showSuggestions = async function () {
  const artists = await loadArtists();
  const genre = document.getElementById("genreSelect").value;
  const container = document.getElementById("artistGrid");
  container.innerHTML = "";

  if (!genre || !artists[genre]) {
    container.innerHTML = "<p>Please select a valid genre.</p>";
    return;
  }

  artists[genre].forEach((artist) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${artist.image}" alt="${artist.name}" />
      <h3>${artist.name}</h3>
      <a href="${artist.link}" target="_blank">Official Page</a>
    `;
    container.appendChild(card);
  });
};
