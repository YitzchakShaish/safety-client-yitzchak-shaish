import { useState } from "react";
import { Paper, Table, TableContainer, TablePagination, } from "@mui/material";
import { useNavigate } from "react-router";
import type { EventRow } from "../../types";
import EventsTableHead  from "./EventsTableHead";
import  EventsTableBody  from "./EventsTableBody";


export default function EventsTable({ rows }: { rows: EventRow[] }) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const navigate = useNavigate();

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleRowClick = (row: EventRow) => {
    navigate(`/events/${row.id}`, { state: { event: row.fullData } });
  };

  return (
    <Paper
      sx={{
        width: "100%",
        overflow: "auto",
        bgcolor: "background.paper",
        color: "text.primary",
        borderRadius: 3,
      }}
    >
      <TableContainer sx={{ maxHeight: "calc(100vh - 20rem)" , minHeight: "calc(100vh - 20rem)"}}>
        <Table stickyHeader>

          <EventsTableHead />

          <EventsTableBody
            rows={rows}
            page={page}
            rowsPerPage={rowsPerPage}
            onRowClick={handleRowClick}
          />

        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[10, 25, 50]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        labelRowsPerPage="שורות בעמוד:"
        labelDisplayedRows={({ from, to, count }) => `${from}–${to} מתוך ${count}`}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
