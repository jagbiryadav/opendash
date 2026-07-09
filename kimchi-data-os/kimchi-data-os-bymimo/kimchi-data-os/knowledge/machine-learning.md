# Machine Learning Algorithms Reference

## Supervised Learning

### Linear Models

#### Linear Regression
- **Assumptions**: Linearity, independence, homoscedasticity, normality of residuals
- **Metrics**: R², Adjusted R², RMSE, MAE
- **Use cases**: Continuous outcomes, baseline models, interpretable predictions

#### Logistic Regression
- **Binary classification**: Sigmoid function maps to [0,1]
- **Multinomial**: Softmax extension
- **Metrics**: AUC-ROC, accuracy, precision, recall, F1
- **Use cases**: Binary outcomes, probability estimation, interpretable models

#### Regularization
- **L1 (Lasso)**: Feature selection, sparse models
- **L2 (Ridge)**: Handles multicollinearity, shrinkage
- **Elastic Net**: Combination of L1 and L2

### Tree-Based Methods

#### Decision Trees
- **CART**: Classification and Regression Trees
- **Splitting**: Gini impurity (classification), MSE (regression)
- **Pruning**: Pre-pruning (max_depth), post-pruning (cost-complexity)
- **Pros**: Interpretable, handles non-linearity, no scaling needed
- **Cons**: Overfitting, unstable, axis-aligned splits

#### Random Forest
- **Ensemble**: Bagging of decision trees
- **Random feature selection**: Decorrelates trees
- **Pros**: Robust, handles high dimensionality, feature importance
- **Cons**: Less interpretable, slower prediction, memory intensive

#### Gradient Boosting Machines (GBM)
- **Sequential ensemble**: Each tree corrects previous errors
- **Learning rate**: Shrinks contributions of new trees
- **Pros**: State-of-the-art performance, handles mixed types
- **Cons**: Prone to overfitting, requires tuning, slower training

#### XGBoost
- **Regularized GBM**: L1/L2 regularization
- **Efficient**: Parallel processing, cache-aware, out-of-core
- **Missing values**: Automatic handling
- **Pros**: Speed, performance, built-in regularization
- **Cons**: Requires tuning, less interpretable

#### LightGBM
- **Leaf-wise growth**: Better accuracy, faster training
- **GOSS**: Gradient-based One-Side Sampling
- **EFB**: Exclusive Feature Bundling
- **Pros**: Fastest, memory efficient, handles categorical
- **Cons**: Can overfit on small datasets

#### CatBoost
- **Ordered boosting**: Reduces prediction shift
- **Native categorical handling**: No encoding needed
- **Symmetric trees**: Balanced, faster inference
- **Pros**: Best for categorical data, robust defaults
- **Cons**: Slower than LightGBM, memory intensive

### Support Vector Machines (SVM)

#### Linear SVM
- **Maximum margin**: Finds optimal hyperplane
- **Soft margin**: Allows misclassification (C parameter)
- **Hinge loss**: Max(0, 1 - y·f(x))

#### Kernel SVM
- **RBF kernel**: Non-linear decision boundaries
- **Polynomial kernel**: Polynomial feature mapping
- **Pros**: Effective in high dimensions, memory efficient
- **Cons**: Slow on large datasets, doesn't scale well

### Nearest Neighbors

#### K-Nearest Neighbors (KNN)
- **Instance-based**: Stores training data
- **Distance metrics**: Euclidean, Manhattan, Minkowski
- **Pros**: Simple, no training, adapts to data
- **Cons**: Slow prediction, curse of dimensionality, memory intensive

## Unsupervised Learning

### Clustering

#### K-Means
- **Centroid-based**: Minimizes within-cluster variance
- **Algorithm**: Lloyd's algorithm (iterative assignment)
- **K selection**: Elbow method, silhouette score, gap statistic
- **Pros**: Simple, scalable, works well with spherical clusters
- **Cons**: Assumes spherical clusters, sensitive to initialization, must specify K

#### DBSCAN
- **Density-based**: Finds arbitrary-shaped clusters
- **Parameters**: ε (neighborhood radius), minPts (minimum points)
- **Pros**: No need to specify K, handles outliers, arbitrary shapes
- **Cons**: Struggles with varying densities, sensitive to parameters

#### Hierarchical Clustering
- **Agglomerative**: Bottom-up merging
- **Divisive**: Top-down splitting
- **Linkage**: Single, complete, average, Ward's
- **Pros**: Dendrogram visualization, no need to specify K
- **Cons**: O(n³) complexity, sensitive to noise

#### Gaussian Mixture Models (GMM)
- **Probabilistic**: Soft cluster assignments
- **Expectation-Maximization**: Iterative optimization
- **Pros**: Soft assignments, handles elliptical clusters, probabilistic
- **Cons**: Assumes Gaussian distribution, sensitive to initialization

### Dimensionality Reduction

#### Principal Component Analysis (PCA)
- **Linear**: Maximizes variance
- **Components**: Orthogonal axes of maximum variance
- **Use cases**: Visualization, noise reduction, feature extraction
- **Pros**: Interpretable, fast, no parameters
- **Cons**: Only linear relationships, sensitive to scaling

#### t-SNE
- **Non-linear**: Preserves local structure
- **Parameters**: Perplexity, learning rate
- **Use cases**: Visualization of high-dimensional data
- **Pros**: Reveals cluster structure, preserves local neighborhoods
- **Cons**: Slow, non-deterministic, can't embed new points

#### UMAP
- **Non-linear**: Preserves global and local structure
- **Parameters**: n_neighbors, min_dist
- **Use cases**: Visualization, dimensionality reduction
- **Pros**: Faster than t-SNE, preserves global structure
- **Cons**: Less deterministic than PCA, requires tuning

#### Autoencoders
- **Neural networks**: Learn compressed representation
- **Architecture**: Encoder → Bottleneck → Decoder
- **Variants**: Variational, Denoising, Sparse
- **Use cases**: Non-linear reduction, anomaly detection, generation

### Association Rules

#### Apriori
- **Support**: Frequency of itemset
- **Confidence**: P(B|A) given support(A)
- **Lift**: Confidence / Expected confidence
- **Use cases**: Market basket analysis, recommendation

#### FP-Growth
- **Frequent Pattern Growth**: More efficient than Apriori
- **Prefix tree**: Compressed data structure
- **Use cases**: Large transaction datasets

## Semi-Supervised Learning

### Self-Training
- **Pseudo-labeling**: Label high-confidence predictions
- **Iterative**: Retrain on expanded labeled set

### Label Propagation
- **Graph-based**: Propagate labels through similarity graph
- **Assumption**: Similar points have same labels

## Reinforcement Learning

### Model-Free
- **Q-Learning**: Learn value function
- **SARSA**: On-policy temporal difference
- **Policy Gradient**: Directly optimize policy

### Model-Based
- **Learn dynamics**: Model environment transitions
- **Planning**: Use model to simulate and plan

## Model Evaluation

### Classification Metrics

#### Confusion Matrix
- **True Positive (TP)**: Correctly predicted positive
- **True Negative (TN)**: Correctly predicted negative
- **False Positive (FP)**: Incorrectly predicted positive
- **False Negative (FN)**: Incorrectly predicted negative

#### Metrics
- **Accuracy**: (TP + TN) / Total
- **Precision**: TP / (TP + FP)
- **Recall**: TP / (TP + FN)
- **F1 Score**: 2 × (Precision × Recall) / (Precision + Recall)
- **AUC-ROC**: Area under ROC curve
- **AUC-PR**: Area under Precision-Recall curve

#### When to Use
- **Balanced classes**: Accuracy, F1
- **Imbalanced classes**: AUC-ROC, AUC-PR, F1
- **Cost-sensitive**: Weighted metrics
- **Ranking**: AUC-ROC, NDCG

### Regression Metrics

- **MSE**: Mean Squared Error (penalizes large errors)
- **RMSE**: Root MSE (same units as target)
- **MAE**: Mean Absolute Error (robust to outliers)
- **MAPE**: Mean Absolute Percentage Error (scale-independent)
- **R²**: Coefficient of determination (variance explained)
- **Adjusted R²**: Penalizes for number of features

### Clustering Metrics

- **Silhouette Score**: Cluster cohesion vs separation
- **Davies-Bouldin Index**: Average similarity between clusters
- **Calinski-Harabasz Index**: Between-cluster vs within-cluster variance
- **Adjusted Rand Index**: Agreement with ground truth
- **Normalized Mutual Information**: Information shared with ground truth

### Cross-Validation

#### K-Fold
- Split data into K folds
- Train on K-1, test on 1
- Repeat K times, average results

#### Stratified K-Fold
- Preserves class distribution in each fold

#### Time Series Split
- Expanding or sliding window
- Respects temporal order

#### Leave-One-Out
- K = N (one sample per fold)
- Computationally expensive, low bias

## Feature Engineering

### Numerical Features
- **Scaling**: StandardScaler, MinMaxScaler, RobustScaler
- **Transformation**: Log, Box-Cox, Yeo-Johnson
- **Binning**: Equal-width, equal-frequency, custom

### Categorical Features
- **One-Hot Encoding**: Binary columns per category
- **Label Encoding**: Integer mapping (ordinal)
- **Target Encoding**: Mean of target per category
- **Frequency Encoding**: Count or frequency
- **Hash Encoding**: Fixed-size representation

### Temporal Features
- **Extract**: Year, month, day, day of week, hour
- **Cyclical**: sin/cos encoding for periodic features
- **Lag features**: Previous values
- **Rolling statistics**: Moving averages, std, min, max

### Text Features
- **Bag of Words**: Word counts
- **TF-IDF**: Term frequency-inverse document frequency
- **Word Embeddings**: Word2Vec, GloVe, FastText
- **Sentence Embeddings**: BERT, Sentence-BERT

## Model Selection Guide

### Problem Type → Algorithms
1. **Binary Classification**: Logistic Regression, Random Forest, XGBoost, LightGBM
2. **Multi-class Classification**: Random Forest, XGBoost, Neural Networks
3. **Regression**: Linear Regression, Random Forest, XGBoost, LightGBM
4. **Clustering**: K-Means, DBSCAN, Hierarchical, GMM
5. **Anomaly Detection**: Isolation Forest, LOF, Autoencoders
6. **Time Series**: ARIMA, Prophet, XGBoost (with lag features), LSTM

### Dataset Size → Approach
1. **Small (<1K)**: Simple models, strong regularization
2. **Medium (1K-100K)**: Tree ensembles, SVM
3. **Large (100K-10M)**: LightGBM, XGBoost
4. **Very Large (>10M)**: Deep learning, distributed computing

### Interpretability → Performance Trade-off
1. **High interpretability**: Linear models, decision trees
2. **Medium interpretability**: Random Forest (feature importance)
3. **Low interpretability**: XGBoost, LightGBM, neural networks
4. **Post-hoc interpretability**: SHAP, LIME, partial dependence

## Hyperparameter Tuning

### Methods
1. **Grid Search**: Exhaustive search over parameter grid
2. **Random Search**: Random sampling from parameter distributions
3. **Bayesian Optimization**: Model-based optimization (Optuna, Hyperopt)
4. **Successive Halving**: Early stopping of bad configurations

### Common Hyperparameters
- **Random Forest**: n_estimators, max_depth, min_samples_split, max_features
- **XGBoost**: learning_rate, max_depth, n_estimators, subsample, colsample_bytree
- **LightGBM**: learning_rate, num_leaves, max_depth, n_estimators
- **SVM**: C, gamma, kernel
- **Neural Networks**: learning_rate, batch_size, layers, dropout

## Ensemble Methods

### Bagging
- **Bootstrap Aggregating**: Train on bootstrap samples
- **Reduce variance**: Average predictions
- **Example**: Random Forest

### Boosting
- **Sequential**: Each model corrects previous errors
- **Reduce bias**: Combine weak learners
- **Examples**: AdaBoost, Gradient Boosting, XGBoost, LightGBM

### Stacking
- **Meta-learning**: Train model on base model predictions
- **Level 0**: Base models (different algorithms)
- **Level 1**: Meta-model (usually simple)

### Voting
- **Hard voting**: Majority class
- **Soft voting**: Average probabilities

## Model Interpretability

### Global Interpretability
- **Feature importance**: Tree-based models
- **Coefficients**: Linear models
- **Partial Dependence**: Average prediction vs feature
- **Global SHAP**: Average SHAP values

### Local Interpretability
- **LIME**: Local linear approximation
- **SHAP values**: Shapley values for individual predictions
- **Counterfactual explanations**: What would need to change
- **Anchors**: Sufficient conditions for prediction

## Common Pitfalls

1. **Data leakage**: Future information in features
2. **Target leakage**: Target-derived features
3. **Overfitting**: Model fits noise
4. **Underfitting**: Model too simple
5. **Class imbalance**: Majority class dominates
6. **Feature selection bias**: Using test set for selection
7. **Hyperparameter overfitting**: Tuning to test set
8. **Ignoring distribution shift**: Train/test mismatch
9. **Not validating**: Skipping proper cross-validation
10. **Overcomplicating**: Complex model when simple suffices