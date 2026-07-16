import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Text, Title, Paragraph, ActivityIndicator, List, Avatar } from 'react-native-paper';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import api from '../services/api';

type Props = NativeStackScreenProps<RootStackParamList, 'OfficerDashboard'>;

export default function OfficerDashboardScreen({ route, navigation }: Props) {
  const { user } = route.params;
  const [cases, setCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/cases')
      .then(res => setCases(res.data))
      .catch(err => console.log(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Title style={styles.greeting}>Hello, {user.name}!</Title>
        <Paragraph style={styles.subtitle}>Your Active Assignments</Paragraph>

        {loading ? (
          <ActivityIndicator animating={true} style={styles.loader} />
        ) : (
          cases.map((c, index) => (
            <Card key={index} style={styles.card}>
              <Card.Title 
                title={c.title} 
                subtitle={`ID: ${c.id} • ${c.date}`} 
                left={(props) => <Avatar.Icon {...props} icon="folder" style={styles.iconStyle} />} 
              />
              <Card.Content>
                <Paragraph style={styles.status}>Status: {c.status}</Paragraph>
              </Card.Content>
            </Card>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F6F9' },
  scroll: { padding: 16 },
  greeting: { fontSize: 24, fontWeight: 'bold' },
  subtitle: { color: '#64748B', marginBottom: 20 },
  loader: { marginTop: 40 },
  card: { marginBottom: 12, backgroundColor: '#FFFFFF', elevation: 2 },
  iconStyle: { backgroundColor: '#ECA05C' },
  status: { fontWeight: 'bold', color: '#D32F2F', marginTop: 8 }
});
