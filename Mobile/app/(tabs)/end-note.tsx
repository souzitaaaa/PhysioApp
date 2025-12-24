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

  // Nota
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

  // 🔹 Reset de todos os campos
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

  // 🔹 Limpar tudo ao sair do ecrã
  useFocusEffect(
    useCallback(() => {
      return () => {
        resetForm();
      };
    }, [resetForm])
  );

  // 🔹 Buscar lesão
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

  // 🔹 Salvar nota final com validação
  async function handleSave() {
    if (!injuryRecordID) return;

    // 🔴 Nota obrigatória
    if (text.trim() === "") {
      alert("A nota final é obrigatória.");
      return;
    }

    // 🔴 Ver se o lembrete foi iniciado
    const reminderTouched =
      reminderTitle.trim() !== "" || date || timeStart || timeEnd;

    // 🔴 Se começou a preencher lembrete, todos os campos são obrigatórios
    if (reminderTouched) {
      if (reminderTitle.trim() === "" || !date || !timeStart || !timeEnd) {
        alert("Preencha todos os campos.");
        return;
      }
    }

    try {
      // ✅ Criar nota
      await createNote(Number(injuryRecordID), text);

      // ✅ Criar lembrete apenas se estiver completo
      if (reminderTouched) {
        // Aqui podes chamar createReminder se necessário
        // await createReminder({
        //   title: reminderTitle,
        //   date: formatDate(date!),
        //   timeStart: formatTime(timeStart!),
        //   timeEnd: formatTime(timeEnd!),
        //   injuryRecordID: Number(injuryRecordID),
        // });
      }

      // ✅ Fechar lesão
      await closeInjuryRecord(Number(injuryRecordID), nowISO);

      resetForm();
      router.replace({
      pathname: "/historical",
      params: {
        athleteID,
        athleteName,
      },
    });
    } catch (error) {
      console.log("Erro ao guardar nota final:", error);
    }
  }

  function handleGoBack() {
    resetForm();
    router.replace({
      pathname: "/historical",
      params: {
        athleteID,
        athleteName,
      },
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

        <Text style={styles.titleReminder}>Lembrete</Text>

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
          <View style={{ flex: 1, marginRight: 5 }}>
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
                  : "Selecionar Início"}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={{ flex: 1, marginLeft: 5 }}>
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
                  : "Selecionar Fim"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

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
