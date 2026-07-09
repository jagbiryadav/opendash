# Fraud Detection Example

## Overview
Complete example of building a fraud detection system using anomaly detection and classification models.

## Business Context
- **Company**: Financial services / e-commerce
- **Problem**: Fraud losses increased 40% YoY ($2M annually)
- **Goal**: Detect fraud in real-time while minimizing false positives

## Data Sources
- Transaction data (10M transactions)
- Customer behavior data
- Merchant data
- Device fingerprinting data
- Historical fraud labels (1% fraud rate)

## Analysis Steps

### 1. Problem Framing
- Define fraud: Unauthorized transactions, account takeover, synthetic identity
- Stakeholder: CFO, Head of Risk, Compliance
- Timeline: 4 weeks

### 2. Feature Engineering
- **Velocity features**: Transaction count/amount in last hour/day/week
- **Behavioral features**: Deviation from normal patterns
- **Device features**: New device, device fingerprint match
- **Geographic features**: Distance from home, impossible travel
- **Merchant features**: Merchant risk score, category risk

### 3. Model Development
- **Approach**: Ensemble of Isolation Forest + XGBoost
- **Performance**: AUC-ROC = 0.96, Precision = 0.85, Recall = 0.78
- **Key Features**: Velocity anomalies (30%), Device mismatch (20%), Geographic anomalies (15%)

### 4. Real-time Scoring
- **Latency requirement**: <100ms
- **Threshold**: Score > 0.7 → Block, 0.4-0.7 → Review, <0.4 → Approve
- **False positive rate**: 2% (target <5%)

### 5. Alert Investigation
- **Case management**: Priority queue based on fraud amount
- **Investigation workflow**: Automated + manual review
- **Feedback loop**: Analyst decisions improve model

## Key Findings
1. 80% of fraud occurs in first 24 hours of account creation
2. Device fingerprint mismatches predict fraud with 90% precision
3. Cross-border transactions have 5x fraud rate

## Business Impact
- **Fraud reduction**: 60% decrease in fraud losses
- **False positives**: Reduced from 8% to 2%
- **Customer experience**: Fewer legitimate transactions blocked
- **ROI**: 15:1 on fraud prevention investment

## Files
- `data/` - Sample transaction data
- `notebooks/` - Analysis notebooks
- `models/` - Trained models
- `api/` - Real-time scoring API
- `reports/` - Fraud analysis reports