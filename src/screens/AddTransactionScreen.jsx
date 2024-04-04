import React, { useReducer } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import CustomInputField from "../components/CustomInputField";
import { firestore, auth } from "../services/FirebaseSetup";
import { collection, addDoc } from "firebase/firestore";

const initialState = {
  type: "",
  amount: "",
  date: "",
  typeError: "",
  amountError: "",
  dateError: "",
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

const AddTransactionScreen = ({ navigation }) => {
  const currentUser = auth.currentUser;
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleChange = (field, value) => {
    dispatch({ type: "SET_FIELD", field, value });
  };

  const handleSaveTransaction = async () => {
    let isValid = true;
    const fields = ["type", "amount", "date"];

    fields.forEach((field) => {
      if (!state[field]) {
        dispatch({ type: "SET_ERROR", field, value: `${field} is required` });
        isValid = false;
      } else {
        dispatch({ type: "SET_ERROR", field, value: "" });
      }
    });

    if (isValid) {
      const transactionCollectionRef = collection(firestore, "transactions");
      await addDoc(transactionCollectionRef, {
        userId: currentUser.uid,
        type: state.type,
        amount: state.amount,
        date: state.date,
      });
      navigation.navigate("Dashboard");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Add Transaction</Text>
      <CustomInputField
        containerStyle={styles.inputContainer}
        value={state.type}
        onChangeText={(value) => handleChange("type", value)}
        placeholder="Type/Description"
        error={state.typeError}
      />
      <CustomInputField
        containerStyle={styles.inputContainer}
        value={state.amount}
        onChangeText={(value) => handleChange("amount", value)}
        placeholder="Amount"
        keyboardType="numeric"
        error={state.amountError}
      />
      <CustomInputField
        containerStyle={styles.inputContainer}
        value={state.date}
        onChangeText={(value) => handleChange("date", value)}
        placeholder="Date"
        error={state.dateError}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.navigate("Dashboard")}
        >
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSaveTransaction}
        >
          <Text style={styles.buttonText}>Save Transaction</Text>
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
  inputContainer: {
    marginVertical: 15,
    width: "80%",
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

export default AddTransactionScreen;
