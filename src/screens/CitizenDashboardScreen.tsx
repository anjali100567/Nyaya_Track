import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Text, Title, Paragraph, ActivityIndicator, Avatar, FAB } from 'react-native-paper';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import api from '../services/api';

type Props = NativeStackScreenProps<RootStackParamList, 'CitizenDashboard'>;

export default function CitizenDashboardScreen({ route, navigation }: Props) {
  const { user } = route.params;
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/citizen/reports')
      .then(res => setReports(res.data))
      .catch(err => console.log(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Title style={styles.greeting}>Welcome, {user.name}</Title>
        <Paragraph style={styles.subtitle}>Your Reported Incidents</Paragraph>

        {loading ? (
          <ActivityIndicator animating={true} style={styles.loader} />
        ) : reports.length === 0 ? (
          <View style={styles.emptyState}>
            <Text>You have no active reports.</Text>
          </View>
        ) : (
          reports.map((report, index) => (
            <Card key={index} style={styles.card}>
              <Card.Title 
                title={report.type} 
                subtitle={`Reported on: ${report.date}`} 
                left={(props) => <Avatar.Icon {...props} icon="alert-circle-outline" style={styles.iconStyle} />} 
              />
              <Card.Content>
                <Paragraph style={{ fontWeight: 'bold', color: report.status === 'Resolved' ? 'green' : '#D32F2F' }}>
                  Status: {report.status}
                </Paragraph>
                <Paragraph style={styles.description}>{report.description}</Paragraph>
              </Card.Content>
            </Card>
          ))
        )}
      </ScrollView>
      
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => console.log('Navigate to new report screen')}
        label="File Report"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F6F9' },
  scroll: { padding: 16, paddingBottom: 80 },
  greeting: { fontSize: 24, fontWeight: 'bold' },
  subtitle: { color: '#64748B', marginBottom: 20 },
  loader: { marginTop: 40 },
  emptyState: { alignItems: 'center', marginTop: 40 },
  card: { marginBottom: 16, backgroundColor: '#FFFFFF', elevation: 3 },
  iconStyle: { backgroundColor: '#8F0F1A' },
  description: { marginTop: 8, color: '#475569' },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#05183E',
  },
});
