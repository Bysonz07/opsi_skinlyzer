import React from "react";
import {
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View
} from "react-native";

export default function ProfileScreen() {
    const [reminderEnabled, setReminderEnabled] = React.useState(true);

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
        >
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>Profile</Text>
                <Text style={styles.subtitle}>Manage your account and preferences</Text>
            </View>

            {/* Profile Card */}
            <View style={styles.profileCard}>
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>JD</Text>
                </View>
                <View style={styles.profileInfo}>
                    <Text style={styles.name}>John Doe</Text>
                    <Text style={styles.email}>john.doe@email.com</Text>
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>Premium Member</Text>
                    </View>
                </View>
                <TouchableOpacity style={styles.editButton}>
                    <Text style={styles.editButtonText}>Edit</Text>
                </TouchableOpacity>
            </View>

            {/* Personal Info */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Personal Information</Text>

                <View style={styles.field}>
                    <Text style={styles.fieldLabel}>Full Name</Text>
                    <View style={styles.fieldValue}>
                        <Text style={styles.fieldText}>John Doe</Text>
                    </View>
                </View>

                <View style={styles.field}>
                    <Text style={styles.fieldLabel}>Email</Text>
                    <View style={styles.fieldValue}>
                        <Text style={styles.fieldText}>john.doe@email.com</Text>
                    </View>
                </View>

                <View style={styles.field}>
                    <Text style={styles.fieldLabel}>Phone</Text>
                    <View style={styles.fieldValue}>
                        <Text style={styles.fieldText}>+1 (555) 123-4567</Text>
                    </View>
                </View>

                <View style={styles.field}>
                    <Text style={styles.fieldLabel}>Skin Type</Text>
                    <View style={styles.fieldValue}>
                        <Text style={styles.fieldText}>Sensitive</Text>
                    </View>
                </View>
            </View>

            {/* Settings */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Notification Settings</Text>

                <View style={styles.setting}>
                    <View>
                        <Text style={styles.settingLabel}>Treatment Reminders</Text>
                        <Text style={styles.settingDescription}>Get reminders for your treatment schedule</Text>
                    </View>
                    <Switch
                        value={reminderEnabled}
                        onValueChange={setReminderEnabled}
                        thumbColor={reminderEnabled ? "#fff" : "#f8f9fa"}
                        trackColor={{ false: "#e9ecef", true: "#6366f1" }}
                    />
                </View>
            </View>

            {/* Actions */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Account Actions</Text>

                <TouchableOpacity style={[styles.actionButton, styles.primaryAction]}>
                    <Text style={styles.primaryActionText}>Upgrade to Premium</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.actionButton, styles.secondaryAction]}>
                    <Text style={styles.secondaryActionText}>Contact Support</Text>
                </TouchableOpacity>
            </View>

            {/* Bottom spacer */}
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
        paddingBottom: 40, // Ensure bottom padding
    },
    // ... rest of your styles remain the same
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
    profileCard: {
        backgroundColor: "#f8f9fa",
        borderRadius: 12,
        padding: 16,
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 24,
        borderWidth: 1,
        borderColor: "#f1f3f4",
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: "#000",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 16,
    },
    avatarText: {
        color: "#fff",
        fontWeight: "700",
        fontSize: 18,
    },
    profileInfo: {
        flex: 1,
    },
    name: {
        fontSize: 18,
        fontWeight: "600",
        color: "#000",
        marginBottom: 4,
    },
    email: {
        fontSize: 14,
        color: "#666",
        marginBottom: 8,
    },
    badge: {
        alignSelf: "flex-start",
        backgroundColor: "#f59e0b",
        borderRadius: 6,
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    badgeText: {
        fontSize: 12,
        color: "#fff",
        fontWeight: "500",
    },
    editButton: {
        backgroundColor: "#6366f1",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
    },
    editButtonText: {
        color: "#fff",
        fontSize: 12,
        fontWeight: "600",
    },
    section: {
        backgroundColor: "#f8f9fa",
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: "#f1f3f4",
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#000",
        marginBottom: 16,
    },
    field: {
        marginBottom: 16,
    },
    fieldLabel: {
        fontSize: 14,
        color: "#666",
        marginBottom: 8,
    },
    fieldValue: {
        backgroundColor: "#fff",
        borderRadius: 8,
        padding: 12,
        borderWidth: 1,
        borderColor: "#f1f3f4",
    },
    fieldText: {
        fontSize: 16,
        color: "#000",
    },
    setting: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    settingLabel: {
        fontSize: 16,
        color: "#000",
        fontWeight: "500",
        marginBottom: 2,
    },
    settingDescription: {
        fontSize: 12,
        color: "#666",
    },
    actionButton: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        marginBottom: 8,
    },
    primaryAction: {
        backgroundColor: "#000",
    },
    secondaryAction: {
        backgroundColor: "transparent",
        borderWidth: 1,
        borderColor: "#000",
    },
    primaryActionText: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "600",
        textAlign: "center",
    },
    secondaryActionText: {
        color: "#000",
        fontSize: 14,
        fontWeight: "600",
        textAlign: "center",
    },
    bottomSpacer: {
        height: 20,
    },
});