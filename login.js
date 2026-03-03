const SUPABASE_URL = window.SUPABASE_URL;
const SUPABASE_ANON_KEY = window.SUPABASE_ANON_KEY;

if (!window.supabase) {
  console.error("Supabase SDK pas chargé (CDN manquant).");
}

const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const email = document.getElementById("email");
const password = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");
const signupBtn = document.getElementById("signupBtn");
const withoutiaBtn = document.getElementById("withoutiaBtn");
const forgotBtn = document.getElementById("forgot");
const msg = document.getElementById("msg");

function showMsg(text, type) {
  msg.className = type;
  msg.textContent = text;
  msg.style.display = "block";
}

function setLoading(state) {
  loginBtn.disabled = state;
  signupBtn.disabled = state;
}

/* ✅ LOGIN */
loginBtn.onclick = async () => {
  if (!email.value || !password.value) {
    showMsg("Champs manquants", "err");
    return;
  }

  setLoading(true);

  const { data, error } = await sb.auth.signInWithPassword({
    email: email.value.trim(),
    password: password.value
  });

  setLoading(false);

  if (error) {
    showMsg(error.message, "err");
    return;
  }

  showMsg("Connecté ✅", "ok");
  setTimeout(() => (location.href = "withoutia.html"), 500);
};

/* ✅ SIGNUP */
signupBtn.onclick = async () => {
  if (!email.value || !password.value) {
    showMsg("Champs manquants", "err");
    return;
  }

  setLoading(true);

  const { data, error } = await sb.auth.signUp({
    email: email.value.trim(),
    password: password.value
  });

  setLoading(false);

  if (error) {
    showMsg(error.message, "err");
    return;
  }

  // si email confirmation ON, session = null
  if (!data.session) {
    showMsg("Compte créé ✅ (si la confirmation email est activée, check tes mails)", "ok");
    return;
  }

  showMsg("Compte créé + connecté ✅", "ok");
  setTimeout(() => (location.href = "withoutia.html"), 700);
};

/* ✅ FORGOT PASSWORD */
forgotBtn.onclick = async (e) => {
  e.preventDefault();

  if (!email.value) {
    showMsg("Entre ton email", "err");
    return;
  }

  const { error } = await sb.auth.resetPasswordForEmail(email.value.trim());
  if (error) showMsg(error.message, "err");
  else showMsg("Email envoyé ✅", "ok");
};
