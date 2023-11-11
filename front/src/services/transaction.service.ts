import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  private apiUrl = 'http://localhost:3006/rates';

  constructor(private http: HttpClient) {}

  getExchangeRate(base: string): Observable<any> {
    return this.http.get(`${this.apiUrl}?base=${base}`);
  }
}
