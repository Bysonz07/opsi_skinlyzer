import { Feather, Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View, Alert } from "react-native";
import { testConnection, healthAPI } from "@/services/api";

export default function HomeScreen() {
    const [isConnected, setIsConnected] = useState<boolean | null>(null);

    const checkAPIConnection = async () => {
        try {
            const connected = await testConnection();
            setIsConnected(connected);

            if (connected) {
                Alert.alert("✅ Connected", "API is working correctly!");
            } else {
                Alert.alert("❌ Connection Failed", "Could not connect to API");
            }
        } catch (error) {
            setIsConnected(false);
            Alert.alert("❌ Connection Error", "Check your network and API server");
        }
    };

    useEffect(() => {
        checkAPIConnection();
    }, []);

    return (
        <View style={styles.container}>
            {/* Connection Status */}
            <View style={styles.connectionStatus}>
                <Text style={styles.connectionText}>
                    API: {isConnected === null ? "Checking..." : isConnected ? "✅ Connected" : "❌ Disconnected"}
                </Text>
                <TouchableOpacity onPress={checkAPIConnection} style={styles.testButton}>
                    <Text style={styles.testButtonText}>Test</Text>
                </TouchableOpacity>
            </View>

            {/* Rest of your existing home screen content */}
            <View style={styles.header}>
                <Ionicons name="shield-outline" size={64} color="#fff" style={styles.iconBg} />
                <Text style={styles.title}>Welcome to SkinAnalyzer</Text>
                <Text style={styles.subtitle}>
                    Your personal AI-powered skin health companion
                </Text>
            </View>

            <Link href="/analyze" asChild>
                <TouchableOpacity style={styles.button}>
                    <Feather name="camera" size={18} color="#fff" />
                    <Text style={styles.buttonText}> Start Analysis </Text>
                </TouchableOpacity>
            </Link>

            {/* ... rest of your home screen */}
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
    connectionStatus: {
        position: 'absolute',
        top: 50,
        right: 20,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        padding: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    connectionText: {
        fontSize: 12,
        marginRight: 8,
    },
    testButton: {
        backgroundColor: '#000',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    testButtonText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: '600',
    },
    // ... your existing styles
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
});