import { View, Text, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router"
import MusicNoteLoading from "../components/MusicNoteLoading"
import getSearch from "../../utils/api"

export default function SearchResults() {
    const { query } = useLocalSearchParams()
    const [searchResult, setSearchResult] = useState([])

    const [isLoading, setIsLoading] = useState(true)
    const [isError, setIsError] = useState(null)

    useEffect(() => {
        setIsLoading(true)
        getSearch(query)
            .then(({ result }) => setSearchResult(result))
            .catch(() => setIsError(true))
            .finally(() => setIsLoading(false))
    }, [query])


    if (isLoading) {
        return <MusicNoteLoading />
    }

    if (isError) {
        return (
            <View style={styles.center}>
                <Text>Something went wrong.</Text>
            </View>
        )
    }
    console.log("hi", searchResult)
    return (
        <View style={{ padding: 20 }}>
          <Text style={{ fontSize: 20, marginBottom: 10 }}>Results for "{query}"</Text>
          <FlatList
            data={searchResult}
            keyExtractor={(item, index) => item.id || index.toString()}
            renderItem={({ item }) => (
              <View style={{ marginBottom: 10 }}>
                <Text style={{ color: "white" }}>{item.title}</Text>
              </View>
            )}
          />
        </View>
      )
    }