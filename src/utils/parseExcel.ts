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
  const normalize = (value: unknown) =>
    String(value ?? "")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "");

  const parseRows = (rows: any[][]): ParsedStudent[] => {
    const headerRowIndex = rows.findIndex(
      (row) =>
        row.some(
          (cell) =>
            normalize(cell) === "regno"
        ) &&
        row.some(
          (cell) =>
            normalize(cell) === "name"
        )
    );

    if (headerRowIndex === -1) {
      return [];
    }

    const headerRow = rows[headerRowIndex];

    const findColumn = (...labels: string[]) => {
      const normalizedLabels = labels.map(
        normalize
      );

      return headerRow.findIndex((cell) =>
        normalizedLabels.includes(
          normalize(cell)
        )
      );
    };

    const registerIdColumn = findColumn(
      "Reg. No",
      "Reg No",
      "Register Id",
      "Register No"
    );
    const nameColumn = findColumn("Name");
    const branchCodeColumn = findColumn(
      "Branch Code"
    );
    const accountNumberColumn = findColumn(
      "Account No",
      "Account Number"
    );
    const amountColumn = findColumn(
      "Amount (Rs)",
      "Amount",
      "Amount Rs"
    );

    if (
      registerIdColumn === -1 ||
      nameColumn === -1
    ) {
      return [];
    }

    return rows
      .slice(headerRowIndex + 1)
      .map((row) => ({
        registerId: String(
          row[registerIdColumn] ?? ""
        ).trim(),
        name: String(
          row[nameColumn] ?? ""
        ).trim(),
        branchCode:
          branchCodeColumn === -1
            ? ""
            : String(
                row[branchCodeColumn] ?? ""
              ).trim(),
        accountNumber:
          accountNumberColumn === -1
            ? ""
            : String(
                row[accountNumberColumn] ?? ""
              ).trim(),
        amount:
          amountColumn === -1
            ? 0
            : Number(
                String(
                  row[amountColumn] ?? ""
                ).replace(/,/g, "")
              ) || 0,
      }))
      .filter((row) => row.registerId);
  };

  for (const sheetName of workbook.SheetNames) {
    const sheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json<any[]>(
      sheet,
      {
        header: 1,
        defval: "",
        blankrows: false,
      }
    );

    const parsed = parseRows(rows);
    if (parsed.length > 0) {
      return parsed;
    }
  }

  return [];
};
