import React, { useEffect, useReducer } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import * as ImagePicker from "expo-image-picker";
import CustomInputField from "../components/CustomInputField";
import { firestore, auth } from "../services/FirebaseSetup";
import { setDoc, doc, getDoc } from "firebase/firestore";

const initialState = {
  firstName: "",
  lastName: "",
  monthlyIncome: "",
  totalBalance: "",
  profileImage: null,
  firstNameError: "",
  lastNameError: "",
  monthlyIncomeError: "",
  totalBalanceError: "",
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    case "SET_ERROR":
      return { ...state, [action.field + "Error"]: action.value };
    default:
      return state;
  }
};

const ProfileScreen = ({ navigation }) => {
  const currentUser = auth.currentUser;
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const fetchProfileData = async () => {
      const userDocRef = doc(firestore, "users", currentUser.uid);
      const docSnap = await getDoc(userDocRef);
      if (docSnap.exists()) {
        const userData = docSnap.data();
        for (const key in userData) {
          if (key in initialState) {
            dispatch({ type: "SET_FIELD", field: key, value: userData[key] });
          }
        }
      }
    };
    fetchProfileData();
  }, [currentUser]);

  const handleChange = (field, value) => {
    dispatch({ type: "SET_FIELD", field, value });
  };

  const handleSaveProfile = async () => {
    let isValid = true;
    const fields = ["firstName", "lastName", "monthlyIncome", "totalBalance"];

    fields.forEach((field) => {
      if (!state[field]) {
        dispatch({ type: "SET_ERROR", field, value: `${field} is required` });
        isValid = false;
      } else {
        dispatch({ type: "SET_ERROR", field, value: "" });
      }
    });

    if (isValid) {
      const userDocRef = doc(firestore, "users", currentUser.uid);
      await setDoc(
        userDocRef,
        {
          firstName: state.firstName,
          lastName: state.lastName,
          monthlyIncome: state.monthlyIncome,
          totalBalance: state.totalBalance,
          profileImage: state.profileImage || null,
        },
        { merge: true }
      );
      navigation.navigate("Dashboard");
    }
  };

  const handleSelectProfileImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        dispatch({
          type: "SET_FIELD",
          field: "profileImage",
          value: result.assets[0].uri,
        });
      }
    } catch (error) {
      console.error("Error selecting profile image:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Edit Profile</Text>
      <TouchableOpacity
        style={styles.profileImageButton}
        onPress={handleSelectProfileImage}
      >
        <Image
          source={
            state.profileImage
              ? { uri: state.profileImage }
              : require("../../assets/images/default-profile-pic.png")
          }
          style={styles.profileImage}
        />
      </TouchableOpacity>
      <CustomInputField
        containerStyle={{
          marginVertical: 15,
          width: "80%",
        }}
        value={state.firstName}
        onChangeText={(value) => handleChange("firstName", value)}
        placeholder="First Name"
        error={state.firstNameError}
      />
      <CustomInputField
        containerStyle={{
          marginVertical: 15,
          width: "80%",
        }}
        value={state.lastName}
        onChangeText={(value) => handleChange("lastName", value)}
        placeholder="Last Name"
        error={state.lastNameError}
      />
      <CustomInputField
        containerStyle={{
          marginVertical: 15,
          width: "80%",
        }}
        value={state.monthlyIncome}
        onChangeText={(value) => handleChange("monthlyIncome", value)}
        placeholder="Monthly Income"
        keyboardType="numeric"
        error={state.monthlyIncomeError}
      />
      <CustomInputField
        containerStyle={{
          marginVertical: 15,
          width: "80%",
        }}
        value={state.totalBalance}
        onChangeText={(value) => handleChange("totalBalance", value)}
        placeholder="Total Balance"
        keyboardType="numeric"
        error={state.totalBalanceError}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.navigate("Dashboard")}
        >
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
          <Text style={styles.buttonText}>Save Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  profileImageButton: {
    marginBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    marginTop: 20,
  },
  saveButton: {
    backgroundColor: "#3777bc",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  cancelButton: {
    backgroundColor: "red",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default ProfileScreen;
