
document.querySelector('.circle-input').addEventListener('input', function (e) {
    if (this.value.length > 3) {
        this.value = this.value.slice(0, 3); // חותך את התווים העודפים
    }
});


let scrollInterval;

document.querySelector('.circle-input').addEventListener('input', function (e) {
    // גבול להזנת 3 ספרות בלבד
    if (this.value.length > 3) {
        this.value = this.value.slice(0, 3);
    }

    const speed = parseInt(this.value, 10) || 0; // קבלת המהירות או 0 אם השדה ריק

    // עצירה אם מהירות שווה ל-0
    if (speed === 0) {
        clearInterval(scrollInterval);
        return;
    }

    // עצירה של גלילה קודמת
    clearInterval(scrollInterval);

    // יצירת גלילה חדשה
    scrollInterval = setInterval(() => {
        window.scrollBy(0, 1); // גלילה של פיקסל אחד
    }, 4200 / speed); // ככל שהמספר גבוה יותר, הזמן בין הגלילות קטן יותר (מהירות גבוהה יותר)
});

document.getElementById('deleteImages').addEventListener('click', function () {
    const imageContainer = document.getElementById('imageContainer');
    const canvas = document.getElementById('pdfCanvas');

    // מוחק את כל התמונות
    imageContainer.innerHTML = '';

    // מנקה את ה-PDF
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height); // מאפס את הקנבס
});

document.getElementById('uploadImages').addEventListener('click', function () {
    document.getElementById('fileInput').click(); // פותח את חלון העלאת הקבצים
});

document.getElementById('fileInput').addEventListener('change', function (event) {
    const files = event.target.files;
    const imageContainer = document.getElementById('imageContainer');
    for (const file of files) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const img = document.createElement('img');
            img.src = e.target.result;
            img.alt = 'Uploaded Image';
            imageContainer.appendChild(img);
        };
        reader.readAsDataURL(file);
    }
});


document.getElementById('uploadPdf').addEventListener('click', function () {
    document.getElementById('pdfInput').click();
});

document.getElementById('pdfInput').addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
        const reader = new FileReader();
        reader.onload = function (e) {
            const pdfData = new Uint8Array(e.target.result);
            displayPDF(pdfData);
        };
        reader.readAsArrayBuffer(file);
    } else {
        alert('אנא העלה קובץ PDF תקין');
    }
});

async function displayPDF(pdfData) {
    const loadingTask = pdfjsLib.getDocument({ data: pdfData });
    const pdf = await loadingTask.promise;

    const container = document.getElementById('imageContainer');
    container.innerHTML = ''; // Clear any previous content

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const scale = 1.5; // Adjust scale as needed
        const viewport = page.getViewport({ scale });

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        const renderContext = {
            canvasContext: context,
            viewport: viewport
        };

        await page.render(renderContext).promise;
        container.appendChild(canvas); // Append each page's canvas to the container
    }
}


