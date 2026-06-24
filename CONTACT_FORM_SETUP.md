# Contact Form Setup

## Current Implementation

The portfolio contact form currently uses Formspree as the production backend.

- Form endpoint: `https://formspree.io/f/mreazaaw`
- Submission method: native `POST` plus JavaScript enhancement
- Notifications: toast success/error messages in the browser
- Reliability features: validation, timeout handling, offline detection, and a browser fallback when the fetch transport fails

## What Was Checked

- EmailJS: not present in this repository
- Netlify Forms: not configured in this repository
- Environment variables: no `.env` or deployment env files were found
- Service IDs / Template IDs / API keys: none found in the codebase

## Why Formspree Is Used

This is a static portfolio site, so Formspree is the most reliable option already wired into the project without requiring a server, build step, or secret management in the repo.

## Required Formspree Setup

1. Create or confirm the Formspree form at the endpoint above.
2. Verify the destination email address inside the Formspree dashboard.
3. Confirm the sender domain or spam filters in your mailbox.
4. Submit a test message from the live site and confirm receipt.
5. If you change the endpoint, update both `contact.html` and `script.js`.

## If You Want to Switch to Netlify Forms Later

1. Deploy the site on Netlify.
2. Add the `netlify` form attributes and hidden form name fields.
3. Configure Netlify form notifications in the dashboard.
4. Remove the Formspree-specific fetch handler if you want Netlify to be the only provider.

## If You Want to Switch to EmailJS Later

1. Install the EmailJS browser SDK.
2. Add your public key, service ID, and template ID through environment variables or a site config file.
3. Replace the current Formspree fetch call with the EmailJS `sendForm` flow.
4. Keep the current validation, loading state, toast messages, and error logging.

## Production Checklist

- Submit a real message and confirm it reaches your inbox.
- Test the form with JavaScript enabled and disabled.
- Test once while offline to confirm the error state appears.
- Watch the browser console for logged submission failures.