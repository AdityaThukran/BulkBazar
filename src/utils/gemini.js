/**
 * BulkBazar — Real Gemini AI Client
 * Replaces all static heuristics with live Google Gemini 1.5 Flash API calls
 */

const GEMINI_KEY = process.env.REACT_APP_GEMINI_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`;

/**
 * Core Gemini API caller
 */
async function callGemini(systemPrompt, userPrompt, jsonMode = false) {
  const body = {
    contents: [
      {
        role: 'user',
        parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }]
      }
    ],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 1024,
      topP: 0.95,
    }
  };

  const res = await fetch(GEMINI_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `Gemini API error: ${res.status}`);
  }

  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';

  if (jsonMode) {
    // Strip markdown code fences if Gemini wraps JSON
    const clean = text.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
    return JSON.parse(clean);
  }

  return text.trim();
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. DEAD STOCK ANALYSIS
// ─────────────────────────────────────────────────────────────────────────────
/**
 * Analyzes a product and returns an AI-generated dead stock revival report.
 * Returns: { score: 0-100, level: 'High'|'Medium'|'Low', summary: string, tips: string[] }
 */
export async function analyzeDeadStock(product) {
  const sys = `You are BulkBazar's AI Dead Stock Analyst — an expert in B2B inventory liquidation for the Indian market. 
Analyze the product data and return ONLY valid JSON (no markdown) with this structure:
{
  "score": <integer 0-100 representing revival potential>,
  "level": <"High" | "Medium" | "Low">,
  "summary": <2-3 sentence expert analysis of this specific product's dead stock situation>,
  "tips": [<3 to 5 specific, actionable revival tips tailored to THIS product>]
}`;

  const userPrompt = `Product to analyze:
Name: ${product.name}
Category: ${product.category}
Condition: ${product.condition}
Listed Price: ₹${product.price}
MRP: ₹${product.mrp || 'Not provided'}
Quantity: ${product.quantity} ${product.unit}
Description: ${product.description || 'No description'}
Days listed: ${product.created_at ? Math.floor((Date.now() - new Date(product.created_at).getTime()) / 86400000) : 'Unknown'}`;

  try {
    return await callGemini(sys, userPrompt, true);
  } catch (e) {
    console.error('Gemini analyzeDeadStock error:', e);
    // Fallback to prevent UI crash
    return {
      score: 50,
      level: 'Medium',
      summary: 'AI analysis temporarily unavailable. Please try again.',
      tips: ['Ensure product has a clear photo', 'Verify competitive pricing vs MRP', 'Add a detailed description']
    };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. DYNAMIC PRICE SUGGESTION
// ─────────────────────────────────────────────────────────────────────────────
/**
 * Returns AI-suggested resale price with a one-line rationale.
 * Returns: { price: number, rationale: string }
 */
export async function getDynamicPriceSuggestion(product) {
  const sys = `You are a B2B wholesale pricing expert for the Indian market. 
Return ONLY valid JSON (no markdown) with this structure:
{ "price": <integer recommended resale price in INR>, "rationale": <one concise sentence explaining the pricing logic> }`;

  const userPrompt = `Product pricing request:
Name: ${product.name}
Category: ${product.category}
Condition: ${product.condition}
Current listed price: ₹${product.price}
MRP / Retail price: ₹${product.mrp || 'Unknown'}
Quantity available: ${product.quantity} ${product.unit}
Days in stock: ${product.created_at ? Math.floor((Date.now() - new Date(product.created_at).getTime()) / 86400000) : 'Unknown'}

Suggest the optimal B2B liquidation price that will attract bulk buyers quickly without leaving too much money on the table.`;

  try {
    return await callGemini(sys, userPrompt, true);
  } catch (e) {
    console.error('Gemini getDynamicPriceSuggestion error:', e);
    const fallbackPrice = product.mrp ? Math.round(Number(product.mrp) * 0.55) : Math.round(Number(product.price) * 0.9);
    return { price: fallbackPrice, rationale: 'AI pricing temporarily unavailable. Using estimated market rate.' };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. LISTING OPTIMIZER
// ─────────────────────────────────────────────────────────────────────────────
/**
 * Rewrites a product's name and description for B2B wholesale appeal.
 * Returns: { name: string, description: string }
 */
export async function generateOptimizedListing(name, description, category) {
  const sys = `You are a B2B wholesale copywriter specializing in Indian dead stock liquidation marketplaces.
Rewrite the product listing to appeal to B2B procurement managers, MSMEs, and bulk buyers.
Return ONLY valid JSON (no markdown):
{ "name": <optimized B2B listing title, max 80 chars>, "description": <optimized description with bullet points, emojis, and B2B-specific appeal, 150-250 words> }`;

  const userPrompt = `Original listing to optimize:
Name: ${name}
Description: ${description || 'No description provided'}
Category: ${category}

Make it compelling, professional, and use specific B2B language. Mention bulk buying benefits, dispatch readiness, and MSME suitability.`;

  try {
    return await callGemini(sys, userPrompt, true);
  } catch (e) {
    console.error('Gemini generateOptimizedListing error:', e);
    return {
      name: `${name} — Wholesale Bulk Lot (${category})`,
      description: `${description || 'Quality product'}\n\n✅ B2B Ready | 🚚 Immediate Dispatch | 📦 Bulk Pricing Available`
    };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. LIQUIDATION STRATEGIES
// ─────────────────────────────────────────────────────────────────────────────
/**
 * Generates 3 personalized, AI-crafted liquidation strategies for a specific product.
 * Returns: Array of { title: string, description: string }
 */
export async function generateLiquidationStrategies(product) {
  const sys = `You are an expert B2B liquidation consultant specializing in the Indian wholesale market.
Generate exactly 3 distinct, highly actionable liquidation strategies for this specific product.
Return ONLY valid JSON (no markdown):
[
  { "title": <strategy name with emoji>, "description": <2-3 sentence specific actionable plan> },
  { "title": <strategy name with emoji>, "description": <2-3 sentence specific actionable plan> },
  { "title": <strategy name with emoji>, "description": <2-3 sentence specific actionable plan> }
]`;

  const userPrompt = `Product needing liquidation:
Name: ${product.name}
Category: ${product.category}
Condition: ${product.condition}
Price: ₹${product.price} per ${product.unit}
Quantity: ${product.quantity} ${product.unit}
MRP: ₹${product.mrp || 'Not provided'}
Description: ${product.description || 'None'}

Give very specific strategies for THIS exact product, not generic advice.`;

  try {
    return await callGemini(sys, userPrompt, true);
  } catch (e) {
    console.error('Gemini generateLiquidationStrategies error:', e);
    return [
      { title: '📦 Bundle & Offer', description: `Create a bundled offer combining ${product.name} with complementary items to attract MSME buyers looking for complete solutions.` },
      { title: '🏭 Industrial Redirect', description: `Target secondary manufacturers and processing plants that can use this ${product.category} stock as raw material or spare inventory.` },
      { title: '🚚 Regional Liquidators', description: 'Connect with discount dealers in major trade zones like Karol Bagh or APMC markets for quick bulk clearance.' }
    ];
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. PERSONALIZED SALES PITCH
// ─────────────────────────────────────────────────────────────────────────────
/**
 * Generates a personalized B2B sales pitch message from seller to a specific buyer.
 * Returns: string (message text)
 */
export async function generateSalesPitch(product, buyer) {
  const sys = `You are a B2B sales expert writing personalized liquidation pitch messages for BulkBazar, an Indian wholesale dead stock marketplace.
Write a professional, persuasive, personalized pitch message. Keep it conversational but business-focused.
Use ₹ for prices. Include specific product details. End with a clear call to action.
Return ONLY the message text, no JSON, no markdown.`;

  const discount = product.mrp && product.mrp > product.price
    ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
    : null;

  const userPrompt = `Write a B2B pitch for this deal:
Buyer name: ${buyer.full_name || 'Procurement Manager'}
Buyer company: ${buyer.company || 'their company'}
Buyer's sourcing interest: ${buyer.sourcing_categories || product.category}

Product being pitched:
Name: ${product.name}
Category: ${product.category}
Condition: ${product.condition}
Price: ₹${product.price} per ${product.unit}
${discount ? `Discount: ${discount}% below MRP` : ''}
Quantity available: ${product.quantity} ${product.unit}
Description: ${product.description || 'Quality wholesale lot'}`;

  try {
    return await callGemini(sys, userPrompt, false);
  } catch (e) {
    console.error('Gemini generateSalesPitch error:', e);
    return `Dear ${buyer.full_name || 'Procurement Officer'},\n\nWe have an immediate liquidation opportunity for ${product.name} at ₹${product.price} per ${product.unit} — ${product.quantity} units available for immediate dispatch.\n\nLet us know if you'd like to proceed.\n\nBest regards`;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. NEGOTIATION COPILOT
// ─────────────────────────────────────────────────────────────────────────────
/**
 * Suggests a smart negotiation reply based on full conversation context.
 * @param {Array} messages - Array of { text, isMe } chat messages
 * @param {Object} product - Product being negotiated
 * @param {string} role - 'seller' or 'buyer'
 * @param {string} style - 'counter' | 'firm' | 'bundle'
 * Returns: string (suggested reply)
 */
export async function suggestNegotiationReply(messages, product, role, style) {
  const sys = `You are an expert B2B negotiation assistant for BulkBazar, an Indian wholesale dead stock marketplace.
Based on the conversation context and the requested negotiation style, write the ideal reply.
Keep it concise, professional, and persuasive. Use ₹ for prices. Return ONLY the message text.`;

  const conversationText = messages.length > 0
    ? messages.slice(-6).map((m, i) => `${m.isMe ? (role === 'seller' ? 'Seller' : 'Buyer') : (role === 'seller' ? 'Buyer' : 'Seller')}: ${m.text}`).join('\n')
    : 'No previous messages. This is the opening message.';

  const styleDescriptions = {
    counter: 'Counter-offer — propose a middle-ground price between your ask and their offer',
    firm: 'Stand firm — politely but firmly maintain your price, offer a non-price benefit instead',
    bundle: 'Bundle deal — offer a discount only if they take the entire lot or a larger quantity'
  };

  const userPrompt = `Role: ${role === 'seller' ? 'You are the Seller' : 'You are the Buyer'}
Negotiation style requested: ${styleDescriptions[style] || style}

Product details:
Name: ${product?.name || 'unknown product'}
Listed price: ₹${product?.price || 'unknown'} per ${product?.unit || 'unit'}
MRP: ₹${product?.mrp || 'not specified'}
Quantity: ${product?.quantity || 'unknown'} ${product?.unit || 'units'}

Conversation so far:
${conversationText}

Write the next message in this negotiation.`;

  try {
    return await callGemini(sys, userPrompt, false);
  } catch (e) {
    console.error('Gemini suggestNegotiationReply error:', e);
    const price = Number(product?.price) || 0;
    if (style === 'counter') return `I understand your position. Could we meet at ₹${Math.round(price * 0.93)} per unit? That would still work for both sides.`;
    if (style === 'firm') return `Thank you for the interest. Given the quality and immediate availability, ₹${price} per unit is our best offer for this lot.`;
    return `If you're open to taking the full lot of ${product?.quantity} ${product?.unit}, I can offer you an additional volume discount. Shall we discuss?`;
  }
}
