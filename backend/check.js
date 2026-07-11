require('dotenv').config();

const API_KEY = process.env.GEMINI_API_KEY;
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;

async function checkAccess() {
  console.log("Checking API Key access directly via HTTP...\n");
  
  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      console.log(`❌ Google returned Error ${response.status}`);
      console.log("Message:", data.error?.message);
      
      if (response.status === 403 || response.status === 401) {
        console.log("\n👉 FIX: Your API key is invalid or disabled. Please get a new one from https://aistudio.google.com/app/apikey");
      } else if (response.status === 404) {
        console.log("\n👉 FIX: You are likely in a GEO-BLOCKED region where Google blocks Gemini API access.");
        console.log("You need to use a VPN (set to US, UK, or Europe) to run this backend.");
      }
      return;
    }

    console.log("✅ SUCCESS! Your API key works. Available models:\n");
    
    data.models.forEach(model => {
      if (model.supportedGenerationMethods?.includes('generateContent')) {
        console.log(` - ${model.name}`);
      }
    });
    
    console.log("\n👉 Copy the EXACT name of the model you want to use from the list above.");
    
  } catch (error) {
    console.error("❌ Network error. Are you connected to the internet?", error.message);
  }
}

checkAccess();