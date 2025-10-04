import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import * as Progress from "react-native-progress";

export default function HistoryScreen() {
  // Switch between "empty" and "dummy" data here for testing
  const [hasData, setHasData] = useState(true);

  const dummyData = [
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
  ];

  const [filter, setFilter] = useState("All");

  const filteredData =
    filter === "All"
      ? dummyData
      : dummyData.filter((d) => d.status === filter);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <Text style={styles.title}>Analysis History</Text>
      <Text style={styles.subtitle}>Track your skin health journey</Text>

      {hasData ? (
        <>
          {/* Summary cards */}
          <View style={styles.summaryRow}>
            <View style={[styles.summaryCard, { borderColor: "#2563EB" }]}>
              <Ionicons name="document-text-outline" size={20} color="#2563EB" />
              <View>
                <Text style={styles.summaryValue}>4</Text>
                <Text style={styles.summaryLabel}>Total Analyses</Text>
              </View>
            </View>

            <View style={[styles.summaryCard, { borderColor: "#16A34A" }]}>
              <Ionicons name="checkmark-done-outline" size={20} color="#16A34A" />
              <View>
                <Text style={styles.summaryValue}>2</Text>
                <Text style={styles.summaryLabel}>Resolved</Text>
              </View>
            </View>
          </View>

          {/* Search bar */}
          <View style={styles.searchBar}>
            <Ionicons name="search-outline" size={18} color="#9CA3AF" />
            <TextInput
              placeholder="Search conditions or notes..."
              placeholderTextColor="#9CA3AF"
              style={styles.searchInput}
            />
          </View>

          {/* Filter Tabs */}
          <View style={styles.tabRow}>
            {["All", "Active", "Resolved", "Monitoring"].map((tab) => (
              <TouchableOpacity
                key={tab}
                style={[
                  styles.tabButton,
                  filter === tab && styles.tabButtonActive,
                ]}
                onPress={() => setFilter(tab)}
              >
                <Text
                  style={[
                    styles.tabText,
                    filter === tab && styles.tabTextActive,
                  ]}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Analysis List */}
          {filteredData.map((item) => (
            <View key={item.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.condition}>{item.condition}</Text>

                <View
                  style={[
                    styles.badge,
                    item.severity === "Low"
                      ? { backgroundColor: "#DCFCE7" }
                      : { backgroundColor: "#FEF3C7" },
                  ]}
                >
                  <Text
                    style={[
                      styles.badgeText,
                      item.severity === "Low"
                        ? { color: "#16A34A" }
                        : { color: "#CA8A04" },
                    ]}
                  >
                    {item.severity}
                  </Text>
                </View>
              </View>

              <View style={styles.dateRow}>
                <Ionicons name="calendar-outline" size={14} color="#6B7280" />
                <Text style={styles.dateText}>{item.date}</Text>

                <View
                  style={[
                    styles.statusBadge,
                    item.status === "Resolved"
                      ? { backgroundColor: "#DCFCE7" }
                      : item.status === "Active"
                      ? { backgroundColor: "#DBEAFE" }
                      : { backgroundColor: "#FEF3C7" },
                  ]}
                >
                  <Ionicons
                    name={
                      item.status === "Resolved"
                        ? "checkmark-circle-outline"
                        : item.status === "Active"
                        ? "alert-outline"
                        : "time-outline"
                    }
                    size={12}
                    color={
                      item.status === "Resolved"
                        ? "#16A34A"
                        : item.status === "Active"
                        ? "#2563EB"
                        : "#CA8A04"
                    }
                    style={{ marginRight: 4 }}
                  />
                  <Text
                    style={[
                      styles.statusText,
                      item.status === "Resolved"
                        ? { color: "#16A34A" }
                        : item.status === "Active"
                        ? { color: "#2563EB" }
                        : { color: "#CA8A04" },
                    ]}
                  >
                    {item.status}
                  </Text>
                </View>
              </View>

              <View style={styles.confidenceRow}>
                <Text style={styles.confidenceLabel}>Confidence:</Text>
                <Progress.Bar
                  progress={item.confidence / 100}
                  color="#111827"
                  unfilledColor="#E5E7EB"
                  borderWidth={0}
                  height={6}
                  borderRadius={4}
                  style={{ flex: 1, marginHorizontal: 8 }}
                />
                <Text style={styles.confidenceValue}>{item.confidence}%</Text>
              </View>

              <Text style={styles.description}>{item.description}</Text>
            </View>
          ))}

          {/* Health Insights */}
          <View style={styles.insightCard}>
            <Text style={styles.insightTitle}>Health Insights</Text>

            <View style={styles.insightRow}>
              <Text style={styles.insightLabel}>Most common condition</Text>
              <Text style={styles.insightValue}>Eczema</Text>
            </View>

            <View style={styles.insightRow}>
              <Text style={styles.insightLabel}>Recovery rate</Text>
              <Text style={[styles.insightValue, { color: "#16A34A" }]}>
                ↑ 75%
              </Text>
            </View>
          </View>
        </>
      ) : (
        // Empty state
        <View style={styles.emptyState}>
          <Ionicons name="document-text-outline" size={48} color="#9CA3AF" />
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
    marginBottom: 20,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  summaryCard: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    backgroundColor: "white",
    marginHorizontal: 4,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  summaryLabel: {
    fontSize: 12,
    color: "#6B7280",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: "#111827",
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
  card: {
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
    marginBottom: 6,
  },
  condition: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
    flexShrink: 1,
    marginRight: 6,
  },
  badge: {
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  dateText: {
    fontSize: 12,
    color: "#6B7280",
    marginLeft: 4,
    marginRight: 8,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  confidenceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  confidenceLabel: {
    fontSize: 13,
    color: "#374151",
  },
  confidenceValue: {
    fontSize: 12,
    color: "#111827",
    width: 40,
    textAlign: "right",
  },
  description: {
    fontSize: 13,
    color: "#4B5563",
  },
  insightCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginTop: 12,
    marginBottom: 40,
  },
  insightTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 12,
  },
  insightRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  insightLabel: {
    fontSize: 13,
    color: "#6B7280",
  },
  insightValue: {
    fontSize: 13,
    fontWeight: "600",
    color: "#111827",
  },
  emptyState: {
    marginTop: 100,
    alignItems: "center",
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginTop: 12,
  },
  emptyText: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    marginHorizontal: 40,
    marginVertical: 8,
  },
  startBtn: {
    backgroundColor: "#111827",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 8,
  },
  startBtnText: {
    color: "white",
    fontWeight: "600",
  },
});
