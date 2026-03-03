const SUPABASE_URL = window.SUPABASE_URL;
const SUPABASE_ANON_KEY = window.SUPABASE_ANON_KEY;

const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const url = document.getElementById("url");
const tags = document.getElementById("tags");
const description = document.getElementById("description");
const msg = document.getElementById("msg");

document.getElementById("publish").onclick = async () => {

  const { error } = await sb.from("images_withoutia").insert({
    url: url.value,
    tags: tags.value,
    description: description.value
  });

  if (error) {
    msg.textContent = "Erreur upload ❌";
    console.error(error);
  } else {
    msg.textContent = "Publié ✅";
  }
};
