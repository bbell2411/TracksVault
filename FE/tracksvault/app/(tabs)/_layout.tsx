// import { Stack } from "expo-router";

// export default function RootLayout() {
//   return (
//     <Stack screenOptions={{ headerShown: false }}>
//       <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
//     </Stack>
//   );
// }
import { Tabs } from 'expo-router';
import React from 'react'
import { Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from 'react-native'
import {UserProvider} from '../context/UserContext'

const TabLayout = () => {
  const colorScheme = useColorScheme();

  return (
    <UserProvider>
    <Tabs
    screenOptions={
      {
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
      headerShown: false,}
  }
  >
        <Tabs.Screen
            name="index"
            options={{
            title:"home",
            headerShown: false,
            }}
        />
        <Tabs.Screen
            name="MyPlaylists"
            options={{
            title:"Playlists",
            headerShown: false,
            }}
        />
         <Tabs.Screen
            name="Profile"
            options={{
            title:"Profile",
            headerShown: false,
            }}
        />
        
    </Tabs>  
    </UserProvider>
  )
}

export default TabLayout;
