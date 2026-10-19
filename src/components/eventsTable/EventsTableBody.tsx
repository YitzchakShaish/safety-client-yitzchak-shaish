import { TableBody, TableRow, TableCell, Button } from "@mui/material";
import { columns, type EventRow } from "../../types";
import { displayedEventCell } from "../../utils/filterEvents";

export default function EventsTableBody({
  rows,
  onRowClick
}: {
  rows: EventRow[];
  onRowClick: (row: EventRow) => void;
}) {
  return (
    <TableBody>
      {rows
        ?.map((row) => (
          <TableRow hover key={row.id}>
            {columns.map((column) => {
              if (column.id === "actions") {
                return (
                  <TableCell key={column.id} align="right" sx={{ p: 1 }}>
                    <Button size="small" variant="outlined" onClick={() => onRowClick(row)}>
                      לפרטי האירוע
                    </Button>
                  </TableCell>
                );
              }
              return <TableCell key={column.id} align="right">{displayedEventCell(row, column.id)}</TableCell>;
            })}
          </TableRow>
        ))}
    </TableBody>
  );
}
