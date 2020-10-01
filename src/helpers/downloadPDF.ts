import isSafari from "./isSafari";

const downloadPDF = (blob: Blob, fileName: string) => {
  const link = window.URL.createObjectURL(blob);
  // Open PDF in new Tab
  window.open(link, isSafari ? '_self' : '_blank');
  // Download PDF file without opening
  if (!isSafari) {
    const name = fileName;
    const linkEl = document.createElement('a');
    linkEl.href = link;
    linkEl.download = name;
    linkEl.target = '_blank';
    linkEl.click();
  }
};

export default downloadPDF;