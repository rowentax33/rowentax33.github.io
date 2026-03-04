document.addEventListener("DOMContentLoaded", () => {

  // 🔹 Configuration Supabase
  const SUPABASE_URL = "https://waljqaxkbvzidkrzbcbz.supabase.co";
  const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndhbGpxYXhrYnZ6aWRrcnpiY2J6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg4OTA3MDcsImV4cCI6MjA4NDQ2NjcwN30.9lBgfkJMCLk2D-gXjxj9bV5b5x-HZxY_cEBrdlsExBw";

  const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

  // 🔹 Récupération du bouton
  const publishBtn = document.getElementById("publish");

  if (!publishBtn) {
    console.error("Bouton #publish introuvable dans le HTML");
    return;
  }

  // Quand on clique
  publishBtn.onclick = async () => {

    console.log("Bouton cliqué");

    try {
      // Exemple simple : insérer un post test

      const { data, error } = await supabaseClient
  .from("images_withoutia")
  .insert([
    {
      url: finalUrl, // le lien transformé zerostorage
      tags: document.getElementById("tags").value,
      description: document.getElementById("description").value
    }
  ]);

if (error) {
  console.error("Erreur Supabase :", error);
  msg.textContent = "Erreur publication ❌";
} else {
  console.log("Upload enregistré :", data);
  msg.textContent = "Publié avec succès ✅";
}
      
    }

  };

});