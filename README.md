# Fokus-Modus URL Blocker

A Chrome extension to help you stay focused by blocking distracting websites.

## Features

- 🚫 Block distracting websites
- ⏲️ Set custom blocking durations
- 📊 View blocked URLs with live countdown timers
- 💾 Persistent storage across sessions

## Installation

1. Clone the repository:
```bash
git clone https://github.com/Frankoissa/Fokus-Modus---URL-Blocker.git
cd Fokus-Modus---URL-Blocker
```

## Project Structure

```
Fokus-Modus/
├── manifest.json        # Extension configuration
├── popup.html          # Main interface
├── popup.js            # Interface logic
├── service-worker.js   # Background processes
└── styles.css         # Styling
```

## Example Usage

```javascript
// Example of blocking a URL
addUrlToBlockedList("example.com", {
  hours: 1,
  minutes: 30,
  seconds: 0
});
```