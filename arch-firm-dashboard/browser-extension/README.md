# ArchTrack Browser Extension

This Chrome extension sends actual browser tab titles to the ArchTrack server for accurate activity classification.

## Why This Extension is Needed

macOS privacy restrictions prevent the desktop tracker from accessing browser tab titles - they all appear as "Untitled". This extension bypasses that limitation by reading tab titles directly from the browser and sending them to the ArchTrack server.

## Installation

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top right)
3. Click "Load unpacked"
4. Select the `browser-extension` folder from this project
5. The extension should now be installed and active

## How It Works

- The extension monitors your active tabs
- When you switch tabs or navigate to a new page, it sends the tab title and URL to the ArchTrack server
- The server classifies the activity based on the actual tab title (e.g., GitHub → Core Work, YouTube → Entertainment)
- This provides accurate productivity tracking that isn't possible with the desktop tracker alone

## Permissions

- `activeTab`: To read the current tab title and URL
- `tabs`: To monitor tab switches
- `http://localhost:3001/*`: To communicate with the ArchTrack server

## Troubleshooting

- Make sure the ArchTrack desktop app is running
- Check the extension popup to verify connection status
- If activities still show as "Other", try refreshing the dashboard
