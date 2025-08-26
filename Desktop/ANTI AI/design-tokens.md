# Gaply Design Tokens

This document outlines the design tokens used in the Gaply frontend application, following a strict monochrome design philosophy.

## Color Palette

### Base Colors
- **Primary Background (`--bg`)**: `#ffffff` (light) / `#000000` (dark)
- **Primary Text (`--text`)**: `#000000` (light) / `#ffffff` (dark)
- **Muted Text (`--muted`)**: `#6b7280` (light) / `#9ca3af` (dark)
- **Surface (`--surface`)**: `#f9fafb` (light) / `#111111` (dark)
- **Border (`--border`)**: `#e5e7eb` (light) / `#374151` (dark)
- **Accent (`--accent`)**: `#000000` (light) / `#ffffff` (dark)

### Semantic Colors
- **Success**: `#22c55e` (green-500)
- **Warning**: `#f59e0b` (amber-500)
- **Error**: `#ef4444` (red-500)
- **Info**: `#3b82f6` (blue-500)

## Typography

### Font Families
- **UI Text**: Inter (sans-serif)
- **Headings**: Merriweather (serif)

### Font Sizes
- **Hero**: `3.5rem` (56px) - Main page titles
- **Display**: `2.5rem` (40px) - Section headers
- **Title**: `1.875rem` (30px) - Component titles
- **Subtitle**: `1.25rem` (20px) - Descriptive text
- **Body**: `1rem` (16px) - Regular text
- **Small**: `0.875rem` (14px) - Captions, labels
- **Extra Small**: `0.75rem` (12px) - Fine print

### Font Weights
- **Light**: 300
- **Regular**: 400
- **Medium**: 500
- **Semibold**: 600
- **Bold**: 700
- **Black**: 900

## Spacing

### Base Unit
- **Base**: `0.25rem` (4px)

### Spacing Scale
- **xs**: `0.5rem` (8px)
- **sm**: `0.75rem` (12px)
- **md**: `1rem` (16px)
- **lg**: `1.5rem` (24px)
- **xl**: `2rem` (32px)
- **2xl**: `3rem` (48px)
- **3xl**: `4rem` (64px)
- **4xl**: `6rem` (96px)
- **5xl**: `8rem` (128px)

### Custom Spacing
- **18**: `4.5rem` (72px)
- **88**: `22rem` (352px)
- **128**: `32rem` (512px)

## Layout

### Container
- **Max Width**: `1200px`
- **Padding**: `1rem` (16px) on mobile, `2rem` (32px) on desktop

### Grid
- **Columns**: 12-column grid system
- **Gutters**: `2rem` (32px) between columns
- **Breakpoints**:
  - **Mobile**: `< 768px`
  - **Tablet**: `768px - 1024px`
  - **Desktop**: `> 1024px`

## Components

### Buttons
- **Primary**: Background `--text`, text `--bg`
- **Secondary**: Background `--surface`, text `--text`, border `--border`
- **Ghost**: Background transparent, text `--text`, hover `--surface`

### Cards
- **Background**: `--surface`
- **Border**: `--border`
- **Shadow**: Subtle shadow with hover enhancement
- **Padding**: `1.5rem` (24px)
- **Border Radius**: `0.75rem` (12px)

### Inputs
- **Background**: `--surface`
- **Border**: `--border`
- **Focus**: Ring `--accent` with 2px width
- **Padding**: `1rem` (16px)
- **Border Radius**: `0.5rem` (8px)

## Animations

### Transitions
- **Duration**: `200ms` for most interactions
- **Easing**: `ease-out` for natural feel

### Keyframes
- **Fade In**: Opacity 0 → 1
- **Slide Up**: Transform Y(10px) → Y(0) with opacity
- **Scale In**: Transform scale(0.95) → scale(1) with opacity

### Hover Effects
- **Scale**: `hover:scale-105` for interactive elements
- **Shadow**: Enhanced shadow on hover
- **Opacity**: Slight opacity change for buttons

## Accessibility

### Focus States
- **Visible Focus**: Always visible focus indicators
- **Focus Ring**: 2px ring with `--accent` color
- **High Contrast**: Meets WCAG AA standards

### Color Contrast
- **Text on Background**: Minimum 4.5:1 ratio
- **Large Text**: Minimum 3:1 ratio
- **Interactive Elements**: Clear visual distinction

## Dark Mode

### Implementation
- **CSS Variables**: All colors defined as CSS custom properties
- **Class Toggle**: `.dark` class on `<html>` element
- **Persistent**: User preference saved in localStorage
- **System Default**: Respects user's system preference

### Color Mapping
- **Light → Dark**: Inverted color scheme
- **Surface Colors**: Adjusted for dark mode readability
- **Borders**: Darker borders for better contrast

## Responsive Design

### Breakpoints
- **Mobile First**: Base styles for mobile devices
- **Tablet**: `@media (min-width: 768px)`
- **Desktop**: `@media (min-width: 1024px)`
- **Large Desktop**: `@media (min-width: 1280px)`

### Fluid Typography
- **Responsive Scale**: Font sizes scale with viewport
- **Minimum Sizes**: Ensures readability on small screens
- **Maximum Sizes**: Prevents excessive scaling on large screens

## Usage Guidelines

### Color Application
1. **Primary Actions**: Use `--text` background with `--bg` text
2. **Secondary Actions**: Use `--surface` background with `--border`
3. **Text Hierarchy**: Use `--text` for primary, `--muted` for secondary
4. **Interactive States**: Use `--accent` for focus and hover states

### Typography Rules
1. **Headings**: Always use Merriweather serif font
2. **Body Text**: Use Inter sans-serif for readability
3. **Size Hierarchy**: Maintain clear visual hierarchy
4. **Line Height**: Use appropriate line heights for readability

### Spacing Principles
1. **Consistent Rhythm**: Use spacing scale consistently
2. **Visual Breathing**: Allow adequate space between elements
3. **Grouping**: Use spacing to group related elements
4. **Alignment**: Maintain consistent alignment with spacing grid
