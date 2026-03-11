// ArchTrack Browser Extension - Popup Script

const ARCHTRACK_SERVER = 'http://localhost:3001';

document.addEventListener('DOMContentLoaded', async () => {
  const statusEl = document.getElementById('status');
  
  try {
    const response = await fetch(`${ARCHTRACK_SERVER}/api/health`);
    if (response.ok) {
      statusEl.textContent = '✓ Connected to ArchTrack';
      statusEl.className = 'status connected';
    } else {
      statusEl.textContent = '✗ ArchTrack server not responding';
      statusEl.className = 'status disconnected';
    }
  } catch (err) {
    statusEl.textContent = '✗ Cannot connect to ArchTrack. Is the desktop app running?';
    statusEl.className = 'status disconnected';
  }
});
