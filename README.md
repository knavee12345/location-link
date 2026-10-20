# Location Tracker

A simple project with two web pages:

- a tracker page that asks for a visitor's location
- a read page that displays the latest saved location data

## Features

- browser geolocation capture
- server-side JSON storage
- two web pages in the same project
- no external database required

## Run locally

1. Open a terminal in this project folder.
2. Start the server:
   - `node server.js`
3. Open:
   - `http://localhost:3001/tracker.html`
   - `http://localhost:3001/saved.html`

## Deploy to Render

1. Create a new account at https://render.com
2. In the Render dashboard, choose "New" > "Web Service"
3. Connect this GitHub repository
4. Use the following start command:
   - `node server.js`
5. Render will provide a public URL automatically

## Files

- `server.js` - HTTP server and API
- `tracker.html` - capture page
- `saved.html` - saved data page
- `data/locations.json` - saved entries

## Notes

The app stores location data on the local machine in a JSON file for a simple backend example.
