export const downloadTxtFile = (text: string, fileName: string) => {
  const element = document.createElement("a");
  const file = new Blob([text], {
    type: "text/plain"
  });
  element.href = URL.createObjectURL(file);
  element.download = `${fileName}.json`;
  document.body.appendChild(element);
  element.click();
};
