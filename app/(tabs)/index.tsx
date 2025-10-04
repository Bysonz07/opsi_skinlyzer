import { Feather, Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      {/* Top section */}
      <View style={styles.header}>
        <Ionicons name="shield-outline" size={64} color="#fff" style={styles.iconBg} />
        <Text style={styles.title}>Welcome to SkinAnalyzer</Text>
        <Text style={styles.subtitle}>
          Your personal AI-powered skin health companion
        </Text>
      </View>

      {/* Start Analysis Button */}
      <Link href="/modal" asChild>
        <TouchableOpacity style={styles.button}>
          <Feather name="camera" size={18} color="#fff" />
          <Text style={styles.buttonText}> Start Analysis </Text>
        </TouchableOpacity>
      </Link>


      {/* Info text */}
      <Text style={styles.infoText}>
        Take a photo and get instant AI analysis with personalized treatment recommendations
      </Text>

      {/* Feature Icons */}
      <View style={styles.features}>
        <View style={styles.featureItem}>
          <Feather name="camera" size={28} color="#111" />
          <Text style={styles.featureText}>Analyze</Text>
        </View>
        <View style={styles.featureItem}>
          <Feather name="edit-3" size={28} color="#111" />
          <Text style={styles.featureText}>Treat</Text>
        </View>
        <View style={styles.featureItem}>
          <Feather name="heart" size={28} color="#111" />
          <Text style={styles.featureText}>Heal</Text>
        </View>
      </View>

      {/* Footer disclaimer */}
      <Text style={styles.footer}>
        For informational purposes only. Always consult a healthcare professional for medical advice.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  iconBg: {
    backgroundColor: "#111",
    borderRadius: 50,
    padding: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    color: "#111",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginTop: 4,
  },
  button: {
    flexDirection: "row",
    backgroundColor: "#111",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  infoText: {
    color: "#666",
    fontSize: 13,
    textAlign: "center",
    marginVertical: 20,
    paddingHorizontal: 30,
  },
  features: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 20,
  },
  featureItem: {
    alignItems: "center",
  },
  featureText: {
    marginTop: 6,
    fontSize: 13,
    color: "#111",
  },
  footer: {
    fontSize: 11,
    color: "#888",
    textAlign: "center",
    marginTop: 30,
  },
});
