import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ActivityIndicator
} from "react-native";
import { analysisAPI } from "@/services/api";

export default function AnalyzeScreen() {
    const router = useRouter();
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<any>(null);

    const takePhoto = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== "granted") {
            alert("Camera permission is required!");
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            quality: 0.8,
            aspect: [1, 1],
        });

        if (!result.canceled) {
            setImageUri(result.assets[0].uri);
            setAnalysisResult(null);
        }
    };

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            quality: 0.8,
            aspect: [1, 1],
        });

        if (!result.canceled) {
            setImageUri(result.assets[0].uri);
            setAnalysisResult(null);
        }
    };

    const analyzeSkin = async () => {
        if (!imageUri) return;

        setIsAnalyzing(true);
        try {
            const result = await analysisAPI.uploadImage(imageUri, {
                timestamp: new Date().toISOString(),
            });

            // Navigate to results page with the analysis data
            router.push({
                pathname: "/results",
                params: { result: JSON.stringify(result) }
            });

        } catch (error) {
            console.error('Analysis error:', error);
            Alert.alert("Analysis Failed", "Could not analyze image. Please try again.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
        >
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>Skin Analysis</Text>
                <Text style={styles.subtitle}>
                    Upload or take a photo for AI analysis
                </Text>
            </View>

            {/* Upload Area */}
            <View style={styles.uploadCard}>
                {imageUri ? (
                    <Image source={{ uri: imageUri }} style={styles.preview} />
                ) : (
                    <View style={styles.uploadPlaceholder}>
                        <Ionicons name="camera-outline" size={48} color="#999" />
                        <Text style={styles.uploadText}>No image selected</Text>
                    </View>
                )}

                <View style={styles.buttonRow}>
                    <TouchableOpacity style={styles.button} onPress={takePhoto}>
                        <Ionicons name="camera" size={20} color="#fff" />
                        <Text style={styles.buttonText}>Take Photo</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={pickImage}>
                        <Ionicons name="image" size={20} color="#000" />
                        <Text style={[styles.buttonText, styles.secondaryButtonText]}>Gallery</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Analysis Actions */}
            {imageUri && (
                <View style={styles.analysisInfo}>
                    <Text style={styles.analysisTitle}>Ready for Analysis</Text>
                    <Text style={styles.analysisDesc}>
                        Your image is ready for AI-powered skin condition analysis
                    </Text>
                    <TouchableOpacity
                        style={[
                            styles.analyzeButton,
                            isAnalyzing && styles.analyzeButtonDisabled
                        ]}
                        onPress={analyzeSkin}
                        disabled={isAnalyzing}
                    >
                        {isAnalyzing ? (
                            <View style={styles.loadingContainer}>
                                <ActivityIndicator size="small" color="#fff" />
                                <Text style={styles.analyzeButtonText}>Analyzing...</Text>
                            </View>
                        ) : (
                            <Text style={styles.analyzeButtonText}>Analyze Skin</Text>
                        )}
                    </TouchableOpacity>
                </View>
            )}

            {/* Bottom spacer for better scrolling */}
            <View style={styles.bottomSpacer} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    scrollContent: {
        paddingHorizontal: 24,
        paddingTop: 80,
        paddingBottom: 40,
    },
    header: {
        marginBottom: 32,
    },
    title: {
        fontSize: 28,
        fontWeight: "700",
        color: "#000",
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: "#666",
    },
    uploadCard: {
        backgroundColor: "#f8f9fa",
        borderRadius: 16,
        padding: 24,
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#f1f3f4",
    },
    uploadPlaceholder: {
        width: 200,
        height: 200,
        borderRadius: 12,
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 24,
        borderWidth: 2,
        borderColor: "#e9ecef",
        borderStyle: "dashed",
    },
    preview: {
        width: 200,
        height: 200,
        borderRadius: 12,
        marginBottom: 24,
    },
    uploadText: {
        marginTop: 12,
        fontSize: 14,
        color: "#999",
    },
    buttonRow: {
        flexDirection: "row",
        gap: 12,
        width: "100%",
    },
    button: {
        flex: 1,
        flexDirection: "row",
        backgroundColor: "#000",
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    secondaryButton: {
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#000",
    },
    buttonText: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "600",
    },
    secondaryButtonText: {
        color: "#000",
    },
    analysisInfo: {
        backgroundColor: "#f0f9ff",
        borderRadius: 16,
        padding: 20,
        marginTop: 20,
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#e0f2fe",
    },
    analysisTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#0369a1",
        marginBottom: 8,
    },
    analysisDesc: {
        fontSize: 14,
        color: "#0c4a6e",
        textAlign: "center",
        marginBottom: 16,
        lineHeight: 20,
    },
    analyzeButton: {
        backgroundColor: "#0284c7",
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        minWidth: 120,
    },
    analyzeButtonDisabled: {
        backgroundColor: "#94a3b8",
    },
    loadingContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    analyzeButtonText: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "600",
    },
    bottomSpacer: {
        height: 20,
    },
});