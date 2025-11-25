# Udemy Hebrew Caption Translator

A Chrome extension that provides real-time Hebrew translation for Udemy video captions. The extension integrates directly with Udemy’s native caption container, keeps translations synchronized, supports RTL text rendering, and allows users to adjust font size and caption styling.

## Features
- Real-time Hebrew translation of English captions
- Integrated inside Udemy’s video player
- Native-style caption appearance (padding, opacity, layout)
- Full RTL support
- Adjustable font size and background opacity
- Lightweight translation API with no API key required

## Installation
1. Download or clone the repository.
2. Open `chrome://extensions/`.
3. Enable **Developer mode**.
4. Click **Load unpacked** and select the project folder.

## How It Works
- `content.js` observes Udemy’s caption element and extracts the active English caption.
- The text is sent to a free translation API.
- A synchronized Hebrew caption overlay is injected inside the same caption container.
- Styling matches Udemy’s original caption design.

## Requirements
Chrome browser (Manifest V3).

## License
MIT License.
