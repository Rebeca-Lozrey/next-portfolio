export interface Article {
  authorId: string;
  authorUsername: string;
  content: string;
  imageUrl: string | null;
  likeCount: number;
  createdAt: Date;
}

export interface CreateArticleRequest {
  content: string;
  imageUrl?: string | null;
}
