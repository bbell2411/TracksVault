// app/PatchAccount.jsx
import { View, Text, TextInput, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useUser } from './context/UserContext';
import { useState } from 'react';
import { patchEmail } from '../utils/api';

export default function PatchAccount() {
    const { user, setUser } = useUser()
    const { mode } = useLocalSearchParams()
    const router = useRouter()
    const [isloading, setIsLoading] = useState(false)

    const [newUsername, setNewUsername] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
    const [newEmail, setNewEmail] = useState('');


    if (!user) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#121212' }}>
                <Text style={{ color: '#fff' }}>Loading user data...</Text>
            </View>
        )
    }

    const handleEmail = () => {
        if (newEmail.trim() === '') {
            alert('Please enter a new email address.')
            return;
        }
        if (newEmail === user.email) {
            alert('This is already your current email address.')
            return;
        }
        if (!newEmail.includes('@')) {
            alert('Please enter a valid email address.')
            return;
        }
        setIsLoading(true)
        patchEmail(newEmail, user.username)
            .then(({ updated_user }) => {
                alert('Email updated successfully!')
                setUser(updated_user)
                setNewEmail('')
                router.replace("/Profile")

            })
            .catch((err) => {
                console.error(err)
                alert("Something went wrong while updating your email.")
            })
            .finally(() => {
                setIsLoading(false)
            })

    }
    if (isloading) return <ActivityIndicator size="large" color="#ccc" style={styles.loader} />

    return (
        <View style={{
            flex: 1,
            backgroundColor: '#121212',
            padding: 20,
        }}>
            <TouchableOpacity onPress={() => router.back()} style={styles.back}>
                <Text style={{ color: '#fff', fontSize: 18 }}>←</Text>
            </TouchableOpacity>
            {mode === 'email' && (
                <div style={{ color: '#fff', fontSize: 70, textAlign: 'center', justifyContent: 'center', border: '1px solid #fff', padding: 20, borderRadius: 10 }}>
                    <Text style={{ color: '#fff', fontSize: 30, fontWeight: 800 }}>Change Email</Text>
                    <br />
                    <Text style={{ color: '#fff', fontSize: 25, fontWeigh: 700 }}>Current Email:  </Text>
                    <Text style={{ color: '#fff', fontSize: 20, fontWeigh: 300 }}>{user.email}</Text>
                    <br />
                    <Text style={{ color: '#fff', fontSize: 25, fontWeigh: 700 }}>Enter New Email: </Text>
                    <TextInput
                        placeholder="New Email"
                        style={{ backgroundColor: 'darkgrey', padding: 5, marginTop: 40, borderRadius: 5 }}
                        onChangeText={setNewEmail} />
                    <TouchableOpacity style={styles.backButton} onPress={handleEmail}>
                        <Text style={styles.backButtonText}>Update Email</Text>
                    </TouchableOpacity>
                </div>
            )}
            {mode === 'username' && (
                <>
                    <Text style={{ color: '#fff', fontSize: 18 }}>Change Username</Text>
                    <TextInput placeholder="New Username" style={{ backgroundColor: '#fff', padding: 10, marginTop: 10 }} />
                </>
            )}
            {mode === 'password' && (
                <>
                    <Text style={{ color: '#fff', fontSize: 18 }}>Change Password</Text>
                    <TextInput placeholder="New Password" secureTextEntry style={{ backgroundColor: '#fff', padding: 10, marginTop: 10 }} />
                </>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    backButton: {
        position: 'absolute',
        top: 243,
        left: 660,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 10,
        zIndex: 10,
    },

    backButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    loader: {
        marginTop: 10,
    },
    back: {
        position: 'absolute',
        top: 30,
        left: 30,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        zIndex: 10,
      },
})

