import { ObjectId } from "mongodb";

import { ArticlesRepository } from "../articles/articles.repository";
import { authenticateUser } from "../auth/auth.service";
import { type CommentsRepository } from "./comments.repository";
import type {
  Comment,
  CommentDocument,
  CommentsPage,
  CreateCommentRequest,
  Cursor,
} from "./comments.types";

export async function createComment(
  commentsRepo: CommentsRepository,
  articlesRepo: ArticlesRepository,
  articleId: string,
  input: CreateCommentRequest,
): Promise<Comment> {
  const user = await authenticateUser();

  const comment: Omit<CommentDocument, "_id"> = {
    articleId: new ObjectId(articleId),
    authorId: new ObjectId(user.id),
    author: { username: user.username, avatar: user.avatar },
    content: input.content,
    createdAt: new Date(),
  };

  const id = await commentsRepo.insert(comment);

  await articlesRepo.incrementComments(articleId);

  return { ...comment, id, articleId: articleId, authorId: user.id };
}

export async function getComments(
  commentsRepo: CommentsRepository,
  authorId: string,
  cursor: Cursor,
): Promise<CommentsPage> {
  const rawPage = await commentsRepo.infiniteByCursor(authorId, cursor);

  const page: CommentsPage = {
    comments: rawPage.commentDocuments.map((doc) => ({
      id: doc._id.toString(),
      articleId: doc.articleId.toString(),
      authorId: doc.authorId.toString(),
      author: {
        username: doc.author.username,
        avatar: doc.author.avatar,
      },
      content: doc.content,
      createdAt: doc.createdAt,
    })),
    total: null,
    nextCursor: rawPage.nextCursor,
  };
  return page;
}
