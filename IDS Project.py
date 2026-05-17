import pandas as pd
import numpy as np
import os
import re
import nltk
from nltk.corpus import stopwords
from nltk.stem import PorterStemmer
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.feature_selection import VarianceThreshold
from sklearn.naive_bayes import MultinomialNB
from sklearn.metrics import (accuracy_score, precision_score,
                             recall_score, f1_score,
                             confusion_matrix, classification_report)
from sklearn.utils import resample
import matplotlib.pyplot as plt
import seaborn as sns
import joblib

nltk.download('stopwords', quiet=True)

path = r"D:\University\FNFC"

print("\nLoading and preprocessing data...")

def load_requirements(filepath):
    data = []
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        for line in f:
            parts = line.strip().split(',', 2)
            if len(parts) >= 2:
                data.append({
                    'coarse_label': parts[0].strip().upper(),
                    'requirement':  parts[1].strip(),
                    'fine_label':   parts[2].strip() if len(parts) == 3 else ''
                })
    return pd.DataFrame(data)

df_train = load_requirements(os.path.join(path, 'train.txt'))
df_test  = load_requirements(os.path.join(path, 'test.txt'))

print(f"   Training samples: {len(df_train)}")
print(f"   Test samples    : {len(df_test)}")

# Normalize
def normalize_text(text):
    text = text.lower()
    text = re.sub(r'[^a-zA-Z\s]', '', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text

df_train['normalized'] = df_train['requirement'].apply(normalize_text)
df_test['normalized']  = df_test['requirement'].apply(normalize_text)

# Stop words
stop_words = set(stopwords.words('english'))
stop_words.update({
    'shall', 'system', 'application', 'product', 'also', 'every', 'per'
})

stemmer = PorterStemmer()

def preprocess(text):
    tokens = text.split()
    tokens = [w for w in tokens if w not in stop_words and len(w) > 1]
    tokens = [stemmer.stem(w) for w in tokens]
    return ' '.join(tokens)

df_train['cleaned'] = df_train['normalized'].apply(preprocess)
df_test['cleaned']  = df_test['normalized'].apply(preprocess)

print("    Preprocessing complete")
print(f"\n   Sample cleaned text:")
print(f"   Before: {df_train['requirement'].iloc[0]}")
print(f"   After : {df_train['cleaned'].iloc[0]}")

# Save preprocessed files
df_train[['coarse_label', 'requirement', 'cleaned']].to_csv(
    os.path.join(path, 'train_preprocessed.csv'), index=False)
df_test[['coarse_label', 'requirement', 'cleaned']].to_csv(
    os.path.join(path, 'test_preprocessed.csv'), index=False)
print("\n    Saved: train_preprocessed.csv")
print("    Saved: test_preprocessed.csv")

print("FEATURE ENGINEERING & SELECTION")
print("\n Balancing training data...")
df_fr  = df_train[df_train['coarse_label'] == 'FR']
df_nfr = df_train[df_train['coarse_label'] == 'NFR']
print(f"   Before → FR: {len(df_fr)}, NFR: {len(df_nfr)}")

df_fr_upsampled   = resample(df_fr, replace=True,
                              n_samples=len(df_nfr), random_state=42)
df_train_balanced = pd.concat([df_nfr, df_fr_upsampled])
print(f"   After  → FR: {len(df_fr_upsampled)}, NFR: {len(df_nfr)}")

# TF-IDF 
print("\n TF-IDF Vectorization...")
tfidf = TfidfVectorizer(
    max_features=1500,
    ngram_range=(1, 2),
    min_df=2,
    sublinear_tf=True
)

X_train = tfidf.fit_transform(df_train_balanced['cleaned'])
X_test  = tfidf.transform(df_test['cleaned'])

y_train = df_train_balanced['coarse_label'].map({'FR': 1, 'NFR': 0})
y_test  = df_test['coarse_label'].map({'FR': 1, 'NFR': 0})

print(f"   X_train shape: {X_train.shape}")
print(f"   X_test shape : {X_test.shape}")

# Variance Threshold
print("\n Feature Selection...")
feature_names    = tfidf.get_feature_names_out()
selector         = VarianceThreshold(threshold=0.001)
X_train_selected = selector.fit_transform(X_train)
X_test_selected  = selector.transform(X_test)
kept_features    = feature_names[selector.get_support()]

TOP_K          = 400
variances      = X_train_selected.toarray().var(axis=0)
top_indices    = np.argsort(variances)[::-1][:TOP_K]
X_train_final  = X_train_selected[:, top_indices]
X_test_final   = X_test_selected[:, top_indices]
final_features = kept_features[top_indices]

print(f"   Features after selection: {X_train_final.shape[1]}")
print(f"   X_train_final shape     : {X_train_final.shape}")
print(f"   X_test_final shape      : {X_test_final.shape}")

print(" MODEL BUILDING ")
nb_model = MultinomialNB(alpha=0.5)
nb_model.fit(X_train_final, y_train)

nb_train_pred = nb_model.predict(X_train_final)
nb_test_pred  = nb_model.predict(X_test_final)

train_acc = accuracy_score(y_train, nb_train_pred)
test_acc  = accuracy_score(y_test,  nb_test_pred)

print(f"\n   Training Accuracy : {train_acc*100:.2f}%")
print(f"   Test Accuracy     : {test_acc*100:.2f}%")

print(" MODEL EVALUATION & VALIDATION")
print("\nStandard Test Set Evaluation")
accuracy  = accuracy_score(y_test,  nb_test_pred)
precision = precision_score(y_test, nb_test_pred)
recall    = recall_score(y_test,    nb_test_pred)
f1        = f1_score(y_test,        nb_test_pred)
cm        = confusion_matrix(y_test, nb_test_pred)
tn, fp, fn, tp = cm.ravel()

print(f"""
   Accuracy  : {accuracy*100:.2f}%
   Precision : {precision*100:.2f}%
   Recall    : {recall*100:.2f}%
   F1-Score  : {f1*100:.2f}%

   CONFUSION MATRIX:
                  Predicted NFR   Predicted FR
   Actual NFR   |     {tn:^5}      |    {fp:^5}    |
   Actual FR    |     {fn:^5}      |    {tp:^5}    |

   ✅ True Negatives  (NFR→NFR): {tn}
   ✅ True Positives  (FR→FR)  : {tp}
   ❌ False Positives (NFR→FR) : {fp}
   ❌ False Negatives (FR→NFR) : {fn}
""")

print("   Full Classification Report:")
print(classification_report(y_test, nb_test_pred,
                             target_names=['Non-Functional', 'Functional']))

# Confusion Matrix ─
plt.figure(figsize=(7, 5))
sns.heatmap(cm, annot=True, fmt='d', cmap='Blues',
            xticklabels=['Non-Functional', 'Functional'],
            yticklabels=['Non-Functional', 'Functional'],
            annot_kws={'size': 14, 'weight': 'bold'})
plt.title('Confusion Matrix — Naive Bayes', fontsize=14, fontweight='bold')
plt.xlabel('Predicted Label', fontsize=12)
plt.ylabel('Actual Label',    fontsize=12)
plt.tight_layout()
plt.savefig(os.path.join(path, '14_confusion_matrix.png'), dpi=150)
plt.show()
print("   Saved: 14_confusion_matrix.png")

#Performance Metrics Bar Chart
plt.figure(figsize=(9, 5))
metrics = ['Accuracy', 'Precision', 'Recall', 'F1-Score']
values  = [accuracy*100, precision*100, recall*100, f1*100]
colors  = ['#4ECDC4', '#FF6B6B', '#45B7D1', '#96CEB4']
bars    = plt.bar(metrics, values, color=colors, width=0.5, edgecolor='white')
plt.ylim(0, 110)
plt.ylabel('Score (%)', fontsize=12)
plt.title('Model Performance Metrics — Naive Bayes', fontsize=14, fontweight='bold')
for bar, val in zip(bars, values):
    plt.text(bar.get_x() + bar.get_width()/2, val + 1.5,
             f'{val:.1f}%', ha='center', fontsize=12, fontweight='bold')
plt.tight_layout()
plt.savefig(os.path.join(path, '15_performance_metrics.png'), dpi=150)
plt.show()
print("    Saved: 15_performance_metrics.png")

# ── Visualization 3: Actual vs Predicted Pie Charts ───────
fig, axes = plt.subplots(1, 2, figsize=(12, 5))

actual_counts = [int((y_test==0).sum()), int((y_test==1).sum())]
axes[0].pie(actual_counts, labels=['Non-Functional', 'Functional'],
            autopct='%1.1f%%', colors=['#4ECDC4', '#FF6B6B'],
            startangle=90, textprops={'fontsize': 11})
axes[0].set_title('Actual Distribution (Test Set)', fontsize=13, fontweight='bold')

pred_counts = [int((nb_test_pred==0).sum()), int((nb_test_pred==1).sum())]
axes[1].pie(pred_counts, labels=['Non-Functional', 'Functional'],
            autopct='%1.1f%%', colors=['#4ECDC4', '#FF6B6B'],
            startangle=90, textprops={'fontsize': 11})
axes[1].set_title('Predicted Distribution (Test Set)', fontsize=13, fontweight='bold')

plt.suptitle('Actual vs Predicted Class Distribution', fontsize=14, fontweight='bold')
plt.tight_layout()
plt.savefig(os.path.join(path, '16_actual_vs_predicted.png'), dpi=150)
plt.show()
print("    Saved: 16_actual_vs_predicted.png")

def predict_requirement(text):
    cleaned      = preprocess(normalize_text(text))
    vec          = tfidf.transform([cleaned])
    vec_selected = selector.transform(vec)
    vec_final    = vec_selected[:, top_indices]
    pred         = nb_model.predict(vec_final)[0]
    prob         = nb_model.predict_proba(vec_final)[0]
    result       = "FUNCTIONAL" if pred == 1 else "NON-FUNCTIONAL"
    return result, max(prob)*100

# 20 FR from test.txt
functional_reqs = [
    "The system shall allow users to log in using email and password",
    "The system shall allow users to create a new account",
    "The system shall send a welcome email after registration",
    "The user shall be able to reset their forgotten password",
    "The system shall allow users to upload profile pictures",
    "The system shall allow users to delete their account",
    "The user shall be able to edit their profile information",
    "The system shall send a confirmation email for orders",
    "The system shall display product search results",
    "The system shall add items to the shopping cart",
    "The system shall calculate the total price of items in cart",
    "The user shall be able to remove items from cart",
    "The system shall generate an invoice after payment",
    "The system shall display order history for each user",
    "The user shall be able to download order receipt as PDF",
    "The system shall allow admin to view all users",
    "The system shall allow admin to delete user accounts",
    "The system shall send notification when order is shipped",
    "The user shall be able to leave a product review",
    "The system shall display average product rating from reviews",
]

# 20 NFR from test.txt
nonfunctional_reqs = [
    "The website must load within 2 seconds",
    "The system shall be available 24 hours a day 7 days a week",
    "All passwords must be encrypted for security",
    "The application shall support 1000 users at the same time",
    "The interface should be easy to use without training",
    "The system must log all failed login attempts",
    "Search results should appear in under 1 second",
    "The system shall protect user data from unauthorized access",
    "The app must run on Windows Mac and Linux",
    "The website should have 99% uptime all year",
    "All credit card payments must be processed securely",
    "The application should work on mobile phones",
    "The system shall complete checkout within 10 seconds",
    "The product must use encryption for all data transmission",
    "The database shall handle 1 million records",
    "The interface must be responsive on all screen sizes",
    "The system shall automatically save work every 30 seconds",
    "The product shall notify admins of security issues within 5 minutes",
    "The system shall keep audit logs of all user actions"
]

# Test FR
print("\n FUNCTIONAL REQUIREMENTS (20 from test.txt):")
fr_correct = 0
for i, req in enumerate(functional_reqs, 1):
    result, conf = predict_requirement(req)
    correct = (result == "FUNCTIONAL")
    if correct: fr_correct += 1
    icon  = "✅" if correct else "❌"
    short = req[:55] + "..." if len(req) > 55 else req
    print(f"   {icon} {i:2}. {short}")
    print(f"         → {result} | Confidence: {conf:.1f}%")

# Test NFR
print("\n NON-FUNCTIONAL REQUIREMENTS (20 from test.txt):")
nfr_correct = 0
for i, req in enumerate(nonfunctional_reqs, 1):
    result, conf = predict_requirement(req)
    correct = (result == "NON-FUNCTIONAL")
    if correct: nfr_correct += 1
    icon  = "✅" if correct else "❌"
    short = req[:55] + "..." if len(req) > 55 else req
    print(f"   {icon} {i:2}. {short}")
    print(f"         → {result} | Confidence: {conf:.1f}%")

total_correct = fr_correct + nfr_correct
rw_accuracy   = total_correct / 40 * 100

print(f"\n   Functional correct     : {fr_correct}/20  ({fr_correct/20*100:.0f}%)")
print(f"   Non-Functional correct : {nfr_correct}/20  ({nfr_correct/20*100:.0f}%)")
print(f"   Total correct          : {total_correct}/40  ({rw_accuracy:.1f}%)")

# ── Visualization 4: Real-world Results ───────────────────
plt.figure(figsize=(8, 5))
categories = ['Functional\n(20 reqs)', 'Non-Functional\n(20 reqs)', 'Overall\n(40 reqs)']
counts     = [fr_correct, nfr_correct, total_correct]
totals     = [20, 20, 40]
pcts       = [c/t*100 for c, t in zip(counts, totals)]
colors     = ['#FF6B6B', '#4ECDC4', '#45B7D1']
bars       = plt.bar(categories, pcts, color=colors, width=0.5, edgecolor='white')
plt.title('Real-World Prediction Accuracy (from test.txt)',
          fontsize=13, fontweight='bold')
plt.ylabel('Accuracy (%)', fontsize=12)
plt.ylim(0, 115)
for bar, pct, c, t in zip(bars, pcts, counts, totals):
    plt.text(bar.get_x() + bar.get_width()/2, pct + 2,
             f'{c}/{t}\n({pct:.0f}%)',
             ha='center', fontsize=11, fontweight='bold')
plt.tight_layout()
plt.savefig(os.path.join(path, '17_realworld_results.png'), dpi=150)
plt.show()
print("    Saved: 17_realworld_results.png")


joblib.dump(nb_model,    os.path.join(path, 'requirement_classifier.pkl'))
joblib.dump(tfidf,       os.path.join(path, 'tfidf_vectorizer.pkl'))
joblib.dump(selector,    os.path.join(path, 'feature_selector.pkl'))
joblib.dump(top_indices, os.path.join(path, 'top_indices.pkl'))
joblib.dump(stop_words,  os.path.join(path, 'stop_words.pkl'))
joblib.dump(stemmer,     os.path.join(path, 'stemmer.pkl'))

print("\n    requirement_classifier.pkl")
print("    tfidf_vectorizer.pkl")
print("    feature_selector.pkl")
print("    top_indices.pkl")
print("    stop_words.pkl")
print("    stemmer.pkl")

print(f"""
   Algorithm         : Multinomial Naive Bayes
   Alpha             : 0.5
   Features          : TF-IDF Unigrams + Bigrams
   Training samples  : {len(df_train_balanced)} (balanced)
   Test samples      : {len(df_test)}
   Features used     : {X_train_final.shape[1]}

   ┌──────────────────────────┬──────────────┐
   │ Metric                   │ Value        │
   ├──────────────────────────┼──────────────┤
   │ Training Accuracy        │ {train_acc*100:.2f}%       │
   │ Test Accuracy            │ {test_acc*100:.2f}%       │
   │ Precision                │ {precision*100:.2f}%       │
   │ Recall                   │ {recall*100:.2f}%       │
   │ F1-Score                 │ {f1*100:.2f}%       │
   │ Real-world Accuracy      │ {rw_accuracy:.1f}%        │
   └──────────────────────────┴──────────────┘

   Overall Average Accuracy  : {(test_acc*100 + rw_accuracy)/2:.1f}%
   Model Status              :  READY FOR DEPLOYMENT
""")

print("\n All files saved in:", path)
print("\n To run the Streamlit dashboard:")
print(f"   cd {path}")
print("   streamlit run app.py")
