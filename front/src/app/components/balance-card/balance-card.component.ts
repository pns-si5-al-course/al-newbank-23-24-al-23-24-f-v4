import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-balance-card',
  templateUrl: './balance-card.component.html',
  styleUrls: ['./balance-card.component.css']
})
export class BalanceCardComponent {
  @Input() title: string = '';
}