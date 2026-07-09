# Business Decision Trees

## Revenue Decline Tree

```
Revenue Down
├── Is demand lower?
│   ├── YES → Investigate marketing effectiveness
│   │   ├── Marketing spend reduced?
│   │   │   ├── YES → Restore marketing budget
│   │   │   └── NO → Investigate marketing efficiency
│   │   │       ├── CTR declining?
│   │   │       │   ├── YES → Improve creative/targeting
│   │   │       │   └── NO → Check channel mix
│   │   └── Market demand declining?
│   │       ├── YES → Investigate macro factors
│   │       └── NO → Check competitive pressure
│   └── NO → Investigate conversion/capacity
│       ├── Conversion rate declining?
│       │   ├── YES → Investigate UX/pricing
│       │   └── NO → Check capacity constraints
│       └── Inventory available?
│           ├── YES → Check pricing strategy
│           └── NO → Investigate supply chain
```

## Churn Increase Tree

```
Churn Increasing
├── Is it product-related?
│   ├── YES → Investigate product issues
│   │   ├── Feature complaints?
│   │   │   ├── YES → Prioritize feature development
│   │   │   └── NO → Check quality/reliability
│   │   └── UX issues?
│   │       ├── YES → Conduct UX research
│   │       └── NO → Check onboarding
│   └── NO → Investigate external factors
│       ├── Competitive offer?
│       │   ├── YES → Competitive analysis
│       │   └── NO → Check market conditions
│       └── Price sensitivity?
│           ├── YES → Review pricing strategy
│           └── NO → Check customer success
```

## Conversion Drop Tree

```
Conversion Dropping
├── Traffic quality issue?
│   ├── YES → Investigate acquisition channels
│   │   ├── New traffic sources?
│   │   │   ├── YES → Check channel quality
│   │   │   └── NO → Review targeting
│   │   └── Seasonal pattern?
│   │       ├── YES → Expected variation
│   │       └── NO → Investigate further
│   └── NO → On-site issue?
│       ├── Landing page problem?
│       │   ├── YES → A/B test pages
│       │   └── NO → Check site performance
│       └── Checkout friction?
│           ├── YES → Simplify checkout
│           └── NO → Review pricing/trust
```

## Cost Increase Tree

```
Costs Rising
├── Variable costs increasing?
│   ├── YES → Investigate cost drivers
│   │   ├── Material costs?
│   │   │   ├── YES → Negotiate/supplier review
│   │   │   └── NO → Check labor costs
│   │   └── Volume-driven?
│   │       ├── YES → Check efficiency
│   │       └── NO → Investigate waste
│   └── NO → Fixed costs increasing?
│       ├── YES → Review overhead
│       │   ├── Rent/facilities?
│       │   │   ├── YES → Renegotiate/optimize
│       │   │   └── NO → Check technology costs
│       │   └── Headcount?
│       │       ├── YES → Review staffing model
│       │       └── NO → Check vendor contracts
│       └── NO → One-time costs?
│           ├── YES → Categorize and plan
│           └── NO → Verify data accuracy
```

## Growth Opportunity Tree

```
Growth Opportunity
├── Market expansion possible?
│   ├── YES → Evaluate market entry
│   │   ├── New geographies?
│   │   │   ├── YES → Market sizing + entry strategy
│   │   │   └── NO → Check new segments
│   │   └── New customer types?
│   │       ├── YES → Segment analysis
│   │       └── NO → Check product extensions
│   └── NO → Existing market deepening?
│       ├── Wallet share increase?
│       │   ├── YES → Cross-sell/upsell analysis
│       │   └── NO → Check retention improvement
│       └── Pricing optimization?
│           ├── YES → Price elasticity analysis
│           └── NO → Check operational efficiency
```

## How to Use Decision Trees

1. **Start at root**: Identify the business problem
2. **Answer questions**: Each branch is a yes/no question
3. **Follow the path**: Each answer leads to next investigation
4. **Stop at actionable cause**: When you find something you can act on
5. **Validate with data**: Don't assume - verify with evidence

## Rules

- **Never skip levels**: Each question matters
- **Validate before proceeding**: Don't assume YES/NO without data
- **Document the path**: Record which branches you took
- **Consider multiple paths**: Sometimes multiple causes exist
- **Update as new evidence emerges**: Trees evolve with understanding