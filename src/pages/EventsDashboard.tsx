import { Box, Divider, LinearProgress } from "@mui/material";
import EventSearchBar from "../components/EventSearchBar";
import EventsTable from "../components/eventsTable/EventsTable";
import { useState, useCallback, useEffect } from "react";
import type { EventFilters, EventRow } from "../types/eventsTable";
import { getAllEventReports } from "../api/eventReport.api";
import { useUser } from "../hooks/useUser";

export default function EventsDashboard() {
  const { user } = useUser();
  // State for search filters
  const [tempFilters, setTempFilters] = useState<EventFilters>({
    q: "",
    dateFrom: null as string | null,
    dateTo: null as string | null,
  });
  // State for active filters applied to the table
  const [activeFilters, setActiveFilters] = useState<EventFilters>({
    q: "",
    dateFrom: null as string | null,
    dateTo: null as string | null,
  });

  const [isSearching, setIsSearching] = useState(false);

  const [allRows, setAllRows] = useState<EventRow[]>([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const { logout } = useUser();


  useEffect(() => {
    async function fetchReports() {
      setLoading(true);
      try {
        const { result, status } = await getAllEventReports({
          page,
          perPage,
          q: activeFilters.q,
          dateFrom: activeFilters.dateFrom,
          dateTo: activeFilters.dateTo
        });

        if (status === 403) {
          return logout();
        }
        const { data, pagination } = result;

        const rows: EventRow[] = (data as any[])?.map(r => ({
          id: r.id,
          eventNumber: `EV-${r.id.toString().toUpperCase().slice(0, 4)}`,
          eventStatus: r.summaryInfo.eventStatus,
          category: r.eventInfo.category,
          eventDate: r.eventInfo.eventDate,
          eventTime: r.eventInfo.eventTime,
          fullName: r.reporterInfo.fullName,
          unit: r.reporterInfo.unit,
          fullData: r,
        }));

        setAllRows(rows);
        setTotal(pagination?.total);
        setPage(pagination?.page)
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchReports();
  }, [page, perPage, activeFilters, user]);



  // Handle search toggle
  const handleSearchToggle = useCallback(() => {
    if (!isSearching) {
      setActiveFilters({ ...tempFilters });
      setIsSearching(true);
    } else {
      setTempFilters({ q: "", dateFrom: null, dateTo: null });
      setActiveFilters({ q: "", dateFrom: null, dateTo: null });
      setIsSearching(false);
    }
  }, [isSearching, tempFilters]);

  if (loading) return <Box sx={{ width: '100%' }}>
    <LinearProgress />
  </Box>;



  return (
    <Box width={"100%"} >
      <EventSearchBar
        filters={tempFilters}
        onFiltersChange={setTempFilters}
        onSearchToggle={handleSearchToggle}
        isSearching={isSearching}
      />
      <Divider sx={{ my: 2 }} />
      <EventsTable
        rows={allRows}
        page={page}
        perPage={perPage}
        total={total}
        onPageChange={setPage}
        onPerPageChange={(n) => {
          setPerPage(n);
          setPage(1);
        }}
      />

    </Box>
  );
}
