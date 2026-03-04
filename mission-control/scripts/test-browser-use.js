// Test Browser Use API with real call
const API_KEY = process.env.BROWSER_USE_API_KEY;

async function testBrowserUse() {
  console.log('🧪 Testing Browser Use API...');
  console.log('API Key present:', API_KEY ? 'Yes (' + API_KEY.substring(0, 15) + '...)' : 'No');
  console.log('');
  
  try {
    console.log('📡 Sending request to Browser Use API...');
    const response = await fetch('https://api.browser-use.com/v1/tasks', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        task: 'Go to https://www.bensbites.com and extract the title of the latest newsletter article',
        max_steps: 10,
      }),
    });

    console.log('Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log('❌ API Error:', errorText);
      return;
    }

    const data = await response.json();
    console.log('✅ SUCCESS! Task created');
    console.log('Task ID:', data.id);
    console.log('Status:', data.status);
    console.log('');
    console.log('Waiting for task to complete...');
    
    // Poll for completion
    let attempts = 0;
    const maxAttempts = 30;
    
    while (attempts < maxAttempts) {
      await new Promise(r => setTimeout(r, 2000));
      
      const statusRes = await fetch(`https://api.browser-use.com/v1/tasks/${data.id}`, {
        headers: { 'Authorization': `Bearer ${API_KEY}` }
      });
      
      const status = await statusRes.json();
      console.log(`Poll ${attempts + 1}: Status = ${status.status}`);
      
      if (status.status === 'completed') {
        console.log('');
        console.log('✅ TASK COMPLETED!');
        console.log('Output:', status.output?.substring(0, 500) || 'No output');
        return;
      }
      
      if (status.status === 'failed') {
        console.log('');
        console.log('❌ TASK FAILED');
        console.log('Error:', status.error);
        return;
      }
      
      attempts++;
    }
    
    console.log('⏱️ Task timeout - check status manually later');
    console.log('Task ID:', data.id);
    
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

testBrowserUse();
