import { StyleSheet, Text, Pressable } from "react-native";

export default function Cell({ play, onPress, isWinning }) {
  return (
    <Pressable
      style={({ pressed }) =>
        pressed
          ? [
              styles.cell,
              { opacity: 0.5, backgroundColor: isWinning ? "#ff0" : "#090" },
            ]
          : [styles.cell, { backgroundColor: isWinning ? "#ff0" : "#090" }]
      }
      onPress={play ? null : onPress}
    >
      <Text style={styles.text}>{play}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cell: {
    width: 80,
    height: 80,
    borderWidth: 1,
    borderColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 30,
    fontWeight: "bold",
    color: "white",
  },
});