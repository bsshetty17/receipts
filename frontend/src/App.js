import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import MissingReceipts from './components/MissingReceipts';
import Home from './pages/Home';
import Add from './pages/Add';
import Edit from './pages/Edit';
import ReceiptTotals from './components/ReceiptTotals';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div className='container'>
        <Routes>
          <Route exact path='/add' element={<Add />} />
          <Route exact path='/edit/:rowId' element={<Edit />} />
          <Route exact path='/missing' element={<MissingReceipts />} />
          <Route exact path='/totals' element={<ReceiptTotals />} />
          <Route path='/' element={<Home />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
