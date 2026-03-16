document.addEventListener("DOMContentLoaded", () => {

  console.log("JS MARCHE ✅");

  const SUPABASE_URL = "https://waljqaxkbvzidkrzbcbz.supabase.co";
  const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndhbGpxYXhrYnZ6aWRrcnpiY2J6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg4OTA3MDcsImV4cCI6MjA4NDQ2NjcwN30.9lBgfkJMCLk2D-gXjxj9bV5b5x-HZxY_cEBrdlsExBw";

  const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

  const publishBtn = document.getElementById("publish");
  const msg = document.getElementById("msg");
  const fileInput = document.getElementById("fileInput");

  if (!publishBtn) {
    console.error("Bouton #publish introuvable");
    return;
  }

  publishBtn.onclick = async () => {

    console.log("Bouton cliqué 🚀");

    if (!fileInput.files.length) {
      msg.textContent = "Sélectionne un fichier ❌";
      return;
    }

    try {

      // 🔹 Upload vers ta Edge Function
      const formData = new FormData();
      formData.append("file", fileInput.files[0]);

     const res = await fetch(
  "https://waljqaxkbvzidkrzbcbz.functions.supabase.co/upload-to-zerostorage",
  {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${SUPABASE_KEY}`
    },
    body: formData
  }
);

      if (!res.ok) {
        const text = await res.text();
        console.error("Upload function HTTP error", res.status, res.statusText, text);
        msg.textContent = "Erreur serveur upload";
        return;
      }

      const result = await res.json();
      console.log("Upload function response:", result);

      const viewUrl =
        result.url ||
        result.link ||
        result.viewUrl ||
        result.upload_url ||
        result.uploadURL ||
        result.data?.url ||
        result.data?.link ||
        result.data?.viewUrl ||
        result.file?.url ||
        result.file?.viewURL;

      if (!viewUrl) {
        console.error("Impossible de récupérer viewUrl dans la réponse upload", result);
        msg.textContent = "Erreur récupération URL";
        return;
      }

      const uuid = viewUrl.split("/view/")[1] || viewUrl.split("/").pop();
      const finalUrl = `https://zerostorage.net/api/files/download/${uuid}?t=${Date.now()}`;

      // 🔹 Insert dans Supabase
      const { data, error } = await supabaseClient
        .from("images_withoutia")
        .insert([
          {
            url: finalUrl,
            tags: document.getElementById("tags").value,
            description: document.getElementById("description").value
          }
        ]);

      if (error) {
        console.error("Erreur Supabase :", error);
        msg.textContent = "Erreur publication";
      } else {
        console.log("Upload enregistré :", data);
        msg.textContent = "Publié, merci :)";
      }

    } catch (err) {
      console.error("Erreur inattendue :", err);
      msg.textContent = "Erreur serveur";
    }

  };

});