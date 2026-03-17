import { View, Text, StyleSheet } from "react-native";
import colors from "../constants/colors";

export default function StatusLabel({ status }) {  // <-- curly braces for destructuring
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "90%",
    height: 40,
    backgroundColor: colors.button,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
});