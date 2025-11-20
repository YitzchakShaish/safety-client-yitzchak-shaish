import { Box, Divider } from "@mui/material";
import EventSearchBar from "../components/EventSearchBar";
import EventsTable from "../components/eventsTable/EventsTable";
import { mockEventReports } from "../mock/eventsData";
import { useState, useMemo, useCallback } from "react";
import type { EventFilters, EventRow } from "../types/eventsTable";
import { filterEventRows } from "../utils/filterEvents";

export default function EventsDashboard() {
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
  // Prepare all rows from mock data
  const allRows: EventRow[] = useMemo(() => {
    return mockEventReports.map((r) => ({
      id: r.id,
      eventNumber: `EV-${r.id.toString().padStart(4, "0")}`,
      eventStatus: r.reportInfo.eventStatus,
      category: r.eventInfo.category,
      eventDate: r.eventInfo.eventDate,
      eventTime: r.eventInfo.eventTime,
      fullName: r.reportInfo.fullName,
      unit: r.reportInfo.unit,
      fullData: r,
    }));
  }, []);

  // Filtered rows based on active filters
  const filteredRows = useMemo(() => {
    return filterEventRows(allRows, activeFilters);
  }, [allRows, activeFilters]);

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

  return (
    <Box width={"100%"} >
      <EventSearchBar
        filters={tempFilters}
        onFiltersChange={setTempFilters}
        onSearchToggle={handleSearchToggle}
        isSearching={isSearching}
      />
      <Divider sx={{ my: 2 }} />
      <EventsTable rows={filteredRows} />
    </Box>
  );
}
