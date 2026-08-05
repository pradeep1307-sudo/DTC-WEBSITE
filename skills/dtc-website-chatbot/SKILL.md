---
name: dtc-website-chatbot
description: Maintain and extend the Denver Tamil Church website chatbot in js/script.js, contact.html, and styles.css. Use when changing chatbot answers, website-page knowledge retrieval, floating chat UI, suggested prompts, unknown-question behavior, or the Connect intake and church-email handoff.
---

# Denver Tamil Church Website Chatbot

Keep the floating DTC assistant accurate, website-grounded, private, and usable on every page.

## Workflow

1. Read `references/chatbot-behavior.md` before modifying chatbot behavior or knowledge.
2. Inspect every public HTML page and `js/script.js` for current facts before changing answers.
3. Keep curated high-confidence answers for common questions and page-text retrieval for broader website questions.
4. Answer only from published website content. Never invent church facts, schedules, people, policies, or events.
5. For an unavailable answer, apologize and invite a question about information on the website.
6. Keep the Connect flow ordered as name, email, optional phone, subject, and message.
7. Address prepared Connect email to `info@denvertamilchurch.com`. Do not claim delivery; browser `mailto:` only opens the visitor's email application for review and sending.
8. Preserve keyboard access, ARIA state, Escape-to-close behavior, reduced-motion support, and mobile layout.
9. Validate JavaScript structure and exercise common questions, unknown questions, cancellation, invalid email, and successful Connect completion.

## Source of Truth

- Chat implementation and curated knowledge: `js/script.js`, `initChurchChat`
- Static Contact-page shell: `contact.html`
- Shared generated shell: `js/script.js`, `initChurchChat`
- Appearance and responsive behavior: `styles.css`
- Church facts: public HTML pages in the project

Do not duplicate new facts in this skill. Keep changing church content in the website pages and chatbot knowledge where required.
