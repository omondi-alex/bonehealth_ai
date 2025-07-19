"use client";
import React, { useState } from "react";

export default function UploadPage() {
  const [tableData, setTableData] = useState<string[][]>([]);
  const [headers, setHeaders] = useState<string[]>([]);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split("\n").filter(Boolean);
      const csvRows = lines.map((line) => line.split(","));
      setHeaders(csvRows[0]);
      setTableData(csvRows.slice(1));
    };
    reader.readAsText(file);
  }

  return (
    <div className="min-h-[80vh] w-full flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4">
      <div className="max-w-4xl w-full bg-white bg-opacity-90 rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold mb-2 text-green-700 flex items-center gap-2">📊 Data Upload & Analysis</h1>
        <p className="mb-6 text-gray-600">Upload your osteoporosis dataset (CSV) to view and analyze the data. The table below will display your uploaded data.</p>
        <input type="file" accept=".csv" onChange={handleFileChange} className="mb-6 block" />
        {headers.length > 0 && (
          <div className="overflow-x-auto mt-6 rounded-xl border border-gray-200 shadow">
            <table className="min-w-full border-collapse bg-white rounded-xl">
              <thead>
                <tr>
                  {headers.map((header, idx) => (
                    <th key={idx} className="border-b-2 px-3 py-2 bg-green-100 text-green-900 font-semibold text-sm text-center">{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableData.map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                    {row.map((cell, j) => (
                      <td key={j} className="border-b px-3 py-2 text-center text-gray-700 text-sm">{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
} 