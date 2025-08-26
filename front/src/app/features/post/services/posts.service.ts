import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Post } from 'src/app/interfaces/post.interface';
// import { environment } from 'src/environments/environment';
// import { PostsResponse } from 'src/app/features/post/interfaces/api/postsResponse.interface';
import { PostResponse } from 'src/app/features/post/interfaces/api/postResponse.interface';
// import { CommentRequest } from 'src/app/features/post/interfaces/api/commentRequest.interface';
import { CommentsResponse } from 'src/app/features/post/interfaces/api/commentsResponse.interface';
import { SubscribedPostResponse } from 'src/app/interfaces/subscribed-post-response.interface';
import { CommentCreate } from '../interfaces/api/commentCreate.interface';
import { PostCreate } from '../interfaces/api/post-create.interface';

@Injectable({
  providedIn: 'root'
})
export class PostService {
	private pathService = 'api/posts';

  constructor(private http: HttpClient) { }

  // // Récupérer tous les posts
  // getPosts(): Observable<Post[]> {
  //   return this.http.get<Post[]>(this.pathService);
  // }

  // Nouvelle méthode pour récupérer les posts abonnés d'un utilisateur
  getSubscribedPosts(userId: number): Observable<SubscribedPostResponse[]> {
    return this.http.get<SubscribedPostResponse[]>(`${this.pathService}/subscription/${userId}`);
  }
  

  // // Récupérer un post par son ID
  // getPostById(id: number): Observable<PostResponse> {
  //   return this.http.get<PostResponse>(`${this.pathService}/${id}`);
  // }
    // Récupérer un post par son ID
    getPostById(id: number): Observable<any> {
      return this.http.get<any>(`${this.pathService}/${id}`);
    }

  // Créer un nouveau post
  createPost(post: PostCreate): Observable<PostResponse> {
    return this.http.post<PostResponse>(this.pathService, post);
  }

  // Récupérer les commentaires par postId
  getCommentsByPostId(postId: number): Observable<CommentsResponse[]> {
    return this.http.get<CommentsResponse[]>(`${this.pathService}/comments/${postId}`);
  }

  createComment(comment: CommentCreate): Observable<CommentsResponse> {
    return this.http.post<CommentsResponse>(`${this.pathService}/comments`, comment);
  }
}