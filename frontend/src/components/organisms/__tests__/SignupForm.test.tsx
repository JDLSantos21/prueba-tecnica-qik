import React from "react";
import {
  render,
  fireEvent,
  waitFor,
  screen,
} from "@testing-library/react-native";
import { SignupForm } from "../SignupForm";
import { useSignup } from "@/features/auth/hooks";

jest.mock("@/features/auth/hooks", () => ({
  useSignup: jest.fn(),
}));

describe("<SignupForm />", () => {
  const mockSignup = jest.fn();
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useSignup as jest.Mock).mockReturnValue({
      signup: mockSignup,
      loading: false,
      error: null,
    });
  });

  it("Rederiza correctamente todos los campos", () => {
    render(<SignupForm onNavigateToLogin={mockNavigate} />);

    expect(screen.getByPlaceholderText("Ingresa tu nombre")).toBeTruthy();
    expect(screen.getByPlaceholderText("Ingresa tu apellido")).toBeTruthy();
    expect(
      screen.getByPlaceholderText("Ingresa un nombre de usuario"),
    ).toBeTruthy();
    expect(screen.getByPlaceholderText("Ingresa tu contraseña")).toBeTruthy();
    expect(screen.getByPlaceholderText("Confirma tu contraseña")).toBeTruthy();
    expect(screen.getByText("Crear Cuenta")).toBeTruthy();
  });

  it("Llama a signup con datos correctos", async () => {
    render(<SignupForm onNavigateToLogin={mockNavigate} />);

    fireEvent.changeText(
      screen.getByPlaceholderText("Ingresa tu nombre"),
      "  John  ",
    );
    fireEvent.changeText(
      screen.getByPlaceholderText("Ingresa tu apellido"),
      " Doe ",
    );
    fireEvent.changeText(
      screen.getByPlaceholderText("Ingresa un nombre de usuario"),
      " johndoe ",
    );
    fireEvent.changeText(
      screen.getByPlaceholderText("Ingresa tu contraseña"),
      "Password123!",
    );
    fireEvent.changeText(
      screen.getByPlaceholderText("Confirma tu contraseña"),
      "Password123!",
    );

    fireEvent.press(screen.getByText("Crear Cuenta"));

    await waitFor(() => {
      expect(mockSignup).toHaveBeenCalledWith({
        name: "John",
        lastName: "Doe",
        username: "johndoe",
        password: "Password123!",
      });
    });
  });

  it("Llama a onNavigateToLogin cuando se presiona el enlace", () => {
    render(<SignupForm onNavigateToLogin={mockNavigate} />);
    fireEvent.press(screen.getByText("Inicia Sesión"));
    expect(mockNavigate).toHaveBeenCalled();
  });
});
