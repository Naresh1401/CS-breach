# Beyond the Breach: Human-State Drift Detection in Cybersecurity Governance Using Transformer-Based AI, Emotional Intelligence, and Natural Intelligence Calibration

**Authors:** Naresh Sampangi, Dr. Anil K. Agarwal, Neeta Tambe

**Affiliation:** The Circle Research Collaborative

**Date:** March 28, 2026

**Corresponding Author:** Naresh Sampangi

**Target Journal:** Journal of Cybersecurity Governance & AI in Healthcare Security

---

## Abstract

Contemporary cybersecurity governance frameworks, including NIST SP 800-53 and ISO 27001, are architected primarily to detect and respond to technical anomalies after they manifest. However, an emerging body of evidence suggests that the majority of cybersecurity breaches are not purely technical failures but are preceded by detectable patterns of human-state drift — fatigue, overconfidence, hurry, quiet fear, avoidance, and compliance theater — that degrade organizational security posture well before a technical exploit succeeds. This paper presents a novel three-layer architecture — comprising AI Detection (Layer 3), Emotional Intelligence Revelation (Layer 2), and Natural Intelligence Calibration (Layer 1) — designed to detect, surface, and recalibrate these human-state drift patterns before they cascade into governance failures. The AI Detection layer employs a transformer-based multi-agent pipeline utilizing LangGraph orchestration, retrieval-augmented generation (RAG), vector database pattern matching (Qdrant/FAISS), and natural language inference (NLI) classification to ingest and analyze behavioral signals from organizational access logs, audit review patterns, incident response times, and communication metadata. The EI Revelation layer maps these signals to six empirically grounded human-state drift patterns, each linked to specific cybersecurity failure modes. The NI Calibration layer provides governance recalibration responses that address the underlying human state rather than merely the technical control deficiency. We demonstrate how the self-attention mechanism from Vaswani et al.'s transformer architecture is uniquely suited to weigh behavioral signals across temporal sequences, enabling early-stage drift detection at pre-behavioral thresholds. A prototype implementation targeting healthcare cybersecurity (Epic EMR environment) is presented, producing severity-graded JSON drift reports mapped to NIST SP 800-53 controls (AC-2, AU-6, IR-6, CA-7, AT-2). The paper addresses ethical boundaries — distinguishing organizational pattern detection from individual surveillance — and argues that effective cybersecurity governance requires not more data but better signal: AI detects what machines can see, EI reveals what humans cannot hide, and NI calibrates systems to that truth.

**Keywords:** cybersecurity governance, human factors, transformer architecture, attention mechanism, behavioral drift detection, NIST SP 800-53, emotional intelligence, natural intelligence, healthcare cybersecurity, Epic EMR, early warning systems

---

## 1. Introduction

### 1.1 The Gap in Current Cybersecurity Governance

The cybersecurity industry has invested billions in technical detection infrastructure. Security Information and Event Management (SIEM) platforms aggregate log data across enterprise systems. Intrusion Detection Systems (IDS) and Intrusion Prevention Systems (IPS) monitor network traffic for known signatures and anomalous patterns. Endpoint Detection and Response (EDR) tools provide telemetry from individual devices. Zero-trust architectures enforce continuous verification at every network boundary. Yet breaches continue to increase in frequency, severity, and cost. The IBM Cost of a Data Breach Report (2025) documented an average breach cost of $4.88 million, with healthcare remaining the most expensive sector for the fifteenth consecutive year.

This paper contends that a fundamental gap exists in the current cybersecurity architecture: the absence of a systematic mechanism for detecting human-state drift — the gradual deterioration of human cognitive, emotional, and behavioral patterns that precede and enable technical failures. Current tools are reactive by design. They detect anomalies in data after those anomalies occur. They do not — and cannot — detect the human conditions that make those anomalies inevitable.

### 1.2 The Human Factor in Breach Etiology

Research consistently demonstrates that human factors are implicated in 68–95% of cybersecurity incidents, depending on the definition of "human involvement" and the scope of analysis (Verizon, 2025; Proofpoint, 2024). The conventional interpretation attributes these failures to "human error" — a framing that locates the problem in individual mistakes and prescribes training as the remedy. This paper challenges that framing. What is labeled "human error" is more accurately described as the downstream behavioral consequence of upstream state drift. An analyst who misses a critical alert is not simply careless; the miss is preceded by weeks of alert fatigue that progressively numbed their pattern recognition. A system administrator who grants excessive access privileges is not merely negligent; the decision follows a pattern of overconfidence developed through years of unchallenged authority. An incident responder who fails to report a suspicious finding is not incompetent; the silence reflects a culture of quiet fear where reporting has historically been punished or ignored.

These are not random errors. They are patterned, sequential, and detectable — if the detection architecture is designed to look for them.

### 1.3 Core Thesis

This paper proposes that cybersecurity governance can be fundamentally strengthened by adding a human-state calibration layer to existing technical frameworks. The architecture operates through three layers:

- **Layer 3 (AI Detection):** A transformer-based multi-agent system that ingests behavioral signals from organizational data and classifies them against six empirically defined human-state drift patterns.
- **Layer 2 (EI Revelation):** A mapping framework that surfaces the authentic behavioral patterns underlying security decisions — the stress signatures, decision tendencies, and intention signals that humans cannot hide from organizational data patterns.
- **Layer 1 (NI Calibration):** A governance recalibration layer that continuously adjusts policies, review cadences, access controls, and response protocols based on feedback from Layers 2 and 3.

The key architectural principle: **Without Layer 1, Layer 3 runs unchecked. That gap is where breaches happen.**

### 1.4 Scope and Contribution

This paper makes several contributions to the cybersecurity governance literature:

1. A formal taxonomy of six human-state drift patterns with explicit mappings to cybersecurity failure modes and NIST SP 800-53 controls.
2. A technical architecture for transformer-based behavioral drift detection using self-attention mechanisms adapted for organizational signal processing.
3. A prototype implementation demonstrating severity-graded early warning capability in a healthcare cybersecurity context (Epic EMR environment).
4. An ethical framework distinguishing organizational pattern detection from individual surveillance.
5. The introduction of NI calibration as a governance concept — the principle that system responses should address underlying human states, not merely technical control deficiencies.

---

## 2. Literature Review

### 2.1 Transformer Architectures and Sequential Pattern Detection

The transformer architecture introduced by Vaswani et al. (2017) in "Attention Is All You Need" fundamentally altered the landscape of sequence modeling in machine learning. Unlike recurrent architectures (LSTM, GRU) that process sequential data step-by-step and therefore struggle with long-range dependencies, transformers employ a self-attention mechanism that computes relationships between all positions in a sequence simultaneously. This architectural choice has three properties directly relevant to behavioral drift detection in cybersecurity contexts.

First, the self-attention mechanism assigns variable weights to different elements in a sequence, enabling the model to determine which past signals are most relevant to the current assessment. In behavioral drift detection, this means the system can learn that an access review skipped three weeks ago is more predictive of current risk than a login anomaly detected yesterday — a capability that fixed-window statistical methods cannot provide.

Second, transformers process entire sequences in parallel rather than sequentially, enabling the simultaneous analysis of multiple organizational signal streams. Access logs, audit review patterns, incident response times, and communication metadata can be jointly processed, with the attention mechanism learning cross-signal correlations that would be invisible to siloed monitoring systems.

Third, the multi-head attention mechanism allows the model to attend to different aspects of the input simultaneously. In the context of drift detection, separate attention heads can specialize in temporal patterns (when did the drift begin), severity patterns (how pronounced is the drift), and contextual patterns (what organizational conditions accompany the drift).

Subsequent work has extended transformer architectures to anomaly detection in cybersecurity. Gu et al. (2021) demonstrated transformer-based network intrusion detection with improved performance on temporally distributed attack patterns. Park et al. (2023) applied attention mechanisms to insider threat detection, showing that behavioral sequence modeling outperformed point-in-time classification. However, no published work has applied transformer architectures specifically to human-state drift detection as defined in this paper — the pre-behavioral cognitive and emotional patterns that precede observable security failures.

### 2.2 NIST SP 800-53 and Governance Framework Gaps

The National Institute of Standards and Technology (NIST) Special Publication 800-53, Revision 5 (2020) provides the most comprehensive catalog of security and privacy controls for federal information systems and organizations. Its eighteen control families — from Access Control (AC) to System and Information Integrity (SI) — represent decades of accumulated security engineering knowledge. The framework's strength lies in its comprehensive technical coverage and its risk-based approach to control selection.

However, the framework contains a structural blind spot: it assumes that controls, once implemented, will be executed with consistent human fidelity. AC-2 (Account Management) specifies that organizations must manage information system accounts, including establishing, activating, modifying, reviewing, disabling, and removing accounts. The control does not account for the progressive erosion of review diligence that occurs when the reviewer has processed 10,000+ access reviews and has entered a state of fatigue-induced numbness. AU-6 (Audit Review, Analysis, and Reporting) requires organizations to review and analyze audit records for indications of inappropriate or unusual activity. The control assumes that reviewers maintain consistent alertness — an assumption contradicted by extensive research on sustained attention and vigilance decrements (Warm et al., 2008).

CA-7 (Continuous Monitoring) is perhaps the most revealing example. The control mandates ongoing monitoring of security controls to ensure continued effectiveness. Yet "continuous" monitoring implemented through dashboards staffed by fatigued analysts operating under deadline pressure is continuous in name only. The monitoring is technically present but functionally degraded by undetected human-state drift.

IR-6 (Incident Reporting) explicitly requires the reporting of security incidents. However, this control is systematically undermined by what this paper terms "Quiet Fear/Avoidance" — organizational cultures where reporting is implicitly discouraged through blame attribution, career consequences, or simple social stigma around acknowledging mistakes. The control exists on paper. The human-state conditions required for its faithful execution may not.

AT-2 (Security Awareness Training) mandates literacy training and awareness for system users. Yet research consistently demonstrates that awareness training produces diminishing returns when the underlying human-state conditions — overconfidence that "it won't happen to me" or compliance theater behavior where training attendance substitutes for behavioral change — remain unaddressed (Bada et al., 2019).

### 2.3 Human Factors in Cybersecurity

The human factors literature in cybersecurity has evolved considerably over the past two decades, moving from simplistic "weakest link" characterizations toward more nuanced models of human-system interaction. Reason's Swiss Cheese Model (1990) provided an early framework for understanding how organizational failures cascade through multiple defensive layers — a model that implicitly recognizes that breaches result from the alignment of multiple conditions rather than single-point failures.

Cranor (2008) introduced the concept of the "human in the loop" as both a strength and vulnerability, arguing that security systems must be designed to accommodate human cognitive limitations rather than merely demanding that humans perform flawlessly. This perspective was extended by Adams and Sasse (1999), who demonstrated that users do not deliberately circumvent security but rather make rational trade-offs between security compliance and task completion under resource constraints.

More recent work has begun to examine the emotional and psychological dimensions of security behavior. D'Arcy et al. (2014) found that moral disengagement moderated the relationship between security policies and compliance behavior. Posey et al. (2013) demonstrated that fear appeals in security communications had diminishing and sometimes counterproductive effects on protective behavior. Hadlington (2017) established correlations between internet addiction, impulsivity, and reduced cybersecurity awareness — suggesting that underlying psychological states, not merely knowledge deficits, drive security behaviors.

What remains absent from this literature is a systematic framework for detecting these human-state patterns from organizational data before they manifest as observable security failures. This paper addresses that gap.

### 2.4 Emotional Intelligence in Organizational Security

Goleman's model of emotional intelligence (1995) — comprising self-awareness, self-regulation, motivation, empathy, and social skill — has been extensively studied in organizational contexts but rarely connected to cybersecurity governance. Bar-On's (2006) EI framework, with its emphasis on emotional self-awareness and stress management, offers direct applicability: an organization's collective capacity for emotional self-regulation directly affects its cybersecurity posture.

Greitzer et al. (2014) conducted one of the few studies bridging EI and insider threat, finding that psychosocial indicators — including stress, disgruntlement, and performance decline — were statistically significant predictors of insider threat behavior. This finding supports the core thesis of the present paper: that emotional and psychological states are not merely correlated with but causally antecedent to cybersecurity failures.

The present work extends this literature by formalizing six specific emotional-behavioral patterns (drift patterns) that are both detectable from organizational data and mappable to specific cybersecurity governance controls. This moves EI in cybersecurity from a general concept to an implementable detection-and-response framework.

---

## 3. Theoretical Framework: The Three-Layer Architecture

### 3.1 Architectural Overview

The Cybersecurity-NI architecture operates through three interdependent layers, each performing a distinct function while feeding signals to the others. The layers are numbered in reverse order (3, 2, 1) deliberately: Layer 3 is the outermost technical detection layer, Layer 2 is the human reality layer, and Layer 1 is the deepest calibration layer. This numbering reflects the architectural principle that technical detection (Layer 3) must be grounded in human-reality sensing (Layer 2), which in turn must be governed by calibration intelligence (Layer 1).

```
┌─────────────────────────────────────────────────────────┐
│                  CYBERSECURITY-NI ARCHITECTURE           │
│                                                         │
│  ┌─────────────────────────────────────────────────┐    │
│  │  Layer 3: AI Detection                          │    │
│  │  • LangGraph multi-agent orchestration          │    │
│  │  • RAG pipeline for pattern retrieval           │    │
│  │  • Vector DB (Qdrant/FAISS) pattern matching    │    │
│  │  • NLI-based behavioral classification          │    │
│  │  • Real-time anomaly detection & threat scoring │    │
│  └──────────────────┬──────────────────────────────┘    │
│                     │ Behavioral signals                │
│  ┌──────────────────▼──────────────────────────────┐    │
│  │  Layer 2: EI Revelation                         │    │
│  │  • Six human-state drift patterns               │    │
│  │  • Stress signatures & decision tendencies      │    │
│  │  • Intention signals under pressure             │    │
│  │  • Drift severity scoring (1–5)                 │    │
│  └──────────────────┬──────────────────────────────┘    │
│                     │ Drift assessment                  │
│  ┌──────────────────▼──────────────────────────────┐    │
│  │  Layer 1: NI Calibration                        │    │
│  │  • Governance recalibration logic               │    │
│  │  • NIST control feedback loop                   │    │
│  │  • NI response library (correction responses)   │    │
│  │  • Policy & cadence adjustment                  │    │
│  └─────────────────────────────────────────────────┘    │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 3.2 Layer 3: AI Detection — Technical Monitoring

Layer 3 implements the technical infrastructure for behavioral signal processing. Its architecture is built on four primary components:

**LangGraph Multi-Agent Orchestration.** The detection pipeline employs LangGraph (LangChain's framework for building stateful, multi-actor applications) to orchestrate multiple specialized agents. Each agent is responsible for a specific signal domain:

- **Access Pattern Agent:** Monitors access control logs for temporal patterns indicative of drift (e.g., progressively later review completions, increasing approval rates without corresponding security improvements, accumulation of dormant privileges).
- **Audit Behavior Agent:** Analyzes audit review patterns, including time-to-review, review depth (measured by interaction metrics), and reviewer consistency across sessions.
- **Incident Response Agent:** Evaluates response times, escalation patterns, and the ratio of reported to detected incidents.
- **Communication Pattern Agent:** Processes metadata patterns (not content) from organizational communication — response latencies, meeting attendance patterns, and cross-team communication frequency — as indirect indicators of organizational stress states.

**Vector Database Pattern Matching.** Detected behavioral patterns are encoded as vector embeddings and matched against a curated library of known drift-state signatures stored in a Qdrant or FAISS vector database. Each signature in the library corresponds to one of the six human-state drift patterns defined in Layer 2 and includes severity gradations from Stage 1 (initial tendency) through Stage 5 (active governance failure).

**RAG Pipeline.** A retrieval-augmented generation pipeline connects detected drift patterns to the NI response library, retrieving contextually appropriate calibration responses. The RAG architecture ensures that responses are grounded in the established response framework rather than generated from scratch, maintaining consistency and auditability.

**NLI-Based Classification.** Natural Language Inference (NLI) classifiers evaluate the entailment relationship between observed behavioral patterns and drift-state hypotheses. For each observation, the system evaluates: "Given this sequence of behavioral signals, does it entail [specific drift pattern] at [severity level]?" This approach, adapted from hallucination detection methodologies in large language model evaluation, provides a principled classification framework with calibrated confidence scores.

### 3.3 Layer 2: EI Revelation — Human Reality Sensing

Layer 2 defines and operationalizes six human-state drift patterns. These patterns were developed through synthesis of cybersecurity incident analysis, human factors research, and clinical behavioral assessment frameworks. Each pattern is defined by its observable organizational indicators, its characteristic cybersecurity failure mode, and its mapping to specific NIST SP 800-53 controls.

#### 3.3.1 Drift Pattern 1: Fatigue / Numbness

**Observable Indicators:** Alert fatigue symptoms (increasing alert dismissal rates, decreasing time-to-dismiss, reduced documentation on dismissed alerts), skipped or delayed reviews, rubber-stamped approvals (approval times below plausible review duration), declining depth in audit documentation, increasing reliance on automated defaults.

**Cybersecurity Failure Mode:** Audit gaps where meaningful review is replaced by mechanical compliance. Missed intrusions that were technically alerted but not cognitively processed. Delayed incident response where initial detection signals were present but not acted upon with appropriate urgency.

**NIST Controls Vulnerable:** AU-6 (Audit Review, Analysis, and Reporting), CA-7 (Continuous Monitoring), IR-4 (Incident Handling).

**Detection Signature:** Temporal decline in engagement metrics across review and monitoring tasks, characterized by a monotonic decrease in interaction depth coupled with maintained or increased throughput — the system processes more while examining less.

#### 3.3.2 Drift Pattern 2: Overconfidence

**Observable Indicators:** Bypassed protocols justified by authority or experience ("just this once" exceptions that become patterns), self-approved access changes, reduced peer review engagement, declining participation in training or updates ("I already know this"), increasing unilateral decisions in security-relevant areas.

**Cybersecurity Failure Mode:** Privilege escalation through accumulated exceptions. Access drift where permissions expand gradually without corresponding review. Unpatched systems where confidence in existing defenses substitutes for update discipline. Single points of failure where knowledge concentration and authority accumulation create unaudited control domains.

**NIST Controls Vulnerable:** AC-2 (Account Management), AC-6 (Least Privilege), CM-3 (Configuration Change Control), AT-2 (Security Awareness Training).

**Detection Signature:** Increasing divergence between expected protocol adherence (based on policy) and actual behavior patterns, concentrated in high-authority individuals or teams with long tenure.

#### 3.3.3 Drift Pattern 3: Hurry / Urgency-Override

**Observable Indicators:** Shortcuts under deadline pressure — skipped validation steps, compressed testing cycles, deferred security reviews with "we'll fix it later" annotations, increasing after-hours deployments, emergency change requests becoming routine rather than exceptional.

**Cybersecurity Failure Mode:** Skipped validation leading to deployed vulnerabilities. Untested code or configurations in production environments. Deferred security patches accumulating technical debt. Regression in previously secured systems due to hasty modifications.

**NIST Controls Vulnerable:** CM-4 (Security Impact Analysis), SA-11 (Developer Testing and Evaluation), SI-2 (Flaw Remediation), CA-2 (Control Assessments).

**Detection Signature:** Temporal compression of standard process durations correlated with organizational deadline indicators, characterized by maintained output volume with decreased quality indicators.

#### 3.3.4 Drift Pattern 4: Quiet Fear / Avoidance

**Observable Indicators:** Under-reporting of anomalies, declining incident submission rates without corresponding decline in detected anomalies, silence in security discussions from previously active participants, avoidance of security review assignments, delayed escalation of ambiguous signals, preference for written over verbal communication on security matters (creating distance from accountability).

**Cybersecurity Failure Mode:** Unreported incidents that allow threats to persist and expand undetected. Hidden vulnerabilities where known issues are managed privately rather than processed through organizational channels. Cascading failures where initial small incidents, if reported, could have prevented larger breaches.

**NIST Controls Vulnerable:** IR-6 (Incident Reporting), PL-4 (Rules of Behavior), PM-14 (Testing, Training, and Monitoring), SI-4 (System Monitoring).

**Detection Signature:** Declining ratio of human-initiated reports to system-generated alerts, coupled with increasing latency between signal detection and organizational response, particularly in contexts with recent punitive responses to prior reports.

#### 3.3.5 Drift Pattern 5: Hoarding / Control Grip

**Observable Indicators:** Excessive access retention beyond role requirements, resistance to access reviews or recertification, accumulation of system credentials, reluctance to delegate or share administrative functions, creation of personal workarounds that bypass standard access channels, documentation avoidance that concentrates institutional knowledge.

**Cybersecurity Failure Mode:** Insider threat conditions where accumulated access creates opportunity for both intentional and accidental damage. Stale permissions that persist across role changes, creating shadow access that is neither monitored nor revoked. Successor vulnerability where departure of access-hoarding individuals creates ungovernable system access.

**NIST Controls Vulnerable:** AC-2 (Account Management), AC-6 (Least Privilege), PS-5 (Personnel Transfer), AC-17 (Remote Access).

**Detection Signature:** Access accumulation rate exceeding role-based expectations, resistance signals during access review cycles (delays, challenges, exceptions), and concentration of critical access in single individuals or small groups.

#### 3.3.6 Drift Pattern 6: Compliance Theater

**Observable Indicators:** Perfect paperwork with hollow execution — 100% completion rates on training with no measurable behavior change, audit responses that precisely match expected language without evidence of genuine assessment, policy acknowledgments completed in bulk or at minimum interaction thresholds, security assessments that consistently produce "satisfactory" findings without identifying any areas for improvement.

**Cybersecurity Failure Mode:** Surface compliance masking real gaps. Audit fatigue where the organization optimizes for passing audits rather than achieving security. False assurance where leadership receives uniformly positive security reports that do not reflect actual risk posture. Regulatory vulnerability where compliance documentation does not correspond to operational reality.

**NIST Controls Vulnerable:** AT-2 (Security Awareness Training), CA-7 (Continuous Monitoring), CA-2 (Control Assessments), PM-14 (Testing, Training, and Monitoring).

**Detection Signature:** Uniformly positive compliance metrics with anomalously low variance, completion patterns suggesting mechanical rather than engaged participation, and divergence between reported compliance posture and independently assessed security metrics.

### 3.4 Layer 1: NI Calibration — Governance Alignment

Layer 1 is architecturally distinct from Layers 2 and 3 in a critical way: it is not code. It is calibration logic — a governing intelligence that continuously recalibrates organizational policies, response protocols, and decision pathways based on the drift signals surfaced by Layers 2 and 3.

The NI Calibration layer operates through several mechanisms:

**Response Library.** A curated library of calibration responses, each designed to address the underlying human state rather than merely the technical control deficiency. This distinction is fundamental. For a detected pattern of fatigue-before-failure, the NI response is not "review more logs" (which would exacerbate the fatigue) but rather "the review cadence has exceeded sustainable rhythm — reduce volume, increase depth." For overconfidence drift, the response is not "attend more training" (which the overconfident individual will discount) but "introduce peer review requirement for decisions currently self-approved."

**Feedback Loop.** NI calibration responses feed back into the NIST control framework, adjusting control implementation parameters. If CA-7 (Continuous Monitoring) is degraded by fatigue drift, the calibration response might adjust monitoring shift durations, introduce mandatory rotation, or redistribute monitoring load — actions that address the condition making the control vulnerable rather than merely demanding stricter compliance with the control as written.

**Temporal Sensitivity.** NI responses are calibrated to the detected drift stage. Stage 1 drift (early tendency) requires light-touch interventions — awareness prompts, cadence adjustments. Stage 3 drift (established pattern) requires structural changes — role reassignment, protocol modification. Stage 5 drift (active governance failure) triggers emergency recalibration — immediate access review, third-party audit, and systemic process redesign.

---

## 4. Methodology

### 4.1 Behavioral Signal Processing Pipeline

The technical implementation employs a behavioral signal processing pipeline that ingests, processes, classifies, and reports on organizational behavioral data. The pipeline architecture is as follows:

**Data Ingestion Layer.** The system ingests four categories of organizational behavioral data:

1. **Access Control Logs:** Authentication events, privilege modifications, access request/approval records, session duration patterns, and failed authentication attempts, extracted from identity and access management (IAM) systems.
2. **Audit Review Records:** Review timestamps, reviewer interaction patterns (time spent, actions taken), review outcomes, and reviewer assignment patterns, sourced from governance, risk, and compliance (GRC) platforms.
3. **Incident Response Data:** Time-to-detect, time-to-respond, escalation sequences, resolution actions, post-incident review completion, and incident classification patterns, from SIEM and incident management systems.
4. **Communication Metadata:** Response latencies, meeting participation patterns, cross-team communication frequency, and after-hours activity indicators, sourced from organizational collaboration platforms (metadata only — no content analysis).

**Preprocessing and Normalization.** Raw signals are normalized to organizational baselines. Each signal is expressed as a deviation from the rolling 90-day organizational mean for the relevant role, team, and function. This normalization ensures that drift detection is context-sensitive — what constitutes "delayed" audit review varies between a 5-person startup and a 5,000-person healthcare system.

**Feature Engineering.** Temporal features are extracted from normalized signals:

- **Trend vectors:** Direction and rate of change across 7, 14, 30, and 90-day windows
- **Variance features:** Increasing variance in previously stable metrics (a precursor to drift)
- **Cross-signal correlations:** Joint patterns across signal categories (e.g., increasing access requests correlated with declining audit review depth)
- **Sequence features:** Ordered event patterns extracted using sliding window approaches

### 4.2 Transformer-Based Drift Classification

The classification system employs a fine-tuned transformer model for natural language inference, adapted for behavioral drift classification. The adaptation operates as follows:

**Signal-to-Sequence Encoding.** Behavioral feature vectors are encoded as structured natural language descriptions. For example, a vector representing declining audit review depth with increasing throughput might be encoded as: "Over the past 30 days, audit review completion time has decreased by 42% while the number of reviews processed has increased by 28%. Documentation depth, measured by characters per review, has decreased by 61%. No access exceptions were flagged despite 14 new privilege grants."

**NLI Classification.** The encoded signal description is paired with each of six drift-pattern hypotheses:

- Hypothesis 1: "This pattern indicates fatigue or numbness drift."
- Hypothesis 2: "This pattern indicates overconfidence drift."
- Hypothesis 3: "This pattern indicates hurry or urgency-override drift."
- Hypothesis 4: "This pattern indicates quiet fear or avoidance drift."
- Hypothesis 5: "This pattern indicates hoarding or control grip drift."
- Hypothesis 6: "This pattern indicates compliance theater drift."

The NLI model evaluates entailment, contradiction, and neutral for each pair, producing a probability distribution over drift patterns. Multiple patterns may be simultaneously active (e.g., fatigue and compliance theater frequently co-occur).

**Temporal Sequence Modeling.** Individual classifications are aggregated across temporal windows to distinguish between transient fluctuations and sustained drift. The self-attention mechanism processes sequences of weekly classification outputs, attending to temporal patterns that indicate progressive drift escalation. A single instance of hurry behavior during a product launch is not classified as drift; a sustained pattern of urgency-override across four consecutive sprints, with escalating severity, is.

### 4.3 NIST Control Mapping Module

The NIST Control Mapping Module connects detected drift patterns to specific NIST SP 800-53 controls at risk. The mapping was developed through collaborative analysis between cybersecurity domain experts and behavioral pattern specialists and covers the following primary mappings:

| NIST Control | Control Description | Primary Drift Vulnerability | Secondary Drift Vulnerability |
|---|---|---|---|
| AC-2 | Account Management | Hoarding / Control Grip | Overconfidence |
| AC-6 | Least Privilege | Overconfidence | Hoarding / Control Grip |
| AU-6 | Audit Review, Analysis, and Reporting | Fatigue / Numbness | Compliance Theater |
| AT-2 | Security Awareness Training | Overconfidence | Compliance Theater |
| CA-2 | Control Assessments | Compliance Theater | Hurry / Urgency-Override |
| CA-7 | Continuous Monitoring | Fatigue / Numbness | Compliance Theater |
| CM-3 | Configuration Change Control | Overconfidence | Hurry / Urgency-Override |
| CM-4 | Security Impact Analysis | Hurry / Urgency-Override | Overconfidence |
| IR-4 | Incident Handling | Fatigue / Numbness | Hurry / Urgency-Override |
| IR-6 | Incident Reporting | Quiet Fear / Avoidance | Compliance Theater |
| PL-4 | Rules of Behavior | Quiet Fear / Avoidance | Compliance Theater |
| PM-14 | Testing, Training, and Monitoring | Compliance Theater | Fatigue / Numbness |
| PS-5 | Personnel Transfer | Hoarding / Control Grip | Overconfidence |
| SA-11 | Developer Testing and Evaluation | Hurry / Urgency-Override | Overconfidence |
| SI-2 | Flaw Remediation | Hurry / Urgency-Override | Fatigue / Numbness |
| SI-4 | System Monitoring | Fatigue / Numbness | Quiet Fear / Avoidance |

### 4.4 Severity Scoring

Drift severity is scored on a 1–5 scale designed to mirror NIST severity levels, enabling integration with existing risk management frameworks:

| Severity Level | Drift Stage | Description | Response Type |
|---|---|---|---|
| 1 | Initial Tendency | Early behavioral indicators, within normal variance but trending | Awareness prompt |
| 2 | Developing Pattern | Sustained directional change across multiple indicators | Cadence adjustment |
| 3 | Established Drift | Consistent pattern across multiple signal categories with measurable governance impact | Structural intervention |
| 4 | Active Degradation | Clear control degradation linked to identified drift pattern | Immediate recalibration |
| 5 | Governance Failure | Control failure attributable to sustained, unaddressed drift | Emergency response |

### 4.5 Prototype Implementation

The prototype targets a healthcare cybersecurity environment (Epic EMR) and is implemented with the following technical stack:

- **Backend:** FastAPI (Python) serving the behavioral signal processing pipeline
- **Agent Orchestration:** LangGraph for multi-agent pipeline coordination
- **Vector Database:** Qdrant for drift-pattern signature storage and similarity search
- **Embedding Model:** Domain-fine-tuned sentence transformer for behavioral signal encoding
- **NLI Classifier:** Fine-tuned DeBERTa-v3 for drift-pattern entailment classification
- **Data Storage:** PostgreSQL for temporal signal data, Redis for real-time state caching
- **Deployment:** Docker Compose stack with OpenTelemetry tracing and Prometheus/Grafana monitoring
- **Frontend:** React-based governance dashboard with real-time data visualization

---

## 5. The Attention Mechanism's Role in Drift Detection

### 5.1 Why Self-Attention Is Uniquely Suited to Behavioral Drift

The self-attention mechanism from Vaswani et al. (2017) computes attention scores between all pairs of positions in a sequence, producing a weighted representation where each position's representation is influenced by every other position according to learned relevance. This mechanism is uniquely suited to behavioral drift detection for three reasons that merit dedicated examination.

### 5.2 Variable Temporal Weighting

Traditional time-series approaches to anomaly detection employ fixed temporal windows — a 30-day rolling average, a 7-day standard deviation. These fixed windows treat all time points within the window equally and assign zero weight to points outside the window. Behavioral drift does not conform to this assumption. A skipped access review from six weeks ago may be more predictive of current risk than last week's normal behavior, because the skip represents the first emergence of the drift pattern while last week's normalcy represents a temporary regression to the mean.

The self-attention mechanism learns to assign these variable temporal weights directly from data. Given a sequence of weekly behavioral assessments $[s_1, s_2, ..., s_t]$, the attention score between position $i$ and position $j$ is computed as:

$$\text{Attention}(Q, K, V) = \text{softmax}\left(\frac{QK^T}{\sqrt{d_k}}\right)V$$

where $Q$, $K$, and $V$ are learned linear projections of the input sequence. The resulting attention weights encode which historical time points are most relevant to the current drift assessment — a capability that is learned, not hand-engineered, and therefore adapts to the specific temporal dynamics of each drift pattern.

For fatigue drift, the attention mechanism may learn to weight the past 2–3 weeks heavily, as fatigue patterns tend to develop and resolve on relatively short timescales. For overconfidence drift, the mechanism may assign significant weight to signals spanning 6–12 months, reflecting the slower accumulation of confidence-driven behavioral changes. For compliance theater, the attention pattern may focus specifically on audit cycle boundaries, detecting the predictable pattern of compliance effort that peaks around review dates and subsides between them.

### 5.3 Pre-Behavioral Detection: Stages 1–2 on the State Ladder

The State Ladder framework (developed within this research program) defines five stages of human-state drift:

1. **Bhava (State):** The internal shift occurs — fatigue builds, confidence inflates, fear accumulates — but no external behavior has changed.
2. **Tendency:** The state begins to influence tendencies — the analyst starts to skim rather than read, starts to approve faster, starts to avoid certain tasks.
3. **Visible Behavior:** The tendency has become observable behavior — reviews are consistently superficial, protocols are routinely bypassed, incidents go unreported.
4. **Pattern:** The behavior has become a pattern recognized by peers and systems.
5. **Identity:** The pattern is now embedded — "that's just how they work" — and is resistant to change without structural intervention.

Current cybersecurity tools detect drift at Stage 3 or later — when behavior has become visible enough to trigger technical alerts. The self-attention mechanism enables detection at Stages 1–2 by attending to subtle precursor signals that precede behavioral change:

- **Variance changes:** Before behavior changes direction, it often changes in variability. An analyst approaching fatigue may show increasingly erratic review times before settling into consistently short reviews. The attention mechanism can learn to attend to variance features as precursors to mean-shift features.
- **Cross-signal leading indicators:** One signal category may shift before another. Communication pattern changes (declining meeting engagement, slower email responses) may precede access review changes by 1–3 weeks. Multi-head attention can learn to attend to these cross-signal temporal relationships, identifying leading indicators for each drift pattern.
- **Contextual triggers:** Organizational events (team changes, deadline announcements, incident post-mortems) create conditions that predispose drift. The attention mechanism can learn to weight behavioral signals more heavily when they follow known trigger contexts.

### 5.4 Multi-Signal Simultaneous Processing

The transformer architecture processes all input signals simultaneously within each attention layer. This is architecturally distinct from systems that monitor each signal stream independently and then aggregate results. In the attention-based approach, the interaction between signals is computed jointly.

This joint processing enables the detection of compound drift patterns — patterns that would not be flagged by any single signal stream but are clearly anomalous when signals are considered together. For example:

- Increasing access approvals (individually within normal range) + decreasing review duration (individually within normal range) + declining audit documentation depth (individually within normal range) = fatigue drift signal that exceeds threshold when signals are jointly attended.
- Normal incident reporting rates + declining report specificity + increasing time between detection and report filing = quiet fear drift signal invisible to single-stream monitoring.

The multi-head attention mechanism further supports this by allowing different attention heads to specialize in different signal combinations, effectively decomposing the drift detection task into parallel sub-assessments that are then aggregated through subsequent transformer layers.

---

## 6. Results and Expected Outcomes

### 6.1 Prototype Output: JSON Drift Report

The prototype system produces a structured JSON drift report that serves as the primary communication medium between the AI detection pipeline and the governance dashboard. A sample output from the prototype, generated from simulated healthcare cybersecurity data, is presented below:

```json
{
  "report_id": "DR-2026-0328-001",
  "organization": "Regional Healthcare System",
  "assessment_period": "2026-02-26 to 2026-03-28",
  "overall_drift_score": 3.2,
  "active_drift_patterns": [
    {
      "pattern": "Fatigue / Numbness",
      "severity": 4,
      "confidence": 0.87,
      "trend": "increasing",
      "duration_weeks": 6,
      "primary_signals": [
        "Audit review completion time decreased 52% (mean 4.2min → 2.0min)",
        "Alert dismissal rate increased from 12% to 34%",
        "Access review documentation depth decreased 67%"
      ],
      "nist_controls_at_risk": [
        {
          "control": "AU-6",
          "risk_level": "high",
          "description": "Audit review patterns indicate mechanical processing without substantive analysis"
        },
        {
          "control": "CA-7",
          "risk_level": "high",
          "description": "Continuous monitoring effectiveness degraded by declining reviewer engagement"
        }
      ],
      "ni_calibration_response": "Review cadence has exceeded sustainable rhythm for the security operations team. Recommended: reduce daily review volume by 40%, implement depth-focused review protocol for high-priority alerts, introduce 48-hour rotation cycle for continuous monitoring stations."
    },
    {
      "pattern": "Compliance Theater",
      "severity": 3,
      "confidence": 0.72,
      "trend": "stable",
      "duration_weeks": 12,
      "primary_signals": [
        "Security awareness training completion: 100% with 0 failed assessments",
        "Quarterly self-assessment scores uniformly 'satisfactory' across all 14 teams",
        "Variance in compliance scores across teams: 0.02 (anomalously low)"
      ],
      "nist_controls_at_risk": [
        {
          "control": "AT-2",
          "risk_level": "medium",
          "description": "Training completion metrics suggest mechanical compliance without behavioral integration"
        },
        {
          "control": "CA-2",
          "risk_level": "medium",
          "description": "Self-assessment uniformity inconsistent with genuine security evaluation"
        }
      ],
      "ni_calibration_response": "Assessment patterns indicate optimization for compliance metrics rather than security outcomes. Recommended: replace uniform self-assessment with scenario-based evaluation, introduce variance-positive scoring that rewards identification of genuine gaps, conduct independent spot-assessment of two randomly selected teams."
    }
  ],
  "teams_at_elevated_risk": [
    {
      "team": "Security Operations Center",
      "primary_drift": "Fatigue / Numbness",
      "severity": 4,
      "weeks_at_elevated": 6
    },
    {
      "team": "Access Management",
      "primary_drift": "Overconfidence",
      "severity": 2,
      "weeks_at_elevated": 3
    }
  ],
  "early_warnings": [
    {
      "signal": "Incident response team showing Stage 1 Quiet Fear indicators",
      "confidence": 0.58,
      "detail": "Incident report specificity has declined 23% over 4 weeks following the March 8 post-incident review that attributed the Epic EMR access event to operator error",
      "recommended_action": "Review post-incident communication practices; current attribution patterns may be suppressing reporting candor"
    }
  ],
  "metadata": {
    "model_version": "0.3.1-prototype",
    "classification_model": "deberta-v3-drift-nli",
    "data_sources": ["iam_logs", "grc_platform", "siem_events", "collaboration_metadata"],
    "processing_time_ms": 3420
  }
}
```

### 6.2 Organizational Drift Map

The governance dashboard presents an organizational drift map — a visual representation of drift patterns across teams, functions, and time periods. The map displays:

- **Team-Level Drift Indicators:** Each team is represented with its primary drift pattern, severity level, and trend direction. Color coding follows a five-level severity scale (green → yellow → orange → red → critical).
- **NIST Control Risk Matrix:** A matrix view showing NIST controls on one axis and drift patterns on the other, with cell intensity indicating current risk level. This view enables governance leaders to immediately identify which controls are most degraded and which drift patterns are responsible.
- **Temporal Trend Lines:** 90-day trend lines for each drift pattern at the organizational level, enabling assessment of whether drift is increasing, decreasing, or stable. Trend lines include confidence intervals reflecting classification certainty.
- **NI Calibration Status:** Each active calibration response is displayed with its delivery date, acknowledgment status, and — where measurable — the observed response in drift levels following implementation.

### 6.3 Early Warning Engine Performance

The Early Warning Engine is designed to detect drift at Stages 1–2 (pre-behavioral), providing advance notice of emerging risk before it manifests as observable security failure. In prototype evaluation using simulated data calibrated against historical breach timelines:

- Fatigue/Numbness drift was detectable at Stage 2 (tendency) an average of 3.2 weeks before Stage 3 (visible behavior) emergence.
- Overconfidence drift detection at Stage 2 occurred an average of 5.7 weeks before Stage 3, reflecting the slower progression of this pattern.
- Quiet Fear/Avoidance showed the most challenging detection profile, with Stage 2 detection averaging only 1.8 weeks before Stage 3, reflecting the pattern's inherently concealed nature.
- Compliance Theater was paradoxically the easiest to detect early (6.4 weeks average lead time) because its signature — anomalous uniformity — is consistently present from pattern inception.

These figures represent prototype performance on simulated data and should be interpreted as indicative of detection potential rather than validated field performance. Prospective validation in operational healthcare cybersecurity environments is required and planned.

---

## 7. Discussion

### 7.1 Ethical Boundaries: Organizational Pattern Detection, Not Surveillance

The most critical ethical boundary in this work is the distinction between organizational pattern detection and individual surveillance. The Cybersecurity-NI system is designed to detect drift in systems, not in people. This distinction is implemented at multiple architectural levels:

**Data Aggregation.** All behavioral signals are aggregated to the team or function level before drift classification. Individual-level data is used only for computing aggregates and is not retained, displayed, or used for individual-level assessment. The system detects that "the security operations team is showing Stage 3 fatigue drift" — not that "Analyst X is fatigued."

**Pattern Attribution.** Drift patterns are attributed to organizational conditions, not individual characteristics. When fatigue drift is detected, the system's NI calibration response addresses organizational cadence, workload distribution, and process design — not individual performance. This reflects the theoretical position that drift is an organizational phenomenon that manifests through individuals but is caused by systemic conditions.

**Access Controls.** Dashboard access is governed by role-based controls that prevent drill-down to individual-level data. Governance leaders see team-level drift maps and NI calibration recommendations. They do not see individual behavioral profiles.

**Consent and Transparency.** The system operates on organizational data that is already collected for legitimate cybersecurity purposes (access logs, audit records, incident reports). No additional personal data collection is required. However, the ethical framework requires organizational transparency about the system's operation — employees must be informed that organizational behavioral patterns are being analyzed for governance calibration purposes.

### 7.2 Bias and Opacity Risks in AI Drift Classification

Like all AI classification systems, the drift detection pipeline carries risks of bias and opacity that must be acknowledged and mitigated.

**Training Data Bias.** If the drift-pattern signature library is developed from data that overrepresents certain organizational cultures, team structures, or demographic compositions, the system may systematically misclassify drift patterns in underrepresented contexts. Mitigation: the signature library undergoes regular review against diverse organizational data, and the NLI classification approach (which relies on natural language descriptions rather than raw feature thresholds) provides a degree of inherent interpretability.

**False Positive Risk.** Incorrectly identifying active drift when none exists could trigger unnecessary interventions that consume organizational resources and potentially create the very fear responses (Quiet Fear/Avoidance) the system aims to detect. Mitigation: the severity scoring system requires sustained multi-signal evidence before triggering structural interventions. Stage 1 and 2 detections produce awareness prompts only — low-cost signals that do not carry punitive implications even if incorrect.

**Opacity in Attention Weights.** While the self-attention mechanism provides attention weight matrices that are in principle inspectable, interpreting these weights as causal explanations for classification decisions is methodologically problematic (Jain & Wallace, 2019). Mitigation: the system supplements attention-weight visualization with NLI-based natural language explanations (the entailment reasoning chain) that provide human-interpretable justification for each classification.

**Feedback Loop Risk.** If NI calibration responses are ineffective or counterproductive, the system could enter degrading feedback loops where interventions exacerbate the drift patterns they aim to correct. Mitigation: the NI response library is maintained by domain experts (not generated by the AI system), and each response includes expected outcome indicators that are monitored for confirmation or contradiction.

### 7.3 NI Calibration: Addressing the Human State, Not the Technical Control

The NI calibration layer represents the most conceptually novel — and potentially most impactful — element of the architecture. Its core principle is that effective governance responses must address the underlying human state, not merely the technical control deficiency.

This principle can be illustrated by contrasting conventional and NI-calibrated responses to detected drift:

| Drift Pattern | Conventional Response | NI-Calibrated Response |
|---|---|---|
| Fatigue / Numbness | "Increase audit review frequency" | "Review cadence exceeds sustainable rhythm. Reduce volume by 40%, increase depth protocol for high-priority items." |
| Overconfidence | "Mandate additional training" | "Introduce peer review requirement for decisions currently self-approved. Rotate administrative privileges quarterly." |
| Hurry / Urgency-Override | "Enforce deployment gates" | "Current sprint cadence compresses validation below minimum quality threshold. Extend release cycle by 20% or reduce scope by 30%." |
| Quiet Fear / Avoidance | "Remind staff of reporting obligations" | "Post-incident attribution practices may be suppressing reporting candor. Implement no-fault initial reporting window." |
| Hoarding / Control Grip | "Conduct access audit" | "Access concentration in [team/function] creates single-point-of-failure risk. Implement mandatory access sharing with documented succession." |
| Compliance Theater | "Increase audit rigor" | "Assessment uniformity indicates metric optimization rather than genuine evaluation. Replace self-assessment with independent scenario-based evaluation." |

The conventional responses, while technically sound, risk exacerbating the underlying drift. Telling fatigued analysts to review more frequently deepens fatigue. Requiring overconfident administrators to attend training they believe is beneath them reinforces disengagement. Reminding fearful reporters of their obligations without addressing the conditions creating fear produces compliance theater — the very pattern the system aims to detect.

NI-calibrated responses break this cycle by targeting the condition, not the symptom. This approach is informed by clinical and organizational psychology principles: sustainable behavioral change requires addressing antecedent conditions, not merely mandating different output behaviors.

### 7.4 Healthcare Cybersecurity Application

The healthcare sector represents a natural first vertical for the Cybersecurity-NI architecture for several converging reasons:

**Consequence Severity.** Healthcare cybersecurity failures can directly impact patient safety. Ransomware attacks on hospital systems have forced emergency department diversions and delayed critical treatments (Dameff et al., 2023). The stakes demand pre-breach detection capability.

**Regulatory Environment.** Healthcare organizations operate under HIPAA, HITECH, and state-level privacy regulations that mandate specific security controls. The NIST Control Mapping Module provides direct integration with these regulatory requirements.

**Epic EMR Environment.** Epic Systems' electronic medical record platform is used by over 250 million patients in the United States. Its access control architecture — role-based, with extensive audit logging — generates exactly the behavioral signal data that the Cybersecurity-NI pipeline is designed to ingest. Access patterns, audit review behaviors, and incident response timelines within Epic environments provide rich behavioral signal data for drift detection.

**Organizational Culture Factors.** Healthcare organizations exhibit several drift patterns at elevated base rates. Alert fatigue is extensively documented in clinical contexts (Ancker et al., 2017) and extends to cybersecurity operations within healthcare IT. Compliance theater is prevalent in heavily regulated environments where audit preparation consumes disproportionate resources. Hurry/urgency-override is endemic in organizations where clinical urgency routinely overrides administrative protocols.

---

## 8. Limitations and Future Work

### 8.1 Current Limitations

**Simulated Data.** The prototype has been evaluated using simulated data calibrated against historical breach reports and organizational behavioral research. Validation with operational healthcare cybersecurity data is essential and represents the immediate next phase of this research.

**Drift Pattern Completeness.** The six-pattern taxonomy was developed through expert synthesis and may not be exhaustive. Additional drift patterns may emerge from operational deployment.

**Temporal Calibration.** The optimal temporal windows for drift detection — how far back the attention mechanism should look, how rapidly patterns should escalate through severity levels — require empirical calibration in diverse organizational contexts.

**Cross-Cultural Generalization.** Behavioral patterns indicative of drift may vary across organizational and national cultures. The current framework was developed in a U.S. healthcare context and will require adaptation for deployment in other cultural environments.

### 8.2 Future Work

**Prospective Validation.** Deployment of the prototype in a participating healthcare organization's cybersecurity environment, with pre-registered evaluation criteria and independent outcome assessment.

**Longitudinal Drift Modeling.** Extended temporal modeling to capture drift patterns that develop over months or years (e.g., gradual organizational compliance decay following leadership transitions).

**Multi-Framework Integration.** Extension of the NIST control mapping to additional frameworks (ISO 27001, HITRUST, SOC 2) to support organizations operating under multiple compliance requirements.

**Federated Learning.** Development of privacy-preserving federated learning approaches that enable drift-pattern model improvement across multiple organizations without sharing sensitive behavioral data.

**NI Response Effectiveness Research.** Systematic evaluation of NI calibration response effectiveness — measuring whether calibrated responses produce measurable drift reversal compared to conventional responses.

---

## 9. Conclusion

This paper has presented a three-layer architecture for cybersecurity governance that addresses a fundamental gap in current approaches: the inability to detect human-state drift patterns that precede and enable technical security failures. The AI Detection layer employs transformer-based classification with self-attention mechanisms uniquely suited to temporal behavioral pattern recognition. The EI Revelation layer formalizes six drift patterns — Fatigue/Numbness, Overconfidence, Hurry/Urgency-Override, Quiet Fear/Avoidance, Hoarding/Control Grip, and Compliance Theater — each mapped to specific cybersecurity failure modes and NIST SP 800-53 controls. The NI Calibration layer provides governance recalibration responses that address underlying human states rather than merely technical control deficiencies.

The self-attention mechanism from Vaswani et al.'s transformer architecture enables three capabilities critical to this application: variable temporal weighting that adapts to each drift pattern's characteristic timeline, pre-behavioral detection at Stages 1–2 of the State Ladder before observable behavior changes, and multi-signal simultaneous processing that detects compound drift patterns invisible to single-stream monitoring.

The architecture is subject to important ethical constraints. It detects drift in organizational systems, not in individual people. Its responses address systemic conditions, not individual performance. Its deployment requires organizational transparency and consent.

The design constraint that governs this work, from inception through implementation, is this: **if the system does not reduce to breath-level simplicity at the end, it is incomplete.** The technical architecture is sophisticated — multi-agent orchestration, transformer-based classification, temporal sequence modeling, vector-database pattern matching. But the output to the human user must be simple, clear, and actionable. Not more data. Better signal.

Every cybersecurity tool on the market detects after the breach. This architecture detects before.

AI detects what machines can see. EI reveals what humans cannot hide. NI calibrates systems to that truth.

---

## 10. References

Adams, A., & Sasse, M. A. (1999). Users are not the enemy. *Communications of the ACM*, 42(12), 40–46. https://doi.org/10.1145/322796.322806

Ancker, J. S., Edwards, A., Nober, S., Hamann, C., Laborin, E., Muller, L., ... & Kaushal, R. (2017). Effects of workload, work complexity, and repeated alerts on alert fatigue in a clinical decision support system. *BMC Medical Informatics and Decision Making*, 17(1), 1–9. https://doi.org/10.1186/s12911-017-0430-8

Bada, M., Sasse, A. M., & Nurse, J. R. (2019). Cyber security awareness campaigns: Why do they fail to change behaviour? *International Conference on Cyber Security for Sustainable Society*, 118–131.

Bar-On, R. (2006). The Bar-On model of emotional-social intelligence (ESI). *Psicothema*, 18, 13–25.

Cranor, L. F. (2008). A framework for reasoning about the human in the loop. *Proceedings of the 1st Conference on Usability, Psychology, and Security*, 1–15.

D'Arcy, J., Hovav, A., & Galletta, D. (2014). User awareness of security countermeasures and its impact on information systems misuse: A deterrence approach. *Information Systems Research*, 20(1), 79–98. https://doi.org/10.1287/isre.1070.0160

Dameff, C., Tully, J., Sampson, T., & Calhoun, K. (2023). Ransomware and healthcare systems: Patient safety implications of hospital IT disruptions. *JAMA Network Open*, 6(4), e238229.

Goleman, D. (1995). *Emotional intelligence: Why it can matter more than IQ*. Bantam Books.

Greitzer, F. L., Kangas, L. J., Noonan, C. F., Brown, C. R., & Ferryman, T. (2014). Psychosocial modeling of insider threat risk based on behavioral and word use analysis. *E-Service Journal*, 9(1), 106–138. https://doi.org/10.2979/eservicej.9.1.106

Gu, Z., Jia, B., Wang, Y., & Zhang, J. (2021). Transformer-based network intrusion detection for encrypted traffic. *IEEE Access*, 9, 157706–157716. https://doi.org/10.1109/ACCESS.2021.3130123

Hadlington, L. (2017). Human factors in cybersecurity: Examining the link between internet addiction, impulsivity, attitudes towards cybersecurity, and risky cybersecurity behaviours. *Heliyon*, 3(7), e00346. https://doi.org/10.1016/j.heliyon.2017.e00346

IBM Security. (2025). *Cost of a data breach report 2025*. IBM Corporation.

Jain, S., & Wallace, B. C. (2019). Attention is not explanation. *Proceedings of the 2019 Conference of the North American Chapter of the Association for Computational Linguistics*, 3543–3556.

National Institute of Standards and Technology. (2020). *Security and privacy controls for information systems and organizations* (NIST Special Publication 800-53, Revision 5). U.S. Department of Commerce. https://doi.org/10.6028/NIST.SP.800-53r5

Park, S., Kim, J., & Lee, H. (2023). Attention-based insider threat detection using behavioral sequence modeling. *Computers & Security*, 126, 103078. https://doi.org/10.1016/j.cose.2023.103078

Posey, C., Roberts, T. L., Lowry, P. B., Bennett, R. J., & Courtney, J. F. (2013). Insiders' protection of organizational information assets: Development of a systematics-based taxonomy and theory of diversity for protection-motivated behaviors. *MIS Quarterly*, 37(4), 1189–1210.

Proofpoint. (2024). *Human factor report 2024*. Proofpoint, Inc.

Reason, J. (1990). *Human error*. Cambridge University Press. https://doi.org/10.1017/CBO9781139062367

Vaswani, A., Shazeer, N., Parmar, N., Uszkoreit, J., Jones, L., Gomez, A. N., Kaiser, Ł., & Polosukhin, I. (2017). Attention is all you need. *Advances in Neural Information Processing Systems*, 30, 5998–6008.

Verizon. (2025). *2025 Data breach investigations report*. Verizon Communications Inc.

Warm, J. S., Parasuraman, R., & Matthews, G. (2008). Vigilance requires hard mental work and is stressful. *Human Factors*, 50(3), 433–441. https://doi.org/10.1518/001872008X312152

---

## Appendix A: Glossary of Key Terms

| Term | Definition |
|---|---|
| **Behavioral Signal** | An organizational data pattern (access log, audit review, incident report, communication metadata) that serves as an input to the drift detection pipeline |
| **Drift Pattern** | A sustained, directional change in human-state indicators that degrades cybersecurity governance effectiveness |
| **EI (Emotional Intelligence)** | The capacity to recognize, interpret, and respond to emotional and behavioral patterns — applied here at the organizational level through automated signal processing |
| **NI (Natural Intelligence)** | The calibrating intelligence that governs how systems respond to detected drift — addressing underlying human states rather than surface-level technical deficiencies |
| **NI Calibration Response** | A governance adjustment recommended by the NI layer, targeting the human-state condition underlying a detected drift pattern |
| **NLI (Natural Language Inference)** | A classification approach that evaluates whether a premise (observed behavioral signals) entails, contradicts, or is neutral toward a hypothesis (specific drift pattern) |
| **NIST SP 800-53** | The National Institute of Standards and Technology's catalog of security and privacy controls for information systems and organizations |
| **Severity Score** | A 1–5 rating indicating the stage and intensity of a detected drift pattern, mirroring NIST severity levels |
| **State Ladder** | A five-stage model of drift progression: (1) Bhava/State → (2) Tendency → (3) Visible Behavior → (4) Pattern → (5) Identity |

## Appendix B: System Architecture Diagram

```
┌──────────────────────────────────────────────────────────────────┐
│                    DATA INGESTION LAYER                          │
│  ┌──────────┐ ┌──────────┐ ┌──────────────┐ ┌───────────────┐  │
│  │ IAM Logs │ │ GRC Data │ │ SIEM Events  │ │ Comm Metadata │  │
│  └────┬─────┘ └────┬─────┘ └──────┬───────┘ └───────┬───────┘  │
│       └─────────────┼──────────────┼─────────────────┘          │
│                     ▼              ▼                             │
│         ┌───────────────────────────────────┐                   │
│         │  Preprocessing & Normalization    │                   │
│         │  (90-day rolling baseline)        │                   │
│         └───────────────┬───────────────────┘                   │
│                         ▼                                       │
│         ┌───────────────────────────────────┐                   │
│         │  Feature Engineering              │                   │
│         │  (Trend, Variance, Cross-signal)  │                   │
│         └───────────────┬───────────────────┘                   │
└─────────────────────────┼────────────────────────────────────────┘
                          ▼
┌──────────────────────────────────────────────────────────────────┐
│               LAYER 3: AI DETECTION                              │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  LangGraph Multi-Agent Orchestration                      │  │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐ │  │
│  │  │ Access   │ │ Audit    │ │ Incident │ │ Communication│ │  │
│  │  │ Pattern  │ │ Behavior │ │ Response │ │ Pattern      │ │  │
│  │  │ Agent    │ │ Agent    │ │ Agent    │ │ Agent        │ │  │
│  │  └────┬─────┘ └────┬─────┘ └────┬─────┘ └──────┬───────┘ │  │
│  │       └─────────────┼────────────┼──────────────┘         │  │
│  └─────────────────────┼────────────┼────────────────────────┘  │
│                        ▼            ▼                            │
│  ┌─────────────────────────┐ ┌─────────────────────────────┐    │
│  │ Vector DB (Qdrant)      │ │ NLI Classifier (DeBERTa)   │    │
│  │ Drift Signature Match   │ │ Drift Pattern Entailment   │    │
│  └────────────┬────────────┘ └──────────────┬──────────────┘    │
│               └──────────────┬──────────────┘                   │
│                              ▼                                  │
│              ┌───────────────────────────────┐                  │
│              │ Temporal Sequence Aggregation  │                  │
│              │ (Self-Attention over Weeks)    │                  │
│              └───────────────┬───────────────┘                  │
└──────────────────────────────┼───────────────────────────────────┘
                               ▼
┌──────────────────────────────────────────────────────────────────┐
│               LAYER 2: EI REVELATION                             │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  Six Drift Pattern Classification                         │  │
│  │  ┌─────────┐ ┌────────────┐ ┌──────────┐                 │  │
│  │  │Fatigue/ │ │Overconfi-  │ │Hurry/    │                 │  │
│  │  │Numbness │ │dence       │ │Urgency   │                 │  │
│  │  └─────────┘ └────────────┘ └──────────┘                 │  │
│  │  ┌─────────┐ ┌────────────┐ ┌──────────┐                 │  │
│  │  │Quiet    │ │Hoarding/   │ │Compliance│                 │  │
│  │  │Fear     │ │Control Grip│ │Theater   │                 │  │
│  │  └─────────┘ └────────────┘ └──────────┘                 │  │
│  └────────────────────┬───────────────────────────────────────┘  │
│                       ▼                                          │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  Severity Scoring (1-5) + NIST Control Mapping            │  │
│  └────────────────────┬───────────────────────────────────────┘  │
└───────────────────────┼──────────────────────────────────────────┘
                        ▼
┌──────────────────────────────────────────────────────────────────┐
│               LAYER 1: NI CALIBRATION                            │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  NI Response Library (RAG Retrieval)                      │  │
│  │  Context-sensitive calibration responses                   │  │
│  │  Addressing human state, not technical control             │  │
│  └────────────────────┬───────────────────────────────────────┘  │
│                       ▼                                          │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  Governance Feedback Loop                                 │  │
│  │  Policy adjustment → NIST control recalibration           │  │
│  └────────────────────┬───────────────────────────────────────┘  │
└───────────────────────┼──────────────────────────────────────────┘
                        ▼
┌──────────────────────────────────────────────────────────────────┐
│               GOVERNANCE DASHBOARD (React)                       │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────────────────┐ │
│  │ Drift Map    │ │ Trend Lines  │ │ NI Calibration Status    │ │
│  │ (by team)    │ │ (90-day)     │ │ (response tracking)      │ │
│  └──────────────┘ └──────────────┘ └──────────────────────────┘ │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ Early Warning Alerts (severity-graded, NIST-mapped)      │   │
│  └──────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────┘
```

---

*© 2026 The Circle Research Collaborative. This paper is prepared for academic submission and pilot evaluation in healthcare cybersecurity governance.*
