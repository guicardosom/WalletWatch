import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import * as Notifications from "expo-notifications";
import { firestore, auth } from "../services/FirebaseSetup";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  orderBy,
  getDocs,
} from "firebase/firestore";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const DashboardScreen = ({ navigation }) => {
  const currentUser = auth.currentUser;
  const [userProfile, setUserProfile] = useState(null);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [totalExpenses, setTotalExpenses] = useState(0);

  useEffect(() => {
    const fetchProfileData = async () => {
      const userDocRef = doc(firestore, "users", currentUser.uid);
      const docSnap = await getDoc(userDocRef);
      if (docSnap.exists()) {
        const userData = docSnap.data();
        setUserProfile(userData);
      }
    };

    const fetchRecentTransactions = async () => {
      const transactionCollectionRef = collection(firestore, "transactions");
      const transactionQuery = query(
        transactionCollectionRef,
        where("userId", "==", currentUser.uid),
        orderBy("date", "desc")
      );
      const querySnapshot = await getDocs(transactionQuery);
      const transactions = [];
      let totalExpensesTemp = 0;
      querySnapshot.forEach((doc) => {
        const transactionData = { id: doc.id, ...doc.data() };
        transactions.push(transactionData);
        totalExpensesTemp += parseFloat(transactionData.amount);
      });
      setTotalExpenses(totalExpensesTemp);
      setRecentTransactions(transactions.slice(0, 4)); // Limiting to 4 recent transactions
    };

    fetchProfileData();
    fetchRecentTransactions();
  }, [currentUser]);

  // Request notification permissions when component mounts
  useEffect(() => {
    const requestPermissions = async () => {
      try {
        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== "granted") {
          console.log("Notification permissions not granted");
        } else {
          console.log("Notification permissions granted");
        }
      } catch (error) {
        console.error("Failed to request notification permissions:", error);
      }
    };

    requestPermissions();
  }, [Notifications]);

  useEffect(() => {
    if (totalExpenses > monthlyIncome) {
      sendNotification();
    }
  }, [totalExpenses, monthlyIncome]);

  const sendNotification = async (
    title = "Expenses Exceeded!",
    body = "Your expenses have exceeded your income."
  ) => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
        },
        trigger: null,
      });
    } catch (error) {
      console.error("Failed to schedule notification:", error);
    }
  };

  // Convert totalBalance and monthlyIncome strings to numbers
  const totalBalance = parseFloat(userProfile?.totalBalance) || 0;
  const monthlyIncome = parseFloat(userProfile?.monthlyIncome) || 0;

  // Format totalBalance and monthlyIncome as money
  const formattedTotalBalance = totalBalance.toLocaleString("en-CA", {
    style: "currency",
    currency: "CAD",
  });

  const formattedMonthlyIncome = monthlyIncome.toLocaleString("en-CA", {
    style: "currency",
    currency: "CAD",
  });

  return (
    <View style={styles.container}>
      {/* Profile Picture and Greeting */}
      <View style={styles.greetingsContainer}>
        <Image
          source={
            userProfile && userProfile.profileImage
              ? { uri: userProfile.profileImage }
              : require("../../assets/images/default-profile-pic.png")
          }
          style={styles.profileImage}
        />
        <View>
          <Text style={styles.greeting}>Good afternoon,</Text>
          <Text style={styles.name}>
            {userProfile && `${userProfile.firstName} ${userProfile.lastName}`}
          </Text>
        </View>
      </View>

      <View style={styles.contentContainer}>
        {/* User Information */}
        <View style={styles.userInfoContainer}>
          <View>
            <Text style={styles.labelText}>Total Balance</Text>
            <Text style={styles.valueText}>{formattedTotalBalance}</Text>
          </View>
          <View style={styles.inlineContainer}>
            <View style={styles.inlineItem}>
              <View style={styles.iconLabelContainer}>
                <FontAwesome name="plus-circle" size={18} color="white" />
                <Text style={styles.labelText}>Income</Text>
              </View>
              <Text style={styles.valueText}>{formattedMonthlyIncome}</Text>
            </View>

            <View style={styles.inlineItem}>
              <View style={styles.iconLabelContainer}>
                <FontAwesome name="minus-circle" size={18} color="white" />
                <Text style={styles.labelText}>Expense</Text>
              </View>
              <Text style={styles.valueText}>
                {totalExpenses.toLocaleString("en-CA", {
                  style: "currency",
                  currency: "CAD",
                })}
              </Text>
            </View>
          </View>
        </View>

        {/* Recent Transactions */}
        <View style={styles.transactionsContainer}>
          <View style={styles.transactionsHeaderContainer}>
            <Text style={styles.transactionsHeader}>Recent Transactions</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("TransactionHistory")}
            >
              <Text style={styles.seeAllButtonText}>See All</Text>
            </TouchableOpacity>
          </View>
          {recentTransactions.map((transaction) => (
            <View key={transaction.id} style={styles.transactionText}>
              <View style={styles.transactionInfo}>
                <Text style={styles.transactionType}>{transaction.type}</Text>
                <Text style={styles.transactionDate}>{transaction.date}</Text>
              </View>
              <Text style={styles.transactionAmount}>
                {parseFloat(transaction.amount).toLocaleString("en-CA", {
                  style: "currency",
                  currency: "CAD",
                })}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Navigation Icons */}
      <View style={styles.navigationContainer}>
        <TouchableOpacity
          style={styles.navigationIcon}
          onPress={() => navigation.navigate("Dashboard")}
        >
          {/* Icon for home */}
          <FontAwesome name="home" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navigationIcon}
          onPress={() => navigation.navigate("TransactionHistory")}
        >
          {/* Icon for transactions */}
          <FontAwesome name="exchange" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navigationIcon}
          onPress={() => navigation.navigate("AddTransaction")}
        >
          {/* Icon for add new transactions */}
          <FontAwesome name="plus" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navigationIcon}
          onPress={() => navigation.navigate("Profile")}
        >
          {/* Icon for profile */}
          <FontAwesome name="user" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  greetingsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: "#3777bc",
    paddingVertical: 45,
  },
  profileImage: {
    width: 75,
    height: 75,
    borderRadius: 50,
    marginRight: 25,
  },
  greeting: {
    fontSize: 14,
    color: "white",
  },
  name: {
    fontSize: 22,
    color: "white",
    fontWeight: "bold",
  },
  contentContainer: {
    width: "80%",
    alignSelf: "center",
    marginTop: -50,
  },
  userInfoContainer: {
    backgroundColor: "#5a9bd5",
    padding: 15,
    borderRadius: 20,
    marginBottom: 20,
  },
  inlineContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
  iconLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  inlineItem: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  labelText: {
    fontSize: 16,
    color: "white",
    paddingLeft: 10,
    alignSelf: "center",
  },
  valueText: {
    fontSize: 24,
    color: "white",
    alignSelf: "center",
    fontWeight: "bold",
  },
  transactionsContainer: {
    marginTop: 30,
  },
  transactionsHeaderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
  },
  transactionsHeader: {
    fontSize: 18,
    fontWeight: "bold",
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
  seeAllButtonText: {
    color: "#5a9bd5",
  },
  navigationContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    paddingVertical: 15,
    backgroundColor: "#3777bc",
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
