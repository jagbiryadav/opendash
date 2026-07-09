# Pricing Optimization Example

## Overview
Complete example of optimizing pricing strategy using elasticity analysis and revenue optimization models.

## Business Context
- **Company**: SaaS company
- **Problem**: Pricing hasn't changed in 3 years, competitors undercut by 20%
- **Goal**: Optimize pricing to maximize revenue while maintaining market share

## Data Sources
- Transaction data (2 years, 100K transactions)
- Customer willingness-to-pay surveys (5K responses)
- Competitor pricing data
- Feature usage data
- Customer segmentation data

## Analysis Steps

### 1. Problem Framing
- Define objectives: Maximize revenue per customer
- Stakeholder: CEO, VP of Product, CFO
- Timeline: 4 weeks

### 2. Price Elasticity Analysis
- **Method**: Conjoint analysis + transaction data regression
- **Overall elasticity**: -1.8 (elastic demand)
- **Segment elasticity**: Enterprise (-0.8), SMB (-2.2), Startup (-3.1)

### 3. Value-Based Pricing
- **Feature value**: AI features worth 40% premium
- **Bundle analysis**: 3+ features bundled increases willingness-to-pay by 25%
- **Price sensitivity**: $49-$79 optimal for SMB, $99-$149 for Enterprise

### 4. Competitive Analysis
- **Price positioning**: Currently 15% below market average
- **Value differentiation**: Superior AI features justify premium
- **Threat assessment**: New entrant at 30% lower price

### 5. Pricing Strategy
- **Tier restructuring**: Good/Better/Best tiers
- **Price increase**: 20% for new customers, 10% for existing
- **Grandfathering**: Existing customers keep current price for 12 months

## Key Findings
1. 60% of customers would accept 15% price increase for better features
2. Enterprise segment has lowest price sensitivity (-0.8 elasticity)
3. AI features drive 3x higher willingness-to-pay

## Business Impact
- **Revenue increase**: 25% ($2M annually)
- **Churn impact**: <2% increase (within acceptable range)
- **Competitive position**: Maintained with value differentiation
- **Customer satisfaction**: No significant decrease (NPS stable)

## Files
- `data/` - Transaction and survey data
- `notebooks/` - Elasticity analysis notebooks
- `models/` - Pricing optimization models
- `simulation/` - Price simulation scripts
- `reports/` - Pricing analysis reports