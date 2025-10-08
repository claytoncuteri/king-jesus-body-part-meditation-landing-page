# ConvertKit Integration Setup

Your King Jesus Meditation landing page uses ConvertKit for email automation and product delivery. Follow these steps to complete the setup:

## Required Environment Variables

You've already added:
- ✅ `CONVERTKIT_API_KEY` - Your ConvertKit API Key
- ✅ `CONVERTKIT_API_SECRET` - Your ConvertKit API Secret

### Additional Required Variables

You need to add two more environment variables:

1. **`CONVERTKIT_FORM_ID`** - Your ConvertKit Form ID for lead capture
2. **`CONVERTKIT_PURCHASE_TAG_ID`** - Your ConvertKit Tag ID for product delivery automation

### How to Get Your Form ID

1. Log in to your ConvertKit dashboard
2. Go to "Grow" → "Landing Pages & Forms"
3. Select the form you want to use for King Jesus Meditation leads
4. The Form ID is in the URL: `https://app.convertkit.com/forms/designers/[FORM_ID]/edit`
5. Add this as a secret in Replit: `CONVERTKIT_FORM_ID=[your-form-id]`

### How to Get Your Tag ID

1. In ConvertKit, go to "Grow" → "Tags"
2. Create a new tag called "Product Purchased - King Jesus Meditation" (or click on existing one)
3. The Tag ID is in the URL: `https://app.convertkit.com/subscribers/tags/[TAG_ID]`
4. Add this as a secret in Replit: `CONVERTKIT_PURCHASE_TAG_ID=[your-tag-id]`

## Email Automation Setup

For product delivery emails to work automatically, you need to set up an automation in ConvertKit:

### Create Purchase Automation

1. In ConvertKit, go to "Automate" → "Visual Automations"
2. Create a new automation
3. **Trigger**: When a subscriber is tagged with "Product Purchased - King Jesus Meditation"
4. **Action**: Send an email with the following content:

```
Subject: 🙏 Your King Jesus Meditation Package - Divine Transformation Awaits!

Body:
Welcome to Your Spiritual Journey, [First Name]!

Thank you for your purchase of the King Jesus Body Part Meditation package. Your divine transformation begins now!

## Access Your Digital Products:

• King Jesus Body Part Meditation Video: [Your Video Link]
• Money-Related Podcast Episodes: [Your Podcast Link]
• Gospel of Thomas - Volume I PDF: [Your PDF Link]
• Reader's Notebook PDF: [Your Notebook Link]
• Meditation Journal Template: [Your Template Link]

## How to Get Started:

1. Find a quiet, comfortable space for meditation
2. Watch the King Jesus Body Part Meditation Video
3. Listen to the money podcast episodes for deeper understanding
4. Reflect on the Gospel of Thomas teachings and journal your insights

**Share Your Journey!**
Post your meditation experience on Instagram with #KingJesusMeditation and tag @claytoncuteri - I'll share your story with my 110K+ followers!

Blessings on your path,
Clayton Cuteri

*100% of proceeds support building the Church of King Jesus for global peace initiatives.*
```

5. Save and activate the automation

## How It Works

1. **Email Capture**: When someone enters their email on the landing page, they're added to your ConvertKit form (using `CONVERTKIT_FORM_ID`)
2. **Purchase Flow**: When someone completes a purchase via Stripe:
   - They're automatically tagged with "Product Purchased - King Jesus Meditation" (using `CONVERTKIT_PURCHASE_TAG_ID`)
   - Your ConvertKit automation triggers based on this tag
   - They receive the email with all product links
3. **Error Handling**: If product delivery fails, the system logs critical errors for manual follow-up

## Testing

1. Make a test purchase with your own email
2. Check that you receive the automation email
3. Verify all download links work correctly

## Important Notes

- Make sure to replace `[Your Video Link]`, `[Your Podcast Link]`, etc. with actual links to your digital products
- You can upload PDFs and videos to Replit's Object Storage or host them on a service like Google Drive, Dropbox, or a dedicated digital product platform
- Test the entire flow before launching to ensure customers receive their products immediately

## Support

If you have questions about ConvertKit setup, visit: https://help.convertkit.com
