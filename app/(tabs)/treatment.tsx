import { treatmentAPI } from "@/services/api";
import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
interface Treatment {
    id: string;
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    notes: string;
    completed: boolean;
    condition?: string;
    priority?: "high" | "medium" | "low";
}

export default function TreatmentScreen() {
    const [activeTab, setActiveTab] = useState<"Active" | "Completed" | "All">("Active");
    const [treatments, setTreatments] = useState<Treatment[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // Condition-specific treatment plans
    const conditionTreatments: { [key: string]: Treatment[] } = {
        "akiec": [
            {
                id: "1",
                name: "Fluorouracil Cream",
                dosage: "Apply thin layer",
                frequency: "Once daily",
                duration: "2-4 weeks",
                notes: "Apply to affected areas. May cause redness and peeling.",
                completed: false,
                condition: "akiec",
                priority: "high"
            },
            {
                id: "2",
                name: "Sun Protection",
                dosage: "SPF 50+",
                frequency: "Daily",
                duration: "Ongoing",
                notes: "Use broad-spectrum sunscreen on all exposed skin",
                completed: false,
                condition: "akiec",
                priority: "medium"
            }
        ],
        "bcc": [
            {
                id: "3",
                name: "Dermatology Consultation",
                dosage: "Professional assessment",
                frequency: "Urgent",
                duration: "Immediate",
                notes: "Schedule surgical consultation for lesion removal",
                completed: false,
                condition: "bcc",
                priority: "high"
            }
        ],
        "mel": [
            {
                id: "4",
                name: "Urgent Specialist Referral",
                dosage: "Immediate consultation",
                frequency: "ASAP",
                duration: "Immediate",
                notes: "Contact dermatologist for surgical evaluation",
                completed: false,
                condition: "mel",
                priority: "high"
            }
        ],
        "nv": [
            {
                id: "5",
                name: "Regular Monitoring",
                dosage: "Self-examination",
                frequency: "Monthly",
                duration: "Lifelong",
                notes: "Check for ABCDE changes: Asymmetry, Border, Color, Diameter, Evolution",
                completed: false,
                condition: "nv",
                priority: "low"
            },
            {
                id: "6",
                name: "Sun Protection",
                dosage: "SPF 30+",
                frequency: "Daily",
                duration: "Ongoing",
                notes: "Use sunscreen to prevent changes in moles",
                completed: false,
                condition: "nv",
                priority: "medium"
            }
        ]
    };

    // Load treatments from API and merge with condition-specific treatments
    const loadTreatments = async () => {
        try {
            setLoading(true);
            const apiTreatments = await treatmentAPI.getTreatments();

            // Merge API treatments with condition-specific treatments
            const allTreatments = [
                ...apiTreatments,
                ...conditionTreatments["nv"], // Default to nevus treatments
                ...conditionTreatments["akiec"] // Add some actinic keratosis treatments
            ];

            setTreatments(allTreatments);
        } catch (error) {
            console.error('Failed to load treatments:', error);
            // Fallback to mock data
            setTreatments([
                ...conditionTreatments["nv"],
                ...conditionTreatments["akiec"].slice(0, 1)
            ]);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const toggleCompleted = async (id: string, currentStatus: boolean) => {
        try {
            // Update locally first for immediate feedback
            setTreatments(prev =>
                prev.map(treatment =>
                    treatment.id === id
                        ? { ...treatment, completed: !currentStatus }
                        : treatment
                )
            );

            // Send to API
            await treatmentAPI.updateTreatment(id, !currentStatus);

        } catch (error) {
            console.error('Failed to update treatment:', error);
            // Revert on error
            setTreatments(prev =>
                prev.map(treatment =>
                    treatment.id === id
                        ? { ...treatment, completed: currentStatus }
                        : treatment
                )
            );
            Alert.alert("Error", "Failed to update treatment");
        }
    };

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        loadTreatments();
    }, []);

    useEffect(() => {
        loadTreatments();
    }, []);

    // Filter treatments based on active tab
    const filteredTreatments = treatments.filter(treatment => {
        if (activeTab === "Active") return !treatment.completed;
        if (activeTab === "Completed") return treatment.completed;
        return true; // "All"
    });

    const completedCount = treatments.filter(t => t.completed).length;
    const totalCount = treatments.length;
    const progress = totalCount > 0 ? completedCount / totalCount : 0;

    const getPriorityColor = (priority?: string) => {
        switch (priority) {
            case "high": return "#ef4444";
            case "medium": return "#f59e0b";
            case "low": return "#10b981";
            default: return "#6b7280";
        }
    };

    const getPriorityIcon = (priority?: string) => {
        switch (priority) {
            case "high": return "alert-circle";
            case "medium": return "warning";
            case "low": return "checkmark-circle";
            default: return "medical";
        }
    };

    if (loading && treatments.length === 0) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#000" />
                <Text style={styles.loadingText}>Loading treatments...</Text>
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
                    <Text style={styles.title}>Treatment Plan</Text>
                    <Text style={styles.subtitle}>Manage your skin care routine</Text>
                </View>

                {/* Progress Overview */}
                <View style={styles.progressCard}>
                    <View style={styles.progressHeader}>
                        <Text style={styles.progressText}>Treatment Progress</Text>
                        <Text style={styles.progressCount}>{completedCount}/{totalCount}</Text>
                    </View>
                    <View style={styles.progressBar}>
                        <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
                    </View>
                    <Text style={styles.progressNote}>
                        {progress === 1 ? '🎉 All treatments completed!' :
                            `Keep following your plan${completedCount > 0 ? ` - ${Math.round(progress * 100)}% done` : ''}`}
                    </Text>
                </View>

                {/* Tabs */}
                <View style={styles.tabs}>
                    {["Active", "Completed", "All"].map((tab) => (
                        <TouchableOpacity
                            key={tab}
                            style={[styles.tab, activeTab === tab && styles.tabActive]}
                            onPress={() => setActiveTab(tab as any)}
                        >
                            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                                {tab}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Treatment List */}
                <View style={styles.treatments}>
                    {filteredTreatments.length > 0 ? (
                        filteredTreatments.map((treatment, index) => (
                            <View key={treatment.id} style={[
                                styles.treatmentCard,
                                treatment.completed && styles.treatmentCardCompleted
                            ]}>
                                <View style={styles.treatmentHeader}>
                                    <View style={styles.treatmentInfo}>
                                        {treatment.priority && (
                                            <Ionicons
                                                name={getPriorityIcon(treatment.priority)}
                                                size={16}
                                                color={getPriorityColor(treatment.priority)}
                                                style={styles.priorityIcon}
                                            />
                                        )}
                                        <View style={styles.treatmentDetails}>
                                            <Text style={[
                                                styles.treatmentName,
                                                treatment.completed && styles.treatmentNameCompleted
                                            ]}>
                                                {treatment.name}
                                            </Text>
                                            <Text style={styles.treatmentMeta}>
                                                {treatment.dosage} • {treatment.frequency}
                                            </Text>
                                        </View>
                                    </View>
                                    <Switch
                                        value={treatment.completed}
                                        onValueChange={() => toggleCompleted(treatment.id, treatment.completed)}
                                        thumbColor={treatment.completed ? "#fff" : "#f8f9fa"}
                                        trackColor={{ false: "#e9ecef", true: "#10b981" }}
                                    />
                                </View>

                                {treatment.notes && (
                                    <View style={styles.notes}>
                                        <Text style={styles.notesText}>{treatment.notes}</Text>
                                    </View>
                                )}

                                <View style={styles.treatmentFooter}>
                                    <View style={styles.duration}>
                                        <Ionicons name="time-outline" size={14} color="#666" />
                                        <Text style={styles.durationText}>{treatment.duration}</Text>
                                    </View>
                                    {treatment.condition && (
                                        <View style={styles.conditionTag}>
                                            <Text style={styles.conditionText}>
                                                {treatment.condition.toUpperCase()}
                                            </Text>
                                        </View>
                                    )}
                                </View>
                            </View>
                        ))
                    ) : (
                        <View style={styles.emptyState}>
                            <Ionicons
                                name={activeTab === "Completed" ? "checkmark-done" : "clipboard-outline"}
                                size={48}
                                color="#ccc"
                            />
                            <Text style={styles.emptyTitle}>
                                {activeTab === "Completed" ? "No completed treatments" : "No active treatments"}
                            </Text>
                            <Text style={styles.emptyText}>
                                {activeTab === "Completed"
                                    ? "Complete some treatments to see them here"
                                    : "All treatments are completed! 🎉"}
                            </Text>
                        </View>
                    )}
                </View>

                {/* Quick Actions */}
                <View style={styles.quickActions}>
                    <Text style={styles.actionsTitle}>Quick Actions</Text>
                    <View style={styles.actionButtons}>
                        <TouchableOpacity style={styles.actionButton}>
                            <Ionicons name="add-circle" size={20} color="#000" />
                            <Text style={styles.actionButtonText}>Add Treatment</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionButton}>
                            <Ionicons name="notifications" size={20} color="#000" />
                            <Text style={styles.actionButtonText}>Set Reminder</Text>
                        </TouchableOpacity>
                    </View>
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
    progressCard: {
        backgroundColor: "#f0f9ff",
        borderRadius: 16,
        padding: 20,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: "#e0f2fe",
    },
    progressHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
    progressText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#0369a1",
    },
    progressCount: {
        fontSize: 14,
        color: "#0c4a6e",
        fontWeight: "600",
    },
    progressBar: {
        height: 8,
        backgroundColor: "#bae6fd",
        borderRadius: 4,
        overflow: "hidden",
        marginBottom: 8,
    },
    progressFill: {
        height: "100%",
        backgroundColor: "#0284c7",
        borderRadius: 4,
    },
    progressNote: {
        fontSize: 12,
        color: "#0369a1",
        fontStyle: "italic",
    },
    tabs: {
        flexDirection: "row",
        backgroundColor: "#f8f9fa",
        borderRadius: 12,
        padding: 4,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: "#f1f3f4",
    },
    tab: {
        flex: 1,
        alignItems: "center",
        paddingVertical: 8,
        borderRadius: 8,
    },
    tabActive: {
        backgroundColor: "#000",
    },
    tabText: {
        fontSize: 14,
        fontWeight: "500",
        color: "#666",
    },
    tabTextActive: {
        color: "#fff",
        fontWeight: "600",
    },
    treatments: {
        gap: 16,
        marginBottom: 24,
    },
    treatmentCard: {
        backgroundColor: "#f8f9fa",
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: "#f1f3f4",
    },
    treatmentCardCompleted: {
        backgroundColor: "#f0fdf4",
        borderColor: "#dcfce7",
    },
    treatmentHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 12,
    },
    treatmentInfo: {
        flexDirection: "row",
        flex: 1,
        alignItems: "flex-start",
    },
    priorityIcon: {
        marginRight: 12,
        marginTop: 2,
    },
    treatmentDetails: {
        flex: 1,
    },
    treatmentName: {
        fontSize: 16,
        fontWeight: "600",
        color: "#000",
        marginBottom: 4,
    },
    treatmentNameCompleted: {
        color: "#065f46",
        textDecorationLine: "line-through",
    },
    treatmentMeta: {
        fontSize: 14,
        color: "#666",
    },
    notes: {
        backgroundColor: "#fff",
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: "#f1f3f4",
    },
    notesText: {
        fontSize: 14,
        color: "#666",
        lineHeight: 20,
    },
    treatmentFooter: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    duration: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    durationText: {
        fontSize: 14,
        color: "#666",
    },
    conditionTag: {
        backgroundColor: "#e5e7eb",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    conditionText: {
        fontSize: 12,
        color: "#374151",
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
    quickActions: {
        backgroundColor: "#f8f9fa",
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: "#f1f3f4",
    },
    actionsTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: "#000",
        marginBottom: 12,
    },
    actionButtons: {
        flexDirection: "row",
        gap: 12,
    },
    actionButton: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        backgroundColor: "#fff",
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#e5e7eb",
    },
    actionButtonText: {
        fontSize: 14,
        fontWeight: "600",
        color: "#000",
    },
    bottomSpacer: {
        height: 20,
    },
});