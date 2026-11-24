# Writing Product Requirement Documents - Frameworks, Templates & Checklists

*66 artifacts extracted from Lenny's Podcast and Newsletter*

## Frameworks

### 5 Elements of a Great 1-Pager/PRD (Examples and templates of 1-Pagers and PRDs)
An evaluation rubric for what makes a product spec effective, used both for writing and reviewing PRDs

How it works: 1. Problem-oriented: Crystallize the problem being solved in a few strong sentences, ideally near the top of the document, to focus the brainpower of every teammate in the same direction.
2. Clear success criteria: Super-specifically define what success looks like when the product or feature ships. First to make sure it's even worth doing, and later to help everyone make tradeoff decisions throughout the project.
3. Just enough direction: Give the reader (engineers, designers, managers) just enough of an idea of what the project will entail — including requirements and constraints — without eliminating the opportunity for teammates to come up with even better solutions.
4. Urgency: Include a clear (proposed) timeline by which to review, align on, build, and ship the project, to keep the project moving forward and prevent scope explosion.
5. Short and sweet: Keep it brief (that's why Lenny prefers '1-Pager'), clean up formatting and comments anytime it starts to get messy, and put additional context into an appendix at the end.

### 5 Tips for PM-Design Partnership (The PM 🤝 Design Partnership)
Katie Dill's five-part framework for PMs to build effective working relationships with designers, covering trust, coordination, timing, vision, and goal alignment

How it works: 1. Trust the designer's expertise — Give designers uninterrupted time for creative flow. Defer to them on UX decisions when they are well-informed about user, problem, and goals. Use prototypes and qualitative research to de-risk disagreements. Some design choices are simply a matter of taste.
2. Be the conductor — PMs set the foundation by clarifying context: problems, goals, and constraints tied back to business. Facilitate communication across the team like an orchestra conductor who doesn't play all instruments but coordinates the ensemble.
3. Include designers early — Avoid waterfall. Three benefits: (a) Designers inform with voice of the user, (b) Designers catalyze with creative ideas, visual storytelling, and prototypes, (c) Designers gain context for keener intuition and faster, higher-quality execution.
4. Invest in even the smallest of north stars — A north star is a picture of your future product (low or high fidelity). Scope it using four variables: Scope (single screen = 1 day, new product = months), Fidelity (words, journey map, wireframes, or full prototype), Time horizon (near-term has more knowns but less runway), Buy-in (who needs to inform and evangelize). Complexity of the problem determines investment level.
5. Create shared goals — Reframe 'design goals' (consistency, usability, accessibility, delight) as sub-goals of business metrics (use, conversion, loyalty). Discuss how sub-goals relate and sequence them. Allocate quarterly time or a roadmap percentage for UX improvements. Stop saying 'my designer' — say 'my design partner' instead.

### Amazon Internal Press Release (Carilu Dietrich)
Writing a press release before building a product to ensure it has a cohesive, marketable narrative.

How it works: Start with the end in mind to avoid building a 'bag of doorknobs' (disconnected features). Negotiate the product's value proposition upfront between product and marketing before engineering begins.

### Block Brain Diagrams (Bob Baxley)
Extremely low-fidelity wireframes used to force alignment on conceptual models before visual design begins.

How it works: Use big chunky blocks to represent where things might be located. Because it is so low fidelity, stakeholders cannot comment on colors or shapes, forcing them to discuss the core concept and flow.

### Breadboarding and Fat Marker Sketching (Ryan Singer)
Two collaboration techniques for shaping sessions that are more detailed than wireframes but less polished than Figma — designed to communicate the idea clearly enough that builders know what to make.

How it works: Breadboarding: Text-based flow diagrams showing screens/actions/connections. Example: 'Hit this button → go to this screen → this calculation runs → get this answer → choice to go here or here.' Fat Marker Sketching: Rough sketches with thick markers that communicate the core idea. Key principle: Must communicate 'what to build,' not just be a blurry version of Figma. Test: Can an engineer look at this and say 'I know what to go build'?

### Business Problem vs. Customer Problem Distinction (Christopher Miller)
A documentation standard for product specs and experiments to ensure customer-centricity.

How it works: When outlining a problem in a spec, force a qualifier: Is it a business problem or a customer problem? If it's a business problem, ask 'Why hasn't this solved itself?' to uncover the root customer problem. This prevents solving business needs in a customer-hostile way.

### Conversation Over Documentation Principle (Five habits of highly annoying product managers)
A guiding principle for balancing spec detail: use misunderstandings to calibrate what needs to be written vs. discussed verbally.

How it works: Principle: Prioritize conversation over documentation.

When a misunderstanding occurs, don't default to adding more documentation. Instead, use it as a signal to narrow in on:
- What types of nuances need to be clarified in writing (e.g., edge cases, constraints, acceptance criteria)
- What types of nuances are better clarified through discussion (e.g., design intent, user context, tradeoffs)

Benchmark: If your specs are longer than any other PM's you work with, or if designers and engineers don't actually use your documents, you're likely being too prescriptive.

### Design Goals as Business Sub-Goals Hierarchy (The PM 🤝 Design Partnership)
A mental model for reframing 'design goals' as nested sub-goals of business metrics to create shared PM-Design alignment

How it works: Hierarchy example: Consistency (design sub-goal) → Usability (higher-level goal) → Conversion (business goal). Similarly: Accessibility → Use → Revenue. Delight → Loyalty → Retention.

Key insight: Things people call 'design goals' (consistency, usability, accessibility, delight) all drive use, conversion, and loyalty — which are critical business outcomes. The difference between 'design goals' and 'business goals' is just a difference in level of zoom.

Practical recommendation: Many companies set aside time every quarter and/or require a percentage of the roadmap be devoted to UX improvements that contribute indirectly to the bottom line. Getting it right the first time is even better.

### Detail Dial (calibrating shaped output to team seniority) (Ryan Singer)
Adjust the level of implementation guidance in shaped work based on the experience level of the build team — more detail for junior engineers, less for senior ones.

How it works: Junior team: Provide more implementation guidance (e.g., 'I would suggest approaching it like this, this, this'). Prevents junior engineers from hiding that they're stuck. Senior team: Leave more room for them to figure out implementation. High trust, long history = less detail needed. Key principle: If someone feels they should be involved in fundamental approach decisions, bring them into shaping instead. Over time, dial back detail as team members grow.

### Drawing the Perimeter (Kevin Yien)
A mental model for writing PRDs where the PM defines the strict constraints (customer segment, jobs to be done, core principles like speed vs. consistency) to create a sandbox for design and engineering.

How it works: Includes defining customer segments (e.g., sit-down vs. taco truck), jobs to be done, platform availability, and core principles/trade-offs.

### Evergreen Artifact System (replacing PRDs) (How to ship like a startup)
A three-artifact system to replace traditional PRDs with visual, maintainable documents that stay relevant

How it works: Instead of writing PRDs for every feature, invest in three evergreen artifacts:
1. Vision Artifact — Built once up front. Communicates the broader impact you're aiming for. Functions as your pitch deck. Everyone understands the 'why.'
2. Strategy Artifact — Updated each quarter. Shows how near-term work ladders up to the vision. Keeps teams aligned on priorities.
3. Visual Designs — Invest in directional designs that tell the story better than text ever could. Annotate specs inside designer's mocks rather than creating standalone docs.

Additional tips:
- Use design files as the source of truth, not text documents
- Annotate specs inside mocks
- Use FigJam and quick wireframes for lo-fi alignment
- Speed-run option spaces instead of spending weeks writing specs

### Fewer than 10 moving pieces test (Ryan Singer)
A rule of thumb for evaluating whether something is well-shaped: if you can describe the solution in fewer than 10 moving pieces that someone can hold in their head, it's shaped well enough.

How it works: Based on the cognitive science principle of 7±2 (how many things someone can hold in their head at once). If the description requires more than 10 components, it's either too big or not clear enough. Example: Calendar = (1) two-month dot grid, (2) dots indicating events, (3) tap day for agenda view, (4) forward/back navigation, (5) create button ≈ 5 pieces = well-shaped.

### Framing (narrowing the problem before shaping) (Ryan Singer)
Before shaping a solution, narrow down the raw request (e.g., 'build a calendar') into a specific, bounded problem worth solving (e.g., 'users need to see empty spaces in their schedule'). This prevents shaping from becoming an ever-expanding blob.

How it works: Steps: 1) Take the raw request or opportunity. 2) Ask what specific problem customers are actually trying to solve. 3) Negotiate with stakeholders to narrow scope. 4) Arrive at a crisp problem statement that bounds the shaping work. Example: 'Calendar' → 'Users can't see empty spaces where they could book something in the existing agenda view.'

### Helpful Error Message Design (How to accelerate growth by focusing on the features you already have)
Principles for creating error messages that guide users to success rather than creating frustration

How it works: When a user makes a mistake and sees an error message:
1. Focus on what caused the error
2. Do NOT blame the user
3. Most importantly: Tell them how to correct it

Use error states as an opportunity to guide users to a successful outcome, not just report failure.

### PM-Designer Co-Design Model (Ideal sprint length, designer vs. PM roles, running PM team meetings, running post-mortems, best product/executive coaches, and much more)
A framework for delineating PM and Product Designer responsibilities across discovery and delivery phases

How it works: Ownership model:

1. Customer Discovery Phase:
   - PM OWNS customer discovery (problem definition, why it matters)
   - Design and Engineering play the role of CHECKER
   - PM's responsibility: prove this is the most important problem/opportunity to pursue now
   - All three (PM, Design, Eng) ride shotgun on discovery sessions when possible

2. Product Discovery / Solution Phase:
   - Design OWNS product discovery and the experience of the solution
   - Engineering provides options that are feasible (based on constraints)
   - PM EVALUATES if the solution is the best way to deliver value to customers
   - PM brings context of the problem being solved

3. Key principles:
   - Think of it as 'co-design' — roles reverse depending on the stage
   - If PM isn't butting heads with Design (and PMM, Eng), something's wrong — it should be the 'leaning in' kind of collision
   - PM should NOT be in design tools (Figma) doing anything other than commenting
   - Senior designers may spill over into user/market research on bigger/more technical products
   - The boundary varies with experience, skillset, interests of the designer, product type, and org scale

### Pre-Technical Conception & Legacy Study Process (This Week #8: Splitting equity with late-joining co-founders, favorite roadmap templates, and small changes that improve your org)
A PM-led process to study legacy products and prepare documentation before developers begin technical conception, dramatically speeding up development

How it works: Steps:
1. Study the legacy product where the team will work — all functional aspects
2. Write documentation to keep track of studies and explain how features & logic work
3. Note all technical aspects you can understand as a PM:
   - Database structure of the functional perimeter
   - API calls during feature interactions
   - Workflow diagrams
   - Any leads/suggestions to help developers do Technical Conception faster
4. Share all documentation with developers BEFORE they begin their Technical Conception phase

Result: Development time went 300% faster because developers obtained knowledge in advance and could do very fast Technical Conceptions.

### Quality Equals Meeting Spec (Seth Godin)
A definition of quality that separates it from luxury and perfectionism, providing a clear decision-making rule for when to ship.

How it works: Quality is not luxury. Quality is not perfection. Quality means meeting spec. If you meet spec, you're done—ship it. If you don't think the spec is good enough, make a better spec. Taking something that meets spec and refusing to ship it because you're a perfectionist is hiding, not quality.

### Sharpie Storyboard (Jeff Weinstein)
A low-fidelity, unconstrained visual representation of the perfect solution to a customer problem.

How it works: Drawn with a Sharpie (not Figma). Focuses on the ideal end-state to align stakeholders and secure buy-in before scoping the MVP.

## Templates

### 1-Pager / PRD (Maggie Crowley)
A document to define the problem and align the product triad (PM, design, engineering).

How it works: Sections include: Background and context, The problem, Why this problem matters, Why this problem matters NOW, and a running list of decisions made (what is and isn't being solved).

### 1-Pager Project Template (A Three-Step Framework For Solving Problems 👌)
A Google Doc template for scoping a product project by answering six key questions. Lenny recommends a single person (usually the PM) takes the first pass, then uses it for team and stakeholder alignment.

How it works: Template structure with six sections:

1. **Description: What is it?** — Brief description of the project so readers can quickly understand what it's about. Keep it brief.

2. **Problem: What problem is this solving?** — A single-sentence problem statement that is: (a) Short, (b) Focused on a single clear problem, (c) References an unfulfilled need, (d) Includes a what and a why, (e) Is agnostic of a solution. Include examples of what problem you are NOT solving.

3. **Why: How do we know this is a real problem and worth solving?** — 3-5 strong data points (quantitative and qualitative) that back up the problem hypothesis. Quality over quantity.

4. **Success: How do we know if we've solved this problem?** — Concrete metric with a defined goal (e.g., '10% increase in X', '50% decrease in Y', '20% adoption within 3 months'). Should connect to team KPIs. If no metric applies, describe what the world looks like if this is a big success.

5. **Audience: Who are we building for?** — Specific user segment (new vs returning, casual vs power, mobile vs web, etc.). Should rarely be 'all users.'

6. **What: What does this look like in the product?** — Description of the proposed solution, at whatever level of detail is appropriate. Align with designer(s) on how much detail they need.

Google Doc link: https://docs.google.com/document/d/1541V32QgSwyCFWxtiMIThn-6n-2s7fVWztEWVa970uo/edit
Copy link: https://docs.google.com/document/d/1541V32QgSwyCFWxtiMIThn-6n-2s7fVWztEWVa970uo/copy

### AI Prompt: Write User Stories (Product manager is an unfair role. So work unfairly.)
A ChatGPT prompt template (GPT-4o and up) for writing user stories by describing functionality out loud while looking at Figma prototypes.

How it works: Prompt (send first message):

"You are an expert product manager and product owner. I will describe functionality to you, and you will provide a user story following the user story template that follows, paying close attention to line breaks. Do you understand and are you ready?"

"User Story Template [pick your favorite]:

# Story
As a <type of user>,
I want to <perform some task>,
so that I can <achieve some goal>.

# Objectives
<text>

# Acceptance criteria
1. Given <some context>,
When <some action is carried out>,
Then <a set of observable outcomes should occur>
2. …

# Tech notes
(leave empty)

# Grooming Q&A
(leave empty)"

[hit enter]

Subsequent messages:
[Look at the Figma prototype in another window for convenience, and describe out loud one user story at a time using Whisper speech-to-text, then hit enter]

### AI Prompt: Write a PRD (Product manager is an unfair role. So work unfairly.)
A ChatGPT prompt template (GPT-4o and up) for drafting a PRD by dictating context via speech-to-text.

How it works: Prompt (send first message):

"You are an expert product manager and I need your help to articulate my thoughts into a PRD. I'm going to give you the template and then I'm going to later tell you all the context that I have in my head, and you're going to help me structure the document. Do you understand?"

[hit enter]

Second message (template):
# Objective
# Target customer
# How this connects to company strategy
# What we believe
# Solution constraints and principles
# [other sections from your preferred template]

[hit enter]

Third message:
[Dictate your thoughts on the above sections using speech-to-text (BetterDictation, Superwhisper, or built-in OS dictation)]

### Adam Thomas's Initiative Template (My favorite product management templates)
A one-page initiative template that emphasizes keeping scope constrained at the start

How it works: Google Doc initiative template designed to stay on one page. Linked at: https://docs.google.com/document/d/1B3GEUwgEIIQVgRp85l4DKLZOTzgGZmBIAjR06p4wuwY/edit

### Adam Waxman's PRD Template (SeatGeek) (My favorite product management templates)
A PRD template featuring a 1-pager summary section before diving into detail

How it works: Google Doc PRD template with a 1-pager summary section upfront followed by deeper detail. Linked at: https://docs.google.com/document/d/1xc9TZX-7NMfOykzFKR0o0jzTUygoAFzWadxDVR7sNvs/edit

### Asana's Project Brief Template (Examples and templates of 1-Pagers and PRDs, My favorite product management templates)
Asana's project brief template, noted for its problem statement framework

How it works: Google Doc template featuring a problem statement framework. Linked at: https://docs.google.com/document/d/1W46cmPfPwXIIH2mNNbbQ5EdjnhQFqGxGhT5iAijmJjc/edit#heading=h.cqt1a4hrfy8u

### Bolt PRD Template (Examples and templates of 1-Pagers and PRDs)
A PRD template specifically suited for hardware products

How it works: Lenny highlights: 'Ideal for hardware products.' Link: Google Docs.

### ChatPRD Standard Template Structure (Claire Vo)
The default structure used by ChatPRD to generate product specs.

How it works: Includes: Objectives, User Goals, User Stories, Out of Scope, UX Walkthrough, Narrative (how to pitch/position the product), Sequencing and Milestones, and Measurements and Goals.

### Duolingo One-Pager Template (How Duolingo builds product)
The template Duolingo uses for early-stage product review one-pagers to get feedback on feature ideas

How it works: One-Pager Template sections (based on screenshot): 1. Title / Feature Name. 2. Author(s) and Date. 3. Problem Statement — What problem are we solving? Why does it matter? 4. Proposed Solution — High-level description of the feature idea. 5. Goals — What does success look like? What metrics will be impacted? 6. Non-Goals — What is explicitly out of scope? 7. Key Risks and Open Questions — What could go wrong? What do we need to figure out? 8. Rough Timeline / Next Steps. (Note: The actual template was shown as an image; these sections are derived from the visible structure.)

### Effort Scoping Reframe Question (Five habits of highly annoying product managers)
A replacement phrase for 'this should be quick' that collaboratively scopes work with engineers and designers.

How it works: Instead of saying: 'This should be quick' or 'This should just take a few hours'

Say: 'What would need to be true for this to be doable in the next [X] days?'

This reframes the conversation from a PM assertion about effort to a collaborative exploration of constraints and feasibility.

### Figma's PRD Template (Examples and templates of 1-Pagers and PRDs, My favorite product management templates)
A super comprehensive plug-and-play PRD template from Figma, hosted on Coda

How it works: Lenny highlights: 'A super comprehensive plug-and-play template.' Link: Coda (coda.io/@yuhki/figmas-approach-to-product-requirement-docs/prd-name-of-project-1)

### First Principles / Second-Order Effects PRD Section (Nickey Skarstad)
A section in a product requirements document to force teams to think about downstream impacts.

How it works: Include prompts: 'What are the first principles we care about for this build?' and 'How will these changes cascade through our ecosystem?' Get alignment on this section before moving into design or technical architecture.

### Front's PRD Template (Examples and templates of 1-Pagers and PRDs)
A PRD template from Front (the customer communication platform) that enforces structure and clarity

How it works: Lenny highlights: 'Love the structure and clarity it enforces.' Hosted on Dropbox Paper.

### Growth-Oriented Ticket/Spec Addition (Summary: The ultimate guide to adding a PLG motion | Hila Qu (Reforge, GitLab))
A simple addition to product tickets/specs that forces PMs to connect features to growth levers

How it works: Add a section to every product ticket/spec with two fields:
1. Success Metric: What metric will this feature improve? (written ahead of time, before building)
2. Growth Lever: Which growth lever will this feature help? (e.g., activation, conversion, retention, acquisition)

Purpose: Forces PMs to think deeply about the purpose of every feature and connect it to measurable business outcomes.

### Intercom's Job Story Template (Examples and templates of 1-Pagers and PRDs)
A simple story-based template from Intercom that has everything you need to get started

How it works: Lenny highlights: 'Love the simplicity, while still having everything you need to get started.' Hosted as PDF on Intercom's marketing CDN.

### Intercom's Story Template (My favorite product management templates)
A simple story-based template with everything needed to get started on a project

How it works: PDF template focused on simplicity while covering essential project information. Uses job story format. Linked at: https://s3.amazonaws.com/marketing.intercomcdn.com/assets/Intercom-Job-Story-template.pdf

### Kevin Yien's PRD Template (Examples and templates of 1-Pagers and PRDs)
A PRD template from a PM at Square, notable for its Non-Goals section and step-by-step flow

How it works: Lenny highlights: 'Love this whole template, particularly the Non-Goals section and the step-by-step flow.' Link: Google Docs.

### Kevin Yien's PRD Template (Square) (My favorite product management templates)
A PRD template notable for its Non-Goals section and step-by-step flow, used at Square

How it works: Google Doc PRD template featuring a Non-Goals section and step-by-step user flow. Linked at: https://docs.google.com/document/d/1mEMDcHmtQ6twzNlpvF-9maNlAcezpWDtCnyIqWkODZs/edit

### Lenny's 1-Pager Template (Examples and templates of 1-Pagers and PRDs, What 5 years at Reddit taught us about building for a highly opinionated user base)
Lenny's personal template used anytime he starts a new project

How it works: URL: https://docs.google.com/document/d/1541V32QgSwyCFWxtiMIThn-6n-2s7fVWztEWVa970uo/edit
Used by Tyler Swartz at Reddit as the foundation for step 1 of the community-driven launch playbook. The PM completes this one-pager, then reviews it with Community Managers before writing the full product spec.

### Lenny's Personal 1-Pager Template (My favorite product management templates)
Lenny's go-to template for starting every project — a concise 1-page project brief

How it works: Google Doc template used by Lenny to kick off every project. Linked at: https://docs.google.com/document/d/1541V32QgSwyCFWxtiMIThn-6n-2s7fVWztEWVa970uo/edit

### Nine-Box Kickoff Exercise (Ryan Singer)
At project kickoff, the build team translates the shaped idea into a 3x3 grid of nine major implementation scopes. This tests whether the shaped work is clear enough and the scope is realistic.

How it works: Steps: 1) Take the shaped idea. 2) Draw a 3x3 grid (9 boxes). 3) Have the build team fill in 9 major implementation scopes (not tickets — big chunks). 4) Sanity check: 30 business days ÷ 9 = ~4 days per scope. Does that feel realistic? 5) If >10 scopes, there's too much — revisit shaping. 6) Use as coaching moment: senior engineers can review junior engineers' proposed approaches. Rule: Keep to 9 or fewer (based on cognitive science rule of 7±2).

### PRD Growth Lever Addition (Hila Qu)
A required section in product requirement docs to ensure features drive measurable growth.

How it works: Add a section to every product ticket/doc requiring the PM to write the success metric ahead of time and explicitly state which growth lever it supports: acquisition, activation, retention, or monetization.

### PRD/1-Pager 'Why This Is a Problem' Section (Five habits of highly annoying product managers)
Lenny's recommendation for what every PRD or 1-Pager must include to justify prioritization and gain team buy-in.

How it works: Every PRD/1-Pager should contain a strong 'why this is a problem' argument. This section should:
1. Clearly articulate the problem being solved
2. Provide data-driven (not anecdotal) evidence for why this matters
3. Explain the rationale behind the priority level

Additionally, for non-trivial projects: speak with the engineer, designer, etc. in person to explain the rationale and address their concerns in real time.

Lenny links to his PRD/1-Pager template: https://docs.google.com/document/d/1541V32QgSwyCFWxtiMIThn-6n-2s7fVWztEWVa970uo/edit

### Problem Statement One-Pager Template (What Seven Years at Airbnb Taught Me About Building a Business)
A one-page document template refined over years at Airbnb to crystallize the problem and opportunity for teams and stakeholders. Used as the starting point before any project begins.

How it works: Google Doc template linked in the newsletter: https://docs.google.com/document/d/1541V32QgSwyCFWxtiMIThn-6n-2s7fVWztEWVa970uo/edit. Purpose: Crystallize the problem and opportunity for the team and stakeholders. Used at Airbnb as the single most important step before solving any problem.

### Product 1-Pager Template (SCR-based) (The Minto Pyramid Principle and the SCR Framework)
Lenny's favorite product 1-pager template that maps to the SCR framework. Description = Situation, Problem = Complication, What = Resolution.

How it works: Google Doc link: https://docs.google.com/document/d/1541V32QgSwyCFWxtiMIThn-6n-2s7fVWztEWVa970uo/edit

SCR Mapping:
- Description section → Situation (state of affairs)
- Problem section → Complication (what needs to change)
- What section → Resolution (what to build/do)

### Product Hunt's PRD Template (Examples and templates of 1-Pagers and PRDs, My favorite product management templates)
Product Hunt's PRD template that begins with Who, Why, What structure

How it works: Google Doc PRD template structured around Who, Why, What. Linked at: https://docs.google.com/document/d/1yrU5F6Gxhkfma91wf_IbZfexw8_fahbGQLW3EvwdfQI/edit

### Skeleton Prototypes for Flows (Elena Verna 3.0)
Wireframes containing the common, winning elements of specific user flows derived from competitor teardowns.

How it works: Instead of starting from scratch or blindly copying one competitor, extract the common structural elements (e.g., for a pricing page or sharing model) into a skeleton, then apply your own authentic brand, copy, and design.

### Steve Morin's 1-Pager Template (Examples and templates of 1-Pagers and PRDs)
A 1-Pager template from an Engineering Manager at Asana focused on success criteria and risks

How it works: Lenny highlights: 'Love the focus on success criteria and risks.' Link: Google Docs.

### Steve Morin's 1-Pager Template (Asana) (My favorite product management templates)
A 1-pager template with focus on success criteria and risks

How it works: Google Doc 1-pager template emphasizing success criteria and risk identification. Linked at: https://docs.google.com/document/d/1BeNK9BYd3-8pAqVYR_B0Gzp7kGNtWdPFHJKIXI52_84/edit

### Working Backwards PR & FAQ (Ian McAllister)
A document format used to ensure a product solves a real customer problem before writing any code.

How it works: Consists of an internal press release containing a problem paragraph, a solution paragraph, and a customer quote, followed by an FAQ that proves a legitimate plan to succeed.

## Checklists

### Design Crit Format (How Figma builds product)
Figma's structured format for running design critiques — explicitly generative and non-decisional.

How it works: Structure per topic (typically 2 topics per meeting): (1) ~10-15 minutes of presenting — use Spotlight in FigJam, attendees can comment during presentation, (2) ~5 minutes of lingering questions, (3) ~5 minutes of silent writing and commenting on the file. Key principles: Crits are explicitly NOT about making decisions — they are generative only. Designers share a file (often FigJam) with 10 minutes heads-down silent feedback via stickies and comments before live discussion. Scheduling: 5 standing weekly slots with escalating attendance — Tuesdays for tech pillars, Thursdays for Editor/Non-Editor teams, Fridays for all of design. Designers control booking and invitations. Automated Slack reminders for sign-ups. Guest observers from across the company are welcome — every employee encouraged to attend at least one crit per year. Additional resource: https://www.figma.com/blog/design-critiques-at-figma/

### Five Attributes of a Strong Problem Statement (A Three-Step Framework For Solving Problems 👌)
Criteria for evaluating whether a problem statement is well-crafted, used when writing the Problem section of the 1-pager.

How it works: A strong problem statement should be:
1. **Short** — Aim for a single sentence. The more you need to explain it, the less clear the problem is.
2. **Focused** — Single clear problem that can be owned by a single team and solved in a reasonable amount of time. Helpful to add examples of what problem you are NOT solving.
3. **References an unfulfilled need** — Focus on a user need (or business need if necessary). The Jobs-To-Be-Done framework is especially useful here.
4. **Includes a what and a why** — What's going wrong, and why is it a problem? Back it up with evidence.
5. **Agnostic of a solution** — Resist the urge to jump to a solution this early.

### PRD Review Checklist (derived from Lenny's critiques) (Examples and templates of 1-Pagers and PRDs)
A checklist derived from Lenny's evaluation of the four real-world examples, identifying common pitfalls to check for

How it works: When reviewing a PRD, check for these common issues:
1. Is the problem crystallized clearly in a few strong sentences near the top?
2. Are there clear, specific success criteria (but not too many)?
3. Is there a directional solution that gives engineers/designers enough to work with?
4. Is the stakeholder/players list appropriately scoped (not too long)?
5. Is the document clean and well-formatted (not messy)?
6. Does it explain why this direction is the right one?
7. Are acceptance tests or requirements concrete enough for the builder?
8. Is additional context pushed to an appendix rather than cluttering the main doc?

### Product Quality List (PQL) (Matt MacInnis)
A lightweight, evolving checklist of standards a product must meet before shipping.

How it works: Includes specific rules like 'You are allowed to have one feature flag that governs your entire product at ship.' It is iterated on constantly based on new mistakes discovered during product reviews.

### Technical PM Questions for PRDs and Feature Work (Become a more technical product manager)
Questions PMs should ask when writing PRDs or working on features to demonstrate technical awareness and improve collaboration

How it works: Application Architecture questions:
- What changes need to be made to each tier (client, server, database) for your new feature?
- Ask the engineer to walk you through implementation at a high level. Does it align with what you were expecting?

API questions:
- Have you tested your API from the perspective of your customer?
- How well does your API support customer workflows?
- Test internal and external APIs yourself. Do they perform the way you expect? What bottlenecks are there (if any)?

SDLC questions:
- How can you reduce implementation risk through closer collaboration with technical stakeholders?
- How much testing, and what types of testing, are appropriate for the change you're pushing to production?

### Three Habits for Staying Aligned to the Problem (A Three-Step Framework For Solving Problems 👌)
Three recurring habits to prevent scope creep and solution drift during product development.

How it works: 1. In every design review, make sure designers start by reviewing the problem statement. If it's not clear, ask 'What problem are we trying to solve?'
2. In every progress update to stakeholders, review the problem statement to ensure continued alignment on the outcome.
3. Before finalizing designs, ask yourself: 'Am I feeling confident this is going to solve the problem we set out to solve?'

### Three Reasons to Include Designers Early (The PM 🤝 Design Partnership)
Three ways including designers early in the product development process saves time and money

How it works: 1. Designers inform the conversation with a salient voice of the user
2. Designers catalyze the conversation and drive innovative thinking with creative ideas, visual storytelling, and prototypes
3. Designers gain greater context, develop a keener intuition for what's best, and are able to drive higher quality execution faster

## Examples

### Airbnb Host Dashboard Scope Creep Example (A Three-Step Framework For Solving Problems 👌)
A real example of how Lenny used the problem statement to fight scope creep on an Airbnb host dashboard project.

How it works: The team was building a dashboard for Airbnb hosts. The initial problem: reducing host response time (shrinking the average time a host takes to respond to a guest message). The hypothesis: hosts would respond more quickly if unread messages were more prominent and they were reminded that reply time impacts search ranking. The hypothesis proved correct, but throughout the project, as scope and complexity grew, Lenny had to repeatedly remind the team of the original problem statement. Dashboards are identified as a classic 'silver burrito' problem where everyone has their own vision.

### Basecamp Calendar — shaping example (Ryan Singer)
A fully worked example of how a vague 'calendar' request was framed down to 'seeing empty spaces' and then shaped into a specific solution describable in fewer than 10 moving pieces.

How it works: Problem framed: Users need to see empty spaces (not a full Google Calendar clone). Shaped solution: (1) Two-month dot grid showing days with/without events, (2) Tap a day to see scrolling agenda view underneath, (3) Navigation to go forward/back in months, (4) Create button to add event from empty space view. Test: Engineer can say 'I know what to build now.' Total: ~5 moving pieces.

### Facebook Newsfeed — Architecture That Stood 12+ Years (Peter Deng)
How thoughtful systems thinking in the Newsfeed rebuild created an information architecture that has barely changed in over a decade.

How it works: Approach: Deep investment in understanding the sharing loop — posting at top of page → appearing in newsfeed → like button → notification lighting up red → repeat. Focused on information architecture and the complete flow. Outcome: The current Newsfeed design has stood largely unchanged for 12+ years. Lesson: Going slow to build the right systems in the scaling phase pays off in long-term durability.

### Good vs Bad Problem Statement Examples (A Three-Step Framework For Solving Problems 👌)
Concrete examples of well-written and poorly-written problem statements with annotations explaining what makes each good or bad.

How it works: **Good problem statements:**
- 'Lyft drivers are cancelling rides too often because the passengers are too far away.'
- 'Airbnb hosts are feeling frustrated because they want to improve, but are finding it difficult to figure out how.'
- 'Users are dropping off at too high a rate at the final step of the signup flow.'

**Bad problem statements:**
- 'User growth is slowing.' — Issue: Too broad for this process; not user-centric.
- 'Build a loyalty program.' — Issue: Assumes a solution. What's the problem this is solving?
- 'Users are bouncing from the signup flow.' — Issue: Not focused enough, and missing a hypothesis of the why. Go one level deeper.

### Linear's Target Date Feature (Nan Yu)
A case study on solving the emotional pain of missing strict deadlines.

How it works: Customers felt bad when they missed specific dates (e.g., Dec 30th) causing marketing misalignment. Linear built a feature allowing target dates at any granularity (a specific day, a month, Q4, or H2) to remove the anxiety of false precision.

### Lyft Lost and Found 1-Pager (Examples and templates of 1-Pagers and PRDs)
A real-world product spec from Lyft for their Lost and Found feature, praised for problem-orientedness, clear success criteria, and simplicity

How it works: Strengths: Problem-oriented, very clear success criteria, overall simplicity. Weaknesses per Lenny: Could have crystallized the problem more clearly, outlined the details of the spec more concretely, and generally kept the document cleaner. Link: Google Drive document.

### Shift Swap Project Charter (Examples and templates of 1-Pagers and PRDs)
A real-world project charter for a Shift Swap feature, praised for structure and problem orientation

How it works: Strengths: Great structure, problem-orientedness, and clear success criteria. Weaknesses per Lenny: Missing any sense of a solution, list of 'players' is too long, and there are far too many success criteria — both should be cut back. Link: Google Docs.

### Shopify to Quickbooks Connector PRD (Examples and templates of 1-Pagers and PRDs)
A real-world PRD for a Shopify to Quickbooks integration, noted for its detailed acceptance tests and engineer-ready features

How it works: Strengths: Acceptance tests, success criteria, and fully thought-out features — good for an engineer who's ready to build. Weaknesses per Lenny: Document is relatively messy, not fully fleshed-out, and missing insight into the problem itself. Link: Google Docs.

### prodmgmt.world 1-Pager (Examples and templates of 1-Pagers and PRDs)
A real-world product spec for prodmgmt.world, praised for problem-orientedness and directional solutioning

How it works: Strengths: Problem-orientedness, directional solutioning, and clear success criteria. Weaknesses per Lenny: The 'User' section doesn't seem valuable and should be replaced with a clearer sense of why this direction is the right one. Link: Google Docs.

## Tools

### Write My PRD (How to use ChatGPT in your PM work)
A dedicated tool for using AI to write product requirements documents

How it works: URL: https://writemyprd.com/ — A specialized AI tool focused specifically on generating PRDs for product managers.
