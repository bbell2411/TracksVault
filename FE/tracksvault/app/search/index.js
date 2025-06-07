import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from "react-native"
import { LinearGradient } from 'expo-linear-gradient'
import React, { useEffect, useState } from "react"
import { useLocalSearchParams, useRouter } from "expo-router"
import MusicNoteLoading from "../components/MusicNoteLoading"
import { getArtist, getSearch } from "../../utils/api"

export default function SearchResults() {
  const router = useRouter()
  const { query } = useLocalSearchParams()
  const [searchResult, setSearchResult] = useState([])

  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(null)

  useEffect(() => {
    if (!query) return;

    setIsLoading(true);
    getSearch(query)
      .then((res) => {
        setSearchResult(res.search_result)
      })
      .catch(() => {
        setIsError(true);
      })
      .finally(() => {
        setIsLoading(false);
      })
  }, [query])

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
      <Text style={{ fontSize: 20, marginBottom: 10 }}>Results for "{query}"</Text>
      <FlatList
        data={searchResult}
        keyExtractor={(item) => item.song_id}
        renderItem={({ item }) => (
          <View style={styles.container}>
            <Image source={{ uri: item.image }} style={styles.coverImage} />
            <Text style={styles.songTitle}>{item.song_name}</Text>
              <Text style={styles.artistName}>{item.artist_name}</Text>
          </View>
        )}
      />
    </LinearGradient>
  )
}
const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
})
//CHANGE THE BACKIEND TO INCLUDE SONG IMAGES :)
// make it clickbale with a route to play the song