import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, View, TouchableOpacity, ImageBackground } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function CameraModal() {
    const router = useRouter();
    const [permission, requestPermission] = useCameraPermissions();
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

    const analyzeSkin = () => {
        Alert.alert("Analyzing...", "Your image will be sent to AI backend for skin analysis");
    };

    const closeModal = () => router.back();

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>AI Skin Analysis</Text>
                <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                    <Ionicons name="close" size={24} color="#666" />
                </TouchableOpacity>
            </View>

            {showCamera ? (
                <View style={styles.cameraContainer}>
                    <CameraView
                        style={styles.camera}
                        facing={cameraType}
                        ref={(ref) => setCameraRef(ref)}
                    >
                        <View style={styles.cameraOverlay}>
                            <View style={styles.cameraControls}>
                                <TouchableOpacity style={styles.cameraButton} onPress={() => setShowCamera(false)}>
                                    <Ionicons name="close" size={20} color="white" />
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.captureButton} onPress={takePhoto}>
                                    <View style={styles.captureButtonInner} />
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.cameraButton}
                                    onPress={() => setCameraType((prev) => (prev === "front" ? "back" : "front"))}
                                >
                                    <Ionicons name="camera-reverse" size={20} color="white" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </CameraView>
                </View>
            ) : (
                <View style={styles.content}>
                    {image ? (
                        <View style={styles.imageContainer}>
                            <ImageBackground
                                source={{ uri: image }}
                                style={styles.preview}
                                imageStyle={styles.previewImage}
                            >
                                <View style={styles.imageOverlay} />
                            </ImageBackground>
                        </View>
                    ) : (
                        <View style={styles.placeholder}>
                            <Ionicons name="camera-outline" size={64} color="#ccc" />
                            <Text style={styles.placeholderText}>No image selected</Text>
                        </View>
                    )}

                    <View style={styles.buttonGroup}>
                        <TouchableOpacity style={styles.primaryButton} onPress={() => setShowCamera(true)}>
                            <Ionicons name="camera" size={20} color="white" />
                            <Text style={styles.primaryButtonText}>Take Photo</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.secondaryButton} onPress={pickImage}>
                            <Ionicons name="images" size={20} color="#007AFF" />
                            <Text style={styles.secondaryButtonText}>Choose from Gallery</Text>
                        </TouchableOpacity>

                        {image && (
                            <TouchableOpacity style={styles.analyzeButton} onPress={analyzeSkin}>
                                <Ionicons name="analytics" size={20} color="white" />
                                <Text style={styles.analyzeButtonText}>Analyze Skin</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8f9fa",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 20,
        backgroundColor: "white",
        borderBottomWidth: 1,
        borderBottomColor: "#e5e5e5",
    },
    title: {
        fontSize: 20,
        fontWeight: "700",
        color: "#1a1a1a",
    },
    closeButton: {
        padding: 4,
    },
    cameraContainer: {
        flex: 1,
        backgroundColor: "black",
    },
    camera: {
        flex: 1,
    },
    cameraOverlay: {
        flex: 1,
        backgroundColor: "transparent",
        justifyContent: "flex-end",
    },
    cameraControls: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 30,
        paddingBottom: 40,
    },
    cameraButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: "rgba(0,0,0,0.3)",
        justifyContent: "center",
        alignItems: "center",
    },
    captureButton: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: "white",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 4,
        borderColor: "rgba(255,255,255,0.3)",
    },
    captureButtonInner: {
        width: 58,
        height: 58,
        borderRadius: 29,
        backgroundColor: "white",
    },
    content: {
        flex: 1,
        padding: 20,
        justifyContent: "space-between",
    },
    imageContainer: {
        alignItems: "center",
        marginTop: 20,
    },
    preview: {
        width: 280,
        height: 280,
        borderRadius: 20,
        overflow: "hidden",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 8,
    },
    previewImage: {
        borderRadius: 20,
    },
    imageOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0,0,0,0.1)",
    },
    placeholder: {
        width: 280,
        height: 280,
        borderRadius: 20,
        backgroundColor: "#f0f0f0",
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
        borderWidth: 2,
        borderColor: "#e0e0e0",
        borderStyle: "dashed",
    },
    placeholderText: {
        marginTop: 12,
        fontSize: 16,
        color: "#999",
        fontWeight: "500",
    },
    buttonGroup: {
        gap: 12,
        marginBottom: 30,
    },
    primaryButton: {
        flexDirection: "row",
        backgroundColor: "#007AFF",
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        shadowColor: "#007AFF",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    primaryButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "600",
    },
    secondaryButton: {
        flexDirection: "row",
        backgroundColor: "white",
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        borderWidth: 1,
        borderColor: "#e0e0e0",
    },
    secondaryButtonText: {
        color: "#007AFF",
        fontSize: 16,
        fontWeight: "600",
    },
    analyzeButton: {
        flexDirection: "row",
        backgroundColor: "#34C759",
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        shadowColor: "#34C759",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    analyzeButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "600",
    },
});