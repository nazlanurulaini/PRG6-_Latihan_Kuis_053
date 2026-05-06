import React, { useState, useCallback } from 'react';
import {
  View, Text, TouchableOpacity,
  FlatList, StyleSheet,
  ActivityIndicator, Alert
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

const SERVER = 'http://10.1.13.32:8080';

export default function ListScreen({ navigation }) {
  const [dataKontak, setDataKontak] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const ambilData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${SERVER}/api/phonebooks`);
      const hasil = await response.json();
      setDataKontak(hasil);
    } catch (err) {
      Alert.alert('Error', 'Gagal mengambil data dari server');
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      ambilData();
    }, [])
  );

  const tampilItem = ({ item, index }) => {
    const sudahMenikah = item.status === '1';

    return (
      <TouchableOpacity
        style={styles.item}
        onPress={() => navigation.navigate('Detail', { contact: item })}
      >
        <Text style={styles.number}>{index + 1}.</Text>
        <View style={styles.info}>
          <Text style={styles.name}>{item.firstName}</Text>
          <Text style={styles.phone}>{item.phoneNumber}</Text>
        </View>
        <View style={[styles.badge, sudahMenikah ? styles.married : styles.single]}>
          <Text style={styles.badgeText}>{sudahMenikah ? 'M' : 'S'}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Phonebooks Apps</Text>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => navigation.navigate('Detail', { contact: null })}
        >
          <Text style={styles.addBtnText}>+ New</Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" color="#007bff" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
            data={dataKontak}
            keyExtractor={(item) => item.idContact.toString()}
            renderItem={tampilItem}
            contentContainerStyle={{ paddingBottom: 20, paddingHorizontal: 0 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  addBtn: {
    backgroundColor: '#007bff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  addBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginTop: 6,
    marginHorizontal: 0, 
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 0,  
    elevation: 2,
  },
  number: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    width: 30,
  },
  info: {
    flex: 1,
    marginLeft: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
  },
  phone: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  badge: {
    width: 36,
    height: 36,
    borderRadius: 4,  
    justifyContent: 'center',
    alignItems: 'center',
  },
  married: {
    backgroundColor: '#ffc107',
  },
  single: {
    backgroundColor: '#28a745',
  },
  badgeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});