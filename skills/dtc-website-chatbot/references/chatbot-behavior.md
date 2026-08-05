# Chatbot Behavior Contract

## Answering

- Prefer concise curated answers for service time, address, faith, pastor, missions, livestream, events, giving, gallery, prayer, contact, and language questions.
- Search meaningful content from every public page, including `index.html`, `ministry.html`, `missions.html`, `events.html`, `live.html`, `give.html`, `contact.html`, and `gallery.html`.
- Index `assets/upcoming/events.json` locally so event dates, recurring services, Christian observances, U.S. holidays, locations, and details remain available to the chatbot.
- Index `assets/gallery/manifest.json` locally so album names and published photo counts remain available.
- Prefer a specific ministry, service, giving method, or event answer over a broad topic answer when both match.
- Keep retrieved answers concise and include the title and link of the page supporting the answer.
- Link to the page supporting an answer.
- Ignore navigation, footer, scripts, styles, and Tamil duplicates while building the English page index.
- If no relevant website content matches, apologize and ask for another question about information available on the church website.

## Connect Flow

Collect one response at a time:

1. Full name
2. Valid email address
3. Phone number or `skip`
4. Subject
5. Message

Allow `cancel` at any step. On completion, create a URL-encoded `mailto:` addressed to `info@denvertamilchurch.com`, include all collected fields, explain that the email application will open, and require the visitor to review and press Send. Never state that the church received the message unless a real delivery API confirms it.

Validate each response against the requested field. End the flow, clear its in-memory details, and return to website-question mode when an answer is unrelated or unusable. Treat a website question entered during any Connect step as a normal chatbot question and answer it after ending the flow. Permit a retry for an email that contains `@` but has a minor formatting error.

## Safety and Privacy

- Do not send chat content to third-party AI services.
- Do not persist personal details in local storage, logs, or page markup.
- Do not invent emergency, legal, medical, or financial guidance as church policy.
- For urgent personal needs, direct the visitor to church contact information or appropriate emergency services without claiming the chatbot can intervene.
