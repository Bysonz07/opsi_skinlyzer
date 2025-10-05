import { Ionicons } from "@expo/vector-icons";
import React, { useState, useEffect } from "react";
import {
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
    ActivityIndicator, Alert
} from "react-native";
import { treatmentAPI } from "@/services/api";

export default function TreatmentScreen() {
    const [activeTab, setActiveTab] = useState<"Treatments" | "Doctors" | "Schedule">("Treatments");
    const [treatments, setTreatments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const loadTreatments = async () => {
        try {
            const treatmentsData = await treatmentAPI.getTreatments();
            setTreatments(treatmentsData);
        } catch (error) {
            console.error('Failed to load treatments:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleCompleted = async (id: string, currentStatus: boolean) => {
        try {
            // Update locally first for immediate UI feedback
            setTreatments(prevTreatments =>
                prevTreatments.map(treatment =>
                    treatment.id === id
                        ? { ...treatment, completed: !currentStatus }
                        : treatment
                )
            );

            // Then send to API
            await treatmentAPI.updateTreatment(id, !currentStatus);

            // Optional: Reload from API to ensure sync
            // loadTreatments();

        } catch (error: any) {
            console.error('Failed to update treatment:', error);

            // Revert local change if API call fails
            setTreatments(prevTreatments =>
                prevTreatments.map(treatment =>
                    treatment.id === id
                        ? { ...treatment, completed: currentStatus } // revert to original
                        : treatment
                )
            );

            // Show error to user
            Alert.alert(
                "Update Failed",
                `Could not update treatment: ${error.response?.data?.detail || error.message}`
            );
        }
    };

    useEffect(() => {
        loadTreatments();
    }, []);

    const completedCount = treatments.filter(t => t.completed).length;
    const progress = treatments.length > 0 ? completedCount / treatments.length : 0;

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#000" />
                <Text style={styles.loadingText}>Loading treatments...</Text>
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
                <Text style={styles.title}>Treatment Plan</Text>
                <Text style={styles.subtitle}>Follow your personalized care routine</Text>
            </View>

            {/* Progress */}
            <View style={styles.progressCard}>
                <View style={styles.progressHeader}>
                    <Text style={styles.progressText}>Treatment Progress</Text>
                    <Text style={styles.progressCount}>{completedCount}/{treatments.length}</Text>
                </View>
                <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
                </View>
                <Text style={styles.progressNote}>
                    {progress === 1 ? '🎉 All treatments completed!' : 'Keep following your plan for best results'}
                </Text>
            </View>

            {/* Tabs */}
            <View style={styles.tabs}>
                {["Treatments", "Doctors", "Schedule"].map((tab) => (
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

            {/* Content */}
            {activeTab === "Treatments" ? (
                <View style={styles.treatments}>
                    {treatments.length > 0 ? (
                        treatments.map((treatment, index) => (
                            <View key={treatment.id} style={[
                                styles.treatmentCard,
                                treatment.completed && styles.treatmentCardCompleted
                            ]}>
                                <View style={styles.treatmentHeader}>
                                    <View style={styles.treatmentInfo}>
                                        <View style={[
                                            styles.number,
                                            treatment.completed && styles.numberCompleted
                                        ]}>
                                            <Text style={[
                                                styles.numberText,
                                                treatment.completed && styles.numberTextCompleted
                                            ]}>
                                                {index + 1}
                                            </Text>
                                        </View>
                                        <View style={styles.treatmentDetails}>
                                            <Text style={[
                                                styles.treatmentName,
                                                treatment.completed && styles.treatmentNameCompleted
                                            ]}>
                                                {treatment.name}
                                            </Text>
                                            <Text style={styles.treatmentMeta}>{treatment.dosage} • {treatment.frequency}</Text>
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

                                <Text style={styles.duration}>Duration: {treatment.duration}</Text>
                            </View>
                        ))
                    ) : (
                        <View style={styles.emptyState}>
                            <Ionicons name="clipboard-outline" size={48} color="#ccc" />
                            <Text style={styles.emptyTitle}>No Treatments</Text>
                            <Text style={styles.emptyText}>
                                Your treatment plan will appear here after analysis.
                            </Text>
                        </View>
                    )}
                </View>
            ) : (
                <View style={styles.comingSoon}>
                    <Ionicons name="construct-outline" size={48} color="#ccc" />
                    <Text style={styles.comingSoonText}>{activeTab} coming soon</Text>
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
        borderRadius: 12,
        padding: 16,
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
        height: 6,
        backgroundColor: "#bae6fd",
        borderRadius: 3,
        overflow: "hidden",
    },
    progressFill: {
        height: "100%",
        backgroundColor: "#0284c7",
        borderRadius: 3,
    },
    progressNote: {
        marginTop: 8,
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
        gap: 12,
        marginBottom: 20,
    },
    treatmentCard: {
        backgroundColor: "#f8f9fa",
        borderRadius: 12,
        padding: 16,
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
    },
    number: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: "#000",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12,
    },
    numberCompleted: {
        backgroundColor: "#10b981",
    },
    numberText: {
        fontSize: 12,
        fontWeight: "600",
        color: "#fff",
    },
    numberTextCompleted: {
        color: "#fff",
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
        color: "#333",
        lineHeight: 20,
    },
    duration: {
        fontSize: 14,
        color: "#666",
        fontWeight: "500",
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
    comingSoon: {
        alignItems: "center",
        paddingTop: 80,
        paddingBottom: 80,
    },
    comingSoonText: {
        fontSize: 16,
        color: "#666",
        marginTop: 16,
    },
    bottomSpacer: {
        height: 20,
    },
});