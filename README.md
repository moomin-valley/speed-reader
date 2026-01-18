# Speed Reader

A minimal RSVP speed reader that flashes words one at a time with a fixed focal point.

## What is RSVP?

Rapid Serial Visual Presentation (RSVP) displays text one word at a time in a fixed position. This eliminates eye movement, allowing for faster reading speeds.

## Features

- **Fixed focal point** - Center letter stays in the same position, reducing eye movement
- **Adjustable speed** - 100 to 900 words per minute via slider or direct input
- **Playback controls** - Start, Pause/Resume, Back (skip back 10 words)
- **Persistent settings** - WPM preference saved to localStorage
- **Responsive design** - Works on desktop and mobile
- **No dependencies** - Plain HTML, CSS, and JavaScript

## Usage

1. Paste your text into the text area
2. Adjust speed if needed (default: 300 WPM)
3. Click **Start**
4. Use **Pause** to stop, **Back** to rewind 10 words

## Development

```bash
# Clone the repo
git clone https://github.com/moomin-valley/speed-reader.git
cd speed-reader

# Serve locally
python3 -m http.server 8080

# Open http://localhost:8080
```

## License

MIT
