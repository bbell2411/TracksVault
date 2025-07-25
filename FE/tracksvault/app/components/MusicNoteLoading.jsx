import React, { useEffect, useRef } from 'react'
import { View, Animated, StyleSheet, Easing, Text } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient';


export default function MusicNoteLoading() {
  const bounceValue = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceValue, {
          toValue: -15,
          duration: 500,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(bounceValue, {
          toValue: 0,
          duration: 500,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    ).start()
  }, [bounceValue])

  return (
     <LinearGradient
          colors={['#0a0a0a', '#66CDAA']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        >
    <View style={styles.container}>
      <Animated.Text
        style={[
          styles.musicNote,
          {
            transform: [{ translateY: bounceValue }],
          },
        ]}
      >
        🎵
      </Animated.Text>
      <Text style={styles.text}>Loading...</Text>
    </View>
    </LinearGradient>
  )
}
MusicNoteLoading.options = {
  tabBarStyle: { display: 'none' },
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  musicNote: {
    fontSize: 80,
    color: '#9d4edd', 
  },
  text: {
    marginTop: 10,
    fontSize: 18,
    color: '#e0e0e0',
  },
})
