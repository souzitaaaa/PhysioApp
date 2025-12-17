import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { createNote } from "../../services/noteService";
import { InjuryRecord, fetchInjuryRecordById } from "../../services/injuryRecordService";
import { closeInjuryRecord } from "../../services/injuryRecordService";
import DateTimePicker from "@react-native-community/datetimepicker";

import { Ionicons } from "@expo/vector-icons";

import { styles } from "../../css/end_note"



export default function AddNoteScreen() {
  const { injuryRecordID } = useLocalSearchParams<{ injuryRecordID: string }>();
  const router = useRouter();

  const [text, setText] = useState("");
  const [injury, setInjury] = useState<InjuryRecord | null>(null);
  const [loading, setLoading] = useState(true);


  const [reminderTitle, setReminderTitle] = useState("");
  const [date, setDate] = useState<Date | null>(null);
  const [timeStart, setTimeStart] = useState<Date | null>(null);
  const [timeEnd, setTimeEnd] = useState<Date | null>(null);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const nowISO = new Date().toISOString();
  const nowDate = nowISO.split("T")[0];


  // Buscar o registo da lesão
  async function loadInjury() {
    if (!injuryRecordID) return;

    const result = await fetchInjuryRecordById(Number(injuryRecordID));
    setInjury(result);
    setLoading(false);
  }

  useEffect(() => {
    loadInjury();
  }, []);
  

  async function handleSave() {
  if (!injuryRecordID) return;

  try {
    // 1. Criar nota
    await createNote(Number(injuryRecordID), text);

    // 2. Fechar lesão com a MESMA data
    await closeInjuryRecord(Number(injuryRecordID), nowISO);

    router.push("/historical");
  } catch (error) {
    console.log("Erro ao guardar nota:", error);
  }
}



  function handGoBack() {

    router.push("/historical");
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
      <Text style={styles.title}>Adicionar Nota</Text>

      <View style={styles.card}>
        <Text style={styles.titleHistorical}>Histórico</Text>

        <Text style={styles.label}>Tipo de Lesão: </Text>
        <Text style={styles.infoText}>{injury?.title}</Text>

        
        <Text style={styles.label}>Nome do Fisio: </Text>
        <Text style={styles.infoText}>{injury?.physioID}</Text>

        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 10 }}>
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


        
  
        <Text style={styles.label}>Nota: </Text>

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

        <Text style={styles.label}>Hora de Início e Fim:</Text>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <TouchableOpacity
            style={[styles.pickerButton, { flex: 1, marginRight: 5 }]}
            onPress={() => setShowStartPicker(true)}
          >
            <Text>
              {timeStart
                ? timeStart.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "Selecionar início"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.pickerButton, { flex: 1, marginLeft: 5 }]}
            onPress={() => setShowEndPicker(true)}
          >
            <Text>
              {timeEnd
                ? timeEnd.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "Selecionar fim"}
            </Text>
          </TouchableOpacity>
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

        {/* Botão */}
        <View style={styles.buttonRow}>

        <TouchableOpacity style={styles.btncancel} onPress={handGoBack}>
            <Text style={styles.btnText}>Cancelar</Text>
            <Ionicons name="arrow-back" size={20} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={handleSave}>
          <Text style={styles.btnText}>Guardar Nota</Text>
          <Ionicons name="document-outline" size={20} color="#000" />
        </TouchableOpacity>
        </View>

      </View>
    </ScrollView>
  );
}

