const fs = require('fs');
const express = require('express');
const app = express();
app.use(express.urlencoded({ extended: false }));

// Helper function to read data from the JSON file
const loadData = () => {
    const data = fs.readFileSync('urls.json');
    return JSON.parse(data);
};

// Helper function to save data to the JSON file
const saveData = (data) => {
    fs.writeFileSync('urls.json', JSON.stringify(data, null, 2));
};

// Serve the home page and list all short URLs
app.get('/', (req, res) => {
    const urls = loadData();
    res.send(`
    <h1>URL Shortener</h1>
    <form action="/shortUrls" method="POST">
      <input type="url" name="fullUrl" placeholder="Enter a URL" required>
      <button type="submit">Shorten</button>
    </form>
    <h2>Shortened URLs:</h2>
    <ul>
      ${urls.map(url => `
        <li>
          <a href="/${url.short}">${url.full}</a>
          => /${url.short}
        </li>
      `).join('')}
    </ul>
  `);
});

// Handle URL shortening requests
app.post('/shortUrls', (req, res) => {
    const fullUrl = req.body.fullUrl;
    const short = Math.random().toString(36).substring(2, 8); // Generate a short URL

    const urls = loadData();
    urls.push({ short, full: fullUrl });
    saveData(urls); // Save updated list to the JSON file

    res.redirect('/');
});

// Handle redirecting to the original full URL
app.get('/:shortUrl', (req, res) => {
    const shortUrl = req.params.shortUrl;
    const urls = loadData();

    const url = urls.find(u => u.short === shortUrl);
    if (!url) return res.sendStatus(404); // URL not found

    res.redirect(url.full); // Redirect to the full URL
});

// Start the server on port 5000
app.listen(5000, () => {
    console.log('Server is running on port 5000');
});
