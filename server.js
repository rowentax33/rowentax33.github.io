// simple Express server to serve the static site and provide supabase config
// usage: NODE_ENV=production node server.js

const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// expose environment values to the client via a small JS file
app.get('/config.js', (req, res) => {
  const supabaseUrl = process.env.SUPABASE_URL || '';
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';
  res.type('application/javascript');
  res.send(
    `window.SUPABASE_URL = "${supabaseUrl}";
window.SUPABASE_ANON_KEY = "${supabaseAnonKey}";`
  );
});

// serve static assets from current directory (HTML, CSS, JS, etc.)
app.use(express.static(path.join(__dirname)));

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
