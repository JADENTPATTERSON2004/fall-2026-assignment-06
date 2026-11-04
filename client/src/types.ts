export interface Article {
  articleId: number;
  title: string;
  contents: string;
}

export interface Comment {
  commentId: number;
  articleId: number;
  body: string;
}

export interface CreateArticleDTO {
  title: string;
  contents: string;
}

export interface UpdateArticleDTO {
  title?: string;
  contents?: string;
}

export interface CreateCommentDTO {
  body: string;
}

export interface UpdateCommentDTO {
  body: string;
}
