import { useRef, useState, useEffect } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const CustomInputField = ({
  containerStyle,
  placeholder,
  onChangeText,
  error,
  value,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [text, setText] = useState(value || "");
  const [showPassword, setShowPassword] = useState(props.secureTextEntry);
  const labelPosition = useRef(new Animated.Value(text ? 1 : 0)).current;

  useEffect(() => {
    setText(value || "");
    if (value) {
      animatedLabel(1);
    }
  }, [value]);

  const handleFocus = () => {
    setIsFocused(true);
    animatedLabel(1);
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (!text) {
      animatedLabel(0);
    }
  };

  const handleTextChange = (text) => {
    setText(text);
    if (onChangeText) {
      onChangeText(text);
    }
    if (text) {
      animatedLabel(1);
    } else {
      animatedLabel(isFocused ? 1 : 0);
    }
  };

  const animatedLabel = (toValue) => {
    Animated.timing(labelPosition, {
      toValue: toValue,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const labelStyle = {
    left: 25,
    top: labelPosition.interpolate({
      inputRange: [0, 1],
      outputRange: [17, 0],
    }),
    fontSize: labelPosition.interpolate({
      inputRange: [0, 1],
      outputRange: [16, 14],
    }),
    color: labelPosition.interpolate({
      inputRange: [0, 1],
      outputRange: [
        error ? "red" : "gray",
        error ? "red" : isFocused ? "#3777bc" : "gray",
      ],
    }),
  };

  const containerBorder = {
    borderColor: isFocused ? "#3777bc" : "#ccc",
  };

  return (
    <View style={containerStyle}>
      <View
        style={[
          styles.innerContainer,
          containerBorder,
          error && { borderColor: "red" },
        ]}
      >
        <Animated.Text style={[styles.label, labelStyle]}>
          {placeholder}
        </Animated.Text>
        <View style={styles.inputContainer}>
          <TextInput
            {...props}
            style={styles.input}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChangeText={handleTextChange}
            value={text}
            textAlignVertical="center"
            textContentType={
              props.secureTextEntry ? "newPassword" : props.secureTextEntry
            }
            secureTextEntry={showPassword}
          />
          {props.secureTextEntry && !!text && (
            <View>
              <TouchableOpacity
                style={{ width: 24 }}
                onPress={() => setShowPassword(!showPassword)}
              >
                {!showPassword ? (
                  <Icon name="eye-outline" color={"gray"} size={24} />
                ) : (
                  <Icon name="eye-off-outline" color={"gray"} size={24} />
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  innerContainer: {
    borderWidth: 1,
    borderRadius: 5,
    height: 60,
    justifyContent: "center",
  },
  label: {
    position: "absolute",
    fontFamily: "OpenSans",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    fontSize: 16,
    height: 50,
    marginTop: 10,
    paddingHorizontal: 25,
  },
  errorText: {
    marginTop: 5,
    fontSize: 14,
    color: "red",
  },
});

export default CustomInputField;
