document.addEventListener("DOMContentLoaded", async () => {

  const SUPABASE_URL = "https://waljqaxkbvzidkrzbcbz.supabase.co";
  const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzIiwicmVmIjoid2FsbGpxYXhrYnZ6aWRrcnpiY2J6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg4OTA3MDcsImV4cCI6MjA4NDQ2NjcwN30.9lBgfkJMCLk2D-gXjxj9bV5b5x-HZxY_cEBrdlsExBw";

  const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  const gallery = document.getElementById("gallery");
  const search = document.getElementById("search");
  const hideIA = document.getElementById("hideIA");
  const viewer = document.getElementById("viewer");
  const viewerVideo = document.getElementById("viewerVideo");

  const choiceModal = document.getElementById("choiceModal");
  const choiceTitle = document.getElementById("choiceTitle");
  const choiceText = document.getElementById("choiceText");
  const choiceIA = document.getElementById("choiceIA");
  const choiceNoIA = document.getElementById("choiceNoIA");
  const choiceClose = document.getElementById("choiceClose");

  let choiceMode = "photos";
  let videos = [];

  function openChoiceModal(mode) {
    choiceMode = mode;

    if (mode === "photos") {
      choiceTitle.textContent = "Aller dans les photos";
      choiceText.textContent = "Tu veux aller dans quelle zone ?";
    } else {
      choiceTitle.textContent = "Publier une vidéo";
      choiceText.textContent = "Est ce que ta video contient du contenu IA?";
    }

    choiceModal.style.display = "flex";
  }

  function closeChoiceModal() {
    choiceModal.style.display = "none";
  }

  choiceClose.addEventListener("click", closeChoiceModal);
  choiceModal.addEventListener("click", (e) => {
    if (e.target === choiceModal) closeChoiceModal();
  });

  choiceIA.addEventListener("click", () => {
    if (choiceMode === "photos") {
      location.href = "withia.html";
    } else {
      location.href = "uploadvideo.html?ia=1";
    }
  });

  choiceNoIA.addEventListener("click", () => {
    if (choiceMode === "photos") {
      location.href = "withoutia.html";
    } else {
      location.href = "uploadvideo.html?ia=0";
    }
  });

  document.getElementById("photosBtn").addEventListener("click", () => {
    openChoiceModal("photos");
  });

  document.getElementById("addBtn").addEventListener("click", async () => {
    try {
      const { data: { session } } = await sb.auth.getSession();

      if (!session?.user) {
        location.href = "connectetoi.html";
        return;
      }

      const { data: profile, error } = await sb
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .single();

      if (error) {
        console.error("profiles error:", error);
        location.href = "paslesperms.html";
        return;
      }

      const role = profile?.role || "user";
      if (role !== "admin" && role !== "contributor") {
        location.href = "paslesperms.html";
        return;
      }

      openChoiceModal("upload");
    } catch (err) {
      console.error("Erreur vérification compte :", err);
      location.href = "connectetoi.html";
    }
  });

  document.getElementById("loginBtn").addEventListener("click", async () => {
    const { data: { session } } = await sb.auth.getSession();
    location.href = session?.user ? "account.html" : "login.html";
  });

  function getVisibleCards() {
    return Array.from(gallery.querySelectorAll(".video-card"))
      .filter(card => card.style.display !== "none");
  }

  function applyFilters() {
    const words = search.value.toLowerCase().trim().split(/\s+/).filter(Boolean);
    const hideAi = hideIA.checked;

    getAllCards().forEach(card => {
      const tags = (card.dataset.tags || "").toLowerCase();
      const isIA = card.dataset.ia === "true";

      const searchOK = words.every(word => tags.includes(word));
      const iaOK = !hideAi || !isIA;

      card.style.display = searchOK && iaOK ? "" : "none";
    });
  }

  function getAllCards() {
    return Array.from(gallery.querySelectorAll(".video-card"));
  }

  function openViewer(url) {
    viewerVideo.src = url;
    viewer.style.display = "flex";
    viewerVideo.play().catch(() => {});
  }

  function closeViewer() {
    viewerVideo.pause();
    viewerVideo.removeAttribute("src");
    viewerVideo.load();
    viewer.style.display = "none";
  }

  viewer.addEventListener("click", (e) => {
    if (e.target === viewer) closeViewer();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeViewer();
      closeChoiceModal();
    }
  });

  search.addEventListener("input", applyFilters);
  hideIA.addEventListener("change", applyFilters);

  document.getElementById("randomBtn").addEventListener("click", () => {
    const visible = getVisibleCards();
    if (!visible.length) return;

    const card = visible[Math.floor(Math.random() * visible.length)];
    card.scrollIntoView({ behavior: "smooth", block: "center" });
    openViewer(card.dataset.url);
  });

  async function loadVideos() {
    const { data, error } = await sb
      .from("videos")
      .select("id,url,tags,description,is_ia,created_at")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erreur lecture videos :", error);
      gallery.innerHTML = "<p class='empty'>Impossible de charger les vidéos.</p>";
      return;
    }

    videos = data || [];
    gallery.innerHTML = "";

    if (!videos.length) {
      gallery.innerHTML = "<p class='empty'>Aucune vidéo pour le moment.</p>";
      return;
    }

    for (const row of videos) {
      if (!row.url) continue;

      const card = document.createElement("article");
      card.className = "video-card";
      card.dataset.url = row.url;
      card.dataset.tags = row.tags || "";
      card.dataset.ia = row.is_ia ? "true" : "false";

      const video = document.createElement("video");
      video.src = row.url;
      video.controls = true;
      video.preload = "metadata";
      video.playsInline = true;

      const info = document.createElement("div");
      info.className = "video-info";

      if (row.tags) {
        const tags = document.createElement("span");
        tags.className = "video-tags";
        tags.textContent = row.tags;
        info.appendChild(tags);
      }

      if (row.description) {
        const desc = document.createElement("p");
        desc.textContent = row.description;
        info.appendChild(desc);
      }

      if (row.is_ia) {
        const badge = document.createElement("span");
        badge.className = "ia-badge";
        badge.textContent = "IA";
        info.appendChild(badge);
      }

      card.append(video, info);

      video.addEventListener("dblclick", () => openViewer(row.url));
      gallery.appendChild(card);
    }

    console.log("✅ Vidéos chargées :", videos.length);
    applyFilters();
  }

  await loadVideos();

  // header
  const header = document.querySelector("header");
  let last = window.scrollY;
  let hidden = false;

  window.addEventListener("scroll", () => {
    const y = window.scrollY;

    if (y <= 5) {
      header.classList.remove("hide");
      hidden = false;
    } else if (y > last && y > 80 && !hidden) {
      header.classList.add("hide");
      hidden = true;
    } else if (y < last && hidden) {
      header.classList.remove("hide");
      hidden = false;
    }

    last = y;
  }, { passive: true });

  console.log("video html marche cOmME sur dEs r0ulETtes");
});
