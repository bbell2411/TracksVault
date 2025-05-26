import { useLocalSearchParams, useRouter } from "expo-router"
import { useEffect, useState } from "react"
import { LinearGradient } from 'expo-linear-gradient';
import {
    View,
    Text,
    StyleSheet,
    Image,
    Animated,
    Dimensions,
    TouchableOpacity,
} from 'react-native'
import { Audio } from 'expo-audio'
import MusicNoteLoading from "../../components/MusicNoteLoading"
import { getArtist, getSong } from "../../api";



export default function playSong() {
    const { songid } = useLocalSearchParams()
    const [song, setSong] = useState(null)
    const [artists, setArtists] = useState([])

    const [sound, setSound] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isError, setIsError] = useState(null)

    const router = useRouter()

    useEffect(() => {
        setIsLoading(true)
        getSong(songid)
            .then(({ song }) => setSong(song))
            .catch(() => setIsError(true))
            .finally(() => setIsLoading(false))
    }, [songid])

    useEffect(() => {
        if (!song) return
        setIsLoading(true)
        getArtist(song.artist)
            .then(({ artist }) => setArtists(artist))
            .catch(() => setIsError(true))
            .finally(() => setIsLoading(false))
    }, [song])
    // useEffect(() => {
    //     if (!song || !song.link) return

    //     let soundObject

    //     const playSound = async () => {
    //         const { sound } = await Audio.Sound.createAsync(
    //             { uri: song.link },
    //             { shouldPlay: true }
    //         )
    //         soundObject = sound
    //         setSound(sound)
    //     }

    //     playSound().catch(() => setIsError(true))

    //     return () => {
    //         if (soundObject) {
    //             soundObject.unloadAsync()
    //         }
    //     }
    // }, [song])

    if (isLoading) {
        return <MusicNoteLoading />
    }

    if (isError) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Error loading song</Text>
            </View>
        )
    }
    return (
        <LinearGradient
            colors={['#0a0a0a', '#66CDAA']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.background}
        >
              <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Text style={{ color: '#fff', fontSize: 18 }}>← Back</Text>
                </TouchableOpacity>
            <View style={styles.container}>
                <Image source={{ uri: song.image }} style={styles.coverImage} />
                <Text style={styles.songTitle}>{song.song_name}</Text>
                <Text style={styles.artistName}>{artists.artists_name}</Text>
                <TouchableOpacity onPress={() => sound ? sound.pauseAsync() : null}>
                    <Text style={{ color: '#fff', fontSize: 18, marginTop: 20 }}>
                        {sound ? 'Pause' : 'Play'}
                    </Text>
                </TouchableOpacity>
              
            </View>
        </LinearGradient>
    )
}
const styles = StyleSheet.create({
    background: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    coverImage: {
        width: 300,
        height: 300,
        borderRadius: 15,
        marginBottom: 20,
    },
    songTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#fff',
    },
    artistName: {
        fontSize: 18,
        color: '#aaa',
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
    errorContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    errorText: {
        color: 'red',
        fontSize: 18,
    },
})