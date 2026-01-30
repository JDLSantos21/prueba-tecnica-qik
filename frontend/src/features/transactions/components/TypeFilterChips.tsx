import React, { memo } from "react";
import { View, Pressable, StyleSheet } from "react-native";
import { Text } from "@/components/atoms";
import { Ionicons } from "@expo/vector-icons";
import { TransactionType } from "@/features/transactions/types/transaction.types";

type FilterType = TransactionType | "ALL";

interface TypeFilterChipsProps {
  selected: FilterType;
  onSelect: (type: TransactionType | undefined) => void;
}

export const TypeFilterChips = memo(function TypeFilterChips({
  selected,
  onSelect,
}: TypeFilterChipsProps) {
  return (
    <View style={styles.container}>
      <Pressable
        style={[styles.chip, selected === "ALL" && styles.chipActive]}
        onPress={() => onSelect(undefined)}
      >
        <Text style={selected === "ALL" ? styles.textActive : styles.text}>
          Todos
        </Text>
      </Pressable>

      <Pressable
        style={[styles.chip, selected === "CREDIT" && styles.chipGreen]}
        onPress={() => onSelect("CREDIT")}
      >
        <Ionicons
          name="arrow-down"
          size={14}
          color={selected === "CREDIT" ? "#fff" : "#22c55e"}
        />
        <Text
          style={selected === "CREDIT" ? styles.textActive : styles.textGreen}
        >
          {" "}
          Créditos
        </Text>
      </Pressable>

      <Pressable
        style={[styles.chip, selected === "DEBIT" && styles.chipRed]}
        onPress={() => onSelect("DEBIT")}
      >
        <Ionicons
          name="arrow-up"
          size={14}
          color={selected === "DEBIT" ? "#fff" : "#ef4444"}
        />
        <Text style={selected === "DEBIT" ? styles.textActive : styles.textRed}>
          {" "}
          Débitos
        </Text>
      </Pressable>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 8,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#fff",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  chipActive: {
    backgroundColor: "#3b82f6",
    borderColor: "#3b82f6",
  },
  chipGreen: {
    backgroundColor: "#22c55e",
    borderColor: "#22c55e",
  },
  chipRed: {
    backgroundColor: "#ef4444",
    borderColor: "#ef4444",
  },
  text: {
    color: "#374151",
    fontSize: 13,
    fontWeight: "500",
  },
  textActive: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "500",
  },
  textGreen: {
    color: "#22c55e",
    fontSize: 13,
    fontWeight: "500",
  },
  textRed: {
    color: "#ef4444",
    fontSize: 13,
    fontWeight: "500",
  },
});
