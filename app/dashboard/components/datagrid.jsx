'use client'
import { UserButton } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import * as XLSX from 'xlsx';
import '../page.css'
import { ExcelRenderer, OutTable } from 'react-excel-renderer';

const Datagrid = (props) => {
    const [rows, setRows] = useState([])
    const [cols, setCols] = useState([])
    useEffect(() => {
        fetch('./CLIENTS.xlsx').then(res => {
            return res.blob();
        }).then(res => {
            let reader = new FileReader();
            reader.readAsArrayBuffer(res);
            reader.onload = (e) => {
                const workbook = XLSX.read(e.target.result, { type: 'blob' });
                const worksheet = workbook.Sheets[props.username.SheetName];
                const workbookk = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbookk, worksheet, "Sheet 1")
                const excelBuffer = XLSX.write(workbookk, { bookType: 'xlsx', type: 'array' });
                const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
                ExcelRenderer(blob, (err, resp) => {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        console.log(resp)
                        setCols(resp.cols)
                        setRows(resp.rows)
                    }
                });
            }
        });
    }, [])
    return (
        <div>
            <div className="userbutton">
                <UserButton afterSignOutUrl="/" />
            </div>
            <div className="table">
                <OutTable data={rows} columns={cols} tableClassName="ExcelTable2007" tableHeaderRowClass="heading" />
            </div>
        </div>
    )
}

export default Datagrid