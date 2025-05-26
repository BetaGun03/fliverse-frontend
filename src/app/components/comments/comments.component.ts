import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Comment } from '../../interfaces/comment';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { TextFieldModule } from '@angular/cdk/text-field';
import { MatInputModule } from '@angular/material/input';
import { CommentService } from '../../services/comment/comment.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-comments',
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatIconModule, MatCardModule, TextFieldModule, MatInputModule],
  templateUrl: './comments.component.html',
  styleUrl: './comments.component.css'
})
export class CommentsComponent {

  id!: string
  comments: Comment[] = []
  newComment: string = ''

  constructor(private commentService: CommentService, private route: ActivatedRoute)
  {
    this.id = this.route.snapshot.paramMap.get('id') as string || ''
    this.commentService.getCommentsByContentId(Number(this.id))
      .then(comments => {
        this.comments = comments
      })
      .catch(err => {
        console.error('Error fetching average rating:', err)
        this.comments = []
      })
  }

  addComment() 
  {
    if (this.newComment.trim()) 
    {
      let comment: Comment
      const token = localStorage.getItem("token")!

      this.commentService
        .addNewComment(this.newComment, Number(this.id), token)
        .then((comment: Comment) => {
          this.comments.unshift(comment)
          this.newComment = ''
        })
        .catch((error: any) => {
          console.error('Error adding the comment', error)
        })
    }
  }
}
