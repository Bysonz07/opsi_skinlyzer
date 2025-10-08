import { debounce } from "@/components/utils/searchUtils";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
    Alert,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
interface AnalysisResult {
    id: string;
    condition: string;
    condition_name: string;
    confidence: number;
    confidence_percentage: number;
    severity: string;
    description: string;
    recommendations: string[];
    timestamp: string;
    model_used?: string;
}

export default function HistoryScreen() {
    const router = useRouter();
    const [analyses, setAnalyses] = useState<AnalysisResult[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [filter, setFilter] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");

    // Load analyses from API
    const loadAnalyses = async (statusFilter?: string, search?: string) => {
        try {
            setLoading(true);
            // For now, we'll use mock data that matches the API response format
            // In production, this would come from your backend database
            const mockAnalyses: AnalysisResult[] = [
                {
                    id: "1",
                    condition: "nv",
                    condition_name: "Melanocytic Nevi",
                    confidence: 0.9234,
                    confidence_percentage: 92.34,
                    severity: "Low",
                    description: "Common moles, usually harmless",
                    recommendations: [
                        "Monitor for ABCDE changes",
                        "Regular self-examinations",
                        "Sun protection to prevent changes"
                    ],
                    timestamp: "2024-01-15T10:30:00.000Z",
                    model_used: "ML"
                },
                {
                    id: "2",
                    condition: "akiec",
                    condition_name: "Actinic Keratoses",
                    confidence: 0.8567,
                    confidence_percentage: 85.67,
                    severity: "Medium",
                    description: "Pre-cancerous skin growths caused by sun damage",
                    recommendations: [
                        "Consult a dermatologist for proper diagnosis",
                        "Use broad-spectrum sunscreen daily",
                        "Avoid excessive sun exposure"
                    ],
                    timestamp: "2024-01-10T14:20:00.000Z",
                    model_used: "ML"
                },
                {
                    id: "3",
                    condition: "bkl",
                    condition_name: "Benign Keratosis",
                    confidence: 0.9123,
                    confidence_percentage: 91.23,
                    severity: "Low",
                    description: "Non-cancerous skin growths, often age-related",
                    recommendations: [
                        "Usually no treatment needed",
                        "Monitor for changes in appearance",
                        "Can be removed for cosmetic reasons"
                    ],
                    timestamp: "2024-01-05T09:15:00.000Z",
                    model_used: "Mock"
                }
            ];
            setAnalyses(mockAnalyses);
        } catch (error) {
            console.error('Failed to load analyses:', error);
            Alert.alert("Error", "Failed to load analysis history");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    // Debounced search
    const handleSearchChange = useCallback(
        debounce((text: string) => {
            setSearchQuery(text);
        }, 300),
        []
    );

    // Pull to refresh
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        loadAnalyses();
    }, []);

    // Load data on component mount
    useEffect(() => {
        loadAnalyses();
    }, []);

    // Filter analyses based on search and filter
    const filteredAnalyses = analyses.filter(analysis => {
        const matchesSearch = searchQuery === '' ||
            analysis.condition_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            analysis.description.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesFilter = filter === "All" || analysis.severity === filter;

        return matchesSearch && matchesFilter;
    });

    // Severity color mapping
    const severityColors = {
        "Low": "#10b981",
        "Medium": "#f59e0b",
        "High": "#ef4444",
        "Critical": "#dc2626"
    };

    const getSeverityIcon = (severity: string) => {
        switch (severity) {
            case "Low": return "checkmark-circle";
            case "Medium": return "warning";
            case "High": return "alert-circle";
            case "Critical": return "medkit";
            default: return "help-circle";
        }
    };

    const formatDate = (timestamp: string) => {
        return new Date(timestamp).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const viewAnalysisDetails = (analysis: AnalysisResult) => {
        router.push({
            pathname: "/results",
            params: { result: JSON.stringify(analysis) }
        });
    };

    if (loading && analyses.length === 0) {
        return (
            <View style={styles.loadingContainer}>
                <Ionicons name="document-text" size={48} color="#ccc" />
                <Text style={styles.loadingText}>Loading analysis history...</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }} edges={["bottom"]}>
            <ScrollView
                style={styles.container}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>Analysis History</Text>
                    <Text style={styles.subtitle}>Your skin health journey</Text>
                </View>

                {/* Stats */}
                <View style={styles.stats}>
                    <View style={styles.statCard}>
                        <Ionicons name="document-text" size={20} color="#6366f1" />
                        <View>
                            <Text style={styles.statNumber}>{analyses.length}</Text>
                            <Text style={styles.statLabel}>Total Analyses</Text>
                        </View>
                    </View>
                    <View style={styles.statCard}>
                        <Ionicons name="trending-up" size={20} color="#10b981" />
                        <View>
                            <Text style={styles.statNumber}>
                                {analyses.filter(a => a.severity === "Low").length}
                            </Text>
                            <Text style={styles.statLabel}>Low Risk</Text>
                        </View>
                    </View>
                </View>

                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <View style={styles.searchBar}>
                        <Ionicons name="search-outline" size={20} color="#999" />
                        <TextInput
                            placeholder="Search conditions..."
                            placeholderTextColor="#999"
                            style={styles.searchInput}
                            onChangeText={handleSearchChange}
                        />
                        {searchQuery ? (
                            <TouchableOpacity onPress={() => setSearchQuery('')}>
                                <Ionicons name="close-circle" size={20} color="#999" />
                            </TouchableOpacity>
                        ) : null}
                    </View>
                </View>

                {/* Filters */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.filters}
                >
                    {["All", "Low", "Medium", "High", "Critical"].map((tab) => (
                        <TouchableOpacity
                            key={tab}
                            style={[styles.filter, filter === tab && styles.filterActive]}
                            onPress={() => setFilter(tab)}
                        >
                            <Text style={[styles.filterText, filter === tab && styles.filterTextActive]}>
                                {tab}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Search Results Info */}
                {searchQuery && (
                    <View style={styles.searchInfo}>
                        <Text style={styles.searchInfoText}>
                            Found {filteredAnalyses.length} result{filteredAnalyses.length !== 1 ? 's' : ''} for &#34;{searchQuery}&#34;
                        </Text>
                    </View>
                )}

                {/* Analysis List */}
                <View style={styles.list}>
                    {filteredAnalyses.length > 0 ? (
                        filteredAnalyses.map((analysis) => (
                            <TouchableOpacity
                                key={analysis.id}
                                style={styles.card}
                                onPress={() => viewAnalysisDetails(analysis)}
                            >
                                <View style={styles.cardHeader}>
                                    <Text style={styles.condition}>{analysis.condition_name}</Text>
                                    <View style={[
                                        styles.severity,
                                        { backgroundColor: severityColors[analysis.severity as keyof typeof severityColors] }
                                    ]}>
                                        <Ionicons
                                            name={getSeverityIcon(analysis.severity)}
                                            size={12}
                                            color="#fff"
                                        />
                                        <Text style={styles.severityText}>{analysis.severity}</Text>
                                    </View>
                                </View>

                                <View style={styles.cardDetails}>
                                    <View style={styles.date}>
                                        <Ionicons name="calendar-outline" size={14} color="#666" />
                                        <Text style={styles.dateText}>{formatDate(analysis.timestamp)}</Text>
                                    </View>
                                    <View style={styles.confidence}>
                                        <Ionicons name="analytics" size={14} color="#666" />
                                        <Text style={styles.confidenceText}>{analysis.confidence_percentage}% confidence</Text>
                                    </View>
                                </View>

                                <View style={styles.progressBar}>
                                    <View
                                        style={[
                                            styles.progressFill,
                                            {
                                                width: `${analysis.confidence_percentage}%`,
                                                backgroundColor: analysis.confidence_percentage > 80 ? '#10b981' :
                                                    analysis.confidence_percentage > 60 ? '#f59e0b' : '#ef4444'
                                            }
                                        ]}
                                    />
                                </View>

                                <Text style={styles.description} numberOfLines={2}>
                                    {analysis.description}
                                </Text>

                                <View style={styles.actions}>
                                    <TouchableOpacity
                                        style={styles.viewButton}
                                        onPress={() => viewAnalysisDetails(analysis)}
                                    >
                                        <Text style={styles.viewButtonText}>View Details</Text>
                                    </TouchableOpacity>
                                </View>
                            </TouchableOpacity>
                        ))
                    ) : (
                        <View style={styles.emptyState}>
                            <Ionicons name="search-outline" size={48} color="#ccc" />
                            <Text style={styles.emptyTitle}>No analyses found</Text>
                            <Text style={styles.emptyText}>
                                {searchQuery ? 'Try adjusting your search' : 'Your analysis history will appear here'}
                            </Text>
                        </View>
                    )}
                </View>

                <View style={styles.bottomSpacer} />
            </ScrollView>
        </SafeAreaView>
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
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        borderWidth: 1,
        borderColor: "#f1f3f4",
    },
    statNumber: {
        fontSize: 20,
        fontWeight: "700",
        color: "#000",
        marginBottom: 2,
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
        marginRight: 8,
        fontSize: 16,
        color: "#000",
    },
    filters: {
        marginBottom: 16,
    },
    filter: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: "#f8f9fa",
        marginRight: 8,
        borderWidth: 1,
        borderColor: "#f1f3f4",
    },
    filterActive: {
        backgroundColor: "#000",
    },
    filterText: {
        color: "#666",
        fontSize: 14,
        fontWeight: "500",
    },
    filterTextActive: {
        color: "#fff",
    },
    searchInfo: {
        backgroundColor: "#f0f9ff",
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
        borderLeftWidth: 4,
        borderLeftColor: "#0284c7",
    },
    searchInfoText: {
        fontSize: 14,
        color: "#0369a1",
        fontWeight: "500",
    },
    list: {
        gap: 16,
    },
    card: {
        backgroundColor: "#f8f9fa",
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: "#f1f3f4",
    },
    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 12,
    },
    condition: {
        fontSize: 18,
        fontWeight: "600",
        color: "#000",
        flex: 1,
        marginRight: 12,
    },
    severity: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        gap: 4,
    },
    severityText: {
        fontSize: 12,
        fontWeight: "600",
        color: "#fff",
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
    confidence: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    confidenceText: {
        fontSize: 14,
        color: "#666",
    },
    progressBar: {
        height: 6,
        backgroundColor: "#e5e7eb",
        borderRadius: 3,
        overflow: "hidden",
        marginBottom: 12,
    },
    progressFill: {
        height: "100%",
        borderRadius: 3,
    },
    description: {
        fontSize: 14,
        color: "#666",
        lineHeight: 20,
        marginBottom: 16,
    },
    actions: {
        flexDirection: "row",
        justifyContent: "flex-end",
    },
    viewButton: {
        backgroundColor: "#000",
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
    },
    viewButtonText: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "600",
    },
    emptyState: {
        alignItems: "center",
        padding: 40,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#666",
        marginTop: 16,
        marginBottom: 8,
    },
    emptyText: {
        fontSize: 14,
        color: "#999",
        textAlign: "center",
        lineHeight: 20,
    },
    bottomSpacer: {
        height: 20,
    },
});