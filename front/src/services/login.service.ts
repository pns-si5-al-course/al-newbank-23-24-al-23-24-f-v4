import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  public url = "http://localhost:3000/users"

  constructor(    
    private http: HttpClient,
    private router: Router
    ) { }

  logIn(name: string, code: string){
    this.http.get(`${this.url}/connexion?name=${name}&code=${code}`).subscribe((res: any) => {
      if(res){
        console.log("logged in successfully, re-routing");
        this.router.navigate([`/dashboard`]);
      }
    });
  }
}
