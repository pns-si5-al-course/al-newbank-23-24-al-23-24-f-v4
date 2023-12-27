import './App.css'
import TransactionForm from './TransactionForm.jsx'

// $('a').on('click', function(){
//   $('.wrap, a').toggleClass('active');
  
//   return false;
// });

function toggleClass() {
  const wrap = document.querySelector('.wrap')
  const button = document.querySelector('.button')
  wrap?.classList.toggle('active')
  button?.classList.toggle('active')
}

function App() {
  return (
    <>
      <div className='wrap'>
        <div className='content'>
          <h2>Make a transaction</h2>
          <TransactionForm />
        </div>
      </div>
      <a className='button glyphicon glyphicon-plus' href='#' onClick={toggleClass}>LOGIN</a>       
    </>
  )
}

export default App
