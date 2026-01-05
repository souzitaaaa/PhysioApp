import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter, useFocusEffect } from "expo-router";
import { useEffect, useState, useCallback } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";

import { createNote } from "../../services/noteService";
import {
  InjuryRecord,
  fetchInjuryRecordById,
  setInjuryRecordWithNote,
} from "../../services/injuryRecordService";
import { createReminder } from "../../services/reminderService";

import { styles } from "../../css/add-note";

export default function AddNoteScreen() {
  // Route parameters
  const { injuryRecordID, athleteID, athleteName } = useLocalSearchParams<{
    injuryRecordID: string;
    athleteID: string;
    athleteName: string;
  }>();

  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [injury, setInjury] = useState<InjuryRecord | null>(null);

  const [text, setText] = useState("");

  const [reminderTitle, setReminderTitle] = useState("");
  const [date, setDate] = useState<Date | null>(null);

  const [showDatePicker, setShowDatePicker] = useState(false);

  // Reset all form fields
  const resetForm = useCallback(() => {
    setText("");
    setReminderTitle("");
    setDate(null);
    setShowDatePicker(false);
  }, []);

  // Reset form when leaving screen
  useFocusEffect(
    useCallback(() => {
      return () => {
        resetForm();
      };
    }, [resetForm])
  );

  // Load injury record
  useEffect(() => {
    async function loadInjury() {
      if (!injuryRecordID) return;
      const result = await fetchInjuryRecordById(Number(injuryRecordID));
      setInjury(result);
      setLoading(false);
    }
    loadInjury();
  }, [injuryRecordID]);

  // Format date (DD/MM/YYYY)
  function formatDate(date: Date | string | null) {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("pt-PT");
}

// Format date for database
function formatDateForDB(date: Date) {
  return date.toISOString().split("T")[0];
}


  async function handleSave() {
    if (!injuryRecordID) return;

    // Validate note text
    if (text.trim() === "") {
      alert("A nota é obrigatória.");
      return;
    }

    const reminderTouched = reminderTitle.trim() !== "" || date;

    if (reminderTouched) {
      if (reminderTitle.trim() === "" || !date) {
        alert("Preencha o título e a data do lembrete.");
        return;
      }
    }

    try {
      await createNote(Number(injuryRecordID), text);

      // Create reminder if needed
      if (reminderTouched) {
        const reminderPayload = {
          title: reminderTitle,
          date: formatDateForDB(date!),
          injuryRecordID: Number(injuryRecordID),
        };

        console.log("Payload do lembrete:", reminderPayload);
        await createReminder(reminderPayload);
      }

      // Close injury record
      await setInjuryRecordWithNote(Number(injuryRecordID));

      // Cancel and go back
      resetForm();
      router.replace({
        pathname: "/historical",
        params: { athleteID, athleteName },
      });
    } catch (error: any) {
      console.log("Erro ao guardar:", error);
      alert(
        `Erro ao guardar a nota ou lembrete.\n${error.message || ""}`
      );
    }
  }

  function handleGoBack() {
    resetForm();
    router.replace({
      pathname: "/historical",
      params: { athleteID, athleteName },
    });
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
      {/* Screen title */}
      <Text style={styles.title}>Adicionar Nota</Text>

      <View style={styles.card}>
        {/* Injury info */}
        <Text style={styles.titleHistorical}>Histórico</Text>

        <Text style={styles.label}>Tipo de Lesão:</Text>
        <Text style={styles.infoText}>{injury?.title}</Text>

        <Text style={styles.label}>Nome do Fisio:</Text>
        <Text style={styles.infoText}>{injury?.t_user?.name}</Text>

        <Text style={styles.label}>Data de começo:</Text>
        <Text style={styles.infoText}>{formatDate(injury?.dateStart)}</Text>

        {/* Note input */}
        <Text style={styles.label}>Nota:</Text>
        <TextInput
          style={styles.input}
          multiline
          placeholder="Escreva a nota..."
          value={text}
          onChangeText={setText}
        />

        {/* Reminder header */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 10,
          }}
        >
          <Text style={styles.titleReminder}>Lembrete</Text>

          {/* Clear reminder */}
          {(reminderTitle || date) && (
            <TouchableOpacity
              onPress={() => {
                setReminderTitle("");
                setDate(null);
              }}
            >
              <Text style={{ color: "red", fontSize: 12 }}>
                Limpar Lembrete
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <Text style={styles.label}>Título do Lembrete:</Text>
        <TextInput
          style={styles.inputReminder}
          placeholder="Escreva o título do lembrete..."
          value={reminderTitle}
          onChangeText={setReminderTitle}
        />

        <Text style={styles.label}>Data:</Text>
        <TouchableOpacity
          style={styles.pickerButton}
          onPress={() => setShowDatePicker(true)}
        >
          <Text>
            {date ? formatDate(date) : "Selecionar data"}
          </Text>

        </TouchableOpacity>

        {/* Date picker */}
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

        <View style={{ flex: 1 }} />

        <View style={styles.buttonRow}>
          {/* Cancel button */}
          <TouchableOpacity
            style={styles.btncancel}
            onPress={handleGoBack}
          >
            <Text style={styles.btnText}>Cancelar</Text>
            <Ionicons name="arrow-back" size={20} />
          </TouchableOpacity>
          
          {/* Save button */}
          <TouchableOpacity style={styles.btn} onPress={handleSave}>
            <Text style={styles.btnText}>Guardar Nota</Text>
            <Ionicons name="document-outline" size={20} />
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
