// Class names from the model YAML
const classNames = [
    'Bitot spots', 'Corneal Ulcer', 'Ectropion', 'Swelling-disease', 'pterygium',
    'stye', 'Acute Papillitis', 'Bacterial Papillitis', 'Jaundiced Eyes', 'Normal',
    'Uveitis', 'Viral Papillitis', 'bulging eyes', 'cataract', 'conjunctivitis', 'crossed_eyes'
];

async function loadAndRunModel() {
    try {
        // Set WebAssembly backend for performance
        await tf.setBackend('wasm');
        await tf.ready();
        console.log('WebAssembly backend initialized');

        // Load the TFLite model
        const tfliteModel = await tflite.loadTFLiteModel('/models/model.tflite');
        console.log('YOLO11n-cls model loaded');

        // Handle image input
        const imageInput = document.getElementById('imageInput');
        imageInput.addEventListener('change', async (event) => {
            const file = event.target.files[0];
            if (!file) return;

            // Create an image element
            const img = new Image();
            img.src = URL.createObjectURL(file);
            img.onload = async () => {
                // Preprocess image: resize to 416x416, normalize to [0,1]
                const tensor = tf.browser.fromPixels(img)
                    .resizeNearestNeighbor([416, 416]) // Match model input size
                    .toFloat()
                    .div(tf.scalar(255.0)) // Normalize
                    .expandDims(); // Add batch dimension (1, 416, 416, 3)

                // Run inference
                const output = await tfliteModel.predict(tensor);
                const probabilities = output.dataSync(); // Get class probabilities

                // Find the top prediction
                const maxProb = Math.max(...probabilities);
                const classIndex = probabilities.indexOf(maxProb);
                const predictedClass = classNames[classIndex];
                const confidence = (maxProb * 100).toFixed(2);

                // Display result
                document.getElementById('result').textContent = 
                    `Prediction: ${predictedClass} (${confidence}% confidence)`;

                // Clean up
                URL.revokeObjectURL(img.src);
                tensor.dispose();
                output.dispose();
            };
        });
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('result').textContent = 'Error running model.';
    }
}

// Initialize
loadAndRunModel();