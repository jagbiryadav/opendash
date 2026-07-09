# Visualization Library

## Overview
Comprehensive visualization knowledge base with chart selection, design principles, and implementation examples.

## 1. Chart Selection Guide

### Data Type → Chart Mapping

| Data Relationship | Recommended Chart | When to Use | Avoid When |
|-------------------|-------------------|-------------|------------|
| **Distribution** | Histogram | Single continuous variable | Categorical data |
| | Box Plot | Distribution with outliers | Small datasets |
| | Violin Plot | Distribution + density | Simple comparisons |
| | Density Plot | Smooth distribution | Discrete data |
| **Comparison** | Bar Chart | Categorical comparison | Many categories (>10) |
| | Grouped Bar | Multiple categories across groups | Too many groups |
| | Stacked Bar | Part-to-whole comparison | Precise comparison |
| | Dot Plot | Precise value comparison | Large ranges |
| | Slope Chart | Before/after comparison | Multiple time points |
| **Relationship** | Scatter Plot | Two continuous variables | Too many points (use density) |
| | Bubble Chart | Three variables (x, y, size) | More than 3 variables |
| | Heatmap | Correlation matrix | Sparse data |
| | Pair Plot | Multiple relationships | Large datasets |
| **Time Series** | Line Chart | Trend over time | Discrete time points |
| | Area Chart | Cumulative values | Negative values |
| | Stacked Area | Part-to-whole over time | Many categories |
| | Candlestick | OHLC data (finance) | Non-financial data |
| **Composition** | Pie Chart | Part-to-whole (≤6 slices) | Many categories |
| | Donut Chart | Part-to-whole (modern) | Precise comparison |
| | Treemap | Hierarchical composition | Flat data |
| | Sunburst | Multi-level composition | Simple composition |
| | Waterfall | Sequential composition | Non-sequential |
| **Geospatial** | Choropleth | Values by region | Point data |
| | Bubble Map | Points with size/color | Dense regions |
| | Heatmap Map | Density visualization | Sparse data |
| **Hierarchy** | Tree Diagram | Organizational structure | Flat data |
| | Dendrogram | Clustering results | Non-hierarchical |
| | Network Graph | Relationships | Simple relationships |
| **Flow** | Sankey Diagram | Flow quantities | Simple flows |
| | Funnel Chart | Conversion stages | Non-sequential |
| | Alluvial Diagram | Flow between categories | Simple categories |

## 2. Color Systems

### Color Palettes

#### Sequential (Ordered Data)
```python
SEQUENTIAL_PALETTES = {
    'blues': ['#f7fbff', '#deebf7', '#c6dbef', '#9ecae1', '#6baed6', '#4292c6', '#2171b5', '#08519c', '#08306b'],
    'greens': ['#f7fcf5', '#e5f5e0', '#c7e9c0', '#a1d99b', '#74c476', '#41ab5d', '#238b45', '#006d2c', '#00441b'],
    'reds': ['#fff5f0', '#fee0d2', '#fcbba1', '#fc9272', '#fb6a4a', '#ef3b2c', '#cb181d', '#a50f15', '#67000d'],
    'purples': ['#fcfbfd', '#efedf5', '#dadaeb', '#bcbddc', '#9e9ac8', '#807dba', '#6a51a3', '#54278f', '#3f007d']
}
```

#### Diverging (Two Colors)
```python
DIVERGING_PALETTES = {
    'red_blue': ['#d73027', '#f46d43', '#fdae61', '#fee090', '#ffffbf', '#e0f3f8', '#abd9e9', '#74add1', '#4575b4'],
    'red_green': ['#d73027', '#f46d43', '#fdae61', '#fee08b', '#ffffbf', '#d9ef8b', '#a6d96a', '#66bd63', '#1a9850'],
    'purple_green': ['#7b3294', '#c2a5cf', '#f7f7f7', '#a6dba0', '#008837']
}
```

#### Categorical (Distinct Groups)
```python
CATEGORICAL_PALETTES = {
    'tableau10': ['#4e79a7', '#f28e2b', '#e15759', '#76b7b2', '#59a14f', '#edc948', '#b07aa1', '#ff9da7', '#9c755f', '#bab0ac'],
    'set1': ['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00', '#ffff33', '#a65628', '#f781bf', '#999999'],
    'pastel1': ['#fbb4ae', '#b3cde3', '#ccebc5', '#decbe4', '#fed9a6', '#ffffcc', '#e5d8bd', '#fddaec', '#f2f2f2']
}
```

#### Colorblind-Friendly
```python
COLORBLIND_FRIENDLY = {
    'wong': ['#000000', '#E69F00', '#56B4E9', '#009E73', '#F0E442', '#0072B2', '#D55E00', '#CC79A7'],
    'tol': ['#332288', '#88CCEE', '#44AA99', '#117733', '#999933', '#DDCC77', '#CC6677', '#882255']
}
```

### Color Usage Rules
1. **Sequential palettes**: For ordered data (light → dark)
2. **Diverging palettes**: For data with midpoint (two colors)
3. **Categorical palettes**: For distinct groups (distinct hues)
4. **Colorblind-safe**: Avoid red-green combinations
5. **Consistent colors**: Same category = same color across charts

## 3. Typography

### Font Pairings
```python
FONT_PAIRINGS = {
    'professional': {
        'heading': 'Arial, Helvetica, sans-serif',
        'body': 'Georgia, serif',
        'code': 'Courier New, monospace'
    },
    'modern': {
        'heading': 'Roboto, sans-serif',
        'body': 'Open Sans, sans-serif',
        'code': 'Source Code Pro, monospace'
    },
    'classic': {
        'heading': 'Times New Roman, serif',
        'body': 'Times New Roman, serif',
        'code': 'Courier, monospace'
    }
}
```

### Font Sizes
```python
FONT_SIZES = {
    'title': 24,
    'subtitle': 18,
    'heading': 16,
    'subheading': 14,
    'body': 12,
    'caption': 10,
    'small': 8
}
```

## 4. Layout Principles

### Grid System
```python
LAYOUT_GRID = {
    '12_column': {
        'description': 'Standard 12-column grid',
        'gutter': '20px',
        'margin': '20px',
        'breakpoints': {
            'mobile': '576px',
            'tablet': '768px',
            'desktop': '992px',
            'large': '1200px'
        }
    }
}
```

### Visual Hierarchy
```python
VISUAL_HIERARCHY = {
    'size': 'Larger = more important',
    'color': 'Brighter/bolder = more attention',
    'position': 'Top-left = first attention (F-pattern)',
    'contrast': 'Higher contrast = more prominent',
    'whitespace': 'More space = more emphasis'
}
```

## 5. Chart Specifications

### Bar Chart
```python
def create_bar_chart(data, x_col, y_col, title, orientation='vertical'):
    """
    Create optimized bar chart.
    
    Args:
        data: DataFrame
        x_col: Category column
        y_col: Value column
        chart_title: Chart title
        orientation: 'vertical' or 'horizontal'
    
    Returns:
        Plotly figure
    """
    import plotly.express as px
    
    fig = px.bar(data, x=x_col, y=y_col, title=title, orientation=orientation)
    
    fig.update_layout(
        title_x=0.5,
        xaxis_title=x_col.replace('_', ' ').title(),
        yaxis_title=y_col.replace('_', ' ').title(),
        showlegend=False
    )
    
    return fig
```

### Line Chart
```python
def create_line_chart(data, x_col, y_cols, title, markers=True):
    """
    Create optimized line chart.
    
    Args:
        data: DataFrame
        x_col: Time column
        y_cols: Value columns (list)
        chart_title: Chart title
        markers: Show data points
    
    Returns:
        Plotly figure
    """
    import plotly.express as px
    
    fig = px.line(data, x=x_col, y=y_cols, title=title, markers=markers)
    
    fig.update_layout(
        title_x=0.5,
        xaxis_title=x_col.replace('_', ' ').title(),
        legend_title='Series',
        hovermode='x unified'
    )
    
    return fig
```

### Scatter Plot
```python
def create_scatter_plot(data, x_col, y_col, color_col=None, size_col=None, title=''):
    """
    Create optimized scatter plot.
    
    Args:
        data: DataFrame
        x_col: X axis column
        y_col: Y axis column
        color_col: Color grouping column
        size_col: Size column
        chart_title: Chart title
    
    Returns:
        Plotly figure
    """
    import plotly.express as px
    
    fig = px.scatter(data, x=x_col, y=y_col, color=color_col, size=size_col, title=title)
    
    fig.update_layout(
        title_x=0.5,
        xaxis_title=x_col.replace('_', ' ').title(),
        yaxis_title=y_col.replace('_', ' ').title()
    )
    
    return fig
```

### Heatmap
```python
def create_heatmap(data, title='', colorscale='RdBu_r'):
    """
    Create correlation heatmap.
    
    Args:
        data: Correlation matrix
        chart_title: Chart title
        colorscale: Color scale
    
    Returns:
        Plotly figure
    """
    import plotly.graph_objects as go
    
    fig = go.Figure(data=go.Heatmap(
        z=data.values,
        x=data.columns,
        y=data.index,
        colorscale=colorscale
    ))
    
    fig.update_layout(
        title=title,
        title_x=0.5,
        xaxis_title='',
        yaxis_title=''
    )
    
    return fig
```

### Box Plot
```python
def create_box_plot(data, x_col, y_col, title=''):
    """
    Create optimized box plot.
    
    Args:
        data: DataFrame
        x_col: Category column
        y_col: Value column
        chart_title: Chart title
    
    Returns:
        Plotly figure
    """
    import plotly.express as px
    
    fig = px.box(data, x=x_col, y=y_col, title=title)
    
    fig.update_layout(
        title_x=0.5,
        xaxis_title=x_col.replace('_', ' ').title(),
        yaxis_title=y_col.replace('_', ' ').title()
    )
    
    return fig
```

## 6. Dashboard Design

### Layout Template
```python
DASHBOARD_LAYOUT = {
    'header': {
        'height': '80px',
        'contains': ['title', 'date_range', 'filters']
    },
    'summary_row': {
        'height': '100px',
        'columns': 4,
        'contains': ['kpi_card', 'kpi_card', 'kpi_card', 'kpi_card']
    },
    'main_content': {
        'height': '400px',
        'columns': 2,
        'contains': ['chart', 'chart']
    },
    'details': {
        'height': '300px',
        'columns': 1,
        'contains': ['table']
    }
}
```

### KPI Card Component
```python
def create_kpi_card(title, value, change=None, trend=None):
    """
    Create KPI card component.
    
    Args:
        title: Metric name
        value: Current value
        change: Change from previous period
        trend: 'up', 'down', or 'neutral'
    
    Returns:
        HTML component
    """
    trend_colors = {
        'up': '#28a745',
        'down': '#dc3545',
        'neutral': '#6c757d'
    }
    
    trend_icons = {
        'up': '▲',
        'down': '▼',
        'neutral': '●'
    }
    
    html = f"""
    <div style="background: white; border-radius: 8px; padding: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <div style="color: #6c757d; font-size: 14px;">{title}</div>
        <div style="font-size: 32px; font-weight: bold; margin: 10px 0;">{value}</div>
        <div style="color: {trend_colors.get(trend, '#6c757d')};">
            {trend_icons.get(trend, '')} {change}
        </div>
    </div>
    """
    return html
```

## 7. Accessibility

### Color Accessibility
```python
def check_color_accessibility(color1, color2):
    """
    Check if color combination is accessible.
    
    Returns:
        Accessibility score and recommendations
    """
    # Calculate contrast ratio
    contrast_ratio = calculate_contrast_ratio(color1, color2)
    
    # WCAG guidelines
    if contrast_ratio >= 7:
        grade = 'AAA'
    elif contrast_ratio >= 4.5:
        grade = 'AA'
    else:
        grade = 'Fail'
    
    return {
        'contrast_ratio': contrast_ratio,
        'grade': grade,
        'accessible': contrast_ratio >= 4.5
    }

def calculate_contrast_ratio(hex1, hex2):
    """Calculate contrast ratio between two colors."""
    def hex_to_rgb(hex_color):
        hex_color = hex_color.lstrip('#')
        return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))
    
    def relative_luminance(rgb):
        r, g, b = [x/255 for x in rgb]
        r = r/12.92 if r <= 0.03928 else ((r+0.055)/1.055)**2.4
        g = g/12.92 if g <= 0.03928 else ((g+0.055)/1.055)**2.4
        b = b/12.92 if b <= 0.03928 else ((b+0.055)/1.055)**2.4
        return 0.2126*r + 0.7152*g + 0.0722*b
    
    rgb1 = hex_to_rgb(hex1)
    rgb2 = hex_to_rgb(hex2)
    
    l1 = relative_luminance(rgb1)
    l2 = relative_luminance(rgb2)
    
    lighter = max(l1, l2)
    darker = min(l1, l2)
    
    return (lighter + 0.05) / (darker + 0.05)
```

### Screen Reader Support
```python
def add_alt_text(chart, description):
    """
    Add alt text to chart for screen readers.
    
    Args:
        chart: Plotly figure
        description: Text description
    
    Returns:
        Updated figure
    """
    chart.update_layout(
        title=description,
        # Add aria-label for screen readers
    )
    return chart
```

## 8. Best Practices

### Design Principles
1. **Data-ink ratio**: Maximize data, minimize decoration
2. **Gestalt principles**: Proximity, similarity, enclosure
3. **F-pattern**: Most important info top-left
4. **Consistency**: Same style across dashboard
5. **Simplicity**: One insight per chart

### Common Mistakes
1. **3D effects**: Distorts perception
2. **Too many colors**: Hard to distinguish
3. **Missing labels**: Unclear what's shown
4. **Inappropriate chart type**: Wrong visualization for data
5. **Overcrowding**: Too much information
6. **Truncated axes**: Misleading comparisons
7. **Dual axes**: Can mislead relationships
8. **Pie chart abuse**: Too many categories

### Quality Checklist
- [ ] Title is insight-driven
- [ ] Axes labeled with units
- [ ] Source cited
- [ ] Colors are colorblind-friendly
- [ ] Annotations highlight key points
- [ ] Scale is appropriate
- [ ] Legend is clear
- [ ] Resolution is high
- [ ] Alt text provided
- [ ] Data-ink ratio optimized