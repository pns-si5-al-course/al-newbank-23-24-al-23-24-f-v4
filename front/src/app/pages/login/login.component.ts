import { Component, Input } from '@angular/core';
import { LoginService } from 'src/services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  clientName: string = '';
  accessCode: string = '';
constructor (private loginService: LoginService){}

loggingIn(){
  this.loginService.logIn(this.clientName,this.accessCode);
}
}
