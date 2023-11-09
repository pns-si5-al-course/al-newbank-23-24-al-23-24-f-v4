import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TransactionService } from 'src/services/transaction.service';

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
  lastUpdated: 'base' | 'target' = 'base'; 
  rates: { [key: string]: number } = {}; 


  constructor(private http: HttpClient, private transactionService: TransactionService) {}

  ngOnInit(): void {
    this.fetchCurrencies(this.baseCurrency);
  }


  fetchCurrencies(base: string) {
    this.transactionService.getExchangeRate(base).subscribe(
      data => {
        this.currencies = Object.keys(data.rates);
        this.rates = data.rates;
        this.rates[base] = 1;
        
        if (this.lastUpdated === 'base') {
          this.convert();
        } else {
          this.reverseConvert();
        }
      },
      error => {
        console.error('Error fetching currencies', error);
      }
    );
  }
  
  
  
  
  convert() {
    if (this.baseCurrency === this.targetCurrency) {
      this.targetAmount = this.baseAmount;
      return;
    }
  
    const baseRate = this.rates[this.baseCurrency] || 1; 
    const targetRate = this.rates[this.targetCurrency];
    const rate = targetRate / baseRate;
    this.targetAmount = this.baseAmount * rate;
  }
  
  reverseConvert() {
    if (this.targetCurrency === this.baseCurrency) {
      this.baseAmount = this.targetAmount ?? 0;
      return;
    }
  
    const rate = this.rates[this.targetCurrency];
    if (rate === undefined) {
      console.error('Error: Rate for target currency not found.');
      return;
    }
  
    this.baseAmount = (this.targetAmount ?? 0) / rate;
  }
  
  
  
  
  onCurrencyChange() {
    console.log("base ",this.baseAmount," target ", this.targetCurrency)
    if (this.lastUpdated === 'base') {
      this.fetchCurrencies(this.baseCurrency);
    } else {
      this.reverseConvert();
    }
  }
}