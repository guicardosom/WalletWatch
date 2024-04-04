import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { firestore, auth } from "../services/FirebaseSetup";
import { doc, getDoc } from "firebase/firestore";

const DashboardScreen = ({ navigation }) => {
  const currentUser = auth.currentUser;
  const [userProfile, setUserProfile] = useState(null);
  const [recentTransactions, setRecentTransactions] = useState([]);

  useEffect(() => {
    const fetchProfileData = async () => {
      const userDocRef = doc(firestore, "users", currentUser.uid);
      const docSnap = await getDoc(userDocRef);
      if (docSnap.exists()) {
        const userData = docSnap.data();
        setUserProfile(userData);
      }
    };

    // Simulate fetching recent transactions
    const recentTransactionsData = [
      { id: 1, amount: 100, type: "Income", date: "2024-03-10" },
      { id: 2, amount: -50, type: "Expense", date: "2024-03-09" },
      { id: 3, amount: -30, type: "Expense", date: "2024-03-08" },
    ];
    setRecentTransactions(recentTransactionsData);

    fetchProfileData();
  }, [currentUser]);

  return (
    <View style={styles.container}>
      {/* Profile Picture and Greeting */}
      <View style={styles.profileContainer}>
        <Image
          source={
            userProfile && userProfile.profileImage
              ? { uri: userProfile.profileImage }
              : require("../../assets/images/default-profile-pic.png")
          }
          style={styles.profileImage}
        />
        <Text style={styles.greeting}>
          Good afternoon,{" "}
          {userProfile && `${userProfile.firstName} ${userProfile.lastName}`}!
        </Text>
      </View>

      {/* User Information */}
      <View style={styles.userInfoContainer}>
        <Text style={styles.userInfoText}>
          Total Balance: {userProfile && userProfile.totalBalance}
        </Text>
        <Text style={styles.userInfoText}>
          Monthly Income: {userProfile && userProfile.monthlyIncome}
        </Text>
        {/* Add calculation for total expenses */}
      </View>

      {/* Recent Transactions */}
      <View style={styles.transactionsContainer}>
        <Text style={styles.transactionsHeader}>Recent Transactions:</Text>
        {recentTransactions.map((transaction) => (
          <Text key={transaction.id} style={styles.transactionText}>
            {transaction.type}: ${transaction.amount} - {transaction.date}
          </Text>
        ))}
        <TouchableOpacity
          onPress={() => navigation.navigate("TransactionHistory")}
          style={styles.seeAllButton}
        >
          <Text style={styles.seeAllButtonText}>See All</Text>
        </TouchableOpacity>
      </View>

      {/* Navigation Icons */}
      <View style={styles.navigationContainer}>
        <TouchableOpacity
          style={styles.navigationIcon}
          onPress={() => navigation.navigate("Dashboard")}
        >
          {/* Icon for home */}
          <FontAwesome name="home" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navigationIcon}
          onPress={() => navigation.navigate("TransactionHistory")}
        >
          {/* Icon for transactions */}
          <FontAwesome name="exchange" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navigationIcon}
          onPress={() => navigation.navigate("AddTransaction")}
        >
          {/* Icon for add new transactions */}
          <FontAwesome name="plus" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navigationIcon}
          onPress={() => navigation.navigate("Profile")}
        >
          {/* Icon for profile */}
          <FontAwesome name="user" size={24} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50,
    marginHorizontal: 30,
    //justifyContent: "space-between",
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  greeting: {
    fontSize: 18,
  },
  userInfoContainer: {
    marginBottom: 20,
  },
  userInfoText: {
    fontSize: 16,
    marginBottom: 5,
  },
  transactionsContainer: {
    marginBottom: 20,
  },
  transactionsHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  transactionText: {
    fontSize: 16,
    marginBottom: 5,
  },
  seeAllButton: {
    marginTop: 10,
  },
  seeAllButtonText: {
    color: "blue",
  },
  navigationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    backgroundColor: "#f0f0f0",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  navigationIcon: {
    alignItems: "center",
    paddingHorizontal: 20,
  },
});

export default DashboardScreen;
