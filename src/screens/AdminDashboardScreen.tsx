import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Appbar, Card, Text, Title, Paragraph, ActivityIndicator } from 'react-native-paper';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import api from '../services/api';

type Props = NativeStackScreenProps<RootStackParamList, 'AdminDashboard'>;

export default function AdminDashboardScreen({ route, navigation }: Props) {
  const { user } = route.params;
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/stats')
      .then(res => setStats(res.data))
      .catch(err => console.log(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Title style={styles.greeting}>Welcome, {user.name}!</Title>
        <Paragraph>Role: {user.role} | ID: {user.badgeId}</Paragraph>

        {loading ? (
          <ActivityIndicator animating={true} style={styles.loader} />
        ) : stats ? (
          <View style={styles.grid}>
            <Card style={styles.card}>
              <Card.Content>
                <Title>{stats.totalCases}</Title>
                <Paragraph>Total Cases</Paragraph>
              </Card.Content>
            </Card>
            <Card style={styles.card}>
              <Card.Content>
                <Title>{stats.activeCases}</Title>
                <Paragraph>Active Cases</Paragraph>
              </Card.Content>
            </Card>
            <Card style={styles.card}>
              <Card.Content>
                <Title>{stats.pendingReview}</Title>
                <Paragraph>Pending Review</Paragraph>
              </Card.Content>
            </Card>
            <Card style={styles.card}>
              <Card.Content>
                <Title>{stats.officersDeployed}</Title>
                <Paragraph>Officers Deployed</Paragraph>
              </Card.Content>
            </Card>
          </View>
        ) : (
          <Text>Failed to load statistics.</Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F6F9' },
  scroll: { padding: 16 },
  greeting: { fontSize: 24, fontWeight: 'bold', marginTop: 16 },
  loader: { marginTop: 40 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  card: {
    width: '48%',
    marginBottom: 16,
    elevation: 4,
  }
});
