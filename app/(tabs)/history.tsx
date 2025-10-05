import { Ionicons } from "@expo/vector-icons";
import React, { useState, useCallback, useEffect } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    ActivityIndicator, Alert
} from "react-native";
import { analysisAPI } from "@/services/api";
import { debounce } from "@/components/utils/searchUtils";

export default function HistoryScreen() {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");

    // Load data from API
    const loadHistory = async (statusFilter?: string, search?: string) => {
        try {
            setLoading(true);
            const historyData = await analysisAPI.getHistory({
                status: statusFilter,
                search: search
            });
            setData(historyData);
        } catch (error) {
            console.error('Failed to load history:', error);
            Alert.alert("Error", "Failed to load analysis history");
        } finally {
            setLoading(false);
        }
    };

    // Debounced search
    const handleSearchChange = useCallback(
        debounce((text: string) => {
            setSearchQuery(text);
            loadHistory(filter !== "All" ? filter : undefined, text);
        }, 300),
        [filter]
    );

    // Load data on component mount and when filter changes
    useEffect(() => {
        loadHistory(filter !== "All" ? filter : undefined, searchQuery);
    }, [filter]);

    if (loading && data.length === 0) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#000" />
                <Text style={styles.loadingText}>Loading history...</Text>
            </View>
        );
    }

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
        >
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>Analysis History</Text>
                <Text style={styles.subtitle}>Track your skin health journey</Text>
            </View>

            {data.length > 0 ? (
                <>
                    {/* Stats */}
                    <View style={styles.stats}>
                        <View style={styles.statCard}>
                            <Text style={styles.statNumber}>{data.length}</Text>
                            <Text style={styles.statLabel}>Total Analyses</Text>
                        </View>
                        <View style={styles.statCard}>
                            <Text style={styles.statNumber}>
                                {data.filter(d => d.status === "Resolved").length}
                            </Text>
                            <Text style={styles.statLabel}>Resolved</Text>
                        </View>
                    </View>

                    {/* Search Bar */}
                    <View style={styles.searchContainer}>
                        <View style={styles.searchBar}>
                            <Ionicons name="search-outline" size={20} color="#999" />
                            <TextInput
                                placeholder="Search conditions or notes..."
                                placeholderTextColor="#999"
                                style={styles.searchInput}
                                onChangeText={handleSearchChange}
                            />
                        </View>
                    </View>

                    {/* Analysis List */}
                    <View style={styles.list}>
                        {data.map((item) => (
                            <View key={item.id} style={styles.card}>
                                <View style={styles.cardHeader}>
                                    <Text style={styles.condition}>{item.condition}</Text>
                                    <View style={[
                                        styles.severity,
                                        item.severity === "Low" ? styles.severityLow : styles.severityMedium
                                    ]}>
                                        <Text style={styles.severityText}>{item.severity}</Text>
                                    </View>
                                </View>

                                <View style={styles.cardDetails}>
                                    <View style={styles.date}>
                                        <Ionicons name="calendar-outline" size={14} color="#666" />
                                        <Text style={styles.dateText}>{item.date}</Text>
                                    </View>
                                    <View style={[
                                        styles.status,
                                        item.status === "Resolved" ? styles.statusResolved :
                                            item.status === "Active" ? styles.statusActive : styles.statusMonitoring
                                    ]}>
                                        <Text style={styles.statusText}>{item.status}</Text>
                                    </View>
                                </View>

                                <View style={styles.confidence}>
                                    <Text style={styles.confidenceLabel}>Confidence: {item.confidence}%</Text>
                                    <View style={styles.progressBar}>
                                        <View
                                            style={[styles.progressFill, { width: `${item.confidence}%` }]}
                                        />
                                    </View>
                                </View>

                                <Text style={styles.description}>{item.description}</Text>
                            </View>
                        ))}
                    </View>
                </>
            ) : (
                <View style={styles.emptyState}>
                    <Ionicons name="document-text-outline" size={48} color="#ccc" />
                    <Text style={styles.emptyTitle}>No Analysis History</Text>
                    <Text style={styles.emptyText}>
                        Your analysis history will appear here after you analyze some images.
                    </Text>
                </View>
            )}
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: '#666',
    },
    header: {
        marginBottom: 24,
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
    stats: {
        flexDirection: "row",
        gap: 12,
        marginBottom: 20,
    },
    statCard: {
        flex: 1,
        backgroundColor: "#f8f9fa",
        borderRadius: 12,
        padding: 16,
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#f1f3f4",
    },
    statNumber: {
        fontSize: 24,
        fontWeight: "700",
        color: "#000",
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: "#666",
    },
    searchContainer: {
        marginBottom: 16,
    },
    searchBar: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#f8f9fa",
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderWidth: 1,
        borderColor: "#f1f3f4",
    },
    searchInput: {
        flex: 1,
        marginLeft: 12,
        fontSize: 16,
        color: "#000",
    },
    list: {
        gap: 12,
        marginBottom: 40,
    },
    card: {
        backgroundColor: "#f8f9fa",
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: "#f1f3f4",
    },
    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
    condition: {
        fontSize: 16,
        fontWeight: "600",
        color: "#000",
        flex: 1,
    },
    severity: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    severityLow: {
        backgroundColor: "rgba(34, 197, 94, 0.2)",
    },
    severityMedium: {
        backgroundColor: "rgba(245, 158, 11, 0.2)",
    },
    severityText: {
        fontSize: 12,
        fontWeight: "600",
        color: "#000",
    },
    cardDetails: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
    date: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    dateText: {
        fontSize: 14,
        color: "#666",
    },
    status: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    statusResolved: {
        backgroundColor: "#10b981",
    },
    statusActive: {
        backgroundColor: "#ef4444",
    },
    statusMonitoring: {
        backgroundColor: "#f59e0b",
    },
    statusText: {
        fontSize: 12,
        fontWeight: "600",
        color: "#fff",
    },
    confidence: {
        gap: 8,
    },
    confidenceLabel: {
        fontSize: 14,
        color: "#666",
    },
    progressBar: {
        height: 4,
        backgroundColor: "#e9ecef",
        borderRadius: 2,
        overflow: "hidden",
    },
    progressFill: {
        height: "100%",
        backgroundColor: "#000",
        borderRadius: 2,
    },
    description: {
        fontSize: 14,
        color: "#666",
        marginTop: 8,
    },
    emptyState: {
        alignItems: "center",
        paddingTop: 80,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#000",
        marginTop: 16,
        marginBottom: 8,
    },
    emptyText: {
        fontSize: 14,
        color: "#666",
        textAlign: "center",
        lineHeight: 20,
    },
});