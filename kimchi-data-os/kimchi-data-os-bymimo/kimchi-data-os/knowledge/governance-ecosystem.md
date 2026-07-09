# Data Governance Ecosystem

## Overview
Comprehensive data governance framework covering privacy, compliance, lineage, reproducibility, and auditability.

## 1. Privacy Protection

### PII Detection
```python
import re

PII_PATTERNS = {
    'email': r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}',
    'phone': r'\b\d{3}[-.]?\d{3}[-.]?\d{4}\b',
    'ssn': r'\b\d{3}[-]?\d{2}[-]?\d{4}\b',
    'credit_card': r'\b\d{4}[-]?\d{4}[-]?\d{4}[-]?\d{4}\b',
    'ip_address': r'\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b',
    'address': r'\d{1,5}\s\w+\s\w+(?:\s\w+)*'
}

def detect_pii(text):
    """
    Detect PII in text using pattern matching.
    
    Returns:
        Dictionary of detected PII types and locations
    """
    detected = {}
    for pii_type, pattern in PII_PATTERNS.items():
        matches = re.finditer(pattern, text)
        if matches:
            detected[pii_type] = [match.group() for match in matches]
    return detected

def detect_pii_dataframe(df):
    """
    Detect PII columns in DataFrame.
    
    Returns:
        DataFrame with PII analysis
    """
    pii_analysis = []
    for col in df.columns:
        sample = df[col].dropna().astype(str).head(100)
        pii_counts = {}
        for text in sample:
            pii = detect_pii(text)
            for pii_type in pii.keys():
                pii_counts[pii_type] = pii_counts.get(pii_type, 0) + 1
        
        if pii_counts:
            pii_analysis.append({
                'column': col,
                'pii_types': list(pii_counts.keys()),
                'confidence': max(pii_counts.values()) / len(sample)
            })
    
    return pd.DataFrame(pii_analysis)
```

### Anonymization Techniques
```python
from faker import Faker
import hashlib

fake = Faker()

def anonymize_column(df, column, method='hash'):
    """
    Anonymize a DataFrame column.
    
    Methods:
    - hash: One-way hash
    - mask: Replace with mask
    - generalize: Reduce precision
    - pseudonymize: Replace with fake data
    """
    if method == 'hash':
        return df[column].apply(lambda x: hashlib.sha256(str(x).encode()).hexdigest()[:16])
    elif method == 'mask':
        return df[column].apply(lambda x: '*' * len(str(x)))
    elif method == 'generalize':
        return generalize_values(df[column])
    elif method == 'pseudonymize':
        return df[column].apply(lambda x: fake.name() if isinstance(x, str) else x)

def generalize_values(series):
    """Generalize values to reduce precision."""
    if pd.api.types.is_numeric_dtype(series):
        # Round to nearest 10
        return series.round(-1)
    elif pd.api.types.is_datetime64_any_dtype(series):
        # Keep only month
        return series.dt.to_period('M')
    else:
        # First letter + asterisks
        return series.apply(lambda x: str(x)[0] + '*' * (len(str(x)) - 1) if pd.notna(x) else x)

def k_anonymize(df, quasi_identifiers, k=5):
    """
    Apply k-anonymity to DataFrame.
    
    Args:
        df: Input DataFrame
        quasi_identifiers: Columns that could identify individuals
        k: Minimum group size
    
    Returns:
        k-anonymous DataFrame
    """
    grouped = df.groupby(quasi_identifiers).filter(lambda x: len(x) >= k)
    return grouped
```

### Data Masking
```python
def mask_pii(df, pii_columns, mask_type='partial'):
    """
    Mask PII in DataFrame.
    
    Args:
        df: Input DataFrame
        pii_columns: Columns containing PII
        mask_type: 'partial', 'full', or 'tokenize'
    
    Returns:
        Masked DataFrame
    """
    df_masked = df.copy()
    
    for col in pii_columns:
        if mask_type == 'partial':
            df_masked[col] = df[col].apply(partial_mask)
        elif mask_type == 'full':
            df_masked[col] = 'MASKED'
        elif mask_type == 'tokenize':
            df_masked[col] = df[col].apply(lambda x: hash(str(x)) % 10000)
    
    return df_masked

def partial_mask(value):
    """Partially mask a value."""
    s = str(value)
    if len(s) <= 4:
        return '*' * len(s)
    return s[:2] + '*' * (len(s) - 4) + s[-2:]
```

## 2. Compliance Framework

### GDPR Compliance
```python
class GDPRCompliance:
    """GDPR compliance checker."""
    
    REQUIRED_PURPOSES = ['consent', 'contract', 'legal_obligation', 'vital_interests', 'public_task', 'legitimate_interests']
    
    @staticmethod
    def check_consent(data_processing):
        """Verify consent is documented."""
        return {
            'compliant': 'consent' in data_processing,
            'requirements': ['Clear consent', 'Easy withdrawal', 'Specific purpose']
        }
    
    @staticmethod
    def check_data_minimization(columns, purpose):
        """Check if data collection is minimized."""
        necessary_columns = get_necessary_columns(purpose)
        unnecessary = set(columns) - set(necessary_columns)
        return {
            'compliant': len(unnecessary) == 0,
            'unnecessary_columns': list(unnecessary)
        }
    
    @staticmethod
    def check_retention(data, retention_period):
        """Check data retention compliance."""
        oldest_data = data['timestamp'].min()
        data_age = (datetime.now() - oldest_data).days
        return {
            'compliant': data_age <= retention_period,
            'data_age_days': data_age,
            'retention_period_days': retention_period
        }
    
    @staticmethod
    def check_rights_requests(data, rights_type):
        """Handle data subject rights requests."""
        rights_handlers = {
            'access': lambda d: d.to_dict(),
            'rectification': lambda d: d,  # Update logic here
            'erasure': lambda d: d.drop(d.index),  # Delete logic here
            'portability': lambda d: d.to_json()
        }
        return rights_handlers.get(rights_type, lambda d: None)(data)
```

### HIPAA Compliance
```python
class HIPAACompliance:
    """HIPAA compliance checker."""
    
    PHI_TYPES = [
        'name', 'address', 'dates', 'phone', 'fax', 'email',
        'ssn', 'mrn', 'account_numbers', 'certificate_numbers',
        'device_identifiers', 'urls', 'ip_addresses', 'biometrics',
        'photos', 'any_unique_identifying_number'
    ]
    
    @staticmethod
    def check_deidentification(data, method='safe_harbor'):
        """Check if data meets de-identification standards."""
        if method == 'safe_harbor':
            # Remove all 18 identifiers
            return {
                'compliant': not any(col in data.columns for col in HIPAACompliance.PHI_TYPES),
                'method': 'safe_harbor'
            }
        elif method == 'expert_determination':
            # Statistical expert must determine
            return {
                'compliant': 'expert_review' in data.attrs,
                'method': 'expert_determination'
            }
    
    @staticmethod
    def check_access_controls(user_role, data_type):
        """Verify access controls."""
        role_permissions = {
            'admin': ['read', 'write', 'delete'],
            'clinician': ['read', 'write'],
            'researcher': ['read'],
            'billing': ['read']
        }
        allowed = role_permissions.get(user_role, [])
        return {
            'compliant': 'read' in allowed,
            'allowed_actions': allowed
        }
```

### CCPA Compliance
```python
class CCPACompliance:
    """CCPA compliance checker."""
    
    @staticmethod
    def check_opt_out(data_sharing):
        """Check if opt-out mechanism exists."""
        return {
            'compliant': 'opt_out_mechanism' in data_sharing,
            'requirements': ['Do Not Sell link', 'Opt-out mechanism', 'Verification process']
        }
    
    @staticmethod
    def check_disclosure(data_collection):
        """Check disclosure requirements."""
        required_disclosures = [
            'categories_of_information',
            'purposes',
            'third_parties',
            'retention_period'
        ]
        return {
            'compliant': all(d in data_collection for d in required_disclosures),
            'missing': [d for d in required_disclosures if d not in data_collection]
        }
```

## 3. Data Lineage

### Lineage Tracking
```python
from dataclasses import dataclass
from typing import List, Dict, Any
from datetime import datetime

@dataclass
class LineageNode:
    """Represents a data transformation step."""
    id: str
    name: str
    type: str  # 'source', 'transform', 'destination'
    timestamp: datetime
    metadata: Dict[str, Any]
    inputs: List[str] = None
    outputs: List[str] = None

class DataLineage:
    """Track data lineage across transformations."""
    
    def __init__(self):
        self.nodes = {}
        self.edges = []
    
    def add_node(self, node: LineageNode):
        """Add a transformation node."""
        self.nodes[node.id] = node
        if node.inputs:
            for inp in node.inputs:
                self.edges.append((inp, node.id))
        if node.outputs:
            for out in node.outputs:
                self.edges.append((node.id, out))
    
    def get_upstream(self, node_id: str):
        """Get all upstream nodes."""
        upstream = set()
        queue = [node_id]
        while queue:
            current = queue.pop(0)
            for src, dst in self.edges:
                if dst == current and src not in upstream:
                    upstream.add(src)
                    queue.append(src)
        return upstream
    
    def get_downstream(self, node_id: str):
        """Get all downstream nodes."""
        downstream = set()
        queue = [node_id]
        while queue:
            current = queue.pop(0)
            for src, dst in self.edges:
                if src == current and dst not in downstream:
                    downstream.add(dst)
                    queue.append(dst)
        return downstream
    
    def visualize(self):
        """Generate lineage visualization."""
        import networkx as nx
        G = nx.DiGraph()
        G.add_edges_from(self.edges)
        return G
```

### Lineage Documentation
```python
def document_lineage(transformation, inputs, outputs):
    """
    Document data transformation lineage.
    
    Args:
        transformation: Transformation name/description
        inputs: Input datasets
        outputs: Output datasets
    
    Returns:
        Lineage documentation
    """
    return {
        'transformation': transformation,
        'timestamp': datetime.now().isoformat(),
        'inputs': inputs,
        'outputs': outputs,
        'hash': calculate_hash(inputs, outputs, transformation)
    }

def calculate_hash(inputs, outputs, transformation):
    """Calculate hash for lineage verification."""
    import hashlib
    content = f"{inputs}{outputs}{transformation}"
    return hashlib.sha256(content.encode()).hexdigest()
```

## 4. Reproducibility

### Code Versioning
```python
import subprocess
import json

def get_code_version():
    """Get current code version."""
    try:
        git_hash = subprocess.check_output(['git', 'rev-parse', 'HEAD']).decode().strip()
        git_branch = subprocess.check_output(['git', 'rev-parse', '--abbrev-ref', 'HEAD']).decode().strip()
        return {
            'git_hash': git_hash,
            'git_branch': git_branch,
            'timestamp': datetime.now().isoformat()
        }
    except:
        return {'git_hash': 'unknown', 'git_branch': 'unknown'}

def save_reproducibility_info(output_path):
    """Save complete reproducibility information."""
    info = {
        'code_version': get_code_version(),
        'python_version': sys.version,
        'packages': get_installed_packages(),
        'random_seed': get_random_seed(),
        'timestamp': datetime.now().isoformat()
    }
    
    with open(f'{output_path}/reproducibility.json', 'w') as f:
        json.dump(info, f, indent=2)
    
    return info

def get_installed_packages():
    """Get installed package versions."""
    import pkg_resources
    return {pkg.key: pkg.version for pkg in pkg_resources.working_set}
```

### Data Versioning
```python
import hashlib
import json

class DataVersion:
    """Track data versions."""
    
    def __init__(self, storage_path):
        self.storage_path = storage_path
        self.versions = self.load_versions()
    
    def load_versions(self):
        """Load version history."""
        try:
            with open(f'{self.storage_path}/versions.json', 'r') as f:
                return json.load(f)
        except:
            return {}
    
    def save_versions(self):
        """Save version history."""
        with open(f'{self.storage_path}/versions.json', 'w') as f:
            json.dump(self.versions, f, indent=2)
    
    def register_version(self, data_id, data, metadata=None):
        """Register a new data version."""
        data_hash = hashlib.sha256(data.tobytes()).hexdigest()
        version = len([k for k in self.versions.keys() if k.startswith(data_id)]) + 1
        
        version_info = {
            'version': version,
            'hash': data_hash,
            'timestamp': datetime.now().isoformat(),
            'metadata': metadata or {}
        }
        
        self.versions[f"{data_id}_v{version}"] = version_info
        self.save_versions()
        
        return version_info
    
    def get_version(self, data_id, version=None):
        """Get specific version."""
        if version:
            return self.versions.get(f"{data_id}_v{version}")
        # Get latest version
        versions = [(k, v) for k, v in self.versions.items() if k.startswith(data_id)]
        return max(versions, key=lambda x: x[1]['version']) if versions else None
```

### Model Versioning
```python
import pickle
import json

class ModelVersion:
    """Track model versions."""
    
    def __init__(self, storage_path):
        self.storage_path = storage_path
    
    def save_model(self, model, model_id, metrics=None, params=None):
        """Save model with versioning."""
        version = self.get_next_version(model_id)
        model_path = f'{self.storage_path}/{model_id}_v{version}.pkl'
        
        with open(model_path, 'wb') as f:
            pickle.dump(model, f)
        
        metadata = {
            'model_id': model_id,
            'version': version,
            'path': model_path,
            'timestamp': datetime.now().isoformat(),
            'metrics': metrics,
            'params': params
        }
        
        self.save_metadata(model_id, version, metadata)
        return metadata
    
    def load_model(self, model_id, version=None):
        """Load specific model version."""
        if version is None:
            version = self.get_latest_version(model_id)
        
        model_path = f'{self.storage_path}/{model_id}_v{version}.pkl'
        with open(model_path, 'rb') as f:
            return pickle.load(f)
    
    def get_next_version(self, model_id):
        """Get next version number."""
        versions = [k for k in os.listdir(self.storage_path) if k.startswith(model_id)]
        return len(versions) + 1
    
    def get_latest_version(self, model_id):
        """Get latest version number."""
        versions = [k for k in os.listdir(self.storage_path) if k.startswith(model_id)]
        if not versions:
            return 1
        return max([int(k.split('_v')[1]) for k in versions])
```

## 5. Auditability

### Audit Logging
```python
import logging
from datetime import datetime

class AuditLogger:
    """Audit logging for data operations."""
    
    def __init__(self, log_path):
        self.log_path = log_path
        self.setup_logger()
    
    def setup_logger(self):
        """Setup audit logger."""
        self.logger = logging.getLogger('audit')
        self.logger.setLevel(logging.INFO)
        
        handler = logging.FileHandler(f'{self.log_path}/audit.log')
        formatter = logging.Formatter('%(asctime)s - %(message)s')
        handler.setFormatter(formatter)
        self.logger.addHandler(handler)
    
    def log_access(self, user, resource, action, result):
        """Log data access."""
        self.logger.info(json.dumps({
            'type': 'access',
            'user': user,
            'resource': resource,
            'action': action,
            'result': result,
            'timestamp': datetime.now().isoformat()
        }))
    
    def log_transformation(self, user, transformation, inputs, outputs):
        """Log data transformation."""
        self.logger.info(json.dumps({
            'type': 'transformation',
            'user': user,
            'transformation': transformation,
            'inputs': inputs,
            'outputs': outputs,
            'timestamp': datetime.now().isoformat()
        }))
    
    def log_export(self, user, data, destination, purpose):
        """Log data export."""
        self.logger.info(json.dumps({
            'type': 'export',
            'user': user,
            'data': data,
            'destination': destination,
            'purpose': purpose,
            'timestamp': datetime.now().isoformat()
        }))
```

### Audit Trail
```python
class AuditTrail:
    """Maintain audit trail for all operations."""
    
    def __init__(self):
        self.trail = []
    
    def add_entry(self, operation, user, details, result):
        """Add audit entry."""
        entry = {
            'id': len(self.trail) + 1,
            'operation': operation,
            'user': user,
            'details': details,
            'result': result,
            'timestamp': datetime.now().isoformat(),
            'hash': self.calculate_hash(operation, user, details, result)
        }
        self.trail.append(entry)
        return entry
    
    def calculate_hash(self, *args):
        """Calculate hash for integrity verification."""
        import hashlib
        content = json.dumps(args, sort_keys=True)
        return hashlib.sha256(content.encode()).hexdigest()
    
    def verify_integrity(self):
        """Verify audit trail integrity."""
        for i, entry in enumerate(self.trail):
            expected_hash = self.calculate_hash(
                entry['operation'],
                entry['user'],
                entry['details'],
                entry['result']
            )
            if entry['hash'] != expected_hash:
                return False, i
        return True, len(self.trail)
    
    def export_trail(self, output_path):
        """Export audit trail."""
        with open(output_path, 'w') as f:
            json.dump(self.trail, f, indent=2)
```

## 6. Governance Dashboard

### Governance Metrics
```python
def calculate_governance_metrics(data_inventory):
    """
    Calculate governance metrics.
    
    Returns:
        DataFrame with governance scores
    """
    metrics = []
    
    for dataset in data_inventory:
        metrics.append({
            'dataset': dataset['name'],
            'pii_score': calculate_pii_score(dataset),
            'compliance_score': calculate_compliance_score(dataset),
            'lineage_score': calculate_lineage_score(dataset),
            'quality_score': calculate_quality_score(dataset),
            'freshness_score': calculate_freshness_score(dataset),
            'overall_score': calculate_overall_score(dataset)
        })
    
    return pd.DataFrame(metrics)

def calculate_pii_score(dataset):
    """Calculate PII risk score."""
    pii_columns = detect_pii_columns(dataset['data'])
    return max(0, 100 - len(pii_columns) * 10)

def calculate_compliance_score(dataset):
    """Calculate compliance score."""
    checks = [
        check_consent(dataset),
        check_retention(dataset),
        check_purpose_limitation(dataset)
    ]
    return sum(checks) / len(checks) * 100
```

### Governance Reports
```python
def generate_governance_report(data_inventory, output_path):
    """Generate comprehensive governance report."""
    metrics = calculate_governance_metrics(data_inventory)
    
    report = {
        'summary': {
            'total_datasets': len(data_inventory),
            'average_score': metrics['overall_score'].mean(),
            'compliant_datasets': len(metrics[metrics['overall_score'] >= 80]),
            'non_compliant_datasets': len(metrics[metrics['overall_score'] < 80])
        },
        'metrics': metrics.to_dict('records'),
        'recommendations': generate_recommendations(metrics),
        'timestamp': datetime.now().isoformat()
    }
    
    with open(f'{output_path}/governance_report.json', 'w') as f:
        json.dump(report, f, indent=2)
    
    return report
```

## 7. Best Practices

### Governance Principles
1. **Transparency**: Clear documentation of all processes
2. **Accountability**: Defined roles and responsibilities
3. **Integrity**: Data accuracy and consistency
4. **Security**: Protection against unauthorized access
5. **Compliance**: Adherence to regulations

### Implementation Checklist
- [ ] PII detection and masking implemented
- [ ] Consent management system in place
- [ ] Data retention policies defined
- [ ] Access controls configured
- [ ] Audit logging enabled
- [ ] Lineage tracking active
- [ ] Version control implemented
- [ ] Compliance checks automated
- [ ] Governance dashboard deployed
- [ ] Regular audits scheduled