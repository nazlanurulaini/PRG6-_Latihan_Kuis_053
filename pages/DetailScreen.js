import React, { useState } from 'react';
import {
  View, Text, ScrollView,
  TextInput, TouchableOpacity,
  StyleSheet, Alert
} from 'react-native';

const URL_SERVER = 'http://10.1.13.32:8080';

export default function DetailScreen({ route, navigation }) {
  const contact = route.params?.contact || null;
  const isEdit = contact !== null;

  const [firstName, setFirstName] = useState(contact?.firstName || '');
  const [lastName, setLastName] = useState(contact?.lastName || '');
  const [phoneNumber, setPhoneNumber] = useState(contact?.phoneNumber || '');
  const [birthDate, setBirthDate] = useState(contact?.birthDate || '');
  const [address, setAddress] = useState(contact?.address || '');
  const [status, setStatus] = useState(contact?.status || '');

  const cekInput = () => {
    if (!firstName) {
      Alert.alert('Validasi', 'First Name tidak boleh kosong!');
      return false;
    }
    return true;
  };

  const handleCreate = async () => {
    if (!cekInput()) return;

    const payload = { firstName, lastName, birthDate, phoneNumber, status, address };

    try {
      const res = await fetch(`${URL_SERVER}/api/phonebooks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        Alert.alert('Sukses', 'Data berhasil ditambahkan!');
        navigation.goBack();
      } else {
        Alert.alert('Error', 'Gagal menambahkan data');
      }
    } catch (e) {
      Alert.alert('Error', 'Tidak dapat terhubung ke server');
    }
  };

  const handleUpdate = async () => {
    if (!cekInput()) return;

    const payload = { firstName, lastName, birthDate, phoneNumber, status, address };
    const id = contact.idContact;

    try {
      const res = await fetch(`${URL_SERVER}/api/phonebooks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        Alert.alert('Sukses', 'Data berhasil diupdate!');
        navigation.goBack();
      } else {
        Alert.alert('Error', `Gagal mengupdate data: ${res.status}`);
      }
    } catch (e) {
      Alert.alert('Error', 'Tidak dapat terhubung ke server');
    }
  };

  const handleDelete = () => {
    const id = contact.idContact;
    const nama = `${firstName} ${lastName}`;

    Alert.alert(
      'Konfirmasi Hapus',
      `Yakin ingin menghapus "${nama}"?`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: async () => {
            try {
              const res = await fetch(`${URL_SERVER}/api/phonebooks/${id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
              });

              if (res.ok || res.status === 204) {
                Alert.alert('Sukses', 'Data berhasil dihapus!');
                navigation.goBack();
              } else {
                Alert.alert('Error', `Gagal menghapus: ${res.status}`);
              }
            } catch (e) {
              Alert.alert('Error', 'Tidak dapat terhubung ke server: ' + e.message);
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <View style={styles.card}>
        <Text style={styles.label}>First Name</Text>
        <TextInput
          style={styles.input}
          value={firstName}
          onChangeText={setFirstName}
          placeholder="First Name"
        />

        <Text style={styles.label}>Last Name</Text>
        <TextInput
          style={styles.input}
          value={lastName}
          onChangeText={setLastName}
          placeholder="Last Name"
        />

        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={styles.input}
          value={phoneNumber}
          onChangeText={(val) => setPhoneNumber(val.replace(/[^0-9]/g, ''))}
          placeholder="Phone Number"
          keyboardType="numeric"
        />

        <Text style={styles.label}>Birth Date</Text>
        <TextInput
          style={styles.input}
          value={birthDate}
          onChangeText={setBirthDate}
          placeholder="YYYY-MM-DD"
        />

        <Text style={styles.label}>Address</Text>
        <TextInput
          style={styles.input}
          value={address}
          onChangeText={setAddress}
          placeholder="Address"
        />

        <Text style={styles.label}>Status</Text>
        <TextInput
          style={styles.input}
          value={status}
          onChangeText={(val) => setStatus(val.replace(/[^12]/g, ''))}
          placeholder="1 = Married, 2 = Single"
          keyboardType="numeric"
          maxLength={1}
        />

        {!isEdit ? (
          <TouchableOpacity style={styles.addBtn} onPress={handleCreate}>
            <Text style={styles.btnText}>+ Add Data</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.updateBtn} onPress={handleUpdate}>
              <Text style={styles.btnText}>Update</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
              <Text style={styles.btnText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 50,
  },
  backBtn: {
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  backText: {
    fontSize: 15,
    color: '#007bff',
  },
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 20,
    elevation: 2,
    marginBottom: 30,
  },
  label: {
    color: '#333',
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
    backgroundColor: '#fafafa',
  },
  addBtn: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 10,
  },
  updateBtn: {
    flex: 1,
    backgroundColor: '#ffc107',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  deleteBtn: {
    flex: 1,
    backgroundColor: '#dc3545',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});