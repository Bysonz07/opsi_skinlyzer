import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Button, Image, StyleSheet, Text, View } from "react-native";

export default function CameraModal() {
  const router = useRouter();

  // Camera permissions
  const [permission, requestPermission] = useCameraPermissions();

  // State
  const [image, setImage] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [cameraRef, setCameraRef] = useState<CameraView | null>(null);
  const [cameraType, setCameraType] = useState<CameraType>("front");

  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, [permission]);

  const takePhoto = async () => {
    if (cameraRef) {
      const photo = await cameraRef.takePictureAsync();
      setImage(photo.uri);
      setShowCamera(false);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const closeModal = () => router.back();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>AI Skin Analysis</Text>

      {showCamera ? (
        <CameraView
          style={styles.camera}
          facing={cameraType}
          ref={(ref) => setCameraRef(ref)}
        >
          <View style={styles.cameraOverlay}>
            <Button title="📸 Take Photo" onPress={takePhoto} />
            <Button title="🔁 Flip" onPress={() =>
              setCameraType((prev) => (prev === "front" ? "back" : "front"))
            } />
            <Button title="Cancel" onPress={() => setShowCamera(false)} />
          </View>
        </CameraView>
      ) : (
        <>
          {image && (
            <Image
              source={{ uri: image }}
              style={styles.preview}
              resizeMode="cover"
            />
          )}

          <View style={styles.buttonGroup}>
            <Button title="📷 Take Photo" onPress={() => setShowCamera(true)} />
            <Button title="🖼 Pick from Gallery" onPress={pickImage} />
          </View>

          {image && (
            <Button
              title="✅ Analyze Skin"
              onPress={() =>
                Alert.alert("Analyzing...", "Your image will be sent to AI backend")
              }
            />
          )}
        </>
      )}

      <Button title="Close" onPress={closeModal} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 20,
  },
  camera: {
    width: "100%",
    height: 450,
    borderRadius: 10,
    overflow: "hidden",
  },
  cameraOverlay: {
    position: "absolute",
    bottom: 20,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  preview: {
    width: 250,
    height: 250,
    borderRadius: 20,
    marginVertical: 20,
  },
  buttonGroup: {
    gap: 10,
    marginVertical: 10,
  },
});
