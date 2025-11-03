# Job Evaluation Prompt

## The Prompt

```
I will be applying for a variety of jobs. You should already have my resumes saved in your memory. I am quickly applying to each job. I won't be customizing resumes for each job. I will provide a job description and you will provide me the below. And we'll continue the pattern from there. Job description, then feedback, etc. Deviations may come when there are follow up questions. After deviations we go back to job description and evaluation.

Whenever I give you a job description, I want you to:

1. Read the entire job description thoroughly — do not rely on the title, summary, or surface-level patterns to determine the role type.

2. Tell me which master resume best fits the job and why. To ensure accuracy, it should be based off what's in the actual resume and not what you logically estimate the resume to contain.

3. Clearly explain why the selected resume is the best fit based on the content in the resume and the job description.

4. Give me pros and watchouts/cons for the job - how I align, how I misalign (areas of concern/consideration)

5. Evaluate fit using three scores (Resume Fit, ATS Fit, Overall Fit — all on a 1–10 scale), with justification for each.

6. Let me know if the job is worth applying. Anything above an 8.5 should be a definite, however if I'm missing core skillsets or environment requirements, factor that in the advisement. If it's below an 8.5 but you think its still worth a shot, please tell me why.

7. Advise if the job is different enough that it would require its own new master resume category, explaining what it would be and if it's worth building.

8. Check that the job is based in Houston, or is remote. I will also accept Chicago, Atlanta, or Dallas (my strong preference is remote or Houston). If it's not highlight it. If its hybrid highlight that and location (this ensures I haven't missed or misread location and I'm applying intentionally)

9. Estimate the salary range if it is not clearly listed, based on the role, my Houston location, company data (Glassdoor, etc.), and other factors. within/in addition to the estimate explain what I could expect to get and why. If the salary range is listed, what could I expect to get and why?

10. Capabilities Statement — If the role is leadership- or ownership-focused and not a bridge job, advise:
   1. Whether to attach a capabilities statement, if able.
   2. If so, which one and why
```

---

## Design Principles & Annotations

### **Multi-Criteria Decision Framework**
The prompt uses 10 distinct evaluation criteria because job fit is multidimensional. Each criterion addresses a different risk or opportunity:

- **Criteria 1-3**: Resume and role alignment (the "can I do this job?" question)
- **Criteria 4-5**: Risk assessment and scoring (the "how confident should I be?" question)
- **Criteria 6-7**: Strategic decision-making (the "should I apply?" and "does this expand my options?" questions)
- **Criteria 8-9**: Practical constraints (location, compensation)
- **Criterion 10**: Application optimization (what materials to submit)

### **Key Prompt Engineering Techniques**

#### 1. **Explicit Anti-Shortcuts (Criterion 1)**
> "Read the entire job description thoroughly — do not rely on the title, summary, or surface-level patterns..."

**Why this matters**: LLMs tend to pattern-match based on job titles. A "Support Manager" role at a tech startup is fundamentally different from "Support Manager" at an enterprise SaaS company, but the AI will default to surface similarities without explicit instruction to dig deeper.

**Real-world impact**: Reduced mismatched resume recommendations by ~60% after adding this instruction.

---

#### 2. **Ground Truth Forcing (Criterion 2)**
> "...based off what's in the actual resume and not what you logically estimate the resume to contain"

**Why this matters**: ChatGPT will "hallucinate" resume content based on job titles and logical inference. If your resume says "IT Support Manager" the AI might assume you have cloud infrastructure experience even if it's not explicitly listed.

**Real-world impact**: Prevents overconfident recommendations based on assumed (not actual) qualifications.

---

#### 3. **Structured Risk Assessment (Criterion 4)**
> "Give me pros and watchouts/cons for the job - how I align, how I misalign..."

**Why this matters**: Forces balanced analysis. Without this, AI tends toward either pure positivity ("you're a great fit!") or pure negativity ("you're missing X, Y, Z"). The pros/cons structure demands nuanced thinking.

**Output format**: Typically rendered as a table with Impact and Mitigation columns, making risk tangible and actionable.

---

#### 4. **Tri-Score System (Criterion 5)**
Three separate scores prevent oversimplification:
- **Resume Fit**: Content alignment (experience, skills, achievements)
- **ATS Fit**: Keyword optimization (will the application survive automated screening?)
- **Overall Fit**: Intangibles (culture, trajectory, strategic value)

**Why three scores**: A candidate might have perfect resume fit (9/10) but poor ATS fit (5/10) due to missing buzzwords. The tri-score catches these nuances.

---

#### 5. **Threshold Logic with Exceptions (Criterion 6)**
> "Anything above an 8.5 should be a definite, however if I'm missing core skillsets or environment requirements, factor that in..."

**Why this matters**: Establishes clear decision rules while allowing for edge cases. The AI learns that:
- Score ≥ 8.5 = default "yes"
- BUT exceptions exist (e.g., 9.5 score with missing critical certification = maybe not)
- Score < 8.5 can still be "yes" with strong justification

**Real-world calibration**: Through data tracking, discovered 8.8+ is the true optimal threshold (updated in documentation but not in prompt to avoid over-optimization).

---

#### 6. **Strategic Portfolio Thinking (Criterion 7)**
> "Advise if the job is different enough that it would require its own new master resume category..."

**Why this matters**: Prevents both resume proliferation (too many variations) and missed opportunities (not enough coverage). AI acts as strategic advisor on portfolio expansion.

**Decision factors AI considers**:
- Is this a new role category or just a variation?
- Is there sufficient job market volume to justify a new resume?
- What would differentiate this resume from existing ones?

---

#### 7. **Practical Constraint Validation (Criterion 8)**
> "Check that the job is based in Houston, or is remote... (this ensures I haven't missed or misread location and I'm applying intentionally)"

**Why this matters**: Human error prevention. Job postings often bury location details or use ambiguous language ("Dallas area" might mean Dallas proper or 45 miles away).

**User experience note**: The parenthetical explanation teaches the AI *why* this check matters, improving output quality.

---

#### 8. **Salary Intelligence with Negotiation Context (Criterion 9)**
> "...explain what I could expect to get and why"

**Why this matters**: Not just "what's the range" but "where should I land in that range given my background." This is pre-negotiation intelligence.

**AI draws from**:
- Posted range (if available)
- Market data (Glassdoor, Levels.fyi patterns)
- Your experience level vs. job requirements
- Geographic market conditions

---

#### 9. **Context-Aware Document Matching (Criterion 10)**
> "If the role is leadership- or ownership-focused and not a bridge job..."

**Why this matters**: Capabilities statements have cost (time to customize, risk of overwhelming reviewer). This criterion teaches AI to recommend them strategically:
- Leadership roles: Yes (shows strategic thinking)
- Bridge jobs: No (over-investment for short-term role)
- Individual contributor roles: Depends (usually no unless highly competitive)

---

### **Workflow Design: Iterative Pattern**

> "I will provide a job description and you will provide me the below. And we'll continue the pattern from there. Job description, then feedback, etc."

**Why this structure works**:
- **Predictable format**: AI knows what to expect, reducing output variability
- **Efficient iteration**: User can paste job descriptions rapid-fire without re-explaining context each time
- **Deviation handling**: Acknowledges that follow-up questions happen, then returns to pattern

**Performance metric**: Enables evaluation of 10-15 jobs per hour vs. 2-3 jobs per hour with manual analysis.

---

## Prompt Evolution Notes

**Original Version** (v1.0):
- Single "is this a good fit?" question
- No scoring system
- No location verification
- Resume recommendations were often wrong

**Current Version** (v5.0+):
- 10-point evaluation framework
- Tri-score system with thresholds
- Explicit anti-shortcut instructions
- Secondary resume recommendation (removed in later iterations to prevent user confusion)
- Strategic portfolio expansion guidance

**Key Learnings**:
1. **Specificity matters more than length**: The prompt is long, but every instruction solves a real problem encountered in testing
2. **Forced structure improves consistency**: Tables, numbered lists, and scoring rubrics reduce output variance
3. **Explain the "why"**: When the prompt explains *why* something matters (like the location check), AI performance improves
4. **Iteration based on data**: Score thresholds refined after analyzing 100+ applications and callback rates

---

## Usage Tips

### **For Best Results**:
1. **Use a dedicated thread**: Don't mix job evaluation with other tasks
2. **Paste complete job descriptions**: Including company info, benefits, etc. (more context = better analysis)
3. **Trust the scores, not just the recommendation**: A 7.5 with "apply anyway" reasoning might be worth it; a 9.5 with a critical gap might not
4. **Track outcomes**: Log which scores actually led to callbacks to refine your personal threshold

### **Common Deviations**:
- Questioning resume choice: "Why did you pick Resume A over Resume B? Compare them."
- Salary negotiation: "If they offer $X, how should I counter?"
- Application strategy: "This is a stretch role at 7.8 score. Should I apply anyway given my timeline?"

### **Red Flags to Watch For** (AI quality issues):
- Resume recommendation doesn't cite specific resume content → Re-prompt with "explain using actual resume text"
- Generic pros/cons → Ask "be more specific about alignment"
- Score without justification → Request detailed reasoning

---

## Complementary Tools

This evaluation prompt works in tandem with:
- **Application Questions Thread**: Separate context for drafting responses (see application-questions-prompt.md)
- **Tracking Spreadsheet**: Logs scores, outcomes, and patterns for data-driven refinement
- **Capabilities Statements**: Pre-built portfolio pieces recommended by Criterion 10

**Why separate threads**: Early iterations combined evaluation and application question drafting in one thread. This caused context pollution where the AI would confuse tasks. Multi-threading eliminated 90% of these issues.

---

**Version**: 5.0+  
**Platform**: ChatGPT Pro (requires memory persistence)  
**Median Evaluation Time**: 45-90 seconds per job  
**Accuracy Rate**: 8.8+ scores correlate with highest callback rates (validated across 500+ applications)
