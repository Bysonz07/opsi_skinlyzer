import { useAuth, useUser } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import React from "react";
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    
    return age;
};

export default function ProfileScreen() {
    const [reminderEnabled, setReminderEnabled] = React.useState(true);
    const { user, isLoaded } = useUser();
    const { signOut } = useAuth();
    const router = useRouter();

    const handleSignOut = async () => {
        try {
            await signOut();
            router.replace('/sign-in');
        } catch (err) {
            console.error('Error signing out:', err);
            Alert.alert('Error', 'Failed to sign out. Please try again.');
        }
    };

    if (!isLoaded) {
        return (
            <View style={[styles.container, styles.loadingContainer]}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    const userInitials = user?.firstName && user?.lastName 
        ? `${user.firstName[0]}${user.lastName[0]}`
        : user?.emailAddresses?.[0]?.emailAddress?.[0]?.toUpperCase() || '?';

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }} edges={["bottom"]}>
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
                        <Text style={styles.avatarText}>{userInitials}</Text>
                    </View>
                    <View style={styles.profileInfo}>
                        <Text style={styles.name}>
                            {user?.firstName} {user?.lastName}
                        </Text>
                        <Text style={styles.email}>
                            {user?.emailAddresses?.[0]?.emailAddress}
                        </Text>
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>OpsiSkinlyzer User</Text>
                        </View>
                    </View>
                </View>

                {/* Personal Info */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Personal Information</Text>

                    <View style={styles.field}>
                        <Text style={styles.fieldLabel}>Full Name</Text>
                        <View style={styles.fieldValue}>
                            <Text style={styles.fieldText}>
                                {user?.firstName} {user?.lastName}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.field}>
                        <Text style={styles.fieldLabel}>Email</Text>
                        <View style={styles.fieldValue}>
                            <Text style={styles.fieldText}>
                                {user?.emailAddresses?.[0]?.emailAddress}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.field}>
                        <Text style={styles.fieldLabel}>Date of Birth</Text>
                        <View style={styles.fieldValue}>
                            <Text style={styles.fieldText}>
                                {user?.publicMetadata?.dateOfBirth
                                    ? `${new Date(user.publicMetadata.dateOfBirth as string).toLocaleDateString()} (${calculateAge(user.publicMetadata.dateOfBirth as string)} years old)`
                                    : 'Not set'}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.field}>
                        <Text style={styles.fieldLabel}>Skin Type</Text>
                        <View style={styles.fieldValue}>
                            <Text style={styles.fieldText}>Not Set</Text>
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

                    <TouchableOpacity style={[styles.actionButton, styles.secondaryAction]}>
                        <Text style={styles.secondaryActionText}>Contact Support</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={[styles.actionButton, styles.signOutButton]}
                        onPress={handleSignOut}
                    >
                        <Text style={styles.signOutButtonText}>Sign Out</Text>
                    </TouchableOpacity>
                </View>

                {/* Bottom spacer */}
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
    loadingContainer: {
        justifyContent: 'center',
        alignItems: 'center',
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
    signOutButton: {
        backgroundColor: '#ef4444',
        marginTop: 8,
    },
    signOutButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
        textAlign: 'center',
    },
});