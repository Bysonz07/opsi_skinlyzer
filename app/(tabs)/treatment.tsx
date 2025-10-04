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
import * as Progress from "react-native-progress";

export default function TreatmentScreen() {
    const [activeTab, setActiveTab] = useState<"Treatments" | "Doctors" | "Schedule">("Treatments");
    const [treatments, setTreatments] = useState([
        {
            id: "1",
            name: "Hydrocortisone Cream 1%",
            dosage: "Apply thin layer",
            frequency: "Twice daily",
            duration: "2 weeks",
            notes: "Apply to affected areas after cleansing. Avoid contact with eyes.",
            completed: false,
        },
        {
            id: "2",
            name: "Cetirizine (Antihistamine)",
            dosage: "10mg",
            frequency: "Once daily",
            duration: "1 week",
            notes: "Take with or without food. May cause drowsiness.",
            completed: false,
        },
        {
            id: "3",
            name: "Moisturizing Routine",
            dosage: "Use gentle moisturizer",
            frequency: "Twice daily",
            duration: "3 weeks",
            notes: "Apply after washing face. Keeps skin hydrated.",
            completed: false,
        },
    ]);

    const completedCount = treatments.filter((t) => t.completed).length;
    const progress = completedCount / treatments.length;

    const toggleCompleted = (id: string) => {
        setTreatments((prev) =>
            prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
        );
    };

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* Header */}
            <Text style={styles.title}>Treatment Plan</Text>
            <Text style={styles.subtitle}>for Skin Condition</Text>

            {/* Progress Section */}
            <View style={styles.progressCard}>
                <View style={styles.progressHeader}>
                    <Text style={styles.progressText}>
                        Treatment Progress
                    </Text>
                    <Text style={styles.progressCount}>
                        {completedCount}/{treatments.length} completed
                    </Text>
                </View>
                <Progress.Bar
                    progress={progress}
                    color="#111827"
                    unfilledColor="#E5E7EB"
                    borderWidth={0}
                    height={8}
                    borderRadius={8}
                />
                <Text style={styles.progressNote}>
                    Keep following your treatment plan for best results
                </Text>
            </View>

            {/* Tabs */}
            <View style={styles.tabRow}>
                {["Treatments", "Doctors", "Schedule"].map((tab) => (
                    <TouchableOpacity
                        key={tab}
                        style={[
                            styles.tabButton,
                            activeTab === tab && styles.tabButtonActive,
                        ]}
                        onPress={() => setActiveTab(tab as any)}
                    >
                        <Text
                            style={[
                                styles.tabText,
                                activeTab === tab && styles.tabTextActive,
                            ]}
                        >
                            {tab}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Content */}
            {activeTab === "Treatments" ? (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Your Treatment Plan</Text>
                    <Text style={styles.sectionSubtitle}>
                        Follow these steps to improve your condition
                    </Text>

                    {treatments.map((t, index) => (
                        <View key={t.id} style={styles.treatmentCard}>
                            <View style={styles.cardHeader}>
                                <View style={styles.numberCircle}>
                                    <Text style={styles.numberText}>{index + 1}</Text>
                                </View>
                                <Text style={styles.treatmentName}>{t.name}</Text>
                                <Switch
                                    value={t.completed}
                                    onValueChange={() => toggleCompleted(t.id)}
                                    thumbColor={t.completed ? "#111827" : "#E5E7EB"}
                                    trackColor={{ true: "#D1D5DB", false: "#F3F4F6" }}
                                />
                            </View>

                            <View style={styles.details}>
                                <Text style={styles.detailLine}>
                                    <Text style={styles.detailLabel}>Dosage: </Text>
                                    {t.dosage}
                                </Text>
                                <Text style={styles.detailLine}>
                                    <Text style={styles.detailLabel}>Frequency: </Text>
                                    {t.frequency}
                                </Text>
                                <Text style={styles.detailLine}>
                                    <Text style={styles.detailLabel}>Duration: </Text>
                                    {t.duration}
                                </Text>
                            </View>

                            <View style={styles.notesBox}>
                                <Text style={styles.notesText}>{t.notes}</Text>
                            </View>
                        </View>
                    ))}
                </View>
            ) : (
                <View style={styles.placeholder}>
                    <Ionicons name="information-circle-outline" size={32} color="#9CA3AF" />
                    <Text style={styles.placeholderText}>
                        {activeTab} section coming soon
                    </Text>
                </View>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F9FAFB",
        paddingHorizontal: 20,
        paddingTop: 60,
    },
    title: {
        fontSize: 24,
        fontWeight: "700",
        color: "#111827",
        textAlign: "center",
    },
    subtitle: {
        fontSize: 14,
        color: "#6B7280",
        textAlign: "center",
        marginBottom: 24,
    },
    progressCard: {
        backgroundColor: "white",
        borderRadius: 16,
        padding: 16,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 1,
        marginBottom: 20,
    },
    progressHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 8,
    },
    progressText: {
        fontSize: 14,
        fontWeight: "600",
        color: "#111827",
    },
    progressCount: {
        fontSize: 14,
        fontWeight: "500",
        color: "#6B7280",
    },
    progressNote: {
        marginTop: 8,
        fontSize: 12,
        color: "#6B7280",
    },
    tabRow: {
        flexDirection: "row",
        backgroundColor: "#E5E7EB",
        borderRadius: 12,
        padding: 4,
        marginBottom: 16,
    },
    tabButton: {
        flex: 1,
        alignItems: "center",
        paddingVertical: 8,
        borderRadius: 8,
    },
    tabButtonActive: {
        backgroundColor: "white",
    },
    tabText: {
        fontSize: 14,
        color: "#6B7280",
        fontWeight: "500",
    },
    tabTextActive: {
        color: "#111827",
        fontWeight: "600",
    },
    section: {
        marginBottom: 40,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "700",
        color: "#111827",
        marginBottom: 4,
        textAlign: "center",
    },
    sectionSubtitle: {
        fontSize: 13,
        color: "#6B7280",
        marginBottom: 16,
        textAlign: "center",
    },
    treatmentCard: {
        backgroundColor: "white",
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 1,
    },
    cardHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    numberCircle: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: "#F3F4F6",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 8,
    },
    numberText: {
        fontWeight: "600",
        color: "#111827",
    },
    treatmentName: {
        flex: 1,
        fontSize: 15,
        fontWeight: "600",
        color: "#111827",
    },
    details: {
        marginTop: 8,
    },
    detailLine: {
        fontSize: 13,
        color: "#374151",
    },
    detailLabel: {
        fontWeight: "600",
    },
    notesBox: {
        backgroundColor: "#F3F4F6",
        borderRadius: 8,
        padding: 10,
        marginTop: 8,
    },
    notesText: {
        fontSize: 13,
        color: "#4B5563",
    },
    placeholder: {
        marginTop: 60,
        alignItems: "center",
    },
    placeholderText: {
        color: "#9CA3AF",
        marginTop: 8,
        fontSize: 14,
    },
});
