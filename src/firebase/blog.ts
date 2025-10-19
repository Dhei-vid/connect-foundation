import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  startAfter,
  increment 
} from "firebase/firestore";
import { db } from "@/config/firebase";
import type { BlogPost } from "@/common/types";

const BLOG_COLLECTION = "blogs";

export async function getAllBlogPosts(limitCount?: number): Promise<BlogPost[]> {
  try {
    const q = query(
      collection(db, BLOG_COLLECTION),
      where("published", "==", true),
      orderBy("publishedAt", "desc"),
      limitCount ? limit(limitCount) : limit(20)
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      publishedAt: doc.data().publishedAt?.toDate(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    })) as BlogPost[];
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    throw error;
  }
}

export async function getBlogPostById(id: string): Promise<BlogPost | null> {
  try {
    const docRef = doc(db, BLOG_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        publishedAt: data.publishedAt?.toDate(),
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
      } as BlogPost;
    }
    return null;
  } catch (error) {
    console.error("Error fetching blog post:", error);
    throw error;
  }
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const q = query(
      collection(db, BLOG_COLLECTION),
      where("slug", "==", slug),
      where("published", "==", true)
    );
    
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    
    const doc = snapshot.docs[0];
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      publishedAt: data.publishedAt?.toDate(),
      createdAt: data.createdAt?.toDate(),
      updatedAt: data.updatedAt?.toDate(),
    } as BlogPost;
  } catch (error) {
    console.error("Error fetching blog post by slug:", error);
    throw error;
  }
}

export async function getFeaturedBlogPosts(): Promise<BlogPost[]> {
  try {
    const q = query(
      collection(db, BLOG_COLLECTION),
      where("published", "==", true),
      where("featured", "==", true),
      orderBy("publishedAt", "desc"),
      limit(3)
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      publishedAt: doc.data().publishedAt?.toDate(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    })) as BlogPost[];
  } catch (error) {
    console.error("Error fetching featured blog posts:", error);
    throw error;
  }
}

export async function getBlogPostsByCategory(category: string): Promise<BlogPost[]> {
  try {
    const q = query(
      collection(db, BLOG_COLLECTION),
      where("published", "==", true),
      where("categories", "array-contains", category),
      orderBy("publishedAt", "desc")
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      publishedAt: doc.data().publishedAt?.toDate(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    })) as BlogPost[];
  } catch (error) {
    console.error("Error fetching blog posts by category:", error);
    throw error;
  }
}

export async function searchBlogPosts(searchTerm: string): Promise<BlogPost[]> {
  try {
    const q = query(
      collection(db, BLOG_COLLECTION),
      where("published", "==", true),
      orderBy("publishedAt", "desc")
    );
    
    const snapshot = await getDocs(q);
    const posts = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      publishedAt: doc.data().publishedAt?.toDate(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    })) as BlogPost[];
    
    // Filter posts by search term (title, excerpt, tags)
    return posts.filter(post => 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  } catch (error) {
    console.error("Error searching blog posts:", error);
    throw error;
  }
}

export async function incrementBlogPostViews(id: string): Promise<void> {
  try {
    const docRef = doc(db, BLOG_COLLECTION, id);
    await updateDoc(docRef, {
      views: increment(1)
    });
  } catch (error) {
    console.error("Error incrementing blog post views:", error);
    throw error;
  }
}

export async function incrementBlogPostLikes(id: string): Promise<void> {
  try {
    const docRef = doc(db, BLOG_COLLECTION, id);
    await updateDoc(docRef, {
      likes: increment(1)
    });
  } catch (error) {
    console.error("Error incrementing blog post likes:", error);
    throw error;
  }
}

export async function createBlogPost(blogPost: Omit<BlogPost, "id" | "createdAt" | "updatedAt">): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, BLOG_COLLECTION), {
      ...blogPost,
      views: 0,
      likes: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error creating blog post:", error);
    throw error;
  }
}

export async function updateBlogPost(id: string, updates: Partial<BlogPost>): Promise<void> {
  try {
    const docRef = doc(db, BLOG_COLLECTION, id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error("Error updating blog post:", error);
    throw error;
  }
}

export async function deleteBlogPost(id: string): Promise<void> {
  try {
    const docRef = doc(db, BLOG_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting blog post:", error);
    throw error;
  }
}
