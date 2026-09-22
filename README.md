# Graveyard Hub

Create the complete frontend UI for a futuristic developer SaaS called Project Graveyard — a place where developers archive abandoned, unfinished, and forgotten projects.

Visual Theme

Make the entire application feel like a spooky futuristic digital graveyard. Use a dark black/charcoal background, subtle neon purple/green accents, glowing borders, fog/mist effects, subtle particles, cryptic terminal-style details, futuristic typography, ghostly UI elements, and cemetery-inspired visuals. Keep it premium and professional rather than cartoonish or childish.

Think cyberpunk + haunted cemetery + futuristic developer terminal.

Pages

1. Landing Page

Hero title: "PROJECT GRAVEYARD"

Subtitle: "Where unfinished projects come to rest."

Dramatic graveyard/cyberpunk visual

CTA: "Enter the Graveyard"

Secondary CTA: "View Demo"

Short feature section explaining:

Archive abandoned projects

Understand why projects died

Revive forgotten ideas

Track your project history

2. Dashboard
Create a futuristic command-center dashboard showing:

Total projects

Active projects

Abandoned projects

Revivable projects

Total projects buried

Most common abandonment reason

Project activity chart

Project status distribution

Recently buried projects

"Project of the Day" / "Forgotten Project" card

Include a large visual section called THE GRAVEYARD showing project cards as digital tombstones.

Each tombstone should display:

Project name

Technology

Date started

Last activity

Status

Reason abandoned

"Revive" button

"Inspect" button

3. Projects / Graveyard
Create a searchable and filterable project archive.
Filters:

All

Active

Abandoned

Buried

Revivable

Technology

Date

Abandonment reason

Display projects as futuristic grave/tombstone cards with subtle hover animations.

4. Project Details
Create a detailed project page containing:

Project name

Description

GitHub/repository link

Technologies

Start date

Last activity

Current status

Progress percentage

Screenshots/files area

Abandonment reason

Notes

Timeline of project activity

"Revive Project"

"Bury Project"

"Edit Project"

Include a dramatic section titled CAUSE OF DEATH showing why the project was abandoned.

5. Add Project
Create a beautiful modal/page for adding a project:

Project name

Description

GitHub URL

Technologies

Start date

Last activity

Current status

Progress

Why was it abandoned?

Could it be revived?

Notes

6. Analytics
Create a futuristic analytics dashboard:

Projects created over time

Projects abandoned over time

Most common causes of death

Technologies used

Average project lifespan

Revival rate

Completion rate

Abandonment patterns

Use glowing futuristic charts.

7. Profile
Developer profile showing:

Avatar

Developer name

Bio

Total projects

Buried projects

Revived projects

Completion rate

Favorite technologies

Project timeline

Navigation

Create a futuristic sidebar:

PROJECT GRAVEYARD

🏚 Dashboard
⚰️ Graveyard
🧟 Active Projects
🔥 Revivable
📊 Analytics
🗃 Collections
👤 Profile

Bottom:
⚙ Settings

Add a futuristic top search bar:
"Search the graveyard..."

Add a prominent + Bury New Project button.

Important UI Details

Make the interface feel alive:

Hover animations on grave/tombstone cards

Glowing borders

Subtle fog/background particles

Smooth page transitions

Neon status indicators

Terminal-inspired labels

Skeleton loaders

Empty states

Toast notifications

Confirmation dialogs

Responsive mobile design

Beautiful dark mode throughout

Use realistic mock project data such as:

Twitter Clone

AI Chatbot

Crypto Dashboard

E-commerce Platform

Weather App

Social Media Clone

Portfolio v2

AI Resume Builder

Use different "causes of death":

Lost Interest

Too Ambitious

Technical Debt

Lack of Time

Better Idea

API Problems

Scope Explosion

Abandoned Framework

Design Goal

The final result should look like a real futuristic SaaS product, not a generic dashboard template. The spooky graveyard concept should be visible throughout the UI while maintaining excellent readability and professional UX.

Use responsive layouts, reusable components, polished animations, and consistent design tokens.

## Development

You need Node.js and npm.

```sh
git clone <this-repository-url>
cd graveyard-hub
npm i
npm run dev
```

The UI talks to the Express API at `http://localhost:4100` (`VITE_API_URL`).
