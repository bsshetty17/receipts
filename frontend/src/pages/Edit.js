import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import AddEditForm from '../components/AddEditForm';

const Edit = () => {
  const navigate = useNavigate();
  const { rowId } = useParams();
  const [data, setData] = useState({});
  const [error, setError] = useState('');

  const getData = async () => {
    await axios
      .get('/api/receipts/' + rowId)
      .then((res) => {
        if (res.status === 200) {
          setData(res.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const setEditData = (data) => {
    const editData = {};
    const type = {
      value: data.receiptType || 'Donation',
      label: data.receiptType || 'Donation',
      name: 'type',
    };
    const collection_point = {
      value: data.collectionPoint || 'Counter',
      label: data.collectionPoint || 'Counter',
      name: 'collection_point',
    };
    editData['number'] = data.receiptNumber || '';
    editData['name'] = data.Name || '';
    editData['type'] = type;
    editData['mobile'] = data.Mobile || '';
    editData['amt'] = data.Amount || '';
    editData['pendingAmt'] = data.PendingAmount || '';
    editData['assuredAmt'] = data.AssuredAmount || '';
    editData['collection_point'] = collection_point;
    editData['remarks'] = data.Remarks || '';
    return editData;
  };

  useEffect(() => {
    getData();
  }, []);

  const getModifiedRows = (rows) => {
    const modified = {};
    for (const [key, values] of Object.entries(rows)) {
      if (values !== data[key]) {
        modified[key] = values;
      }
    }
    return modified;
  };

  const handleSubmit = async (updateData) => {
    updateData = getModifiedRows(updateData);
    updateData['_id'] = rowId; // for update
    await axios
      .put('/api/receipts/update', updateData)
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
      data={setEditData(data)}
      navigate={navigate}
      formType='Edit'
      error={error}
      setError={setError}
    />
  );
};

export default Edit;
