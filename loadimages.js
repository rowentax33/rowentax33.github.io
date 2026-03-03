const SUPABASE_URL = window.SUPABASE_URL;
const SUPABASE_ANON_KEY = window.SUPABASE_ANON_KEY; 

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