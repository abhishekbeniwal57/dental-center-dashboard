/**
 * Utility function to safely view a file from base64 data
 * @param {Object} file - File object containing data and type
 */
export const viewFile = (file) => {
  try {
    // Skip if no data
    if (!file || !file.data) {
      console.error("No file data available");
      alert("Unable to view file: No data available");
      return;
    }

    // Get the base64 content (after the comma)
    const base64Content = file.data.split(",")[1];
    if (!base64Content) {
      console.error("Invalid file data format");
      alert("Unable to view file: Invalid data format");
      return;
    }

    // Convert base64 to binary
    const byteString = atob(base64Content);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);

    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    // Create a blob and URL
    const fileType = file.type || "application/octet-stream";
    const blob = new Blob([ab], { type: fileType });
    const fileURL = URL.createObjectURL(blob);

    // Open in new window
    const newWindow = window.open(fileURL);

    // Clean up the URL when the window is closed
    if (newWindow) {
      newWindow.onunload = () => URL.revokeObjectURL(fileURL);
    }
  } catch (error) {
    console.error("Error viewing file:", error);
    alert(`Unable to view file: ${error.message}`);
  }
};
