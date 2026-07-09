# Visualization Rules Reference

## Chart Selection Guide

### Data Type → Chart Mapping

#### Distribution
- **Histogram**: Single continuous variable
- **Density plot**: Smooth distribution estimate
- **Box plot**: Distribution with quartiles and outliers
- **Violin plot**: Distribution + density
- **Strip/swarm plot**: Individual points

#### Comparison
- **Bar chart**: Categorical comparison
- **Grouped bar chart**: Multiple categories across groups
- **Stacked bar chart**: Part-to-whole comparison
- **Dot plot**: Precise comparison
- **Slope chart**: Before/after comparison

#### Relationship
- **Scatter plot**: Two continuous variables
- **Bubble chart**: Three variables (x, y, size)
- **Heatmap**: Correlation matrix
- **Pair plot**: Multiple relationships

#### Time Series
- **Line chart**: Trend over time
- **Area chart**: Cumulative values over time
- **Stacked area**: Part-to-whole over time
- **Candlestick**: OHLC data (finance)

#### Composition
- **Pie chart**: Part-to-whole (≤6 categories)
- **Donut chart**: Part-to-whole (modern pie)
- **Treemap**: Hierarchical composition
- **Sunburst**: Multi-level composition
- **Waterfall**: Sequential composition

#### Geospatial
- **Choropleth map**: Values by region
- **Bubble map**: Points with size/color
- **Heatmap map**: Density visualization

#### Hierarchy
- **Tree diagram**: Organizational structure
- **Dendrogram**: Clustering results
- **Network graph**: Relationships

#### Flow
- **Sankey diagram**: Flow quantities
- **Funnel chart**: Conversion stages
- **Alluvial diagram**: Flow between categories

### Relationship Between Variables

#### Two Continuous Variables
- **Scatter plot**: Basic relationship
- **Line plot**: Connected observations
- **Heatmap**: Density of points
- **2D density plot**: Overplotting solution

#### One Continuous, One Categorical
- **Box plot**: Distribution per category
- **Violin plot**: Distribution + density per category
- **Bar chart**: Summary statistic per category
- **Dot plot**: Individual points per category

#### Two Categorical Variables
- **Grouped bar chart**: Counts per combination
- **Stacked bar chart**: Part-to-whole per category
- **Heatmap**: Contingency table visualization
- **Mosaic plot**: Proportional areas

## Visualization Best Practices

### Title and Labels
1. **Insight-driven title**: State the main finding
   - Bad: "Sales by Region"
   - Good: "West Region Outperforms All Others by 23%"

2. **Clear axis labels**: Include units
   - Bad: "Revenue"
   - Good: "Revenue ($ millions)"

3. **Source citation**: Always cite data source

### Color Usage
1. **Sequential palettes**: Ordered data (light → dark)
2. **Diverging palettes**: Data with midpoint (two colors)
3. **Categorical palettes**: Distinct groups (distinct hues)
4. **Colorblind-friendly**: Avoid red-green combinations
5. **Consistent colors**: Same category = same color across charts

### Color Palettes
- **Sequential**: Blues, Greens, Reds (light to dark)
- **Diverging**: Blue-White-Red, Purple-White-Green
- **Categorical**: Tableau 10, Set1, Pastel1

### Annotations
1. **Key points**: Highlight important data
2. **Trend lines**: Show direction
3. **Reference lines**: Benchmarks, targets, averages
4. **Callouts**: Explain anomalies

### Axes and Scales
1. **Start bar charts at zero**: Misleading otherwise
2. **Log scale**: For wide-ranging data
3. **Dual axes**: Use sparingly, can mislead
4. **Consistent scales**: Across related charts

### Layout and Design
1. **Data-ink ratio**: Maximize data, minimize decoration
2. **White space**: Let charts breathe
3. **Gridlines**: Subtle, not distracting
4. **Font size**: Readable at presentation size

## Chart-Specific Guidelines

### Bar Charts
- **Sort bars**: By value (descending) unless ordinal
- **Horizontal bars**: For long category names
- **Grouped vs stacked**: Grouped for comparison, stacked for composition
- **Width**: Bars wider than gaps

### Line Charts
- **Points**: Show data points if few observations
- **Lines**: Smooth for trends, jagged for raw data
- **Multiple lines**: Limit to 5-7 for readability
- **Highlight**: Emphasize key lines

### Scatter Plots
- **Overplotting**: Use transparency, jitter, or density
- **Regression line**: Show trend if appropriate
- **Size encoding**: Bubble chart for third variable
- **Color encoding**: Group membership

### Heatmaps
- **Color scale**: Sequential for values, diverging for correlation
- **Annotations**: Show actual values
- **Clustering**: Group similar rows/columns
- **Size**: Square cells for correlation matrices

### Pie/Donut Charts
- **Limit categories**: 6 maximum
- **Sort**: Largest to smallest, clockwise from top
- **Avoid 3D**: Distorts proportions
- **Labels**: Direct labeling preferred over legend

### Treemaps
- **Size**: Area represents value
- **Color**: Optional encoding (another variable)
- **Hierarchy**: Nested rectangles
- **Labels**: Show category and value

### Box Plots
- **Show points**: Individual observations if few
- **Notches**: Confidence interval for median
- **Outliers**: Define and show consistently
- **Violin alternative**: Shows full distribution

## Dashboard Design

### Layout Principles
1. **F-pattern**: Most important info top-left
2. **Z-pattern**: For simple layouts
3. **Grid system**: Consistent alignment
4. **Visual hierarchy**: Size, color, position

### Component Types
1. **KPI cards**: Single metric with trend
2. **Charts**: Primary visualizations
3. **Tables**: Detailed data
4. **Filters**: Interactive controls
5. **Text**: Context and explanations

### Dashboard Structure
1. **Header**: Title, date range, key filters
2. **Summary row**: KPI cards with key metrics
3. **Main charts**: Primary visualizations
4. **Details**: Tables or secondary charts
5. **Footer**: Source, last updated

### Interactivity
1. **Filters**: Cross-filtering between charts
2. **Tooltips**: Detailed information on hover
3. **Drill-down**: From summary to detail
4. **Tooltips**: Contextual information

## Accessibility

### Color Accessibility
1. **Colorblind-safe**: Use colorblind-friendly palettes
2. **Redundant encoding**: Color + shape/pattern
3. **Contrast ratios**: Minimum 4.5:1 for text
4. **Test with tools**: Coblis, Color Oracle

### Screen Reader Support
1. **Alt text**: Describe chart content
2. **Data tables**: Provide underlying data
3. **Logical reading order**: Navigate in meaningful order

### Universal Design
1. **Multiple encodings**: Color + shape + pattern
2. **Large text**: Readable at zoom
3. **High contrast**: Dark on light or light on dark
4. **Simple language**: Avoid jargon

## Common Mistakes

1. **Truncated axes**: Misleading comparisons
2. **3D effects**: Distorts perception
3. **Too many colors**: Hard to distinguish
4. **Missing labels**: Unclear what's shown
5. **Inappropriate chart type**: Wrong visualization for data
6. **Overcrowding**: Too much information
7. **Inconsistent scales**: Comparing apples to oranges
8. **Missing zero**: Bar charts must start at zero
9. **Dual axes**: Can mislead relationships
10. **Pie chart abuse**: Too many categories, 3D, etc.

## Tools and Libraries

### Python
- **Matplotlib**: Foundation, highly customizable
- **Seaborn**: Statistical visualization, beautiful defaults
- **Plotly**: Interactive, web-based
- **Altair**: Declarative, grammar of graphics
- **Bokeh**: Interactive, web-based

### JavaScript
- **D3.js**: Maximum flexibility, steep learning curve
- **Chart.js**: Simple, responsive
- **Highcharts**: Commercial, polished
- **Plotly.js**: Interactive, Python equivalent

### Business Intelligence
- **Tableau**: Drag-and-drop, powerful
- **Power BI**: Microsoft ecosystem
- **Looker**: SQL-based, modern
- **Qlik**: Associative model

## Visualization Checklist

Before presenting any visualization:

- [ ] **Title**: Insight-driven, not topic-based
- [ ] **Labels**: Clear axis labels with units
- [ ] **Source**: Data source cited
- [ ] **Colors**: Colorblind-friendly, consistent
- [ ] **Annotations**: Key points highlighted
- [ ] **Scale**: Appropriate, starts at zero for bars
- [ ] **Legend**: Clear, positioned well
- [ ] **Resolution**: High enough for presentation
- [ ] **Accessibility**: Alt text, screen reader friendly
- [ ] **Data-ink ratio**: Maximize data, minimize decoration