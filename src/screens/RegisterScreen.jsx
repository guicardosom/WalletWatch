import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import CustomInputField from "../components/CustomInputField";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/FirebaseSetup";

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleRegister = async () => {
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
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        Alert.alert(
          "Registration Successful",
          "Your account has been successfully created.",
          [{ text: "OK", onPress: () => navigation.navigate("Login") }]
        );
      } catch (error) {
        console.error("Registration failed:", error.message);

        if (error.code === "auth/email-already-in-use") {
          setEmailError("Email is already in use.");
        } else if (error.code === "auth/invalid-email") {
          setEmailError("Invalid email address.");
        } else {
          setEmailError("Registration failed. Please try again later.");
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
        <Text style={styles.title}>Create an account</Text>
        <Text style={styles.instruction}>Register to continue.</Text>
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
        <TouchableOpacity
          style={styles.registerButton}
          onPress={handleRegister}
        >
          <Text style={styles.registerText}>Continue</Text>
        </TouchableOpacity>
        <Text style={styles.loginText}>
          Already have an account?{" "}
          <Text
            style={styles.loginButton}
            onPress={() => navigation.navigate("Login")}
          >
            Log in
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
  registerButton: {
    width: "100%",
    height: 50,
    backgroundColor: "#3777bc",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    marginTop: 30,
  },
  registerText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "500",
    fontFamily: "OpenSans",
  },
  loginText: {
    marginTop: 25,
    fontSize: 14,
    fontFamily: "OpenSans",
  },
  loginButton: {
    fontFamily: "OpenSans",
    fontSize: 14,
    color: "#3777bc",
  },
});

export default RegisterScreen;
