function getTotalImages() {
  const tooltip = document.querySelector('#imageScrollbar0 .image-no-tooltip');
  const match = tooltip?.textContent?.match(/of\s+(\d+)/i);
  return match ? parseInt(match[1]) : 0;
}

function getPatientInfo() {
  const span = document.querySelector('#titleBar-text-patientDemographicInfo');
  if (!span) return 'unknown_patient';

  const text = span.textContent || '';
  const idMatch = text.match(/Patient ID[:\s]*(\d+)/i);
  const studyMatch = text.match(/\d{2}:\d{2}\s+(.+)Location:/i);

  const patientId = idMatch ? idMatch[1] : 'unknownID';
  let study = studyMatch ? studyMatch[1].trim() : 'unknownStudy';

  // Clean for filename: remove/replace invalid chars
  study = study.replace(/[\/\\:*?"<>|]+/g, '_')         // replace invalid characters
               .replace(/\s+/g, '_')                    // replace spaces with underscores
               .replace(/_+/g, '_')                     // collapse multiple underscores
               .replace(/^_+|_+$/g, '');                // trim leading/trailing underscores

  return `${patientId}_${study}`;
}

async function saveAllSlices() {
  const total = getTotalImages();
  const canvas = document.querySelector('canvas');
  const scrollDown = document.querySelector('.scroll-down-arrow');
  const baseName = getPatientInfo();

  if (!canvas || !scrollDown || !total) {
    console.error("❌ Missing required elements.");
    return;
  }

  for (let i = 1; i <= total; i++) {
    await new Promise(r => setTimeout(r, 150));  // reduced delay

    const dataUrl = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `${baseName}_slice_${i}.png`;
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
