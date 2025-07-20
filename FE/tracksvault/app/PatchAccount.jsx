import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useUser } from './context/UserContext';
import { useRouter } from 'expo-router';

export default function PatchAccount() {
  const router = useRouter()
  return (
    <View style={{
      flex: 1,
      backgroundColor: '#121212',
    }}>

      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Text style={{ color: '#fff', fontSize: 18 }}>←</Text>
      </TouchableOpacity>
      <Text style={{ color: '#ffffff', fontSize: 30, fontWeight: 300, textAlign: 'center', marginTop: 20 }}>
        Update your account details
      </Text>

      <TouchableOpacity style={styles.settingItem} onPress={() => router.push({ pathname: '/PatchMode', params: { mode: 'email' } })}>
        <Text style={styles.settingText}>Change Email</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.settingItem} onPress={() => router.push({ pathname: '/PatchMode', params: { mode: 'username' } })}>
        <Text style={styles.settingText}>Change Username</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.settingItem} onPress={() => router.push({ pathname: '/PatchMode', params: { mode: 'email' } })}>
        <Text style={styles.settingText}>Change Password</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  backButton: {
    position: 'absolute',
    top: 10,
    left: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    zIndex: 10,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: '#1A1A1A',
    marginBottom: 12,
    shadowColor: '#66CDAA',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
  },
  settingText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '500',
  },
})