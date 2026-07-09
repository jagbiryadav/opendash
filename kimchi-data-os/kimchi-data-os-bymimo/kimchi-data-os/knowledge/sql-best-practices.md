# SQL Best Practices Reference

## Query Optimization

### Indexing Strategies
1. **B-tree indexes**: Default, good for equality and range queries
2. **Hash indexes**: Fast equality lookups, no range support
3. **Composite indexes**: Multi-column, order matters (most selective first)
4. **Covering indexes**: Include all columns needed in query
5. **Partial indexes**: Index subset of rows (WHERE condition)
6. **GIN indexes**: For arrays, JSONB, full-text search
7. **GiST indexes**: For geometric data, full-text search

### Query Tuning
1. **EXPLAIN ANALYZE**: Check execution plan
2. **Avoid SELECT ***: Only select needed columns
3. **Use WHERE filtering**: Early row elimination
4. **Join optimization**: Smaller tables first, proper join types
5. **Subquery vs JOIN**: Sometimes subqueries are faster
6. **LIMIT early**: Reduce result set quickly
7. **Avoid functions on indexed columns**: Prevents index usage

### Common Performance Issues
1. **N+1 queries**: Use JOINs or batch loading
2. **Cartesian products**: Missing JOIN conditions
3. **Missing indexes**: Full table scans
4. **Over-indexing**: Slows down writes
5. **Poor data types**: Wrong types cause conversions
6. **Locking**: Long-running transactions block others

## Data Modeling

### Normal Forms
1. **1NF**: Atomic values, no repeating groups
2. **2NF**: 1NF + no partial dependencies
3. **3NF**: 2NF + no transitive dependencies
4. **BCNF**: Every determinant is a candidate key

### Denormalization
- **When**: Read-heavy workloads, reporting
- **Trade-offs**: Faster reads, slower writes, data redundancy
- **Techniques**: Materialized views, computed columns, summary tables

### Star Schema
- **Fact table**: Measures (sales, quantity, revenue)
- **Dimension tables**: Attributes (product, customer, time)
- **Benefits**: Simple queries, good for BI tools

### Snowflake Schema
- **Normalized dimensions**: Dimension tables normalized
- **Benefits**: Less redundancy, smaller storage
- **Trade-offs**: More complex queries

## Data Quality

### Constraints
1. **NOT NULL**: Required fields
2. **UNIQUE**: No duplicate values
3. **PRIMARY KEY**: Unique identifier
4. **FOREIGN KEY**: Referential integrity
5. **CHECK**: Custom validation rules
6. **DEFAULT**: Fallback values

### Data Validation
1. **Range checks**: Values within bounds
2. **Format checks**: Email, phone, URL patterns
3. **Referential checks**: Foreign keys exist
4. **Business rules**: Custom validation logic

### Data Cleaning
1. **Standardize formats**: Dates, numbers, text
2. **Handle missing values**: NULL, default, imputation
3. **Remove duplicates**: DISTINCT, ROW_NUMBER()
4. **Correct typos**: CASE statements, lookup tables

## Window Functions

### Ranking
- **ROW_NUMBER()**: Sequential numbering (1, 2, 3...)
- **RANK()**: Gaps for ties (1, 2, 2, 4...)
- **DENSE_RANK()**: No gaps for ties (1, 2, 2, 3...)

### Aggregate
- **SUM() OVER()**: Running total
- **AVG() OVER()**: Moving average
- **COUNT() OVER()**: Running count
- **MIN()/MAX() OVER()**: Running min/max

### Navigation
- **LAG()**: Previous row value
- **LEAD()**: Next row value
- **FIRST_VALUE()**: First value in window
- **LAST_VALUE()**: Last value in window

### Partitioning
- **PARTITION BY**: Reset calculations per group
- **ORDER BY**: Define row ordering within partition
- **ROWS/RANGE**: Frame specification

## Common Patterns

### Deduplication
```sql
-- Keep first occurrence
WITH deduped AS (
  SELECT *,
    ROW_NUMBER() OVER (PARTITION BY id ORDER BY created_at) as rn
  FROM table
)
SELECT * FROM deduped WHERE rn = 1;
```

### Gaps and Islands
```sql
-- Find consecutive sequences
WITH numbered AS (
  SELECT *,
    ROW_NUMBER() OVER (ORDER BY date) - 
    DENSE_RANK() OVER (ORDER BY category) as group_id
  FROM table
)
SELECT MIN(date), MAX(date), category, COUNT(*)
FROM numbered
GROUP BY category, group_id;
```

### Running Totals
```sql
SELECT date, amount,
  SUM(amount) OVER (ORDER BY date) as running_total
FROM table;
```

### Moving Averages
```sql
SELECT date, value,
  AVG(value) OVER (ORDER BY date ROWS BETWEEN 6 PRECEDING AND CURRENT ROW) as ma_7
FROM table;
```

### Percentiles
```sql
SELECT 
  PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY value) as median,
  PERCENTILE_CONT(0.25) WITHIN GROUP (ORDER BY value) as q1,
  PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY value) as q3
FROM table;
```

### Pivoting
```sql
-- Dynamic pivot
SELECT *
FROM (
  SELECT category, value FROM table
) src
PIVOT (
  SUM(value) FOR category IN ('A', 'B', 'C')
) pvt;
```

### Unpivoting
```sql
SELECT id, 'column1' as column_name, column1 as value FROM table
UNION ALL
SELECT id, 'column2', column2 FROM table
UNION ALL
SELECT id, 'column3', column3 FROM table;
```

## Advanced Techniques

### Recursive CTEs
```sql
-- Hierarchical data
WITH RECURSIVE hierarchy AS (
  SELECT id, parent_id, name, 1 as level
  FROM tree WHERE parent_id IS NULL
  UNION ALL
  SELECT t.id, t.parent_id, t.name, h.level + 1
  FROM tree t
  JOIN hierarchy h ON t.parent_id = h.id
)
SELECT * FROM hierarchy;
```

### Lateral Joins
```sql
-- For each row, get top N
SELECT a.*, b.*
FROM a
LEFT JOIN LATERAL (
  SELECT * FROM b
  WHERE b.a_id = a.id
  ORDER BY b.score DESC
  LIMIT 3
) b ON true;
```

### JSON Operations
```sql
-- Extract JSON values
SELECT 
  data->>'name' as name,
  data->'address'->>'city' as city,
  jsonb_array_elements(data->'tags') as tag
FROM table;
```

### Full-Text Search
```sql
-- PostgreSQL
SELECT * FROM table
WHERE to_tsvector('english', content) @@ to_tsquery('english', 'search terms');

-- Create index
CREATE INDEX idx_fts ON table USING GIN(to_tsvector('english', content));
```

## Data Pipeline Patterns

### Slowly Changing Dimensions (SCD)
- **Type 1**: Overwrite (no history)
- **Type 2**: Add new row (full history)
- **Type 3**: Add new column (limited history)

### Change Data Capture (CDC)
- **Triggers**: Log changes to audit table
- **Timestamps**: last_updated column
- **Logs**: Database WAL/binlog
- **Tools**: Debezium, AWS DMS

### Data Quality Checks
```sql
-- Completeness
SELECT 
  COUNT(*) as total,
  COUNT(column) as non_null,
  ROUND(COUNT(column)::DECIMAL / COUNT(*) * 100, 2) as completeness_pct
FROM table;

-- Uniqueness
SELECT column, COUNT(*)
FROM table
GROUP BY column
HAVING COUNT(*) > 1;

-- Validity
SELECT * FROM table
WHERE column NOT LIKE 'valid_pattern%';

-- Consistency
SELECT a.id, a.value as val1, b.value as val2
FROM a JOIN b ON a.id = b.id
WHERE a.value != b.value;
```

## Performance Monitoring

### Query Statistics
```sql
-- PostgreSQL
SELECT query, calls, mean_time, total_time
FROM pg_stat_statements
ORDER BY total_time DESC;

-- MySQL
SELECT * FROM sys.statements_with_runtimes_in_95th_percentile;
```

### Index Usage
```sql
-- PostgreSQL
SELECT schemaname, tablename, indexname, idx_scan
FROM pg_stat_user_indexes
WHERE idx_scan = 0;
```

### Table Statistics
```sql
-- PostgreSQL
SELECT schemaname, relname, n_tup_ins, n_tup_upd, n_tup_del
FROM pg_stat_user_tables;
```

## Security Best Practices

### SQL Injection Prevention
1. **Use parameterized queries**: Never concatenate user input
2. **Stored procedures**: Encapsulate logic
3. **Input validation**: Whitelist allowed characters
4. **Least privilege**: Minimal database permissions

### Data Protection
1. **Encryption at rest**: TDE, column encryption
2. **Encryption in transit**: TLS/SSL
3. **Data masking**: Hide sensitive data
4. **Row-level security**: Filter data per user
5. **Audit logging**: Track all access

### Access Control
1. **Role-based access**: Permissions per role
2. **Schema-level permissions**: Control object access
3. **Column-level permissions**: Restrict sensitive columns
4. **View-based access**: Abstract underlying tables