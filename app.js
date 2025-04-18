const express = require('express');
const path = require('path');
const app = express();

// Set EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// Example route
app.get('/', (req, res) => {
    res.render('index', { user: null }); // pass user if logged in
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
