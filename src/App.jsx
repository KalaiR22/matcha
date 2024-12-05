
import './App.css'
import Market from './components/Market'
import ConfirmDenied from './components/order confirm denied/ConfirmDenied';
import PlaceOrder from './components/placeorder/PlaceOrder'
import TransactionCompleted from './components/Transaction completed/TransactionCompleted';
import TransactionPending from './components/transaction pending/TransactionPending';





function App() {
  

  return (
    <>
      <div className="w-full h-screen">
      {/* <Market /> */}
      {/* <ConfirmDenied/> */}
        {/* <TransactionCompleted/> */}
        {/* <TransactionPending/> */}
      </div>
      {/* <SelectToken/> */}
      {/* <SearchBar/> */}
      <PlaceOrder/>
    </>
  );
}

export default App
