# Component Architecture

This project follows the Atomic Design methodology for component organization.

## Structure

### Atoms
Basic building blocks that can't be broken down further:
- `Button` - Reusable button component with variants
- `Input` - Form input component
- `Icon` - SVG icon component with predefined icons

### Molecules
Simple combinations of atoms:
- `PropertyCard` - Property listing card with image, title, address, and features
- `BlogCard` - Blog post card with image, title, and word count
- `SearchBar` - Search form with location, dates, guests, and search button

### Organisms
Complex UI components composed of molecules and atoms:
- `HeroSection` - Main banner with search functionality and category tabs
- `PropertySection` - Grid of property cards with section header
- `FeaturedPropertiesSection` - 2x3 grid of featured properties
- `PromoBanner` - Promotional banner with title, subtitle, and CTA button
- `BlogSection` - Blog posts grid with "View All" button
- `MobileAppSection` - Mobile app download section with store buttons
- `AboutSection` - About content with links and CTA
- `NewsletterSection` - Newsletter signup form
- `Footer` - Complete footer with multiple columns and social links

### Templates
Page-level components that combine organisms:
- `HomePageTemplate` - Complete home page layout

## Usage

```tsx
import { HomePageTemplate } from '@/components';

// Use the template with dictionary
<HomePageTemplate dict={dictionary} />
```

## Design System

### Colors
- Primary: Gray-900 (#111827)
- Secondary: Gray-100 (#f3f4f6)
- Text: Gray-900, Gray-600
- Background: White, Gray-50, Gray-100

### Typography
- Headings: Font-bold, various sizes (text-2xl to text-5xl)
- Body: Font-medium, text-sm to text-lg
- Links: Text-blue-600 with hover states

### Spacing
- Consistent padding: p-4, p-8, p-12
- Section spacing: py-16
- Grid gaps: gap-6

### Components
All components are responsive and follow consistent design patterns with hover states and transitions. 