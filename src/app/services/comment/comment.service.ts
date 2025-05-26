import { Injectable } from '@angular/core';
import { Comment } from '../../interfaces/comment';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor() { }

  async addNewComment(text: string, content_id: Number, token: string): Promise<Comment>
  {
    const url = 'https://api.fliverse.es/comments'

    try {
      const response = await axios.post(
        url,
        {
          text
        },
        {
          params: {
            contentId: content_id
          },
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      )

      // Asumimos que response.data es un objeto Comment
      const comment: Comment = {
        id:           response.data.id,
        content_id:   response.data.content_id,
        text:         response.data.text,
        comment_date: response.data.comment_date
      }

      return comment
    } catch (e: any) {
      console.error('Error creando el comentario:', e)
      throw e
    }
  }

  async getCommentsByContentId(id: Number): Promise<Comment[]>
  {
    const url = `https://api.fliverse.es/comments/content/${id}`

    try{
      const response = await axios.get(url)
      let commentsArray: any[] = []

      if(response.status === 200)
      {
        if(Array.isArray(response.data))
        {
          commentsArray = response.data
        }
      }

      const comments: Comment[] = commentsArray.map((comment: any) => ({
        id: comment.id,
        user_id: comment.user_id,
        content_id: comment.content_id,
        text: comment.text,
        comment_date: comment.comment_date,
      }))

      return comments
    }
    catch(e){
      console.error("Error fetching comments:" + e)
      return []
    }
  }

}
