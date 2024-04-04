import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { firestore, auth } from "../services/FirebaseSetup";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";

const TransactionHistoryScreen = ({ navigation }) => {
  const currentUser = auth.currentUser;
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      const transactionCollectionRef = collection(firestore, "transactions");
      const transactionQuery = query(
        transactionCollectionRef,
        where("userId", "==", currentUser.uid),
        orderBy("date", "desc")
      );
      const querySnapshot = await getDocs(transactionQuery);
      const transactionsData = [];
      querySnapshot.forEach((doc) => {
        transactionsData.push({ id: doc.id, ...doc.data() });
      });
      setTransactions(transactionsData);
    };

    fetchTransactions();
  }, [currentUser]);

  return (
    <View style={styles.container}>
      <Text style={styles.pageHeader}>Recent Transactions</Text>
      <ScrollView contentContainerStyle={styles.transactionsContainer}>
        {transactions.map((transaction) => (
          <View key={transaction.id} style={styles.transactionText}>
            <View style={styles.transactionInfo}>
              <Text style={styles.transactionType}>{transaction.type}</Text>
              <Text style={styles.transactionDate}>{transaction.date}</Text>
            </View>
            <Text style={styles.transactionAmount}>
              {/* Format amount here */}
              {parseFloat(transaction.amount).toLocaleString("en-CA", {
                style: "currency",
                currency: "CAD",
              })}
            </Text>
          </View>
        ))}
      </ScrollView>
      {/* Back button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate("Dashboard")}
      >
        <FontAwesome name="chevron-left" size={20} color="#3777bc" />
        <Text style={styles.backButtonText}>Back to Dashboard</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 20,
    marginTop: 60,
    marginBottom: 20,
  },
  pageHeader: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    alignSelf: "center",
  },
  transactionsContainer: {
    marginTop: 10,
  },
  transactionText: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    backgroundColor: "#E3E3E3",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  transactionInfo: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  transactionType: {
    fontSize: 16,
    fontWeight: "bold",
  },
  transactionDate: {
    fontSize: 12,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: "bold",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
    paddingHorizontal: 10,
  },
  backButtonText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#3777bc",
    fontWeight: "bold",
  },
});

export default TransactionHistoryScreen;
