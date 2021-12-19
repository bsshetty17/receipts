import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { ReceiptTypes, CollectionPoints } from '../constants/AppConstants';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddEditForm = (props) => {
  const { submit, data, navigate, formType, error, setError } = props;
  const [formData, setFormData] = useState(data);
  const [options, setOptions] = useState({ type: [], point: [] });
  const [formState, setFormState] = useState({ readOnlyAmt: false });

  const setState = () => {
    // console.log('setstate called');
    // const type = formData.type.value;
    // if (ReceiptTypes[type]) {
    //   console.log('inside if');
    //    setFormData({ ...formData, amt: ReceiptTypes[type] });
    //   setFormState({ ...formState, readOnlyAmt: true });
    // } else {
    //   setFormState({ ...formState, readOnlyAmt: false });
    // }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setState();
  };

  const handleSelectChange = (e) => {
    setFormData({ ...formData, [e.name]: e });
    setState();
  };

  const getPostData = () => {
    const newData = {};
    newData['receiptNumber'] = formData.number || '';
    newData['Name'] = formData.name || '';
    newData['receiptType'] = formData.type.value || '';
    newData['Mobile'] = formData.mobile || '';
    newData['Amount'] = formData.amt || '';
    newData['collectionPoint'] = formData.collection_point.value || '';
    newData['Remarks'] = formData.remarks || '';

    return newData;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const saveData = getPostData();
    submit(saveData);
  };

  const getOptions = (type) => {
    const optionData = [];
    if (type === 'receiptType') {
      for (const [key, values] of Object.entries(ReceiptTypes)) {
        optionData.push({ value: key, label: key, name: 'type' });
      }
    } else if (type === 'collectionPoint') {
      for (let i = 0; i < CollectionPoints.length; i++) {
        optionData.push({
          value: CollectionPoints[i],
          label: CollectionPoints[i],
          name: 'collection_point',
        });
      }
    }
    return optionData;
  };

  useEffect(() => {
    setFormData(data);
    setState();
    setOptions({
      ...options,
      type: getOptions('receiptType'),
      point: getOptions('collectionPoint'),
    });
  }, []);

  useEffect(() => {
    setFormData(data);
    setState();
  }, [data]);

  useEffect(() => {
    if (error && error !== undefined) {
      showError(error);
    }
    setError('');
  }, [error]);

  const showError = (msg) => toast.error(msg);

  return (
    <>
      <div>
        <ToastContainer
          position='bottom-left'
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
      <form style={{ maxWidth: 500, margin: 'auto' }} onSubmit={handleSubmit}>
        <h1 className='text-muted text-center'>{formType}</h1>
        <div className='mb-3'>
          <label htmlFor='number' className='form-label'>
            Reciept number
          </label>
          <input
            type='text'
            className='form-control'
            name='number'
            value={formData.number}
            onChange={handleChange}
          />
        </div>
        <div className='mb-3'>
          <label htmlFor='name' className='form-label'>
            Name
          </label>
          <input
            type='text'
            className='form-control'
            name='name'
            value={formData.name}
            onChange={handleChange}
          />
        </div>
        <div className='mb-3'>
          <label htmlFor='type' className='form-label'>
            Type
          </label>
          <Select
            className='basic-single'
            classNamePrefix='select'
            // isClearable={true}
            isSearchable={true}
            options={options['type']}
            value={formData.type}
            name='type'
            onChange={handleSelectChange}
          />
        </div>
        <div className='mb-3'>
          <label htmlFor='collection_point' className='form-label'>
            Collection point
          </label>
          <Select
            className='basic-single'
            classNamePrefix='select'
            // isClearable={true}
            isSearchable={true}
            options={options['point']}
            name='collection_point'
            value={formData.collection_point}
            onChange={handleSelectChange}
          />
        </div>
        <div className='mb-3'>
          <label htmlFor='mobile' className='form-label'>
            Mobile
          </label>
          <input
            type='text'
            className='form-control'
            name='mobile'
            value={formData.mobile}
            onChange={handleChange}
          />
        </div>
        <div className='mb-3'>
          <label htmlFor='amt' className='form-label'>
            Amt
          </label>
          <input
            type='text'
            className='form-control'
            name='amt'
            value={formData.amt}
            readOnly={formState.readOnlyAmt}
            onChange={handleChange}
          />
        </div>
        <div className='mb-3'>
          <label htmlFor='remarks' className='form-label'>
            Remarks
          </label>
          <textarea
            className='form-control'
            name='remarks'
            value={formData.remarks}
            onChange={handleChange}
          />
        </div>
        <div className='text-center'>
          <button className='btn btn-primary m-1 pb-1'>Save</button>

          <button
            className='btn btn-secondary m-1 pb-1'
            onClick={() => {
              navigate(-1);
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </>
  );
};

export default AddEditForm;
