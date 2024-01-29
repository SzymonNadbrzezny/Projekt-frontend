export function getBase64(file: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    if (!file) {
      resolve(new Error("No file"));
    }
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
  });
}
