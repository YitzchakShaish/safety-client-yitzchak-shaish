
import { Paper, Table, TableContainer, TablePagination } from "@mui/material";
import { useNavigate } from "react-router";
import type { EventRow } from "../../types";
import EventsTableHead from "./EventsTableHead";
import EventsTableBody from "./EventsTableBody";

export default function EventsTable({
  rows,
  page,
  perPage,
  total,
  onPageChange,
  onPerPageChange
}: {
  rows: EventRow[];
  page: number;
  perPage: number;
  total: number;
  onPageChange: (p: number) => void;
  onPerPageChange: (n: number) => void;
}) {

  const navigate = useNavigate();
  const handleRowClick = (row: EventRow) => {
    navigate(`/events/${row.id}`, { state: { event: row.fullData } });
  };

  return (
    <Paper sx={{ width: "100%", overflow: "auto", bgcolor: "background.paper", color: "text.primary", borderRadius: 3 }}>
      <TableContainer sx={{ maxHeight: "calc(100vh - 20rem)", minHeight: "calc(100vh - 20rem)" }}>
        <Table stickyHeader>
          <EventsTableHead />
          <EventsTableBody
            rows={rows}
            onRowClick={handleRowClick}
          />
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[10, 25, 50]}
        component="div"
        count={total}
        rowsPerPage={perPage}
        page={page - 1}       
        labelRowsPerPage="שורות בעמוד:"
        labelDisplayedRows={({ from, to, count }) => `${from}–${to} מתוך ${count}`}
        onPageChange={(_, newPage) => onPageChange(newPage + 1)}
        onRowsPerPageChange={(e) => onPerPageChange(+e.target.value)}
      />
    </Paper>
  );
}
