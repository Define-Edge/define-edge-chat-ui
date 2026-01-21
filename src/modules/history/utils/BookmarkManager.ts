export class BookmarkManager {
  private static STORAGE_KEY = "bookmarked_threads";

  static getBookmarks(): string[] {
    if (typeof window === "undefined") return [];
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  static addBookmark(threadId: string): void {
    const bookmarks = this.getBookmarks();
    if (!bookmarks.includes(threadId)) {
      bookmarks.push(threadId);
      this.saveBookmarks(bookmarks);
    }
  }

  static removeBookmark(threadId: string): void {
    const bookmarks = this.getBookmarks();
    const newBookmarks = bookmarks.filter((id) => id !== threadId);
    this.saveBookmarks(newBookmarks);
  }

  static isBookmarked(threadId: string): boolean {
    return this.getBookmarks().includes(threadId);
  }

  static toggleBookmark(threadId: string): boolean {
    if (this.isBookmarked(threadId)) {
      this.removeBookmark(threadId);
      return false;
    } else {
      this.addBookmark(threadId);
      return true;
    }
  }

  private static saveBookmarks(bookmarks: string[]): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(bookmarks));
      window.dispatchEvent(new Event("bookmarks-updated"));
    }
  }
}
