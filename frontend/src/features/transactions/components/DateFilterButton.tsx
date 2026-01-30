import React, { useState, useCallback, memo } from "react";
import { Pressable, StyleSheet } from "react-native";
import { Text } from "@/components/atoms";
import { DateRangeModal } from "@/components/organisms";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/theme";
import { getDateRangeLabel } from "@/utils/dateUtils";

interface DateFilterButtonProps {
  startDate: string | undefined;
  endDate: string | undefined;
  onApply: (start: string | undefined, end: string | undefined) => void;
  onClear: () => void;
}

export const DateFilterButton = memo(function DateFilterButton({
  startDate,
  endDate,
  onApply,
  onClear,
}: DateFilterButtonProps) {
  const [isModalVisible, setModalVisible] = useState(false);
  const hasFilter = Boolean(startDate || endDate);

  const openModal = useCallback(() => setModalVisible(true), []);
  const closeModal = useCallback(() => setModalVisible(false), []);

  return (
    <>
      <Pressable
        style={[styles.button, hasFilter && styles.buttonActive]}
        onPress={openModal}
      >
        <Ionicons
          name="calendar-outline"
          size={16}
          color={hasFilter ? colors.white : colors.primary[500]}
        />
        <Text
          style={[styles.buttonText, hasFilter && styles.buttonTextActive]}
          numberOfLines={1}
        >
          {getDateRangeLabel(startDate, endDate)}
        </Text>
        <Ionicons
          name="chevron-down"
          size={14}
          color={hasFilter ? colors.white : colors.gray[500]}
        />
      </Pressable>

      <DateRangeModal
        visible={isModalVisible}
        startDate={startDate}
        endDate={endDate}
        onApply={onApply}
        onClear={onClear}
        onClose={closeModal}
      />
    </>
  );
});

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: colors.primary[50],
    borderRadius: 8,
    gap: 6,
    maxWidth: "100%",
  },
  buttonActive: {
    backgroundColor: colors.primary[500],
  },
  buttonText: {
    color: colors.primary[500],
    fontSize: 13,
    fontWeight: "500",
    flexShrink: 1,
  },
  buttonTextActive: {
    color: colors.white,
  },
});
