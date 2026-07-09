# Data Governance Reference

## Data Privacy & Compliance

### PII Detection
- **Direct identifiers**: Name, email, phone, SSN, address
- **Indirect identifiers**: IP address, device ID, geolocation
- **Sensitive attributes**: Race, religion, health, financial data
- **Detection methods**: Regex patterns, NER models, data profiling

### GDPR Requirements
- **Lawful basis**: Consent, contract, legitimate interest
- **Data subject rights**: Access, rectification, erasure, portability
- **Data Protection Impact Assessment**: Required for high-risk processing
- **Breach notification**: 72 hours to supervisory authority
- **Data Protection Officer**: Required for large-scale processing

### HIPAA Requirements
- **Protected Health Information (PHI)**: Any health-related data
- **Minimum necessary**: Only access needed data
- **Business Associate Agreements**: Required for third parties
- **De-identification**: Safe Harbor or Expert Determination methods

### CCPA/CPRA Requirements
- **Right to know**: What data is collected and how it's used
- **Right to delete**: Consumer can request deletion
- **Right to opt-out**: Of sale of personal information
- **Non-discrimination**: Cannot discriminate for exercising rights

## Data Anonymization & Masking

### Anonymization Techniques
1. **Data masking**: Replace with fictional but realistic data
2. **Pseudonymization**: Replace identifiers with tokens
3. **Generalization**: Reduce precision (e.g., age → age range)
4. **Data swapping**: Exchange values between records
5. **Noise addition**: Add random noise to numerical data
6. **k-anonymity**: Each record indistinguishable from k-1 others
7. **l-diversity**: Ensure diversity in sensitive attributes
8. **t-closeness**: Ensure distribution similarity

### Masking Methods
- **Static masking**: Permanent transformation for non-production
- **Dynamic masking**: Real-time transformation based on user role
- **Format-preserving masking**: Maintain data type and format
- **Tokenization**: Replace with non-reversible tokens

## Data Lineage

### Lineage Tracking
- **Source systems**: Where data originates
- **Transformations**: What changes were made
- **Destinations**: Where data flows
- **Dependencies**: What depends on what data

### Lineage Documentation
```yaml
lineage:
  source:
    system: "CRM Database"
    table: "customers"
    extract_date: "2024-01-15"
  transformations:
    - step: "Clean null values"
      method: "Imputation"
      date: "2024-01-15"
    - step: "Standardize names"
      method: "Title case"
      date: "2024-01-15"
  destination:
    system: "Data Warehouse"
    table: "dim_customers"
    load_date: "2024-01-15"
```

### Impact Analysis
- **Upstream impact**: What source changes affect this data
- **Downstream impact**: What reports/models use this data
- **Change propagation**: How changes flow through systems

## Reproducibility

### Code Reproducibility
- **Version control**: Git for all code
- **Environment management**: Docker, conda environments
- **Dependency pinning**: Requirements.txt, lock files
- **Random seeds**: Fix all random seeds for reproducibility

### Data Reproducibility
- **Data versioning**: DVC, LakeFS, Delta Lake
- **Snapshot preservation**: Keep raw data copies
- **Pipeline versioning**: Version all transformations
- **Documentation**: Document all data processing steps

### Model Reproducibility
- **Model versioning**: MLflow, Weights & Biases
- **Hyperparameter logging**: Record all parameters
- **Training data version**: Link models to training data
- **Environment documentation**: Record software versions

## Audit Logs

### What to Log
- **Data access**: Who accessed what data when
- **Data changes**: Who modified what data
- **Model predictions**: What predictions were made
- **User actions**: What actions users took

### Log Format
```json
{
  "timestamp": "2024-01-15T10:30:00Z",
  "user": "analyst@company.com",
  "action": "data_access",
  "resource": "customer_data",
  "details": {
    "table": "customers",
    "rows_accessed": 10000,
    "columns": ["name", "email", "purchase_history"]
  },
  "ip_address": "192.168.1.100",
  "justification": "Q4 churn analysis"
}
```

### Retention Policy
- **Access logs**: 7 years
- **Change logs**: 10 years
- **Model logs**: 3 years
- **Audit trails**: Per regulatory requirements

## Data Quality Standards

### Quality Dimensions
1. **Accuracy**: Data correctly represents reality
2. **Completeness**: All required data is present
3. **Consistency**: Data is uniform across systems
4. **Timeliness**: Data is current and available when needed
5. **Validity**: Data conforms to defined formats
6. **Uniqueness**: No unwanted duplicates

### Quality Gates
- **Ingestion**: Validate source data quality
- **Transformation**: Check intermediate results
- **Loading**: Verify target data quality
- **Reporting**: Validate final outputs

### Quality Monitoring
- **Automated checks**: Run quality checks on schedule
- **Alerting**: Notify when quality drops below threshold
- **Dashboards**: Monitor quality trends over time
- **Reporting**: Regular quality scorecards

## Access Control

### Role-Based Access Control (RBAC)
- **Data Analyst**: Read access to analytical data
- **Data Engineer**: Write access to pipelines
- **Data Scientist**: Read/write to model data
- **Data Steward**: Full access with audit responsibilities
- **Executive**: Read access to dashboards and reports

### Principle of Least Privilege
- **Minimum necessary**: Only access needed data
- **Time-limited**: Access expires after defined period
- **Purpose-bound**: Access tied to specific business need
- **Revocable**: Access can be revoked immediately

### Access Request Process
1. **Request**: User submits access request
2. **Approval**: Manager and data owner approve
3. **Provisioning**: Access granted with least privilege
4. **Monitoring**: Access usage is logged and monitored
5. **Review**: Periodic access review and recertification

## Data Ethics

### Ethical Principles
1. **Beneficence**: Data use should benefit society
2. **Non-maleficence**: Avoid harm from data use
3. **Autonomy**: Respect individual choices
4. **Justice**: Fair and equitable data use
5. **Transparency**: Open about data practices

### Bias Detection
- **Sampling bias**: Is the data representative?
- **Measurement bias**: Are measurements accurate?
- **Selection bias**: How were subjects selected?
- **Confirmation bias**: Are we seeking confirming evidence?

### Fairness Metrics
- **Demographic parity**: Equal outcome rates across groups
- **Equalized odds**: Equal true positive and false positive rates
- **Calibration**: Equal predicted probabilities across groups
- **Individual fairness**: Similar individuals treated similarly

## Data Retention & Disposal

### Retention Schedule
| Data Type | Retention Period | Legal Basis | Disposal Method |
|-----------|------------------|-------------|-----------------|
| Customer PII | Duration of relationship + 7 years | GDPR/CCPA | Secure deletion |
| Financial records | 7 years | Tax regulations | Archive then delete |
| Marketing data | 3 years | Legitimate interest | Anonymize or delete |
| Employee data | Employment + 7 years | Labor regulations | Secure deletion |
| Logs | 1 year | Security requirements | Automatic purge |

### Secure Disposal
- **Digital data**: Cryptographic erasure, secure overwriting
- **Physical media**: Degaussing, physical destruction
- **Cloud data**: Verify provider's deletion procedures
- **Third-party data**: Confirm contractual deletion obligations