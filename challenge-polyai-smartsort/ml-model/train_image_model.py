import tensorflow as tf
from tensorflow import keras
from keras import layers
import os

IMG_SIZE = (224, 224)
BATCH_SIZE = 32
EPOCHS = 20
NUM_CLASSES = 6

CATEGORIES = ['glass', 'metal', 'organic', 'other', 'paper', 'plastic'] 
def create_model(num_classes=NUM_CLASSES):
    data_augmentation = keras.Sequential([
        layers.RandomFlip("horizontal"),
        layers.RandomRotation(0.2),
        layers.RandomZoom(0.2),
    ])
    
    base_model = keras.applications.MobileNetV2(
        input_shape=(*IMG_SIZE, 3),
        include_top=False,
        weights='imagenet'
    )
    base_model.trainable = False
    
    inputs = keras.Input(shape=(*IMG_SIZE, 3))
    x = data_augmentation(inputs)
    x = layers.Rescaling(scale=1./127.5, offset=-1)(x)
    x = base_model(x, training=False)
    x = layers.GlobalAveragePooling2D()(x)
    x = layers.Dense(512, activation='relu')(x)
    x = layers.Dropout(0.5)(x)
    x = layers.Dense(256, activation='relu')(x)
    x = layers.Dropout(0.3)(x)
    outputs = layers.Dense(num_classes, activation='softmax')(x)
    
    model = keras.Model(inputs, outputs)
    return model

def prepare_data(data_dir):
    train_ds = tf.keras.utils.image_dataset_from_directory(
        data_dir,
        labels='inferred',
        label_mode='categorical',
        validation_split=0.2,
        subset='training',
        seed=42,
        image_size=IMG_SIZE,
        batch_size=BATCH_SIZE
    )
    
    val_ds = tf.keras.utils.image_dataset_from_directory(
        data_dir,
        labels='inferred',
        label_mode='categorical',
        validation_split=0.2,
        subset='validation',
        seed=42,
        image_size=IMG_SIZE,
        batch_size=BATCH_SIZE
    )
    
    AUTOTUNE = tf.data.AUTOTUNE
    train_ds = train_ds.cache().prefetch(buffer_size=AUTOTUNE)
    val_ds = val_ds.cache().prefetch(buffer_size=AUTOTUNE)
    
    return train_ds, val_ds

def train_model(data_dir, save_path='models/waste_classifier_image.h5'):
    print("Préparation des données...")
    train_ds, val_ds = prepare_data(data_dir)
    
    print("\nConstruction du modèle...")
    model = create_model(num_classes=len(CATEGORIES))
    
    model.compile(
        optimizer=keras.optimizers.Adam(learning_rate=1e-3),
        loss='categorical_crossentropy',
        metrics=['accuracy', keras.metrics.TopKCategoricalAccuracy(k=2, name='top_2_accuracy')]
    )
    
    callbacks = [
        keras.callbacks.EarlyStopping(
            monitor='val_loss',
            patience=5,
            restore_best_weights=True
        ),
        keras.callbacks.ReduceLROnPlateau(
            monitor='val_loss',
            factor=0.5,
            patience=3,
            min_lr=1e-7
        ),
        keras.callbacks.ModelCheckpoint(
            save_path,
            monitor='val_accuracy',
            save_best_only=True,
            verbose=1
        )
    ]
    
    history = model.fit(
        train_ds,
        validation_data=val_ds,
        epochs=EPOCHS,
        callbacks=callbacks
    )
    
    os.makedirs(os.path.dirname(save_path), exist_ok=True)
    model.save(save_path, save_format='h5')
    print(f"\nModèle sauvegardé: {save_path}")
    
    return model, history


def fine_tune_model(model, train_ds, val_ds, save_path='models/waste_classifier_image.h5'):
    print("\nFine-tuning du modèle...")
    
    base_model = model.layers[2]
    base_model.trainable = True
    
    for layer in base_model.layers[:-50]:
        layer.trainable = False
    
    model.compile(
        optimizer=keras.optimizers.Adam(learning_rate=1e-5),
        loss='categorical_crossentropy',
        metrics=['accuracy', keras.metrics.TopKCategoricalAccuracy(k=2, name='top_2_accuracy')]
    )
    
    history_fine = model.fit(
        train_ds,
        validation_data=val_ds,
        epochs=15,
        callbacks=[
            keras.callbacks.EarlyStopping(patience=3, restore_best_weights=True),
            keras.callbacks.ModelCheckpoint(save_path, save_best_only=True, monitor='val_accuracy')
        ]
    )
    
    model.save(save_path, save_format='h5')
    print(f"Fine-tuning terminé. Modèle sauvegardé: {save_path}")
    return model, history_fine


if __name__ == "__main__":
    DATA_DIR = "garbage-classification"
    if not os.path.exists(DATA_DIR):
        print(f"Erreur: Le répertoire {DATA_DIR} n'existe pas!")
    else:
        model, history = train_model(DATA_DIR)
        train_ds, val_ds = prepare_data(DATA_DIR)
        print("\nEntraînement terminé avec succès")
