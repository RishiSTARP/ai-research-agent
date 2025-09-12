# Gaply Literature Analysis Report - Design Specification

## Purpose Statement
This comprehensive report analyzes multiple research papers to identify patterns, research gaps, and opportunities for future investigation. By systematically comparing methodologies, findings, and limitations across studies, this analysis provides researchers with actionable insights to advance their field and identify promising research directions.

---

## Page-by-Page Layout Specification

### Page 1: Cover Page
**Layout:** A4 (210mm × 297mm) with 20mm margins
**Background:** Gradient from #0052CC to #00BFA6
**Color Scheme:** White text on gradient background

**Layout Elements:**
- **Header (20-25% vertical space):** Large Gaply logo (80mm width)
- **Title Section:** "Literature Analysis Report" (36px, 900 weight)
- **Subtitle:** "Multi-Paper Research Synthesis & Gap Analysis" (18px)
- **Purpose Statement Box:** Bottom 25% of page, semi-transparent white background with blur effect
- **Footer Metadata:** Session ID, generation date, paper count

**Typography:**
- H1: Merriweather 36px, 900 weight, -1px letter-spacing
- Body: Inter 14px, 1.6 line-height for purpose statement

---

### Page 2: Table of Contents
**Layout:** Clean white background with blue accents
**Header:** Small Gaply logo (left), page number (right)

**Content Structure:**
- **Title:** "Table of Contents" (H1, 32px)
- **TOC List:** Numbered list with page anchors
- **Visual Hierarchy:** Blue links (#0052CC), dark slate page numbers (#073B4C)

---

### Page 3: Executive Summary
**Layout:** Single comprehensive page
**Key Visual:** Gradient background box for summary content

**Content Sections:**
1. **Analysis Overview** (2-3 sentences)
2. **Key Metrics** (4 bullet points with numbers)
3. **Top 3 Recommendations** (bulleted list)
4. **Methodology Summary** (2-3 sentences)

**Visual Elements:**
- Highlight box with gradient background
- Bullet points with teal accent dots
- Clear section headers

---

### Page 4: Methodology & Input Papers
**Layout:** Grid-based paper cards
**Grid:** Auto-fit columns, minimum 80mm width

**Components:**
- **Analysis Approach:** Numbered steps (4 items)
- **Reference Usage Note:** Yellow callout box explaining how references were processed
- **Paper Cards:** Individual cards for each uploaded paper with metadata

---

### Page 5: Key Findings
**Layout:** Visual-first approach
**Charts:** 2 large chart placeholders with captions

**Content Structure:**
- **Primary Themes:** Highlight box with key statistics
- **Theme Distribution Chart:** Figure 1 placeholder
- **Critical Insights:** Bulleted list
- **Confidence vs Impact Matrix:** Figure 2 placeholder

---

### Page 6: Research Gap Matrix
**Layout:** Custom CSS Grid
**Grid Template:** 2fr + N×1fr + 1fr (where N = paper count)

**Matrix Structure:**
- **Row 1:** Headers (Theme, Paper A, Paper B, Paper C, Combined Priority)
- **Theme Column:** Left-aligned, bold text
- **Paper Columns:** Y/N indicators with color coding
- **Priority Column:** High/Medium/Low badges

**Color Coding:**
- Green (#D1FAE5): Theme present
- Red (#FECACA): Theme absent
- Priority badges with appropriate colors

---

### Page 7: Problem Statements
**Layout:** Card-based design
**Cards:** Individual problem statement cards

**Card Structure:**
- **Header:** Problem title (blue, bold)
- **Origin:** "Paper X (Author, Year)" format
- **Description:** 2-3 sentence elaboration
- **Confidence Badge:** High/Med/Low with color coding

---

### Page 8: Cross-Paper Insights
**Layout:** Mixed visual and narrative
**Primary Visual:** Network graph placeholder (Figure 3)

**Content Sections:**
- **Network Graph:** Nodes = papers, edges = shared themes
- **Synthesis Narrative:** 3-4 paragraph analysis
- **Key Patterns:** Bulleted list of identified patterns

---

### Page 9: Comparative Analysis Tables
**Layout:** Full-width data table
**Table Structure:** 8 columns with proper spacing

**Columns:**
1. Title (expanded)
2. Authors (medium)
3. Year (narrow)
4. DOI (medium)
5. Methods (medium)
6. Sample N (narrow)
7. Key Variables (expanded)
8. Key Findings (expanded)

---

### Pages 10-11: Figures & Visualizations
**Layout:** 2-page spread with 4 chart placeholders

**Charts Included:**
- **Figure 4:** Heatmap (theme intensity matrix)
- **Figure 5:** Timeline (publication chronology)
- **Figure 6:** Bar chart (relevance ranking)
- **Figure 7:** Correlation matrix (variable relationships)

**Chart Specifications:**
- Consistent 200×150 viewBox
- Alt text descriptions
- Short captions under each chart
- Colorblind-safe color schemes

---

### Page 12: Limitations & Conflicts
**Layout:** Data table format
**Table Structure:** 5 columns

**Columns:**
1. Issue Type (categorized)
2. Description (detailed)
3. Impact (High/Med/Low)
4. Affected Papers (list)
5. Mitigation (actionable steps)

---

### Page 13: Recommendations & Next Steps
**Layout:** Sectioned list format
**Three Time Horizons:**
1. **Immediate Actions** (0-6 months)
2. **Medium-Term Goals** (6-18 months)
3. **Long-Term Vision** (18+ months)

**Additional Section:** Suggested Experiments (card format)

---

### Page 14: References
**Layout:** APA 7 formatted list
**Structure:** Numbered list with hanging indents

**Features:**
- DOI links where available
- Consistent formatting
- Source attribution notes

---

### Page 15+: Appendix
**Layout:** Raw data presentation
**Content:** Extracted notes, highlights, original abstracts

---

## Pixel-Perfect Layout Guidance

### Typography Scale
- **H1:** Merriweather 32px, 700 weight, 1.2 line-height
- **H2:** Merriweather 24px, 700 weight, 1.3 line-height
- **H3:** Merriweather 20px, 700 weight, 1.3 line-height
- **H4:** Merriweather 16px, 700 weight, 1.4 line-height
- **Body:** Inter 11-12px, 400 weight, 1.4 line-height
- **Captions:** Inter 10px, 500 weight, 1.3 line-height

### Spacing Rules
- **Page Margins:** 20mm all sides (A4 standard)
- **Section Spacing:** 25mm between major sections
- **Element Spacing:** 8mm between related elements
- **Card Padding:** 8mm internal padding
- **Table Cell Padding:** 4mm for data tables

### Color Usage Rules
- **Primary Blue (#0052CC):** Headings, links, primary buttons, logo
- **Teal Accent (#00BFA6):** Secondary elements, highlights, borders
- **Yellow Accent (#FFD166):** Callouts, warnings, highlights
- **Coral Accent (#EF476F):** Errors, critical items, alerts
- **Dark Slate (#073B4C):** High-contrast text, headers
- **Black (#000000):** Primary text content
- **White (#FFFFFF):** Backgrounds, text on dark backgrounds

### Logo Placement
- **Cover Page:** Large logo (80mm width, ~20-25% vertical space)
- **Content Pages:** Small header logo (40mm width, top-left corner)

---

## Component Specifications

### Research Gap Matrix
**Grid Layout:** `grid-template-columns: 2fr repeat({{paper_count}}, 1fr) 1fr`
**Cell Styling:** 6mm padding, centered text, color-coded backgrounds
**Priority Calculation:** `(frequency × novelty)` heuristic
- High: 3+ papers + novel approach
- Medium: 2-3 papers + established approach
- Low: 1 paper + well-established approach

### Problem Statement Cards
**Structure:**
```
┌─ Card Header (Blue, Bold) ──────────────────┐
│ Problem Title                               │
├─ Origin Info ──────────────────────────────┤
│ Paper X (Author, Year)                     │
├─ Description ──────────────────────────────┤
│ 2-3 sentence elaboration of the problem    │
│ and its implications.                      │
├─ Confidence Badge ─────────────────────────┤
│ [High/Med/Low]                             │
└─────────────────────────────────────────────┘
```

### Comparative Metadata Table
**Column Specifications:**
- **Title:** `flex: 2` - Expanded width
- **Authors:** `flex: 1.5` - Medium width
- **Year:** `flex: 0.5` - Narrow width
- **DOI:** `flex: 1` - Medium width
- **Methods:** `flex: 1.5` - Medium width
- **Sample N:** `flex: 0.5` - Narrow width
- **Key Variables:** `flex: 2` - Expanded width
- **Key Findings:** `flex: 2` - Expanded width

---

## Copy Guidelines & Microcopy

### Executive Summary (Max 200 words)
**Structure:**
- 3-4 sentence overview
- 3 labeled bullets: Key Findings, Research Gaps, Recommendations
- 2-3 sentence methodology summary

### Captions (1-2 short sentences each)
- **Figure 1:** "Distribution of research themes across analyzed papers."
- **Figure 2:** "Confidence vs. Impact matrix showing reliability and significance."
- **Figure 3:** "Theme overlap between papers. Nodes represent papers, edges show shared themes."
- **Figure 4:** "Theme intensity across papers. Color intensity shows presence and importance."

### Table Headers & Tooltips
- **Theme/Gap:** "Research areas identified across papers"
- **Paper A/B/C:** "Presence (Y) or absence (N) of theme in specific paper"
- **Combined Priority:** "Calculated priority based on frequency and novelty"

### Example Plain-Language Problem Statement
**Data Quality Limitations**
Many studies rely on self-reported data which introduces significant bias and reduces the reliability of findings. This affects the validity of conclusions drawn about user behavior and system performance.

---

## Reference Handling Rules

### Extraction Process
1. Parse DOI, year, author list from reference sections
2. Extract variables and explicit problem statements
3. Use verbatim text for References section
4. Build Research Gap Matrix from extracted data

### In-Text Citations
- Format: (Author, Year)
- Superscript links to References page
- DOI links: `https://doi.org/{doi}`

### APA 7 Formatting Examples
1. Smith, J., & Johnson, A. (2023). *Machine learning applications in healthcare*. Journal of Medical AI, *15*(2), 123-145. https://doi.org/10.1234/jmai.2023.001
2. Brown, K., Davis, M., & Wilson, R. (2024). Neural networks for climate modeling. *Environmental Science & Technology*, *58*(3), 567-589.

---

## Accessibility & Export Features

### Clickable Elements
- Table of Contents anchors: `#section-name`
- Internal page links: `href="#references"`
- Reference links: DOI-based URLs

### Alt Text Requirements
- **Charts:** "Network graph showing theme connections between papers"
- **Heatmaps:** "Color-coded matrix showing theme presence across papers"
- **Timelines:** "Chronological chart of publication dates and milestones"
- **Bar Charts:** "Vertical bar chart comparing paper relevance scores"

### Colorblind-Safe Palettes
- **Primary:** Blue (#0052CC) → Gray (#6B7280)
- **Accent:** Teal (#00BFA6) → Light Blue (#93C5FD)
- **Highlight:** Yellow (#FFD166) → Orange (#FB923C)
- **Alert:** Coral (#EF476F) → Red (#EF4444)

### PDF Export Settings
- **Format:** PDF/A for long-term archiving
- **Fonts:** Embed all fonts (Inter, Merriweather)
- **Images:** Compress to 300dpi, vector logos where possible
- **Color Profile:** sRGB for web compatibility

---

## Mock Content Samples

### Research Gap Matrix Example
| Theme/Gap | Paper 1: ML in Healthcare | Paper 2: AI Diagnostics | Paper 3: Neural Networks | Combined Priority |
|-----------|---------------------------|------------------------|---------------------------|-------------------|
| Sample Size Limitations | Y (Notes: Small N=50) | N | Y (Notes: N=200 adequate) | High |
| Validation Methods | N | Y (Cross-validation used) | Y (Bootstrapping applied) | Medium |
| Real-world Testing | N | N | N | High |

### Problem Statement Card Example
**Data Quality Concerns**
*Origin: Paper 1 (Smith et al., 2023)*
Healthcare AI systems face significant privacy challenges when handling sensitive patient information. Current approaches often fail to adequately protect data during processing and storage, leading to potential breaches and loss of patient trust.
*High Confidence*

### Reference List Sample
1. Smith, J., Johnson, A., & Brown, K. (2023). *Machine learning in medical diagnosis: A systematic review*. Journal of Artificial Intelligence in Medicine, *45*(2), 123-145. https://doi.org/10.1234/jaim.2023.015
2. Davis, M., & Wilson, R. (2024). Neural network applications for healthcare prediction. *Computers in Biology and Medicine*, *156*, 106789. https://doi.org/10.1016/j.compbiomed.2023.106789
3. Garcia, L., Martinez, P., & Rodriguez, S. (2023). *Ethical considerations in AI healthcare systems*. BMC Medical Ethics, *24*(1), 78. https://doi.org/10.1186/s12910-023-00934-5

---

## Implementation Notes for Developers

### Data Injection Points
- `{{session_id}}` → Session identifier
- `{{generation_date}}` → Current timestamp
- `{{paper_count}}` → Number of analyzed papers
- `{{paper_cards}}` → HTML for paper metadata cards
- `{{gap_matrix_content}}` → Research gap matrix HTML
- `{{comparative_table_rows}}` → Table rows for comparison
- `{{references_list}}` → Formatted APA references

### Chart Generation
All charts can be generated client-side using:
- **Network Graph:** D3.js force-directed layout
- **Heatmap:** Canvas API or SVG
- **Timeline:** Chart.js timeline plugin
- **Bar Chart:** Chart.js bar chart

### Citation Integration
- Parse DOIs from uploaded papers
- Format links as: `<a href="https://doi.org/${doi}">https://doi.org/${doi}</a>`
- Add superscript numbers: `<sup>${citationNumber}</sup>`

---

## Final Implementation Checklist

### ✅ Design Complete
- [x] Cover page with gradient background and large logo
- [x] Executive summary with key metrics and recommendations
- [x] Research gap matrix with color-coded presence indicators
- [x] Problem statement cards with confidence badges
- [x] Comparative analysis tables with 8-column layout
- [x] Chart placeholders with alt text and captions
- [x] APA 7 formatted references section
- [x] Responsive grid layouts for paper cards
- [x] Accessibility features (alt text, high contrast)
- [x] Colorblind-safe color palette usage

### 🎨 Ready for Development
- HTML template with placeholder injection points
- CSS with Gaply color palette and typography
- Component specifications for all major elements
- Mock data samples for testing
- Export-ready PDF styling

This design specification provides a complete, professional literature analysis report template that can be implemented directly into the Gaply WebApp backend.
