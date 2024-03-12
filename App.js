import React from "react";
import { View, StyleSheet } from "react-native";
import LoginComponent from "./src/screens/LoginComponent";

export default App = () => {
  return (
    <View style={styles.container}>
      <LoginComponent />
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
