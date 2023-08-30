import { StatusBar } from "expo-status-bar";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState, useEffect } from "react";

const API_URL =
  "https://api.openchargemap.io/v3/poi?key=491c4cd8-7608-4ca4-9811-56f3a6af731f";

interface AddressInfoType {
  Title: string;
  ID: number;
  Latitude: number;
  Longitude: number;
}

interface ChargingStationType {
  AddressInfo: AddressInfoType;
}

export default function App() {
  const [chargingStations, setChargingStations] =
    useState<ChargingStationType[]>();
  const fetchChargingStations = async () => {
    let response = await fetch(API_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    let data = await response.json();
    let tempData: ChargingStationType[] = data?.map((item: any) => ({
      AddressInfo: item.AddressInfo,
    }));
    console.log(tempData);
    setChargingStations(
      data?.map((item: any) => ({ AddressInfo: item.AddressInfo }))
    );
    return data;
  };

  useEffect(() => {
    fetchChargingStations();
  }, []);

  const startCharging = async (chargerId: number) => {
    let response = await fetch("https://example.ev.energy/chargingsession", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user: 1,
        car_id: 1,
        charger_id: chargerId,
      }),
    });

    let data = await response.json();
    if (response.status === 200) {
      alert("Charging started successfully!");
    } else {
      alert("Failed to start charing.");
    }
  };

  const selectStation = (id: number) => {
    startCharging(id);
  };

  return (
    <View style={styles.container}>
      {/* <Text>Open up App.tsx to start working on your app!</Text>
      <StatusBar style="auto" /> */}
      {/* <FlatList
        data={chargingStations}
        renderItem={({ item }) => <Text>{item.AddressInfo.Title}</Text>}
        keyExtractor={(item) => item.AddressInfo.ID.toString()}
      /> */}
      {chargingStations?.map((item) => (
        <TouchableOpacity onPress={() => selectStation(item.AddressInfo.ID)}>
          <Text>{item.AddressInfo.Title}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
