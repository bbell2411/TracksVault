import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, Button, SafeAreaView, ActivityIndicator, FlatList, Image } from 'react-native'
import { useNavigation } from '@react-navigation/native'
// import { useAuth } from '../context/AuthContext'
import { getPlaylists } from './api'

export default function HomeScreen() {
  const [playlists, setPlaylists] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(null)

  useEffect(() => {
    setIsLoading(true)
    getPlaylists().then(({ playlists }) => {
      setPlaylists(playlists)
    })
      .catch((err) => {
        setIsError(true)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [])

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Loading playlists...</Text>
      </View>
    )
  }

  if (isError) {
    return (
      <View style={styles.center}>
        <Text>Something went wrong.</Text>
      </View>
    )
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={[styles.container, { flex: 1 }]}>
        <Text style={styles.heading}>Playlists</Text>
        <FlatList
          data={playlists}
          keyExtractor={(item) => item.playlist_id.toString()}
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.user}>{item.user_id}</Text>
              <Image
                source={{ uri: item.avatar_url ? item.avatar_url : 'https://i.pinimg.com/736x/9c/a0/4f/9ca04ff522b08a3237cc4460520ab16b.jpg' }}
                style={styles.playlistPic}
              />
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  )
  
}
const colors = {
  background: '#0d0b1f', 
  card: '#1a152f',
  text: '#e0e0e0',
  accent: '#9d4edd',       // Purple glow
  secondary: '#00ffcc',    // Neon green
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  heading: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.accent,
    marginBottom: 24,
    fontFamily: 'System',
    textAlign: 'left',
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 6,
  },
  playlistPic: {
    width: '100%',
    height: 160,
    resizeMode: 'cover',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  playlistName: {
    fontSize: 22,
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
});
