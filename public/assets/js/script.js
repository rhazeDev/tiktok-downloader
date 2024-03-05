const pasteBtn = document.getElementById('paste');
const downloadBtn = document.getElementById('download');
const url = document.getElementById('url');
const cover = document.getElementById('cover');
const title = document.getElementById('title');
const creator = document.getElementById('creator');
const duration = document.getElementById('duration');
const size = document.getElementById('size');
const wait = document.getElementById('wait');
const result_container = document.getElementsByClassName('result-container');

pasteBtn.addEventListener('click', async () => {
    const text = await navigator.clipboard.readText();
    url.value = text;
});

downloadBtn.addEventListener('click', async () => {
    const response = await fetch('/api/download', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url: url.value })
    });
    const data = await response.json();
    
    if (data.status == "success") {
        let title_c = data.data.title;
        cover.src = data.data.cover;
        title.textContent = title_c.substring(0, 30) + "...";
        creator.textContent = "- " + data.data.creator;
        duration.textContent = data.data.duration;
        size.textContent = data.data.size;

        result_container[0].style.display = "block";

        // download video
        downloadVideo(data.data.download_link, data.data.title)
       

    } else {
        alert(data.message);
    }
});

async function downloadVideo(videoUrl, fileName) {
    wait.style.display = "block";
    wait.textContent = "Please wait, downloading...";

    // file name just get the 12 character
    fileName = fileName.substring(0, 12);

    const response = await fetch(videoUrl);
    const blob = await response.blob();

    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = "Rhaze" + fileName + '.mp4';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    wait.style.display = "none";
}