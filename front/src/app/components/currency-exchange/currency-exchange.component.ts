import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-currency-exchange',
  templateUrl: './currency-exchange.component.html',
  styleUrls: ['./currency-exchange.component.css']
})
export class CurrencyExchangeComponent implements OnInit {
  baseAmount = 1;
  targetAmount: number | null = null;
  baseCurrency = 'EUR';
  targetCurrency = 'USD';
  currencies: string[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchCurrencies();
    this.convert();
  }

  fetchCurrencies() {
    this.http.get('http://data.fixer.io/api/symbols?access_key=7ac90cf1fa0b1fce0a808d0ecf823037').subscribe((response: any) => {
      this.currencies = Object.keys(response.symbols);
    });
  }

  convert() {
    this.http.get(`http://data.fixer.io/api/latest?access_key=7ac90cf1fa0b1fce0a808d0ecf823037&base=${this.baseCurrency}&symbols=${this.targetCurrency}`)
      .subscribe((response: any) => {
        const rate = response.rates[this.targetCurrency];
        this.targetAmount = this.baseAmount * rate;
      });
  }

  reverseConvert() {
    this.http.get(`http://data.fixer.io/api/latest?access_key=7ac90cf1fa0b1fce0a808d0ecf823037&base=${this.targetCurrency}&symbols=${this.baseCurrency}`)
      .subscribe((response: any) => {
        const rate = response.rates[this.baseCurrency];
        this.baseAmount = (this.targetAmount ?? 0) / rate;
      });
  }
}
