"""
Data Science & Machine Learning Pipeline
Autor: Yamir Vera (UV Xalapa)
Objetivo: Ingestión, limpieza estadística, reducción dimensional (PCA) y Clustering K-Means
"""

import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA
from sklearn.cluster import KMeans

def generate_sample_dataset(n_samples=500):
    np.random.seed(42)
    feature_a = np.random.normal(50, 15, n_samples)
    feature_b = feature_a * 1.5 + np.random.normal(0, 10, n_samples)
    feature_c = np.random.exponential(10, n_samples)
    category = np.random.choice(['Alpha', 'Beta', 'Gamma'], n_samples)
    
    df = pd.DataFrame({
        'feature_a': feature_a,
        'feature_b': feature_b,
        'feature_c': feature_c,
        'category': category
    })
    return df

def run_pipeline():
    print("=== PIPELINE DE CIENCIA DE DATOS UV XALAPA ===")
    df = generate_sample_dataset()
    print(f"Dataset generado: {df.shape[0]} filas x {df.shape[1]} columnas.")
    
    # 1. Escalado
    numerical_cols = ['feature_a', 'feature_b', 'feature_c']
    scaler = StandardScaler()
    scaled_data = scaler.fit_transform(df[numerical_cols])
    
    # 2. PCA
    pca = PCA(n_components=2)
    pca_results = pca.fit_transform(scaled_data)
    print(f"Varianza explicada por componentes principales: {pca.explained_variance_ratio_}")
    
    # 3. K-Means
    kmeans = KMeans(n_clusters=3, random_state=42, n_init=10)
    df['cluster'] = kmeans.fit_predict(pca_results)
    
    print("\nResumen por Cluster:")
    print(df.groupby('cluster')[numerical_cols].mean())
    print("\nPipeline ejecutado con éxito. 🚀")

if __name__ == '__main__':
    run_pipeline()
