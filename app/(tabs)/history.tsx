import { Ionicons } from "@expo/vector-icons";
import React, { useState, useMemo, useCallback } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import { filterItems, debounce } from "@/components/utils/searchUtils";

interface AnalysisItem {
    id: string;
    condition: string;
    date: string;
    confidence: number;
    status: string;
    severity: string;
    description?: string;
}

export default function HistoryScreen() {
    const [hasData] = useState(true);
    const [filter, setFilter] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");

    const dummyData: AnalysisItem[] = [
        {
            id: "1",
            condition: "Eczema (Atopic Dermatitis)",
            date: "January 15, 2024",
            confidence: 92,
            status: "Active",
            severity: "Medium",
            description: "Started treatment with hydrocortisone cream",
        },
        {
            id: "2",
            condition: "Contact Dermatitis",
            date: "January 10, 2024",
            confidence: 85,
            status: "Resolved",
            severity: "Low",
            description: "Resolved after removing allergen trigger",
        },
        {
            id: "3",
            condition: "Seborrheic Dermatitis",
            date: "January 5, 2024",
            confidence: 78,
            status: "Monitoring",
            severity: "Medium",
            description: "Monitoring with medicated shampoo",
        },
        {
            id: "4",
            condition: "Dry Skin",
            date: "December 28, 2023",
            confidence: 95,
            status: "Resolved",
            severity: "Low",
            description: "Improved with regular moisturizing routine",
        },
        {
            id: "5",
            condition: "Acne Vulgaris",
            date: "December 20, 2023",
            confidence: 87,
            status: "Resolved",
            severity: "Medium",
            description: "Treated with topical retinoids",
        },
        {
            id: "6",
            condition: "Rosacea",
            date: "December 15, 2023",
            confidence: 82,
            status: "Monitoring",
            severity: "Low",
            description: "Managing with gentle skincare routine",
        },
    ];

    // Debounced search handler
    const handleSearchChange = useCallback(
        debounce((text: string) => {
            setSearchQuery(text);
        }, 300),
        []
    );

    // Filter and search data
    const filteredData = useMemo(() => {
        let result = dummyData;

        // Apply status filter
        if (filter !== "All") {
            result = result.filter(item => item.status === filter);
        }

        // Apply search filter
        if (searchQuery.trim()) {
            result = filterItems(result, searchQuery, ['condition', 'description']);
        }

        return result;
    }, [filter, searchQuery]);

    const handleClearSearch = () => {
        setSearchQuery("");
    };

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

            {hasData ? (
                <>
                    {/* Stats */}
                    <View style={styles.stats}>
                        <View style={styles.statCard}>
                            <Ionicons name="document-text" size={20} color="#6366f1" />
                            <View>
                                <Text style={styles.statNumber}>{filteredData.length}</Text>
                                <Text style={styles.statLabel}>Showing</Text>
                            </View>
                        </View>
                        <View style={styles.statCard}>
                            <Ionicons name="checkmark-done" size={20} color="#10b981" />
                            <View>
                                <Text style={styles.statNumber}>
                                    {filteredData.filter(d => d.status === "Resolved").length}
                                </Text>
                                <Text style={styles.statLabel}>Resolved</Text>
                            </View>
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
                                defaultValue={searchQuery}
                            />
                            {searchQuery ? (
                                <TouchableOpacity onPress={handleClearSearch}>
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
                        contentContainerStyle={styles.filtersContent}
                    >
                        {["All", "Active", "Resolved", "Monitoring"].map((tab) => (
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
                    {searchQuery ? (
                        <View style={styles.searchInfo}>
                            <Text style={styles.searchInfoText}>
                                Found {filteredData.length} result{filteredData.length !== 1 ? 's' : ''} for &#34;{searchQuery}&#34;
                            </Text>
                        </View>
                    ) : null}

                    {/* Analysis List */}
                    <View style={styles.list}>
                        {filteredData.length > 0 ? (
                            filteredData.map((item) => (
                                <View key={item.id} style={styles.card}>
                                    <View style={styles.cardHeader}>
                                        <Text style={styles.condition}>{item.condition}</Text>
                                        <View style={[
                                            styles.severity,
                                            item.severity === "Low" ? styles.severityLow :
                                                item.severity === "Medium" ? styles.severityMedium : styles.severityHigh
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
                                            <Ionicons
                                                name={
                                                    item.status === "Resolved" ? "checkmark-circle-outline" :
                                                        item.status === "Active" ? "alert-circle-outline" : "time-outline"
                                                }
                                                size={12}
                                                color="#fff"
                                                style={{ marginRight: 4 }}
                                            />
                                            <Text style={styles.statusText}>{item.status}</Text>
                                        </View>
                                    </View>

                                    <View style={styles.confidence}>
                                        <Text style={styles.confidenceLabel}>Confidence: {item.confidence}%</Text>
                                        <View style={styles.progressBar}>
                                            <View
                                                style={[
                                                    styles.progressFill,
                                                    {
                                                        width: `${item.confidence}%`,
                                                        backgroundColor: item.confidence > 80 ? '#10b981' :
                                                            item.confidence > 60 ? '#f59e0b' : '#ef4444'
                                                    }
                                                ]}
                                            />
                                        </View>
                                    </View>

                                    {item.description && (
                                        <Text style={styles.description}>{item.description}</Text>
                                    )}
                                </View>
                            ))
                        ) : (
                            <View style={styles.noResults}>
                                <Ionicons name="search-outline" size={48} color="#ccc" />
                                <Text style={styles.noResultsText}>No results found</Text>
                                <Text style={styles.noResultsSubtext}>
                                    Try adjusting your search or filters
                                </Text>
                            </View>
                        )}
                    </View>

                    {/* Health Insights */}
                    {!searchQuery && (
                        <View style={styles.insightCard}>
                            <Text style={styles.insightTitle}>Health Insights</Text>
                            <View style={styles.insightRow}>
                                <Text style={styles.insightLabel}>Most common condition</Text>
                                <Text style={styles.insightValue}>Eczema</Text>
                            </View>
                            <View style={styles.insightRow}>
                                <Text style={styles.insightLabel}>Recovery rate</Text>
                                <Text style={[styles.insightValue, { color: "#10b981" }]}>↑ 75%</Text>
                            </View>
                        </View>
                    )}
                </>
            ) : (
                // Empty State
                <View style={styles.empty}>
                    <Ionicons name="document-text-outline" size={48} color="#ccc" />
                    <Text style={styles.emptyTitle}>No Analysis Yet</Text>
                    <Text style={styles.emptyText}>
                        Upload or take a photo to start your first skin analysis.
                    </Text>
                    <TouchableOpacity
                        style={styles.startBtn}
                        onPress={() => console.log("Navigate to Analyze")}
                    >
                        <Text style={styles.startBtnText}>Start Analysis</Text>
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
        marginRight: 8,
        fontSize: 16,
        color: "#000",
    },
    filters: {
        marginBottom: 16,
    },
    filtersContent: {
        paddingHorizontal: 2,
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
        gap: 12,
        marginBottom: 20,
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
    severityHigh: {
        backgroundColor: "rgba(239, 68, 68, 0.2)",
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
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 6,
        paddingHorizontal: 8,
        paddingVertical: 4,
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
        marginBottom: 8,
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
        borderRadius: 2,
    },
    description: {
        fontSize: 14,
        color: "#666",
        lineHeight: 20,
    },
    insightCard: {
        backgroundColor: "#f0f9ff",
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: "#e0f2fe",
    },
    insightTitle: {
        fontSize: 16,
        fontWeight: "700",
        color: "#0369a1",
        marginBottom: 12,
    },
    insightRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
    },
    insightLabel: {
        fontSize: 14,
        color: "#0c4a6e",
    },
    insightValue: {
        fontSize: 14,
        fontWeight: "600",
        color: "#0369a1",
    },
    noResults: {
        alignItems: "center",
        padding: 40,
    },
    noResultsText: {
        fontSize: 18,
        fontWeight: "600",
        color: "#666",
        marginTop: 16,
        marginBottom: 8,
    },
    noResultsSubtext: {
        fontSize: 14,
        color: "#999",
        textAlign: "center",
    },
    empty: {
        alignItems: "center",
        paddingTop: 80,
        paddingBottom: 80,
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
        marginBottom: 20,
    },
    startBtn: {
        backgroundColor: "#000",
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
    },
    startBtnText: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "600",
    },
    bottomSpacer: {
        height: 20,
    },
});