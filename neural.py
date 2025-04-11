import tensorflow as tf
from tensorflow.keras.datasets import mnist
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Flatten, Dropout
from tensorflow.keras.utils import to_categorical
import matplotlib.pyplot as plt
import numpy as np
import seaborn as sns
from sklearn.metrics import confusion_matrix, classification_report

# Load dataset
print("Loading MNIST dataset...")
(x_train, y_train), (x_test, y_test) = mnist.load_data()
print("Dataset loaded successfully!")

# Display dataset shape
print(f"Training data shape: {x_train.shape}, Training labels: {y_train.shape}")
print(f"Testing data shape: {x_test.shape}, Testing labels: {y_test.shape}")

# Normalize pixel values
x_train = x_train.astype("float32") / 255.0
x_test = x_test.astype("float32") / 255.0

# Convert labels to categorical
y_train_cat = to_categorical(y_train, num_classes=10)
y_test_cat = to_categorical(y_test, num_classes=10)

# Show sample images
print("\nDisplaying some sample images from the training data...")
plt.figure(figsize=(6, 6))
for i in range(9):
    plt.subplot(3, 3, i+1)
    plt.imshow(x_train[i], cmap='gray')
    plt.title(f"Label: {y_train[i]}")
    plt.axis('off')
plt.tight_layout()
plt.show()

# Build the model
print("\nBuilding the neural network...")
model = Sequential()
model.add(Flatten(input_shape=(28, 28)))
model.add(Dense(256, activation='relu'))
model.add(Dropout(0.3))
model.add(Dense(128, activation='relu'))
model.add(Dropout(0.3))
model.add(Dense(64, activation='relu'))
model.add(Dense(10, activation='softmax'))

# Compile the model
print("Compiling the model...")
model.compile(optimizer='adam',
              loss='categorical_crossentropy',
              metrics=['accuracy'])

# Print model summary
print("\nModel summary:")
model.summary()

# Train the model
print("\nStarting training process...")
history = model.fit(x_train, y_train_cat,
                    epochs=10,
                    batch_size=64,
                    validation_split=0.1)

# Evaluate the model
print("\nEvaluating the model on test data...")
test_loss, test_acc = model.evaluate(x_test, y_test_cat)
print(f"\nFinal Test Accuracy: {test_acc:.4f}")
print(f"Final Test Loss: {test_loss:.4f}")

# Plot accuracy and loss
print("\nPlotting training history...")
plt.figure(figsize=(14, 6))

plt.subplot(1, 2, 1)
plt.plot(history.history['accuracy'], label='Train Accuracy')
plt.plot(history.history['val_accuracy'], label='Validation Accuracy')
plt.title('Model Accuracy Over Epochs')
plt.xlabel('Epoch')
plt.ylabel('Accuracy')
plt.legend()

plt.subplot(1, 2, 2)
plt.plot(history.history['loss'], label='Train Loss')
plt.plot(history.history['val_loss'], label='Validation Loss')
plt.title('Model Loss Over Epochs')
plt.xlabel('Epoch')
plt.ylabel('Loss')
plt.legend()

plt.tight_layout()
plt.show()

# Predict sample values
print("\nPredicting values on test data...")
predictions = model.predict(x_test)
predicted_classes = np.argmax(predictions, axis=1)

# Show sample predictions
print("\nDisplaying some sample predictions...")
plt.figure(figsize=(10, 5))
for i in range(10):
    plt.subplot(2, 5, i + 1)
    plt.imshow(x_test[i], cmap='gray')
    plt.title(f"Predicted: {predicted_classes[i]}")
    plt.axis('off')
plt.tight_layout()
plt.show()

# Confusion Matrix
print("\nGenerating confusion matrix...")
conf_matrix = confusion_matrix(y_test, predicted_classes)
plt.figure(figsize=(10, 8))
sns.heatmap(conf_matrix, annot=True, fmt='d', cmap='Blues')
plt.title("Confusion Matrix")
plt.xlabel("Predicted Label")
plt.ylabel("True Label")
plt.show()

# Classification Report
print("\nClassification Report:")
print(classification_report(y_test, predicted_classes))

# Save model
print("\nSaving model to disk...")
model.save("mnist_digit_classifier_model.h5")
print("Model saved successfully as 'mnist_digit_classifier_model.h5'.")

# Load model (optional test)
print("\nLoading model from disk...")
loaded_model = tf.keras.models.load_model("mnist_digit_classifier_model.h5")
loaded_test_acc = loaded_model.evaluate(x_test, y_test_cat)[1]
print(f"Loaded model accuracy: {loaded_test_acc:.4f}")

# Final Statement
print("\nDone! This script demonstrates a complete neural network pipeline using MNIST.")
