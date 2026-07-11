const { GoogleGenerativeAI } = require('@google/generative-ai');
const { buildExtractionPrompt } = require('../prompts/promptBuilder');

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Configuration
const BATCH_SIZE = 10; 
const MAX_RETRIES = 2; 

// Helper function to pause execution for retries
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Processes all records by sending them to Gemini in batches
 */
async function processRecordsInBatches(records) {
  const parsedRecords = [];
  const skippedRecords = [];

  for (let i = 0; i < records.length; i += BATCH_SIZE) {
    const batch = records.slice(i, i + BATCH_SIZE);
    const batchNumber = Math.floor(i / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(records.length / BATCH_SIZE);

    console.log(`⏳ Processing batch ${batchNumber}/${totalBatches} (${batch.length} rows)...`);

    let success = false;
    let attempts = 0;

    while (!success && attempts <= MAX_RETRIES) {
      attempts++;
      try {
        // 1. Use -latest to prevent 404 errors
        // 2. Use your JSON mode for perfectly clean responses
        const model = genAI.getGenerativeModel({ 
          model: "gemini-2.5-flash", 
          generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.4
          }
        });
        
        const prompt = buildExtractionPrompt(batch);
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        // 3. No regex cleanup needed anymore because of JSON mode!
        const batchResults = JSON.parse(responseText);

        // Validate and separate records
        for (let index = 0; index < batchResults.length; index++) {
          const item = batchResults[index];
          
          if (item.skipped) {
            skippedRecords.push({
              originalData: batch[index] || {},
              reason: item.reason || "Failed to parse"
            });
          } else {
            const cleanRecord = sanitizeRecord(item.parsedData);
            
            // Final backend validation: Ensure no invalid records slip through
            if (!cleanRecord.email && !cleanRecord.mobile_without_country_code) {
              skippedRecords.push({
                originalData: batch[index] || {},
                reason: "Missing both email and mobile"
              });
            } else {
              parsedRecords.push(cleanRecord);
            }
          }
        }

        success = true; // Mark as success to break retry loop

      } catch (error) {
        console.error(`❌ Batch ${batchNumber} attempt ${attempts} failed:`, error.message);
        
        if (attempts > MAX_RETRIES) {
          console.warn(`⏭️ Skipping batch ${batchNumber} after ${MAX_RETRIES} retries.`);
          batch.forEach(record => {
            skippedRecords.push({
              originalData: record,
              reason: "AI processing failed after retries"
            });
          });
        } else {
          // SMART RETRY: Extract the exact seconds Google told us to wait (e.g., "retry in 21s")
          const match = error.message.match(/retry in ([\d.]+)s/i);
          const waitTimeMs = match ? Math.ceil(parseFloat(match[1]) * 1000) : 20000; // Default 20s if not found
          
          console.log(`⏳ Rate limited. Waiting ${waitTimeMs/1000} seconds before retrying...`);
          await sleep(waitTimeMs);
        }
      }
    }
  }

  return {
    parsedRecords,
    skippedRecords,
    totalImported: parsedRecords.length,
    totalSkipped: skippedRecords.length
  };
}

/**
 * Ensures all fields exist and conform to standards
 */
function sanitizeRecord(record) {
  return {
    created_at: isValidDate(record.created_at) ? record.created_at : new Date().toISOString(),
    name: String(record.name || '').trim(),
    email: String(record.email || '').trim(),
    country_code: String(record.country_code || '').trim(),
    mobile_without_country_code: String(record.mobile_without_country_code || '').trim(),
    company: String(record.company || '').trim(),
    city: String(record.city || '').trim(),
    state: String(record.state || '').trim(),
    country: String(record.country || '').trim(),
    lead_owner: String(record.lead_owner || '').trim(),
    crm_status: validateStatus(record.crm_status),
    crm_note: String(record.crm_note || '').trim(),
    data_source: validateSource(record.data_source),
    possession_time: String(record.possession_time || '').trim(),
    description: String(record.description || '').trim()
  };
}

function isValidDate(dateStr) {
  if (!dateStr) return false;
  const date = new Date(dateStr);
  return !isNaN(date.getTime());
}

function validateStatus(status) {
  const allowed = ['GOOD_LEAD_FOLLOW_UP', 'DID_NOT_CONNECT', 'BAD_LEAD', 'SALE_DONE'];
  return allowed.includes(status) ? status : '';
}

function validateSource(source) {
  const allowed = ['leads_on_demand', 'meridian_tower', 'eden_park', 'varah_swamy', 'sarjapur_plots'];
  return allowed.includes(source) ? source : '';
}

module.exports = { processRecordsInBatches };