import React, { useState, ChangeEvent } from 'react';
import './TransactionForm.css';
import uuid from 'react-uuid';
import axios from 'axios';

interface FormData {
    id: string;
    idUser: string;
    amount: string;
    source_currency: string;
    target_currency: string;
    idDebited: string;
    idCredited: string;
}

interface Account {
    id: string;
    userId: string;
    sold: string;
    currency: string;
    payments: Payment[];
}

interface Payment {
    id: string;
    amount: number;
    date: Date;

}

function TransactionForm() {

    const [formData, setFormData] = useState<FormData>({
        id: uuid(),
        idUser: '',
        amount: '',
        source_currency: '',
        target_currency: '',
        idDebited: '',
        idCredited: ''
    });

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const [accounts, setAccounts] = useState([{
        id: '',
        userId: '',
        sold: '',
        currency: '',
        payments: []
    }]);


    const sendTransactionRequest = async() => {
        
        const serverUrl = 'http://localhost:100/transaction_manager/payment';
        console.log(formData);        
        axios.post(serverUrl, formData, {
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(response => {
            console.log('Success:', response.status);
        
            const inputs = document.querySelectorAll('input');
            inputs.forEach(input => {
                input.value = '';
            });

            setFormData({
                id: uuid(),
                idUser: '',
                amount: '',
                source_currency: '',
                target_currency: '',
                idDebited: '',
                idCredited: ''
            }); // clear form
        })
        .catch(error => {
            console.error('Error:', error);
        });


        axios.get("http://localhost:3000/accounts/user/"+formData.idUser)
        .then(response => {
            //console.log('Success:', response.data);
            // insert receive data into form-right
            setAccounts(response.data);
        })
        .catch(error => {
            console.error('Error:', error);
        });

        // clear input 
        

    };


    return (
        <>
        <div>
            <form> 
            <div className='form'>
                <div className='left'>
                    <div className='inputs'>
                        <div className='form-left'>
                            <input type="text" name="id" value={formData.id} readOnly />
                            <input type="number" name="idUser" placeholder="User ID" required onChange={handleInputChange} />
                            <input type="number" name="amount" placeholder="Amount" required onChange={handleInputChange} />
                        </div>
                        <div className='form-center'>
                            <input type='text' name="source_currency" placeholder='Source Currency' required onChange={handleInputChange} />
                            <input type='text' name="target_currency" placeholder='Target Currency' required onChange={handleInputChange} />
                            <input type="text" name="idCredited" placeholder="ID credited" required onChange={handleInputChange} />
                        </div>
                    </div>
                    <button className='send-button' type="submit" onClick={sendTransactionRequest}>Envoyer</button>
                </div>
                <div className='form-right'>
                    {
                        accounts.map((account: Account) => {
                            if(account.payments.length !== 0){
                                return (
                                    <div key={account.id} className='account' onClick={
                                        () => {
                                            console.log('clicked');
                                            const sold = document.querySelector('.sold');
                                            const payments = document.querySelectorAll('.payment');
                                            sold?.classList.toggle('active');
                                            payments?.forEach((payment)=>{
                                                payment.classList.toggle('active');
                                            });
                                        }
                                    }>
                                        <p style={
                                            {
                                                position: 'relative',
                                                top: '-10%',
                                            }
                                        }>{account.currency}</p>
                                        <p className='sold'> {"Sold : " + account.sold + " " }</p>
                                        <span className='payment-ctn'>{
                                            account.payments.slice(-5).map((payment: Payment) => {
                                                return (
                                                    <span key={uuid()} className='payment'>
                                                        {"Amount :" +payment.amount.toString() + " " + account.currency}
                                                        <br/>
                                                        <span className='date'>{payment.date.toString()}</span>
                                                    </span>
                                                )
                                            })
                                        }</span>
                                    </div>
                                )
                            }
                        })
                    }
                </div>
            </div>
        </form>
        </div>
        </>    
    );
}

export default TransactionForm;
