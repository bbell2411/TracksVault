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
import { getArtist, getSong } from "../../api"
import playButton from "../../../assets/images/playButton.png"


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

    //     let isMounted = true
    //     let soundObject = null

    //     const playSound = async () => {
    //         try {
    //             const { sound } = await Audio.Sound.createAsync(
    //                 { uri: song.link },
    //                 { shouldPlay: true }
    //             )

    //             if (isMounted) {
    //                 soundObject = sound
    //                 setSound(sound)
    //             }
    //         } catch (err) {
    //             if (isMounted) setIsError(true)
    //         }
    //     }

    //     playSound()

    //     return () => {
    //         isMounted = false
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
                <TouchableOpacity
                    onPress={() => {
                        if (sound) {
                            sound.pauseAsync()
                        }
                    }}
                    style={{ marginTop: 20 }}
                >
                    {sound ? (
                        <Text style={{ color: '#fff', fontSize: 18 }}>Pause</Text>
                    ) : (
                        <Image
                            source={playButton}
                            style={{ width: 40, height: 40, tintColor: 'white' }}
                        />
                    )}
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
//make play button back button next song button and repeat button and shuffle button