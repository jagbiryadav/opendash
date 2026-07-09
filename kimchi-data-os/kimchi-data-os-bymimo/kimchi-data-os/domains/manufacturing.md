# Manufacturing Domain Pack

## Overview
Specialized knowledge, metrics, and workflows for manufacturing analytics.

## Key Metrics

### Production Metrics
| Metric | Formula | Benchmark | Purpose |
|--------|---------|-----------|---------|
| Overall Equipment Effectiveness | Availability × Performance × Quality | >85% | Effectiveness |
| Availability | Run Time / Planned Production Time | >90% | Uptime |
| Performance | (Ideal Cycle Time × Count) / Run Time | >95% | Speed |
| Quality | Good Count / Total Count | >99% | First-pass yield |
| Throughput | Units Produced / Time | Varies | Output rate |

### Quality Metrics
| Metric | Formula | Benchmark | Purpose |
|--------|---------|-----------|---------|
| First Pass Yield | Good Units / Total Units | >98% | Quality at first pass |
| Defect Rate | Defective Units / Total Units | <1% | Quality level |
| DPMO | (Defects / Opportunities) × 1M | <3.4 | Six Sigma |
| Scrap Rate | Scrap Material / Total Material | <2% | Material waste |
| Rework Rate | Reworked Units / Total Units | <3% | Quality issues |

### Efficiency Metrics
| Metric | Formula | Benchmark | Purpose |
|--------|---------|-----------|---------|
| Labor Utilization | Direct Labor Time / Total Time | >85% | Labor efficiency |
| Machine Utilization | Run Time / Total Time | >80% | Equipment usage |
| Capacity Utilization | Actual Output / Max Output | 70-85% | Capacity usage |
| Changeover Time | Time between product changes | Minimal | Setup efficiency |
| OLE | Availability × Performance × Quality (labor) | >80% | Labor productivity |

### Maintenance Metrics
| Metric | Formula | Benchmark | Purpose |
|--------|---------|-----------|---------|
| MTBF | Total Run Time / Failures | Higher is better | Reliability |
| MTTR | Total Repair Time / Repairs | Lower is better | Repair efficiency |
| Planned vs Unplanned | Planned Hours / Total Hours | >80% | Planning |
| Maintenance Cost/Unit | Total Maintenance Cost / Units | Varies | Cost efficiency |
| Failure Rate | Failures / Operating Time | Lower is better | Reliability |

### Cost Metrics
| Metric | Formula | Benchmark | Purpose |
|--------|---------|-----------|---------|
| Cost per Unit | Total Cost / Units | Varies | Unit economics |
| Material Cost/Unit | Material Cost / Units | Varies | Material efficiency |
| Labor Cost/Unit | Labor Cost / Units | Varies | Labor efficiency |
| Overhead Cost/Unit | Overhead / Units | Varies | Overhead allocation |
| Cost Variance | (Actual - Standard) / Standard | <5% | Cost control |

### Delivery Metrics
| Metric | Formula | Benchmark | Purpose |
|--------|---------|-----------|---------|
| On-Time Delivery | On-Time Orders / Total Orders | >95% | Delivery performance |
| Lead Time | Days from order to delivery | Varies | Speed |
| Fill Rate | Shipped / Ordered | >98% | Fulfillment |
| Perfect Order Rate | Perfect Orders / Total Orders | >95% | Order quality |
| Backorder Rate | Backordered / Ordered | <2% | Stock availability |

## Common Analysis Patterns

### OEE Optimization
1. Decompose OEE into components
2. Identify biggest losses
3. Prioritize improvement opportunities
4. Implement changes
5. Measure impact

### Quality Improvement
1. Pareto analysis of defects
2. Root cause analysis (Fishbone, 5 Whys)
3. Statistical process control
4. Design of experiments
5. Continuous improvement (Kaizen)

### Predictive Maintenance
1. Sensor data collection
2. Failure pattern analysis
3. Remaining useful life prediction
4. Maintenance scheduling optimization
5. Cost-benefit analysis

### Supply Chain Optimization
1. Demand forecasting
2. Inventory optimization
3. Supplier performance analysis
4. Logistics optimization
5. Risk management

## Manufacturing-Specific Workflows

### OEE Analysis
```python
# Calculate and analyze OEE
def analyze_oee(availability, performance, quality):
    """
    Calculate OEE and identify losses:
    1. Availability losses (downtime)
    2. Performance losses (speed)
    3. Quality losses (defects)
    4. Improvement recommendations
    """
    oee = availability * performance * quality
    return oee
```

### Predictive Maintenance Model
```python
# Build predictive maintenance model
def build_predictive_maintenance(sensor_data, failure_data):
    """
    Develop predictive maintenance:
    1. Feature engineering from sensor data
    2. Failure prediction model
    3. Remaining useful life estimation
    4. Maintenance scheduling
    """
    pass
```

### Quality Control Chart
```python
# Create control charts
def create_control_chart(measurements, limits):
    """
    Implement statistical process control:
    1. Calculate control limits
    2. Detect special cause variation
    3. Identify process shifts
    4. Trigger corrective actions
    """
    pass
```

## Data Sources

### Internal Data
- SCADA/MES systems
- ERP systems
- Quality management systems
- Maintenance management systems
- Production scheduling systems

### External Data
- Supplier data
- Weather data
- Market demand data
- Equipment specifications
- Industry benchmarks

## Common Challenges

1. **Data integration**: Multiple systems and formats
2. **Real-time requirements**: Need for immediate insights
3. **Process complexity**: Many interacting variables
4. **Quality variability**: Natural process variation
5. **Equipment downtime**: Unplanned stoppages

## Industry Standards

- **ISO 9001**: Quality management systems
- **ISO 14001**: Environmental management
- **IATF 16949**: Automotive quality
- **AS9100**: Aerospace quality
- **FDA 21 CFR Part 11**: Pharmaceutical

## Recommended Tools

- **Python**: pandas, scikit-learn, statsmodels
- **BI**: Tableau, Power BI, Looker
- **Specialized**: Siemens, Rockwell, AVEVA
- **Programming**: SQL, Python, R
- **MES**: SAP ME, Wonderware, Apriso
