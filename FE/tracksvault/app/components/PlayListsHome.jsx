import React, { useEffect, useState, useRef } from 'react'
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
  TextInput,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import MusicNoteLoading from './MusicNoteLoading'
import { getPlaylists, handleSearch } from '../../utils/api'
import {useRouter} from 'expo-router'
const router= useRouter()

export default function PlayListsHome() {
  const [playlists, setPlaylists] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults]= useState([])

  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(null)

  const scrollX = useRef(new Animated.Value(0)).current
  const { width } = Dimensions.get('window')
  const ITEM_WIDTH = width * 0.72
  const SPACER_WIDTH = (width - ITEM_WIDTH) / 2

  useEffect(() => {
    setIsLoading(true)
    getPlaylists()
      .then(({ playlists }) => setPlaylists(playlists))
      .catch(() => setIsError(true))
      .finally(() => setIsLoading(false))
  }, [])

  useEffect(()=>{
    setIsLoading(true)
    handleSearch(searchQuery)
    .then(({results})=> setSearchResults(results))
    .catch(()=> setIsError(true))
    .finally(()=> setIsLoading(false))
  },[])

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

  const playlistData = [{ key: 'left-spacer' }, ...playlists, { key: 'right-spacer' }]

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
      colors={['#0a0a0a', '#66CDAA']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={StyleSheet.absoluteFill}
    >
          <View style={styles.searchStyle}>
      <TextInput
        placeholder="Search for songs..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        onSubmitEditing={handleSearch}
        style={styles.input}
        placeholderTextColor="#aaa"
      />
      {/* Render search results below here */}
    </View>
        <ScrollView style={{ flex: 1 }}>
          <SafeAreaView style={{ alignItems: 'center', marginBottom: 24 }}>
            <Text style={styles.heading}>Browse Playlists</Text>
          </SafeAreaView>

          <Animated.FlatList
            data={playlistData}
            keyExtractor={(item, index) =>
              item.playlist_id?.toString() || `spacer-${index}`
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
              if (!item.name) return <View style={{ width: SPACER_WIDTH }} />

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
                      uri: item.avatar_url || 'https://i.pinimg.com/736x/9c/a0/4f/9ca04ff522b08a3237cc4460520ab16b.jpg',
                    }}
                    style={styles.playlistPic}
                  />
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.user}>{item.user_id}</Text>
                  <TouchableOpacity
                    style={styles.playButton}
                    onPress={() => {router.push(`/playlist/${item.playlist_id}`)}}
                  >
                    <Text style={styles.playButtonText}>▶ View</Text>
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
  searchStyle: { padding: 16 },
  input: {
    backgroundColor: '#222',
    color: 'white',
    padding: 10,
    borderRadius: 8,
    fontSize: 16,
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

