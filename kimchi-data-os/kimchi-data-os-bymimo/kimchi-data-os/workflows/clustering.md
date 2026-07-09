# Clustering Workflow

## Overview
Systematic approach to discovering natural groupings in data for segmentation, pattern discovery, and anomaly detection.

## Phase 1: Problem Definition

### 1.1 Clustering Objective
```python
CLUSTERING_OBJECTIVE = {
    "segmentation": "Group similar entities (customers, products)",
    "pattern_discovery": "Find hidden structures in data",
    "anomaly_detection": "Identify unusual observations",
    "dimensionality_reduction": "Simplify complex data"
}
```

### 1.2 Business Context
- **Customer segmentation**: Targeted marketing, personalization
- **Product clustering**: Portfolio optimization, pricing
- **Anomaly detection**: Fraud, quality control
- **Topic modeling**: Document organization, content strategy

## Phase 2: Data Preparation

### 2.1 Feature Selection
```python
# Correlation analysis
corr_matrix = df.corr().abs()
upper = corr_matrix.where(np.triu(np.ones(corr_matrix.shape), k=1).astype(bool))
to_drop = [column for column in upper.columns if any(upper[column] > 0.95)]
df_reduced = df.drop(to_drop, axis=1)

# Variance threshold
from sklearn.feature_selection import VarianceThreshold
selector = VarianceThreshold(threshold=0.01)
df_selected = selector.fit_transform(df)
```

### 2.2 Feature Scaling
```python
from sklearn.preprocessing import StandardScaler, RobustScaler

# Standard scaling (mean=0, std=1)
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Robust scaling (median=0, IQR=1) - better for outliers
scaler = RobustScaler()
X_robust = scaler.fit_transform(X)
```

### 2.3 Dimensionality Reduction
```python
from sklearn.decomposition import PCA

# PCA for visualization and noise reduction
pca = PCA(n_components=0.95)  # Retain 95% variance
X_pca = pca.fit_transform(X_scaled)
print(f"Components: {X_pca.shape[1]}")
print(f"Explained variance: {pca.explained_variance_ratio_.sum():.2%}")

# t-SNE for visualization
from sklearn.manifold import TSNE
tsne = TSNE(n_components=2, random_state=42)
X_tsne = tsne.fit_transform(X_scaled)
```

## Phase 3: Algorithm Selection

### 3.1 Algorithm Selection Guide
| Algorithm | Pros | Cons | Best For |
|-----------|------|------|----------|
| K-Means | Fast, simple | Assumes spherical clusters | Large datasets, spherical clusters |
| DBSCAN | Handles noise, arbitrary shapes | Sensitive to parameters | Spatial data, noise |
| Hierarchical | Dendrogram visualization | O(n²) complexity | Small datasets, hierarchy |
| GMM | Soft assignments, probabilistic | Assumes Gaussian | Elliptical clusters |
| HDBSCAN | Robust DBSCAN, varying density | Complex | Varying density clusters |

### 3.2 Initial Assessment
```python
# Quick assessment
print(f"Dataset size: {X.shape[0]} samples, {X.shape[1]} features")

# Check for obvious clusters
plt.figure(figsize=(10, 6))
plt.scatter(X_tsne[:, 0], X_tsne[:, 1], alpha=0.5)
plt.title('t-SNE Visualization')
plt.show()
```

## Phase 4: Clustering

### 4.1 K-Means Clustering
```python
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score

# Find optimal K using elbow method
inertias = []
silhouette_scores = []
K_range = range(2, 11)

for k in K_range:
    kmeans = KMeans(n_clusters=k, random_state=42, n_init=10)
    kmeans.fit(X_scaled)
    inertias.append(kmeans.inertia_)
    silhouette_scores.append(silhouette_score(X_scaled, kmeans.labels_))

# Plot elbow curve
fig, axes = plt.subplots(1, 2, figsize=(12, 4))
axes[0].plot(K_range, inertias, 'bo-')
axes[0].set_xlabel('Number of Clusters (K)')
axes[0].set_ylabel('Inertia')
axes[0].set_title('Elbow Method')

axes[1].plot(K_range, silhouette_scores, 'bo-')
axes[1].set_xlabel('Number of Clusters (K)')
axes[1].set_ylabel('Silhouette Score')
axes[1].set_title('Silhouette Analysis')
plt.tight_layout()
plt.show()

# Final clustering
optimal_k = K_range[np.argmax(silhouette_scores)]
kmeans = KMeans(n_clusters=optimal_k, random_state=42, n_init=10)
labels_kmeans = kmeans.fit_predict(X_scaled)
```

### 4.2 DBSCAN Clustering
```python
from sklearn.cluster import DBSCAN

# Find optimal eps using k-distance graph
from sklearn.neighbors import NearestNeighbors

neighbors = NearestNeighbors(n_neighbors=5)
neighbors.fit(X_scaled)
distances, indices = neighbors.kneighbors(X_scaled)

distances = np.sort(distances[:, -1])
plt.figure(figsize=(10, 6))
plt.plot(distances)
plt.xlabel('Points')
plt.ylabel('Distance')
plt.title('K-Distance Graph')
plt.show()

# Apply DBSCAN
dbscan = DBSCAN(eps=0.5, min_samples=5)
labels_dbscan = dbscan.fit_predict(X_scaled)

print(f"Clusters found: {len(set(labels_dbscan)) - (1 if -1 in labels_dbscan else 0)}")
print(f"Noise points: {np.sum(labels_dbscan == -1)}")
```

### 4.3 Hierarchical Clustering
```python
from sklearn.cluster import AgglomerativeClustering
from scipy.cluster.hierarchy import dendrogram, linkage

# Dendrogram
plt.figure(figsize=(12, 6))
linkage_matrix = linkage(X_scaled, method='ward')
dendrogram(linkage_matrix, truncate_mode='lastp', p=30)
plt.title('Hierarchical Clustering Dendrogram')
plt.xlabel('Cluster Size')
plt.ylabel('Distance')
plt.show()

# Apply hierarchical clustering
hierarchical = AgglomerativeClustering(n_clusters=optimal_k)
labels_hierarchical = hierarchical.fit_predict(X_scaled)
```

### 4.4 Gaussian Mixture Models
```python
from sklearn.mixture import GaussianMixture

# Find optimal number of components
bic_scores = []
aic_scores = []
n_components_range = range(2, 11)

for n in n_components_range:
    gmm = GaussianMixture(n_components=n, random_state=42)
    gmm.fit(X_scaled)
    bic_scores.append(gmm.bic(X_scaled))
    aic_scores.append(gmm.aic(X_scaled))

# Plot BIC/AIC
plt.figure(figsize=(10, 6))
plt.plot(n_components_range, bic_scores, label='BIC')
plt.plot(n_components_range, aic_scores, label='AIC')
plt.xlabel('Number of Components')
plt.ylabel('Score')
plt.title('GMM Model Selection')
plt.legend()
plt.show()

# Final GMM
optimal_n = n_components_range[np.argmin(bic_scores)]
gmm = GaussianMixture(n_components=optimal_n, random_state=42)
labels_gmm = gmm.fit_predict(X_scaled)
probabilities = gmm.predict_proba(X_scaled)
```

## Phase 5: Evaluation

### 5.1 Internal Metrics
```python
from sklearn.metrics import (silhouette_score, davies_bouldin_score, 
                             calinski_harabasz_score)

# Compare algorithms
algorithms = {
    'K-Means': labels_kmeans,
    'DBSCAN': labels_dbscan,
    'Hierarchical': labels_hierarchical,
    'GMM': labels_gmm
}

for name, labels in algorithms.items():
    if len(set(labels)) > 1:
        print(f"\n{name}:")
        print(f"  Silhouette Score: {silhouette_score(X_scaled, labels):.3f}")
        print(f"  Davies-Bouldin Index: {davies_bouldin_score(X_scaled, labels):.3f}")
        print(f"  Calinski-Harabasz Index: {calinski_harabasz_score(X_scaled, labels):.3f}")
```

### 5.2 External Validation (if ground truth available)
```python
from sklearn.metrics import adjusted_rand_score, normalized_mutual_info_score

# If you have true labels
ari = adjusted_rand_score(true_labels, labels)
nmi = normalized_mutual_info_score(true_labels, labels)
print(f"Adjusted Rand Index: {ari:.3f}")
print(f"Normalized Mutual Information: {nmi:.3f}")
```

### 5.3 Cluster Analysis
```python
# Analyze clusters
df['cluster'] = labels_kmeans

# Cluster profiles
cluster_profiles = df.groupby('cluster').mean()
print(cluster_profiles)

# Cluster sizes
print("\nCluster sizes:")
print(df['cluster'].value_counts().sort_index())

# Visualize clusters
plt.figure(figsize=(10, 6))
scatter = plt.scatter(X_tsne[:, 0], X_tsne[:, 1], c=labels_kmeans, cmap='viridis', alpha=0.5)
plt.colorbar(scatter)
plt.title('Clusters Visualization (t-SNE)')
plt.show()
```

## Phase 6: Interpretation

### 6.1 Cluster Profiling
```python
# Detailed cluster analysis
def profile_clusters(df, cluster_col, feature_cols):
    profiles = {}
    for cluster in df[cluster_col].unique():
        cluster_data = df[df[cluster_col] == cluster]
        profile = {
            'size': len(cluster_data),
            'percentage': len(cluster_data) / len(df) * 100,
            'means': cluster_data[feature_cols].mean().to_dict(),
            'medians': cluster_data[feature_cols].median().to_dict()
        }
        profiles[cluster] = profile
    return profiles

profiles = profile_clusters(df, 'cluster', feature_cols)
for cluster, profile in profiles.items():
    print(f"\nCluster {cluster}:")
    print(f"  Size: {profile['size']} ({profile['percentage']:.1f}%)")
    print(f"  Key characteristics: {profile['means']}")
```

### 6.2 Actionable Insights
```python
# Generate insights
insights = []
for cluster, profile in profiles.items():
    if profile['means']['feature1'] > df['feature1'].mean():
        insights.append(f"Cluster {cluster}: High feature1 - Target with premium products")
    if profile['means']['feature2'] < df['feature2'].mean():
        insights.append(f"Cluster {cluster}: Low feature2 - Focus on engagement")

for insight in insights:
    print(insight)
```

## Phase 7: Deployment

### 7.1 Cluster Assignment Pipeline
```python
# Save model and scaler
import joblib

joblib.dump(kmeans, 'kmeans_model.pkl')
joblib.dump(scaler, 'scaler.pkl')

# Prediction function
def assign_cluster(new_data):
    scaler = joblib.load('scaler.pkl')
    model = joblib.load('kmeans_model.pkl')
    new_data_scaled = scaler.transform(new_data)
    return model.predict(new_data_scaled)
```

### 7.2 Cluster Documentation
```markdown
## Cluster Profiles

### Cluster 0: High-Value Customers
- **Size**: 15% of customers
- **Characteristics**: High revenue, frequent purchases, low churn
- **Strategy**: VIP program, loyalty rewards

### Cluster 1: At-Risk Customers
- **Size**: 25% of customers
- **Characteristics**: Declining engagement, moderate churn risk
- **Strategy**: Re-engagement campaigns, personalized offers

### Cluster 2: New Customers
- **Size**: 30% of customers
- **Characteristics**: Recent acquisition, low initial purchase
- **Strategy**: Onboarding sequence, first-purchase incentives

### Cluster 3: Dormant Customers
- **Size**: 30% of customers
- **Characteristics**: No recent activity, high churn probability
- **Strategy**: Win-back campaigns, special offers
```

## Quality Checklist

- [ ] Objective clearly defined
- [ ] Features properly scaled
- [ ] Dimensionality reduced if needed
- [ ] Multiple algorithms compared
- [ ] Optimal number of clusters determined
- [ ] Clusters validated (internal metrics)
- [ ] Clusters profiled and interpreted
- [ ] Actionable insights generated
- [ ] Deployment pipeline created
- [ ] Documentation completed