import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View
} from "react-native";

export default function TreatmentScreen() {
    const [activeTab, setActiveTab] = useState<"Treatments" | "Doctors" | "Schedule">("Treatments");
    const [treatments, setTreatments] = useState([
        {
            id: "1",
            name: "Hydrocortisone Cream 1%",
            dosage: "Apply thin layer",
            frequency: "Twice daily",
            duration: "2 weeks",
            notes: "Apply to affected areas after cleansing",
            completed: false,
        },
        {
            id: "2",
            name: "Cetirizine",
            dosage: "10mg",
            frequency: "Once daily",
            duration: "1 week",
            notes: "Take with or without food",
            completed: true,
        },
        // Add more treatments to test scrolling
        {
            id: "3",
            name: "Moisturizing Lotion",
            dosage: "Apply generously",
            frequency: "Daily",
            duration: "Ongoing",
            notes: "Use fragrance-free moisturizer",
            completed: false,
        },
        {
            id: "4",
            name: "Sunscreen SPF 50",
            dosage: "Apply to exposed areas",
            frequency: "Every 2 hours",
            duration: "Ongoing",
            notes: "Reapply after swimming or sweating",
            completed: true,
        },
    ]);

    const completedCount = treatments.filter(t => t.completed).length;
    const progress = completedCount / treatments.length;

    const toggleCompleted = (id: string) => {
        setTreatments(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    };

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
                    {treatments.map((treatment, index) => (
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
                                    onValueChange={() => toggleCompleted(treatment.id)}
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
                    ))}
                </View>
            ) : (
                <View style={styles.comingSoon}>
                    <Ionicons name="construct" size={48} color="#ccc" />
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
        paddingBottom: 40, // Added bottom padding
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