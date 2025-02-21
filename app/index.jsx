import { StyleSheet, View } from "react-native";
import React from "react";
import App from "../components/SportList";
export default function Page() {
  return (
    <View style={styles.container}>
      
        <App />
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
