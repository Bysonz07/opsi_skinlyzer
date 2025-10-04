import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function CameraModal() {
    const router = useRouter();
    const [permission, requestPermission] = useCameraPermissions();
    const [image, setImage] = useState<string | null>(null);
    const [showCamera, setShowCamera] = useState(false);
    const [cameraRef, setCameraRef] = useState<CameraView | null>(null);
    const [cameraType, setCameraType] = useState<CameraType>("back");

    useEffect(() => {
        if (!permission) {
            requestPermission();
        }
    }, [permission]);

    const takePhoto = async () => {
        if (cameraRef) {
            try {
                const photo = await cameraRef.takePictureAsync();
                setImage(photo.uri);
                setShowCamera(false);
            } catch (error) {
                Alert.alert("Error", "Failed to take photo");
            }
        }
    };

    const pickImage = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
            });

            if (!result.canceled) {
                setImage(result.assets[0].uri);
            }
        } catch (error) {
            Alert.alert("Error", "Failed to pick image");
        }
    };

    const analyzeSkin = () => {
        Alert.alert(
            "Analysis Complete",
            "Your skin analysis has been processed successfully!",
            [
                {
                    text: "View Results",
                    onPress: () => {
                        setImage(null);
                        router.back();
                    }
                },
                {
                    text: "OK",
                    style: "cancel",
                    onPress: () => {
                        setImage(null);
                        router.back();
                    }
                }
            ]
        );
    };

    const closeModal = () => {
        setImage(null);
        router.back();
    };

    if (showCamera) {
        return (
            <View style={styles.cameraContainer}>
                <CameraView
                    style={styles.camera}
                    facing={cameraType}
                    ref={(ref) => setCameraRef(ref)}
                >
                    <View style={styles.cameraOverlay}>
                        {/* Camera Frame */}
                        <View style={styles.cameraFrame}>
                            <View style={styles.cornerTL} />
                            <View style={styles.cornerTR} />
                            <View style={styles.cornerBL} />
                            <View style={styles.cornerBR} />
                        </View>

                        <View style={styles.cameraControls}>
                            <TouchableOpacity
                                style={styles.cameraButton}
                                onPress={() => setShowCamera(false)}
                            >
                                <Ionicons name="close" size={24} color="#fff" />
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.captureButton} onPress={takePhoto}>
                                <View style={styles.captureButtonInner} />
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.cameraButton}
                                onPress={() => setCameraType((prev) => (prev === "back" ? "front" : "back"))}
                            >
                                <Ionicons name="camera-reverse" size={24} color="#fff" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </CameraView>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* No Header - Clean Design */}

            {image ? (
                <View style={styles.previewContainer}>
                    <Image source={{ uri: image }} style={styles.previewImage} />

                    <View style={styles.previewActions}>
                        <TouchableOpacity
                            style={styles.retakeButton}
                            onPress={() => setImage(null)}
                        >
                            <Ionicons name="camera-reverse" size={20} color="#fff" />
                            <Text style={styles.retakeButtonText}>Retake</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.analyzeButton}
                            onPress={analyzeSkin}
                        >
                            <Ionicons name="analytics" size={20} color="#fff" />
                            <Text style={styles.analyzeButtonText}>Analyze</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            ) : (
                <View style={styles.content}>
                    {/* Main Action Card */}
                    <View style={styles.actionCard}>
                        <View style={styles.iconContainer}>
                            <Ionicons name="camera" size={32} color="#6366f1" />
                        </View>

                        <Text style={styles.title}>Skin Analysis</Text>
                        <Text style={styles.subtitle}>
                            Take a clear photo of the affected area for AI-powered analysis
                        </Text>

                        <View style={styles.buttonGroup}>
                            <TouchableOpacity
                                style={styles.primaryButton}
                                onPress={() => setShowCamera(true)}
                            >
                                <Ionicons name="camera" size={20} color="#fff" />
                                <Text style={styles.primaryButtonText}>Take Photo</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.secondaryButton}
                                onPress={pickImage}
                            >
                                <Ionicons name="images" size={20} color="#6366f1" />
                                <Text style={styles.secondaryButtonText}>Choose from Gallery</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Tips Section */}
                    <View style={styles.tipsCard}>
                        <Text style={styles.tipsTitle}>📸 Tips for Best Results</Text>
                        <View style={styles.tipItem}>
                            <Ionicons name="checkmark-circle" size={16} color="#10b981" />
                            <Text style={styles.tipText}>Good lighting conditions</Text>
                        </View>
                        <View style={styles.tipItem}>
                            <Ionicons name="checkmark-circle" size={16} color="#10b981" />
                            <Text style={styles.tipText}>Clear focus on the skin area</Text>
                        </View>
                        <View style={styles.tipItem}>
                            <Ionicons name="checkmark-circle" size={16} color="#10b981" />
                            <Text style={styles.tipText}>No filters or edits</Text>
                        </View>
                    </View>
                </View>
            )}

            {/* Close Button */}
            {!showCamera && (
                <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                    <Ionicons name="close" size={24} color="#666" />
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        padding: 20,
        justifyContent: "center",
    },
    cameraContainer: {
        flex: 1,
        backgroundColor: "#000",
    },
    camera: {
        flex: 1,
    },
    cameraOverlay: {
        flex: 1,
        backgroundColor: "transparent",
        justifyContent: "space-between",
        padding: 20,
    },
    cameraFrame: {
        flex: 1,
        margin: 40,
        borderWidth: 2,
        borderColor: "rgba(255,255,255,0.3)",
        borderRadius: 20,
        position: "relative",
    },
    cornerTL: {
        position: "absolute",
        top: -2,
        left: -2,
        width: 30,
        height: 30,
        borderTopWidth: 3,
        borderLeftWidth: 3,
        borderColor: "#6366f1",
        borderTopLeftRadius: 10,
    },
    cornerTR: {
        position: "absolute",
        top: -2,
        right: -2,
        width: 30,
        height: 30,
        borderTopWidth: 3,
        borderRightWidth: 3,
        borderColor: "#6366f1",
        borderTopRightRadius: 10,
    },
    cornerBL: {
        position: "absolute",
        bottom: -2,
        left: -2,
        width: 30,
        height: 30,
        borderBottomWidth: 3,
        borderLeftWidth: 3,
        borderColor: "#6366f1",
        borderBottomLeftRadius: 10,
    },
    cornerBR: {
        position: "absolute",
        bottom: -2,
        right: -2,
        width: 30,
        height: 30,
        borderBottomWidth: 3,
        borderRightWidth: 3,
        borderColor: "#6366f1",
        borderBottomRightRadius: 10,
    },
    cameraControls: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingBottom: 40,
    },
    cameraButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    captureButton: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 4,
        borderColor: "rgba(99, 102, 241, 0.3)",
    },
    captureButtonInner: {
        width: 58,
        height: 58,
        borderRadius: 29,
        backgroundColor: "#6366f1",
    },
    content: {
        flex: 1,
        justifyContent: "center",
        gap: 24,
    },
    actionCard: {
        backgroundColor: "#f8f9fa",
        borderRadius: 20,
        padding: 32,
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#e5e7eb",
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: "rgba(99, 102, 241, 0.1)",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: "700",
        color: "#000",
        textAlign: "center",
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: "#666",
        textAlign: "center",
        marginBottom: 32,
        lineHeight: 22,
    },
    buttonGroup: {
        width: "100%",
        gap: 12,
    },
    primaryButton: {
        flexDirection: "row",
        backgroundColor: "#6366f1",
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
    },
    primaryButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
    secondaryButton: {
        flexDirection: "row",
        backgroundColor: "transparent",
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        borderWidth: 1,
        borderColor: "#6366f1",
    },
    secondaryButtonText: {
        color: "#6366f1",
        fontSize: 16,
        fontWeight: "600",
    },
    tipsCard: {
        backgroundColor: "#f8f9fa",
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: "#e5e7eb",
    },
    tipsTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#000",
        marginBottom: 16,
    },
    tipItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        marginBottom: 12,
    },
    tipText: {
        fontSize: 14,
        color: "#666",
        flex: 1,
    },
    previewContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 32,
    },
    previewImage: {
        width: 280,
        height: 280,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: "#e5e7eb",
    },
    previewActions: {
        flexDirection: "row",
        gap: 16,
    },
    retakeButton: {
        flexDirection: "row",
        backgroundColor: "#6366f1",
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 10,
        alignItems: "center",
        gap: 8,
    },
    retakeButtonText: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "600",
    },
    analyzeButton: {
        flexDirection: "row",
        backgroundColor: "#10b981",
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 10,
        alignItems: "center",
        gap: 8,
    },
    analyzeButtonText: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "600",
    },
    closeButton: {
        position: "absolute",
        top: 50,
        right: 20,
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: "#f8f9fa",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#e5e7eb",
    },
});