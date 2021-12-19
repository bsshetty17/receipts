import React, { Suspense } from 'react';
import { useEffect, useState, useMemo } from 'react';
import {
  useTable,
  useSortBy,
  usePagination,
  useGlobalFilter,
  useAsyncDebounce,
} from 'react-table';
import './Home.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import {
  FaRegEdit,
  FaTrashAlt,
  FaArrowCircleLeft,
  FaArrowCircleRight,
  FaRegWindowClose,
} from 'react-icons/fa';
import { matchSorter } from 'match-sorter';
// import CircleLoader from 'react-spinners/CircleLoader';
require('dotenv').config();

const Styles = styled.div`
  padding: 1rem;

  table {
    border-spacing: 0;
    border: 1px solid black;

    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }

    th,
    td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;

      :last-child {
        border-right: 0;
      }
    }
  }
`;

function GlobalFilter({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}) {
  const count = preGlobalFilteredRows.length;
  const [value, setValue] = React.useState(globalFilter);
  const onChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined);
  }, 200);

  return (
    <span>
      Search:{' '}
      <input
        value={value || ''}
        id='global-filter'
        onChange={(e) => {
          setValue(e.target.value);
          onChange(e.target.value);
        }}
        placeholder={`Filter from ${count} records...`}
        style={{
          fontSize: '1.1rem',
          border: '0',
        }}
      />
      &nbsp;
      <span
        className='m-1 pb-1'
        title='Clear filter'
        onClick={() => {
          setValue('');
          setGlobalFilter(undefined);
        }}
      >
        <FaRegWindowClose />
      </span>
    </span>
  );
}

function fuzzyTextFilterFn(rows, id, filterValue) {
  return matchSorter(rows, filterValue, { keys: [(row) => row.values[id]] });
}

// Let the table remove the filter if the string is empty
fuzzyTextFilterFn.autoRemove = (val) => !val;

const Table = ({ columns, data }) => {
  const filterTypes = React.useMemo(
    () => ({
      // Add a new fuzzyTextFilterFn filter type.
      fuzzyText: fuzzyTextFilterFn,
      // Or, override the default text filter to use
      // "startWith"
      text: (rows, id, filterValue) => {
        return rows.filter((row) => {
          const rowValue = row.values[id];
          return rowValue !== undefined
            ? String(rowValue)
                .toLowerCase()
                .startsWith(String(filterValue).toLowerCase())
            : true;
        });
      },
    }),
    []
  );

  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state,
    visibleColumns,
    preGlobalFilteredRows,
    setGlobalFilter,
  } = useTable(
    {
      columns,
      data,
      filterTypes,
    },
    useGlobalFilter,
    useSortBy
  );

  // Render the UI for your table
  return (
    <Styles>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render('Header')}
                  <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? ' 🔽'
                        : ' 🔼'
                      : ''}
                  </span>
                </th>
              ))}
            </tr>
          ))}
          <tr>
            <th
              colSpan={visibleColumns.length}
              style={{
                textAlign: 'left',
              }}
            >
              <GlobalFilter
                preGlobalFilteredRows={preGlobalFilteredRows}
                globalFilter={state.globalFilter}
                setGlobalFilter={setGlobalFilter}
              />
            </th>
          </tr>
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row, i) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </Styles>
  );
};

const Home = () => {
  const navigate = useNavigate();
  const [state, setState] = useState([]);

  const getData = async () => {
    const res = await axios.get('/api/receipts');
    setState(res.data);
  };

  useEffect(() => {
    getData();
  }, []);

  const columns = useMemo(
    () => [
      {
        Header: 'Receipt Number',
        accessor: 'receiptNumber',
        sortType: 'basic',
      },
      {
        Header: 'Name',
        accessor: 'Name',
      },
      {
        Header: 'Type',
        accessor: 'receiptType',
      },
      {
        Header: 'Mobile',
        accessor: 'Mobile',
      },
      {
        Header: 'Amt',
        accessor: 'Amount',
        sortType: 'basic',
      },
      {
        Header: 'Collection Point',
        accessor: 'collectionPoint',
      },
      {
        Header: 'Remarks',
        accessor: 'Remarks',
      },
      {
        Header: ' ',
        Cell: (tr) => (
          <div>
            <span
              className='m-1 pb-1'
              title='Edit'
              onClick={() => handleEdit(tr.row.original)}
            >
              <FaRegEdit color='#291c91' />
            </span>

            <span
              className='m-1 pb-1'
              title='Delete'
              onClick={() => handleDelete(tr.row.original)}
            >
              <FaTrashAlt color='#CC0000' />
            </span>
          </div>
        ),
      },
    ],
    []
  );

  const handleDelete = async (row) => {
    await axios
      .delete('/api/receipts/delete', { data: { _id: row._id } })
      .then((res) => {
        if (res.status === 200) {
          getData();
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleEdit = async (row) => {
    navigate('/edit/' + row._id);
  };

  return (
    // <Suspense fallback={<CircleLoader loading={true} />}>
    <Table columns={columns} data={state} />
    // </Suspense>
  );
};

export default Home;
