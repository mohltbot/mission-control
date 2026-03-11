// ArchTrack Browser Extension - Background Script
// Sends active tab information to the ArchTrack desktop tracker

const ARCHTRACK_SERVER = 'http://localhost:3001';
const EMPLOYEE_ID = 'emp-001'; // This should match the desktop tracker employee ID

// Track the last active tab info
let lastTabInfo = null;

// Listen for tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.active) {
    sendTabInfo(tab);
  }
});

// Listen for tab activation (switching tabs)
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  try {
    const tab = await chrome.tabs.get(activeInfo.tabId);
    sendTabInfo(tab);
  } catch (err) {
    console.error('Error getting active tab:', err);
  }
});

// Listen for window focus changes
chrome.windows.onFocusChanged.addListener(async (windowId) => {
  if (windowId !== chrome.windows.WINDOW_ID_NONE) {
    try {
      const [tab] = await chrome.tabs.query({ active: true, windowId });
      if (tab) {
        sendTabInfo(tab);
      }
    } catch (err) {
      console.error('Error getting window tab:', err);
    }
  }
});

// Send tab info to ArchTrack server
async function sendTabInfo(tab) {
  if (!tab || !tab.url || tab.url.startsWith('chrome://') || tab.url.startsWith('chrome-extension://')) {
    return;
  }

  const tabInfo = {
    employeeId: EMPLOYEE_ID,
    appName: 'Google Chrome',
    windowTitle: tab.title || 'Untitled',
    url: tab.url,
    timestamp: new Date().toISOString()
  };

  // Don't send duplicate info
  if (lastTabInfo && 
      lastTabInfo.windowTitle === tabInfo.windowTitle && 
      lastTabInfo.url === tabInfo.url) {
    return;
  }

  lastTabInfo = tabInfo;

  try {
    const response = await fetch(`${ARCHTRACK_SERVER}/api/browser-activity`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(tabInfo)
    });

    if (!response.ok) {
      console.error('Failed to send tab info:', response.status);
    }
  } catch (err) {
    // Server might not be running, that's okay
    console.log('Could not connect to ArchTrack server');
  }
}

// Send heartbeat every 30 seconds
setInterval(async () => {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab) {
      sendTabInfo(tab);
    }
  } catch (err) {
    console.error('Error in heartbeat:', err);
  }
}, 30000);

console.log('ArchTrack browser extension loaded');
