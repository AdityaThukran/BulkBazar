/**
 * BulkBazar Core B2B AI Dead Stock Engine
 * Heuristics & Simulators for Dead Stock Revival Optimization
 */

// Resale value multiplier by condition
const CONDITION_MULTIPLIERS = {
  new: 0.85,
  'like-new': 0.75,
  good: 0.60,
  fair: 0.40,
  damaged: 0.20
};

// Base B2B market category demand level (0 - 100)
const CATEGORY_DEMAND = {
  Textiles: 75,
  Electronics: 80,
  FMCG: 90,
  'Auto Parts': 85,
  Pharma: 65,
  'Building Materials': 70,
  Chemicals: 55,
  Agriculture: 60,
  Other: 50
};

/**
 * Evaluates the marketability score and optimization diagnostic tips for a product.
 * Returns { score, level, tips }
 */
export const estimateMarketability = (product) => {
  if (!product) return { score: 50, level: 'Medium', tips: [] };

  let score = 60; // Starting baseline
  const tips = [];

  // 1. Condition evaluation
  const cond = product.condition || 'new';
  if (cond === 'new' || cond === 'like-new') {
    score += 15;
  } else if (cond === 'good') {
    score += 5;
  } else if (cond === 'fair') {
    score -= 10;
    tips.push('Item condition is Fair. Consider bundling or offering higher discounts.');
  } else if (cond === 'damaged') {
    score -= 30;
    tips.push('Item is listed as Damaged. Restructure as "scrap materials" to target recycling buyers.');
  }

  // 2. Pricing & discount evaluation
  const mrp = Number(product.mrp) || 0;
  const price = Number(product.price) || 0;
  if (mrp > 0 && price > 0) {
    const discount = ((mrp - price) / mrp) * 100;
    if (discount >= 50) {
      score += 15;
    } else if (discount >= 30) {
      score += 5;
    } else if (discount < 15) {
      score -= 15;
      tips.push('Resale discount is too narrow (< 15%). B2B buyers search for at least 30-50% off retail.');
    }
  } else {
    tips.push('Original MRP is missing. Providing an MRP helps buyers verify the discount rate.');
  }

  // 3. Category demand
  const category = product.category || 'Other';
  const categoryWeight = CATEGORY_DEMAND[category] || 50;
  score += (categoryWeight - 60) * 0.4;

  // 4. Image presence check
  if (product.image_url) {
    score += 15;
  } else {
    score -= 10;
    tips.push('No product photo uploaded. Adding a real photo increases buyer response rate by 240%.');
  }

  // 5. Inventory aging (simulated from product creation)
  const ageDays = product.created_at 
    ? Math.floor((Date.now() - new Date(product.created_at).getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  if (ageDays > 60) {
    score -= 15;
    tips.push('Listing has been active for over 60 days. Liquidate now by dropping price or pitching directly to matching buyers.');
  }

  // Bound score between 5 and 99
  score = Math.max(5, Math.min(99, Math.round(score)));

  let level = 'Medium';
  if (score >= 80) level = 'High';
  else if (score < 45) level = 'Low';

  return { score, level, tips };
};

/**
 * Recommends an optimized reselling price based on MRP, category demand index, and condition.
 */
export const suggestDynamicPrice = (product) => {
  const mrp = Number(product.mrp) || Number(product.price) * 1.5 || 100;
  const cond = product.condition || 'new';
  const category = product.category || 'Other';

  const condMultiplier = CONDITION_MULTIPLIERS[cond] || 0.6;
  const categoryIndex = (CATEGORY_DEMAND[category] || 50) / 100;

  // AI Optimal Target: base MRP deprecation scaled by category market speed
  let suggested = mrp * condMultiplier * (0.6 + categoryIndex * 0.2);

  // Suggested price shouldn't exceed current selling price unless it was extremely undervalued
  if (product.price && suggested > product.price) {
    suggested = product.price * 0.9;
  }

  return Math.round(suggested);
};

/**
 * Returns forecasted weekly demand metrics for the next 4 weeks for SVG rendering.
 */
export const generateForecastData = (category) => {
  const baseDemand = CATEGORY_DEMAND[category] || 60;
  const trendMultiplier = category === 'Textiles' || category === 'FMCG' || category === 'Auto Parts' ? 1.05 : 0.98;

  const points = [];
  let current = baseDemand;
  for (let week = 1; week <= 4; week++) {
    current = current * (trendMultiplier + (Math.random() * 0.04 - 0.02));
    points.push({
      week: `Week ${week}`,
      demand: Math.round(Math.min(100, Math.max(10, current)))
    });
  }
  return points;
};

/**
 * Generates an automated B2B sales proposal pitch.
 */
export const generateBusinessProposal = (product, buyer) => {
  if (!product || !buyer) return '';

  const discount = product.mrp && product.mrp > product.price
    ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
    : null;

  const discountText = discount ? `${discount}% below original market price` : 'at highly competitive reselling terms';

  const greetings = [
    `Dear ${buyer.full_name || 'Procurement Officer'},\n\n`,
    `Hi ${buyer.full_name?.split(' ')[0] || 'Partner'},\n\n`
  ];

  const greeting = greetings[Math.floor(Math.random() * greetings.length)];

  return `${greeting}This is an AI-generated Dead Stock Liquidation Pitch from BulkBazar.

We noticed your profile is actively sourcing dead stock in the **${product.category}** category. We have an immediate liquidation offer that matches your requirements:

📦 *Product:* ${product.name}
🔢 *Available Quantity:* ${product.quantity} ${product.unit}
🏷️ *Liquidation Price:* ₹${product.price} per ${product.unit} (${discountText})
⭐ *Condition:* ${product.condition.toUpperCase()}

This lot is immediately ready for dispatch. Please let us know if you want to negotiate terms or schedule a delivery.

Best regards,
${product.profiles?.full_name || 'Seller'}
${product.profiles?.company || 'Supplier partner'}`;
};

/**
 * Optimizes a product's name and description for B2B wholesale buyers.
 */
export const optimizeListing = (name, description, category) => {
  const cleanName = name ? name.trim() : 'Unused Material';
  const cleanDesc = description ? description.trim() : 'No current details provided.';
  
  // 1. Create a professional, clear B2B listing title
  let optimizedName = cleanName;
  if (!cleanName.toLowerCase().includes('wholesale') && !cleanName.toLowerCase().includes('bulk') && !cleanName.toLowerCase().includes('lot')) {
    optimizedName = `${cleanName} - Wholesale Dead Stock Lot`;
  }
  if (!optimizedName.includes('(') && category) {
    optimizedName = `${optimizedName} (${category})`;
  }

  // 2. Generate a structured B2B description
  const optimizedDescription = `✨ [AI Optimized Dead Stock Listing]

📋 Product Summary:
${cleanDesc}

💡 B2B Revival Specifications:
- Category resale grade: Premium Commercial Clearance
- Standard Packaging: Industrial protective pallets / bulk wrapping
- Logistical readiness: Loading dock access ready for immediate dispatch
- Best suited for: MSME outlets, discount retail suppliers, and secondary manufacturers.

🚚 Shipping & Deals:
Open to tiered volume discounts. Contact us via the live BulkBazar chat drawer to make a custom counter-offer.`;

  return { name: optimizedName, description: optimizedDescription };
};

/**
 * Generates three actionable liquidation strategies for a given dead stock listing.
 */
export const generateLiquidationStrategies = (product) => {
  if (!product) return [];

  const name = product.name || 'this stock';
  
  const strategies = [
    {
      title: '📦 Dynamic Bundle Package Offer',
      description: `Package ${product.quantity} units of ${name} with slow-moving items in the same category. Promote it as a single high-discount bundle to MSMEs looking for a low cost-of-entry lot.`
    },
    {
      title: '🏭 Industrial Supply Redirect',
      description: `Redirect this lot to processing plants, upcycling firms, or secondary assembly factories. Since condition is ${product.condition}, it serves as high-quality raw materials or spare stock.`
    },
    {
      title: '🚚 Regional Discount Liquidators',
      description: `Directly pitch this stock to discount dealers in major retail markets (e.g. Karol Bagh/Delhi or nearby trade zones). They focus on off-season and surplus acquisition.`
    }
  ];

  return strategies;
};

/**
 * AI Chat negotiation assistant: suggests B2B counter-offers, firm pitches, and bundling responses.
 */
export const suggestChatResponse = (lastMessage, product, role, style) => {
  if (!product) return 'Let me check the product details and get back to you.';
  
  const price = Number(product.price);
  const name = product.name || 'this stock';
  const msgLower = (lastMessage || '').toLowerCase();

  // Try to parse if there's a price mentioned in the last message
  let offerPrice = null;
  const match = msgLower.match(/(?:rs|inr|₹|\$)\s*(\d+)/) || msgLower.match(/(\d+)\s*(?:rs|inr|₹|bucks|rupees)/);
  if (match) {
    offerPrice = Number(match[1]);
  }

  if (role === 'seller') {
    if (style === 'counter') {
      const counterPrice = offerPrice 
        ? Math.round((price + offerPrice) / 2) // Middle ground
        : Math.round(price * 0.92); // 8% discount
      return `Hi, thanks for the offer. While we cannot sell at your suggested price, we can meet in the middle at ₹${counterPrice} per unit for this lot of ${name}. Would that work for you?`;
    }
    
    if (style === 'firm') {
      return `Thank you for your interest. Because we have already discounted this ${name} lot significantly (${Math.round((product.mrp - price) / product.mrp * 100) || 40}% off retail), ₹${price} per unit is our final price. However, we can help coordinate prompt loading and logistics.`;
    }
    
    if (style === 'bundle') {
      const bundlePrice = Math.round(price * 0.85); // 15% discount for taking everything
      return `If you are willing to purchase the entire lot of ${product.quantity} ${product.unit} of ${name}, we can offer a bulk liquidation discount, bringing the price down to ₹${bundlePrice} per unit. Let us know if you'd like to proceed.`;
    }
  } else {
    // Buyer responses
    if (style === 'counter') {
      const targetPrice = Math.round(price * 0.8); // Propose 20% off
      return `Hi, I am interested in this lot of ${name}. Given that it is surplus stock, would you be open to an offer of ₹${targetPrice} per unit? We can handle quick pick-up.`;
    }
    
    if (style === 'firm') {
      return `Thank you for the update. Our budget for this category is quite firm, but we are ready to proceed with purchasing ${Math.min(10, product.quantity)} units immediately if you can confirm logistics.`;
    }
    
    if (style === 'bundle') {
      const targetBundlePrice = Math.round(price * 0.75); // Propose 25% off for all
      return `We are open to clearing your entire inventory of ${product.quantity} units of ${name} in one go. Can you offer a volume clearing price of ₹${targetBundlePrice} per unit for the whole lot?`;
    }
  }

  return 'Sounds good, let\'s negotiate the terms.';
};
