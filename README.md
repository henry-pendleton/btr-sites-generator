# BTR Sites Generator

Static site generator for BTR marketing sites, powered by Claude AI.

## How It Works

```
┌─────────────────────────────────────────────────────────────────┐
│  1. Marketing opens GitHub Issue using template                 │
│  2. Fills in: site name, colors, contact info, Engrain ID      │
│  3. Adds 'claude-build' label                                   │
│  4. GitHub Action triggers                                       │
│  5. Claude reads issue, creates config files                    │
│  6. 11ty builds static HTML                                      │
│  7. Vercel deploys to edge                                       │
│  8. Site live in ~2 minutes                                      │
└─────────────────────────────────────────────────────────────────┘
```

## Project Structure

```
btr-sites-generator/
├── src/
│   ├── _includes/
│   │   ├── layouts/base.njk      # Main HTML template
│   │   └── components/           # Reusable components
│   │       ├── nav.njk
│   │       ├── hero.njk
│   │       └── footer.njk
│   ├── assets/
│   │   └── styles/main.css       # Global styles
│   ├── index.njk                 # Homepage template
│   ├── floorplans.njk            # Floor plans page
│   └── contact.njk               # Contact page
├── sites/
│   └── {site-slug}/
│       ├── config.json           # Site configuration
│       ├── content.json          # Page content
│       └── assets/               # Site-specific assets
├── .github/
│   ├── workflows/
│   │   └── claude-build-site.yml # CI/CD pipeline
│   └── ISSUE_TEMPLATE/
│       └── new-site.yml          # New site request form
├── eleventy.config.js            # 11ty configuration
└── package.json
```

## Local Development

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build
```

## Creating a New Site

### Via GitHub (Recommended)

1. Go to Issues → New Issue
2. Select "New Site Request" template
3. Fill in all required fields
4. Submit the issue
5. Add the `claude-build` label
6. Wait for the automated build (~2 min)

### Manually

1. Create a new folder in `sites/{slug}/`
2. Add `config.json` (see example-site)
3. Add `content.json` (see example-site)
4. Run `npm run build`

## Configuration

### config.json

```json
{
  "name": "Property Name",
  "slug": "property-slug",
  "branding": {
    "primaryColor": "#2a5d4f",
    "secondaryColor": "#d4a574",
    "logo": "/sites/slug/assets/logo.svg"
  },
  "contact": {
    "phone": "(404) 555-1234",
    "email": "leasing@property.com",
    "address": "123 Main St",
    "city": "Atlanta",
    "state": "GA",
    "zip": "30301"
  },
  "engrain": {
    "communityId": "12345"
  },
  "nav": [
    { "label": "Floor Plans", "href": "/slug/floorplans" },
    { "label": "Contact", "href": "/slug/contact" }
  ]
}
```

### content.json

```json
{
  "hero": {
    "headline": "Welcome Home",
    "subheadline": "Modern living starting at $1,850/mo",
    "buttons": [
      { "label": "Schedule Tour", "href": "/contact" }
    ]
  },
  "about": {
    "title": "About Us",
    "description": "Property description..."
  },
  "amenities": {
    "items": [
      { "name": "Pool", "icon": "🏊" }
    ]
  }
}
```

## GitHub Secrets Required

| Secret | Description |
|--------|-------------|
| `ANTHROPIC_API_KEY` | Claude API key |
| `VERCEL_TOKEN` | Vercel deployment token |
| `VERCEL_ORG_ID` | Vercel organization ID |
| `VERCEL_PROJECT_ID` | Vercel project ID |

## Architecture Decisions

### Why Static Sites?

- **Performance**: Edge-cached, blazing fast
- **Cost**: No servers, minimal hosting cost
- **Safety**: Claude only modifies JSON/MD, never templates
- **Version Control**: Every change is a git commit

### Why 11ty?

- Simple, no framework overhead
- Nunjucks templating is familiar
- Fast builds
- Easy to understand for Claude

### Why Claude?

- Understands form data naturally
- Creates valid JSON reliably
- Can be constrained to specific folders
- Handles edge cases gracefully

## Customization

### Adding New Templates

1. Create template in `src/`
2. Add pagination for multi-site support
3. Reference site data via `{{ site.fieldName }}`

### Modifying Components

Components are in `src/_includes/components/`. They receive the full site config via the `site` variable.

### Adding Dynamic Data

For real-time data (floor plans, pricing), add client-side JavaScript in `src/assets/scripts/` that fetches from Engrain or other APIs.
