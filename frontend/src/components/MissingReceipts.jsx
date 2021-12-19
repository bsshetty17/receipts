import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const MissingReceipts = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({});

  const getData = async () => {
    const res = await axios.get('/api/receipts/missing');
    setData(res.data);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <table class='table table-bordered'>
        <thead>
          <tr>
            <th scope='col'>Receipt Type</th>
            <th scope='col'>Missing Receipts</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(data).map((key, Index) => {
            return (
              <tr>
                <td>{key}</td>
                <td>
                  <table class='table table-bordered'>
                    <tbody>
                      <tr>
                        {data[key].map((el) => (
                          <td>{el}</td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className='text-center'>
        <button
          className='btn btn-secondary m-1 pb-1'
          onClick={() => {
            navigate(-1);
          }}
        >
          Back
        </button>
      </div>
    </>
  );
};

export default MissingReceipts;
