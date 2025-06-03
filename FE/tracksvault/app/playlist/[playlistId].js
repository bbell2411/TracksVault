import { useLocalSearchParams, useRouter } from "expo-router"
import { useEffect, useState, useRef } from "react"
import {
  View,
  Text,
  StyleSheet,
  Image,
  Animated,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native'
import MusicNoteLoading from "../components/MusicNoteLoading";
import { LinearGradient } from 'expo-linear-gradient';
import { getPlaylistSongs, getUser, getUsersByPlaylistId } from "../../utils/api";

export default function PlaylistSongs() {
  const { playlistId } = useLocalSearchParams()

  const [songs, setSongs] = useState([])
  const [userId, setUser] = useState(null)
  const [pfp, setPfp] = useState(null)

  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(null)

  const router = useRouter()

  useEffect(() => {
    setIsLoading(true)
    getPlaylistSongs(playlistId)
      .then(({ songs }) => setSongs(songs))
      .catch(() => setIsError(true))
      .finally(() => setIsLoading(false))
  },
    [playlistId])
    
    useEffect(() => {
      setIsLoading(true);
      getUsersByPlaylistId(playlistId)
        .then(({ playlist }) => {
          setUser(playlist);
          return getUser(playlist.user_id)
        })
        .then(({ user }) => {
          setPfp(user.avatar_url)
        })
        .catch(() => setIsError(true))
        .finally(() => setIsLoading(false))
    }, [playlistId])
    
    
    const scrollX = useRef(new Animated.Value(0)).current
    const { width } = Dimensions.get('window')
    const ITEM_WIDTH = width * 0.72
    const SPACER_WIDTH = (width - ITEM_WIDTH) / 2
    
    if (isLoading) {
      return <MusicNoteLoading />
    }
    
    if (isError) {
      return (
        <View style={styles.center}>
        <Text>Something went wrong.</Text>
      </View>
    )
  }
  const songsData = [
    { key: 'left-spacer', spacer: true },
    ...songs,
    { key: 'right-spacer', spacer: true }
  ]
  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={['#0a0a0a', '#66CDAA']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.heading}>
            {userId.name}
          </Text>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <SafeAreaView style={styles.ownerInfo}>
            <Image
              source={{ uri: pfp }}
              style={styles.ownerPfp}
            />
            <Text style={styles.ownerUsername}>
              {userId.user_id}
            </Text>
          </SafeAreaView>
          <Animated.FlatList
            data={songsData}
            keyExtractor={(item, index) =>
              item.song_id?.toString() || `spacer-${index}`
            }
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={ITEM_WIDTH}
            decelerationRate="fast"
            bounces={false}
            contentContainerStyle={{ alignItems: 'center' }}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX } } }],
              { useNativeDriver: true }
            )}
            scrollEventThrottle={16}
            renderItem={({ item, index }) => {
              if (!item.image) return <View style={{ width: SPACER_WIDTH }} />

              const inputRange = [
                (index - 2) * ITEM_WIDTH,
                (index - 1) * ITEM_WIDTH,
                index * ITEM_WIDTH,
              ]

              const scale = scrollX.interpolate({
                inputRange,
                outputRange: [0.8, 1, 0.8],
                extrapolate: 'clamp',
              })
              return (
                <Animated.View
                  style={[
                    styles.card,
                    { width: ITEM_WIDTH, transform: [{ scale }] },
                  ]}
                >
                  <Image
                    source={{
                      uri: item.image
                    }}
                    style={styles.songPic}
                  />
                  <Text style={styles.name}>{item.song_name}</Text>
                  <TouchableOpacity
                    style={styles.playButton}
                    onPress={() => {
                      router.push({
                        pathname: `songs/${item.song_id}`,
                        params: {
                          playlist: JSON.stringify(songs)
                        }
                      })
                    }}
                  >
                    <Text style={styles.playButtonText}>Listen</Text>
                  </TouchableOpacity>
                </Animated.View>
              )
            }}
          />
        </ScrollView>
      </LinearGradient>
    </View>
  )
}
PlaylistSongs.options = {
  tabBarStyle: { display: 'none' },
};

//ADD SAVE/VOTE
const colors = {
  card: 'hsla(250, 25%, 15%, 0.6)',
  text: '#e0e0e0',
  accent: '#FFF0F5',
  secondary: '#ADD8E6',
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingVertical: 40,
  },
  heading: {
    fontSize: 50,
    fontWeight: '700',
    color: colors.accent,
    marginBottom: 24,
    fontFamily: 'System',
    textAlign: 'center',
  },
  songPic: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  card: {
    backgroundColor: 'rgba(26, 21, 47, 0.6)',
    borderRadius: 20,
    alignItems: 'center',
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 10,
  },
  name: {
    fontSize: 40,
    fontWeight: '700',
    color: colors.text,
    marginTop: 16,
    paddingHorizontal: 16,
    fontFamily: 'System',
    letterSpacing: 0.5,
  },
  user: {
    fontSize: 14,
    color: colors.secondary,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontFamily: 'System',
    opacity: 0.85,
  },
  ownerInfo: {
    position: 'absolute',
    top: 20,
    right: 20,
    alignItems: 'center',
    zIndex: 10,
  },

  ownerPfp: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 4,
  },

  ownerUsername: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.accent,
    textAlign: 'center',
    fontFamily: 'System',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    backgroundColor: '#9D4EDD',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginTop: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },

  playButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
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

  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
})
