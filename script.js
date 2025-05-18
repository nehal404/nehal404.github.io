const classNames = [
    'Bitot\'s spots', 'Corneal Ulcer', 'Ectropion', 'Swelling-disease', 'pterygium',
    'stye', 'Acute Papillitis', 'Bacterial Papillitis', 'Jaundiced Eyes', 'Normal',
    'Uveitis', 'Viral Papillitis', 'bulging eyes', 'cataract', 'conjunctivitis', 'crossed_eyes'
];

async function loadAndRunModel() {
    try {
        await tf.setBackend('wasm');
        await tf.ready();
        console.log('WebAssembly backend initialized');

        const model = await tf.loadGraphModel('/models/tfjs_model/model.json');
        console.log('YOLO11n-cls TensorFlow.js model loaded');

        const imageInput = document.getElementById('imageInput');
        imageInput.addEventListener('change', async (event) => {
            const file = event.target.files[0];
            if (!file) return;

            const img = new Image();
            img.src = URL.createObjectURL(file);
            img.onload = async () => {
                const canvas = document.getElementById('preview');
                canvas.style.display = 'block';
                canvas.width = 416;
                canvas.height = 416;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, 416, 416);

                let tensor = tf.browser.fromPixels(img)
                    .resizeNearestNeighbor([416, 416])
                    .toFloat()
                    .div(tf.scalar(255.0))
                    .expandDims();

                const output = model.predict(tensor);
                const probabilities = output.dataSync();

                const maxProb = Math.max(...probabilities);
                const classIndex = probabilities.indexOf(maxProb);
                const predictedClass = classNames[classIndex];
                const confidence = (maxProb * 100).toFixed(2);

                document.getElementById('result').textContent = 
                    `Prediction: ${predictedClass} (${confidence}% confidence)`;

                URL.revokeObjectURL(img.src);
                tensor.dispose();
                output.dispose();
            };
        });
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('result').textContent = `Error: ${error.message}`;
    }
}

loadAndRunModel();