import { View, StyleSheet, ScrollView, Alert, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Title from "../components/Title";
import TButton from "../components/TButton";
import React, { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";

export default function LoadGame({ navigation }) {
  const [savedGames, setSavedGames] = useState([]);

  useFocusEffect(
    useCallback(() => {
      const loadGames = async () => {
        const gamesJSON = await AsyncStorage.getItem("games");
        const games = gamesJSON ? JSON.parse(gamesJSON) : [];
        setSavedGames(games);
      };
      loadGames();
    }, [])
  );

  const handleDelete = (index) => {
    Alert.alert(
      "Delete Game",
      "Are you sure you want to delete this saved game?",
      [
        { text: "Cancel" },
        {
          text: "Delete",
          onPress: async () => {
            const newGames = [...savedGames];
            newGames.splice(index, 1);
            await AsyncStorage.setItem("games", JSON.stringify(newGames));
            setSavedGames(newGames);
          },
          style: "destructive",
        },
      ]
    );
  };

  const handleLoad = async (game) => {
    await AsyncStorage.setItem("currentGame", JSON.stringify(game));
    navigation.navigate("Home");
  };

  return (
    <View style={styles.container}>
      <Title title="Load Game" />
      <ScrollView style={styles.scroll}>
        {savedGames.length === 0 && <Text style={styles.noGames}>No saved games</Text>}
        {savedGames.map((game, index) => (
          <View key={index} style={styles.gameRow}>
            <Text style={styles.gameText}>Saved on: {game.date}</Text>
            <View style={styles.buttons}>
              <TButton label="Load" fun={() => handleLoad(game)} width={60} />
              <TButton label="Delete" fun={() => handleDelete(index)} width={70} />
            </View>
          </View>
        ))}
      </ScrollView>
      <TButton label="Back" fun={() => navigation.goBack()} width={100} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ccc", padding: 10, alignItems: "center" },
  scroll: { width: "100%", marginVertical: 10 },
  gameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#eee",
    padding: 10,
    marginBottom: 5,
    borderRadius: 5,
  },
  gameText: { flex: 1, marginRight: 10 },
  buttons: { flexDirection: "row", justifyContent: "space-between", width: 140 },
  noGames: { textAlign: "center", marginVertical: 20, fontSize: 16 },
});