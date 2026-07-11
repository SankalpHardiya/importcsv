const ALLOWED_STATUSES = ['GOOD_LEAD_FOLLOW_UP', 'DID_NOT_CONNECT', 'BAD_LEAD', 'SALE_DONE'];
const ALLOWED_SOURCES = ['leads_on_demand', 'meridian_tower', 'eden_park', 'varah_swamy', 'sarjapur_plots'];

function buildExtractionPrompt(batchRecords) {
  return `
You are an expert data extraction AI working for GrowEasy CRM. Your task is to analyze messy CSV data with unknown column names and map them strictly to our CRM format.

STRICT RULES - YOU MUST FOLLOW THESE:
1. CRM STATUS: You must ONLY use one of these exact values: ${ALLOWED_STATUSES.join(', ')}. If unsure, leave blank.
2. DATA SOURCE: You must ONLY use one of these exact values: ${ALLOWED_SOURCES.join(', ')}. If none match confidently, leave blank.
3. DATE FORMAT: The "created_at" field MUST be a string valid for JavaScript's "new Date()" (e.g., "YYYY-MM-DD HH:mm:ss"). If no date exists, use current ISO date.
4. MULTIPLE EMAILS/MOBILES: If a row contains multiple emails or phones, put the PRIMARY one in the "email" or "mobile_without_country_code" field. Append the rest to "crm_note" clearly labeled (e.g., "Extra emails: test@test.com").
5. CRM_NOTE: Use this field for remarks, follow-up notes, extra contacts, or any useful info that doesn't fit other fields.
6. ESCAPING: Replace ALL actual line breaks inside values with the string literal "\\n" so the JSON remains valid.
7. SKIP LOGIC: If a record has NEITHER an email NOR a mobile number, you must mark "skipped": true.

TARGET CRM FIELDS TO EXTRACT:
created_at, name, email, country_code, mobile_without_country_code, company, city, state, country, lead_owner, crm_status, crm_note, data_source, possession_time, description

INPUT DATA (Array of raw CSV rows):
 ${JSON.stringify(batchRecords, null, 2)}

OUTPUT INSTRUCTIONS:
Return ONLY a valid JSON array of objects. Do not include markdown formatting like \`\`\`json. 
Each object must have this exact structure:
[
  {
    "parsedData": {
      "created_at": "...",
      "name": "...",
      ...all 15 fields...
    },
    "skipped": false,
    "reason": null
  },
  {
    "parsedData": { ...empty fields... },
    "skipped": true,
    "reason": "No email or mobile found"
  }
]
`.trim();
}

module.exports = { buildExtractionPrompt };