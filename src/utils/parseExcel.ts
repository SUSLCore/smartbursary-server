import XLSX from "xlsx";

export interface ParsedStudent {
  registerId: string;
  name: string;
  branchCode: string;
  accountNumber: string;
  amount: number;
}

export const parseExcel = (
  filePath: string
): ParsedStudent[] => {
  const workbook =
    XLSX.readFile(filePath);

  const sheet =
    workbook.Sheets[
      workbook.SheetNames[0]
    ];

  const data =
    XLSX.utils.sheet_to_json<any>(
      sheet,
      {
        defval: "",
      }
    );

  return data
    .filter(
      (row) =>
        row["Reg. No"] ||
        row["Reg No"]
    )
    .map((row) => ({
      registerId:
        row["Reg. No"] ||
        row["Reg No"],

      name: row["Name"],

      branchCode:
        row["Branch Code"],

      accountNumber:
        row["Account No"],

      amount:
        Number(
          row["Amount (Rs)"]
        ) || 0,
    }));
};