import { Component } from '@angular/core';
import { MediaDevicesService } from '../../../../core/services/media-devices.service';

@Component({
  selector: 'vc-stream-list',
  templateUrl: './stream-list.component.html',
  styleUrls: ['./stream-list.component.scss']
})
export class StreamListComponent {
  constructor(private readonly md: MediaDevicesService) {}

  onAddCurrentClick(): void {
    this.md.addLocalAvailable();
  }
}
