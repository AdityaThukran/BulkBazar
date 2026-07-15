require('dotenv').config();

const GEMINI_KEY = process.env.GEMINI_KEY;

async function testModel(modelName) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${GEMINI_KEY}`;
  const payload = {
    contents: [{ parts: [{ text: 'Hello' }] }]
  };
  
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    const text = await res.text();
    console.log(`Model: ${modelName} -> Status: ${res.status}`);
    if (res.status === 200) {
      console.log(`Success! Response snippet: ${text.substring(0, 100)}`);
      return true;
    } else {
      console.log(`Failed: ${text}`);
      return false;
    }
  } catch (err) {
    console.error(`Error for ${modelName}:`, err.message);
    return false;
  }
}

async function runTests() {
  const models = [
    'gemini-1.5-flash',
    'gemini-1.5-pro',
    'gemini-1.0-pro',
    'gemini-2.0-flash',
    'gemini-2.5-flash',
    'gemini-flash-latest'
  ];
  
  for (const model of models) {
    console.log('-----------------------------------');
    const ok = await testModel(model);
    if (ok) {
      console.log(`>> RECOMMENDED MODEL: ${model}`);
    }
  }
}

runTests();
