import Maplibre from "@maplibre/maplibre-react-native";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import axios from "axios";
import { IconButton, TouchableRipple, Text } from "react-native-paper";
import ModalComponent from "@/components/ModalComponent";

export default function MapView() {
  const { map } = useLocalSearchParams();
  const [mapData, setMapData] = useState();
  const [zoomLevel, setZoomLevel] = useState(2);
  const [center, setCenter] = useState(undefined);
  const [currCoordinateData, setCurrCoordinateData] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currCoordinateIndex, setCurrCoordinateIndex] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  const getMapData = async () => {
    let res = await axios.get(
      `${process.env.EXPO_PUBLIC_BACKEND_URL}/map/${map}`
    );
    res = res.data;
    setMapData(res);
  };

  useEffect(() => {
    Maplibre.setAccessToken(null);
  }, []);

  useEffect(() => {
    getMapData();
  }, [map]);

  useEffect(() => {
    if (!mapData) return;
    setCenter(
      mapData?.coordinates.length > 0 && zoomLevel === 2
        ? [mapData.coordinates[0].lng, mapData.coordinates[0].lat]
        : undefined
    );
  }, [zoomLevel, mapData]);

  const styleSpec = useMemo(
    () => ({
      version: 8,
      sources: {
        "custom-tiles": {
          type: "raster",
          tiles: [
            `${process.env.EXPO_PUBLIC_BACKEND_URL}/${mapData?.tileUrl}/{z}_{x}_{y}`,
          ],
          tileSize: 256,
          maxzoom: 6,
        },
      },
      layers: [
        {
          id: "custom-tile-layer",
          type: "raster",
          source: "custom-tiles",
          minzoom: 0,
          maxzoom: 6,
        },
      ],
    }),
    [mapData]
  );

  const updateCoordinateData = async (coordinateData) => {
    setIsSaving(true);
    const res = await axios.patch(
      `${process.env.EXPO_PUBLIC_BACKEND_URL}/map/${map}/coordinate`,
      coordinateData
    );
    setMapData((prev: any) => {
      const currData = [...prev.coordinates];
      currData.splice(currCoordinateIndex, 1);
      currData.push(coordinateData);
      return {
        ...prev,
        coordinates: currData,
      };
    });
    setCurrCoordinateData({});
    setIsSaving(false);
  };

  const markerViews = useMemo(() => {
    if (!mapData?.coordinates) {
      return null;
    }

    return mapData.coordinates.map((markerData, idx) => (
      <Maplibre.MarkerView
        key={`${markerData.lat}_${markerData.lng}`}
        id={`${markerData.lat}_${markerData.lng}`}
        coordinate={[markerData.lng, markerData.lat]}
        nativeID={`${markerData.lat}_${markerData.lng}`}
        shouldRasterizeIOS={true}
        isSelected={false}
        allowOverlap
      >
        <View style={styles.markerContainer}>
          <TouchableRipple
            style={{
              borderRadius: 100,
            }}
            onPress={() => {
              setCurrCoordinateData(markerData);
              setCurrCoordinateIndex(idx);
              setIsModalOpen(true);
            }}
            renderToHardwareTextureAndroid
            rippleColor={markerData.isBooked ? "#FCE4EC" : "#E8F5E9"}
          >
            <View
              style={{
                padding: 8,
                borderRadius: 100,
                backgroundColor: markerData.isBooked ? "#FCE4EC" : "#E8F5E9",
                height: 30,
                width: 30,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text adjustsFontSizeToFit>{markerData.plotNumber}</Text>
            </View>
          </TouchableRipple>
        </View>
      </Maplibre.MarkerView>
    ));
  }, [mapData]);

  return (
    <View style={{ flex: 1 }}>
      {mapData && (
        <Maplibre.MapView
          style={{
            width: "100%",
            height: "100%",
            flex: 1,
          }}
          attributionEnabled={false}
          styleJSON={JSON.stringify(styleSpec)}
        >
          <Maplibre.Camera
            zoomLevel={zoomLevel}
            maxZoomLevel={6}
            minZoomLevel={2}
            followUserLocation={false}
            needsOffscreenAlphaCompositing
            centerCoordinate={center}
          />
          {markerViews}
        </Maplibre.MapView>
      )}
      <View style={styles.navControls}>
        <IconButton
          mode="contained-tonal"
          icon={() => <Ionicons name="add" />}
          onPress={() => setZoomLevel((prev) => (prev >= 6 ? 6 : prev + 1))}
        />
        <IconButton
          mode="contained-tonal"
          icon={() => <Ionicons name="remove" />}
          onPress={() => setZoomLevel((prev) => (prev <= 2 ? 2 : prev - 1))}
        />
      </View>
      <ModalComponent
        coordinateData={currCoordinateData}
        isVisible={isModalOpen}
        setIsVisible={setIsModalOpen}
        updateCoordinateData={updateCoordinateData}
        isSaving={isSaving}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  mapContainer: {
    width: "100%",
    height: "100%",
    flex: 1,
  },
  markerContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  navControls: {
    position: "absolute",
    bottom: 20,
    right: 20,
    flexDirection: "column",
  },
});
