/**
 * BulkBazar — Gemini AI Client (Production-Ready)
 * All AI calls go through /api/gemini (Express backend proxy).
 * The actual Gemini API key lives ONLY on the server — never exposed to the browser.
 */

// In development: CRA proxy forwards /api/* to http://localhost:5001
// In production: /api/* is handled by the Express server serving the React build
const AI_PROXY_URL = '/api/gemini';

/**
 * Core proxy caller — sends prompt to the backend which calls Gemini securely
 */
async function callGemini(systemPrompt, userPrompt, jsonMode = false) {
  const res = await fetch(AI_PROXY_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ systemPrompt, prompt: userPrompt }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error || `AI proxy error: ${res.status}`);
  }

  const data = await res.json();
  const text = data?.text || '';

  if (!text) throw new Error('AI returned an empty response.');

  if (jsonMode) {
    // Strip markdown code fences if the model wraps JSON in them
    const clean = text
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim();
    try {
      return JSON.parse(clean);
    } catch {
      throw new Error('AI returned malformed JSON. Try again.');
    }
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
  const sys = `You are BulkBazar's AI Dead Stock Analyst — an expert in B2B inventory liquidation for the Indian wholesale market.
Analyze the product data and return ONLY valid JSON (no markdown, no extra text) with this exact structure:
{
  "score": <integer 0-100 representing B2B revival potential>,
  "level": <"High" | "Medium" | "Low">,
  "summary": <2-3 sentence expert analysis of this specific product's dead stock situation and market potential>,
  "tips": [<3 to 5 specific, actionable revival tips tailored to THIS exact product>]
}`;

  const userPrompt = `Analyze this product for dead stock revival:
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
    console.error('analyzeDeadStock error:', e.message);
    return {
      score: 55,
      level: 'Medium',
      summary: `This ${product.category} listing shows moderate revival potential. The ${product.condition} condition at ₹${product.price} per ${product.unit} needs competitive positioning for B2B buyers.`,
      tips: [
        'Add a detailed product photo to increase buyer engagement by 3x',
        'Verify the MRP to clearly show the discount percentage',
        'Consider pitching directly to category-specific buyers in the AI Insights tab'
      ]
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
Return ONLY valid JSON (no markdown):
{ "price": <integer recommended resale price in INR>, "rationale": <one concise sentence explaining the pricing logic> }`;

  const userPrompt = `Suggest the optimal B2B liquidation price:
Name: ${product.name}
Category: ${product.category}
Condition: ${product.condition}
Current listed price: ₹${product.price}
MRP / Retail price: ₹${product.mrp || 'Unknown'}
Quantity available: ${product.quantity} ${product.unit}
Days in stock: ${product.created_at ? Math.floor((Date.now() - new Date(product.created_at).getTime()) / 86400000) : 'Unknown'}`;

  try {
    return await callGemini(sys, userPrompt, true);
  } catch (e) {
    console.error('getDynamicPriceSuggestion error:', e.message);
    const fallback = product.mrp
      ? Math.round(Number(product.mrp) * 0.55)
      : Math.round(Number(product.price) * 0.9);
    return { price: fallback, rationale: 'Estimated at ~55% of MRP — competitive for B2B liquidation.' };
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

  const userPrompt = `Optimize this listing for B2B wholesale buyers:
Name: ${name}
Description: ${description || 'No description provided'}
Category: ${category}

Rewrite with specific B2B language: bulk buying benefits, dispatch readiness, MSME suitability, and clear value proposition.`;

  try {
    return await callGemini(sys, userPrompt, true);
  } catch (e) {
    console.error('generateOptimizedListing error:', e.message);
    return {
      name: `${name} — Wholesale Dead Stock Lot (${category})`,
      description: `${description || 'Quality commercial stock'}\n\n✅ B2B Ready | 🚚 Immediate Dispatch | 📦 Volume Pricing Available\n\nIdeal for MSMEs, discount retailers, and secondary manufacturers sourcing surplus ${category} inventory.`
    };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. LIQUIDATION STRATEGIES
// ─────────────────────────────────────────────────────────────────────────────
/**
 * Generates 3 AI-crafted liquidation strategies for a specific product.
 * Returns: Array of { title: string, description: string }
 */
export async function generateLiquidationStrategies(product) {
  const sys = `You are an expert B2B liquidation consultant for the Indian wholesale market.
Generate exactly 3 distinct, highly actionable liquidation strategies for this specific product.
Return ONLY valid JSON (no markdown):
[
  { "title": <strategy name with emoji, max 50 chars>, "description": <2-3 sentence specific action plan> },
  { "title": <strategy name with emoji, max 50 chars>, "description": <2-3 sentence specific action plan> },
  { "title": <strategy name with emoji, max 50 chars>, "description": <2-3 sentence specific action plan> }
]`;

  const userPrompt = `Create liquidation strategies for:
Name: ${product.name}
Category: ${product.category}
Condition: ${product.condition}
Price: ₹${product.price} per ${product.unit}
Quantity: ${product.quantity} ${product.unit}
MRP: ₹${product.mrp || 'Not provided'}
Description: ${product.description || 'None'}`;

  try {
    return await callGemini(sys, userPrompt, true);
  } catch (e) {
    console.error('generateLiquidationStrategies error:', e.message);
    return [
      { title: '📦 Bundle & Volume Offer', description: `Create a bundled offer of ${product.name} with complementary items. Offer tiered pricing for larger quantities to attract MSME buyers looking for complete solutions at lower per-unit cost.` },
      { title: '🏭 Industrial Supply Channel', description: `Redirect this ${product.category} lot to secondary manufacturers, processing plants, or upcycling firms. The ${product.condition} condition makes it ideal as raw material or spare stock.` },
      { title: '🚚 Regional Dealer Network', description: 'Partner with discount distributors in major trade zones (Karol Bagh Delhi, APMC Mumbai, or local mandis) for rapid bulk clearance at slightly reduced margins.' }
    ];
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. PERSONALIZED SALES PITCH
// ─────────────────────────────────────────────────────────────────────────────
/**
 * Generates a personalized B2B sales pitch from seller to a specific buyer.
 * Returns: string (message text)
 */
export async function generateSalesPitch(product, buyer) {
  const sys = `You are a B2B sales expert writing personalized liquidation pitch messages for BulkBazar, an Indian wholesale dead stock marketplace.
Write a professional, persuasive, and personalized pitch message. Keep it conversational but business-focused.
Use ₹ for prices. Include specific product details. End with a clear call to action.
Return ONLY the message text — no JSON, no markdown headers.`;

  const discount = product.mrp && product.mrp > product.price
    ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
    : null;

  const userPrompt = `Write a personalized B2B pitch:
Buyer: ${buyer.full_name || 'Procurement Manager'} at ${buyer.company || 'their company'}
Buyer sourcing interest: ${buyer.sourcing_categories || product.category}

Product being pitched:
Name: ${product.name}
Category: ${product.category}
Condition: ${product.condition}
Price: ₹${product.price} per ${product.unit}
${discount ? `Discount off MRP: ${discount}%` : ''}
Quantity available: ${product.quantity} ${product.unit}
Description: ${product.description || 'Quality wholesale lot'}`;

  try {
    return await callGemini(sys, userPrompt, false);
  } catch (e) {
    console.error('generateSalesPitch error:', e.message);
    return `Dear ${buyer.full_name || 'Procurement Officer'},

We have an immediate liquidation opportunity matching your sourcing interests.

📦 Product: ${product.name}
💰 Price: ₹${product.price} per ${product.unit} (${product.quantity} units available)
⭐ Condition: ${product.condition}

This stock is ready for immediate dispatch. Please let us know if you'd like to negotiate terms.

Best regards`;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. NEGOTIATION COPILOT
// ─────────────────────────────────────────────────────────────────────────────
/**
 * Suggests a smart negotiation reply based on full conversation history.
 * @param {Array} messages - Array of { text, isMe } chat messages
 * @param {Object} product - Product being negotiated
 * @param {string} role - 'seller' or 'buyer'
 * @param {string} style - 'counter' | 'firm' | 'bundle'
 * Returns: string
 */
export async function suggestNegotiationReply(messages, product, role, style) {
  const sys = `You are an expert B2B negotiation assistant for BulkBazar, an Indian wholesale dead stock marketplace.
Based on the conversation and the requested negotiation style, write the ideal next message.
Keep it concise (2-4 sentences), professional, and persuasive. Use ₹ for prices.
Return ONLY the message text.`;

  const styleDescriptions = {
    counter: 'Counter-offer — propose a specific middle-ground price',
    firm: 'Hold firm — politely maintain your price, offer a non-price benefit instead',
    bundle: 'Bundle deal — offer a discount only if they take a larger quantity or the entire lot'
  };

  const conversationText = messages.length > 0
    ? messages.slice(-8).map(m => `${m.isMe ? (role === 'seller' ? 'Seller' : 'Buyer') : (role === 'seller' ? 'Buyer' : 'Seller')}: ${m.text}`).join('\n')
    : 'No messages yet — write an opening message.';

  const userPrompt = `Role: ${role === 'seller' ? 'You are the SELLER' : 'You are the BUYER'}
Style: ${styleDescriptions[style] || style}

Product: ${product?.name || 'product'} at ₹${product?.price || '?'} per ${product?.unit || 'unit'} | Qty: ${product?.quantity || '?'} | MRP: ₹${product?.mrp || 'N/A'}

Conversation:
${conversationText}

Write the next message.`;

  try {
    return await callGemini(sys, userPrompt, false);
  } catch (e) {
    console.error('suggestNegotiationReply error:', e.message);
    const price = Number(product?.price) || 0;
    if (style === 'counter') return `Thank you for the interest. Could we settle at ₹${Math.round(price * 0.94)} per unit? That balances both our positions fairly.`;
    if (style === 'firm') return `We appreciate your offer, but ₹${price} per unit is already our best rate for this condition and quantity. We can ensure same-week dispatch if you confirm today.`;
    return `If you're open to taking the full lot of ${product?.quantity} ${product?.unit}, we can offer a special volume price. Shall we discuss the terms?`;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. EXPIRY PRICE DECAY & ALARM
// ─────────────────────────────────────────────────────────────────────────────
/**
 * Calculates a 4-stage price decay curve based on expiry date, condition, and category.
 * Returns: { currentStatus: string, daysToExpiry: number, decayTimeline: Array, clearancePitch: string }
 */
export async function getExpiryPriceDecayCurve(product) {
  const sys = `You are a B2B dead stock liquidation expert. 
For the provided product with an expiry date, calculate a 4-stage price decay timeline as it approaches expiration.
The decay stages should represent:
1. Fresh Stage (current or initial stage)
2. Warning Stage (typically 45-60 days before expiry)
3. Critical Stage (typically 20-30 days before expiry)
4. Clearance Stage (typically 5-10 days before expiry)

Return ONLY valid JSON (no markdown, no extra text) with this exact structure:
{
  "currentStatus": <"Safe" | "Warning: Expires in X Days" | "Critical: Expires in X Days">,
  "daysToExpiry": <integer number of days remaining>,
  "decayTimeline": [
    { "stageName": "Stage Name", "daysRemaining": <days remaining range as string, e.g. '60-90 Days'>, "discountPct": <integer discount percentage, e.g. 20>, "suggestedPrice": <integer price in INR>, "rationale": "one short sentence rationale" }
  ],
  "clearancePitch": <Urgent B2B clearance proposal copy (100-150 words) tailored to bulk buyers & liquidators for quick acquisition>
}`;

  const userPrompt = `Calculate expiry price decay timeline for:
Name: ${product.name}
Category: ${product.category}
Price: ₹${product.price}
MRP: ₹${product.mrp || 'Not provided'}
Quantity: ${product.quantity} ${product.unit}
Condition: ${product.condition}
Expiry Date: ${product.expiry_date || 'Unknown'}
Today's Date: ${new Date().toISOString().split('T')[0]}`;

  try {
    return await callGemini(sys, userPrompt, true);
  } catch (e) {
    console.error('getExpiryPriceDecayCurve error:', e.message);
    const price = Number(product.price) || 100;
    const days = product.expiry_date 
      ? Math.ceil((new Date(product.expiry_date).getTime() - Date.now()) / 86400000)
      : 30;
    return {
      currentStatus: days > 60 ? 'Safe' : days > 30 ? `Warning: Expires in ${days} Days` : `Critical: Expires in ${days} Days`,
      daysToExpiry: days,
      decayTimeline: [
        { stageName: "Fresh Lot", daysRemaining: "60+ Days", discountPct: 0, suggestedPrice: price, rationale: "Product is fresh. Sells at standard B2B resale rate." },
        { stageName: "Warning Phase", daysRemaining: "30-60 Days", discountPct: 20, suggestedPrice: Math.round(price * 0.8), rationale: "Approaching half shelf-life. Small bulk discount recommended." },
        { stageName: "Critical Zone", daysRemaining: "15-30 Days", discountPct: 50, suggestedPrice: Math.round(price * 0.5), rationale: "Clearance phase. Heavy discount to match discount retailers." },
        { stageName: "Terminal Phase", daysRemaining: "0-15 Days", discountPct: 80, suggestedPrice: Math.round(price * 0.2), rationale: "Last call clearance. Salvage value clearance pricing." }
      ],
      clearancePitch: `URGENT CLEARANCE OFFER: We are liquidating ${product.quantity} ${product.unit} of ${product.name} at a major clearance price of ₹${Math.round(price * 0.5)} per unit (original asking ₹${price}). Short shelf-life (expires in ${days} days). Ideal for immediate resale or distribution. Contact us now to finalize freight and immediate loading!`
    };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 8. LIVE MARKET RATE SUGGESTIONS
// ─────────────────────────────────────────────────────────────────────────────
/**
 * Generates an AI suggestion about the product's price relative to estimated B2B market rates.
 * Returns: { title: string, message: string }
 */
export async function generateMarketRateSuggestion(product) {
  const sys = `You are BulkBazar's B2B Market Pricing Broker.
Analyze the product listing details and write a helpful, brief notification alerting the seller about the current market rate or pricing strategy they should implement next.
Keep it extremely concise (title: max 45 chars, message: max 120 chars).
Return ONLY valid JSON (no markdown, no extra text) with this exact structure:
{
  "title": "Short title with emoji, e.g. 📊 FMCG Demand Spike",
  "message": "Direct B2B suggestion/action, e.g. Maruti Fronx demand rose 12% this week. Lower price by 5% to match 3 active buyers."
}`;

  const userPrompt = `Generate a market rate suggestion for:
Name: ${product.name}
Category: ${product.category}
Price: ₹${product.price}
MRP: ₹${product.mrp || 'Not provided'}
Condition: ${product.condition}
Quantity: ${product.quantity} ${product.unit}`;

  try {
    return await callGemini(sys, userPrompt, true);
  } catch (e) {
    console.error('generateMarketRateSuggestion error:', e.message);
    return {
      title: `💡 Optimize ${product.name}`,
      message: `Consider reducing price of ${product.name} by 8% to match local MSME retail buyers in the ${product.category} sector.`
    };
  }
}


