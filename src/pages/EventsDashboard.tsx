import { Box, Divider, LinearProgress } from "@mui/material";
import EventSearchBar from "../components/EventSearchBar";
import EventsTable from "../components/eventsTable/EventsTable";
import { useState, useCallback, useEffect } from "react";
import type { EventFilters, EventRow } from "../types/eventsTable";
import { getAllEventReports, getEveryEventReport } from "../api/eventReport.api";
import { useUser } from "../hooks/useUser";
import { filterEventRows, toEventRow } from "../utils/filterEvents";

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

  const [pageRows, setPageRows] = useState<EventRow[]>([]);
  const [filteredRows, setFilteredRows] = useState<EventRow[]>([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [total, setTotal] = useState(0);

  const textQuery = activeFilters.q.trim();

  useEffect(() => {
    if (textQuery) return;

    let cancelled = false;
    async function fetchReports() {
      setLoading(true);
      try {
        const { result, status } = await getAllEventReports({
          page,
          perPage,
          dateFrom: activeFilters.dateFrom,
          dateTo: activeFilters.dateTo,
        });

        if (cancelled || status !== 200 || !result) return;
        const { data, pagination } = result;

        setPageRows((Array.isArray(data) ? data : []).map(toEventRow));
        setTotal(pagination?.total);
        setPage(pagination?.page);
      } catch (err) {
        console.error(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchReports();
    return () => {
      cancelled = true;
    };
  }, [page, perPage, activeFilters, textQuery, user]);

  // The list API matches only some columns, and the event number is formatted here.
  // Load the date-filtered reports and match every cell the table renders.
  useEffect(() => {
    if (!textQuery) return;

    let cancelled = false;
    async function fetchMatches() {
      setLoading(true);
      try {
        const { status, data } = await getEveryEventReport({
          dateFrom: activeFilters.dateFrom,
          dateTo: activeFilters.dateTo,
        });
        if (cancelled) return;
        if (status !== 200) {
          setFilteredRows([]);
          return;
        }
        setFilteredRows(filterEventRows(data.map(toEventRow), {
          q: activeFilters.q,
          dateFrom: null,
          dateTo: null,
        }));
      } catch (err) {
        console.error(err);
        if (!cancelled) setFilteredRows([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchMatches();
    return () => {
      cancelled = true;
    };
  }, [activeFilters, textQuery, user]);

  // Handle search toggle
  const handleSearchToggle = useCallback(() => {
    setPage(1);
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

  const visibleRows = textQuery
    ? filteredRows.slice((page - 1) * perPage, page * perPage)
    : pageRows;
  const visibleTotal = textQuery ? filteredRows.length : total;

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
        rows={visibleRows}
        page={page}
        perPage={perPage}
        total={visibleTotal}
        onPageChange={setPage}
        onPerPageChange={(n) => {
          setPerPage(n);
          setPage(1);
        }}
      />

    </Box>
  );
}
