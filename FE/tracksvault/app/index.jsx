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
          keyExtractor={(item, index) => item.playlist_id.toString()}
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={({ item }) => (
            console.log(item),
            <View style={styles.card}>
              <Text style={styles.name}>{item.name}</Text>
              <Text>By: {item.user_id}</Text>
              <Image
                source={{ uri: item.avatar_url ? item.avatar_url : 'https://i.pinimg.com/1200x/35/99/27/359927d1398df943a13c227ae0468357.jpg' }}
                style={{ width: 100, height: 100, borderRadius: 10 }}
              />
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  )
  
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  card: {
    padding: 15,
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: '#f2f2f2',
  },
  playlistName: {
    fontSize: 18,
    fontWeight: '600',
  },
})


