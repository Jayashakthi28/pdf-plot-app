import React, { useContext, useEffect, useState } from 'react';
import { FlatList, RefreshControl, View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Searchbar, Card, Text, Title, useTheme, ActivityIndicator } from 'react-native-paper';
import axios from 'axios';
import { router } from 'expo-router';
import { UserContext } from '../_layout';

const HomeScreen = () => {
  const [siteMaps, setSiteMaps] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredPlots, setFilteredPlots] = useState([]);
  const { colors } = useTheme();
  const userDetails: any = useContext(UserContext);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMaps = async () => {
    try {
      const res = await axios.get<any[]>(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/plots/${userDetails.id}`
      );
      setSiteMaps(res.data);
      setFilteredPlots(res.data);
    } catch (error) {
      console.error('Error fetching maps:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await fetchMaps();
    setRefreshing(false);
  }, []);

  useEffect(() => {
    fetchMaps();
  }, []);

  const filterPlots = (text: any) => {
    setSearch(text);
    if (text) {
      const filtered = siteMaps.filter(plot =>
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
      <View style={{ flex: 1 }}>
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        )}
        <FlatList
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          data={filteredPlots}
          keyExtractor={item => item._id}
          renderItem={({ item }: any) => (
            <Card
              style={{ margin: 10, marginVertical: 5 }}
              onPress={() => {
                router.push({
                  pathname: '/map/[map]',
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
            !isLoading && <Text style={{ textAlign: 'center', marginTop: 20 }}>No plots found</Text>
          }
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen;
