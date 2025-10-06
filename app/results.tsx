import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Alert,
    Share
} from "react-native";

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
}

export default function ResultsScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();

    // Get analysis result from navigation params
    const result: AnalysisResult = JSON.parse(params.result as string);

    // Severity color mapping
    const severityColors = {
        "Low": "#10b981",
        "Medium": "#f59e0b",
        "High": "#ef4444",
        "Critical": "#dc2626"
    };

    // Treatment plans based on condition
    const treatmentPlans = {
        "akiec": [
            {
                id: "1",
                name: "Fluorouracil Cream",
                dosage: "Apply thin layer",
                frequency: "Once daily",
                duration: "2-4 weeks",
                notes: "Apply to affected areas. May cause redness and peeling."
            },
            {
                id: "2",
                name: "Imiquimod Cream",
                dosage: "Apply as directed",
                frequency: "2-3 times per week",
                duration: "8-12 weeks",
                notes: "Apply before bedtime, wash off after 6-8 hours"
            }
        ],
        "bcc": [
            {
                id: "1",
                name: "Surgical Excision",
                dosage: "Professional procedure",
                frequency: "One-time",
                duration: "Immediate",
                notes: "Surgical removal of lesion with margins"
            },
            {
                id: "2",
                name: "Electrodessication",
                dosage: "Professional procedure",
                frequency: "One-time",
                duration: "Immediate",
                notes: "Scraping and burning of lesion"
            }
        ],
        "bkl": [
            {
                id: "1",
                name: "Cryotherapy",
                dosage: "Professional procedure",
                frequency: "One-time",
                duration: "Immediate",
                notes: "Freezing with liquid nitrogen"
            },
            {
                id: "2",
                name: "Monitor & Protect",
                dosage: "Daily care",
                frequency: "Daily",
                duration: "Ongoing",
                notes: "Regular monitoring and sun protection"
            }
        ],
        "mel": [
            {
                id: "1",
                name: "Surgical Excision",
                dosage: "Professional procedure",
                frequency: "Urgent",
                duration: "Immediate",
                notes: "Wide excision with margin assessment"
            },
            {
                id: "2",
                name: "Dermatology Referral",
                dosage: "Consultation",
                frequency: "Immediate",
                duration: "Follow-up required",
                notes: "Urgent specialist consultation needed"
            }
        ],
        "nv": [
            {
                id: "1",
                name: "Regular Monitoring",
                dosage: "Self-examination",
                frequency: "Monthly",
                duration: "Lifelong",
                notes: "Check for ABCDE changes: Asymmetry, Border, Color, Diameter, Evolution"
            },
            {
                id: "2",
                name: "Sun Protection",
                dosage: "SPF 30+",
                frequency: "Daily",
                duration: "Ongoing",
                notes: "Use broad-spectrum sunscreen on exposed skin"
            }
        ],
        "vasc": [
            {
                id: "1",
                name: "Laser Therapy",
                dosage: "Professional procedure",
                frequency: "Multiple sessions",
                duration: "2-6 months",
                notes: "Pulsed dye laser treatment"
            },
            {
                id: "2",
                name: "Observation",
                dosage: "Monitor changes",
                frequency: "Regular checkups",
                duration: "As needed",
                notes: "Many vascular lesions are harmless"
            }
        ],
        "df": [
            {
                id: "1",
                name: "Observation",
                dosage: "Monitor stability",
                frequency: "Regular self-check",
                duration: "Lifelong",
                notes: "Dermatofibromas are usually harmless and stable"
            },
            {
                id: "2",
                name: "Surgical Removal",
                dosage: "Optional procedure",
                frequency: "One-time",
                duration: "Permanent",
                notes: "Only if bothersome or changing appearance"
            }
        ]
    };

    const shareResults = async () => {
        try {
            await Share.share({
                message: `Skin Analysis Results:\nCondition: ${result.condition_name}\nConfidence: ${result.confidence_percentage}%\nSeverity: ${result.severity}\n\nDescription: ${result.description}`,
                title: 'Skin Analysis Results'
            });
        } catch (error) {
            Alert.alert("Error", "Could not share results");
        }
    };

    const saveToHistory = () => {
        Alert.alert("Saved", "Analysis results have been saved to your history");
        router.push("/history");
    };

    const getSeverityIcon = (severity: string) => {
        switch(severity) {
            case "Low": return "checkmark-circle";
            case "Medium": return "warning";
            case "High": return "alert-circle";
            case "Critical": return "medkit";
            default: return "help-circle";
        }
    };

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>Analysis Results</Text>
                <Text style={styles.subtitle}>AI-powered skin condition assessment</Text>
            </View>

            {/* Confidence Badge */}
            <View style={styles.confidenceCard}>
                <View style={styles.confidenceHeader}>
                    <Ionicons name="analytics" size={24} color="#0369a1" />
                    <Text style={styles.confidenceTitle}>Confidence Level</Text>
                </View>
                <View style={styles.confidenceValue}>
                    <Text style={styles.confidencePercentage}>{result.confidence_percentage}%</Text>
                    <Text style={styles.confidenceLabel}>AI Confidence</Text>
                </View>
                <View style={styles.confidenceBar}>
                    <View
                        style={[
                            styles.confidenceFill,
                            { width: `${result.confidence_percentage}%` }
                        ]}
                    />
                </View>
            </View>

            {/* Condition Card */}
            <View style={styles.conditionCard}>
                <View style={styles.conditionHeader}>
                    <Text style={styles.conditionName}>{result.condition_name}</Text>
                    <View style={[
                        styles.severityBadge,
                        { backgroundColor: severityColors[result.severity as keyof typeof severityColors] }
                    ]}>
                        <Ionicons
                            name={getSeverityIcon(result.severity)}
                            size={16}
                            color="#fff"
                        />
                        <Text style={styles.severityText}>{result.severity}</Text>
                    </View>
                </View>

                <Text style={styles.conditionDescription}>{result.description}</Text>

                <View style={styles.conditionCode}>
                    <Text style={styles.conditionCodeText}>Medical Code: {result.condition}</Text>
                </View>
            </View>

            {/* Recommendations */}
            <View style={styles.recommendationsCard}>
                <Text style={styles.sectionTitle}>Recommended Actions</Text>
                {result.recommendations.map((recommendation, index) => (
                    <View key={index} style={styles.recommendationItem}>
                        <Ionicons name="checkmark-circle" size={20} color="#10b981" />
                        <Text style={styles.recommendationText}>{recommendation}</Text>
                    </View>
                ))}
            </View>

            {/* Treatment Plan */}
            <View style={styles.treatmentCard}>
                <Text style={styles.sectionTitle}>Suggested Treatment Plan</Text>
                {(treatmentPlans[result.condition as keyof typeof treatmentPlans] || []).map((treatment) => (
                    <View key={treatment.id} style={styles.treatmentItem}>
                        <View style={styles.treatmentHeader}>
                            <Text style={styles.treatmentName}>{treatment.name}</Text>
                            <View style={styles.treatmentDuration}>
                                <Text style={styles.durationText}>{treatment.duration}</Text>
                            </View>
                        </View>
                        <View style={styles.treatmentDetails}>
                            <Text style={styles.treatmentDosage}>{treatment.dosage}</Text>
                            <Text style={styles.treatmentFrequency}>• {treatment.frequency}</Text>
                        </View>
                        <Text style={styles.treatmentNotes}>{treatment.notes}</Text>
                    </View>
                ))}
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
                <TouchableOpacity style={styles.primaryButton} onPress={saveToHistory}>
                    <Ionicons name="save-outline" size={20} color="#fff" />
                    <Text style={styles.primaryButtonText}>Save to History</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.secondaryButton} onPress={shareResults}>
                    <Ionicons name="share-outline" size={20} color="#000" />
                    <Text style={styles.secondaryButtonText}>Share Results</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.treatmentButton}
                    onPress={() => router.push("/treatment")}
                >
                    <Ionicons name="medical" size={20} color="#fff" />
                    <Text style={styles.treatmentButtonText}>View Treatment Plan</Text>
                </TouchableOpacity>
            </View>

            {/* Disclaimer */}
            <View style={styles.disclaimer}>
                <Ionicons name="information-circle" size={16} color="#6b7280" />
                <Text style={styles.disclaimerText}>
                    This analysis is for informational purposes only. Always consult a healthcare professional for medical advice and proper diagnosis.
                </Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingHorizontal: 24,
        paddingTop: 60,
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
    confidenceCard: {
        backgroundColor: "#f0f9ff",
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: "#e0f2fe",
    },
    confidenceHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
    },
    confidenceTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: "#0369a1",
        marginLeft: 8,
    },
    confidenceValue: {
        alignItems: "center",
        marginBottom: 12,
    },
    confidencePercentage: {
        fontSize: 32,
        fontWeight: "700",
        color: "#0369a1",
    },
    confidenceLabel: {
        fontSize: 14,
        color: "#0c4a6e",
    },
    confidenceBar: {
        height: 8,
        backgroundColor: "#bae6fd",
        borderRadius: 4,
        overflow: "hidden",
    },
    confidenceFill: {
        height: "100%",
        backgroundColor: "#0284c7",
        borderRadius: 4,
    },
    conditionCard: {
        backgroundColor: "#f8f9fa",
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: "#f1f3f4",
    },
    conditionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 12,
    },
    conditionName: {
        fontSize: 20,
        fontWeight: "700",
        color: "#000",
        flex: 1,
        marginRight: 12,
    },
    severityBadge: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        gap: 4,
    },
    severityText: {
        color: "#fff",
        fontSize: 12,
        fontWeight: "600",
    },
    conditionDescription: {
        fontSize: 16,
        color: "#666",
        lineHeight: 24,
        marginBottom: 12,
    },
    conditionCode: {
        backgroundColor: "#fff",
        padding: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#e5e7eb",
    },
    conditionCodeText: {
        fontSize: 14,
        color: "#6b7280",
        fontFamily: "monospace",
    },
    recommendationsCard: {
        backgroundColor: "#f0fdf4",
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: "#dcfce7",
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#000",
        marginBottom: 16,
    },
    recommendationItem: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginBottom: 12,
        gap: 8,
    },
    recommendationText: {
        flex: 1,
        fontSize: 14,
        color: "#666",
        lineHeight: 20,
    },
    treatmentCard: {
        backgroundColor: "#fef7ed",
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: "#fed7aa",
    },
    treatmentItem: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: "#f1f3f4",
    },
    treatmentHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 8,
    },
    treatmentName: {
        fontSize: 16,
        fontWeight: "600",
        color: "#000",
        flex: 1,
    },
    treatmentDuration: {
        backgroundColor: "#f59e0b",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    durationText: {
        color: "#fff",
        fontSize: 12,
        fontWeight: "600",
    },
    treatmentDetails: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
        gap: 8,
    },
    treatmentDosage: {
        fontSize: 14,
        color: "#666",
        fontWeight: "500",
    },
    treatmentFrequency: {
        fontSize: 14,
        color: "#666",
    },
    treatmentNotes: {
        fontSize: 14,
        color: "#999",
        lineHeight: 20,
    },
    actionButtons: {
        gap: 12,
        marginBottom: 24,
    },
    primaryButton: {
        flexDirection: "row",
        backgroundColor: "#000",
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
    },
    primaryButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
    secondaryButton: {
        flexDirection: "row",
        backgroundColor: "transparent",
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        borderWidth: 1,
        borderColor: "#000",
    },
    secondaryButtonText: {
        color: "#000",
        fontSize: 16,
        fontWeight: "600",
    },
    treatmentButton: {
        flexDirection: "row",
        backgroundColor: "#dc2626",
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
    },
    treatmentButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
    disclaimer: {
        flexDirection: "row",
        backgroundColor: "#f8f9fa",
        padding: 16,
        borderRadius: 12,
        borderLeftWidth: 4,
        borderLeftColor: "#6b7280",
        gap: 8,
        marginBottom: 40,
    },
    disclaimerText: {
        flex: 1,
        fontSize: 12,
        color: "#6b7280",
        lineHeight: 16,
    },
});