import { Component, Input } from '@angular/core';
import { YouTubePlayerModule } from '@angular/youtube-player';

@Component({
  selector: 'app-video-player',
  imports: [YouTubePlayerModule],
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.css']
})
export class VideoPlayerComponent {

  @Input() videoId: string | null = null

  onReady(event: YT.PlayerEvent) 
  {
    console.log('Reproductor listo', event)
  }

  onStateChange(event: YT.OnStateChangeEvent) 
  {
    console.log('Estado cambiado', event.data)
  }
}
