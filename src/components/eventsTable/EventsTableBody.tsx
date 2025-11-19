import { TableBody, TableRow, TableCell, Button } from "@mui/material";
import { columns, type EventRow } from "../../types";

export  default function EventsTableBody({ rows, page, rowsPerPage, onRowClick }: {
  rows: EventRow[];
  page: number;
  rowsPerPage: number;
  onRowClick: (row: EventRow) => void;
}) {
  return (
    <TableBody>
      {rows
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
        .map((row) => (
          <TableRow hover key={row.id}>
            {columns.map((column) => {
              if (column.id === "actions") {
                return (
                  <TableCell key={column.id} align="center" sx={{ p: 1 }}>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => onRowClick(row)}
                    >
                      לפרטי האירוע
                    </Button>
                  </TableCell>
                );
              }
              const value = row[column.id];
              return (
                <TableCell key={column.id} align={column.align}>
                  {value}
                </TableCell>
              );
            })}
          </TableRow>
        ))}
    </TableBody>
  );
}
