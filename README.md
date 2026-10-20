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
   - `http://localhost:3001/share_my_location.html`
   - `http://localhost:3001/read_locations.html`

## Files

- `server.js` - HTTP server and API
- `share_my_location.html` - location capture page
- `read_locations.html` - read saved data page
- `data/locations.json` - saved entries

## Notes

The app stores location data on the local machine in a JSON file for a simple backend example.
