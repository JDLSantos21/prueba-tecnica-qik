import React, { useState, useCallback, memo } from "react";
import { View, Modal, Pressable, ScrollView, StyleSheet } from "react-native";
import { Calendar } from "react-native-calendars";
import { Text, Button, DateBox } from "@/components/atoms";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/theme";
import {
  formatDateForDisplay,
  toCalendarFormat,
  fromCalendarFormat,
  getTodayString,
} from "@/utils/dateUtils";
import "@/lib/locale/calendar";

interface DateRangeModalProps {
  visible: boolean;
  startDate: string | undefined;
  endDate: string | undefined;
  onApply: (start: string | undefined, end: string | undefined) => void;
  onClear: () => void;
  onClose: () => void;
}

export const DateRangeModal = memo(function DateRangeModal({
  visible,
  startDate,
  endDate,
  onApply,
  onClear,
  onClose,
}: DateRangeModalProps) {
  const [selectingStart, setSelectingStart] = useState(true);
  const [tempStart, setTempStart] = useState<string | undefined>(startDate);
  const [tempEnd, setTempEnd] = useState<string | undefined>(endDate);

  const handleOpen = useCallback(() => {
    setTempStart(startDate);
    setTempEnd(endDate);
    setSelectingStart(true);
  }, [startDate, endDate]);

  React.useEffect(() => {
    if (visible) handleOpen();
  }, [visible, handleOpen]);

  const handleDayPress = useCallback(
    (day: { dateString: string }) => {
      const selectedDate = fromCalendarFormat(day.dateString);

      if (selectingStart) {
        setTempStart(selectedDate);
        if (tempEnd && new Date(selectedDate) > new Date(tempEnd)) {
          setTempEnd(undefined);
        }
        setSelectingStart(false);
      } else {
        if (tempStart && new Date(selectedDate) < new Date(tempStart)) {
          setTempStart(selectedDate);
          setTempEnd(undefined);
        } else {
          setTempEnd(selectedDate);
        }
      }
    },
    [selectingStart, tempStart, tempEnd],
  );

  const handleApply = useCallback(() => {
    onApply(tempStart, tempEnd);
    onClose();
  }, [tempStart, tempEnd, onApply, onClose]);

  const handleClear = useCallback(() => {
    setTempStart(undefined);
    setTempEnd(undefined);
    onClear();
    onClose();
  }, [onClear, onClose]);

  const getMarkedDates = useCallback(() => {
    const marked: Record<string, object> = {};
    const startStr = toCalendarFormat(tempStart);
    const endStr = toCalendarFormat(tempEnd);

    if (startStr) {
      marked[startStr] = {
        startingDay: true,
        color: colors.primary[500],
        textColor: colors.white,
      };
    }

    if (endStr) {
      marked[endStr] = {
        ...marked[endStr],
        endingDay: true,
        color: colors.primary[500],
        textColor: colors.white,
      };
    }

    if (tempStart && tempEnd) {
      const start = new Date(tempStart);
      const end = new Date(tempEnd);
      const current = new Date(start);
      current.setDate(current.getDate() + 1);

      while (current < end) {
        const dateStr = current.toISOString().split("T")[0];
        marked[dateStr] = {
          color: colors.primary[100],
          textColor: colors.primary[800],
        };
        current.setDate(current.getDate() + 1);
      }
    }

    return marked;
  }, [tempStart, tempEnd]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.content} onPress={(e) => e.stopPropagation()}>
          <View style={styles.handle} />

          <Text variant="subheading" style={styles.title}>
            Seleccionar rango de fechas
          </Text>

          <View style={styles.selectionInfo}>
            <DateBox
              label="Desde"
              value={tempStart}
              isActive={selectingStart}
              onPress={() => setSelectingStart(true)}
              formatValue={formatDateForDisplay}
            />
            <Ionicons name="arrow-forward" size={20} color={colors.gray[400]} />
            <DateBox
              label="Hasta"
              value={tempEnd}
              isActive={!selectingStart}
              onPress={() => setSelectingStart(false)}
              formatValue={formatDateForDisplay}
            />
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <Calendar
              markingType="period"
              markedDates={getMarkedDates()}
              onDayPress={handleDayPress}
              maxDate={getTodayString()}
              theme={{
                backgroundColor: colors.white,
                calendarBackground: colors.white,
                textSectionTitleColor: colors.gray[500],
                selectedDayBackgroundColor: colors.primary[500],
                selectedDayTextColor: colors.white,
                todayTextColor: colors.primary[500],
                dayTextColor: colors.gray[900],
                textDisabledColor: colors.gray[300],
                arrowColor: colors.primary[500],
                monthTextColor: colors.gray[900],
                textMonthFontWeight: "600",
                textDayFontSize: 14,
                textMonthFontSize: 16,
                textDayHeaderFontSize: 12,
              }}
            />
          </ScrollView>

          <View style={styles.actions}>
            <Button
              title="Limpiar"
              variant="outline"
              onPress={handleClear}
              style={styles.actionButton}
            />
            <Button
              title="Aplicar"
              variant="primary"
              onPress={handleApply}
              style={styles.actionButton}
            />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
});

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  content: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 32,
    maxHeight: "85%",
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: colors.gray[300],
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 16,
  },
  title: {
    textAlign: "center",
    marginBottom: 16,
  },
  selectionInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    marginBottom: 16,
  },
  actions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  },
  actionButton: {
    flex: 1,
  },
});
