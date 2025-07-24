import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput } from "react-native"
import { useUser } from "./context/UserContext"
import { useState } from "react"
import { useRouter } from "expo-router"
export default function ProfileSettings() {
    const { user } = useUser()
    const router = useRouter()

    const [bio, setbio] = useState('')
    const [birthday, setBirthday] = useState('')
    const [num, setNum] = useState('')
    console.log(user)
    if (!user) return
    const bdayRegex = /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-(19|20)\d\d$/
    const phoneRegex = /^\+?[1-9]\d{1,14}$/

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                <Text style={{ color: '#fff', fontSize: 18 }}>←</Text>
            </TouchableOpacity>

            <Image source={{ uri: user.avatar_url }} style={{ height: 300, width: 300, borderRadius: 5 }} />
            <Text style={{ color: "white", fontSize: 40 }}>{user.username}</Text>
            <TextInput style={styles.input}
                placeholder="Bio"
                placeholderTextColor="gray"
                value={bio}
                onChangeText={setbio}
            >
            </TextInput>
            <TextInput style={styles.input}
                placeholder="Birthday"
                placeholderTextColor="gray"
                value={birthday}
                onChangeText={setBirthday}
                textContentType="birthdate"
                keyboardType="numeric">
            </TextInput>
            <TextInput style={styles.input}
                placeholder="Phone Number"
                placeholderTextColor="gray"
                value={num}
                onChangeText={setNum}
                textContentType="telephoneNumber"
                keyboardType="phone-pad">
            </TextInput>
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
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        color: 'white',
        width: '100%',
        marginTop: 10
    }
})

//local storage
//functionaly and button handling logic