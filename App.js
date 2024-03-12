import React from "react";
import { View, StyleSheet } from "react-native";
import LoginScreen from "./src/screens/LoginScreen";

export default App = () => {
  return (
    <View style={styles.container}>
      <LoginScreen />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
  },
});
