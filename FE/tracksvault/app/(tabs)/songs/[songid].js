import { useLocalSearchParams, useRouter } from "expo-router"
import { useEffect, useRef, useState } from "react"
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
import { Audio } from 'expo-av';
import MusicNoteLoading from "../../components/MusicNoteLoading"
import { getArtist, getSong } from "../../../utils/api"
import playButton from "../../../assets/images/playButton.png"
import pause from "../../../assets/images/pause.png"


export default function playSong() {
    const { songid } = useLocalSearchParams()
    const [song, setSong] = useState(null)
    const [artists, setArtists] = useState([])

    const [sound, setSound] = useState(null)
    const soundRef = useRef(null)
    const [isPlaying, setIsPlaying] = useState(false)

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

    const dummyAudio = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"

    useEffect(() => {

        const loadSound = async () => {
            try {
                const { sound } = await Audio.Sound.createAsync({ uri: dummyAudio });
                setSound(sound);
            } catch (err) {
                console.error('Failed to load preview:', err);
                setIsError(true);
            }
        };

        loadSound();

    }, [])

    useEffect(() => {
        return () => {
            if (soundRef.current) {
                soundRef.current.unloadAsync();
            }
        };
    }, []);

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
                    onPress={async () => {
                        try {
                            if (!soundRef.current) {
                                const { sound } = await Audio.Sound.createAsync({
                                    uri: dummyAudio
                                });
                                soundRef.current = sound;
                            }

                            const status = await soundRef.current.getStatusAsync();

                            if (status.isLoaded) {
                                if (status.isPlaying) {
                                    await soundRef.current.pauseAsync();
                                    setIsPlaying(false);
                                } else {
                                    await soundRef.current.playAsync();
                                    setIsPlaying(true);
                                }
                            } else {
                                console.warn("Sound not loaded yet");
                            }
                        } catch (err) {
                            console.error("Playback error:", err);
                        }
                    }}
                    style={{ marginTop: 20 }}
                >
                    {isPlaying ? (
                        <Image source={pause} style={styles.playIcon} tintColor="white"/>
                    ) : (
                        <Image source={playButton} style={styles.playIcon} tintColor="white" />
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
    playIcon: {
        width: 30,
        height: 30,
    },
})
//make play button back button next song button and repeat button and shuffle button