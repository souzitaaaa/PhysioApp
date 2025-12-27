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
  closeInjuryRecord,
} from "../../services/injuryRecordService";

import { createReminder } from "../../services/reminderService";

import { styles } from "../../css/end_note";

export default function EndNoteScreen() {
  const { injuryRecordID, athleteID, athleteName } = useLocalSearchParams<{
    injuryRecordID: string;
    athleteID: string;
    athleteName: string;
  }>();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [injury, setInjury] = useState<InjuryRecord | null>(null);

  // Nota final
  const [text, setText] = useState("");

  // Reminder
  const [reminderTitle, setReminderTitle] = useState("");
  const [date, setDate] = useState<Date | null>(null);
  const [timeStart, setTimeStart] = useState<Date | null>(null);
  const [timeEnd, setTimeEnd] = useState<Date | null>(null);

  // Pickers
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const nowISO = new Date().toISOString();
  const nowDate = nowISO.split("T")[0];

  const resetForm = useCallback(() => {
    setText("");
    setReminderTitle("");
    setDate(null);
    setTimeStart(null);
    setTimeEnd(null);

    setShowDatePicker(false);
    setShowStartPicker(false);
    setShowEndPicker(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      return () => resetForm();
    }, [resetForm])
  );

  useEffect(() => {
    async function loadInjury() {
      if (!injuryRecordID) return;
      const result = await fetchInjuryRecordById(Number(injuryRecordID));
      setInjury(result);
      setLoading(false);
    }
    loadInjury();
  }, [injuryRecordID]);

  function formatDate(date: Date) {
    return date.toISOString().split("T")[0];
  }

  function formatTime(date: Date) {
    return date.toTimeString().slice(0, 5);
  }

  async function handleSave() {
    if (!injuryRecordID) return;

    if (text.trim() === "") {
      alert("A nota final é obrigatória.");
      return;
    }

    const reminderTouched =
      reminderTitle.trim() !== "" || date || timeStart || timeEnd;

    if (reminderTouched) {
      if (reminderTitle.trim() === "" || !date || !timeStart || !timeEnd) {
        alert("Preencha todos os campos do lembrete.");
        return;
      }
    }

    try {
      await createNote(Number(injuryRecordID), text);

      if (reminderTouched) {
            const reminderPayload = {
              title: reminderTitle,
              date: formatDate(date!),
              timeStart: formatTime(timeStart!), 
              timeEnd: formatTime(timeEnd!),     
              injuryRecordID: Number(injuryRecordID), 
            };
      
      
            console.log("Payload do lembrete:", reminderPayload);
      
            const reminderData = await createReminder(reminderPayload);
            console.log("Reminder criado com sucesso:", reminderData);
          }

      if (reminderTouched) {
        // Se quiseres, podes chamar createReminder aqui
        // await createReminder({ ... })
      }

      await closeInjuryRecord(Number(injuryRecordID), nowISO);

      resetForm();
      router.replace({
        pathname: "/historical",
        params: { athleteID, athleteName },
      });
    } catch (error) {
      console.log("Erro ao guardar nota final:", error);
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
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Adicionar Nota Final</Text>

      <View style={styles.card}>
        <Text style={styles.titleHistorical}>Histórico</Text>

        <Text style={styles.label}>Tipo de Lesão:</Text>
        <Text style={styles.infoText}>{injury?.title}</Text>

        <Text style={styles.label}>Nome do Fisio:</Text>
        <Text style={styles.infoText}>{injury?.userID}</Text>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 10,
          }}
        >
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Data de começo:</Text>
            <Text style={styles.infoText}>{injury?.dateStart}</Text>
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Data de fim:</Text>
            <Text style={styles.infoText}>
              {injury?.dateEnd ? injury.dateEnd.split("T")[0] : nowDate}
            </Text>
          </View>
        </View>

        <Text style={styles.label}>Nota:</Text>
        <TextInput
          style={styles.input}
          multiline
          placeholder="Escreva a nota..."
          value={text}
          onChangeText={setText}
        />

        {/* Lembrete com botão único Limpar */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 10,
          }}
        >
          <Text style={styles.titleReminder}>Lembrete</Text>

          {(reminderTitle || date || timeStart || timeEnd) && (
            <TouchableOpacity
              onPress={() => {
                setReminderTitle("");
                setDate(null);
                setTimeStart(null);
                setTimeEnd(null);
              }}
            >
              <Text style={{ color: "red", fontSize: 12 }}>Limpar Lembrete</Text>
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

        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          {/* Hora de Início */}
          <View style={{ flex: 1, marginRight: 5 }}>
            <Text style={styles.label}>Hora de Início:</Text>
            <TouchableOpacity
              style={styles.pickerButton}
              onPress={() => setShowStartPicker(true)}
            >
              <Text>
                {timeStart
                  ? timeStart.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false })
                  : "Selecionar Início"}
              </Text>
            </TouchableOpacity>

            {showStartPicker && (
              <DateTimePicker
                value={timeStart || new Date()}
                mode="time"
                is24Hour={true}
                onChange={(_, selectedDate) => {
                  setShowStartPicker(false);
                  if (selectedDate) {
                    setTimeStart(selectedDate);
                    setTimeEnd(null); // limpa hora de fim
                  }
                }}
              />
            )}
          </View>

          {/* Hora de Fim */}
          <View style={{ flex: 1, marginLeft: 5 }}>
            <Text style={styles.label}>Hora de Fim:</Text>
            <TouchableOpacity
              style={styles.pickerButton}
              onPress={() => {
                if (!timeStart) {
                  alert("Selecione primeiro a hora de início.");
                  return;
                }
                setShowEndPicker(true);
              }}
            >
              <Text>
                {timeEnd
                  ? timeEnd.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false })
                  : "Selecionar Fim"}
              </Text>
            </TouchableOpacity>

            {showEndPicker && (
              <DateTimePicker
                value={timeEnd || timeStart!}
                mode="time"
                is24Hour={true}
                onChange={(_, selectedDate) => {
                  setShowEndPicker(false);
                  if (!selectedDate || !timeStart) return;

                  const maxEndTime = new Date(timeStart.getTime() + 60 * 60 * 1000);
                  if (selectedDate > maxEndTime) {
                    alert("A hora de fim não pode ser mais de 1 hora após a hora de início.");
                    setTimeEnd(null);
                    return;
                  }

                  setTimeEnd(selectedDate);
                }}
              />
            )}
          </View>
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.btncancel} onPress={handleGoBack}>
            <Text style={styles.btnText}>Cancelar</Text>
            <Ionicons name="arrow-back" size={20} color="#000" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.btn} onPress={handleSave}>
            <Text style={styles.btnText}>Guardar Nota Final</Text>
            <Ionicons name="document-outline" size={20} color="#000" />
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
