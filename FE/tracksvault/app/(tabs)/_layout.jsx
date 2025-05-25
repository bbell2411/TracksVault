import { Tabs } from 'expo-router';
import React from 'react';

const TabLayout = () => {
  return (
    <Tabs>
        <Tabs.Screen
            name="index"
            options={{
            title: 'Home',
            headerShown: false,
            }}
        />
        {/* <Tabs.Screen
            name="settings"
            options={{
            title: 'Settings',
            headerShown: false,
            }}
        /> */}
    </Tabs>  
  );
};

export default TabLayout;