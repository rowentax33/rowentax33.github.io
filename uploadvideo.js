document.addEventListener("DOMContentLoaded", () => {

  console.log("uploadvideo.js marche coMme SUr dEs r0uletTes");

  const SUPABASE_URL = "https://waljqaxkbvzidkrzbcbz.supabase.co";
  const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzIiwicmVmIjoid2FsbGpxYXhrYnZ6aWRrcnpiY2J6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg4OTA3MDcsImV4cCI6MjA4NDQ2NjcwN30.9lBgfkJMCLk2D-gXjxj9bV5b5x-HZxY_cEBrdlsExBw";

  const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
  );

  const publishBtn = document.getElementById("publish");
  const msg = document.getElementById("msg");
  const fileInput = document.getElementById("fileInput");
  const tagsInput = document.getElementById("tags");
  const descriptionInput = document.getElementById("description");
  const isIAInput = document.getElementById("isIA");
  const title = document.getElementById("uploadTitle");

  if (!publishBtn || !msg || !fileInput) {
    console.error("Éléments upload vidéo introuvables.");
    return;
  }

  const params = new URLSearchParams(location.search);
  const forcedIA = params.get("ia");

  if (forcedIA === "1") {
    isIAInput.checked = true;
    title.textContent = "Upload — Vidéo IA";
  } else if (forcedIA === "0") {
    isIAInput.checked = false;
    title.textContent = "Upload — Vidéo Sans IA";
  }

  publishBtn.onclick = async () => {

    console.log("Bouton publier clique");

    if (!fileInput.files.length) {
      msg.textContent = "Sélectionne une vidéo (jespere tq missclick sinon ca veut dire aue ta parkingson comme rocket";
      return;
    }

    const file = fileInput.files[0];

    if (!file.type.startsWith("video/")) {
      msg.textContent = "Le fichier doit être une vidéo tdc";
      return;
    }

    publishBtn.disabled = true;
    publishBtn.textContent = "Upload en cours...";

    try {
      const formData = new FormData();
      formData.append("file", file);

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
        console.error("Upload function HTTP error:", res.status, text);
        msg.textContent = "Erreur serveur upload ";
        return;
      }

      const result = await res.json();
      console.log("Réponse ZeroStorage:", result);

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
        console.error("URL ZeroStorage introuvable:", result);
        msg.textContent = "Erreur récupération URL";
        return;
      }

      const uuid =
        viewUrl.split("/view/")[1] ||
        viewUrl.split("/").pop();

      const finalUrl =
        `https://zerostorage.net/api/files/download/${uuid}?t=${Date.now()}`;

      console.log("URL finale vidéo:", finalUrl);

      const { data, error } = await supabaseClient
        .from("videos")
        .insert([{
          url: finalUrl,
          tags: tagsInput.value,
          description: descriptionInput.value,
          is_ia: isIAInput.checked
        }])
        .select();

      if (error) {
        console.error("Erreur Supabase:", error);
        msg.textContent = "Erreur publication";
        return;
      }

      console.log("Vidéo enregistrée:", data);
      msg.textContent = "Publié, merci :) ";

      fileInput.value = "";
      tagsInput.value = "";
      descriptionInput.value = "";

    } catch (err) {
      console.error("Erreur inattendue:", err);
      msg.textContent = "Erreur serveur ";
    } finally {
      publishBtn.disabled = false;
      publishBtn.textContent =
        "Publier (tjrs pas d'animation jsuis pas paye lmao)";
    }
  };
});
