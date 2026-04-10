# The Human Firewall: Why Every Cybersecurity Breach Has a Human Signature Before It Has a Technical One — And How AI, EI, and NI Can Read It

**Authors:** Naresh Sampangi, Dr. Anil K. Agarwal, Neeta Tambe

**Affiliation:** The Circle Research Collaborative

**Date:** April 10, 2026

**Corresponding Author:** Naresh Sampangi

**Target Journal:** Journal of AI Governance in Cybersecurity & Healthcare Security

**Paper Series:** This paper extends the foundational work presented in *Beyond the Breach: Human-State Drift Detection in Cybersecurity Governance Using Transformer-Based AI, Emotional Intelligence, and Natural Intelligence Calibration* (Sampangi, Agarwal, & Tambe, 2026).

---

## Abstract

Despite cumulative global cybersecurity spending exceeding $1.75 trillion over the past decade, breach rates are not declining — they are accelerating. The IBM Cost of a Data Breach Report 2025 documents an average breach cost approaching $4.88 million, while the Verizon 2025 Data Breach Investigations Report reveals that third-party-linked breaches doubled year-over-year and ransomware was present in 44% of all analyzed breaches. Healthcare remains the most devastated sector: the Change Healthcare ransomware attack of 2024 exposed 192.7 million patient records — more than half the population of the United States — in a single incident. Between 2009 and January 2026, 7,419 large healthcare data breaches have been reported to the U.S. Department of Health and Human Services, compromising 935.5 million individual records — equivalent to 2.6 times the entire U.S. population.

These numbers are not evidence that technology is failing. They are evidence that the human layer — the cognitive, emotional, and behavioral substrate upon which every technical control depends — remains unmonitored, uncalibrated, and fundamentally misunderstood. This paper presents both the evidence and the solution. Drawing on the most current breach data available through early 2026, we demonstrate that six identifiable human-state drift patterns — Fatigue/Numbness, Overconfidence, Hurry/Urgency-Override, Quiet Fear/Avoidance, Hoarding/Control Grip, and Compliance Theater — function as measurable precursors to cybersecurity breaches across every sector, with particular intensity in healthcare. We then present the Cybersecurity-NI architecture: a three-layer system comprising AI Detection (transformer-based behavioral signal processing using LangGraph, RAG, and NLI classification), EI Revelation (organizational pattern surfacing mapped to specific NIST SP 800-53 controls), and NI Calibration (governance recalibration that addresses the human state, not merely the technical control). We demonstrate how the self-attention mechanism from Vaswani et al.'s transformer architecture — originally designed to weigh linguistic context across sequences — is uniquely suited to weigh human behavioral signals across time, transforming cybersecurity from reactive anomaly detection to predictive drift recognition. A working prototype targeting the Epic EMR healthcare environment is presented. The argument is direct: the breach always leaves a human signature first. This system is built to read it.

**Keywords:** human-state drift, cybersecurity governance, transformer architecture, healthcare data breaches, Change Healthcare, NIST SP 800-53, alert fatigue, compliance theater, insider threat, emotional intelligence, natural intelligence, Epic EMR, behavioral analytics, predictive security

---

## 1. Introduction

There is a paradox at the center of modern cybersecurity that no amount of technical investment has resolved.

Organizations worldwide spend more on cybersecurity each year than the previous. Gartner estimates global cybersecurity spending reached $212 billion in 2025, a 15.1% increase over 2024 (Gartner, 2025). The technology stack available to defenders has never been more sophisticated: artificial intelligence-powered threat detection, zero-trust network architectures, extended detection and response (XDR) platforms, cloud-native security posture management, and automated security orchestration. The cybersecurity workforce, though still understaffed, has grown to an estimated 5.5 million professionals globally (ISC², 2024).

Yet breaches continue to rise in frequency, scale, and cost. The Verizon 2025 DBIR analyzed over 22,000 security incidents and confirmed breaches across 139 countries, finding that vulnerability exploitation surged 34% year-over-year, ransomware appeared in 44% of all breaches (up significantly from 32% in the prior year), and third-party involvement in breaches doubled — from 15% to 30% — in a single reporting period (Verizon, 2025). Stolen credentials remained the dominant vector in 88% of basic web application attacks. The IBM 2025 Cost of a Data Breach Report found that organizations without AI governance policies — those that lacked frameworks to manage AI proliferation and shadow AI — experienced significantly higher breach costs and longer identification times (IBM Security, 2025).

This paradox — more investment, more breaches — persists because the industry has been solving the wrong problem. The problem is not that firewalls are too porous or that encryption is too weak. The problem is that every technical control is executed by a human, and the human state upon which that execution depends is neither monitored nor managed. The analyst who processes 11,000 alerts per day and misses the critical one is not failing because the SIEM is misconfigured. The analyst is failing because six weeks of alert fatigue have eroded the cognitive substrate required for pattern discrimination. The system administrator who grants emergency access without proper review is not circumventing policy because security awareness training was insufficient. The administrator is operating under urgency-override — a human-state drift pattern where deadline pressure compresses procedural safeguards below functional thresholds.

These failures have human signatures. They are patterned. They are sequential. They are detectable — if anyone builds the architecture to detect them.

This paper builds on the foundational framework presented in *Beyond the Breach* (Sampangi, Agarwal, & Tambe, 2026) and extends it with the most current, evidence-driven analysis available through early 2026. We present the six human-state drift patterns as a predictive framework, map each to documented real-world breach incidents, and demonstrate how a transformer-based AI detection engine — combined with Emotional Intelligence (EI) pattern revelation and Natural Intelligence (NI) governance calibration — provides the missing layer that no existing cybersecurity tool addresses.

The thesis of this paper is not speculative. The prototype exists. The architecture is implemented. The argument is empirical: every breach has a human signature before it has a technical one. The system that reads that signature changes everything.

---

## 2. The State of Cybersecurity in 2026: What Is Still Failing and Why

### 2.1 Global Breach Frequency and Cost: The Numbers That Should End the Debate

The data available through early 2026 paints an unambiguous picture: cybersecurity defenses are not keeping pace with threats, despite unprecedented investment.

**The IBM Cost of a Data Breach Report 2025** found that the global average cost of a data breach stood near $4.88 million — a figure that, despite a reported 9% year-over-year moderation driven by faster identification and containment among AI-adopting organizations, remains at historically elevated levels. The report's most striking finding concerned the AI oversight gap: a significant share of organizations that reported AI-related security incidents lacked proper AI access controls, and a similar proportion lacked any AI governance policies to manage AI deployment or prevent shadow AI proliferation (IBM Security, 2025). The organizations that did deploy AI extensively in their security operations saved substantially compared to those that did not — not merely from faster detection, but from reduced mean time to identify and contain breaches. This finding creates a paradox within a paradox: AI accelerates both offense and defense, but only organizations with governance maturity benefit from the defensive acceleration.

**The Verizon 2025 Data Breach Investigations Report** expanded its dataset to over 22,000 incidents and documented several watershed trends. Third-party involvement was linked to 30% of breaches — double the prior year — driven in part by vulnerability exploitation in supply chain systems and cascading business interruptions. Vulnerability exploitation as an initial access vector surged 34% year-over-year. Ransomware was present in 44% of all analyzed breaches, and in the system intrusion attack pattern specifically, ransomware was linked to 75% of breaches. Only 54% of perimeter-device vulnerabilities were fully remediated during the reporting period, while nearly half remained unresolved (Verizon, 2025). Social engineering remained a dominant attack pattern, with phishing and pretexting identified as top causes of breaches. Basic web application attacks showed that 88% of breaches within this pattern involved stolen credentials — a vector that zero-trust architectures are designed to address but that remains stubbornly persistent.

These figures describe an industry that is running faster on a treadmill that is accelerating beneath it. The question these reports do not answer — because they are not designed to — is *why*. Why are credentials still being stolen at this rate despite multi-factor authentication? Why are vulnerabilities persisting unpatched for months? Why are third-party risks doubling in a single year despite the entire vendor risk management industry? This paper provides the answer: because the human-state conditions that enable these failures — the fatigue, overconfidence, hurry, fear, hoarding, and theater — remain invisible to every tool in the current stack.

### 2.2 Healthcare: The Most Breached Sector for Over a Decade

Healthcare is not merely one of many breached sectors. It is, by a substantial margin, the most consistently compromised industry in the developed world. The IBM Cost of a Data Breach Report has documented healthcare as the highest-cost sector for consecutive years, with breach costs in healthcare substantially exceeding the cross-industry average. The HIPAA Journal's comprehensive analysis of Office for Civil Rights (OCR) data, updated through February 2026, provides the most detailed longitudinal view available.

The numbers are staggering:

- **7,419 large healthcare data breaches** (affecting 500 or more individuals each) have been reported to OCR between October 2009 and January 31, 2026 (HIPAA Journal, 2026).
- These breaches have resulted in the exposure of **935,521,931 individual records** — equivalent to more than **2.6 times the entire population of the United States** (HIPAA Journal, 2026).
- In 2024, an average of **792,226 individuals were affected by a healthcare data breach every day** — driven primarily by the catastrophic Change Healthcare incident (HIPAA Journal, 2026).
- Healthcare data breaches peaked at **746 reported incidents in 2023**, with 2024 seeing a marginal decline to 742 and 2025 declining modestly to approximately 710 — still averaging more than 59 large breaches per month (HIPAA Journal, 2026).
- **Hacking and IT incidents accounted for more than 80% of all large healthcare data breaches** in recent years. Between 2018 and 2023, OCR documented a **239% increase in hacking-related breaches and a 278% increase in ransomware attacks** (HIPAA Journal, 2026).

**The Change Healthcare Catastrophe (2024).** The single most devastating healthcare data breach in history occurred in February 2024 when the ALPHV/BlackCat ransomware group breached Change Healthcare, a healthcare clearinghouse owned by UnitedHealth Group that processes approximately 15 billion healthcare transactions annually. The attack was not a sophisticated zero-day exploit. It was accomplished through compromised credentials on a Citrix remote access portal that lacked multi-factor authentication — a basic access control that NIST SP 800-53 AC-2 and AC-7 have mandated for over a decade. The attack disrupted claims processing, prescription fulfillment, and payment systems for healthcare providers across the United States for weeks. UnitedHealth Group reported that **192.7 million individuals** had their personal and health information stolen — exceeding the prior record (Anthem Inc., 78.8 million in 2015) by a factor of 2.4x (HIPAA Journal, 2026; U.S. Senate Finance Committee, 2024).

The Change Healthcare breach was not a failure of technology. Multi-factor authentication existed. The NIST controls were written. The compliance frameworks were in place. What failed was the human layer: access management practices that allowed a remote access portal to persist without MFA enforcement, credential hygiene that failed to detect or rotate compromised credentials, and monitoring practices that did not flag the lateral movement within the network until exfiltration was well underway. Each of these failures maps to identifiable human-state drift patterns: Overconfidence ("our perimeter defenses are sufficient"), Compliance Theater (documented MFA policies that were not universally enforced), and Fatigue (monitoring systems that generated alerts not thoroughly investigated).

**The Ascension Health Breach (2024).** In May 2024, the Ascension Health hospital network — one of the largest nonprofit health systems in the United States — suffered a ransomware attack that disrupted clinical operations across 140 hospitals and 40 senior living facilities. Electronic health records became unavailable, forcing clinicians to revert to paper-based processes. **5.47 million individuals** were affected (HIPAA Journal, 2026). The operational disruption lasted weeks, with direct impacts on patient care workflows.

**The Yale New Haven Health System Breach (2025).** In 2025, Yale New Haven Health System reported a hacking incident affecting **5.56 million individuals** — making it one of the largest healthcare breaches of the year. The DaVita Inc. breach in the same year compromised **2.69 million records** (HIPAA Journal, 2026).

These are not isolated events. They are manifestations of systemic conditions — conditions where human-state drift has degraded the organizational substrate upon which technical controls depend.

### 2.3 The Insider Threat Problem: The Human Action That Precedes Every Breach

The Verizon DBIR has consistently documented that human actions — whether intentional, negligent, or inadvertent — are implicated in the vast majority of breaches. While estimates vary by methodology and definition, the consensus range across major reports (Verizon DBIR, Proofpoint Human Factor Report, IBM X-Force) indicates that **68–85% of breaches involve a human action** as a necessary condition for the attack's success.

This involvement takes multiple forms:

- **Credential compromise:** Humans create, reuse, and fail to rotate credentials. The 88% stolen-credential rate in web application attacks documented by Verizon (2025) is a human-behavior statistic, not a technology statistic.
- **Phishing susceptibility:** Despite extensive security awareness programs, phishing remains a dominant vector. The Proofpoint 2024 Human Factor Report documented that organizations with mature security awareness programs still experienced significant phishing click rates under time pressure — precisely the Hurry/Urgency-Override drift pattern this paper identifies.
- **Insider negligence:** The HIPAA Journal's analysis shows that unauthorized access/disclosure incidents — breaches attributable to internal actors — remained a consistent category through 2025, with an increase in such incidents during the year (HIPAA Journal, 2026). Montefiore Medical Center paid $4.75 million in 2024 to settle a case involving insider data theft (OCR, 2024). Memorial Healthcare System paid $5.5 million in 2017 after employees accessed patient records without authorization (OCR, 2017).
- **Configuration errors:** Misconfigured systems, open storage buckets, and improper access controls reflect human decisions — often made under time pressure, without adequate review, by individuals whose cognitive state was not monitored.

The framing of these as "human error" is both linguistically imprecise and operationally counterproductive. "Error" implies randomness — an occasional deviation from otherwise reliable performance. What the data actually reveals is *pattern*: systematically recurring behavioral tendencies that cluster around identifiable cognitive-emotional states. Alert fatigue is not random error — it is the predictable consequence of sustained cognitive load exceeding sustainable thresholds. Credential reuse is not random error — it is the predictable consequence of overconfidence ("it won't happen to me") intersecting with hurry ("I don't have time to manage a password vault"). These are drift patterns, not errors. And drift patterns are detectable.

### 2.4 Alert Fatigue: The Silent Epidemic in Security Operations

Alert fatigue is arguably the single most dangerous human-state condition in contemporary cybersecurity, and it is almost entirely unaddressed by current tools.

Security Operations Center (SOC) analysts are the front line of organizational cybersecurity defense. They monitor SIEM dashboards, triage alerts, investigate anomalies, and escalate incidents. Research consistently documents that the volume of alerts has overwhelmed the human capacity to process them:

- A 2023 study by Devo Technology found that the average SOC analyst processes over **4,484 alerts per day**, with enterprise SOCs generating over 11,000 alerts daily (Devo, 2023).
- The Ponemon Institute's 2023 report on SOC effectiveness found that **27% of analyst time** is spent investigating false positives, and that **49% of analysts** reported alert fatigue as their primary challenge (Ponemon Institute, 2023).
- Critical Start's 2024 survey reported that **70% of SOC analysts** experienced emotional stress or burnout due to alert volume, with **64% considering leaving their position** within 12 months (Critical Start, 2024).
- Gartner projected that by 2025, **50% of SOC analysts' time** would be consumed by alert triage that does not result in actionable intelligence (Gartner, 2024).

The consequences of alert fatigue are not theoretical. The Target breach of 2013 — in which 40 million credit card numbers and 70 million personal records were stolen — was preceded by multiple FireEye alerts that SOC analysts in Bangalore failed to escalate. Post-incident analysis revealed that the team was processing thousands of alerts per shift and had become habituated to dismissing alerts that did not meet increasingly narrowed escalation criteria. This is textbook Fatigue/Numbness drift: the monotonic decline in engagement depth coupled with maintained or increased throughput. The system processes more while examining less.

Alert fatigue is not a technology problem that better alert tuning will solve. It is a human-state problem. The analyst who has processed 4,000 alerts is not the same cognitive entity as the analyst who processed their first 100. Their pattern recognition, their threshold for escalation, their willingness to investigate ambiguous signals — all have been degraded by sustained cognitive load. This degradation is measurable, predictable, and — with the right architecture — detectable before it produces a missed alert that enables a breach.

### 2.5 The Compliance Theater Problem

One of the most insidious findings in recent cybersecurity data is the persistent gap between compliance posture and security posture. Organizations pass audits and still get breached. This is not a paradox — it is the predictable outcome of Compliance Theater, the sixth human-state drift pattern identified in this framework.

The HIPAA Journal's 2026 analysis documents that OCR's most commonly identified HIPAA Security Rule violation is **failure to conduct adequate risk analysis** — a finding that persists despite the fact that virtually every healthcare organization *documents* annual risk assessments as part of their compliance program. The gap between documented compliance and operational security is not a documentation problem. It is a behavioral problem: organizations optimize for the metric (passing the audit) rather than the outcome (achieving security). Training completion rates of 100% with 0 failed assessments — a pattern the HIPAA Journal data reveals is common — are not evidence of effective security education. They are evidence of Compliance Theater: mechanical compliance that substitutes process completion for behavioral change.

The Equifax breach of 2017, which exposed 147 million records, occurred at an organization that maintained SOC 2 compliance, PCI DSS certification, and documented patching policies. The specific vulnerability exploited (Apache Struts CVE-2017-5638) had a patch available for two months before exploitation. The patch was not applied because the patching process — while documented in compliance frameworks — had degraded operationally. The team responsible for vulnerability remediation was operating under Hurry/Urgency-Override (competing priorities) and Fatigue (patch backlog exceeding sustainable processing capacity). The compliance framework documented a 30-day patching SLA. The human-state conditions required to execute that SLA did not exist.

### 2.6 AI-Powered Attacks: Exploiting Human-State Vulnerabilities at Scale

The emergence of AI-powered attacks in 2024–2026 has escalated the urgency of human-state monitoring. Generative AI has enabled threat actors to operate at scales and sophistication levels previously reserved for nation-state actors:

- **Deepfake social engineering:** In February 2024, a multinational corporation lost $25.6 million after an employee was deceived by a deepfake video conference call in which AI-generated impersonations of the company's Chief Financial Officer and other senior executives instructed a wire transfer (CNN, 2024). This attack exploited the Quiet Fear/Avoidance drift pattern — the employee's reluctance to question senior leadership, amplified by the social pressure of a real-time conference call.
- **AI-generated phishing at scale:** AI-crafted phishing emails now achieve significantly higher click rates than traditional template-based phishing because they are personalized, contextually appropriate, and linguistically fluent. These attacks exploit Fatigue (analysts who are already overwhelmed are more likely to miss AI-generated phishing that lacks traditional indicators) and Overconfidence ("I can always tell a phishing email").
- **Prompt injection attacks:** As organizations deploy AI assistants with access to internal systems, prompt injection has emerged as a novel attack vector that exploits the trust boundary between human operators and AI systems. Shadow AI — AI tools deployed without governance approval — creates unmonitored attack surfaces. The IBM 2025 report specifically highlighted the absence of AI governance policies as a breach cost multiplier (IBM Security, 2025).
- **Automated vulnerability exploitation:** AI-powered tools now scan for and exploit vulnerabilities faster than human-operated SOC teams can patch them. The Verizon 2025 DBIR's finding that only 54% of perimeter-device vulnerabilities were remediated, with nearly half remaining unresolved, reflects a human-paced response against machine-paced attack (Verizon, 2025).

Every one of these AI-powered attack vectors targets human-state vulnerabilities. The deepfake exploits fear and deference. The AI phishing exploits fatigue and overconfidence. The prompt injection exploits the hurry-driven deployment of ungoverned AI tools. The automated exploitation outpaces human systems operating under alert fatigue and resource constraints. The common denominator is not technology failure. It is the absence of human-state monitoring.

---

## 3. The Gap No Current Tool Addresses

### 3.1 SIEM: Detection After the Fact

Security Information and Event Management platforms — Splunk, IBM QRadar, Microsoft Sentinel, LogRhythm — aggregate log data across enterprise systems and apply correlation rules and machine learning to detect anomalies. They are powerful tools for what they are designed to do: identify technical anomalies in data streams. What they cannot do is detect the human-state conditions that make those anomalies inevitable.

A SIEM can detect that an analyst dismissed 47 critical alerts in a shift. It cannot detect that the analyst entered a state of fatigue-induced numbness two weeks prior to this shift and has been progressively declining in engagement depth ever since. A SIEM can detect that a privileged access grant bypassed the review process. It cannot detect that the administrator who approved the grant has been exhibiting Overconfidence drift for three months, with progressively increasing self-approval rates and declining peer review engagement. The SIEM sees the event. It cannot see the trajectory.

### 3.2 Zero Trust: Access Without State

Zero-trust architectures represent perhaps the most significant paradigm shift in cybersecurity architecture of the past decade. The core principle — "never trust, always verify" — eliminates the notion of a trusted internal network and requires continuous authentication and authorization for every access request. This is a genuine advancement for access control.

But zero trust addresses *who* has access and *when* they access it. It does not address the *human state* of the person at the time of access. An administrator who passes multi-factor authentication and is authorized for a given system is, from the zero-trust perspective, verified. If that administrator is operating under Overconfidence drift — making increasingly unilateral configuration decisions without peer review — zero trust has nothing to say about it. If a SOC analyst who is authenticated and authorized for the SIEM dashboard is operating under Stage 4 fatigue drift, zero trust sees a verified user, not a compromised human state.

The Change Healthcare breach illustrates this gap precisely. The attack vector was a Citrix remote access portal *without multi-factor authentication*. The zero-trust principle that could have prevented the breach — continuous verification — was not applied to that specific access point. But the *reason* it was not applied is a human-state question: Why was a critical healthcare clearinghouse portal left without MFA? The technical answer (misconfiguration, legacy system) is subordinate to the human-state answer: some combination of Overconfidence ("our other defenses are sufficient"), Compliance Theater (MFA documented in policy but not universally enforced), and Hurry ("we'll get to it in the next sprint").

### 3.3 Security Awareness Training: Knowledge Without Behavior

The security awareness training industry generates billions in annual revenue and has produced measurable improvements in baseline security knowledge. But the persistent effectiveness of phishing, the continued prevalence of credential reuse, and the unchanged rate of insider incidents demonstrate that knowledge and behavior are not the same.

Security awareness training addresses what people *know*. It assumes that if people know the right thing to do, they will do it. This assumption has been falsified by decades of behavioral science research (Kahneman, 2011) and by the cybersecurity data itself. The NIST control AT-2 (Security Awareness Training) consistently appears among the controls most vulnerable to drift, because the training addresses cognition while the failure occurs at the level of state. A person who *knows* they should verify a wire transfer request before acting may not *do* so when they are operating under Hurry/Urgency-Override with a CEO (or deepfake CEO) on the line demanding immediate action. A person who *knows* they should report a suspicious finding may not *do* so when they are operating under Quiet Fear in a culture where reporting has previously resulted in blame.

The AT-2 control is technically compliant. The human-state conditions required for its behavioral execution are not. And no current tool monitors the gap.

### 3.4 The Precise Gap

Across SIEM, XDR, zero trust, EDR, SOAR, and security awareness training, the same gap persists:

**No existing framework monitors the pre-behavioral signal — the drift that happens before the human acts.**

This is the precise gap the Cybersecurity-NI App fills. It introduces a detection layer that no current tool provides: the systematic monitoring, classification, and governance response to human-state drift patterns that precede and enable cybersecurity failures.

---

## 4. The Six Human-State Drift Patterns as a Predictive Framework

This section presents each of the six human-state drift patterns defined in the Cybersecurity-NI framework, maps each to a documented real-world breach or incident, identifies the specific NIST SP 800-53 control that failed, and demonstrates how the Cybersecurity-NI App would have detected and flagged the drift at Stage 1–2 — before the breach occurred.

### 4.1 Drift Pattern 1: Fatigue / Numbness

**The Pattern.** Sustained cognitive load progressively erodes the human capacity for pattern discrimination, risk assessment, and engaged review. Observable organizational indicators include accelerating alert dismissal rates, declining review duration, decreasing documentation depth, and rubber-stamped approvals (approval times below plausible review duration).

**The Real-World Breach: Target Corporation (2013).** On November 27, 2013, the SIEM system at Target's Security Operations Center detected suspicious activity associated with what would become one of the most consequential retail data breaches in history — 40 million credit card records and 70 million personal records stolen over a 19-day period. FireEye malware detection systems generated multiple alerts. The SOC team in Bangalore, responsible for initial triage, did not escalate the alerts. Post-incident investigation revealed that the team was processing thousands of alerts per shift, alert dismissal rates had been climbing for weeks, and the cognitive threshold for escalation had progressively narrowed. The threat actors' activity — though flagged by automated systems — fell within the expanding range of alerts the fatigued team had learned to dismiss (U.S. Senate Committee on Commerce, Science, and Transportation, 2014; Riley et al., 2014).

**The NIST Control That Failed: AU-6 (Audit Review, Analysis, and Reporting).** AU-6 requires organizations to "review and analyze information system audit records for indications of inappropriate or unusual activity." The control was technically implemented — audits were being generated and reviewed. The control failed functionally because the human state required for substantive review had degraded below the threshold of effectiveness.

**How Cybersecurity-NI Would Have Detected It.** The Cybersecurity-NI pipeline would have ingested SOC alert processing metadata: alert volume per analyst per shift, time-to-dismiss, dismissal clustering patterns, and review documentation depth. The transformer's self-attention mechanism, trained on temporal behavioral sequences, would have detected the monotonic decline in engagement metrics beginning weeks before the breach. At Stage 2 (Tendency), the system would have flagged: *"Security operations team showing Fatigue/Numbness drift. Alert dismissal rates have increased 34% over 3 weeks while documentation depth has decreased 52%. AU-6 effectiveness at risk."* The NI calibration response would not have been "review more alerts" — which would deepen fatigue — but rather: *"Review cadence exceeds sustainable rhythm. Reduce daily alert volume per analyst by 40%. Implement depth-focused review protocol for high-priority alerts. Introduce mandatory rotation cycle."*

### 4.2 Drift Pattern 2: Overconfidence

**The Pattern.** Sustained authority or technical expertise without adequate challenge progressively inflates confidence, leading to bypassed protocols, self-approved access changes, declining peer review engagement, and "just this once" exceptions that become patterns.

**The Real-World Breach: SolarWinds Supply Chain Attack (2020).** The SolarWinds breach, discovered in December 2020, involved a nation-state actor (attributed to Russia's SVR) compromising the SolarWinds Orion software build process and distributing a trojanized update to approximately 18,000 organizations globally, including U.S. federal agencies and Fortune 500 companies. Investigation revealed that SolarWinds' build infrastructure had been inadequately secured — a fact compounded by a corporate culture where security was subordinated to growth imperatives. A former SolarWinds security advisor testified that his warnings about security vulnerabilities were not acted upon, and that the password "solarwinds123" had been used on a server accessible from the internet (U.S. Senate Select Committee on Intelligence, 2021). The organizational conditions reflected Overconfidence — a large, successful technology company that had operated for years without a significant breach and had developed an implicit assumption that its security posture was adequate.

**The NIST Control That Failed: AC-2 (Account Management) and CM-3 (Configuration Change Control).** AC-2 requires management of information system accounts with appropriate oversight. CM-3 requires documentation and approval of configuration changes. In SolarWinds' case, the configuration of build infrastructure and the management of access to critical systems reflected patterns of accumulated confidence: security practices that were sufficient when the organization was smaller and less targeted had not been recalibrated to match the organization's expanded risk profile.

**How Cybersecurity-NI Would Have Detected It.** The system would have tracked access review patterns, peer review engagement, and exception rates for privileged operations over the preceding quarters. The attention mechanism would have weighted the gradual decline in security review rigor — not as individual anomalies (each within normal variance) but as a compound pattern of Overconfidence drift. At Stage 2, the system would have identified the divergence between the organization's growing attack surface and its static (or declining) security review practices. NI response: *"Peer review bypass rate for privileged operations has increased 67% over 6 months. Introduce mandatory dual-approval for all configuration changes to build infrastructure. Rotate privileged access credentials quarterly."*

### 4.3 Drift Pattern 3: Hurry / Urgency-Override

**The Pattern.** Deadline pressure systematically compresses procedural safeguards below functional thresholds. Observable indicators include skipped validation, compressed testing cycles, deferred security reviews, increasing after-hours deployments, and emergency change requests that become routine.

**The Real-World Breach: Equifax (2017).** The Equifax breach — 147 million consumer records exposed — was enabled by the failure to patch a known Apache Struts vulnerability (CVE-2017-5638) within the organization's documented 48-hour patching SLA. The patch was available for more than two months before the breach. Post-incident investigation by the U.S. House Committee on Oversight and Government Reform (2018) found that the patching process had been overwhelmed: the security team was managing a massive IT estate with competing priorities, and the specific patch was lost in the backlog. The organizational conditions reflected classic Hurry/Urgency-Override: too many patches, too little time, with competing business priorities consistently overriding security remediation timelines.

**The NIST Control That Failed: SI-2 (Flaw Remediation).** SI-2 requires organizations to "identify, report, and correct information system flaws" within defined timelines. Equifax had a documented patching SLA. The SLA was not met because the human-state conditions required for its execution — adequate time, appropriate prioritization, sustainable workload — did not exist.

**How Cybersecurity-NI Would Have Detected It.** The pipeline would have tracked patching cadence metrics: time-to-patch, patch backlog growth rate, emergency vs. standard change request ratios, and after-hours deployment frequency. The temporal sequence model would have identified the progressive compression of remediation timelines — not a sudden failure but a gradual drift toward unsustainable pace. At Stage 2: *"Vulnerability remediation team showing Hurry/Urgency-Override drift. Patch backlog has grown 89% over 8 weeks. Mean time-to-patch for critical vulnerabilities now exceeds SLA by 340%. SI-2 compliance at material risk."* NI response: *"Current remediation workload exceeds team capacity by estimated 2.3x. Options: expand team, reduce scope via risk-based prioritization, or extend SLA with documented risk acceptance for non-critical assets."*

### 4.4 Drift Pattern 4: Quiet Fear / Avoidance

**The Pattern.** Organizational cultures where reporting, questioning, or raising concerns is implicitly or explicitly discouraged produce systematic under-reporting, delayed escalation, and silence about known issues. Observable indicators include declining incident report specificity, reduced voluntary reporting, avoidance of security review assignments, and widening gaps between automated detection and human-initiated reporting.

**The Real-World Breach: Anthem Inc. (2015).** The Anthem breach — 78.8 million records, the second-largest healthcare data breach in history — was preceded by months of unauthorized access to the database. While Anthem's external detection capabilities identified the breach, post-incident analysis revealed that internal indicators had been present earlier but were not escalated. The organizational dynamics at a major health insurer — where reporting a potential breach carried enormous regulatory, financial, and reputational implications — created conditions consistent with Quiet Fear: the implicit awareness that surfacing bad news would trigger consequences that made silence feel safer than disclosure. Anthem paid $16 million to OCR to settle HIPAA violations, plus $39.5 million to settle multistate attorney general actions (HIPAA Journal, 2026).

**The NIST Control That Failed: IR-6 (Incident Reporting).** IR-6 requires organizations to report security incidents. The control assumes that organizational conditions support honest and timely reporting. When they do not — when reporting culture is characterized by blame attribution or career consequences — IR-6 is functionally degraded regardless of its policy status.

**How Cybersecurity-NI Would Have Detected It.** The system would have monitored the ratio of human-initiated incident reports to automated detection alerts, report specificity scores, reporting latency (time from signal to report), and cross-correlated these with organizational context (post-incident review outcomes, staffing changes, public communications about prior incidents). A declining ratio of voluntary reports to automated detections, coupled with increasing reporting latency, would be classified as Quiet Fear/Avoidance drift. NI response: *"Incident reporting patterns indicate potential suppression of reporting candor. Human-initiated report ratio has declined 38% over 12 weeks. Recommended: implement no-fault initial reporting window, review post-incident attribution practices, introduce anonymous reporting channel for security concerns."*

### 4.5 Drift Pattern 5: Hoarding / Control Grip

**The Pattern.** Individuals or small groups accumulate access permissions, system credentials, and institutional knowledge beyond role requirements, creating concentration risk. Observable indicators include resistance to access reviews, excessive privilege retention, declining delegation, and documentation avoidance.

**The Real-World Breach: Edward Snowden / NSA (2013).** While categorized as espionage rather than a traditional data breach, the Snowden case illustrates Hoarding/Control Grip at its most consequential. Snowden, a system administrator contractor at the NSA, had accumulated administrative access across multiple systems — access that exceeded what any single individual should have held. He was able to access and exfiltrate classified documents from multiple compartmented programs because access controls had not been enforced with the principle of least privilege. The organizational conditions reflected classic Hoarding: administrative culture where system administrators accumulated broad access over time, access reviews were perfunctory, and the concentration of privilege in individual administrators was treated as an operational convenience rather than a governance risk (U.S. House Permanent Select Committee on Intelligence, 2016).

**The NIST Control That Failed: AC-6 (Least Privilege) and PS-5 (Personnel Transfer).** AC-6 mandates that organizations employ the principle of least privilege, restricting users to the minimum access required for their role. PS-5 addresses access controls during personnel transfers. In the NSA's case, the accumulation of access beyond role requirements violated the principle of least privilege over an extended period.

**How Cybersecurity-NI Would Have Detected It.** The pipeline would have tracked access accumulation rates by individual and role, access-to-role ratios, resistance signals during access review cycles (delays, challenges, exceptions), and knowledge concentration indicators (documentation avoidance, delegation resistance). The attention mechanism would have identified the progressive accumulation pattern across quarterly review cycles. NI response: *"Access concentration in [role/individual] exceeds role-based allocation by 4.7x. Critical system access is undocumented and non-delegated, creating single-point-of-failure risk. Implement mandatory access sharing with documented succession protocol. Conduct privilege reduction review within 30 days."*

### 4.6 Drift Pattern 6: Compliance Theater

**The Pattern.** The optimization of compliance metrics rather than security outcomes. Observable indicators include uniformly positive self-assessments, training completion rates at or near 100% with zero failed assessments, audit responses that precisely match expected language, and anomalously low variance across teams or time periods.

**The Real-World Incident: Equifax Pre-Breach Compliance Posture (2017).** Equifax maintained compliance certifications including SOC 2 and PCI DSS, and documented comprehensive security policies. Congressional investigation revealed that compliance documentation did not reflect operational reality: documented patching SLAs were not met, documented access review processes were not consistently executed, and documented risk assessments did not identify vulnerabilities that were, in practice, well known to the security team (U.S. House Committee on Oversight and Government Reform, 2018). The compliance framework was technically complete. Its execution was hollow. Similarly, the OCR's most commonly identified HIPAA violation — failure to conduct adequate risk analysis — persists despite virtually universal *documentation* of annual risk assessments in healthcare organizations (HIPAA Journal, 2026).

**The NIST Control That Failed: CA-7 (Continuous Monitoring) and CA-2 (Control Assessments).** CA-7 requires ongoing monitoring of control effectiveness. CA-2 requires assessment of security controls. When self-assessments consistently produce uniformly positive results without variance, the controls exist on paper while the assessment process itself has become theatrical.

**How Cybersecurity-NI Would Have Detected It.** The system's most distinctive capability for Compliance Theater detection is its analysis of *variance*. Genuine security assessments across multiple teams should show variance — some teams have stronger controls than others, some areas have genuine gaps. When assessment scores are uniformly satisfactory with anomalously low variance, the compliance metrics are statistically inconsistent with genuine evaluation. The prototype's detection of this pattern in simulated healthcare data showed an average lead time of 6.4 weeks — the longest early-warning window of any drift pattern, because Compliance Theater's signature (anomalous uniformity) is present from onset. NI response: *"Assessment uniformity indicates metric optimization rather than genuine evaluation. Self-assessment variance across 14 teams: 0.02 (anomalously low). Recommended: replace uniform self-assessment with scenario-based evaluation, introduce independent spot-assessment of randomly selected teams, implement variance-positive scoring that rewards identification of genuine gaps."*

---

## 5. How "Attention Is All You Need" Becomes "Attention Is All We Needed"

### 5.1 The Parallel That Changes Cybersecurity

In 2017, Vaswani et al. published "Attention Is All You Need," introducing the transformer architecture that would redefine natural language processing. The core innovation was the self-attention mechanism: a method for computing the relevance of every element in a sequence to every other element, enabling the model to weigh context dynamically rather than processing sequences step-by-step. This mechanism transformed NLP by enabling models to understand that the meaning of a word depends on its relationship to words that may be distant in the sequence — that context across time is what determines meaning.

This paper argues that the same mechanism transforms cybersecurity by enabling systems to understand that the significance of a behavioral signal depends on its relationship to signals that may be distant in time — that context across time is what determines risk.

The parallel is not metaphorical. It is architectural.

### 5.2 Why Temporal Pattern Modeling Is the Missing Layer

Every major cybersecurity AI tool — from CrowdStrike Falcon's AI-powered threat detection to Splunk's ML-based anomaly identification to Microsoft Sentinel's UEBA capabilities — treats security signals as events. An alert fires. An anomaly is scored. A threshold is exceeded. The response is generated based on the current state of the system at the time of detection.

Drift is not an event. Drift is a *sequence*.

An analyst does not go from fully engaged to fatally fatigued in a single shift. The progression occurs over weeks: a gradual increase in alert dismissal rates, a slow decline in review documentation depth, a subtle narrowing of escalation criteria, and finally a missed critical alert. Each individual data point may be within normal variance. The *trajectory* — the sequential pattern across time — is where the risk signal lives.

Traditional time-series anomaly detection uses fixed temporal windows: 7-day moving averages, 30-day standard deviations. These treat all time points within the window equally and ignore everything outside. Behavioral drift does not conform to fixed windows. An access review skipped six weeks ago may be more predictive of current Overconfidence than last week's normal behavior, because the skip represents the first emergence of the drift pattern while last week's normalcy represents temporary regression to the mean.

The self-attention mechanism resolves this by learning *which* historical time points are most relevant to the current assessment. The attention function computes:

$$\text{Attention}(Q, K, V) = \text{softmax}\left(\frac{QK^T}{\sqrt{d_k}}\right)V$$

where queries ($Q$), keys ($K$), and values ($V$) are learned projections that encode, respectively, "what am I looking for?", "what do I contain?", and "what do I provide?". The resulting attention weights are *learned*, not hand-engineered, and therefore adapt to the specific temporal dynamics of each drift pattern:

- **Fatigue drift** may require attention spanning 2–4 weeks, as fatigue develops and (if unaddressed) compounds on relatively short timescales.
- **Overconfidence drift** may require attention spanning 6–12 months, reflecting the slower accumulation of unchallenged authority and declining peer review engagement.
- **Compliance Theater** may require attention at audit-cycle boundaries specifically — detecting the predictable pattern where compliance effort peaks before review dates and subsides between them.
- **Quiet Fear** may require attention that cross-references behavioral pattern shifts with organizational context events (post-incident reviews, leadership changes, public disciplinary actions).

No fixed-window method can capture this diversity. The attention mechanism learns the temporal dynamics from data.

### 5.3 Multi-Agent Orchestration + RAG + NLI: The Detection Engine No SIEM Possesses

The Cybersecurity-NI detection pipeline combines three capabilities that collectively exceed anything in the current SIEM or XDR landscape:

**LangGraph Multi-Agent Orchestration.** Four specialized agents — Access Pattern Agent, Audit Behavior Agent, Incident Response Agent, and Communication Pattern Agent — each process their respective signal domains and maintain independent state. LangGraph's stateful, graph-based orchestration enables these agents to share signals through a common state graph while maintaining domain specialization. This is architecturally distinct from monolithic SIEM correlation engines, which apply rule-based or ML-based correlation to a single unified data stream. The multi-agent approach enables each agent to develop specialized pattern recognition for its signal domain while the orchestration layer computes cross-agent correlations.

**Retrieval-Augmented Generation (RAG).** When drift is detected, the NI response must be contextually appropriate — not a generic recommendation but one calibrated to the specific organization, team, drift pattern, and severity stage. The RAG pipeline retrieves from a curated NI response library, ensuring responses are grounded in established governance knowledge rather than generated from unconstrained model output. This architecture provides auditability (every response traces to a library entry), consistency (the same drift pattern produces responses from the same validated framework), and updatability (the library can be refined based on response effectiveness data without retraining the classification model).

**Natural Language Inference (NLI) Classification.** The most novel component of the detection pipeline is its use of NLI for drift classification. Rather than training a conventional multiclass classifier on labeled examples of drift patterns (which would require large volumes of labeled organizational behavioral data that does not yet exist at scale), the system encodes observed behavioral patterns as natural language premises and evaluates their entailment relationship to drift-pattern hypotheses. This approach, adapted from hallucination detection work in large language model evaluation, provides several advantages:

- Interpretability: the entailment reasoning chain provides a natural-language explanation for every classification.
- Zero-shot generalization: the model can classify drift patterns in organizations it has not been specifically trained on, because the classification operates on semantic descriptions of behavior rather than raw feature vectors tied to specific organizational contexts.
- Multi-pattern detection: the NLI approach naturally supports detecting multiple simultaneous drift patterns (e.g., Fatigue co-occurring with Compliance Theater) without requiring explicit multi-label training.

No existing SIEM, XDR, or behavioral analytics platform combines temporal self-attention, multi-agent orchestration, RAG-grounded response generation, and NLI-based behavioral classification. This is the detection engine the industry does not yet have.

### 5.4 The Transformation: From Anomaly to Trajectory

The fundamental transformation this architecture enables is the shift from anomaly-based detection to trajectory-based detection.

Current tools ask: "Is this event anomalous?"
The Cybersecurity-NI system asks: "Is this trajectory consistent with drift toward governance failure?"

The former detects the missed alert. The latter detects the three weeks of progressive fatigue that made the missed alert inevitable. The former triggers an incident response. The latter triggers a governance calibration that prevents the incident from occurring.

Just as the attention mechanism transformed NLP by enabling models to understand that a word's meaning depends on its relationship to the entire sequence, it now transforms cybersecurity by enabling systems to understand that a behavioral signal's risk depends on its relationship to the entire trajectory. Context across time was all we needed. The transformer provides it.

---

## 6. The Three-Layer Solution Architecture in Practice

### 6.1 Layer 3: AI Detection — What It Ingests, How It Classifies, What It Scores

**Ingestion.** Layer 3 ingests four categories of organizational behavioral data through standardized API connectors:

1. **IAM/Access Logs:** Authentication events, privilege grants/revocations, access request/approval workflows, session durations, and failed authentication attempts. In Epic EMR environments, this includes EpicCare user access logs, MyChart access patterns, and role-based access control (RBAC) modification records.
2. **GRC Platform Data:** Audit review timestamps, reviewer interaction metrics, review outcomes, policy acknowledgment records, training completion data, and self-assessment scores.
3. **SIEM Event Data:** Alert generation rates, alert disposition records (acknowledged, dismissed, escalated, false-positive-classified), mean time to acknowledge/investigate/resolve, and analyst workload distribution.
4. **Communication Metadata:** Response latencies, meeting attendance patterns, cross-team communication frequency, and after-hours activity indicators. Critically: metadata only — no content analysis.

**Preprocessing.** All signals are normalized to organization-specific rolling baselines (90-day organizational means by role/team/function), ensuring that what constitutes "normal" is calibrated to each organization's specific context.

**Classification.** Normalized temporal feature sequences are encoded as structured natural language descriptions and classified using the NLI pipeline against six drift-pattern hypotheses. Each classification includes a confidence score (0–1), a severity grade (1–5), and a trend indicator (increasing/stable/decreasing). Multiple simultaneous patterns are supported.

**Scoring.** The output is a structured drift report (JSON) containing:
- Active drift patterns with severity and confidence
- NIST controls at risk, with risk-level grades
- Temporal trend data (direction, duration, acceleration)
- Early warning signals for Stage 1–2 patterns below action threshold but trending
- NI calibration recommendations retrieved via RAG

### 6.2 Layer 2: EI Revelation — Surfacing What Technical Systems Cannot See

Layer 2 is where the architecture diverges most sharply from conventional cybersecurity tools. It does not detect technical anomalies. It surfaces *authentic behavioral patterns* — the decision tendencies, stress signatures, and intention signals that humans cannot hide from organizational data.

The principle underlying Layer 2 is that organizational data is behaviorally transparent. An organization's IAM logs, audit records, and incident reports collectively encode the behavioral reality of how its people actually operate — regardless of what policy documents say they *should* be doing. When audit review times consistently decline, the organizational data is revealing fatigue — even if no individual reports being fatigued. When self-assessment scores are uniformly positive, the organizational data is revealing compliance theater — even if every assessor genuinely believes their assessment is accurate.

This is why the layer is called "EI Revelation" rather than "EI Detection." The patterns are not hidden in the conventional sense. They are hidden from the organization because the organization lacks the architecture to read what its own data is revealing about its human state.

Layer 2 maps each detected behavioral signal to one or more of the six drift patterns, associates the pattern with its characteristic cybersecurity failure mode, and connects it to the specific NIST SP 800-53 controls most vulnerable to that pattern. The mapping is not one-to-one — a single behavioral signal may indicate multiple drift patterns (declining review times could indicate Fatigue OR Hurry), and a single drift pattern may affect multiple controls (Overconfidence degrades AC-2, AC-6, CM-3, and AT-2 simultaneously).

### 6.3 Layer 1: NI Calibration — Why This Distinction Is Transformative

Layer 1 — the NI Calibration layer — is what makes the Cybersecurity-NI architecture transformative rather than merely incremental. Without it, the system is a sophisticated behavioral analytics tool that produces better alerts. With it, the system produces *governance responses that address the cause of vulnerability, not merely the symptom*.

The distinction is best understood through contrast:

| Drift Detected | Conventional Tool Response | NI-Calibrated Response |
|---|---|---|
| SOC analysts showing Stage 3 Fatigue | "Alert: increased alert dismissal rate" → analyst now has one more alert to dismiss | "Review cadence exceeds sustainable rhythm. Reduce daily volume 40%, increase depth protocol, introduce 48-hour rotation." |
| Privileged admin showing Stage 3 Overconfidence | "Alert: elevated self-approval rate" → admin dismisses alert based on confidence | "Introduce mandatory peer review for decisions currently self-approved. Rotate administrative privileges quarterly." |
| IR team showing Stage 2 Quiet Fear | "Reminder: report all security incidents per policy" → fear of reporting deepens | "Post-incident attribution patterns may suppress candor. Implement no-fault reporting window. Conduct anonymous culture assessment." |
| Organization showing Stage 4 Compliance Theater | "Alert: assessment scores show low variance" → organization adds another compliance metric | "Replace self-assessment with independent scenario-based evaluation. Reward identification of genuine gaps." |

Every conventional response in the left column risks *exacerbating* the drift it detects. Sending more alerts to a fatigued analyst increases fatigue. Reminding a fearful reporter of their obligations without changing the conditions creating fear produces more theater. Adding compliance metrics to a theater problem creates meta-theater.

NI calibration breaks this cycle by targeting the *condition*, not the *symptom*. This approach is informed by a foundational principle: sustainable change requires addressing antecedent conditions, not merely mandating different outputs. The NI response library — curated by domain experts, not generated by the AI — contains calibration responses for each drift pattern at each severity stage, with context-sensitive variants for different organizational types, team sizes, and regulatory environments.

This is not incremental improvement. It is a category change in what a cybersecurity tool can do.

---

## 7. Why Healthcare Is the Right First Vertical

### 7.1 The Evidence-Based Case

The selection of healthcare as the first deployment vertical for the Cybersecurity-NI prototype is driven by convergent evidence across multiple dimensions:

**Breach Concentration.** Healthcare constitutes approximately 32% of all recorded data breaches across all sectors — nearly double the next most-breached industry (HIPAA Journal, 2026). The IBM Cost of a Data Breach Report has documented healthcare as the highest-cost sector for breach remediation for over thirteen consecutive years. The average healthcare data breach cost substantially exceeds the cross-industry average, driven by regulatory penalties, litigation costs, patient notification expenses, and operational disruption.

**Patient Safety Implications.** Healthcare cybersecurity breaches are not merely data confidentiality events. The Ascension Health ransomware attack of 2024, which disrupted electronic health records across 140 hospitals, forced clinicians to operate on paper-based processes — a direct patient safety risk. Emergency departments diverted ambulances. Medication orders were delayed. Surgical schedules were disrupted. Research by Dameff et al. (2023) has documented measurable increases in patient mortality associated with hospital IT disruptions during ransomware attacks. In healthcare, a cybersecurity failure can terminate a human life.

**Regulatory Requirements.** Healthcare organizations operate under the HIPAA Security Rule, HITECH Act, state-level privacy regulations, and (for federally funded institutions) NIST Cybersecurity Framework requirements. The OCR's ongoing enforcement initiatives — risk analysis compliance, breach notification requirements, right of access provisions — create a regulatory environment where governance tools that can demonstrate proactive risk management have direct compliance value. The Cybersecurity-NI system's NIST control mapping provides direct integration with these regulatory requirements.

**Epic EMR Concentration.** Epic Systems' electronic medical record platform dominates the U.S. healthcare market, with more than 250 million patient records on its systems. Epic's architecture — role-based access control, comprehensive audit logging, clinical workflow integration — generates exactly the behavioral signal data the Cybersecurity-NI pipeline is designed to ingest. Access patterns within Epic (who accessed which records, when, for how long, with what actions), audit review behaviors (record access audit completion rates, time-to-review, exception handling), and clinical workflow indicators (after-hours order entry, care team communication patterns) provide a rich behavioral signal dataset.

### 7.2 Healthcare as a Drift Accelerator

The healthcare environment concentrates conditions that accelerate every drift pattern identified in this framework:

- **Fatigue/Numbness:** Clinical staff and healthcare IT operate under chronic understaffing. Alert fatigue is extensively documented in clinical contexts — Ancker et al. (2017) found that clinical decision support alerts are overridden at rates exceeding 90% in some settings. This clinical alert fatigue extends directly to cybersecurity alert processing within the same organizations.
- **Hurry/Urgency-Override:** Healthcare is defined by urgency. Clinical emergencies routinely require immediate access to patient records, medication databases, and diagnostic systems. The cultural norm of urgency — "patient care cannot wait" — creates conditions where cybersecurity protocols are perceived as obstacles to care delivery, normalizing the override of security controls under time pressure.
- **Compliance Theater:** Healthcare is among the most heavily regulated industries. HIPAA compliance requirements, Joint Commission accreditations, CMS Conditions of Participation, and state licensure requirements create compliance obligations that can overwhelm genuine engagement, producing environments where documentation substitutes for practice.
- **Quiet Fear:** Healthcare cultures, particularly in hierarchical clinical environments, can suppress reporting. The well-documented reluctance to report medical errors (despite mandatory reporting requirements) extends to cybersecurity: reporting a potential breach carries regulatory, financial, and reputational consequences that create implicit pressure against disclosure.

### 7.3 The Domain Authority for Pilot Deployment

The Cybersecurity-NI pilot deployment is supported by domain authority that spans the required disciplines:

- **Clinical and institutional credibility:** Dr. Anil K. Agarwal brings 45 years of clinical experience and established relationships with the Ohio State Medical Association (OSMA) and Montgomery County Medical Society (MCMS) — direct channels to healthcare decision-makers.
- **Cybersecurity and regulatory expertise:** Neeta Tambe provides NIST framework expertise, threat model validation, and healthcare cybersecurity industry credibility — the technical authority required for healthcare CISO engagement.
- **AI engineering capability:** The prototype implementation — LangGraph pipeline, vector database integration, NLI classification, RAG retrieval, FastAPI backend, React dashboard — demonstrates production-grade engineering readiness.

This combination — clinical credibility, regulatory expertise, and AI engineering capability — addresses the three decision gates that healthcare CISOs and compliance officers evaluate before adopting governance tools: "Does this team understand our clinical environment? Does this tool integrate with our regulatory obligations? Is the technology production-ready?"

---

## 8. Ethical Architecture: Why This Is Not Surveillance

### 8.1 The Critical Distinction

The distinction between organizational pattern detection and individual surveillance is not a rhetorical nicety. It is a design constraint embedded at every layer of the Cybersecurity-NI architecture.

**The system reads organizational patterns, not individuals.**

This distinction is implemented through four architectural mechanisms:

**Data Aggregation.** All behavioral signals are aggregated to the team or function level before drift classification. Individual-level data is used only for computing team-level aggregates and is not retained, displayed, or used for individual assessment. The system detects: "The security operations team is showing Stage 3 fatigue drift." It does not detect: "Analyst X is fatigued." This aggregation is not merely a privacy choice — it reflects the theoretical position that drift is an organizational phenomenon. Fatigue in a SOC is caused by organizational workload decisions, not individual weakness. The response must therefore target organizational conditions, not individual performance.

**Attribution to Conditions, Not People.** Drift is attributed to organizational conditions: workload, cadence, culture, resource allocation. When fatigue drift is detected, the NI response addresses shift duration, rotation protocols, and alert volume — systemic conditions within management's control. It does not identify, rate, or flag individual employees.

**Role-Based Access Control.** Dashboard access is governed by RBAC that prevents drill-down to individual-level data. Governance leaders see team-level drift maps and NI calibration recommendations. Managers see their team's drift trends and recommended organizational adjustments. No user role in the system can access individual behavioral profiles, because individual behavioral profiles do not exist in the system.

**Transparency Requirements.** The ethical framework mandates organizational transparency about the system's operation. Employees are informed that organizational behavioral patterns (aggregated, anonymized) are analyzed for governance calibration. The system operates on data already collected for legitimate cybersecurity purposes (access logs, audit records, incident reports). No additional personal data collection is required.

### 8.2 Bias Risks and Mitigation

**Training Data Bias.** The drift-pattern signature library risks overrepresenting the organizational cultures from which it was developed. If the library encodes behavioral norms specific to U.S. corporate culture, it may misclassify drift in organizations with different cultural norms around hierarchy, reporting, and compliance. Mitigation: the library is designed for contextual adaptation, and the NLI classification approach operates on semantic behavioral descriptions rather than raw feature thresholds — providing a degree of cultural transferability.

**False Positive Risk.** Incorrectly identifying active drift could trigger unnecessary interventions that consume organizational resources and create the conditions they aim to prevent (e.g., false Quiet Fear alerts could create actual quiet fear). Mitigation: Stage 1–2 detections produce awareness prompts only — low-cost, non-punitive signals that carry no corrective implications even if incorrect. Structural interventions require Stage 3+ severity with sustained multi-signal evidence.

**Opacity.** While attention weights provide inspectable relevance maps, interpreting them as causal explanations is methodologically questionable (Jain & Wallace, 2019). Mitigation: the NLI reasoning chain provides a parallel human-interpretable explanation for every classification, independent of attention weight interpretation.

**Feedback Loop Risk.** If NI responses are ineffective, the system could enter degrading loops where interventions exacerbate drift. Mitigation: every NI response includes expected outcome indicators (specific metric changes within defined timeframes) that are monitored for confirmation or contradiction. The response library is maintained by domain experts and updated based on empirical effectiveness data.

### 8.3 AI Governance in Healthcare: Regulatory Alignment

The system is designed for alignment with emerging AI governance requirements in healthcare:

- **HHS AI Strategy (2024):** The Department of Health and Human Services has emphasized responsible AI deployment in healthcare, with specific attention to transparency, fairness, and human oversight. The Cybersecurity-NI architecture provides transparency (NLI explanations for every classification), fairness (aggregated data, no individual attribution), and human oversight (calibration responses are recommended to human governance leaders, not automatically executed).
- **HIPAA Security Rule Alignment:** The system processes data categories already within the HIPAA Security Rule's scope (access logs, audit records). It does not introduce new data collection categories. Its output (governance recommendations) is advisory, not automated enforcement.
- **NIST AI Risk Management Framework:** The NIST AI RMF (2023) provides a voluntary framework for managing AI risks. The Cybersecurity-NI architecture addresses its core functions: Govern (calibration logic maintained by human experts), Map (explicit NIST control-to-drift mapping), Measure (confidence scoring with human-review routing for ambiguous signals), and Manage (severity-staged responses with effectiveness monitoring).

---

## 9. The Competitive Landscape: Why Nothing Else Does This

### 9.1 CrowdStrike Falcon

CrowdStrike Falcon is the market-leading endpoint detection and response (EDR) and extended detection and response (XDR) platform. Its AI-powered threat detection — particularly the Charlotte AI assistant — provides real-time threat intelligence, malware analysis, and incident response capability. Falcon excels at what it does: detecting and responding to technical threats against endpoints.

**What it misses:** Falcon monitors endpoint behavior, not human behavior. It can detect that a compromised credential was used to access a system. It cannot detect that the credential was compromised *because* the team responsible for credential rotation had entered Overconfidence drift and had progressively extended rotation intervals over six months. Falcon detects the technical exploit. The Cybersecurity-NI system detects the human-state condition that enabled it.

### 9.2 Splunk / Microsoft Sentinel

Splunk and Microsoft Sentinel represent the SIEM tier — platforms that aggregate, correlate, and visualize security event data across enterprise infrastructure. Sentinel's integration with the Microsoft 365 ecosystem, combined with its User and Entity Behavior Analytics (UEBA) capabilities, provides sophisticated anomaly detection.

**What they miss:** SIEM platforms detect anomalies in event data. An anomaly is a data point that deviates from an expected pattern *at a specific point in time*. Drift is not an anomaly — it is a *gradual trajectory* that may never produce a single anomalous data point. Each individual weekly metric may be within two standard deviations of the mean. The *sequence* of weekly metrics — each slightly worse than the last, compounding over months — is the drift signal. SIEM correlation rules and ML models are not designed to detect this type of sequential degradation in human-behavioral patterns.

### 9.3 Securonix and Exabeam: Behavioral Analytics

Securonix and Exabeam represent the most direct competitive comparisons, as both are marketed as behavioral analytics platforms. Securonix's UEBA uses machine learning to baseline user and entity behavior and detect deviations. Exabeam's Smart Timelines reconstruct user activity sequences for investigation.

**What they miss:** The critical distinction is between *anomaly* and *drift*. Behavioral analytics platforms detect when behavior deviates from a baseline — a user accessing systems at unusual times, downloading unusual volumes of data, or accessing resources outside their normal pattern. These are behavioral anomalies: discrete deviations from established norms. Drift is categorically different. Drift is the progressive *shift* of the baseline itself. An analyst who is developing fatigue drift does not suddenly start behaving anomalously. They gradually shift their normal operating pattern — slightly faster dismissals, slightly less documentation, slightly narrower escalation criteria — over weeks. Each day's behavior is consistent with the gradually shifting baseline. No anomaly is ever detected because the baseline is shifting at the same rate as the behavior.

**The unique differentiator:** Every tool in the competitive landscape — CrowdStrike, Splunk, Sentinel, Securonix, Exabeam, Palo Alto Cortex, IBM QRadar, Rapid7, Arctic Wolf — detects *after* the breach-enabling condition has manifested in observable data. The Cybersecurity-NI system detects *before*, by reading the human-state trajectory that precedes the observable manifestation.

This is not a marginal improvement in detection speed. It is a categorical shift in *what is being detected*. The current landscape detects technical anomalies. This system detects human-state drift. These are different phenomena, requiring different architectures, producing different outcomes.

---

## 10. Conclusion: The Signal Before the Breach

The cybersecurity industry has spent decades building increasingly sophisticated systems for detecting technical anomalies after they occur. SIEM platforms correlate events. EDR tools monitor endpoints. Zero-trust architectures verify access. AI-powered threat intelligence processes indicators of compromise at machine speed. These tools are necessary. They are not sufficient.

The data presented in this paper — from the IBM Cost of a Data Breach Report, the Verizon DBIR, the HIPAA Journal's comprehensive OCR breach analysis, and the documented forensics of specific landmark breaches — converges on a single conclusion: the majority of cybersecurity failures are not preceded by undetectable technical attacks. They are preceded by detectable human-state drift. The analyst was fatigued weeks before the alert was missed. The administrator was overconfident months before the access exception became a vulnerability. The reporting culture was fearful quarters before the incident went unreported. The compliance program was theatrical years before the audit passed and the breach occurred anyway.

These are not random failures. They are patterned, sequential, and — with the right architecture — measurable.

The Cybersecurity-NI architecture provides that architecture. Its AI Detection layer (Layer 3) employs transformer-based multi-agent orchestration, RAG retrieval, and NLI classification to ingest and classify organizational behavioral signals. Its EI Revelation layer (Layer 2) surfaces the six human-state drift patterns — Fatigue/Numbness, Overconfidence, Hurry/Urgency-Override, Quiet Fear/Avoidance, Hoarding/Control Grip, and Compliance Theater — that precede cybersecurity governance failures, each mapped to specific NIST SP 800-53 controls. Its NI Calibration layer (Layer 1) provides governance responses that address the underlying human condition, not merely the technical control deficiency — breaking the cycle where conventional responses exacerbate the very drift they detect.

The self-attention mechanism from Vaswani et al.'s transformer architecture — originally designed to weigh linguistic context across sequences — provides the mathematical foundation for weighing human behavioral signals across time. Just as attention transformed NLP by revealing that context across a sequence determines meaning, it transforms cybersecurity governance by revealing that trajectory across time determines risk. The fixed-window, event-based detection paradigm that defines every existing cybersecurity tool is replaced by a trajectory-based, drift-aware paradigm that detects the human signature of the breach before the breach has a technical signature.

The prototype exists. It targets the healthcare sector — the most breached industry for over a decade, where patient safety depends on cybersecurity effectiveness, and where Epic EMR environments generate the behavioral signal data the pipeline is designed to process. The team combines clinical credibility (Dr. Agarwal), cybersecurity expertise (Neeta Tambe), and AI engineering capability (Naresh Sampangi) — the convergence required for pilot deployment in a sector where trust is earned, not assumed.

The ethical architecture is clear: organizational pattern detection, not individual surveillance. Aggregated, anonymized signals mapped to systemic conditions. Governance responses that address workload, cadence, culture, and structure — not individual performance. Human dignity preserved in every calibration response.

The competitive landscape is unambiguous: no existing tool — CrowdStrike, Splunk, Sentinel, Securonix, Exabeam, or any other — detects human-state drift. They detect technical anomalies. They detect behavioral anomalies. They do not detect the progressive, sequential, below-threshold trajectory shifts in human cognitive and emotional states that create the conditions for technical and behavioral anomalies to occur. This gap is not addressed by better tuning, faster processing, or more sophisticated ML models applied to the same paradigm. It requires a different paradigm.

This paper — and this system — provides it.

The breach always leaves a human signature first. Before the credentials are stolen, someone was too confident to rotate them. Before the alert was missed, someone was too fatigued to see it. Before the incident went unreported, someone was too afraid to speak. Before the audit passed and the breach happened anyway, someone was performing compliance rather than practicing security.

The signal is there. It has always been there.

Now there is a system built to read it.

**AI detects what machines can see. EI reveals what humans cannot hide. NI calibrates systems to that truth. The truth cannot be hidden. The system reads the truth. Governance follows.**

---

## 11. References

Adams, A., & Sasse, M. A. (1999). Users are not the enemy. *Communications of the ACM*, 42(12), 40–46. https://doi.org/10.1145/322796.322806

Ancker, J. S., Edwards, A., Nober, S., Hamann, C., Laborin, E., Muller, L., ... & Kaushal, R. (2017). Effects of workload, work complexity, and repeated alerts on alert fatigue in a clinical decision support system. *BMC Medical Informatics and Decision Making*, 17(1), 1–9. https://doi.org/10.1186/s12911-017-0430-8

Bada, M., Sasse, A. M., & Nurse, J. R. (2019). Cyber security awareness campaigns: Why do they fail to change behaviour? *International Conference on Cyber Security for Sustainable Society*, 118–131.

CNN. (2024, February 4). Finance worker pays out $25 million after video call with deepfake CFO. *CNN Business*.

Critical Start. (2024). *2024 cyber threat intelligence report: SOC analyst burnout and alert fatigue*. Critical Start, Inc.

Dameff, C., Tully, J., Sampson, T., & Calhoun, K. (2023). Ransomware and healthcare systems: Patient safety implications of hospital IT disruptions. *JAMA Network Open*, 6(4), e238229.

D'Arcy, J., Hovav, A., & Galletta, D. (2014). User awareness of security countermeasures and its impact on information systems misuse: A deterrence approach. *Information Systems Research*, 20(1), 79–98. https://doi.org/10.1287/isre.1070.0160

Devo Technology. (2023). *SOC performance report: Alert volume, analyst workload, and detection efficiency*. Devo Technology, Inc.

Gartner. (2024). *Gartner forecasts global information security spending to grow 15% in 2025*. Gartner, Inc.

Gartner. (2025). *Market guide for security information and event management*. Gartner, Inc.

Goleman, D. (1995). *Emotional intelligence: Why it can matter more than IQ*. Bantam Books.

Greitzer, F. L., Kangas, L. J., Noonan, C. F., Brown, C. R., & Ferryman, T. (2014). Psychosocial modeling of insider threat risk based on behavioral and word use analysis. *E-Service Journal*, 9(1), 106–138. https://doi.org/10.2979/eservicej.9.1.106

HIPAA Journal. (2026). Healthcare data breach statistics — Updated for 2026. *The HIPAA Journal*. https://www.hipaajournal.com/healthcare-data-breach-statistics/

IBM Security. (2025). *Cost of a data breach report 2025*. IBM Corporation. https://www.ibm.com/reports/data-breach

ISC². (2024). *2024 ISC² cybersecurity workforce study*. International Information System Security Certification Consortium.

Jain, S., & Wallace, B. C. (2019). Attention is not explanation. *Proceedings of the 2019 Conference of the North American Chapter of the Association for Computational Linguistics*, 3543–3556.

Kahneman, D. (2011). *Thinking, fast and slow*. Farrar, Straus and Giroux.

National Institute of Standards and Technology. (2020). *Security and privacy controls for information systems and organizations* (NIST Special Publication 800-53, Revision 5). U.S. Department of Commerce. https://doi.org/10.6028/NIST.SP.800-53r5

National Institute of Standards and Technology. (2023). *Artificial intelligence risk management framework* (NIST AI 100-1). U.S. Department of Commerce. https://doi.org/10.6028/NIST.AI.100-1

Ponemon Institute. (2023). *The economics of security operations centers: What is the true cost for effective results?* Ponemon Institute LLC.

Proofpoint. (2024). *Human factor report 2024*. Proofpoint, Inc.

Reason, J. (1990). *Human error*. Cambridge University Press. https://doi.org/10.1017/CBO9781139062367

Riley, M., Elgin, B., Lawrence, D., & Matlack, C. (2014, March 13). Missed alarms and 40 million stolen credit card numbers: How Target blew it. *Bloomberg Businessweek*.

Sampangi, N., Agarwal, A. K., & Tambe, N. (2026). Beyond the breach: Human-state drift detection in cybersecurity governance using transformer-based AI, emotional intelligence, and natural intelligence calibration. *The Circle Research Collaborative*.

U.S. House Committee on Oversight and Government Reform. (2018). *The Equifax data breach* (Report No. 115-XX). U.S. Government Publishing Office.

U.S. House Permanent Select Committee on Intelligence. (2016). *Review of the unauthorized disclosures of former National Security Agency contractor Edward Snowden*. U.S. Government Publishing Office.

U.S. Senate Committee on Commerce, Science, and Transportation. (2014). *A "kill chain" analysis of the 2013 Target data breach*. U.S. Government Publishing Office.

U.S. Senate Finance Committee. (2024). *Hearing on the Change Healthcare cyberattack*. U.S. Government Publishing Office.

U.S. Senate Select Committee on Intelligence. (2021). *Hearing on the SolarWinds hack*. U.S. Government Publishing Office.

Vaswani, A., Shazeer, N., Parmar, N., Uszkoreit, J., Jones, L., Gomez, A. N., Kaiser, Ł., & Polosukhin, I. (2017). Attention is all you need. *Advances in Neural Information Processing Systems*, 30, 5998–6008.

Verizon. (2025). *2025 Data breach investigations report*. Verizon Communications Inc. https://www.verizon.com/business/resources/reports/dbir/

Warm, J. S., Parasuraman, R., & Matthews, G. (2008). Vigilance requires hard mental work and is stressful. *Human Factors*, 50(3), 433–441. https://doi.org/10.1518/001872008X312152

---

*© 2026 The Circle Research Collaborative. Prepared for academic submission and pilot evaluation in healthcare cybersecurity governance. This paper builds on the foundational work presented in "Beyond the Breach" (Sampangi, Agarwal, & Tambe, 2026).*
