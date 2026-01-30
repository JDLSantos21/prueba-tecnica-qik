import { useState, useCallback, useReducer } from "react";
import { TransactionType } from "../types/transaction.types";

export interface TransactionFiltersState {
  type: TransactionType | undefined;
  startDate: string | undefined;
  endDate: string | undefined;
}

type FilterAction =
  | { type: "SET_TYPE"; payload: TransactionType | undefined }
  | { type: "SET_START_DATE"; payload: string | undefined }
  | { type: "SET_END_DATE"; payload: string | undefined }
  | { type: "CLEAR_DATES" }
  | { type: "RESET" };

const initialFiltersState: TransactionFiltersState = {
  type: undefined,
  startDate: undefined,
  endDate: undefined,
};

function filtersReducer(
  state: TransactionFiltersState,
  action: FilterAction,
): TransactionFiltersState {
  switch (action.type) {
    case "SET_TYPE":
      return { ...state, type: action.payload };
    case "SET_START_DATE":
      return { ...state, startDate: action.payload };
    case "SET_END_DATE":
      return { ...state, endDate: action.payload };
    case "CLEAR_DATES":
      return { ...state, startDate: undefined, endDate: undefined };
    case "RESET":
      return initialFiltersState;
    default:
      return state;
  }
}

export function useTransactionFilters() {
  const [filters, dispatch] = useReducer(filtersReducer, initialFiltersState);
  const [isDateModalVisible, setDateModalVisible] = useState(false);

  const setTypeFilter = useCallback((type: TransactionType | undefined) => {
    dispatch({ type: "SET_TYPE", payload: type });
  }, []);

  const setStartDate = useCallback((date: string | undefined) => {
    dispatch({ type: "SET_START_DATE", payload: date });
  }, []);

  const setEndDate = useCallback((date: string | undefined) => {
    dispatch({ type: "SET_END_DATE", payload: date });
  }, []);

  const clearDates = useCallback(() => {
    dispatch({ type: "CLEAR_DATES" });
  }, []);

  const resetFilters = useCallback(() => {
    dispatch({ type: "RESET" });
  }, []);

  const openDateModal = useCallback(() => {
    setDateModalVisible(true);
  }, []);

  const closeDateModal = useCallback(() => {
    setDateModalVisible(false);
  }, []);

  const hasDateFilter = Boolean(filters.startDate || filters.endDate);
  const hasAnyFilter = Boolean(filters.type || hasDateFilter);

  return {
    filters,
    isDateModalVisible,
    hasDateFilter,
    hasAnyFilter,
    setTypeFilter,
    setStartDate,
    setEndDate,
    clearDates,
    resetFilters,
    openDateModal,
    closeDateModal,
  };
}

export function formatDateForDisplay(dateString: string | undefined): string {
  if (!dateString) return "Seleccionar";
  return new Date(dateString).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function getDateRangeLabel(
  startDate: string | undefined,
  endDate: string | undefined,
): string {
  if (!startDate && !endDate) return "Todas las fechas";
  if (startDate && endDate) {
    return `${formatDateForDisplay(startDate)} - ${formatDateForDisplay(endDate)}`;
  }
  if (startDate) return `Desde ${formatDateForDisplay(startDate)}`;
  return `Hasta ${formatDateForDisplay(endDate)}`;
}

export function parseDateInput(value: string): string | undefined {
  const parts = value.split("/");
  if (parts.length !== 3) return undefined;

  const [day, month, year] = parts.map(Number);
  if (isNaN(day) || isNaN(month) || isNaN(year)) return undefined;
  if (day < 1 || day > 31 || month < 1 || month > 12) return undefined;

  const date = new Date(year, month - 1, day);
  if (isNaN(date.getTime())) return undefined;

  return date.toISOString();
}

export function formatDateForInput(isoString: string | undefined): string {
  if (!isoString) return "";
  const date = new Date(isoString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}
