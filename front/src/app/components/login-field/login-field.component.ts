import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-login-field',
  templateUrl: './login-field.component.html',
  styleUrls: ['./login-field.component.css']
})
export class LoginFieldComponent implements OnInit {
  @Input() fieldType: string = 'text';

  constructor() { }

  ngOnInit(): void {
  }

}
