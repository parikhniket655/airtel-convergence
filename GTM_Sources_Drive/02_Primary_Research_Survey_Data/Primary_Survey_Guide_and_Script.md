# Case Competition Survey Guide: Conjoint Choice Cards

To validate consumer preferences and price sensitivity for your case competition, we have designed a **Discrete Choice Conjoint Experiment** with 4 separate choice questions, each comparing a consolidated bundle against its standalone service equivalent.

---

## 1. Conjoint Choice Cards (Graphics in Workspace)

We have copied and renamed these graphics directly into your main **`Airtel` workspace folder** so they are easy to locate and upload:

### Question 1: Airtel Starter (Entry-level Tier)
*Comparison: Airtel Starter Bundle (₹499/mo) vs. Standalone Individual Services (₹758/mo)*
*   File: **`choice_card_starter.jpg`**
*   Workspace Link: [choice_card_starter.jpg](file:///Users/ketanparikh/Desktop/Airtel/choice_card_starter.jpg)

### Question 2: Airtel Connect (Basic Bundle Tier)
*Comparison: Airtel Connect Bundle (₹999/mo) vs. Standalone Individual Services (₹1,298/mo)*
*   File: **`choice_card_connect.jpg`**
*   Workspace Link: [choice_card_connect.jpg](file:///Users/ketanparikh/Desktop/Airtel/choice_card_connect.jpg)

### Question 3: Family Secure (Value Promo Tier)
*Comparison: Family Secure Bundle (₹999/mo Promo) vs. Standalone Individual Services (₹2,006/mo)*
*   File: **`choice_card_family.jpg`**
*   Workspace Link: [choice_card_family.jpg](file:///Users/ketanparikh/Desktop/Airtel/choice_card_family.jpg)

### Question 4: Airtel Infinite (Premium Gigabit Tier)
*Comparison: Airtel Infinite Bundle (₹2,999/mo) vs. Standalone Individual Services (₹3,508/mo)*
*   File: **`choice_card_infinite.jpg`**
*   Workspace Link: [choice_card_infinite.jpg](file:///Users/ketanparikh/Desktop/Airtel/choice_card_infinite.jpg)

---

## 2. Google Apps Script (Automated Form Creation)

This script configures the Google Form to generate **4 separate multiple-choice questions** representing the conjoint experiment.

Copy this code, open [Google Apps Script](https://script.google.com), paste it, and click **Run**:

```javascript
function createCaseSurveyForm() {
  // Create a new Form in your Google Drive
  var form = FormApp.create('Connected Household Ecosystem Survey (Case Study Research)');
  
  form.setDescription('Thank you for participating! This survey gathers market insights on consumer utility usage (WiFi, Mobile, DTH, Security) to analyze willingness to bundle services under a single provider. It takes under 3 minutes.');
  
  // Section 1: Current Profile
  form.addSectionHeaderItem().setTitle('Section 1: Household Profile & Current Utilities');
  
  form.addMultipleChoiceItem()
      .setTitle('How many members reside in your household?')
      .setChoiceValues(['1 (Just me)', '2', '3-4', '5+'])
      .setRequired(true);
      
  form.addCheckboxItem()
      .setTitle('Which services do you currently pay for across individual/separate providers?')
      .setChoiceValues([
        'Mobile Postpaid/Prepaid SIMs',
        'Home Broadband WiFi',
        'Television (DTH / Cable TV / Smart Box)',
        'Home Security (Smart CCTV Cameras)',
        'Cloud Storage (e.g., Google One, iCloud)'
      ])
      .setRequired(true);

  // Section 2: Conjoint Choice Experiment (4 separate bundle decisions)
  form.addPageBreakItem().setTitle('Section 2: Bundle Concept Selections (Conjoint Study)');
  
  form.addSectionHeaderItem()
      .setTitle('Instructions:')
      .setHelpText('In Google Forms, please upload the matching choice card graphic (choice_card_starter, choice_card_connect, choice_card_family, choice_card_infinite) directly above each of the questions below.');

  // Choice 1: Starter
  form.addMultipleChoiceItem()
      .setTitle('Choice Card 1: Review the comparative Starter options. Which of these would you prefer for your household?')
      .setChoiceValues([
        'Option A: Airtel Starter Bundle (₹499/mo - 1 SIM, 100GB Google One, Xstream Play)',
        'Option B: Standalone Individual Services (₹758/mo total - paid separately)'
      ])
      .setRequired(true);

  // Choice 2: Connect
  form.addMultipleChoiceItem()
      .setTitle('Choice Card 2: Review the comparative Connect options. Which of these would you prefer for your household?')
      .setChoiceValues([
        'Option A: Airtel Connect Bundle (₹999/mo - 40Mbps Fiber, 1 SIM, Xstream Box & Play TV)',
        'Option B: Standalone Individual Services (₹1,298/mo total - paid separately)'
      ])
      .setRequired(true);

  // Choice 3: Family Secure
  form.addMultipleChoiceItem()
      .setTitle('Choice Card 3: Review the comparative Family Secure options. Which of these would you prefer for your household?')
      .setChoiceValues([
        'Option A: Family Secure Bundle (₹999/mo Promo - 100Mbps Fiber, 2 SIMs, Xsafe Camera, Xstream Box & Play TV, 200GB Google One)',
        'Option B: Standalone Individual Services (₹2,006/mo total - paid separately)'
      ])
      .setRequired(true);

  // Choice 4: Infinite
  form.addMultipleChoiceItem()
      .setTitle('Choice Card 4: Review the comparative Infinite options. Which of these would you prefer for your household?')
      .setChoiceValues([
        'Option A: Airtel Infinite Bundle (₹2,999/mo - 1Gbps Fiber, 4 SIMs, 3 Xsafe Cameras, Xstream Box & Play TV, 2TB Google One, Netflix/Prime)',
        'Option B: Standalone Individual Services (₹3,508/mo total - paid separately)'
      ])
      .setRequired(true);

  // Section 3: Barriers to Service Consolidation
  form.addPageBreakItem().setTitle('Section 3: Barriers to Service Consolidation');
  
  var scaleQ = form.addGridItem();
  scaleQ.setTitle('How strongly do you agree or disagree with the following statements regarding having ONE provider for all household digital services?')
        .setRows([
          'I worry that if one service goes down (e.g., fiber cut), I will lose all connectivity (mobile, internet, TV) at once.',
          'Migrating numbers or installing multiple hardware units (routers, TV boxes, cameras) is too complicated and time-consuming.',
          'Consolidating will not save me significant money compared to choosing separate cheaper providers.',
          'I prefer separate monthly bills because it helps me manage my expenses better than one large combined invoice.',
          'I am concerned about data privacy and sharing too much household behavior data with a single telecom company.'
        ])
        .setColumns(['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'])
        .setRequired(true);

  // Section 4: Value Proposition testing
  form.addPageBreakItem().setTitle('Section 4: Value Drivers');
  
  form.addCheckboxItem()
      .setTitle('Which adjacent benefits would make you MORE likely to bundle services under one provider? (Select all that apply)')
      .setChoiceValues([
        'Google One Cloud Storage (100GB to 2TB) for device backups',
        'AI-powered Home Security Cameras with phone alerts & cloud recording',
        'Autopay Discount (e.g., direct savings of ₹50 on every monthly bill)',
        'Loyalty Reward Points (e.g., Thanks Coins redeemable for OTT/shopping)',
        'Payments Bank features offering high interest (7%) and cashback on utility bills'
      ]);

  // Open-ended Feedback
  form.addParagraphTextItem()
      .setTitle('What is the single biggest factor that would convince you to switch your entire household to a unified ecosystem (e.g., Altura Home / Airtel Black)?')
      .setHelpText('Examples: Dedicated installation manager, billing clarity, price discounts, hardware quality.');

  Logger.log('Google Form created successfully!');
  Logger.log('Published URL: ' + form.getPublishedUrl());
  Logger.log('Edit URL: ' + form.getEditUrl());
}
```

---

## 3. How to add the Choice Card Graphics to your Form:

1.  Open the generated form edit page in Google Forms (using the Edit URL returned by the script).
2.  Navigate to **Section 2: Bundle Concept Selections (Conjoint Study)**.
3.  Click the **Image icon** on the right floating toolbar above **Choice Card 1**.
4.  Upload **`choice_card_starter.jpg`** from your workspace.
5.  Repeat this process to upload:
    *   **`choice_card_connect.jpg`** above **Choice Card 2**.
    *   **`choice_card_family.jpg`** above **Choice Card 3**.
    *   **`choice_card_infinite.jpg`** above **Choice Card 4**.
