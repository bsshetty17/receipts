import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ReceiptTypes, CollectionPoints } from '../constants/AppConstants';

const ReceiptTotals = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({});
  const [totals, setTotals] = useState({});

  const getData = async () => {
    const res = await axios.get('/api/receipts/totals');
    setData(res.data);
  };

  const calculateData = () => {
    const totalsByType = {};
    let total = 0;
    for (const [key, values] of Object.entries(ReceiptTypes)) {
      for (let i = 0; i < CollectionPoints.length; i++) {
        const point = CollectionPoints[i];
        const type = key;
        if (data[type] && data[type][point] !== undefined) {
          totalsByType[type]
            ? (totalsByType[type] += data[type][point])
            : (totalsByType[type] = data[type][point]);
          totalsByType[point]
            ? (totalsByType[point] += data[type][point])
            : (totalsByType[point] = data[type][point]);
          total += data[type][point];
        }
      }
    }
    totalsByType['total'] = total;
    setTotals(totalsByType);
  };

  useEffect(() => {
    console.log('getdata called');
    getData();
    // calculateData();
  }, []);

  useEffect(() => {
    console.log('calculate called');
    calculateData();
  }, [data]);

  return (
    <>
      <table class='table table-bordered'>
        <tbody>
          <tr>
            <td></td>
            {CollectionPoints.map((val, idx) => {
              return <th>{val}</th>;
            })}
            <th>Total</th>
          </tr>
          {Object.keys(data).map((key, Index) => {
            return (
              <tr>
                <th>{key}</th>
                {CollectionPoints.map((val, idx) => {
                  return <td>{data[key][val] || 0}</td>;
                })}
                <td>{totals[key] || 0}</td>
              </tr>
            );
          })}
          <tr>
            <th>Total</th>
            {CollectionPoints.map((val, idx) => {
              return <td>{totals[val] || 0}</td>;
            })}
            <td>{totals['total'] || 0}</td>
          </tr>
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

export default ReceiptTotals;
