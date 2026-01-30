import React from "react";
import {
  render,
  fireEvent,
  waitFor,
  screen,
} from "@testing-library/react-native";
import { LoginForm } from "../LoginForm";
import { useLogin } from "@/features/auth/hooks";

jest.mock("@/features/auth/hooks", () => ({
  useLogin: jest.fn(),
}));

describe("<LoginForm />", () => {
  const mockLogin = jest.fn();
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useLogin as jest.Mock).mockReturnValue({
      login: mockLogin,
      loading: false,
      error: null,
    });
  });

  it("Rederiza correctamente todos los campos", () => {
    render(<LoginForm onNavigateToRegister={mockNavigate} />);

    expect(screen.getByPlaceholderText("Ingresa tu usuario")).toBeTruthy();
    expect(screen.getByPlaceholderText("Ingresa tu contraseña")).toBeTruthy();
    expect(screen.getByText("Iniciar Sesión")).toBeTruthy();
    expect(screen.getByText("Regístrate")).toBeTruthy();
  });

  it("Muestra error de validación si faltan campos", async () => {
    render(<LoginForm onNavigateToRegister={mockNavigate} />);

    fireEvent.press(screen.getByText("Iniciar Sesión"));

    await waitFor(() => {
      expect(mockLogin).not.toHaveBeenCalled();
    });
  });

  it("Llama a login con datos correctos", async () => {
    render(<LoginForm onNavigateToRegister={mockNavigate} />);

    fireEvent.changeText(
      screen.getByPlaceholderText("Ingresa tu usuario"),
      "testuser",
    );
    fireEvent.changeText(
      screen.getByPlaceholderText("Ingresa tu contraseña"),
      "password123",
    );

    fireEvent.press(screen.getByText("Iniciar Sesión"));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        username: "testuser",
        password: "password123",
      });
    });
  });

  it("Llama a onNavigateToRegister cuando se presiona el enlace", () => {
    render(<LoginForm onNavigateToRegister={mockNavigate} />);

    fireEvent.press(screen.getByText("Regístrate"));

    expect(mockNavigate).toHaveBeenCalled();
  });

  it("Muestra el estado de carga en el botón", () => {
    (useLogin as jest.Mock).mockReturnValue({
      login: mockLogin,
      loading: true,
      error: null,
    });

    render(<LoginForm onNavigateToRegister={mockNavigate} />);

    expect(screen.queryByText("Iniciar Sesión")).toBeNull();
  });
});
