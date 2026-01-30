import { Stack } from "expo-router";

export default function MainLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: "#f9fafb",
        },
        headerTitleStyle: {
          fontWeight: "600",
        },
      }}
    >
      <Stack.Screen
        name="accounts/index"
        options={{
          title: "Cuentas",
        }}
      />
      <Stack.Screen
        name="accounts/[id]"
        options={{
          title: "Detalle de Cuenta",
        }}
      />
      <Stack.Screen
        name="transactions/index"
        options={{
          title: "Transacciones",
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="transactions/create"
        options={{
          title: "Nueva Transacción",
          presentation: "containedModal",
          animation: "slide_from_bottom",
        }}
      />
      <Stack.Screen
        name="transactions/transfer"
        options={{
          title: "Transferir",
          presentation: "containedModal",
          animation: "slide_from_bottom",
        }}
      />
    </Stack>
  );
}
