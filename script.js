// script.js - Airtel Integrated Landing Page Logic

// State Management
let billingCycle = 'monthly'; // 'monthly' or 'annual'
let simCount = 2;
let cameraCount = 1;

// Customizer individual price tokens
const PRICES = {
  broadband: 599,
  mobileBase: 350,
  dth: 250,
  googleone: 209,
  securityBase: 150,
  bank: 99
};

// Chatbot State
let chatStage = 0;
let userProfile = {
  familySize: null,
  priorityServices: [], // Array to store multiple selections
  recommendedPlan: null
};

let selectedServices = []; // Holds current selections in multi-select UI

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
  // Update Customizer UI on load
  updateCustomizer();
  
  // Set up chatbot initial greeting
  initChatbot();

  // Scroll animations setup
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealElements.forEach(el => revealObserver.observe(el));
});

// Tab Swapping Logic (Controlled solely by main Header Nav Links now!)
function switchTab(tabId) {
  // 1. Hide all tab content
  const contents = document.querySelectorAll('.tab-content');
  contents.forEach(content => {
    content.classList.remove('active');
  });

  // 2. Show active tab content
  const activeContent = document.getElementById(`tab-${tabId}`);
  if (activeContent) {
    activeContent.classList.add('active');
  }

  // 3. Update main header and mobile bottom nav active states
  const navItems = ['overview', 'services', 'packages', 'customizer', 'faq'];
  navItems.forEach(item => {
    // Desktop Nav Links
    const el = document.getElementById(`nav-item-${item}`);
    if (el) {
      if (item === tabId) {
        el.classList.add('active');
      } else {
        el.classList.remove('active');
      }
    }
    // Mobile Bottom Nav Links
    const mobileEl = document.getElementById(`mobile-nav-item-${item}`);
    if (mobileEl) {
      if (item === tabId) {
        mobileEl.classList.add('active');
      } else {
        mobileEl.classList.remove('active');
      }
    }
  });

  // 4. Scroll page back to top smoothly
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 1. Billing Cycle Toggle Logic
function toggleBillingCycle() {
  const toggle = document.getElementById('billing-toggle');
  const labelMonthly = document.getElementById('label-monthly');
  const labelAnnual = document.getElementById('label-annual');
  
  billingCycle = toggle.checked ? 'annual' : 'monthly';
  
  if (billingCycle === 'annual') {
    labelMonthly.classList.remove('active');
    labelAnnual.classList.add('active');
  } else {
    labelMonthly.classList.add('active');
    labelAnnual.classList.remove('active');
  }

  // Update card prices
  const priceNums = document.querySelectorAll('.price-num');
  priceNums.forEach(num => {
    const monthlyVal = num.getAttribute('data-monthly');
    const annualVal = num.getAttribute('data-annual');
    
    if (billingCycle === 'annual') {
      num.textContent = annualVal;
      // Update sub labels
      if (num.id === 'family-price-val') {
        document.getElementById('family-period-label').textContent = '/mo (billed annually)';
        document.getElementById('family-orig-price').textContent = '₹2,006/mo individual equivalent';
      } else {
        const periodSpan = num.parentElement.querySelector('.period');
        if (periodSpan) periodSpan.textContent = '/mo (billed annually)';
      }
    } else {
      num.textContent = monthlyVal;
      if (num.id === 'family-price-val') {
        document.getElementById('family-period-label').textContent = '/mo for 3 mos';
        document.getElementById('family-orig-price').textContent = '₹1,499/mo';
      } else {
        const periodSpan = num.parentElement.querySelector('.period');
        if (periodSpan) periodSpan.textContent = '/mo';
      }
    }
  });
}

// 2. Customizer Logic
function adjustSimCount(change) {
  const newCount = simCount + change;
  if (newCount >= 1 && newCount <= 5) {
    simCount = newCount;
    document.getElementById('sim-count-display').textContent = simCount;
    // Auto check postpaid checkbox if count adjusted
    document.getElementById('opt-mobile').checked = true;
    updateCustomizer();
  }
}

// Adjust camera count
function adjustCameraCount(change) {
  const newCount = cameraCount + change;
  if (newCount >= 1 && newCount <= 4) {
    cameraCount = newCount;
    document.getElementById('camera-count-display').textContent = cameraCount;
    // Auto check security camera checkbox if count adjusted
    document.getElementById('opt-security').checked = true;
    updateCustomizer();
  }
}

function updateCustomizer() {
  const isBroadband = document.getElementById('opt-broadband').checked;
  const isMobile = document.getElementById('opt-mobile').checked;
  const isDth = document.getElementById('opt-dth').checked;
  const isGoogleOne = document.getElementById('opt-googleone').checked;
  const isSecurity = document.getElementById('opt-security').checked;
  const isBank = document.getElementById('opt-bank').checked;
  const isAutopay = document.getElementById('opt-autopay').checked;

  // Toggle rows highlights classes
  document.getElementById('row-broadband').className = isBroadband ? 'service-toggle-row selected' : 'service-toggle-row';
  document.getElementById('row-mobile').className = isMobile ? 'service-toggle-row selected' : 'service-toggle-row';
  document.getElementById('row-dth').className = isDth ? 'service-toggle-row selected' : 'service-toggle-row';
  document.getElementById('row-googleone').className = isGoogleOne ? 'service-toggle-row selected' : 'service-toggle-row';
  document.getElementById('row-security').className = isSecurity ? 'service-toggle-row selected' : 'service-toggle-row';
  document.getElementById('row-bank').className = isBank ? 'service-toggle-row selected' : 'service-toggle-row';
  document.getElementById('row-autopay').className = isAutopay ? 'service-toggle-row selected' : 'service-toggle-row';

  // Calculate costs & coins
  let listHtml = '';
  let subtotal = 0;
  let coins = 0;

  if (isBroadband) {
    listHtml += `<div class="summary-item"><span>Airtel Fiber Broadband</span><span>₹${PRICES.broadband}/mo</span></div>`;
    subtotal += PRICES.broadband;
    coins += 100;
  }
  if (isMobile) {
    const cost = PRICES.mobileBase * simCount;
    listHtml += `<div class="summary-item"><span>Postpaid SIMs (${simCount} lines)</span><span>₹${cost}/mo</span></div>`;
    subtotal += cost;
    coins += 100 * simCount;
  }
  if (isDth) {
    listHtml += `<div class="summary-item"><span>Airtel Xstream Box & Play</span><span>₹${PRICES.dth}/mo</span></div>`;
    subtotal += PRICES.dth;
    coins += 50;
  }
  if (isGoogleOne) {
    listHtml += `<div class="summary-item"><span>Google One (2TB Storage)</span><span>₹${PRICES.googleone}/mo</span></div>`;
    subtotal += PRICES.googleone;
    coins += 150;
  }
  if (isSecurity) {
    const cost = PRICES.securityBase * cameraCount;
    listHtml += `<div class="summary-item"><span>Airtel Xsafe Camera (${cameraCount} units)</span><span>₹${cost}/mo</span></div>`;
    subtotal += cost;
    coins += 100 * cameraCount;
  }
  if (isBank) {
    listHtml += `<div class="summary-item"><span>Payments Bank Prime</span><span>₹${PRICES.bank}/mo</span></div>`;
    subtotal += PRICES.bank;
    coins += 50;
  }
  if (isAutopay) {
    listHtml += `<div class="summary-item" style="color:var(--success-green); font-weight:600;"><span>Autopay Reward Applied</span><span>-₹50/mo</span></div>`;
    subtotal -= 50;
    coins += 1000; // Autopay bonus coins
  }

  // Cap subtotal to 0
  if (subtotal < 0) subtotal = 0;

  if (listHtml === '') {
    listHtml = `<div class="summary-item" style="color:var(--text-muted);">No services selected. Check boxes to calculate.</div>`;
  }

  document.getElementById('customizer-items-list').innerHTML = listHtml;
  document.getElementById('custom-total-val').textContent = `₹${subtotal}/mo`;
  document.getElementById('custom-coins-val').textContent = coins.toLocaleString();

  // Recommend best prebuilt bundle
  const recBox = document.getElementById('bundle-recommendation-box');
  
  if (subtotal === 0) {
    recBox.style.display = 'none';
    return;
  }
  
  recBox.style.display = 'block';
  
  // Decide best matching package recommendation
  if (isBroadband && isMobile && simCount >= 3 && isSecurity && cameraCount >= 2) {
    const savings = subtotal - (2999 - (isAutopay ? 50 : 0));
    if (savings > 0) {
      recBox.innerHTML = `We recommend the <strong>Airtel Infinite</strong> package. You'll save <strong>₹${savings}/mo</strong>, earn 1,000 monthly coins, and get Google One 2TB storage!`;
    } else {
      recBox.innerHTML = `We recommend the <strong>Airtel Infinite</strong> package for full smart home coverage.`;
    }
  } else if (isBroadband && isMobile && simCount <= 2 && (isSecurity || isBank || isDth || isGoogleOne)) {
    const normalPrice = 1499 - (isAutopay ? 50 : 0);
    const savings = subtotal - normalPrice;
    
    let promoPrice = 999 - (isAutopay ? 50 : 0);
    let promoSavings = subtotal - promoPrice;
    let text = `We recommend the <strong>Family Secure</strong> package. Normal: ₹1,449/mo (Saves ₹${savings}/mo). <br><span style="color:var(--accent-gold);font-weight:700;">PROMO: First 3 months for ₹${promoPrice}/mo (Save ₹${promoSavings}/mo)!</span>`;
    recBox.innerHTML = text;
  } else if (isBroadband && isMobile && simCount === 1 && isDth && !isSecurity) {
    const savings = subtotal - (999 - (isAutopay ? 50 : 0));
    recBox.innerHTML = `We recommend the <strong>Airtel Connect</strong> package for ₹999/mo. You save <strong>₹${savings}/mo</strong>!`;
  } else if (isMobile && !isBroadband && simCount === 1 && isDth) {
    const savings = (PRICES.mobileBase + PRICES.dth - (isAutopay ? 50 : 0)) - 499;
    recBox.innerHTML = `We recommend the <strong>Airtel Starter</strong> package for ₹499/mo. Save <strong>₹${savings}/mo</strong>!`;
  } else {
    recBox.innerHTML = `Consolidating services into our <strong>Family Secure</strong> tier saves typical homes an average of <strong>₹300/mo</strong> compared to individual billing.`;
  }
}

function highlightServiceInCustomizer(service) {
  // First swap to the Customizer Tab
  switchTab('customizer');
  
  // Wait a small bit for tab switch animation to fire, then scroll and flash
  setTimeout(() => {
    // Check correct option checkbox
    const checkbox = document.getElementById(`opt-${service}`);
    if (checkbox) {
      checkbox.checked = true;
      updateCustomizer();
    }
    
    // Flash toggle row green temporarily
    const row = document.getElementById(`row-${service}`);
    if (row) {
      row.style.borderColor = 'var(--airtel-red)';
      row.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => {
        row.style.borderColor = '';
      }, 1500);
    }
  }, 400);
}

function checkoutCustom() {
  alert("Thank you for your interest! Your custom bundle configuration has been simulated. An Airtel onboarding consultant will contact you to initiate connection.");
}

function selectPlan(planName) {
  alert(`Thank you for selecting the Airtel ${planName} package! We have registered your simulated inquiry. You can now chat with AirBot in the bottom right corner for onboarding support.`);
}

// 3. FAQ Accordion Logic
function toggleFaq(element) {
  const item = element.parentElement;
  const answer = item.querySelector('.faq-answer');
  const icon = item.querySelector('.faq-icon i');
  
  const isActive = item.classList.contains('active');
  
  // Close all other FAQs
  const allItems = document.querySelectorAll('.faq-item');
  allItems.forEach(i => {
    i.classList.remove('active');
    i.querySelector('.faq-answer').style.maxHeight = '0';
    i.querySelector('.faq-icon i').className = 'fa-solid fa-plus';
  });

  if (!isActive) {
    item.classList.add('active');
    answer.style.maxHeight = answer.scrollHeight + 'px';
    icon.className = 'fa-solid fa-xmark';
  }
}

// 4. Chatbot ("AirBot") Logic
function toggleChatbot(forceOpen = null) {
  const widget = document.getElementById('sparky-widget');
  const badge = widget.querySelector('.chatbot-badge');
  
  if (badge) badge.style.display = 'none'; // clear unread indicator
  
  if (typeof forceOpen === 'boolean') {
    if (forceOpen) widget.classList.add('open');
    else widget.classList.remove('open');
  } else {
    widget.classList.toggle('open');
  }
}

function initChatbot() {
  const container = document.getElementById('chat-messages-container');
  container.innerHTML = '';
  
  // AirBot greeting with context explaining why we're asking questions
  addBotMessage("Hi! I'm <strong>AirBot</strong>, your digital home companion! 🤖<br><br>I help families bundle their disconnected utilities (like mobile bills, home internet, and TV charges) into a single discounted account.<br><br>To help us determine the **ideal number of postpaid SIMs** and **broadband data limits** for your household, let's start here: <strong>How many people live in your household?</strong>");
  
  // Show initial options chips
  showChips([
    { text: "Just Me (1 Person)", value: "1" },
    { text: "2 People", value: "2" },
    { text: "3-4 Family Members", value: "3-4" },
    { text: "5+ Large Household", value: "5+" }
  ]);
}

function addBotMessage(text) {
  const container = document.getElementById('chat-messages-container');
  const msg = document.createElement('div');
  msg.className = 'chat-bubble bot';
  msg.innerHTML = text;
  container.appendChild(msg);
  scrollToBottom();
}

function addUserMessage(text) {
  const container = document.getElementById('chat-messages-container');
  const msg = document.createElement('div');
  msg.className = 'chat-bubble user';
  msg.textContent = text;
  container.appendChild(msg);
  scrollToBottom();
}

// Multi-select and Single-select chips generator
function showChips(options, isMultiSelect = false) {
  const chipsContainer = document.getElementById('chat-chips-container');
  chipsContainer.innerHTML = '';
  selectedServices = [];
  
  if (isMultiSelect) {
    options.forEach(opt => {
      const chip = document.createElement('div');
      chip.className = 'chip';
      chip.innerHTML = `<i class="fa-regular fa-square" style="margin-right:6px;"></i> ${opt.text}`;
      
      chip.onclick = () => {
        const idx = selectedServices.indexOf(opt.value);
        if (idx > -1) {
          selectedServices.splice(idx, 1);
          chip.classList.remove('selected');
          chip.querySelector('i').className = 'fa-regular fa-square';
        } else {
          selectedServices.push(opt.value);
          chip.classList.add('selected');
          chip.querySelector('i').className = 'fa-solid fa-square-check';
        }
      };
      chipsContainer.appendChild(chip);
    });
    
    // Add primary Confirm button chip
    const confirmChip = document.createElement('div');
    confirmChip.className = 'chip confirm-chip';
    confirmChip.style.background = 'var(--airtel-red-gradient)';
    confirmChip.style.color = '#fff';
    confirmChip.style.borderColor = 'transparent';
    confirmChip.style.fontWeight = '700';
    confirmChip.innerHTML = `<i class="fa-solid fa-check" style="margin-right:6px;"></i> Confirm Choices`;
    confirmChip.onclick = () => {
      if (selectedServices.length === 0) {
        alert("Please select at least one service of interest!");
        return;
      }
      
      // Clean readable text log
      const labelText = selectedServices.map(s => {
        if (s === 'wifi') return 'Fiber WiFi';
        if (s === 'mobile') return 'Family SIMs';
        if (s === 'security') return 'Xsafe Camera';
        if (s === 'googleone') return 'Google One';
        if (s === 'dth') return 'Xstream TV';
        return s;
      }).join(', ');
      
      addUserMessage(`Selected: ${labelText}`);
      chipsContainer.innerHTML = '';
      
      setTimeout(() => {
        processChatStep(selectedServices);
      }, 600);
    };
    chipsContainer.appendChild(confirmChip);
  } else {
    options.forEach(opt => {
      const chip = document.createElement('div');
      chip.className = 'chip';
      chip.textContent = opt.text;
      chip.onclick = () => handleChipClick(opt.text, opt.value);
      chipsContainer.appendChild(chip);
    });
  }
}

function handleChipClick(text, value) {
  addUserMessage(text);
  document.getElementById('chat-chips-container').innerHTML = ''; // Clear chips
  
  // Set tiny typing simulation delay
  setTimeout(() => {
    processChatStep(value);
  }, 600);
}

function handleChatSubmit(event) {
  event.preventDefault();
  const input = document.getElementById('chat-user-input');
  const text = input.value.trim();
  
  if (text === '') return;
  
  addUserMessage(text);
  input.value = '';
  
  setTimeout(() => {
    processUserText(text);
  }, 600);
}

// Conversation Tree States
function processChatStep(value) {
  if (chatStage === 0) {
    userProfile.familySize = value;
    chatStage = 1;
    
    // Add context explaining why we need to know their service priority, launching MULTI-SELECT chips
    addBotMessage(`Understood! A household size of <strong>${value}</strong> has specific data-sharing needs. <br><br>Now, to customize your recommendation—<strong>please select ALL the services you need in your home (multiple selection)</strong> and click **Confirm Choices** when ready:`);
    showChips([
      { text: "⚡ Fiber WiFi", value: "wifi" },
      { text: "📱 Family SIMs", value: "mobile" },
      { text: "📺 Xstream Box", value: "dth" },
      { text: "🔒 Xsafe Camera", value: "security" },
      { text: "☁️ Google One Storage", value: "googleone" }
    ], true); // true sets MultiSelect mode!
  } 
  else if (chatStage === 1) {
    userProfile.priorityServices = value; // Stored as array
    chatStage = 2;
    
    recommendPackageBasedOnProfile();
  }
  else if (chatStage === 2) {
    if (value === "book") {
      addBotMessage("Excellent choice. Let's get you set up. I need your **6-digit Zip/Pin Code** to check local fiber availability and match you with our closest concierge installation team.");
      chatStage = 3;
    } else if (value === "coverage") {
      addBotMessage("To check signal levels in your area, please enter your **City name** and **Locality/Sector**.");
      chatStage = 4;
    } else if (value === "ask_faq") {
      showFaqChips();
    }
  }
}

function recommendPackageBasedOnProfile() {
  let recPlan = '';
  let cardHtml = '';
  
  const selected = userProfile.priorityServices; // e.g. ['mobile'], ['wifi', 'mobile'], etc.
  
  const hasWifi = selected.includes('wifi');
  const hasMobile = selected.includes('mobile');
  const hasTV = selected.includes('dth');
  const hasSecurity = selected.includes('security');
  
  // Decide package based logically on exact choices to prevent over-bundling standalone users
  if (selected.length === 1 && selected[0] === 'mobile') {
    // ONLY mobile postpaid selected
    recPlan = "Airtel Starter";
    cardHtml = `
      <div class="recommended-plan-card">
        <h5>Airtel Starter</h5>
        <p>1 Postpaid SIM + Xstream Play OTT + 100GB Google One storage benefit.</p>
        <span class="price">₹499/month</span>
        <button class="chat-plan-btn" onclick="switchTab('packages'); toggleChatbot(false);">Choose Starter</button>
      </div>
    `;
    addBotMessage(`Since you **only need mobile connectivity**, our standalone **${recPlan}** plan matches your needs perfectly.<br><br>💡 **Smart Recommendation:** Note that if you require high-speed fiber internet later, buying it separately will cost ₹599/mo (totaling ₹1,098/mo). Consolidating now into our **Airtel Connect** bundle (₹999/mo) would save you money and bring all services under one bill!<br>${cardHtml}`);
  } 
  else if (selected.length === 1 && selected[0] === 'wifi') {
    // ONLY fiber wifi selected
    recPlan = "Fiber Standalone";
    addBotMessage(`Since you **only need high-speed fiber WiFi**, we recommend our individual **Fiber Standalone** rate at **₹599/mo** (100 Mbps). <br><br>💡 **Savings Tip:** If you also have a mobile line, you can bundle it to get the **Airtel Connect** package for just **₹999/mo** which adds a family postpaid line and smart DTH television, saving you over 25%!`);
  }
  else if (hasWifi && hasMobile && selected.length === 2 && !hasTV && !hasSecurity) {
    // Wifi + Mobile only
    recPlan = "Airtel Connect";
    cardHtml = `
      <div class="recommended-plan-card">
        <h5>Airtel Connect</h5>
        <p>40 Mbps Fiber Broadband + 1 Postpaid SIM + Airtel Xstream Box & Play OTT + 100GB Google One storage.</p>
        <span class="price">₹999/month</span>
        <button class="chat-plan-btn" onclick="switchTab('packages'); toggleChatbot(false);">Choose Connect</button>
      </div>
    `;
    addBotMessage(`Since you need **WiFi and a Mobile SIM**, I recommend **${recPlan}**. It bundles 40 Mbps fiber, a postpaid SIM, and Xstream Box & Play TV together under one bill for just ₹999/mo, preventing double billing overheads.<br>${cardHtml}`);
  }
  else if (hasWifi && hasMobile && hasSecurity) {
    // Fiber + Mobile + Smart Camera
    if (userProfile.familySize === "1" || userProfile.familySize === "2") {
      recPlan = "Airtel Family Secure";
      cardHtml = `
        <div class="recommended-plan-card" style="border-color:var(--airtel-red); background:rgba(237, 29, 36, 0.08);">
          <h5>Family Secure (Special Offer)</h5>
          <p>100 Mbps Fiber + 2 SIMs + Airtel Xstream Box & Play + 1 Xsafe AI Camera + Google One 200GB storage.</p>
          <span class="price"><span style="text-decoration:line-through; font-size:0.8rem; color:var(--text-muted);">₹1,499</span> ₹999/month</span>
          <p style="color:var(--airtel-red); font-size:0.75rem; font-weight:700;">★ Promo: ₹999/mo for first 3 months! (Save ₹50/mo more with Autopay)</p>
          <button class="chat-plan-btn" onclick="switchTab('packages'); toggleChatbot(false);">Claim Promo Deal</button>
        </div>
      `;
      addBotMessage(`Since you need **WiFi, Mobile SIMs, and smart security**, I recommend our popular **Family Secure** package. <br><br>💡 **Special Offer:** We are running a launch discount on this plan for the first 3 months, bringing the price down to just **₹999/month** (normally ₹1,499/mo). Plus, get full **Google One Cloud Storage** included!<br>${cardHtml}`);
    } else {
      recPlan = "Airtel Infinite";
      cardHtml = `
        <div class="recommended-plan-card">
          <h5>Airtel Infinite</h5>
          <p>1 Gbps Fiber + 4 SIMs + Airtel Xstream Box & Play + 3 Xsafe AI Cameras + Google One 2TB storage + Netflix/Prime.</p>
          <span class="price">₹2,999/month</span>
          <button class="chat-plan-btn" onclick="switchTab('packages'); toggleChatbot(false);">Choose Infinite</button>
        </div>
      `;
      addBotMessage(`For a large household requiring WiFi, multiple mobile lines, and extensive camera security, I recommend **${recPlan}** for gigabit speeds, 4 cellular lines, and 3 AI security cameras under one statement.<br>${cardHtml}`);
    }
  }
  else {
    // Default / Catch-All to Family Secure - offering the best balance of products & discount
    recPlan = "Airtel Family Secure";
    cardHtml = `
      <div class="recommended-plan-card" style="border-color:var(--airtel-red); background:rgba(237, 29, 36, 0.08);">
        <h5>Family Secure (Special Offer)</h5>
        <p>100 Mbps Fiber + 2 SIMs + Airtel Xstream Box & Play + 1 Xsafe AI Camera + Google One 200GB storage + 500 Thanks Coins/mo.</p>
        <span class="price"><span style="text-decoration:line-through; font-size:0.8rem; color:var(--text-muted);">₹1,499</span> ₹999/month</span>
        <p style="color:var(--airtel-red); font-size:0.75rem; font-weight:700;">★ Promo: ₹999/mo for first 3 months! (Save ₹50/mo more with Autopay)</p>
        <button class="chat-plan-btn" onclick="switchTab('packages'); toggleChatbot(false);">Claim Promo Deal</button>
      </div>
    `;
    addBotMessage(`Based on your selections, I recommend our most comprehensive value deal: **Family Secure**! <br><br>💡 **Why this matches:** By combining Fiber Broadband, Postpaid SIMs, Xstream TV, and Xsafe Camera, you qualify for the launch discount of **₹999/mo for the first 3 months** (normally ₹1,499/mo). It eliminates all separate billing fees.<br>${cardHtml}`);
  }
  
  userProfile.recommendedPlan = recPlan;
  
  // Set stage options
  setTimeout(() => {
    addBotMessage("To proceed, would you like to schedule a free installation, check coverage maps, or ask detailed questions about our services?");
    showChips([
      { text: "📅 Book Installation", value: "book" },
      { text: "📡 Check Coverage", value: "coverage" },
      { text: "💬 Ask Questions / FAQs", value: "ask_faq" }
    ]);
  }, 1000);
}

function showFaqChips() {
  addBotMessage("Ask me anything about these topics, or type your own question:");
  showChips([
    { text: "Tell me about the 3-Month Offer", value: "faq_discount" },
    { text: "What is Google One storage?", value: "faq_googleone" },
    { text: "Explain Thanks Coins loyalty", value: "faq_coins" },
    { text: "Explain Autopay billing", value: "faq_autopay" }
  ]);
}

// User-typed text processor (simple natural query classification)
function processUserText(text) {
  const query = text.toLowerCase();
  
  // Custom zip code check
  if (chatStage === 3) {
    if (/^\d{6}$/.test(query.replace(/\s/g, ''))) {
      addBotMessage("Great news! Your pincode is within our **High-Speed Fiber coverage zone**. We can schedule your free onboarding visit as early as tomorrow. Would you like to confirm?");
      chatStage = 2;
      showChips([
        { text: "Confirm Tomorrow Booking", value: "confirm_booking" },
        { text: "I need to discuss pricing first", value: "ask_faq" }
      ]);
    } else {
      addBotMessage("That doesn't look like a standard 6-digit pincode. Please enter a valid 6-digit code to check coverage, or ask a question.");
    }
    return;
  }
  
  // City search check
  if (chatStage === 4) {
    addBotMessage("Checking databases... Excellent, our fiber grid is fully active in your area with high signal coverage! Let's get you set up. Would you like to confirm a booking?");
    chatStage = 2;
    showChips([
      { text: "Schedule Installation", value: "book" },
      { text: "Go Back to Plans", value: "ask_faq" }
    ]);
    return;
  }

  // General FAQs
  if (query.includes("discount") || query.includes("offer") || query.includes("three months") || query.includes("3 month") || query.includes("promo") || query.includes("free") || query.includes("faq_discount")) {
    addBotMessage("We are offering our premium **Family Secure** package (normally ₹1,499/mo) at a special launch price of **₹999/mo for the first 3 months**! <br><br>This includes high-speed fiber internet, 2 family postpaid SIMs, an Airtel Xstream Box, and 1 Airtel Xsafe camera. You save a total of ₹1,500 over the introductory period, with zero activation costs.");
    showFaqChips();
  }
  else if (query.includes("google") || query.includes("one") || query.includes("storage") || query.includes("cloud") || query.includes("faq_googleone")) {
    addBotMessage("Our **Google One Cloud Storage** benefit gives you expanded secure storage space to back up photos, documents, and family assets across devices. It's fully bundled into our plans: 100GB in Starter/Connect, 200GB in Family Secure, and 2TB in Infinite!");
    showFaqChips();
  }
  else if (query.includes("coin") || query.includes("thanks coin") || query.includes("loyalty") || query.includes("point") || query.includes("reward") || query.includes("faq_coins")) {
    addBotMessage("**Airtel Thanks Coins** is our loyalty reward program. You earn coins automatically every month based on your bundle plan (up to 1,000 coins/month). You can redeem them directly inside the Airtel Thanks App for shopping coupons, bill cashbacks, or OTT upgrades. Plus, get a **1,000 Thanks Coin bonus** instantly on activating Autopay!");
    showFaqChips();
  }
  else if (query.includes("autopay") || query.includes("automatic") || query.includes("card") || query.includes("save 50") || query.includes("faq_autopay")) {
    addBotMessage("Enabling **Autopay** automates your monthly bill payment securely using your credit card, debit card, or Airtel Payments Bank account. Autopay accounts receive an **instant ₹50/mo bill discount** on their unified statement and a one-time **1,000 Thanks Coin bonus**!");
    showFaqChips();
  }
  else if (query.includes("xsafe") || query.includes("camera") || query.includes("security") || query.includes("surveillance")) {
    addBotMessage("Our **Airtel Xsafe Camera** service features full HD 1080p stream capture, real-time humanoid detection alerts on your phone, night vision, and secure cloud storage backup. It is fully managed by Airtel, and any faulty cameras are replaced free of charge.");
    showFaqChips();
  }
  else if (query.includes("bank") || query.includes("interest") || query.includes("payment") || query.includes("finance")) {
    addBotMessage("With **Airtel Payments Bank Prime**, you earn **7% per annum interest** on your savings. You also get **Airtel Safe Pay** (which uses third-party bank verification protocols to completely stop unauthorized withdrawals), and **1% instant cashback** on your electricity, gas, and postpaid utility bills paid via the Airtel Thanks App.");
    showFaqChips();
  }
  else if (query.includes("consolidate") || query.includes("one bill") || query.includes("bill") || query.includes("invoice") || query.includes("single")) {
    addBotMessage("Consolidation means merging all services into one simple account. Instead of paying one bill for your internet, separate bills for your family SIMs, and another for TV, you receive a single transparent invoice. It lowers administrative overhead, simplifies tracking, and secures bundle discounts (up to 30% savings vs individual rates).");
    showFaqChips();
  }
  else if (query.includes("migration") || query.includes("setup") || query.includes("install") || query.includes("switch")) {
    addBotMessage("Migration is simple! Once you confirm your plan, our **Concierge team** does all the heavy lifting. We lay the fiber, set up the Xstream Box and Airtel Xsafe cameras, and transfer your mobile numbers to the postpaid pool. The entire process takes under 2 hours, and we ensure zero connectivity downtime.");
    showFaqChips();
  }
  else if (query.includes("failure") || query.includes("risk") || query.includes("down") || query.includes("cut")) {
    addBotMessage("Consolidating billing does not mean single point failure! Your **Fiber Broadband** (ground line), **Mobile SIMs** (cellular towers), and **Airtel Xstream TV** (hybrid feed) operate on completely independent networks. If physical fiber gets cut, your mobile SIMs and satellite TV continue working without interruptions. In fact, our smart cameras automatically failover to cellular hot-spots in emergency outages!");
    showFaqChips();
  }
  else {
    addBotMessage("That's an interesting question. I'm trained as a digital guide to assist you through packages, coverage checks, and explain our 3-month launch discount. <br><br>Would you like to examine our packages or book a free consultation?");
    showChips([
      { text: "View Bundle Plans", value: "ask_faq" },
      { text: "Check Coverage Area", value: "coverage" },
      { text: "Book Concierge Setup", value: "book" }
    ]);
  }
}

function scrollToBottom() {
  const container = document.getElementById('chat-messages-container');
  if (container) {
    container.scrollTop = container.scrollHeight;
  }
}
