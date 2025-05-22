import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, Button, SafeAreaView, ActivityIndicator, FlatList, Image } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native'
import MusicNoteLoading from "./MusicNoteLoading"
// import { useAuth } from '../context/AuthContext'
import { getPlaylists } from './api'

export default function HomeScreen() {
  const [playlists, setPlaylists] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(null)

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 3000)
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
     <MusicNoteLoading />
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
    <>
    <LinearGradient
  colors={colors.gradientBackground}
  style={StyleSheet.absoluteFill}/>

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
    </>
  )
  
}
const colors = {
  solidBackground: '#0d0b1f', 
  gradientBackground: ['rgba(157, 78, 221, 0.4)', 'rgba(13, 11, 31, 0.9)'], 
  card: 'hsla(250, 25%, 15%, 0.6)',
  text: '#e0e0e0',
  accent: '#FFF0F5',
  secondary: '#ADD8E6',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  heading: {
    fontSize: 40,
    fontWeight: '700',
    color: colors.accent,
    marginBottom: 24,
    fontFamily: 'System',
    textAlign: 'left',
  },
 card: {
  backgroundColor: 'rgba(26, 21, 47, 0.6)', 
  borderRadius: 20,
  overflow: 'hidden',
  marginBottom: 24,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.25,
  shadowRadius: 12,
  elevation: 10,
},

playlistPic: {
  width: '100%',
  height: 300,
  resizeMode: 'cover',
  transparency: 0.9,
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
});
