import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AddEditForm from '../components/AddEditForm';

const Add = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [data, setData] = useState({
    number: '',
    name: '',
    type: { value: 'Donation', label: 'Donation', name: 'type' },
    mobile: '',
    amt: '',
    remarks: '',
    pendingAmt: '',
    assuredAmt: '',
    collection_point: {
      value: 'Counter',
      label: 'Counter',
      name: 'collection_point',
    },
  });

  const handleSubmit = async (data) => {
    await axios
      .post('/api/receipts/add', data)
      .then((res) => {
        if (res.status === 200) {
          navigate('/');
        }
      })
      .catch((error) => {
        setError(error.response.data);
      });
  };
  return (
    <AddEditForm
      submit={handleSubmit}
      data={data}
      navigate={navigate}
      formType='Add'
      error={error}
      setError={setError}
    />
  );
};

export default Add;
