import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { login } from '@/utils/api'
import { useUser } from '../context/UserContext'
import WelcomeLoader from '../components/WelcomeLoader'

export default function LoginScreen() {
    const { setUser } = useUser()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')


    const [isLoading, setIsLoading] = useState(null)
    const [isError, setIsError] = useState(null)

    const router = useRouter()

    const handleLogin = () => {
        if (!username.trim() || !password.trim()) {
            Alert.alert("Input Error", "Both fields are required.")
            return;
        }
        setIsLoading(true)
        login(username, password)
            .then(({ user }) => {
                setUser(user)
                router.push('/')
            })
            .catch((err) => {
                const status = err?.response?.status || err?.status;
                if (status === 404) {
                  Alert.alert("Login Error", "Invalid username or password.")
                } else {
                  Alert.alert("Login Failed", "Something went wrong. Please try again.")
                  setIsError(true)
                }
              })
            .finally(() => setIsLoading(false))
    }


      if (isLoading) {
        return <WelcomeLoader />
      }

    if (isError) {
        return (
            <View style={styles.center}>
                <Text>Something went wrong.</Text>
            </View>
        )
    }
    return (
        <View style={styles.container}>
            <Text style={styles.header}>Login</Text>
            <TextInput
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
                style={styles.input}
                placeholderTextColor="#aaa"
            />
            <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                style={styles.input}
                placeholderTextColor="#aaa"
                secureTextEntry
            />
            <Button title="Login"
                onPress={handleLogin}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#0a0a0a'
    },
    header: {
        fontSize: 24,
        marginBottom: 20,
        color: 'white',
        alignSelf: 'center',
    },
    input: {
        backgroundColor: '#1a1a1a',
        padding: 12,
        borderRadius: 8,
        marginBottom: 12,
        color: 'white'
    }
});
