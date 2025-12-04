import { StyleSheet, View, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import { supabase } from '../../scripts/supabase';

type Email = {
  emailID: number;
  sender: string;
  dateSended: string;
  subject: string;
};

export default function NotificationScreen() {
  const [emails, setEmails] = useState<Email[]>([]);

  useEffect(() => {
    fetchEmails();
  }, []);

  async function fetchEmails() {
    const { data, error } = await supabase
      .from<Email>('t_email')
      .select('*');

    if (error) {
      console.log('Erro ao carregar emails:', error);
      return;
    }

    setEmails(data || []);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notificações</Text>

      {emails.map((item) => (
        <View key={item.emailID} style={styles.card}>

          <View style={styles.row}>
            <Text style={styles.sender}>{item.sender}</Text>
            <Text style={styles.date}>{item.dateSended}</Text>
          </View>

          <Text style={styles.subject} numberOfLines={3} ellipsizeMode="tail">
            {item.subject}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    paddingTop: 40,
    paddingLeft: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 16,
    padding: 12,
    marginHorizontal: 16,
    marginTop: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  sender: {
    fontSize: 16,
    fontWeight: '600',
  },
  date: {
    fontSize: 14,
    color: '#666',
  },
  subject: {
    fontSize: 15,
    color: '#333',
  },
});
