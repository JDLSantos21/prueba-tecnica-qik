import React from "react";
import { render } from "@testing-library/react-native";
import { StyleSheet } from "react-native";
import { TransactionListItem } from "../TransactionListItem";
import { Transaction } from "@/features/transactions/types/transaction.types";

jest.mock("@expo/vector-icons", () => ({
  Ionicons: "Ionicons",
}));

describe("<TransactionListItem />", () => {
  const creditTransaction: Transaction = {
    id: "1",
    amount: 150.0,
    type: "CREDIT",
    description: "Salary Deposit",
    createdAt: "2026-01-29T12:00:00Z",
    accountId: "acc1",
  };

  const debitTransaction: Transaction = {
    id: "2",
    amount: 50.5,
    type: "DEBIT",
    description: "Coffee Shop",
    createdAt: "2026-01-28T10:00:00Z",
    accountId: "acc1",
  };

  it("Rederiza correctamente la transacción de crédito", () => {
    const { getByText } = render(
      <TransactionListItem item={creditTransaction} />,
    );

    expect(getByText("Salary Deposit")).toBeTruthy();
    expect(getByText("+$150.00")).toBeTruthy();

    const amountText = getByText("+$150.00");
    const flattenedStyle = StyleSheet.flatten(amountText.props.style);
    expect(flattenedStyle).toEqual(
      expect.objectContaining({ color: "#22c55e" }),
    );
  });

  it("Rederiza correctamente la transacción de débito", () => {
    const { getByText } = render(
      <TransactionListItem item={debitTransaction} />,
    );

    expect(getByText("Coffee Shop")).toBeTruthy();
    expect(getByText("-$50.50")).toBeTruthy();

    const amountText = getByText("-$50.50");
    const flattenedStyle = StyleSheet.flatten(amountText.props.style);
    expect(flattenedStyle).toEqual(
      expect.objectContaining({ color: "#ef4444" }),
    );
  });
});
