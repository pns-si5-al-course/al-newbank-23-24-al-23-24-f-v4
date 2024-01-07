import React, { useState, ChangeEvent } from 'react';
import './TransactionForm.css';
import uuid from 'react-uuid';

interface FormData {
    id: string;
    idUser: string;
    amount: string;
    src_currency: string;
    target_currency: string;
    idDebited: string;
    idCredited: string;
}

function TransactionForm() {
    const [formData, setFormData] = useState<FormData>({
        id: uuid(),
        idUser: '',
        amount: '',
        src_currency: '',
        target_currency: '',
        idDebited: '',
        idCredited: ''
    });

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const sendTransactionRequest = () => {
        const serverUrl = 'http://nginx:80/transaction_manager/payment';

        fetch(serverUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'accept: */*'
            },
            body: JSON.stringify(formData),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    };

    return (
        <>
            <form className='form'> 
                <div className='form-left'>
                    <input type="text" name="id" value={formData.id} readOnly />
                    <input type="number" name="idUser" placeholder="User ID" required onChange={handleInputChange} />
                    <input type="number" name="amount" placeholder="Amount" required onChange={handleInputChange} />
                </div>
                <div className='form-right'>
                    <input type='text' name="src_currency" placeholder='Source Currency' required onChange={handleInputChange} />
                    <input type='text' name="target_currency" placeholder='Target Currency' required onChange={handleInputChange} />
                    <input type="text" name="idCredited" placeholder="ID credited" required onChange={handleInputChange} />
                </div>
            </form>
            <button type="submit" onClick={sendTransactionRequest}>Envoyer</button>
        </>    
    );
}

export default TransactionForm;
