const SUPABASE_URL = "https://waljqaxkbvzidkrzbcbz.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndhbGpxYXhrYnZ6aWRrcnpiY2J6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg4OTA3MDcsImV4cCI6MjA4NDQ2NjcwN30.9lBgfkJMCLk2D-gXjxj9bV5b5x-HZxY_cEBrdlsExBw"; 

const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const gallery = document.getElementById("gallery");

// détecte la page
const isWithIA = location.pathname.includes("withia");

// sécurité si #gallery n'existe pas
if (!gallery) {
  console.warn("Gallery introuvable sur cette page.");
}

// fonction principale
async function loadImages() {
  if (!gallery) return;

  const table = isWithIA ? "images_withia" : "images_withoutia";

  try {
    const { data, error } = await sb
      .from(table)
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erreur Supabase:", error);
      return;
    }

    // vide la galerie
    gallery.innerHTML = "";

    if (!data || data.length === 0) {
      gallery.innerHTML = "<p style='opacity:0.6;'>Aucune image pour le moment.</p>";
      return;
    }

    data.forEach(img => {
      if (!img.url) return;

      const el = document.createElement("img");
      el.src = img.url;
      el.alt = img.description || "";
      el.dataset.tags = img.tags || "";

      gallery.appendChild(el);
    });

  } catch (err) {
    console.error("Erreur inattendue:", err);
  }
}

// charge au démarrage
document.addEventListener("DOMContentLoaded", loadImages);