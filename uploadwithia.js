const SUPABASE_URL = "https://waljqaxkbvzidkrzbcbz.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndhbGpxYXhrYnZ6aWRrcnpiY2J6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg4OTA3MDcsImV4cCI6MjA4NDQ2NjcwN30.9lBgfkJMCLk2D-gXjxj9bV5b5x-HZxY_cEBrdlsExBw";

const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const url = document.getElementById("url");
const tags = document.getElementById("tags");
const description = document.getElementById("description");
const msg = document.getElementById("msg");

document.getElementById("publish").onclick = async () => {

  const fileInput = document.getElementById("fileInput");
  const file = fileInput.files[0];

  if (!file) {
    msg.textContent = "Aucun fichier sélectionné ❌";
    return;
  }

  // limite taille 200MB (exemple)
  if (file.size > 200 * 1024 * 1024) {
    msg.textContent = "Fichier trop gros ❌";
    return;
  }

  msg.textContent = "Upload en cours...";

  // 1️⃣ Upload vers Zerostorage
  const formData = new FormData();
  formData.append("file", file);
  formData.append("title", file.name);

  try {
    const res = await fetch(
      "https://upload.zerostorage.net/api/upload/universal",
      {
        method: "POST",
        body: formData
      }
    );

    const result = await res.json();
    console.log("RESPONSE:", result);

    if (!result.success) {
      msg.textContent = "Erreur Zerostorage ❌";
      console.error(result);
      return;
    }

    // 2️⃣ Construire URL publique
    const publicUrl = "https://zerostorage.net" + result.viewUrl;

    // 3️⃣ Enregistrer dans Supabase
    const { error } = await sb.from("images_withoutia").insert({
      url: publicUrl,
      tags: tags.value,
      description: description.value
    });

    if (error) {
      msg.textContent = "Erreur base ❌";
      console.error(error);
      return;
    }

    msg.textContent = "Publié, merci :D";

  } catch (err) {
    console.error(err);
    msg.textContent = "Erreur upload ❌";
  }
};