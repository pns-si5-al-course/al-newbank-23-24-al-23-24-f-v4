import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-icon-card',
  templateUrl: './icon-card.component.html',
  styleUrls: ['./icon-card.component.css']
})
export class IconCardComponent {
  @Input() title!: string;
  @Input() detail!: string;
  @Input() icon!: string;
}
