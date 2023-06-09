import { getUserID } from "../../services/authentication";
import {
    DateColumnsName,
    charactesColumnsName,
    numberColumnsName
  } from "../constant/index";

export const sortingData=function(column,toggleSort,getIntialData,transactionData,setToggleSort,setTableData,type){
    let sorted,tableData;

   
    if(type==="group"){
      tableData=[...transactionData];
    }else{
      tableData={...transactionData};
      tableData=tableData[getUserID()]
    }

    if (DateColumnsName.includes(column)) {
      if (toggleSort[column] === 1) {
        sorted = [...tableData].sort((a, b) => {
          return new Date(a[column]) - new Date(b[column]);
        });
      }
      if (toggleSort[column] === 2) {
        sorted = [...tableData].sort((a, b) => {
          return new Date(b[column]) - new Date(a[column]);
        });
      }
      if (toggleSort[column] === 3) {
        sorted = [...getIntialData()];
      }
    }

    if (charactesColumnsName.includes(column)) {
      if (toggleSort[column] === 1) {
        sorted = [...tableData].sort((a, b) => {
          return a[column].localeCompare(b[column]);
        });
      }
      if (toggleSort[column] === 2) {
        sorted = [...tableData].sort((a, b) => {
          return b[column].localeCompare(a[column]);
        });
      }
      if (toggleSort[column] === 3) {
        sorted = [...getIntialData()];
      }
    }

    if (numberColumnsName.includes(column)) {
      if (toggleSort[column] === 1) {
        sorted = [...tableData].sort((a, b) => {
          return a[column] - b[column];
        });
      }
      if (toggleSort[column] === 2) {
        sorted = [...tableData].sort((a, b) => {
          return b[column] - a[column];
        });
      }
      if (toggleSort[column] === 3) {
        sorted = [...getIntialData()];
      }
    }

    if(type==="group"){
      setTableData(sorted);
    }else{
      setTableData((prev)=>{
        return {...prev,[getUserID()]:sorted}
      });
    }

    

    setToggleSort((prev) => {
      let num = prev[column] === 3 ? 1 : prev[column] + 1;
      return { ...prev, [column]: num };
    });
}

