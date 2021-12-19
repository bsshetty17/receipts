import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className='navbar navbar-expand-lg navbar-dark bg-dark mb-5'>
      <div className='container'>
        <Link className='navbar-brand' to='/'>
          Home
        </Link>
        <div>
          <Link className='btn btn-primary btn-smp m-1 pb-1' to='/add'>
            Add
          </Link>
          <Link className='btn btn-primary btn-smp m-1 pb-1' to='/missing'>
            Missing Receipts
          </Link>
          <Link className='btn btn-primary btn-smp m-1 pb-1' to='/totals'>
            Totals
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
