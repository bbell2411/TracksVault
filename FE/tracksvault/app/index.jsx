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
  card: '#1e1839',      
  text: '#e0e0e0',       
  accent: '#9d4edd',     
  secondary: '#00ffcc',  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  heading: {
    fontSize: 32,
    fontFamily: 'Poppins-Bold', // Added for consistency
    color: colors.accent,
    marginBottom: 24,
    letterSpacing: -0.5,
  },
  card: {
    backgroundColor: colors.card,
    padding: 20,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: colors.accent,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  playlistName: {
    fontSize: 24, 
    fontFamily: 'Poppins-SemiBold',
    color: colors.text,
    marginBottom: 0,
    letterSpacing: -0.3,
    lineHeight: 30,
    paddingTop: 8, 
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  name: {
    color: colors.secondary,
    fontSize: 15,
    fontFamily: 'Poppins-Medium',
    opacity: 0.9,
    marginBottom: 2, // Tighter spacing
  },
  user: {
    color: '#FF69B4',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    opacity: 0.8,
    letterSpacing: 0.2,
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12, // More space above metadata
  },
  songCount: {
    color: colors.secondary,
    fontSize: 13,
    fontFamily: 'Poppins-Regular', // Now all Poppins
    opacity: 0.7,
  },
  playlistPic: {
    width: '100% + 36px',   // Compensate for card's horizontal padding
    height: 140,            // Ideal aspect ratio for music covers
    marginLeft: -18,        // Counteract card padding for edge-to-edge
    marginRight: -18,
    marginTop: 12,
    borderRadius: 0,        // Sharp edges to match your theme
    backgroundColor: '#1A1A1A', // Dark base for visibility
    overflow: 'hidden',     // Crop anything outside bounds
    borderBottomWidth: 1,   // Subtle separation
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  nowPlayingBar: {
    height: 60,
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
});