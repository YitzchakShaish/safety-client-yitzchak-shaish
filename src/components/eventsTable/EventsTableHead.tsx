import { TableHead, TableRow, TableCell } from "@mui/material";
import { columns } from "../../types";
export default function EventsTableHead() {
  return (
    <TableHead>
      <TableRow>
        {columns.map((column) => (
          <TableCell
            key={column.id}
            align={"right"}
            sx={{
              minWidth: column.minWidth,
              fontWeight: 600,
              bgcolor: "background.default",
              color: "text.secondary",
            }}
          >
            {column.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}
