import pandas as pd
import numpy as np
import warnings
warnings.filterwarnings('ignore')

# Load data
df = pd.read_csv(r'C:\Users\jagbi\Downloads\sales.csv', quotechar='"')

print(f"Dataset loaded: {len(df)} rows, {len(df.columns)} columns")
print(f"Columns: {list(df.columns)}")
print("\nFirst 5 rows:")
print(df.head())

# Data type conversion
df['purchase_date'] = pd.to_datetime(df['purchase_date'], format='%d/%m/%Y', errors='coerce')
df['price'] = pd.to_numeric(df['price'], errors='coerce')
df['quantity'] = pd.to_numeric(df['quantity'], errors='coerce')
df['total_amount'] = pd.to_numeric(df['total_amount'], errors='coerce')

# Missing values summary
missing = df.isnull().sum()
missing_pct = (missing / len(df)) * 100
print("\n--- DATA QUALITY REPORT ---")
print("Missing values:")
for col, count in missing.items():
    if count > 0:
        print(f"  {col}: {count} ({missing_pct[col]:.1f}%)")

# Payment method normalization
payment_map = {
    'creditcard': 'Credit Card',
    'credit card': 'Credit Card',
    'credit': 'Credit Card',
    'CC': 'Credit Card',
    'cc': 'Credit Card',
    'debit card': 'Debit Card',
    'debit': 'Debit Card',
    'paypal': 'PayPal',
    'PayPal': 'PayPal',
    'bank transfer': 'Bank Transfer',
    'bank': 'Bank Transfer'
}
df['payment_method_clean'] = df['payment_method'].map(lambda x: payment_map.get(str(x).strip().lower().replace(' ', ' '), str(x)) if pd.notna(x) else x)

# Validate total_amount = price * quantity
df['calc_amount'] = df['price'] * df['quantity']
df['amount_diff'] = abs(df['total_amount'] - df['calc_amount'])
invalid_amounts = df[df['amount_diff'] > 0.01].copy()
print(f"\nRows where total_amount != price*quantity (diff > 0.01): {len(invalid_amounts)}")

# Backfill missing total_amount where possible
mask = df['total_amount'].isna() & df['price'].notna() & df['quantity'].notna()
df.loc[mask, 'total_amount'] = df.loc[mask, 'calc_amount']
print(f"Backfilled total_amount for {mask.sum()} rows")

# Returns analysis (negative quantity)
returns = df[df['quantity'] < 0]
print(f"\nReturns/Refunds: {len(returns)} rows ({len(returns)/len(df)*100:.1f}%)")

# Net quantities
total_qty = df['quantity'].sum()
print(f"Net quantity sold (after returns): {total_qty:.0f}")

# Revenue analysis (using total_amount)
# For returns, total_amount is negative; treat as deductions
total_revenue_gross = df[df['total_amount'] > 0]['total_amount'].sum()
total_revenue_returns = abs(df[df['total_amount'] < 0]['total_amount'].sum())
net_revenue = df['total_amount'].sum()
print(f"\nGross Revenue: ${total_revenue_gross:,.2f}")
print(f"Returns/Refund Amount: ${total_revenue_returns:,.2f}")
print(f"Net Revenue: ${net_revenue:,.2f}")

# Revenue by category
cat_rev = df.groupby('category').agg(
    gross=('total_amount', lambda x: x[x > 0].sum()),
    returns=('total_amount', lambda x: abs(x[x < 0].sum())),
    net=('total_amount', 'sum'),
    txn_count=('transaction_id', 'count'),
    avg_ticket=('total_amount', 'mean')
).sort_values('net', ascending=False)
print("\n--- REVENUE BY CATEGORY ---")
print(cat_rev.round(2))

# Revenue by payment method
pay_rev = df.groupby('payment_method_clean').agg(
    gross=('total_amount', lambda x: x[x > 0].sum()),
    net=('total_amount', 'sum'),
    txn_count=('transaction_id', 'count'),
    avg_ticket=('total_amount', 'mean')
).sort_values('net', ascending=False)
print("\n--- REVENUE BY PAYMENT METHOD ---")
print(pay_rev.round(2))

# Time trends
df['year_month'] = df['purchase_date'].dt.to_period('M')
monthly = df.groupby('year_month').agg(
    net_revenue=('total_amount', 'sum'),
    txn_count=('transaction_id', 'count'),
    avg_ticket=('total_amount', 'mean')
).sort_index()
print("\n--- MONTHLY TRENDS (last 12 months) ---")
print(monthly.tail(12).round(2))

# Customer segmentation (RFM-like)
snapshot_date = df['purchase_date'].max() + pd.Timedelta(days=1)
customer_metrics = df.groupby('customer_id').agg(
    total_revenue=('total_amount', 'sum'),
    transaction_count=('transaction_id', 'count'),
    last_purchase=('purchase_date', 'max'),
    avg_ticket=('total_amount', 'mean')
).reset_index()

customer_metrics['recency_days'] = (snapshot_date - customer_metrics['last_purchase']).dt.days

# Segment customers
def segment(row):
    if row['total_revenue'] > 50000:
        return 'High Value'
    elif row['total_revenue'] > 10000:
        return 'Medium Value'
    elif row['total_revenue'] > 0:
        return 'Low Value'
    else:
        return 'Negative/Returns'

customer_metrics['segment'] = customer_metrics.apply(segment, axis=1)
segment_summary = customer_metrics.groupby('segment').agg(
    customer_count=('customer_id', 'count'),
    avg_revenue=('total_revenue', 'mean'),
    avg_transactions=('transaction_count', 'mean'),
    avg_recency=('recency_days', 'mean')
).sort_values('avg_revenue', ascending=False)
print("\n--- CUSTOMER SEGMENTATION ---")
print(segment_summary.round(2))

# Top products by revenue
product_rev = df.groupby('product_id').agg(
    revenue=('total_amount', 'sum'),
    quantity=('quantity', 'sum'),
    txn_count=('transaction_id', 'count')
).sort_values('revenue', ascending=False).head(10)
print("\n--- TOP 10 PRODUCTS BY REVENUE ---")
print(product_rev.round(2))

# Delivery status breakdown
delivery_counts = df['delivery_status'].value_counts()
print("\n--- DELIVERY STATUS BREAKDOWN ---")
print(delivery_counts)

# Day of week analysis
df['day_of_week'] = df['purchase_date'].dt.day_name()
day_stats = df.groupby('day_of_week').agg(
    txn_count=('transaction_id', 'count'),
    avg_revenue=('total_amount', 'mean')
).sort_values('txn_count', ascending=False)
print("\n--- SALES BY DAY OF WEEK ---")
print(day_stats.round(2))

# Statistical significance: returns rate by category
print("\n--- RETURNS RATE BY CATEGORY ---")
cat_returns = df.groupby('category').apply(
    lambda x: (x['quantity'] < 0).sum() / len(x) * 100
).sort_values(ascending=False)
print(cat_returns.round(2))

# Correlation analysis
print("\n--- CORRELATION MATRIX (price, quantity, total_amount) ---")
corr_cols = ['price', 'quantity', 'total_amount']
print(df[corr_cols].corr().round(3))

print("\n--- ANALYSIS COMPLETE ---")