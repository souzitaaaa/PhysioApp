import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";

import { createNote } from "../../services/noteService";
import {
  InjuryRecord,
  fetchInjuryRecordById,
} from "../../services/injuryRecordService";
import { createReminder } from "../../services/reminderService";


import { styles } from "../../css/add-note"

export default function AddNoteScreen() {
  const { injuryRecordID } = useLocalSearchParams<{ injuryRecordID: string }>();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [injury, setInjury] = useState<InjuryRecord | null>(null);
  const [text, setText] = useState("");

  const [reminderTitle, setReminderTitle] = useState("");
  const [date, setDate] = useState<Date | null>(null);
  const [timeStart, setTimeStart] = useState<Date | null>(null);
  const [timeEnd, setTimeEnd] = useState<Date | null>(null);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  useEffect(() => {
    async function loadInjury() {
      if (!injuryRecordID) return;
      const result = await fetchInjuryRecordById(Number(injuryRecordID));
      setInjury(result);
      setLoading(false);
    }
    loadInjury();
  }, []);

  function formatDate(date: Date) {
    return date.toISOString().split("T")[0];
  }

  function formatTime(date: Date) {
    return date.toTimeString().slice(0, 5);
  }

  async function handleSave() {
    if (!injuryRecordID) return;

    // Criar nota
    await createNote(Number(injuryRecordID), text);

    // Criar reminder se tudo estiver preenchido
    if (reminderTitle && date && timeStart && timeEnd) {
      await createReminder({
        title: reminderTitle,
        date: formatDate(date),
        timeStart: formatTime(timeStart),
        timeEnd: formatTime(timeEnd),
        injuryRecordID: Number(injuryRecordID),
      });
    }

    router.push("/historical");
  }

  function handleGoBack() {
    router.push("/historical");
  }

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Adicionar Nota</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Tipo de Lesão:</Text>
        <Text style={styles.infoText}>{injury?.title}</Text>

        <Text style={styles.label}>Nome do Fisio:</Text>
        <Text style={styles.infoText}>{injury?.physioID}</Text>

        <Text style={styles.label}>Data de começo:</Text>
        <Text style={styles.infoText}>{injury?.dateStart}</Text>

        <Text style={styles.label}>Nota:</Text>
        <TextInput
          style={styles.input}
          multiline
          placeholder="Escreva a nota..."
          value={text}
          onChangeText={setText}
        />

        <Text style={styles.label}>Título do Lembrete:</Text>
        <TextInput
          style={styles.inputReminder}
          placeholder="Escreva o titulo do lembrete..."
          value={reminderTitle}
          onChangeText={setReminderTitle}
        />

        <Text style={styles.label}>Data:</Text>
        <TouchableOpacity
          style={styles.pickerButton}
          onPress={() => setShowDatePicker(true)}
        >
          <Text>{date ? date.toLocaleDateString() : "Selecionar data"}</Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={date || new Date()}
            mode="date"
            onChange={(_, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) setDate(selectedDate);
            }}
          />
        )}

        <Text style={styles.label}>Hora de Início:</Text>
        <TouchableOpacity
          style={styles.pickerButton}
          onPress={() => setShowStartPicker(true)}
        >
          <Text>
            {timeStart
              ? timeStart.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "Selecionar hora"}
          </Text>
        </TouchableOpacity>

        {showStartPicker && (
          <DateTimePicker
            value={timeStart || new Date()}
            mode="time"
            onChange={(_, selectedDate) => {
              setShowStartPicker(false);
              if (selectedDate) setTimeStart(selectedDate);
            }}
          />
        )}

        <Text style={styles.label}>Hora de Fim:</Text>
        <TouchableOpacity
          style={styles.pickerButton}
          onPress={() => setShowEndPicker(true)}
        >
          <Text>
            {timeEnd
              ? timeEnd.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "Selecionar hora"}
          </Text>
        </TouchableOpacity>

        {showEndPicker && (
          <DateTimePicker
            value={timeEnd || new Date()}
            mode="time"
            onChange={(_, selectedDate) => {
              setShowEndPicker(false);
              if (selectedDate) setTimeEnd(selectedDate);
            }}
          />
        )}

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.btncancel} onPress={handleGoBack}>
            <Text style={styles.btnText}>Cancelar</Text>
            <Ionicons name="arrow-back" size={20} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.btn} onPress={handleSave}>
            <Text style={styles.btnText}>Guardar</Text>
            <Ionicons name="document-outline" size={20} />
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
