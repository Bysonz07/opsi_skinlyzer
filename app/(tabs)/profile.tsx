import React from "react";
import { ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";

export default function ProfileScreen() {
  const [reminderEnabled, setReminderEnabled] = React.useState(true);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <Text style={styles.title}>Profile</Text>
      <Text style={styles.subtitle}>Manage your account and preferences</Text>

      {/* Profile Card */}
      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>JD</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>John Doe</Text>
          <Text style={styles.email}>john.doe@email.com</Text>
          <View style={styles.memberBadge}>
            <Text style={styles.memberText}>Premium Member</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.editIcon}>
          <Text style={styles.editIconText}>✏️</Text>
        </TouchableOpacity>
      </View>

      {/* Personal Information */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Personal Information</Text>
        <Text style={styles.cardSubtitle}>Your basic profile information</Text>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Full Name</Text>
          <View style={styles.infoBox}>
            <Text style={styles.infoValue}>John Doe</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Email</Text>
          <View style={styles.infoBox}>
            <Text style={styles.infoValue}>john.doe@email.com</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Phone</Text>
          <View style={styles.infoBox}>
            <Text style={styles.infoValue}>+1 (555) 123-4567</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Skin Type</Text>
          <View style={styles.infoBox}>
            <Text style={styles.infoValue}>Sensitive</Text>
          </View>
        </View>
      </View>

      {/* Notification Settings */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Notification Settings</Text>
        <Text style={styles.cardSubtitle}>Manage how you receive updates</Text>

        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Treatment Reminders</Text>
          <Switch
            value={reminderEnabled}
            onValueChange={setReminderEnabled}
            thumbColor={reminderEnabled ? "#2563EB" : "#E5E7EB"}
            trackColor={{ true: "#BFDBFE", false: "#D1D5DB" }}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 20,
  },
  profileCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#111827",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  avatarText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 18,
  },
  name: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
  email: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 4,
  },
  memberBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#E0E7FF",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  memberText: {
    fontSize: 12,
    color: "#1E40AF",
    fontWeight: "600",
  },
  editIcon: {
    marginLeft: 8,
  },
  editIconText: {
    fontSize: 16,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 2,
  },
  cardSubtitle: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 12,
  },
  infoRow: {
    marginBottom: 10,
  },
  infoLabel: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 4,
  },
  infoBox: {
    backgroundColor: "#F3F4F6",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  infoValue: {
    fontSize: 14,
    color: "#111827",
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  switchLabel: {
    fontSize: 14,
    color: "#111827",
    fontWeight: "500",
  },
});
