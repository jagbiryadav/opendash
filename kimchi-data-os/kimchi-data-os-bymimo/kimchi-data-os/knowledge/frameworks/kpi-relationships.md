# KPI Relationships & Mathematical Reasoning

## Core Business Equations

### Revenue Tree
```
Revenue = Traffic × Conversion Rate × Average Order Value

Revenue = Customers × Purchase Frequency × Average Order Value

Revenue = Units Sold × Average Price

Revenue = Market Share × Market Size
```

### Profit Tree
```
Profit = Revenue - Costs

Gross Profit = Revenue - Cost of Goods Sold

Operating Profit = Gross Profit - Operating Expenses

Net Profit = Operating Profit - Taxes - Interest

Profit Margin = Profit / Revenue
```

### Customer Value Tree
```
Customer Lifetime Value (CLV) = Average Order Value × Purchase Frequency × Customer Lifespan

CLV = (Average Revenue per User × Gross Margin) / Churn Rate

Customer Acquisition Cost (CAC) = Total Sales & Marketing Spend / New Customers Acquired

LTV:CAC Ratio = CLV / CAC

CAC Payback Period = CAC / (Average Revenue per User × Gross Margin)
```

### E-commerce Metrics
```
Conversion Rate = Orders / Sessions

Average Order Value (AOV) = Revenue / Orders

Cart Abandonment Rate = (1 - Orders / Carts) × 100

Revenue per Visitor = Revenue / Visitors

Items per Order = Total Items Sold / Total Orders
```

### SaaS Metrics
```
Monthly Recurring Revenue (MRR) = Active Subscribers × Average Revenue per User

Annual Recurring Revenue (ARR) = MRR × 12

Net Revenue Retention (NRR) = (Starting MRR + Expansion - Contraction - Churn) / Starting MRR

Churn Rate = Customers Lost / Customers at Start

Quick Ratio = (New MRR + Expansion MRR) / (Churned MRR + Contraction MRR)
```

### Marketing Metrics
```
Customer Acquisition Cost (CAC) = Marketing Spend / New Customers

Return on Ad Spend (ROAS) = Revenue from Ads / Ad Spend

Marketing ROI = (Revenue - Marketing Cost) / Marketing Cost

Click-Through Rate (CTR) = Clicks / Impressions

Cost per Click (CPC) = Spend / Clicks
```

## Diagnostic Reasoning with Equations

### Example: Revenue Declined

**Given**: Revenue dropped 18%

**Reasoning**:
```
Revenue = Traffic × Conversion Rate × AOV

Check each component:
- Traffic: +2% (stable)
- Conversion Rate: -5% (declining)
- AOV: -15% (declining)

Root Cause: AOV declined 15%
→ Investigate: Pricing, product mix, discounts
```

### Example: Profit Margin Compressed

**Given**: Profit margin dropped from 25% to 18%

**Reasoning**:
```
Profit Margin = (Revenue - Costs) / Revenue

Check each component:
- Revenue: +5% (growing)
- COGS: +15% (growing faster)
- Operating Expenses: +8% (growing)

Root Cause: COGS growing faster than revenue
→ Investigate: Supplier costs, material costs, efficiency
```

### Example: Churn Increased

**Given**: Monthly churn increased from 3% to 5%

**Reasoning**:
```
Churn Rate = Customers Lost / Customers at Start

CLV = (ARPU × Gross Margin) / Churn Rate

Impact:
- Old CLV: ($100 × 0.7) / 0.03 = $2,333
- New CLV: ($100 × 0.7) / 0.05 = $1,400
- CLV decreased 40%

Root Cause: Investigate why customers are leaving
→ Check: Product issues, competition, price sensitivity
```

## Sensitivity Analysis

### What-If Scenarios

**Question**: What if we increase marketing spend by 20%?

**Model**:
```
New Marketing Spend = Current × 1.20
Expected New Customers = New Spend / CAC
Expected Revenue = New Customers × AOV × Frequency
Expected Profit = Revenue - New Spend - Variable Costs

Calculate ROI:
ROI = (Expected Profit - Current Profit) / Additional Spend
```

### Break-Even Analysis

**Question**: How much do we need to increase conversion to hit target?

**Model**:
```
Target Revenue = Traffic × Target Conversion × AOV
Required Conversion = Target Revenue / (Traffic × AOV)
Required Improvement = (Required Conversion - Current Conversion) / Current Conversion
```

## Decomposition Frameworks

### Revenue Decomposition
```
Revenue
├── By Product
│   ├── Product A Revenue
│   ├── Product B Revenue
│   └── Product C Revenue
├── By Region
│   ├── North America
│   ├── Europe
│   └── Asia Pacific
├── By Channel
│   ├── Online
│   ├── Retail
│   └── Wholesale
└── By Customer Type
    ├── New Customers
    └── Existing Customers
```

### Cost Decomposition
```
Total Costs
├── Fixed Costs
│   ├── Rent
│   ├── Salaries
│   └── Insurance
├── Variable Costs
│   ├── Materials
│   ├── Labor
│   └── Shipping
└── Semi-Variable
    ├── Utilities
    └── Marketing
```

### Profit Decomposition
```
Profit
├── Revenue Drivers
│   ├── Volume
│   ├── Price
│   └── Mix
├── Cost Drivers
│   ├── COGS
│   ├── Operating Expenses
│   └── One-time Items
└── Margin Drivers
    ├── Gross Margin
    ├── Operating Margin
    └── Net Margin
```

## Application in Analysis

### Step 1: Identify the Metric
Revenue dropped 18%

### Step 2: Decompose Using Equation
Revenue = Traffic × Conversion × AOV

### Step 3: Test Each Component
- Traffic: +2% ✓
- Conversion: -5% ✓
- AOV: -15% ✗

### Step 4: Drill Down
AOV declined → Check product mix, pricing, discounts

### Step 5: Validate with Data
Product mix shifted to lower-priced items

### Step 6: Recommend
Address product mix strategy