import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import CustomInputField from "../components/CustomInputField";

const LoginComponent = () => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleLogin = () => {
    setEmailError("");
    setPasswordError("");

    if (!email) {
      setEmailError("Email is required!");
    } else if (!isValidEmail(email)) {
      setEmailError("Please enter a valid email address!");
    }

    if (!password) {
      setPasswordError("Password is required!");
    } else if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters long!");
    }

    if (email && isValidEmail(email) && password && password.length >= 8) {
      // Perform login action
      console.log("Login successful!");
    }
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
    <View style={styles.outerContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Welcome!</Text>
        <Text style={styles.instruction}>Log in to continue.</Text>
        <CustomInputField
          containerStyle={{ width: "100%" }}
          placeholder={"Email address"}
          onChangeText={(text) => {
            setEmail(text);
            setEmailError("");
          }}
          error={emailError}
        />
        <CustomInputField
          containerStyle={{
            marginVertical: 15,
            width: "100%",
          }}
          placeholder={"Password"}
          onChangeText={(text) => {
            setPassword(text);
            setPasswordError("");
          }}
          error={passwordError}
          secureTextEntry
        />
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  container: {
    width: "90%",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "500",
  },
  instruction: {
    marginVertical: 20,
    fontSize: 14,
  },
  input: {
    width: "100%",
    height: 60,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 25,
    marginBottom: 15,
    fontSize: 16,
  },
  loginButton: {
    width: "100%",
    height: 50,
    backgroundColor: "#3777bc",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    marginTop: 30,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "500",
  },
});

export default LoginComponent;
