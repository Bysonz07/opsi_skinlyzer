import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function AnalyzeScreen() {
  const [imageUri, setImageUri] = useState<string | null>(null);

  // Open camera
  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      alert("Camera permission is required!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  // Open gallery
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.title}>Skin Analysis</Text>
      <Text style={styles.subtitle}>
        Upload or take a photo for AI-powered skin condition analysis
      </Text>

      {/* Upload Card */}
      <View style={styles.card}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.preview} />
        ) : (
          <View style={styles.iconWrapper}>
            <Ionicons name="camera-outline" size={48} color="#A1A1AA" />
          </View>
        )}

        <Text style={styles.cardTitle}>Upload Skin Image</Text>
        <Text style={styles.cardSubtitle}>
          Take a clear photo of the affected area
        </Text>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.takePhotoBtn} onPress={takePhoto}>
            <Ionicons name="camera" size={18} color="#fff" />
            <Text style={styles.takePhotoText}>Take Photo</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.uploadBtn} onPress={pickImage}>
            <Ionicons name="cloud-upload-outline" size={18} color="#1F2937" />
            <Text style={styles.uploadText}>Upload</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

// ---- Styles ----
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    paddingHorizontal: 20,
    paddingTop: 80,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 32,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    paddingVertical: 32,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  iconWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  preview: {
    width: 150,
    height: 150,
    borderRadius: 12,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  cardSubtitle: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 4,
    marginBottom: 24,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
  },
  takePhotoBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#111827",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
    gap: 6,
  },
  takePhotoText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },
  uploadBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E5E7EB",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
    gap: 6,
  },
  uploadText: {
    color: "#1F2937",
    fontWeight: "600",
    fontSize: 14,
  },
});
