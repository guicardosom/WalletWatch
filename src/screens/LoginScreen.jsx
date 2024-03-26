import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import CustomInputField from "../components/CustomInputField";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/FirebaseSetup";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleLogin = async () => {
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
      try {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        console.log("Login successful!", userCredential.user);
      } catch (error) {
        console.error("Login failed:", error.message);

        if (
          error.code === "auth/user-not-found" ||
          error.code === "auth/wrong-password"
        ) {
          setEmailError("Invalid email or password.");
        } else {
          setEmailError("Login failed. Please try again later.");
        }
      }
    }
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
    <View style={styles.outerContainer}>
      <View style={styles.container}>
        <Image
          source={require("../../assets/images/WalletWatch-logo.png")}
          style={styles.logo}
        />
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
        <Text style={styles.signUpText}>
          Don't have an account?{" "}
          <Text
            style={styles.signUpButton}
            onPress={() => navigation.navigate("Register")}
          >
            Sign up
          </Text>
        </Text>
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
  logo: {
    maxWidth: "100%",
    height: 60,
    resizeMode: "contain",
    marginBottom: 25,
  },
  title: {
    fontSize: 26,
    fontWeight: "500",
    fontFamily: "OpenSans",
  },
  instruction: {
    marginVertical: 20,
    fontSize: 14,
    fontFamily: "OpenSans",
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
    fontFamily: "OpenSans",
  },
  signUpText: {
    marginTop: 25,
    fontSize: 14,
    fontFamily: "OpenSans",
  },
  signUpButton: {
    fontFamily: "OpenSans",
    fontSize: 14,
    color: "#3777bc",
  },
});

export default LoginScreen;
