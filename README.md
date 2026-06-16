# Stockpile

### Know how long your supplies can support you.

Stockpile is a local-first emergency preparedness inventory management system designed to help individuals and families manage essential supplies, track expiration dates, estimate available calories, and evaluate preparedness readiness.

Unlike traditional food inventory applications, Stockpile focuses on emergency scenarios where internet access may be unavailable and privacy is critical.

## Features

### Inventory Management

* Manage food, water, medical supplies, tools, and other emergency resources
* Create, update, and remove inventory items
* Categorize supplies for easier tracking

### Survival Analysis

* Calculate total available calories
* Estimate survival duration based on household size and daily calorie requirements
* Visualize preparedness progress toward a target number of days

### Expiration Tracking

* Identify supplies that are approaching expiration
* Highlight expired or soon-to-expire items
* Reduce waste through proactive inventory rotation

### Data Quality Check

* Detect items with missing information
* Identify missing calories, expiration dates, or quantities
* Improve the accuracy of survival analysis

### Local-First & Privacy-Focused

* All data is stored locally on the user's device
* No account registration required
* No inventory information is uploaded to any server

### Offline Ready

* Designed as a Progressive Web App (PWA)
* Continue using the application without internet access

## Tech Stack

### Frontend

* React 19
* TypeScript
* React Router v7
* Tailwind CSS v4
* shadcn/ui

### Visualization

* Recharts

### Storage

* LocalStorage

## Project Goals

Stockpile was created to solve a practical problem:

Many people prepare emergency supplies, but few know how long those supplies can actually sustain them.

This project aims to transform inventory records into actionable preparedness insights, helping users answer questions such as:

* How many days can my supplies support my household?
* Which items are about to expire?
* What information is missing from my inventory?
* What should I prioritize replenishing?

## Roadmap

### Completed

* Inventory CRUD
* Local storage persistence
* Dashboard overview
* Survival days calculation
* Expiration tracking
* Data quality checks

### Planned

* PWA support
* Household configuration
* Preparedness score
* Gap analysis
* Supply recommendations
* Data import/export

## License

MIT
