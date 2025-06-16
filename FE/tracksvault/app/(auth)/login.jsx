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
                router.replace('/')
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
          <View style={styles.formBox}>
            <Text style={styles.header}>Login</Text>
            <TextInput
              placeholder="Username"
              value={username}
              onChangeText={setUsername}
              style={styles.input}
              placeholderTextColor="#aaa"
              autoCapitalize="none"
            />
            <TextInput
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              style={styles.input}
              placeholderTextColor="#aaa"
              secureTextEntry
            />
            <View style={styles.buttonContainer}>
              <Button title="Login" onPress={handleLogin} color="#00FFFF" />
            </View>
          </View>
        </View>
      );
    }
    
    const styles = StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: '#121212', 
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
      },
      formBox: {
        width: '90%',
        maxWidth: 500,
        padding: 30,
        backgroundColor: '#1E1E1E',
        borderRadius: 15,
        borderWidth: 2,
        borderColor: '#7FFFD4',  
        shadowColor: '#4CAF50',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.4,
        shadowRadius: 10,
        elevation: 8, 
      },
      header: {
        fontSize: 28,
        fontWeight: '700',
        color: '#7FFFD4',
        marginBottom: 25,
        textAlign: 'center',
      },
      input: {
        backgroundColor: '#2A2A2A',
        color: '#eee',
        paddingHorizontal: 15,
        paddingVertical: 12,
        borderRadius: 8,
        marginBottom: 18,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#333',
      },
      buttonContainer: {
        marginTop: 10,
        borderRadius: 8,
        overflow: 'hidden', 
      },
    });
