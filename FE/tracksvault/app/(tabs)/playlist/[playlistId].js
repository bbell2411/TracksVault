import { useLocalSearchParams } from "expo-router";
import { useEffect, useState,useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Animated,
  Dimensions,
  TouchableOpacity,
} from 'react-native'
import { BlurView } from 'expo-blur'
import MusicNoteLoading from "../../MusicNoteLoading";
import { getPlaylistSongs } from "../../api";

export default function PlaylistSongs() {
  const { playlistId } = useLocalSearchParams()
  const [songs, setSongs] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(null)
  useEffect(() => {
    setIsLoading(true)
    getPlaylistSongs(playlistId)
      .then(({ songs }) => setSongs(songs))
      .catch(() => setIsError(true))
      .finally(() => setIsLoading(false))
  },
    [])

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
    <View style={{ ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(5, 20, 102, 0.58)' }}>
        <BlurView
              intensity={80}
              tint="light"
              style={{ flex: 1, paddingTop: 40, paddingHorizontal: 20 }}
            >
      <Text style={styles.heading}>
        Playlist Songs
      </Text>
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
          console.log(item.image)
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
              console.log(item)
              <Image
                source={{
                  uri: item.image,
                }}
                style={styles.playlistPic}
              />
              <Text style={styles.name}>{item.song_name}</Text>
              <Text style={styles.user}>{item.user_id}</Text>
              <TouchableOpacity
                style={styles.playButton}
                onPress={() => { router.push(`/playlist/${item.playlist_id}`) }}
              >
                <Text style={styles.playButtonText}>▶ Play</Text>
              </TouchableOpacity>
            </Animated.View>
              )
            }}
          />
          </BlurView>
    </View> 
          )
        }
        const colors = {
          solidBackground: '#0d0b1f',
          gradientBackground: ['#6495ED', 'rgba(13, 11, 31, 0.9)'],
          card: 'hsla(250, 25%, 15%, 0.6)',
          text: '#e0e0e0',
          accent: '#FFF0F5',
          secondary: '#ADD8E6',
        }
        
        const styles = StyleSheet.create({
          heading: {
            fontSize: 50,
            fontWeight: '700',
            color: colors.accent,
            marginBottom: 24,
            fontFamily: 'System',
            textAlign: 'center',
          },
          playlistPic: {
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
            fontSize: 45,
            fontWeight: '700',
            color: colors.text,
            marginTop: 12,
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
          center: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          },
          playButton: {
            backgroundColor: '#9D4EDD',
            paddingVertical: 12,
            paddingHorizontal: 24,
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
        })
        
        