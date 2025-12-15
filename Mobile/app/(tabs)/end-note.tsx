import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { createNote } from "../../services/noteService";
import { InjuryRecord, fetchInjuryRecordById } from "../../services/injuryRecordService";
import { closeInjuryRecord } from "../../services/injuryRecordService";

import { Ionicons } from "@expo/vector-icons";

import { styles } from "../../css/end_note"



export default function AddNoteScreen() {
  const { injuryRecordID } = useLocalSearchParams<{ injuryRecordID: string }>();
  const router = useRouter();

  const [text, setText] = useState("");
  const [injury, setInjury] = useState<InjuryRecord | null>(null);
  const [loading, setLoading] = useState(true);

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
          
        <Text style={styles.label}>Tipo de Lesão: </Text>
        <Text style={styles.infoText}>{injury?.title}</Text>

        
        <Text style={styles.label}>Nome do Fisio: </Text>
        <Text style={styles.infoText}>{injury?.physioID}</Text>

        <Text style={styles.label}>Data de começo: </Text>
        <Text style={styles.infoText}>{injury?.dateStart}</Text>

        <Text style={styles.label}>Data de fim: </Text>
        <Text style={styles.infoText}>
          {injury?.dateEnd
            ? injury.dateEnd.split("T")[0]
            : nowDate}
        </Text>

        
  
        <Text style={styles.label}>Nota: </Text>

        <TextInput
          style={styles.input}
          multiline
          placeholder="Escreva a nota..."
          value={text}
          onChangeText={setText}
        />

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

