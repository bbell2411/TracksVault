
import { View, Text, TextInput, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useUser } from './context/UserContext';
import { useState } from 'react';
import { patchEmail, patchPassword, patchUsername } from '../utils/api';

export default function PatchAccount() {
    const { user, setUser } = useUser()
    const { mode } = useLocalSearchParams()
    const router = useRouter()
    const [isloading, setIsLoading] = useState(false)

    const [newEmail, setNewEmail] = useState('')

    const [newUsername, setNewUsername] = useState('')

    const [oldPassword, setOldPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')


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

    const handleUsername = () => {
        if (newUsername.trim() === '') {
            alert('Please enter a new username.')
            return;
        }
        if (newUsername === user.username) {
            alert('This is already your current username.')
            return;
        }
        setIsLoading(true)
        patchUsername(user.username, newUsername)
            .then(({ updated_user }) => {
                alert('username updated successfully!')
                setUser(updated_user)
                setNewUsername('')
                router.replace("/Profile")

            })
            .catch((err) => {
                console.error(err)
                alert("Something went wrong while updating your username.")
            })
            .finally(() => {
                setIsLoading(false)
            })
    }
    const handlePassword = () => {
        if (oldPassword.trim() === '' || newPassword.trim() === '') {
            alert('Please enter your password.')
            return;
        }
        setIsLoading(true)
        patchPassword(oldPassword, newPassword, user.username)
            .then(() => {
                alert('Password updated successfully!')
                setNewPassword('')
                setOldPassword('')
                router.replace("/Profile")
            })
            .catch((err) => {
                console.error(err)
                alert("incorrect old password.")
            })
            .finally(() => {
                setIsLoading(false)
            })
    }
    if (isloading) return <View style={styles.container}> <ActivityIndicator size="large" color="#ccc" style={styles.loader} /> </View>

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
                <View style={{
                    backgroundColor: '#1e1e1e',
                    padding: 24,
                    borderRadius: 16,
                    borderWidth: 1,
                    borderColor: '#fff',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: 40,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 4,
                    elevation: 5,
                }}>

                    <Text style={{ color: '#aaa', fontSize: 20, fontWeight: '600', marginBottom: 4 }}>
                        Current Email:
                    </Text>
                    <Text style={{ color: '#eee', fontSize: 18, fontWeight: '300', marginBottom: 20 }}>
                        {user.email}
                    </Text>

                    <Text style={{ color: '#aaa', fontSize: 20, fontWeight: '600', marginBottom: 10 }}>
                        Enter New Email:
                    </Text>

                    <TextInput
                        placeholder="New Email"
                        placeholderTextColor="#444"
                        value={newEmail}
                        onChangeText={setNewEmail}
                        style={{
                            width: '100%',
                            backgroundColor: '#333',
                            color: '#fff',
                            paddingVertical: 10,
                            paddingHorizontal: 12,
                            borderRadius: 8,
                            marginBottom: 20,
                            fontSize: 16,
                        }}
                    />

                    <TouchableOpacity
                        onPress={handleEmail}
                        style={{
                            backgroundColor: '#1E90FF',
                            paddingVertical: 12,
                            paddingHorizontal: 20,
                            borderRadius: 8,
                            alignItems: 'center',
                        }}
                    >
                        <Text style={{
                            color: '#fff',
                            fontSize: 16,
                            fontWeight: '600',
                        }}>
                            Update Email
                        </Text>
                    </TouchableOpacity>
                </View>

            )}

            {mode === 'username' && (
                <View style={{
                    backgroundColor: '#1e1e1e',
                    padding: 20,
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: '#fff',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: 40,
                }}>

                    <Text style={{
                        color: '#aaa',
                        fontSize: 20,
                        fontWeight: '600',
                        marginBottom: 10,
                    }}>
                        Change Username
                    </Text>

                    <TextInput
                        placeholder="New Username"
                        placeholderTextColor="#444"
                        value={newUsername}
                        onChangeText={setNewUsername}
                        style={{
                            width: '100%',
                            backgroundColor: '#333',
                            color: '#fff',
                            paddingVertical: 10,
                            paddingHorizontal: 12,
                            borderRadius: 8,
                            marginBottom: 20,
                            fontSize: 16,
                        }}
                    />
                    <TouchableOpacity
                        onPress={handleUsername}
                        style={{
                            backgroundColor: '#1E90FF',
                            paddingVertical: 12,
                            paddingHorizontal: 20,
                            borderRadius: 8,
                            alignItems: 'center',
                        }}
                    >
                        <Text style={{
                            color: '#fff',
                            fontSize: 16,
                            fontWeight: '600',
                        }}>
                            Update Username
                        </Text>
                    </TouchableOpacity>

                </View>
            )}

            {mode === 'password' && (
                <View style={{
                    backgroundColor: '#1e1e1e',
                    padding: 20,
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: '#fff',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: 40,
                }}>

                    <Text style={{
                        color: '#fff',
                        fontSize: 25,
                        fontWeight: '700',
                        marginBottom: 10,
                    }}>
                        Enter New Password:
                    </Text>

                    <TextInput
                        placeholder="old Password"
                        placeholderTextColor="#444"
                        secureTextEntry
                        value={oldPassword}
                        onChangeText={setOldPassword}
                        style={{
                            width: '100%',
                            backgroundColor: '#333',
                            color: '#fff',
                            paddingVertical: 10,
                            paddingHorizontal: 12,
                            borderRadius: 8,
                            marginBottom: 20,
                            fontSize: 16,
                        }}
                    />
                    <TextInput
                        placeholder="New Password"
                        placeholderTextColor="#444"
                        secureTextEntry
                        value={newPassword}
                        onChangeText={setNewPassword}
                        style={{
                            width: '100%',
                            backgroundColor: '#333',
                            color: '#fff',
                            paddingVertical: 10,
                            paddingHorizontal: 12,
                            borderRadius: 8,
                            marginBottom: 20,
                            fontSize: 16,
                        }}
                    />

                    <TouchableOpacity
                        style={{
                            backgroundColor: '#1E90FF',
                            paddingVertical: 12,
                            paddingHorizontal: 20,
                            borderRadius: 8,
                            alignItems: 'center',
                        }}
                        onPress={handlePassword}>
                        <Text style={{
                            color: '#fff',
                            fontSize: 16,
                            fontWeight: '600',
                        }}>Update Password</Text>
                    </TouchableOpacity>
                </View>
            )}

        </View>
    )
}

const styles = StyleSheet.create({
    loader: {
        marginTop: 10,
    },
    back: {
        position: 'absolute',
        top: 70,
        left: 30,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        zIndex: 10,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#121212',
    },
})

