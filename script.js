document.addEventListener('DOMContentLoaded', () => {
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const preview = document.getElementById('preview');
    const convertBtn = document.getElementById('convertBtn');
    const status = document.getElementById('status');

    // Handle drag and drop events
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, () => {
            dropZone.classList.add('dragover');
        });
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, () => {
            dropZone.classList.remove('dragover');
        });
    });

    // Handle file drop
    dropZone.addEventListener('drop', (e) => {
        const file = e.dataTransfer.files[0];
        if (file && file.type === 'image/gif') {
            handleFile(file);
        } else {
            status.textContent = 'Please drop a GIF file.';
        }
    });

    // Handle click to upload
    dropZone.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file && file.type === 'image/gif') {
            handleFile(file);
        } else {
            status.textContent = 'Please select a GIF file.';
        }
    });

    function handleFile(file) {
        status.textContent = 'Loading GIF...';
        const reader = new FileReader();

        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                preview.src = img.src;
                preview.style.display = 'block';
                convertBtn.style.display = 'block';
                status.textContent = 'GIF loaded successfully!';
            };
            img.src = e.target.result;
        };

        reader.readAsDataURL(file);
    }

    // Convert and download
    convertBtn.addEventListener('click', () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = preview;

        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        ctx.drawImage(img, 0, 0);

        // Convert to JPEG
        const jpegData = canvas.toDataURL('image/jpeg', 0.9);
        
        // Create download link
        const link = document.createElement('a');
        link.download = 'converted-image.jpg';
        link.href = jpegData;
        link.click();

        status.textContent = 'Conversion complete! Downloading JPEG...';
    });
});