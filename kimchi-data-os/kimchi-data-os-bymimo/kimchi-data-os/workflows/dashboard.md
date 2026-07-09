# Dashboard Design Workflow

## Overview
Systematic approach to designing, building, and deploying business intelligence dashboards that drive decision-making.

## Phase 1: Requirements Gathering

### 1.1 Stakeholder Analysis
```python
STAKEHOLDER_ANALYSIS = {
    "executive": {
        "needs": "High-level KPIs, trends, alerts",
        "frequency": "Daily/Weekly",
        "format": "1-page summary, mobile-friendly",
        "metrics": ["Revenue", "Growth", "Margin", "Customer Count"]
    },
    "manager": {
        "needs": "Operational metrics, team performance",
        "frequency": "Daily/Real-time",
        "format": "Detailed views, drill-down capability",
        "metrics": ["Conversion Rate", "Cycle Time", "Utilization"]
    },
    "analyst": {
        "needs": "Raw data, exploratory tools",
        "frequency": "Ad-hoc",
        "format": "Interactive, flexible",
        "metrics": ["All metrics", "Custom calculations"]
    }
}
```

### 1.2 Dashboard Objectives
```python
dashboard_requirements = {
    "purpose": "What decisions will this dashboard inform?",
    "audience": "Who will use this dashboard?",
    "update_frequency": "How often should data refresh?",
    "key_metrics": "What are the 5-7 most important KPIs?",
    "drill_down": "What details need to be accessible?",
    "alerts": "What conditions require attention?",
    "mobile": "Is mobile access required?"
}
```

## Phase 2: Data Preparation

### 2.1 Data Modeling
```python
# Star schema for dashboard
fact_tables = {
    "fact_sales": ["date_key", "product_key", "customer_key", "store_key", "revenue", "quantity"],
    "fact_web": ["date_key", "page_key", "session_id", "page_views", "bounce_rate"]
}

dimension_tables = {
    "dim_date": ["date_key", "date", "month", "quarter", "year", "is_weekend"],
    "dim_product": ["product_key", "product_name", "category", "subcategory", "price"],
    "dim_customer": ["customer_key", "customer_name", "segment", "region", "lifetime_value"],
    "dim_store": ["store_key", "store_name", "city", "state", "region"]
}
```

### 2.2 Data Aggregation
```python
import pandas as pd

# Pre-aggregate data for dashboard performance
def create_dashboard_aggregates(df):
    """Create pre-aggregated tables for dashboard"""
    
    aggregates = {
        "daily_summary": df.groupby('date').agg({
            'revenue': 'sum',
            'quantity': 'sum',
            'orders': 'count',
            'customers': 'nunique'
        }).reset_index(),
        
        "product_summary": df.groupby(['product_name', 'category']).agg({
            'revenue': 'sum',
            'quantity': 'sum',
            'margin': 'mean'
        }).reset_index(),
        
        "regional_summary": df.groupby('region').agg({
            'revenue': 'sum',
            'customers': 'nunique',
            'avg_order_value': 'mean'
        }).reset_index()
    }
    
    return aggregates
```

## Phase 3: Design

### 3.1 Layout Principles
```python
LAYOUT_PRINCIPLES = {
    "f_pattern": "Most important info top-left, reading left-to-right",
    "z_pattern": "For simple layouts, scan top-left to bottom-right",
    "grid_system": "Consistent alignment, 12-column grid",
    "visual_hierarchy": "Size, color, position guide attention",
    "white_space": "Let charts breathe, avoid clutter"
}
```

### 3.2 Component Selection
```python
COMPONENT_GUIDE = {
    "kpi_cards": {
        "use_for": "Single metric with trend",
        "example": "Revenue: $1.2M (+12% MoM)"
    },
    "line_charts": {
        "use_for": "Trends over time",
        "example": "Monthly revenue trend"
    },
    "bar_charts": {
        "use_for": "Categorical comparison",
        "example": "Revenue by product category"
    },
    "pie_donut": {
        "use_for": "Composition (≤6 categories)",
        "example": "Market share by region"
    },
    "tables": {
        "use_for": "Detailed data, exact values",
        "example": "Top 10 products by revenue"
    },
    "heatmaps": {
        "use_for": "Correlation, density",
        "example": "Sales by day of week and hour"
    }
}
```

### 3.3 Color Palette
```python
COLOR_PALETTES = {
    "sequential": ["#f7fbff", "#deebf7", "#c6dbef", "#9ecae1", "#6baed6", "#4292c6", "#2171b5", "#08519c", "#08306b"],
    "diverging": ["#d73027", "#f46d43", "#fdae61", "#fee090", "#ffffbf", "#e0f3f8", "#abd9e9", "#74add1", "#4575b4"],
    "categorical": ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf"],
    "alert": {
        "success": "#28a745",
        "warning": "#ffc107",
        "danger": "#dc3545",
        "info": "#17a2b8"
    }
}
```

## Phase 4: Implementation

### 4.1 Dashboard Structure
```python
dashboard_layout = {
    "header": {
        "title": "Sales Performance Dashboard",
        "date_range": "Last 30 days",
        "filters": ["Region", "Product Category", "Customer Segment"]
    },
    "summary_row": {
        "kpi_cards": [
            {"metric": "Total Revenue", "value": "$1.2M", "trend": "+12%", "status": "success"},
            {"metric": "Orders", "value": "8,542", "trend": "+8%", "status": "success"},
            {"metric": "Avg Order Value", "value": "$142", "trend": "-3%", "status": "warning"},
            {"metric": "Conversion Rate", "value": "3.2%", "trend": "+0.5%", "status": "success"}
        ]
    },
    "main_charts": {
        "row_1": ["revenue_trend", "orders_by_category"],
        "row_2": ["regional_performance", "top_products"]
    },
    "details": {
        "table": "Detailed product performance",
        "filters": "Interactive cross-filtering"
    }
}
```

### 4.2 Chart Specifications
```python
chart_specifications = {
    "revenue_trend": {
        "type": "line",
        "x": "date",
        "y": "revenue",
        "title": "Revenue Trend (Last 30 Days)",
        "annotations": ["Monthly target", "Key events"],
        "colors": ["#1f77b4"]
    },
    "orders_by_category": {
        "type": "bar",
        "x": "category",
        "y": "orders",
        "title": "Orders by Product Category",
        "sort": "descending",
        "colors": "categorical"
    },
    "regional_performance": {
        "type": "map",
        "location": "region",
        "value": "revenue",
        "title": "Revenue by Region",
        "color_scale": "sequential"
    },
    "top_products": {
        "type": "table",
        "columns": ["Product", "Revenue", "Orders", "Growth"],
        "sort": "Revenue",
        "limit": 10
    }
}
```

### 4.3 Interactivity
```python
interactivity_features = {
    "filters": {
        "date_range": "Date picker with presets (7d, 30d, 90d, YTD)",
        "dropdowns": ["Region", "Product Category", "Customer Segment"],
        "cross_filtering": "Click chart element to filter all other charts"
    },
    "tooltips": {
        "hover_info": "Detailed values on hover",
        "trend_indicators": "Show change vs previous period"
    },
    "drill_down": {
        "hierarchy": "Region → City → Store",
        "time": "Year → Quarter → Month → Day",
        "product": "Category → Subcategory → SKU"
    }
}
```

## Phase 5: Performance Optimization

### 5.1 Data Optimization
```python
# Aggregation strategies
optimization_strategies = {
    "pre_aggregation": "Create summary tables for common queries",
    "caching": "Cache frequently accessed data",
    "incremental_refresh": "Only update new/changed data",
    "materialized_views": "Pre-compute complex calculations"
}

# Example: Create materialized view
def create_materialized_view(df, group_cols, agg_cols, agg_funcs):
    """Create pre-aggregated view for dashboard"""
    
    view = df.groupby(group_cols).agg({col: func for col, func in zip(agg_cols, agg_funcs)}).reset_index()
    return view
```

### 5.2 Rendering Optimization
```python
# Optimize for fast rendering
rendering_optimizations = {
    "lazy_loading": "Load charts as user scrolls",
    "pagination": "Paginate large tables",
    "virtual_scrolling": "For very large datasets",
    "image_preloading": "Preload chart images",
    "debouncing": "Delay filter updates until user stops typing"
}
```

## Phase 6: Testing

### 6.1 Quality Checklist
```python
dashboard_qa = {
    "data_accuracy": [
        "Verify all numbers match source data",
        "Check calculations are correct",
        "Validate filters work properly"
    ],
    "usability": [
        "Can user find key information in 5 seconds?",
        "Are charts properly labeled?",
        "Is the color scheme accessible?"
    ],
    "performance": [
        "Dashboard loads in <3 seconds",
        "Filters update in <1 second",
        "No broken charts or errors"
    ],
    "mobile": [
        "Responsive on tablet",
        "Key info visible on mobile",
        "Touch-friendly interactions"
    ]
}
```

### 6.2 User Testing
```python
# User testing protocol
user_testing = {
    "tasks": [
        "Find today's revenue",
        "Compare performance to last month",
        "Identify top performing product",
        "Drill down into regional performance"
    ],
    "metrics": [
        "Time to complete task",
        "Accuracy of answer",
        "User satisfaction (1-5)"
    ]
}
```

## Phase 7: Deployment

### 7.1 Dashboard Documentation
```markdown
## Dashboard Documentation

### Overview
- **Dashboard Name**: [Name]
- **Purpose**: [What decisions it supports]
- **Audience**: [Who uses it]
- **Refresh Frequency**: [How often data updates]

### Data Sources
| Source | Table | Refresh Schedule |
|--------|-------|------------------|
| [Source 1] | [Table] | [Schedule] |
| [Source 2] | [Table] | [Schedule] |

### Key Metrics
| Metric | Definition | Calculation |
|--------|------------|-------------|
| [Metric 1] | [Definition] | [Formula] |
| [Metric 2] | [Definition] | [Formula] |

### Filters
| Filter | Options | Default |
|--------|---------|---------|
| [Filter 1] | [Options] | [Default] |
| [Filter 2] | [Options] | [Default] |

### Alerts
| Alert | Condition | Action |
|-------|-----------|--------|
| [Alert 1] | [Condition] | [Action] |

### Maintenance
- **Owner**: [Team/Person]
- **Last Updated**: [Date]
- **Known Issues**: [List]
```

### 7.2 Monitoring
```python
# Dashboard monitoring
monitoring_metrics = {
    "usage": {
        "daily_active_users": "Track adoption",
        "session_duration": "Engagement level",
        "filter_usage": "Which filters are used"
    },
    "performance": {
        "load_time": "Dashboard load speed",
        "query_time": "Data refresh speed",
        "error_rate": "Failed queries"
    },
    "feedback": {
        "user_satisfaction": "Survey responses",
        "feature_requests": "Enhancement ideas",
        "bug_reports": "Issues to fix"
    }
}
```

## Quality Checklist

- [ ] Requirements gathered from stakeholders
- [ ] Data sources identified and validated
- [ ] Layout follows design principles
- [ ] Charts selected appropriately
- [ ] Color scheme is accessible
- [ ] Interactivity implemented
- [ ] Performance optimized
- [ ] Mobile responsiveness tested
- [ ] User testing completed
- [ ] Documentation created
- [ ] Monitoring plan established
- [ ] Deployment plan defined