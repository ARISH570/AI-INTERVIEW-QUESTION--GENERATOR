import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.cluster import KMeans
import matplotlib.pyplot as plt

# Load the dataset (Replace the path with your dataset)
resume_file = r"C:\Users\Arish\Downloads\Resume\Resume.csv"
df = pd.read_csv(resume_file)

# Ensure that 'Resume_str' column contains the resume text (change column name if needed)
df = df.dropna(subset=["Resume_str"])  # Remove empty resumes
resumes = df["Resume_str"].tolist()

# Step 1: Convert resumes into vectors using TF-IDF
vectorizer = TfidfVectorizer(stop_words="english")
resume_vectors = vectorizer.fit_transform(resumes)

# Step 2: Apply K-Means Clustering
# Set the number of clusters (you can also determine this dynamically)
num_clusters = 5  # You can choose this based on your dataset or use methods like the elbow method to determine
kmeans = KMeans(n_clusters=num_clusters, random_state=42)

# Fit the model and predict clusters
df["cluster"] = kmeans.fit_predict(resume_vectors)

# Step 3: Output the clustered resumes
for cluster_num in range(num_clusters):
    print(f"\nCluster {cluster_num + 1}:")
    cluster_resumes = df[df["cluster"] == cluster_num]
    print(cluster_resumes[["Resume_str"]].head())  # Print first few resumes in each cluster

# Optional: Visualize the clusters (2D representation using PCA)
from sklearn.decomposition import PCA

pca = PCA(n_components=2)
reduced_vectors = pca.fit_transform(resume_vectors.toarray())

plt.scatter(reduced_vectors[:, 0], reduced_vectors[:, 1], c=df["cluster"], cmap="viridis")
plt.title("Resume Clustering (K-Means)")
plt.xlabel("PCA Component 1")
plt.ylabel("PCA Component 2")
plt.show()
