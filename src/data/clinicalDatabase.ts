import { MedicationMonograph } from '../types/medication';

export const CLINICAL_DATABASE: MedicationMonograph[] = [
  {
    id: 'metformin',
    genericName: 'Metformin Hydrochloride',
    brandNames: ['Glucophage', 'Fortamet', 'Glumetza', 'Riomet'],
    therapeuticClass: 'Biguanide Antidiabetic Agent',
    primaryUses: ['Type 2 Diabetes Mellitus', 'Insulin Resistance', 'PCOS (Off-label)'],
    mechanismOfAction: 'Decreases hepatic glucose production (gluconeogenesis), decreases intestinal absorption of glucose, and improves insulin sensitivity by increasing peripheral glucose uptake and utilization.',
    standardDosage: '500 mg to 1000 mg twice daily with meals (max 2550 mg/day)',
    howToTake: {
      foodRequirement: 'with_food',
      instructions: 'Take with meals to minimize stomach upset and gastrointestinal distress. Swallow extended-release tablets whole; do not crush or chew.',
      bestTimeOfDay: 'Breakfast and dinner',
      missedDoseAdvice: 'Take as soon as remembered with food. If it is almost time for your next dose, skip the missed dose. Never double up doses.',
    },
    sideEffects: {
      mild: ['Nausea or upset stomach', 'Mild diarrhea', 'Metallic taste in mouth', 'Abdominal bloating'],
      moderate: ['Persistent diarrhea lasting >1 week', 'Loss of appetite', 'Decreased vitamin B12 levels (after long-term use)'],
      urgent: [
        'Lactic Acidosis (rare but life-threatening): Extreme weakness, unexplained muscle pain, severe trouble breathing, unusual coldness, slow or irregular heartbeat',
        'Severe allergic reaction (hives, facial or throat swelling)'
      ],
    },
    warnings: {
      blackBox: 'Risk of Lactic Acidosis, especially in patients with severe renal impairment, sepsis, or acute congestive heart failure.',
      alcoholWarning: 'Avoid excessive alcohol consumption; alcohol potentiates the effect of metformin on lactate metabolism and increases lactic acidosis risk.',
      foodWarnings: ['Avoid excessive binge drinking', 'Ensure adequate hydration during hot weather or illness'],
      pregnancyCaution: 'Commonly considered safe under specialist endocrinologist supervision; monitor blood glucose closely.',
    },
    knownInteractions: [
      {
        interactingDrug: 'Iodinated Radiocontrast Agents',
        severity: 'Contraindicated',
        effect: 'Acute renal failure and severe lactic acidosis accumulation',
        recommendation: 'Withhold metformin prior to or at time of iodinated contrast procedure, and withhold for 48 hours post-procedure until renal function is confirmed normal.',
      },
      {
        interactingDrug: 'Furosemide',
        severity: 'Moderate',
        effect: 'Increases metformin blood concentrations while decreasing furosemide concentrations',
        recommendation: 'Monitor blood glucose closely; dosage adjustment may be needed.',
      },
      {
        interactingDrug: 'Cimetidine',
        severity: 'Moderate',
        effect: 'Inhibits renal tubular clearance of metformin, increasing toxicity risk',
        recommendation: 'Consider alternative H2 blockers like famotidine.',
      },
    ],
  },
  {
    id: 'lisinopril',
    genericName: 'Lisinopril',
    brandNames: ['Prinivil', 'Zestril', 'Qbrelis'],
    therapeuticClass: 'ACE (Angiotensin-Converting Enzyme) Inhibitor',
    primaryUses: ['Hypertension (High Blood Pressure)', 'Heart Failure', 'Post-Myocardial Infarction Survival'],
    mechanismOfAction: 'Inhibits the enzyme converting angiotensin I to angiotensin II, a potent vasoconstrictor. Decreases systemic vascular resistance, reduces blood pressure, and lowers cardiac workload while preserving renal blood flow in diabetic nephropathy.',
    standardDosage: '10 mg to 40 mg once daily',
    howToTake: {
      foodRequirement: 'either',
      instructions: 'Can be taken with or without food at the same time each day. Drink plenty of water unless on fluid restrictions.',
      bestTimeOfDay: 'Morning or bedtime (consistent daily time)',
      missedDoseAdvice: 'Take as soon as remembered. If close to next dose, skip and resume regular schedule. Do not take two doses at once.',
    },
    sideEffects: {
      mild: ['Dry, persistent hacking cough (ACE cough)', 'Mild dizziness when standing up', 'Headache'],
      moderate: ['Hyperkalemia (high blood potassium)', 'Moderate hypotension', 'Elevated serum creatinine'],
      urgent: [
        'Angioedema (life-threatening swelling of lips, tongue, throat, or airway)',
        'Severe dizziness, fainting, or loss of consciousness',
        'Sudden decrease in urination or signs of acute kidney failure'
      ],
    },
    warnings: {
      blackBox: 'Fetal Toxicity: When pregnancy is detected, discontinue Lisinopril immediately. Can cause fetal harm and death during 2nd and 3rd trimesters.',
      alcoholWarning: 'Alcohol can increase blood-pressure lowering effects, leading to pronounced dizziness or fainting.',
      foodWarnings: ['Avoid potassium-based salt substitutes without consulting your physician', 'Do not take high-dose potassium supplements'],
      pregnancyCaution: 'Contraindicated in pregnancy due to severe risk of fetal oligohydramnios and skull hypoplasia.',
    },
    knownInteractions: [
      {
        interactingDrug: 'Potassium Chloride / Supplements',
        severity: 'Severe',
        effect: 'Dangerous hyperkalemia leading to cardiac arrhythmias and arrest',
        recommendation: 'Avoid concomitant use unless serum potassium is monitored frequently.',
      },
      {
        interactingDrug: 'Spironolactone',
        severity: 'Severe',
        effect: 'Additive hyperkalemic risk due to aldosterone antagonism plus ACE inhibition',
        recommendation: 'Close biochemical monitoring of potassium and renal function required.',
      },
      {
        interactingDrug: 'Ibuprofen / NSAIDs',
        severity: 'Moderate',
        effect: 'NSAIDs blunt antihypertensive efficacy of Lisinopril and increase acute renal impairment risk',
        recommendation: 'Limit NSAID duration or use acetaminophen for pain relief when possible.',
      },
    ],
  },
  {
    id: 'atorvastatin',
    genericName: 'Atorvastatin Calcium',
    brandNames: ['Lipitor'],
    therapeuticClass: 'HMG-CoA Reductase Inhibitor (Statin)',
    primaryUses: ['Hypercholesterolemia', 'Atherosclerotic Cardiovascular Disease Prevention', 'Stroke & Heart Attack Risk Reduction'],
    mechanismOfAction: 'Competitively inhibits HMG-CoA reductase, the rate-limiting enzyme in cholesterol biosynthesis in the liver. Upregulates hepatic LDL receptors, clearing LDL-C from circulation.',
    standardDosage: '10 mg to 80 mg once daily',
    howToTake: {
      foodRequirement: 'either',
      instructions: 'May be taken with or without food. Can be taken at any time of day, but maintain the same time consistently.',
      bestTimeOfDay: 'Evening or bedtime',
      missedDoseAdvice: 'Take the missed dose if remembered within 12 hours. If more than 12 hours have passed, skip the missed dose.',
    },
    sideEffects: {
      mild: ['Mild muscle soreness or stiffness', 'Diarrhea or mild constipation', 'Joint achiness'],
      moderate: ['Elevated liver enzymes (transaminases)', 'Persistent muscle spasms or cramps'],
      urgent: [
        'Rhabdomyolysis: Severe unexplained muscle breakdown, dark tea-colored urine, and extreme muscle weakness',
        'Liver injury signs: Jaundice (yellowing of skin/eyes), dark urine, upper abdominal pain'
      ],
    },
    warnings: {
      alcoholWarning: 'Excessive daily alcohol consumption increases potential for hepatic transaminase elevation and liver toxicity.',
      foodWarnings: ['Avoid large amounts of grapefruit or grapefruit juice (>1.2 L/day); inhibits CYP3A4 metabolism and elevates statin blood levels.'],
      pregnancyCaution: 'Contraindicated during pregnancy and breastfeeding.',
    },
    knownInteractions: [
      {
        interactingDrug: 'Clarithromycin / Erythromycin',
        severity: 'Severe',
        effect: 'Potent CYP3A4 inhibition increases atorvastatin exposure up to 4-fold, dramatically increasing rhabdomyolysis risk',
        recommendation: 'Temporarily withhold atorvastatin during clarithromycin antibiotic course.',
      },
      {
        interactingDrug: 'Gemfibrozil',
        severity: 'Severe',
        effect: 'Marked increase in systemic statin concentration and severe myopathy risk',
        recommendation: 'Avoid combination. Fenofibrate is preferred if fibrate is necessary.',
      },
      {
        interactingDrug: 'Diltiazem',
        severity: 'Moderate',
        effect: 'Moderate CYP3A4 inhibition increases atorvastatin levels',
        recommendation: 'Limit atorvastatin dose or monitor for muscle symptoms.',
      },
    ],
  },
  {
    id: 'amoxicillin',
    genericName: 'Amoxicillin',
    brandNames: ['Amoxil', 'Trimox', 'Moxatag'],
    therapeuticClass: 'Aminopenicillin Antibiotic (Beta-lactam)',
    primaryUses: ['Bacterial Respiratory Infections', 'Otitis Media (Ear Infections)', 'Streptococcal Pharyngitis', 'Urinary Tract Infections'],
    mechanismOfAction: 'Inhibits bacterial cell wall synthesis by binding to penicillin-binding proteins (PBPs), leading to bacterial lysis and death (bactericidal).',
    standardDosage: '250 mg to 500 mg every 8 hours, or 500 mg to 875 mg every 12 hours',
    howToTake: {
      foodRequirement: 'either',
      instructions: 'May be taken with or without food. Taking with food or milk helps prevent upset stomach. Complete the full prescribed course even if symptoms resolve early.',
      bestTimeOfDay: 'Evenly spaced throughout waking hours',
      missedDoseAdvice: 'Take as soon as remembered. Never take two doses together to make up for a missed dose.',
    },
    sideEffects: {
      mild: ['Mild diarrhea', 'Nausea or upset stomach', 'Mild headache'],
      moderate: ['Vaginal yeast infection (candidiasis)', 'Oral thrush', 'Mild skin rash (non-urticarial)'],
      urgent: [
        'Anaphylaxis: Hives, acute wheezing, facial or throat swelling, difficulty swallowing',
        'Clostridioides difficile colitis: Severe watery diarrhea (>5-10 times daily), severe cramping, fever'
      ],
    },
    warnings: {
      alcoholWarning: 'While moderate alcohol does not directly inactivate amoxicillin, alcohol impairs immune response and exacerbates stomach upset.',
      foodWarnings: ['Probiotics may be taken 2 hours apart from antibiotics to support gut flora balance'],
      pregnancyCaution: 'Category B: Broadly considered safe during pregnancy when clinically indicated.',
    },
    knownInteractions: [
      {
        interactingDrug: 'Methotrexate',
        severity: 'Severe',
        effect: 'Penicillins compete for renal tubular clearance, raising methotrexate serum levels to toxic ranges',
        recommendation: 'Monitor methotrexate levels closely and adjust doses as needed.',
      },
      {
        interactingDrug: 'Warfarin',
        severity: 'Moderate',
        effect: 'Alteration of intestinal vitamin K-producing microflora can increase INR and bleeding risk',
        recommendation: 'Check INR within 3-5 days of starting antibiotic therapy.',
      },
      {
        interactingDrug: 'Allopurinol',
        severity: 'Moderate',
        effect: 'Significantly higher incidence of skin rashes reported when co-administered',
        recommendation: 'Warn patient to monitor for cutaneous eruptions.',
      },
    ],
  },
  {
    id: 'ibuprofen',
    genericName: 'Ibuprofen',
    brandNames: ['Advil', 'Motrin', 'Nurofen'],
    therapeuticClass: 'Nonsteroidal Anti-inflammatory Drug (NSAID)',
    primaryUses: ['Pain Relief (Analgesia)', 'Inflammation (Arthritis, Sprains)', 'Fever Reduction (Antipyretic)'],
    mechanismOfAction: 'Reversibly inhibits cyclooxygenase enzymes (COX-1 and COX-2), decreasing prostaglandin synthesis responsible for pain, fever, and inflammation.',
    standardDosage: '200 mg to 400 mg every 4 to 6 hours as needed (OTC max 1200 mg/day; Rx max 3200 mg/day)',
    howToTake: {
      foodRequirement: 'with_food',
      instructions: 'Always take with a full glass of water and food or milk to protect stomach lining.',
      bestTimeOfDay: 'As needed with meals',
      missedDoseAdvice: 'Since often taken as needed, skip if not in pain. If scheduled, take when remembered unless close to next dose.',
    },
    sideEffects: {
      mild: ['Stomach discomfort', 'Mild heartburn', 'Gas or bloating'],
      moderate: ['Fluid retention (mild swelling in ankles)', 'Elevated blood pressure', 'Mild dizziness or tinnitus'],
      urgent: [
        'Gastrointestinal Bleeding: Black tarry stools, vomiting coffee-ground material, severe sharp abdominal pain',
        'Acute kidney injury or sudden decrease in urine output',
        'Signs of stroke or myocardial infarction (chest tightness, sudden numbness)'
      ],
    },
    warnings: {
      blackBox: 'Cardiovascular thrombotic events (MI, stroke) and Gastrointestinal risk (bleeding, ulceration, perforation).',
      alcoholWarning: 'Concomitant alcohol use substantially increases the risk of acute stomach ulceration and GI bleeding.',
      foodWarnings: ['Always take with food, milk, or an antacid'],
      pregnancyCaution: 'Avoid starting at 20 weeks gestation due to risk of oligohydramnios and premature closure of ductus arteriosus.',
    },
    knownInteractions: [
      {
        interactingDrug: 'Aspirin (Cardioprotective low-dose)',
        severity: 'Severe',
        effect: 'Ibuprofen competitively blocks aspirin binding to platelet COX-1, attenuating aspirin antiplatelet cardioprotection',
        recommendation: 'Take low-dose aspirin at least 30 minutes before or 8 hours after ibuprofen.',
      },
      {
        interactingDrug: 'Warfarin / Apixaban',
        severity: 'Severe',
        effect: 'Compounded gastrointestinal mucosal injury plus antiplatelet effect dramatically raises hemorrhage risk',
        recommendation: 'Avoid NSAIDs in anticoagulated patients; recommend acetaminophen instead.',
      },
      {
        interactingDrug: 'Lisinopril / Enalapril',
        severity: 'Moderate',
        effect: 'NSAIDs blunt ACE inhibitor blood pressure reduction and increase acute renal failure risk',
        recommendation: 'Monitor blood pressure and renal function; use minimal effective NSAID duration.',
      },
    ],
  },
  {
    id: 'sertraline',
    genericName: 'Sertraline Hydrochloride',
    brandNames: ['Zoloft', 'Lustral'],
    therapeuticClass: 'Selective Serotonin Reuptake Inhibitor (SSRI)',
    primaryUses: ['Major Depressive Disorder', 'Panic Disorder', 'Generalized Anxiety Disorder', 'Obsessive-Compulsive Disorder (OCD)', 'PTSD'],
    mechanismOfAction: 'Selectively inhibits the presynaptic reuptake of serotonin (5-HT) in the central nervous system, enhancing serotonergic neurotransmission and mood regulation.',
    standardDosage: '25 mg to 50 mg initial dose, titrated up to 200 mg once daily',
    howToTake: {
      foodRequirement: 'either',
      instructions: 'Can be taken with or without food. Taking with food helps reduce initial gastrointestinal nausea. Take consistently either in morning or evening.',
      bestTimeOfDay: 'Morning (if stimulating) or Evening (if causing sedation)',
      missedDoseAdvice: 'Take when remembered unless close to the next scheduled dose. Never take extra medicine to make up for a missed dose.',
    },
    sideEffects: {
      mild: ['Mild nausea (usually improves in 1-2 weeks)', 'Dry mouth', 'Diarrhea', 'Mild insomnia or drowsiness'],
      moderate: ['Sexual dysfunction (decreased libido, delayed orgasm)', 'Tremor or restlessness', 'Vivid dreams'],
      urgent: [
        'Serotonin Syndrome: Agitation, hallucinations, rapid heartbeat, hyperreflexia, muscle rigidity, high fever',
        'Suicidal thoughts or behaviors in young adults (<25)',
        'Abnormal bleeding or easy bruising'
      ],
    },
    warnings: {
      blackBox: 'Increased risk of suicidal thoughts and behaviors in pediatric and young adult patients during initial titration.',
      alcoholWarning: 'Avoid alcohol as it enhances CNS depressive effects and impairs cognitive function.',
      foodWarnings: ['Avoid St. John’s Wort herbal supplements (causes dangerous serotonin excess)'],
      pregnancyCaution: 'Discuss with obstetrician; neonatal adaptation syndrome possible with late third trimester exposure.',
    },
    knownInteractions: [
      {
        interactingDrug: 'Linezolid / MAO Inhibitors',
        severity: 'Contraindicated',
        effect: 'Severe, potentially fatal Serotonin Syndrome and hypertensive crisis',
        recommendation: 'Do not use within 14 days of discontinuing an MAOI or starting linezolid.',
      },
      {
        interactingDrug: 'Tramadol',
        severity: 'Severe',
        effect: 'Additive serotonergic toxicity, severe serotonin syndrome, and lowered seizure threshold',
        recommendation: 'Avoid combination or use extreme caution with close clinical observation.',
      },
      {
        interactingDrug: 'Ibuprofen / Naproxen',
        severity: 'Moderate',
        effect: 'SSRIs deplete platelet serotonin stores, increasing upper GI bleeding risk when combined with NSAIDs',
        recommendation: 'Consider gastroprotective agents (e.g. PPI) if long-term co-administration is necessary.',
      },
    ],
  },
  {
    id: 'omeprazole',
    genericName: 'Omeprazole',
    brandNames: ['Prilosec', 'Losec', 'Zegerid'],
    therapeuticClass: 'Proton Pump Inhibitor (PPI)',
    primaryUses: ['GERD (Acid Reflux)', 'Peptic Ulcer Disease', 'Erosive Esophagitis', 'Zollinger-Ellison Syndrome'],
    mechanismOfAction: 'Irreversibly inhibits the H+/K+ ATPase enzyme system (proton pump) in gastric parietal cells, blocking the final step of hydrochloric acid production.',
    standardDosage: '20 mg to 40 mg once daily',
    howToTake: {
      foodRequirement: 'empty_stomach',
      instructions: 'Take 30 to 60 minutes before the first meal of the day (usually breakfast). Swallow capsules whole; do not chew or crush delayed-release pellets.',
      bestTimeOfDay: '30-60 minutes before breakfast',
      missedDoseAdvice: 'Take before the next meal if remembered. If remembered late in the day, wait until the next morning.',
    },
    sideEffects: {
      mild: ['Headache', 'Mild abdominal pain', 'Nausea or flatulence', 'Constipation'],
      moderate: ['Vitamin B12 deficiency (with years of continuous use)', 'Hypomagnesemia (low blood magnesium)'],
      urgent: [
        'Clostridioides difficile-associated diarrhea (severe persistent watery stool, fever)',
        'Acute interstitial nephritis (flank pain, fever, sudden decreased urine output)',
        'Bone fracture risk (hip, wrist, spine) with prolonged high-dose therapy'
      ],
    },
    warnings: {
      alcoholWarning: 'Alcohol does not directly interact with omeprazole, but alcohol irritates the esophageal and gastric lining, worsening reflux symptoms.',
      foodWarnings: ['Must be taken before food so the drug is absorbed as parietal cells activate'],
      pregnancyCaution: 'Category C: Omeprazole has substantial observational safety data in pregnancy, but consult physician.',
    },
    knownInteractions: [
      {
        interactingDrug: 'Clopidogrel (Plavix)',
        severity: 'Severe',
        effect: 'Omeprazole inhibits CYP2C19, blocking activation of clopidogrel into its active antiplatelet form and increasing cardiovascular risk',
        recommendation: 'Use pantoprazole instead, which exhibits minimal CYP2C19 inhibition.',
      },
      {
        interactingDrug: 'Ketoconazole / Itraconazole',
        severity: 'Moderate',
        effect: 'PPI-induced hypochlorhydria significantly impairs absorption of acid-dependent antifungal agents',
        recommendation: 'Separate administration or use alternative antifungal therapies.',
      },
    ],
  },
  {
    id: 'albuterol',
    genericName: 'Albuterol Sulfate (Salbutamol)',
    brandNames: ['ProAir HFA', 'Ventolin HFA', 'Proventil'],
    therapeuticClass: 'Short-Acting Beta-2 Adrenergic Agonist (SABA)',
    primaryUses: ['Acute Bronchospasm', 'Asthma Attack Relief', 'Exercise-Induced Bronchoconstriction Prevention', 'COPD Flare-ups'],
    mechanismOfAction: 'Selectively stimulates beta-2 adrenergic receptors in bronchial smooth muscle, activating adenylate cyclase and causing rapid bronchodilation within 5 minutes.',
    standardDosage: '1 to 2 inhalations (90 mcg/puff) every 4 to 6 hours as needed for bronchospasm; 2 puffs 15-30 minutes prior to exercise',
    howToTake: {
      foodRequirement: 'either',
      instructions: 'Shake well before each spray. Prime if not used recently. Exhale fully, place mouthpiece in mouth, press canister while inhaling deeply over 3-5 seconds, hold breath for 10 seconds.',
      bestTimeOfDay: 'As needed for sudden shortness of breath',
      missedDoseAdvice: 'Used primarily as a rescue inhaler when symptoms occur. If scheduled, take when remembered.',
    },
    sideEffects: {
      mild: ['Mild tremor in fingers or hands', 'Temporary nervousness or jitteriness', 'Throat irritation or cough'],
      moderate: ['Palpitations or rapid heart rate (tachycardia)', 'Mild hypokalemia (with frequent use)'],
      urgent: [
        'Paradoxical Bronchospasm: Sudden severe worsening of wheezing and breathing difficulty immediately after inhalation',
        'Severe chest pain, arrhythmias, or severe hypertension'
      ],
    },
    warnings: {
      alcoholWarning: 'No direct drug interaction, but alcohol can trigger histamine-related asthma symptoms.',
      foodWarnings: ['Excessive caffeine may compound tremor and tachycardia'],
      pregnancyCaution: 'Preferred SABA rescue medication during pregnancy for uncontrolled asthma.',
    },
    knownInteractions: [
      {
        interactingDrug: 'Propranolol / Non-selective Beta Blockers',
        severity: 'Contraindicated',
        effect: 'Antagonizes bronchodilatory effects and may precipitate severe, refractory bronchospasm in asthmatics',
        recommendation: 'Avoid non-selective beta-blockers in patients with reactive airway disease.',
      },
      {
        interactingDrug: 'Furosemide / Hydrochlorothiazide',
        severity: 'Moderate',
        effect: 'Additive risk of potassium depletion (hypokalemia) and ECG changes',
        recommendation: 'Monitor serum potassium in patients receiving frequent high-dose nebulizations.',
      },
    ],
  },
  {
    id: 'warfarin',
    genericName: 'Warfarin Sodium',
    brandNames: ['Coumadin', 'Jantoven'],
    therapeuticClass: 'Vitamin K Antagonist Anticoagulant',
    primaryUses: ['Venous Thromboembolism (DVT & PE)', 'Atrial Fibrillation Stroke Prevention', 'Mechanical Heart Valve Thrombosis Prophylaxis'],
    mechanismOfAction: 'Inhibits vitamin K epoxide reductase complex subunit 1 (VKORC1), depleting functional active vitamin K and blocking synthesis of clotting factors II, VII, IX, and X, as well as proteins C and S.',
    standardDosage: 'Individualized based on target INR (typically INR 2.0 - 3.0), daily 2 mg to 10 mg',
    howToTake: {
      foodRequirement: 'either',
      instructions: 'Take once daily at the same time every evening. Maintain consistent dietary intake of vitamin K (dark leafy greens). Do not make abrupt dietary changes.',
      bestTimeOfDay: 'Evening (6 PM - 8 PM consistently)',
      missedDoseAdvice: 'Take as soon as remembered on the same day. Do not take a double dose the next day to make up for missed dose. Log all missed doses for INR clinic.',
    },
    sideEffects: {
      mild: ['Slightly prolonged bleeding from minor shaving cuts', 'Occasional nosebleed that stops quickly', 'Easy bruising'],
      moderate: ['Bleeding gums when brushing', 'Unusually heavy menstrual periods'],
      urgent: [
        'Major Internal Hemorrhage: Red or dark brown urine, black tarry stools, coughing up blood, sudden severe headache or weakness',
        'Warfarin-induced skin necrosis (painful purple skin lesions), purple toe syndrome'
      ],
    },
    warnings: {
      blackBox: 'Major or fatal bleeding risk. Requires regular International Normalized Ratio (INR) monitoring.',
      alcoholWarning: 'Acute alcohol binge increases warfarin effect (dangerously high INR); chronic heavy alcohol consumption can decrease warfarin effect.',
      foodWarnings: [
        'Keep dietary vitamin K intake consistent (spinach, kale, broccoli, brussels sprouts)',
        'Avoid cranberry juice in large quantities (increases INR)',
        'Avoid garlic, ginkgo biloba, and high-dose vitamin E supplements'
      ],
      pregnancyCaution: 'Contraindicated in pregnancy (Warfarin embryopathy, nasal hypoplasia, stippled epiphyses).',
    },
    knownInteractions: [
      {
        interactingDrug: 'Ciprofloxacin / Fluconazole',
        severity: 'Severe',
        effect: 'Potent CYP2C9 inhibition suppresses warfarin metabolism, causing dramatic INR spikes and life-threatening bleeding',
        recommendation: 'Empirically reduce warfarin dose by 30-50% and monitor INR within 48-72 hours.',
      },
      {
        interactingDrug: 'Ibuprofen / Naproxen / Aspirin',
        severity: 'Severe',
        effect: 'Antiplatelet actions combined with gastric mucosal ulceration dramatically increase gastrointestinal hemorrhage risk',
        recommendation: 'Avoid NSAIDs in warfarin patients; use acetaminophen with moderate dosing.',
      },
      {
        interactingDrug: 'Rifampin / Carbamazepine',
        severity: 'Severe',
        effect: 'Potent CYP induction rapidly clears warfarin, causing therapeutic failure and clotting risk',
        recommendation: 'Requires frequent INR testing and major dose titration.',
      },
    ],
  },
  {
    id: 'levothyroxine',
    genericName: 'Levothyroxine Sodium',
    brandNames: ['Synthroid', 'Levoxyl', 'Tirosint', 'Euthyrox'],
    therapeuticClass: 'Thyroid Hormone Replacement (Synthetic T4)',
    primaryUses: ['Hypothyroidism', 'Pituitary TSH Suppression for Thyroid Cancer'],
    mechanismOfAction: 'Synthetic crystalline L-tetraiodothyronine (T4) converted in peripheral tissues to active triiodothyronine (T3), binding to thyroid nuclear receptors to regulate basal metabolic rate and cellular protein synthesis.',
    standardDosage: '25 mcg to 175 mcg once daily, titrated to target serum TSH',
    howToTake: {
      foodRequirement: 'empty_stomach',
      instructions: 'Must be taken on an empty stomach with a full glass of water, at least 30 to 60 minutes before breakfast, or at bedtime at least 3-4 hours after the last meal.',
      bestTimeOfDay: 'First thing in morning (30-60 min before breakfast)',
      missedDoseAdvice: 'Take as soon as remembered. Levothyroxine has a long half-life (7 days), but take doses regularly.',
    },
    sideEffects: {
      mild: ['Mild hair shedding initially (resolves in weeks)', 'Mild headache'],
      moderate: ['Mild weight loss or changes in appetite', 'Mild heat intolerance'],
      urgent: [
        'Thyrotoxicosis / Overdose signs: Rapid or irregular heartbeat (atrial fibrillation), chest pain, severe tremors, insomnia, extreme sweating',
        'Severe allergic reaction'
      ],
    },
    warnings: {
      blackBox: 'Do not use thyroid hormones alone or in combination with other agents for the treatment of obesity or weight loss.',
      alcoholWarning: 'No direct interaction, but alcohol can disrupt regular morning dosing habits.',
      foodWarnings: [
        'Separate calcium carbonate and iron supplements by at least 4 hours',
        'Separate coffee or espresso by at least 30-60 minutes (coffee impairs oral absorption)',
        'Avoid soy-rich meals within 2 hours of dose'
      ],
      pregnancyCaution: 'Essential in pregnancy; maternal T4 needs increase by 25-50% in the first trimester. Increase dose under physician guidance.',
    },
    knownInteractions: [
      {
        interactingDrug: 'Calcium Carbonate / Ferrous Sulfate (Iron)',
        severity: 'Severe',
        effect: 'Chelation in gut lumen dramatically prevents levothyroxine absorption, causing clinical hypothyroidism',
        recommendation: 'Separate ingestion by at least 4 hours.',
      },
      {
        interactingDrug: 'Omeprazole / PPIs',
        severity: 'Moderate',
        effect: 'Gastric acid suppression reduces dissolution and bioavailability of conventional thyroid tablets',
        recommendation: 'Monitor TSH; dosage increase or liquid/gel capsule formulation (Tirosint) may be required.',
      },
    ],
  },
  {
    id: 'apixaban',
    genericName: 'Apixaban',
    brandNames: ['Eliquis'],
    therapeuticClass: 'Direct Oral Anticoagulant (DOAC) / Direct Factor Xa Inhibitor',
    primaryUses: ['Nonvalvular Atrial Fibrillation Stroke Prevention', 'DVT & PE Treatment and Prevention', 'Post-Surgical Thromboprophylaxis'],
    mechanismOfAction: 'Direct, selective, and reversible inhibitor of free and clot-bound factor Xa, preventing thrombin generation and development of fibrin thrombi.',
    standardDosage: '5 mg twice daily (reduced to 2.5 mg twice daily for patients with 2 of: age ≥80, weight ≤60 kg, serum creatinine ≥1.5 mg/dL)',
    howToTake: {
      foodRequirement: 'either',
      instructions: 'Take one tablet twice daily with or without food, approximately 12 hours apart.',
      bestTimeOfDay: 'Morning and evening (12 hours apart)',
      missedDoseAdvice: 'Take the missed dose immediately on the same day. Do not double up doses.',
    },
    sideEffects: {
      mild: ['Mild bruising', 'Nosebleed that resolves quickly'],
      moderate: ['Bleeding gums', 'Prolonged bleeding from small cuts'],
      urgent: [
        'Major Bleeding: Coughing up blood, red/black stools, sudden vision loss or severe unusual headache',
        'Spinal / epidural hematoma if undergoing neuraxial anesthesia'
      ],
    },
    warnings: {
      blackBox: 'Premature discontinuation increases risk of thrombotic events. Epidural or spinal hematomas can occur in patients receiving neuraxial procedures.',
      alcoholWarning: 'Avoid excessive alcohol to minimize fall risk and bleeding susceptibility.',
      foodWarnings: ['Does not require vitamin K diet restrictions unlike warfarin'],
      pregnancyCaution: 'Not recommended during pregnancy due to maternal and fetal bleeding risk.',
    },
    knownInteractions: [
      {
        interactingDrug: 'Ketoconazole / Itraconazole',
        severity: 'Severe',
        effect: 'Dual strong inhibitors of CYP3A4 and P-gp elevate apixaban exposure, markedly increasing bleeding risk',
        recommendation: 'Reduce apixaban dose by 50% or avoid combination.',
      },
      {
        interactingDrug: 'Ibuprofen / Naproxen',
        severity: 'Severe',
        effect: 'Elevated gastrointestinal bleeding risk due to antiplatelet NSAID effects combined with factor Xa inhibition',
        recommendation: 'Avoid NSAIDs unless specifically instructed; prefer acetaminophen.',
      },
    ],
  },
  {
    id: 'gabapentin',
    genericName: 'Gabapentin',
    brandNames: ['Neurontin', 'Gralise', 'Horizant'],
    therapeuticClass: 'Anticonvulsant / GABA Analog / Neuropathic Pain Agent',
    primaryUses: ['Neuropathic Pain (Diabetic Neuropathy, Postherpetic Neuralgia)', 'Focal Seizures Adjunct', 'Restless Legs Syndrome'],
    mechanismOfAction: 'Binds with high affinity to alpha-2-delta auxiliary subunits of voltage-gated calcium channels in presynaptic neurons, reducing excitatory neurotransmitter release.',
    standardDosage: '300 mg to 900 mg three times daily (max 3600 mg/day)',
    howToTake: {
      foodRequirement: 'either',
      instructions: 'May be taken with or without food. Titrate doses gradually as advised to avoid daytime somnolence.',
      bestTimeOfDay: 'Evenly spaced throughout the day; highest dose at bedtime if causing drowsiness',
      missedDoseAdvice: 'Take as soon as remembered. If within 2 hours of next dose, skip and resume regular schedule.',
    },
    sideEffects: {
      mild: ['Drowsiness / somnolence', 'Mild dizziness', 'Fatigue', 'Peripheral edema (mild ankle swelling)'],
      moderate: ['Unsteady gait (ataxia)', 'Tremor', 'Nystagmus (involuntary eye movement)'],
      urgent: [
        'Respiratory Depression: Especially when taken alongside opioids or in patients with COPD',
        'Severe allergic reaction or DRESS syndrome (widespread rash, fever, swollen lymph glands)',
        'Sudden changes in mood or suicidal ideation'
      ],
    },
    warnings: {
      alcoholWarning: 'Alcohol dramatically potentiates central nervous system sedation, respiratory depression, and dizziness.',
      foodWarnings: ['Antacids containing aluminum and magnesium should be taken at least 2 hours before gabapentin'],
      pregnancyCaution: 'Use only if potential benefit justifies potential fetal risk.',
    },
    knownInteractions: [
      {
        interactingDrug: 'Oxycodone / Morphine / Opioids',
        severity: 'Severe',
        effect: 'Dangerous synergistic central nervous system and respiratory depression, risk of fatal overdose',
        recommendation: 'Co-prescribe with extreme caution at reduced doses; provide naloxone rescue kit.',
      },
      {
        interactingDrug: 'Mylanta / Maalox (Magnesium/Aluminum antacids)',
        severity: 'Moderate',
        effect: 'Antacids decrease gabapentin bioavailability by approximately 20%',
        recommendation: 'Administer gabapentin at least 2 hours after antacid ingestion.',
      },
    ],
  },
  {
    id: 'cetirizine',
    genericName: 'Cetirizine Hydrochloride',
    brandNames: ['Zyrtec', 'Reactine'],
    therapeuticClass: 'Second-Generation Antihistamine',
    primaryUses: ['Allergic Rhinitis (Hay Fever)', 'Chronic Urticaria (Hives)', 'Allergic Conjunctivitis'],
    mechanismOfAction: 'Selective antagonist of peripheral H1 receptors, preventing histamine-mediated inflammatory responses without significant anticholinergic activity.',
    standardDosage: '5 mg to 10 mg once daily',
    howToTake: {
      foodRequirement: 'either',
      instructions: 'Take once daily with water. Can be taken with or without food.',
      bestTimeOfDay: 'Evening (if causing mild sedation)',
      missedDoseAdvice: 'Take as soon as remembered. Do not take more than one dose in 24 hours.',
    },
    sideEffects: {
      mild: ['Mild drowsiness', 'Dry mouth', 'Mild fatigue', 'Headache'],
      moderate: ['Dizziness', 'Sore throat or pharyngitis'],
      urgent: ['Severe allergic reaction (anaphylaxis)', 'Difficulty urinating in patients with prostatic hypertrophy'],
    },
    warnings: {
      alcoholWarning: 'Alcohol can augment sedation and psychomotor impairment.',
      foodWarnings: ['None required'],
      pregnancyCaution: 'Category B: Widely used and considered safe in pregnancy under clinician advice.',
    },
    knownInteractions: [
      {
        interactingDrug: 'Diphenhydramine / Sedative Hypnotics',
        severity: 'Moderate',
        effect: 'Additive sedation and psychomotor slowing',
        recommendation: 'Avoid combining multiple antihistamines or sedatives.',
      },
    ],
  },
  {
    id: 'acetaminophen',
    genericName: 'Acetaminophen (Paracetamol)',
    brandNames: ['Tylenol', 'Panadol', 'Calpol'],
    therapeuticClass: 'Analgesic and Antipyretic',
    primaryUses: ['Mild to Moderate Pain Relief', 'Headache', 'Fever Reduction', 'Osteoarthritis Pain'],
    mechanismOfAction: 'Acts primarily in the central nervous system to inhibit prostaglandin synthesis and modulate descending serotonergic pain pathways; lacks significant peripheral anti-inflammatory activity.',
    standardDosage: '325 mg to 650 mg every 4-6 hours or 1000 mg every 6 hours (Max 3000-4000 mg/day)',
    howToTake: {
      foodRequirement: 'either',
      instructions: 'May be taken with or without food. Do not exceed the maximum daily limit of 4000 mg (3000 mg for chronic use or elderly). Check all OTC cough/cold medicines to avoid double-dosing.',
      bestTimeOfDay: 'As needed for fever or pain',
      missedDoseAdvice: 'Take when remembered if pain persists; ensure at least 4 hours between doses.',
    },
    sideEffects: {
      mild: ['Generally well-tolerated at therapeutic doses', 'Mild nausea'],
      moderate: ['Mild rash or itching'],
      urgent: [
        'Acute Hepatotoxicity / Liver Failure: Jaundice, extreme right upper quadrant abdominal pain, nausea, vomiting, confusion',
        'Stevens-Johnson Syndrome (rare severe blistering skin reaction)'
      ],
    },
    warnings: {
      blackBox: 'Severe liver injury risk associated with doses exceeding 4000 mg/day or combining multiple acetaminophen-containing products.',
      alcoholWarning: 'Chronic ingestion of 3 or more alcoholic drinks daily significantly increases acetaminophen-induced liver damage risk.',
      foodWarnings: ['None; can be taken on empty stomach'],
      pregnancyCaution: 'First-line analgesic and antipyretic recommended throughout pregnancy at the lowest effective dose.',
    },
    knownInteractions: [
      {
        interactingDrug: 'Warfarin',
        severity: 'Moderate',
        effect: 'Chronic regular high doses (>2000 mg/day for several days) can elevate INR and increase bleeding risk',
        recommendation: 'Occasional single doses have minimal effect; monitor INR if taking daily for >4 days.',
      },
      {
        interactingDrug: 'Isoniazid',
        severity: 'Moderate',
        effect: 'Isoniazid potentiates production of reactive hepatotoxic metabolite NAPQI',
        recommendation: 'Limit acetaminophen dosage and avoid alcohol.',
      },
    ],
  },
];
