# Analytics Setup Guide

## Overview
This portfolio is now integrated with Google Analytics 4 (GA4) for professional visitor tracking and engagement analysis.

## Setup Instructions

### 1. Create a GA4 Property
1. Go to [Google Analytics](https://analytics.google.com/)
2. Create a new property (Admin > Create Property)
3. Follow the setup wizard to create a web data stream
4. Copy your Measurement ID (starts with `G-`)

### 2. Update the Measurement ID
Replace `G-XXXXXXXXXX` with your actual GA4 ID in **all HTML files**:

- `index.html`
- `about.html`
- `skills.html`
- `projects.html`
- `experience.html`
- `education.html`
- `achievements.html`
- `testimonials.html`
- `contact.html`

Search for `G-XXXXXXXXXX` and replace it with your Measurement ID in each file.

## Tracked Events

### Page Views
All page views are automatically tracked with:
- Page title
- Page URL
- Page path

### Custom Events
| Event Name | Parameters | Description |
|------------|------------|-------------|
| `page_view` | `page_title`, `page_location`, `page_path` | Page view tracking |
| `button_click` | `button_name`, `button_location` | Button click events |
| `project_interaction` | `project_name`, `action` | Project interactions |
| `section_view` | `section_id` | Section visibility tracking |
| `scroll_depth` | `depth` | Scroll depth (25%, 50%, 75%, 100%) |

## Privacy Features
- **IP Anonymization**: Enabled (`anonymize_ip: true`)
- **GDPR Friendly**: Cookie settings configured appropriately
- **No Personal Data**: No PII is tracked without user consent

## Accessing Your Analytics
1. Go to [Google Analytics](https://analytics.google.com/)
2. Select your property
3. Explore these reports:
   - **Reports > Realtime**: See live visitors
   - **Reports > Acquisition**: See where visitors come from
   - **Reports > Engagement**: See page views, interactions, and events
   - **Reports > Demographics**: See visitor location and device info

## Heatmap Integration (Optional)
For advanced visual analytics, consider integrating:
- **Hotjar**: https://www.hotjar.com/
- **Microsoft Clarity**: https://clarity.microsoft.com/ (FREE!)

## Development Testing
Events are logged to the browser console when GA4 is not loaded, so you can test locally:
1. Open Chrome DevTools (F12)
2. Go to the "Console" tab
3. Interact with the portfolio
4. See analytics events logged with 📊 prefix

## Performance Impact
- Async script loading: No render blocking
- Minimal payload: GA4 is lightweight
- No performance degradation on mobile
