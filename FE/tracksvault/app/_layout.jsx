import { Slot, useRouter, useSegments } from 'expo-router';
import { useEffect, useState } from 'react';
import { UserProvider, useUser } from './context/UserContext'
import Welcome from './components/WelcomeLoader'

export default function RootLayout() {
    return (
        <UserProvider>
            <InnerApp />
        </UserProvider>
    );
}

function InnerApp() {

    const { user } = useUser();
    const router = useRouter();
    const segments = useSegments()

    const inAuthGroup = segments.includes('(auth)')

    useEffect(() => {
        if (user === null && !inAuthGroup) {
            router.push('/login')
        } else if (user && inAuthGroup) {
            router.replace('/')
        }

    }, [user, segments])
    
    // if (!user) return null

    return <Slot />;
}

//handle logout logic
//A confirm dialog before logging out
//make the homepage have user info
//THESE POINTS:
// An encrypted version of AsyncStorage for better security

// How to save & persist just a token instead of the whole user object

// Auto-expire sessions (token expiry handling)

// Logout logic tied to token expiration


