'use client'
import { UserButton } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import * as XLSX from 'xlsx';
import '../page.css'
import { ExcelRenderer, OutTable } from 'react-excel-renderer';

const Datagrid = (props) => {
    const [rows, setRows] = useState([]);
    const [cols, setCols] = useState([]);

    useEffect(() => {
        const fetchExcelFile = async () => {
            try {
                // Fetch the Excel file via your serverless function
                const response = await fetch('/portail-smart-asset-blob/CLIENTS.xlsx');
                if (!response.ok) { 
                    throw new Error('Failed to fetch Excel file');
                }

                // Read the file as a Blob
                const blob = await response.blob();
                const reader = new FileReader();
                reader.readAsArrayBuffer(blob);

                reader.onload = (e) => {
                    const workbook = XLSX.read(e.target.result, { type: 'array' });
                    const worksheet = workbook.Sheets[props.username.SheetName];
                    
                    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
                    const processedBlob = new Blob([excelBuffer], { type: 'application/octet-stream' });

                    ExcelRenderer(processedBlob, (err, resp) => {
                        if (err) {
                            console.error(err);
                        } else {
                            setCols(resp.cols);
                            setRows(resp.rows);
                        }
                    });
                };
            } catch (error) {
                console.error("Error fetching or processing the Excel file:", error);
            }
        };

        fetchExcelFile();
    }, [props.username.SheetName]);

    return (
        <div>
            <div className="userbutton">
                <UserButton afterSignOutUrl="/" />
            </div>
            <div className="table">
                <OutTable
                    data={rows}
                    columns={cols}
                    tableClassName="ExcelTable2007"
                    tableHeaderRowClass="heading"
                />
            </div>
        </div>
    );
};

export default Datagrid;
