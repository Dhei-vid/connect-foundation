# Image Upload System Documentation

## Overview

The application now includes a comprehensive image upload system for orphanages. This system uses a **gallery-based selection** approach where orphanages:

1. **Upload images** to their photo gallery (up to 20 images)
2. **Select from gallery** which image to use as logo
3. **Select from gallery** which image to use as cover image

This ensures all images are stored in one place and can be reused for different purposes.

### Image Types

- **Gallery Images**: Multiple photos of facilities, children, and activities (up to 20 images)
- **Logo**: Selected from gallery (square images work best)
- **Cover Image**: Selected from gallery (landscape images work best)

### Where Orphanages Can Upload Images

1. **During Onboarding** - Step 5 of 6 in the registration process
2. **From Settings** - Using the OrphanageImageManager component (future implementation)

## Current Implementation Status

### ✅ Implemented Features

1. **Type Definitions**
   - Updated `Orphanage` interface in `src/common/types.ts` to include `images: string[]` field
   - Maintains existing `logoURL` and `coverImageURL` fields

2. **UI Components**
   - `MultiImageUpload` (`src/components/ui/multi-image-upload.tsx`)
     - Drag-and-drop support
     - Multiple file selection
     - Image preview
     - File size validation (5MB per image by default)
     - Max image limit (configurable, default 10)
     - Local storage of images before upload
     - Visual indicators for uploaded vs. local images
   
   - `OrphanageImageManager` (`src/components/orphanage/orphanage-image-manager.tsx`)
     - Complete image management interface
     - Logo upload section
     - Cover image upload section
     - Photo gallery management
     - Save/Reset functionality
     - Visual feedback with toasts
   
   - `ImagesStep` (`src/components/onboarding/images-step.tsx`)
     - Onboarding step component for image uploads
     - Multi-image gallery upload with drag-and-drop
     - Gallery-based logo selection (square grid)
     - Gallery-based cover image selection (landscape grid)
     - Visual selection indicators with checkmarks
     - Color-coded badges (blue for logo, green for cover)
     - Real-time preview of selections
     - Helpful tips and guidance
     - Skip option with explanation

3. **Onboarding Integration**
   - Added image upload as Step 5 of 6 in orphanage onboarding
   - Updated progress tracking (now 6 steps total)
   - Added images section to Review step
   - Images are optional but encouraged
   - Clear messaging about Firebase Storage pending

4. **Mock Data**
   - Success stories now include fully populated orphanage data with images
   - Each mock orphanage has:
     - Logo URL
     - Cover image URL
     - 3-4 gallery images
     - Complete contact and organizational information

### 🚧 Pending Implementation

#### Firebase Storage Integration

The image upload functionality is **fully built and ready** but **not connected to Firebase Storage yet**. Here's what needs to be implemented:

##### Required Steps:

1. **Firebase Storage Setup**
   ```typescript
   // In src/firebase/storage.ts
   import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
   import { storage } from '@/config/firebase';
   
   export async function uploadOrphanageImage(
     orphanageId: string,
     file: File,
     type: 'logo' | 'cover' | 'gallery'
   ): Promise<string> {
     const timestamp = Date.now();
     const filename = `${timestamp}_${file.name}`;
     const path = `orphanages/${orphanageId}/${type}/${filename}`;
     
     const storageRef = ref(storage, path);
     await uploadBytes(storageRef, file);
     const url = await getDownloadURL(storageRef);
     
     return url;
   }
   
   export async function deleteOrphanageImage(imageUrl: string): Promise<void> {
     const imageRef = ref(storage, imageUrl);
     await deleteObject(imageRef);
   }
   ```

2. **Update MultiImageUpload Component**
   ```typescript
   // Add upload handler prop
   interface MultiImageUploadProps {
     // ... existing props
     onUpload?: (file: File) => Promise<string>;
   }
   
   // Add upload functionality
   const handleUpload = async (imageFile: ImageFile) => {
     if (!onUpload) return;
     
     setLocalImages(prev => prev.map(img => 
       img.id === imageFile.id ? { ...img, uploading: true } : img
     ));
     
     try {
       const url = await onUpload(imageFile.file);
       onChange([...value, url]);
       setLocalImages(prev => prev.filter(img => img.id !== imageFile.id));
     } catch (error) {
       console.error('Upload failed:', error);
       setLocalImages(prev => prev.map(img => 
         img.id === imageFile.id ? { ...img, uploading: false } : img
       ));
     }
   };
   ```

3. **Update OrphanageImageManager**
   ```typescript
   import { uploadOrphanageImage } from '@/firebase/storage';
   
   const handleUpload = async (file: File, type: 'logo' | 'cover' | 'gallery') => {
     try {
       const url = await uploadOrphanageImage(orphanageId, file, type);
       return url;
     } catch (error) {
       toast.error('Upload failed');
       throw error;
     }
   };
   ```

4. **Firebase Storage Rules**
   ```
   rules_version = '2';
   service firebase.storage {
     match /b/{bucket}/o {
       match /orphanages/{orphanageId}/{type}/{imageId} {
         // Allow orphanage to upload their own images
         allow write: if request.auth != null 
                      && request.auth.uid == orphanageId
                      && request.resource.size < 5 * 1024 * 1024 // 5MB limit
                      && request.resource.contentType.matches('image/.*');
         
         // Allow anyone to read images
         allow read: if true;
       }
     }
   }
   ```

## Usage Examples

### Basic Usage

```typescript
import { MultiImageUpload } from '@/components/ui/multi-image-upload';

function MyComponent() {
  const [images, setImages] = useState<string[]>([]);
  
  return (
    <MultiImageUpload
      value={images}
      onChange={setImages}
      maxImages={10}
      maxSizeMB={5}
      label="Upload Images"
      description="Select up to 10 images"
    />
  );
}
```

### With Upload Handler (Future)

```typescript
import { MultiImageUpload } from '@/components/ui/multi-image-upload';
import { uploadOrphanageImage } from '@/firebase/storage';

function MyComponent() {
  const [images, setImages] = useState<string[]>([]);
  const orphanageId = "orphan-123";
  
  const handleUpload = async (file: File) => {
    return await uploadOrphanageImage(orphanageId, file, 'gallery');
  };
  
  return (
    <MultiImageUpload
      value={images}
      onChange={setImages}
      onUpload={handleUpload}
      maxImages={20}
      label="Photo Gallery"
    />
  );
}
```

### Full Image Manager

```typescript
import { OrphanageImageManager } from '@/components/orphanage/orphanage-image-manager';

function OrphanageSettings() {
  const [orphanage, setOrphanage] = useState<Orphanage>({ /* ... */ });
  
  const handleUpdate = async (updates: Partial<Orphanage>) => {
    // Update orphanage in database
    await updateOrphanageProfile(orphanage.id, updates);
    setOrphanage({ ...orphanage, ...updates });
  };
  
  return (
    <OrphanageImageManager
      orphanage={orphanage}
      onUpdate={handleUpdate}
    />
  );
}
```

## Success Stories Integration

Success stories now properly showcase orphanages that have met their funding targets:

### How It Works

1. **Funding Target Tracking**
   - Each `Issue` has `estimatedCost` and `raisedAmount` fields
   - When `raisedAmount >= estimatedCost`, the issue can be marked as "resolved"
   
2. **Success Story Creation**
   - Success stories link to resolved issues via `issueId`
   - They include the orphanage that received the funding
   - Display impact metrics (beneficiaries, cost, completion date)

3. **Orphanage Display**
   - Success stories show the orphanage's logo
   - Include orphanage name and location
   - Link to full orphanage profile (when implemented)
   - Display orphanage images in the success story

### Mock Data Structure

```typescript
{
  id: "story-1",
  orphanageId: "orphan-1",
  orphanageName: "Hope Children's Home",
  issueId: "issue-1",
  issueTitle: "New Dormitory Construction",
  title: "New Dormitory Brings Hope to 50 Children",
  description: "...",
  impact: "...",
  images: ["url1", "url2", ...],  // From Issue.images
  beneficiaries: 50,
  cost: 125000,
  completedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## Component Props

### MultiImageUpload

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| value | string[] | [] | Array of uploaded image URLs |
| onChange | (urls: string[]) => void | required | Callback when images change |
| maxImages | number | 10 | Maximum number of images |
| maxSizeMB | number | 5 | Maximum file size in MB |
| label | string | "Upload Images" | Label text |
| description | string | undefined | Helper text |
| className | string | undefined | Additional CSS classes |
| disabled | boolean | false | Disable interactions |
| onUpload | (file: File) => Promise<string> | undefined | Upload handler (future) |

### OrphanageImageManager

| Prop | Type | Description |
|------|------|-------------|
| orphanage | Partial<Orphanage> | Current orphanage data |
| onUpdate | (updates: Partial<Orphanage>) => void | Callback for saving changes |
| disabled | boolean | Disable all interactions |

## File Structure

```
src/
├── common/
│   └── types.ts                              # Updated Orphanage interface
├── components/
│   ├── ui/
│   │   └── multi-image-upload.tsx           # Multi-image upload component
│   ├── orphanage/
│   │   └── orphanage-image-manager.tsx      # Complete image management UI
│   └── onboarding/
│       ├── images-step.tsx                  # NEW: Onboarding images step
│       └── review-step.tsx                  # Updated: Shows images in review
└── app/
    ├── admin/
    │   └── (portal)/
    │       └── success-stories/
    │           └── page.tsx                 # Success stories with orphanage images
    └── orphanage/
        └── onboarding/
            └── page.tsx                     # Updated: Added images step (Step 5/6)
```

## Next Steps

1. **Set up Firebase Storage** in your Firebase project
2. **Implement upload functions** in `src/firebase/storage.ts`
3. **Connect components** to Firebase Storage
4. **Update storage rules** for security
5. **Test uploads** with real images
6. **Add progress indicators** for uploads
7. **Implement image optimization** (resize, compress)
8. **Add image deletion** functionality

## Benefits

- ✅ **User-Friendly**: Drag-and-drop, visual feedback, clear instructions
- ✅ **Flexible**: Works with any image type and storage backend
- ✅ **Scalable**: Supports multiple images per orphanage
- ✅ **Secure**: Ready for Firebase Storage rules implementation
- ✅ **Maintainable**: Clean component structure, easy to extend
- ✅ **Accessible**: Keyboard navigation, screen reader support
- ✅ **Responsive**: Works on all device sizes

## Questions or Issues?

If you need help implementing Firebase Storage or have questions about the image upload system, refer to:
- [Firebase Storage Documentation](https://firebase.google.com/docs/storage)
- [React File Upload Best Practices](https://react.dev/learn/responding-to-events#uploading-files)

