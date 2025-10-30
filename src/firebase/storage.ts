import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  UploadTaskSnapshot,
  uploadBytesResumable,
} from "firebase/storage";
import { storage } from "@/config/firebase";

// Generic file upload
export async function uploadFile(file: File, path: string): Promise<string> {
  try {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw new Error("Failed to upload file");
  }
}

// Upload image to Firebase Storage
export async function uploadImage(
  file: File,
  path: string,
  onProgress?: (progress: number) => void
): Promise<string> {
  try {
    // Create a reference to the file location
    const imageRef = ref(storage, path);
    const uploadTask = uploadBytesResumable(imageRef, file);

    if (onProgress) {
      return new Promise((resolve, reject) => {
        // Monitor upload progress
        uploadTask.on(
          "state_changed",
          (snapshot: UploadTaskSnapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            onProgress(progress);
          },
          (error) => {
            console.error("Error uploading image:", error);
            reject(error);
            throw new Error("Failed to upload image");
          },
          async () => {
            // Get the download URL
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

            resolve(downloadURL);
          }
        );
      });
    } else {
      // Simple upload without progress
      // Upload the file
      const snapshot = await uploadBytes(imageRef, file);

      // Get the download URL
      const downloadURL = await getDownloadURL(snapshot.ref);

      return downloadURL;
    }
  } catch (error) {
    console.error("Error uploading image:", error);
    throw new Error("Failed to upload image");
  }
}

// Delete image from Firebase Storage
export async function deleteImage(imageUrl: string): Promise<void> {
  try {
    // Extract the path from the URL
    const imageRef = ref(storage, imageUrl);
    await deleteObject(imageRef);
  } catch (error) {
    console.error("Error deleting image:", error);
    throw new Error("Failed to delete image");
  }
}

// Generate unique filename
export function generateImagePath(folder: string, filename: string): string {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  const extension = filename.split(".").pop() || "jpg";
  return `${folder}/${timestamp}_${randomString}.${extension}`;
}

export function generateFilePath(folder: string, filename: string): string {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  const extension = filename.split(".").pop() || "dat";
  return `${folder}/${timestamp}_${randomString}.${extension}`;
}

// Validate image file
export function validateImageFile(file: File): {
  valid: boolean;
  error?: string;
} {
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: "Please upload a valid image file (JPEG, PNG, or WebP)",
    };
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      error: "Image size must be less than 5MB",
    };
  }

  return { valid: true };
}

/**
 * Upload multiple images to Firebase Storage
 * @param files Array of File objects (from input[type=file])
 * @param folder Storage folder name
 * @returns Promise<string[]> - Array of download URLs
 */
export async function uploadMultipleImages(
  files: File[],
  basePath: string,
  onProgress?: (progress: number) => void
): Promise<string[]> {
  try {
    if (!files || files.length === 0) return [];

    const uploadPromises = files.map((file, index) => {
      const uniquePath = `${basePath}/${Date.now()}-${index}-${file.name}`;
      const imageRef = ref(storage, uniquePath);

      if (onProgress) {
        return new Promise<string>((resolve, reject) => {
          const uploadTask = uploadBytesResumable(imageRef, file);

          uploadTask.on(
            "state_changed",
            (snapshot: UploadTaskSnapshot) => {
              // Calculate overall progress across all files
              const fileProgress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              const totalProgress =
                fileProgress / files.length + (index / files.length) * 100;
              onProgress(Math.min(totalProgress, 100));
            },
            (error) => {
              console.error("Error uploading image:", error);
              reject(error);
            },
            async () => {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              resolve(downloadURL);
            }
          );
        });
      } else {
        // Upload without progress tracking
        return uploadBytes(imageRef, file).then(async (snapshot) => {
          return await getDownloadURL(snapshot.ref);
        });
      }
    });

    // Wait for all uploads to complete
    const urls = await Promise.all(uploadPromises);
    return urls;
  } catch (error) {
    console.error("Error uploading multiple images:", error);
    throw new Error("Failed to upload multiple images");
  }
}
