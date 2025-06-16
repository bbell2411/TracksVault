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


