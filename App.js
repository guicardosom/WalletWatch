import React from "react";
import { View, StyleSheet } from "react-native";
import LoginScreen from "./src/screens/LoginScreen";
import { useFonts } from "expo-font";

export default App = () => {
  const [fontsLoaded] = useFonts({
    OpenSans: require("./assets/fonts/OpenSans/OpenSans-VariableFont.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }

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
