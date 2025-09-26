import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "@/config/firebase";

// Upload image to Firebase Storage
export async function uploadImage(
  file: File,
  path: string
): Promise<string> {
  try {
    // Create a reference to the file location
    const imageRef = ref(storage, path);
    
    // Upload the file
    const snapshot = await uploadBytes(imageRef, file);
    
    // Get the download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return downloadURL;
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
  const extension = filename.split('.').pop();
  return `${folder}/${timestamp}_${randomString}.${extension}`;
}

// Validate image file
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Please upload a valid image file (JPEG, PNG, or WebP)'
    };
  }
  
  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'Image size must be less than 5MB'
    };
  }
  
  return { valid: true };
}
