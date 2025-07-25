import React, { useEffect, useState, useRef, use } from 'react'
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { getUserPlaylists } from '../../utils/api'
import { useRouter } from 'expo-router'
import { useUser } from '../context/UserContext'
import settings from '../../assets/images/settings.png'
import AsyncStorage from '@react-native-async-storage/async-storage'


export default function Profile() {
  const router = useRouter()
  const { user } = useUser()
  const [playlists, setPlaylists] = useState([])
  const [isLoading, setIsloading] = useState(true)
  const [error, setError] = useState(null)
  const [bio, setbio] = useState('')
  const [birthday, setBirthday] = useState('')
  const [num, setNum] = useState('')

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const saved = await AsyncStorage.getItem('profileSettings')
        if (saved) {
          const data = JSON.parse(saved)
          setbio(data.bio || '')
          setBirthday(data.birthday || '')
          setNum(data.phone || '')
        }
      } catch (e) {
        setError(true)
        console.log("Failed to load profile", e)
      }
    }

    loadProfile()
  }, [])

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

  if (error) {
    return (
      <View style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Text style={{
          color: 'red',
          fontSize: 18,
        }}>Error loading song</Text>
      </View>
    )
  }

  if (isLoading) {
    return (
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#121212'
      }}>
        <ActivityIndicator size="large" color="#ccc" marginTop="10" />
      </View>
    )
  }
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
      <View
        style={{
          marginTop: 20,
          padding: 15,
          backgroundColor: '#000000',
          borderRadius: 12,
          width: '90%',
          alignSelf: 'center',
          shadowColor: '#000',
          shadowOpacity: 0.2,
          shadowOffset: { width: 0, height: 2 },
          shadowRadius: 4,
          elevation: 5,
        }}>
        <Text style={{ color: 'white', fontSize: 18, marginBottom: 8 }}>
          💬 Bio: <Text style={{ color: '#bbb' }}>{bio || 'Not set'}</Text>
        </Text>
        <Text style={{ color: 'white', fontSize: 18, marginBottom: 8 }}>
          🎂 Birthday: <Text style={{ color: '#bbb' }}>{birthday || 'Not set'}</Text>
        </Text>
      </View>

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
          bottom: -50,
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

