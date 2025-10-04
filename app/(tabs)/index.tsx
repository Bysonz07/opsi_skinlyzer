import { Feather, Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function HomeScreen() {
    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.iconContainer}>
                    <Ionicons name="shield" size={32} color="#fff" />
                </View>
                <Text style={styles.title}>SkinAnalyzer</Text>
                <Text style={styles.subtitle}>
                    AI-powered skin health analysis
                </Text>
            </View>

            {/* Main Action */}
            <Link href="/modal" asChild>
                <TouchableOpacity style={styles.primaryButton}>
                    <Feather name="camera" size={20} color="#fff" />
                    <Text style={styles.primaryButtonText}>Start Analysis</Text>
                </TouchableOpacity>
            </Link>

            {/* Features */}
            <View style={styles.features}>
                <View style={styles.feature}>
                    <View style={[styles.featureIcon, { backgroundColor: '#6366f1' }]}>
                        <Feather name="zap" size={20} color="#fff" />
                    </View>
                    <Text style={styles.featureTitle}>Instant Analysis</Text>
                    <Text style={styles.featureDesc}>AI-powered skin condition detection</Text>
                </View>

                <View style={styles.feature}>
                    <View style={[styles.featureIcon, { backgroundColor: '#10b981' }]}>
                        <Feather name="clipboard" size={20} color="#fff" />
                    </View>
                    <Text style={styles.featureTitle}>Treatment Plans</Text>
                    <Text style={styles.featureDesc}>Personalized care recommendations</Text>
                </View>

                <View style={styles.feature}>
                    <View style={[styles.featureIcon, { backgroundColor: '#f59e0b' }]}>
                        <Feather name="trending-up" size={20} color="#fff" />
                    </View>
                    <Text style={styles.featureTitle}>Progress Tracking</Text>
                    <Text style={styles.featureDesc}>Monitor your skin health journey</Text>
                </View>
            </View>

            {/* Footer */}
            <Text style={styles.footer}>
                For informational purposes only. Consult a healthcare professional for medical advice.
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingHorizontal: 24,
        paddingTop: 80,
        paddingBottom: 40,
    },
    header: {
        alignItems: "center",
        marginBottom: 60,
    },
    iconContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: "#000",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 16,
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
        textAlign: "center",
    },
    primaryButton: {
        flexDirection: "row",
        backgroundColor: "#000",
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 40,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    primaryButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
        marginLeft: 8,
    },
    features: {
        gap: 16,
        marginBottom: 40,
    },
    feature: {
        backgroundColor: "#f8f9fa",
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: "#f1f3f4",
    },
    featureIcon: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 12,
    },
    featureTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: "#000",
        marginBottom: 4,
    },
    featureDesc: {
        fontSize: 14,
        color: "#666",
        lineHeight: 20,
    },
    footer: {
        fontSize: 12,
        color: "#999",
        textAlign: "center",
        lineHeight: 16,
    },
});