# Uniconnect Website
## Comprehensive Ethiopian University Student Network

This is the beginning of an ambitious project to connect all Ethiopian university students!

## Files
- `index.html` — main page
- `style.css` — basic styling
- `app.js` — JavaScript interactions

## How to run
1. Open the folder in your editor.
2. Open `index.html` in your browser (double-click the file or drag it into a browser window).

## Mini-Task 4: Interactivity
- Dynamic greeting based on time of day updates the main heading when the page loads.
- A button changes the heading text when clicked.

### HTML hooks
- Main heading: `<h1 id="welcomeHeading">Welcome to Uniconnect!</h1>`
- Button: `<button id="changeMessageBtn">Change Welcome Message</button>`

### JavaScript behavior (in `app.js`)
- On `DOMContentLoaded`, calls `setDynamicGreeting()` which sets the heading to:
	- Good Morning, Uniconnect! (before 12 PM)
	- Good Afternoon, Uniconnect! (before 6 PM)
	- Good Evening, Uniconnect! (6 PM or later)
- Adds a click handler to `#changeMessageBtn` that sets the heading to "Uniconnect is growing every day!" and logs to the console.

### Troubleshooting
- If clicking the button does nothing, open DevTools (F12) and check the Console for any errors about missing element IDs. Ensure your `index.html` has `id="welcomeHeading"` on the `<h1>` and `id="changeMessageBtn"` on the `<button>`.
