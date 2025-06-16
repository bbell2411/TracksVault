import { Tabs, useRouter,  } from 'expo-router';
import React from 'react'
import { useColorScheme } from 'react-native';

const TabLayout = () => {
  const colorScheme = useColorScheme();
  const router = useRouter();


  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#66CDAA",
        tabBarInactiveTintColor: "#aaa",
        tabBarStyle: {
          backgroundColor: "#111",
          borderTopWidth: 0,
          height: 70,
          paddingBottom: 10,
        },
        tabBarLabelStyle: {
          fontSize: 14,
          fontWeight: "700",
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen name="index" options={{ title: "home", headerShown: false }} />
      <Tabs.Screen name="MyPlaylists" options={{ title: "Playlists", headerShown: false }} />
      <Tabs.Screen name="Profile" options={{ title: "Profile", headerShown: false }} />
    </Tabs>
  );
};

export default TabLayout
