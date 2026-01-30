import React from "react";
import { render, screen } from "@testing-library/react-native";
import { Text, View } from "react-native";

const TestComponent = () => (
  <View>
    <Text>Hello Testing World</Text>
  </View>
);

describe("Smoke Test", () => {
  it("renders correctly", () => {
    render(<TestComponent />);
    expect(screen.getByText("Hello Testing World")).toBeTruthy();
  });
});
