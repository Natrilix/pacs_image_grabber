function getTotalImages() {
  const tooltip = document.querySelector('#imageScrollbar0 .image-no-tooltip');
  const match = tooltip?.textContent?.match(/of\s+(\d+)/i);
  return match ? parseInt(match[1]) : 0;
}

async function saveAllSlices() {
  const total = getTotalImages();
  const canvas = document.querySelector('canvas');
  const scrollDown = document.querySelector('.scroll-down-arrow');

  if (!canvas || !scrollDown || !total) {
    console.error("❌ Missing required elements.");
    return;
  }

  for (let i = 1; i <= total; i++) {
    await new Promise(r => setTimeout(r, 500));  // wait for redraw
    const dataUrl = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `slice_${i}.png`;
    a.click();

    if (i < total) scrollDown.click();
  }
}

document.addEventListener('keydown', (e) => {
  if (e.key.toLowerCase() === 's') {
    console.log('🔘 Starting saveAllSlices()...');
    saveAllSlices();
  }
});
