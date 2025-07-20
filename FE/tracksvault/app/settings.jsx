import { ScrollView, StyleSheet, TouchableOpacity, View, Text, Alert, Platform } from "react-native"
import { useRouter } from 'expo-router';
import { useUser } from './context/UserContext';

export default function settings() {
    const { setUser } = useUser()
    const router = useRouter()


    const handleLogout = () => {
        setUser(null)
        router.replace('/login')
    }
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Settings</Text>
            </View>
            <ScrollView style={styles.settingsList}>
                <TouchableOpacity style={styles.settingItem} onPress={() => console.log('Profile Settings')}>
                    <Text style={styles.settingText}>Profile Settings</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.settingItem} onPress={() => router.push('/PatchAccount')}>
                    <Text style={styles.settingText}>Account Settings</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.settingItem} onPress={() => console.log('Privacy Settings')}>
                    <Text style={styles.settingText}>Privacy Settings</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.settingItem} onPress={() => console.log('Notification Settings')}>
                    <Text style={styles.settingText}>Notification Settings</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.settingItem} onPress={() => {
                    if (Platform.OS === 'web') {
                        const confirmed = window.confirm('Are you sure you want to log out?');
                        if (confirmed) handleLogout();
                    }
                    else {
                        Alert.alert('Logout', 'Are you sure you want to log out?', [
                            { text: 'Cancel', style: 'cancel' },
                            {
                                text: 'Logout', onPress: () => {
                                    handleLogout()
                                }
                            }
                        ])
                    }
                }}>
                    <Text style={{
                        color: '#8b0000',
                        fontSize: 18,
                        fontWeight: '900',
                    }}>LOG OUT</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: 80,
        paddingHorizontal: 16,
    },
    header: {
        width: '100%',
        height: 60,
        backgroundColor: '#1e1e1e',
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomColor: '#66CDAA',
        borderBottomWidth: 0.5,
        shadowColor: '#66CDAA',
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 1 },
        shadowRadius: 4,
    },
    headerText: {
        color: '#FFFFFF',
        fontSize: 22,
        fontWeight: 'bold',
        letterSpacing: 1.2,
    },
    settingsList: {
        width: '100%',
        marginTop: 20,
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
});
