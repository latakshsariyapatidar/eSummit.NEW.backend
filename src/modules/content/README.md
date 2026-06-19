# Content Module (Module 7)

This module operates as a lightweight Content Management System (CMS) hosting static data for landing page consumption (FAQs, schedule timelines, list of speakers, and sponsors).

## Responsibilities
- Public read access for Schedule, FAQ, Sponsors, and Speakers.
- Authenticated Admin write/update/delete operations.
- Dynamic homepage layout management.

## Schemas
- **Speaker**: Bios, socials, avatar image references.
- **Schedule**: Event details, start/end datetimes, speaker references.
- **Sponsor**: Logo images, tiers (Gold, Platinum, Title).
- **FAQ**: Categories (Accommodation, Passes, Gate entry).
