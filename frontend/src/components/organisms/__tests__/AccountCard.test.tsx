import React from "react";
import { render } from "@testing-library/react-native";
import { AccountCard } from "../AccountCard";

jest.mock("@expo/vector-icons", () => ({
  Ionicons: "Ionicons",
}));

describe("<AccountCard />", () => {
  const defaultProps = {
    accountNumber: "1234567890",
    balance: 5000.5,
  };

  it("Rederiza correctamente con los props dados", () => {
    const { getByText } = render(<AccountCard {...defaultProps} />);

    expect(getByText("•••• 7890")).toBeTruthy();

    expect(getByText("$5000.50")).toBeTruthy();

    expect(getByText("Balance disponible")).toBeTruthy();
  });

  it("Rederiza correctamente el balance en cero", () => {
    const { getByText } = render(
      <AccountCard accountNumber="0000000000" balance={0} />,
    );
    expect(getByText("$0.00")).toBeTruthy();
  });
});
