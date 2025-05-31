import { useLocalSearchParams, useRouter, useGlobalSearchParams } from "expo-router"
import { useEffect, useRef, useState } from "react"
import { LinearGradient } from 'expo-linear-gradient';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
} from 'react-native'
import { Audio } from 'expo-av';
import MusicNoteLoading from "../../components/MusicNoteLoading"
import { getArtist, getSong } from "../../../utils/api"
import playButton from "../../../assets/images/playButton.png"
import pause from "../../../assets/images/pause.png"
import nextButton from "../../../assets/images/nextButton.png"
import previous from "../../../assets/images/previous.png"


export default function playSong() {
    const { songid, playlist } = useLocalSearchParams()
    const router = useRouter()

    const playlistArr = playlist ? JSON.parse(playlist) : []

    const [song, setSong] = useState(null)
    const [artists, setArtists] = useState([])

    const soundRef = useRef(null)
    const [isPlaying, setIsPlaying] = useState(false)

    const [isLoading, setIsLoading] = useState(true)
    const [isError, setIsError] = useState(null)
    
    
    const dummyAudio = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'

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
    }, [songid])



    useEffect(() => {
        const loadSound = async () => {
            try {
                await Audio.setAudioModeAsync({
                    staysActiveInBackground: true,
                    allowsRecordingIOS: false,
                    playsInSilentModeIOS: true,
                });

                const { sound } = await Audio.Sound.createAsync(
                    { uri: dummyAudio }
                );

                soundRef.current = sound;
            } catch (err) {
                console.error("Failed to load sound:", err);
            }
        };

        loadSound()

        return () => {
            if (soundRef.current) {
                soundRef.current.unloadAsync();
            }
        };
    }, [songid])

    const togglePlayback = async () => {
        try {
            if (!soundRef.current) {
                console.warn("Sound not loaded yet.");
                return;
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
                console.warn("Sound not loaded properly.");
            }
        } catch (err) {
            console.error("Playback error:", err);
        }
    }


    const nextSong = () => {
        if (playlistArr.length===0){
            console.log(empty)
        }
        const current = songid
        const index = playlistArr.findIndex(song => song.song_id === current)

        if (index !== -1 && index < playlistArr.length - 1) {
            const next = playlistArr[index + 1].song_id
            router.push({
                pathname: `/songs/${next}`,
                params: { songid: next, playlist: JSON.stringify(playlistArr) }
              })
        }
        console.log("next done")

    }
    const prevSong = () => {
        if (playlistArr.length===0){
            console.log(empty)
        }
        const current = songid
        const index = playlistArr.findIndex(song => song.song_id === current)
      
        if (index !== -1) {
          const prevIndex = (index - 1 + playlistArr.length) % playlistArr.length
          const prev = playlistArr[prevIndex].song_id
          router.push({
            pathname: `/songs/${prev}`,
            params: { songid: prev, playlist: JSON.stringify(playlistArr) }
          })
        }
        console.log("prev done")
      }
      
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
                <Text style={{ color: '#fff', fontSize: 18 }}>←</Text>
            </TouchableOpacity>
            <View style={styles.container}>
                <Image source={{ uri: song.image }} style={styles.coverImage} />
                <Text style={styles.songTitle}>{song.song_name}</Text>
                <Text style={styles.artistName}>{artists.artists_name}</Text>

                <View style={styles.controls}>

                    <TouchableOpacity onPress={prevSong}>
                        <Image source={previous} style={styles.playIcon} tintColor="white" accessibilityLabel="previous song" />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={togglePlayback}>
                        {isPlaying ? (
                            <Image source={pause} style={styles.playIcon} tintColor="white" accessibilityLabel="pause song" />
                        ) : (
                            <Image source={playButton} style={styles.playIcon} tintColor="white" accessibilityLabel="play song" />
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity onPress={nextSong}>
                        <Image source={nextButton} style={styles.playIcon} tintColor="white" accessibilityLabel="next song" />
                    </TouchableOpacity>

                </View>



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
    controls: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 30, // works in React Native 0.71+ or use marginRight manually
        marginTop: 20,
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