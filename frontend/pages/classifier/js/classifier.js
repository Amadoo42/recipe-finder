const uploadZone = document.getElementById('uploadZone');
const fileInput = document.getElementById('imageUpload');
const uploadLabel = document.getElementById('uploadLabel');
const preview = document.getElementById('preview');

uploadZone.addEventListener('click', () => fileInput.click());

fileInput.addEventListener('change', () => {
    const file = fileInput.files[0];
    if (file) showFile(file);
});

uploadZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadZone.classList.add('drag-over');
});

uploadZone.addEventListener('dragleave', () => {
    uploadZone.classList.remove('drag-over');
});

uploadZone.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadZone.classList.remove('drag-over');
    const file = e.dataTransfer.files[0];
    if (file) {
        fileInput.files = e.dataTransfer.files;
        showFile(file);
    }
});

function showFile(file) {
    uploadLabel.innerHTML = `<span>${file.name}</span>`;
    preview.src = URL.createObjectURL(file);
    preview.style.display = 'block';
}