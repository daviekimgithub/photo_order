import imageCompression from 'browser-image-compression';
import heic2any from 'heic2any';

export const isHeicFile = (fileName) => {
  return fileName.endsWith('.heic');
};

const replaceFileName = (fileName) => {
  return fileName?.replace('.heic', '.jpg');
}

const convertHeicToJpg = async (heicBlob) => {
  try {
    const jpgBlob = await heic2any({
      blob: heicBlob,
      toType: 'image/jpeg',
    });
    return jpgBlob;
  } catch (error) {
    console.error('Error converting HEIC to JPEG:', error);
    throw new Error('Failed to convert HEIC to JPEG');
  }
};

const getScaleFactor = (maxSize, maxDimension) => {
  const maxFinalSize = 3500;
  const baseScaleFactor = 1;

  if (maxSize !== 0) {
    if (maxSize < maxDimension) {
      return maxSize / maxDimension;
    }
  } else if (maxDimension > maxFinalSize) {
    return  maxFinalSize / maxDimension;
  }

  return baseScaleFactor;
}

export const getCompressedImage = async ({ width, height, maxSize = 0, file }) => {
  const maxDimension = Math.max(width, height);
  const scaleFactor = getScaleFactor(maxSize, maxDimension);
  const newWidth = Math.round(width * scaleFactor);
  const newHeight = Math.round(height * scaleFactor);
  
  const options = {
    maxSizeMB: 3,
    maxWidthOrHeight: Math.max(newWidth, newHeight),
    useWebWorker: true,
  };

  // Check if the file is HEIC
  const isHeic = isHeicFile(file.name);

  // Convert base64 data to Blob
  const blob = base64ToBlob(file.data, 'image/jpeg');

  // If the file is HEIC, convert it to JPEG
  const convertedBlob = isHeic ? await convertHeicToJpg(blob) : null;

  try {
    // If the file is HEIC, use its converted Blob for compression
    const compressedBlob = isHeic ? convertedBlob : await imageCompression(blob, options);

    // Create a file to send to the server
    const resultFile = new File([compressedBlob], isHeic ? file.name : replaceFileName(file.name), { type: "image/jpeg" });

    // If the file is HEIC, convert its base64 data to JPEG format
    const fileAsBase64 = isHeic ? await convertBlobToBase64(compressedBlob) : file.data;

    return { file: resultFile, fileAsBase64 };
  } catch (error) {
    console.error('Error compressing the image:', error);
    throw error;
  }
};

const convertBlobToBase64 = (blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = () => {
      const base64Data = reader.result.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = (error) => {
      reject(error);
    };
  });
};

export const base64ToBlob = (base64Data, contentType = '', sliceSize = 512) => {
  const byteCharacters = atob(base64Data);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  const blob = new Blob(byteArrays, { type: contentType });
  return blob;
};
