import React, { useEffect, useState, useRef, use } from 'react'
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
  FlatList,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
// import MusicNoteLoading from './MusicNoteLoading'
import { getPlaylists, getSearch, getUserPlaylists } from '../../utils/api'
import { useRouter } from 'expo-router'
import { useUser } from '../context/UserContext'
import settings from '../../assets/images/settings.png'

export default function Profile() {
  const router = useRouter()
  console.log(router)
  const { user } = useUser()
  const [playlists, setPlaylists] = useState([])
  const [isLoading, setIsloading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!user) return;
    setIsloading(true)
    getUserPlaylists(user.username)
      .then(({ playlists }) => {
        setPlaylists(playlists)
      })
      .catch(() => {
        setError(true)
      })
      .finally(() => {
        setIsloading(false)
      })

  }, [user])
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#121212',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: 80,
      }}
    >
      <TouchableOpacity
        onPress={() => router.push('/settings')}
        style={{
          position: 'absolute',
          top: 40,
          right: 20,
          zIndex: 10,
        }}
      >
        <Image
          source={settings}
          style={{
            width: 30,
            height: 30,
            tintColor: '#66CDAA',
          }}
        />
      </TouchableOpacity>
      <View
        style={{
          borderWidth: 4,
          borderColor: '#555',
          borderRadius: 100,
          padding: 8,
          shadowColor: '#000',
          shadowOpacity: 0.5,
          shadowRadius: 10,
          elevation: 10,
          backgroundColor: '#1e1e1e',
        }}
      >
        <Image
          source={{
            uri: user?.avatar_url || 'https://via.placeholder.com/300',
          }}
          style={{
            width: 150,
            height: 150,
            borderRadius: 75,
          }}
        />
      </View>

      <Text
        style={{
          fontSize: 36,
          fontWeight: '700',
          color: '#fff',
          textAlign: 'center',
          marginTop: 30,
        }}
      >
        {user?.username || 'Guest User'}
      </Text>
      <LinearGradient
        colors={['#0a0a0a', '#66CDAA']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          borderRadius: 20,
          padding: 16,
          shadowColor: '#66CDAA',
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.9,
          shadowRadius: 20,
          elevation: 15,
          width: '90%',
          maxHeight: 300,
        }}
      >
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 10 }}>
          Your Playlists
        </Text>

        <View style={{ flex: 1 }}>
          {playlists.length === 0 ? (
            <Text style={{ color: '#ccc' }}>No playlists found</Text>
          ) : (
            <FlatList
              data={playlists}
              keyExtractor={(item) => item.playlist_id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => router.push(`/playlist/${item.playlist_id}`)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingVertical: 12,
                    borderBottomWidth: 1,
                    borderBottomColor: '#333',
                  }}
                >
                  <Image
                    source={{ uri: item.avatar_url || 'https://via.placeholder.com/300' }}
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: 8,
                      marginRight: 16,
                    }}
                  />
                  <Text style={{ color: '#fff', fontSize: 18, fontWeight: '500' }}>
                    {item.name}
                  </Text>
                </TouchableOpacity>

              )}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      </LinearGradient>
    </View>
  )

}

