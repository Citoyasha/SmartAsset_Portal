'use client';
import { UserButton } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import * as XLSX from 'xlsx';
import '../page.css';
import { ExcelRenderer, OutTable } from 'react-excel-renderer';

const Datagrid = () => {
    const [rows, setRows] = useState([]);
    const [cols, setCols] = useState([]);

    useEffect(() => {
        const fetchExcelFile = async () => {
            try {
                // Fetch the file URL from the environment variable
                const fileUrl = process.env.xslxURL;
                if (!fileUrl) {
                    throw new Error("Excel file URL is not defined in environment variables");
                }

                // Fetch the file as a blob
                const response = await fetch(fileUrl);
                if (!response.ok) {
                    throw new Error(`Failed to fetch Excel file: ${response.statusText}`);
                }

                const blob = await response.blob();

                // Read and process the Excel file
                let reader = new FileReader();
                reader.readAsArrayBuffer(blob);
                reader.onload = (e) => {
                    const workbook = XLSX.read(e.target.result, { type: 'array' });
                    const worksheet = workbook.Sheets[workbook.SheetNames[0]]; // Adjust sheet name if needed
                    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
                    const columns = data[0].map((col, idx) => ({ name: col, key: idx }));
                    const rows = data.slice(1);

                    setCols(columns);
                    setRows(rows);
                };
            } catch (error) {
                console.error("Error fetching or processing Excel file:", error);
            }
        };

        fetchExcelFile();
    }, []);

    return (
        <div>
            <div className="userbutton">
                <UserButton afterSignOutUrl="/" />
            </div>
            <div className="table">
                {rows.length > 0 && cols.length > 0 ? (
                    <OutTable
                        data={rows}
                        columns={cols}
                        tableClassName="ExcelTable2007"
                        tableHeaderRowClass="heading"
                    />
                ) : (
                    <p>Loading table data...</p>
                )}
            </div>
        </div>
    );
};

export default Datagrid;
