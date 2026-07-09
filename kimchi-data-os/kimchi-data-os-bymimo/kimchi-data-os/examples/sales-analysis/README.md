# Sales Analysis Example

## Overview
Complete example of analyzing sales performance to identify trends, diagnose issues, and recommend actions.

## Business Context
- **Company**: E-commerce retailer
- **Problem**: Sales dropped 18% in Q3
- **Goal**: Identify root causes and recommend recovery strategies

## Data Sources
- Transaction data (100K orders)
- Customer data (50K customers)
- Product catalog (5K products)
- Marketing campaign data

## Analysis Steps

### 1. Problem Framing
- Define success criteria: Identify top 3 drivers of sales decline
- Stakeholder: VP of Sales, CMO
- Timeline: 1 week

### 2. Data Quality Assessment
- Missing values: 2% in customer demographics
- Data range: Jan 2024 - Sep 2024
- Quality score: 87/100

### 3. Exploratory Analysis
- Overall trend: 18% decline from Q2 to Q3
- Seasonal pattern: Historical Q3 shows 5% decline (not 18%)
- Segment analysis: Enterprise segment down 35%, SMB down 5%

### 4. Root Cause Analysis
- Pareto analysis: 80% of decline from 3 product categories
- Cohort analysis: Existing customers reduced purchase frequency
- Correlation: Marketing spend down 25% in Q3

### 5. Recommendations
1. Restore marketing spend to Q2 levels (+$50K/month)
2. Launch re-engagement campaign for lapsed customers
3. Investigate enterprise segment pricing strategy

## Key Findings
1. Marketing spend reduction explains 60% of decline
2. Enterprise segment pricing uncompetitive vs. new entrant
3. Seasonal adjustment shows underlying growth of 3%

## Files
- `data/` - Sample datasets
- `notebooks/` - Jupyter notebooks with analysis
- `reports/` - Generated reports and visualizations
- `scripts/` - Reusable analysis scripts