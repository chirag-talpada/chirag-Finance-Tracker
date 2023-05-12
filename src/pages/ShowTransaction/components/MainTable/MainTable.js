import React, { useState, useEffect, useContext } from "react";

import { useNavigate } from "react-router-dom";
import { PAGE_LIMIT } from "../../../../utils/constant";
import { pagination } from "../../../../utils/pagination";

import PaginationFooter from "../PaginationFooter/PaginationFooter";
import SearchMainTable from "../SerachTable/SerachMainTable";
import { getUserID } from "../../../../services/authentication";
import { appContext } from "../../../../context/AppContext";

function MainTable({ sortColumn, transactionDataCount,transactionData, setTransactionData }) {
  const navigate = useNavigate();
  const [page, setPage] = useState({});
  const [userID, ] = useState(getUserID());
  const {transactions,deleteUserTransaction}=useContext(appContext);

  useEffect(() => {
    if (transactionData.length) {
      let pageData = {};
      pageData.current = 1;
      pageData.total_page = Math.ceil(transactionData.length / PAGE_LIMIT);
      setPage(pageData);
    }
  }, [transactionData]);

  const viewCard = (id) => {
    navigate(`/transaction/${id}`,{state:{toast:false}});
  };

  const editTransaction=(id)=>{
    navigate(`/transaction/edit/${id}`);
  }

  const deleteTransaction=(id)=>{
    // eslint-disable-next-line no-restricted-globals
    if(confirm("Are you sure you want to delete this transaction?")===true){

      deleteUserTransaction(userID,id) 
    }
    
  }

  const transactionHeader = [
    {
      title: "ID",
    },
    { title: "Transaction Date", onClick: () => sortColumn("transactionDate") },
    { title: "Month Year", onClick: () => sortColumn("monthYear") },
    { title: "Transaction Type", onClick: () => sortColumn("transactionType") },
    { title: "From Account", onClick: () => sortColumn("fromAccount") },
    { title: "To Account", onClick: () => sortColumn("toAccount") },
    { title: "Amount", onClick: () => sortColumn("amount") },
    { title: "Receipt" },
    { title: "Notes", onClick: () => sortColumn("notes") },
    { title: "Action" },
  ];

  return (
    <>
      
      {transactionDataCount!==0 && <div className="flex">
        <SearchMainTable setTransactionData={setTransactionData} />
      </div>}

      <table className="transaction-table">
        <thead>
          <tr>
            {transactionHeader.map((header, i) => {
              return (
                <td key={i}>
                  {header?.onClick !== undefined ? (
                    <span className="tab-sort-btn" onClick={header.onClick}>
                      {header.title}
                    </span>
                  ) : (
                    <span className="tab-sort-btn">{header.title}</span>
                  )}
                </td>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {pagination(transactions[userID], page.current).map((raw, i) => {
            let rupees = new Intl.NumberFormat("en-IN", {
              style: "currency",
              currency: "INR",
            }).format(raw.amount);

            return (
              <tr key={i}>
                <td>{raw.id}</td>
                <td>{raw.transactionDate}</td>
                <td>{raw.monthYear}</td>
                <td>{raw.transactionType}</td>
                <td>{raw.fromAccount}</td>
                <td>{raw.toAccount}</td>
                <td>{rupees}</td>
                <td>
                  <div className="table-image">
                    <img
                      src={`data:image/${raw.receipt.extension};base64,${raw.receipt.base24String}`}
                      alt="img"
                      className="receipt-img"
                    />
                  </div>
                </td>
                <td>{raw.notes}</td>
                <td>
                  <div className="tableflex">
                  <button
                    className="viewbtn"
                    onClick={() => {
                      viewCard(raw.id);
                    }}
                  >
                    View
                  </button>
                  <button
                    className="editbtn"
                    onClick={() => {
                      editTransaction(raw.id);
                    }}
                  >
                    edit
                  </button>
                  <button
                    className="deletebtn"
                    onClick={() => {
                      deleteTransaction(raw.id);
                    }}
                  >
                    delete
                  </button>
                  </div>
                </td>
              </tr>
            );
          })}

          {pagination(transactions[userID], page.current).length===0 && <tr><td colSpan={10}>No Data found</td></tr>}
        </tbody>
      </table>
      { transactionData.length!==0 && <PaginationFooter page={page} setPage={setPage} />}
    </>
  );
}

export default MainTable;
