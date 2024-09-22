import { ThemedText } from "@/components/ThemedText";
import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Searchbar, Card, Text, useTheme, Title } from "react-native-paper";
import axios from "axios";
import { router } from "expo-router";

const HomeScreen = () => {
  const [siteMaps, setSiteMaps] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredPlots, setFilteredPlots] = useState([]);
  const { colors } = useTheme();
  useEffect(() => {
    const fetchMaps = async () => {
      try {
        const res = await axios.get<any[]>(
          `${process.env.EXPO_PUBLIC_BACKEND_URL}/plots/66ddb698854289f021b3a4ec`
        );
        setSiteMaps(res.data);
        setFilteredPlots(res.data);
      } catch (error) {
        console.error("Error fetching maps:", error);
      }
    };
    fetchMaps();
  }, []);

  const filterPlots = (text: any) => {
    setSearch(text);
    if (text) {
      const filtered = siteMaps.filter((plot) =>
        plot.siteName.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredPlots(filtered);
    } else {
      setFilteredPlots(siteMaps);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <Searchbar
        placeholder="Search plots..."
        value={search}
        onChangeText={filterPlots}
        style={{ margin: 10 }}
      />
      <FlatList
        data={filteredPlots}
        keyExtractor={(item) => item._id}
        renderItem={({ item }: any) => (
          <Card
            style={{ margin: 10, marginVertical: 5 }}
            onPress={() => {
              router.push({
                pathname: "/map/[map]",
                params: {
                  map: item._id,
                },
              });
            }}
          >
            <Card.Content>
              <Title>{item.siteName}</Title>
            </Card.Content>
          </Card>
        )}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", marginTop: 20 }}>
            No plots found
          </Text>
        }
      />
    </SafeAreaView>
  );
};

export default HomeScreen;
