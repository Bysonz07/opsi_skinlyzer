import { Feather } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: "#000",
                tabBarInactiveTintColor: "#666",
                tabBarStyle: {
                    backgroundColor: "#fff",
                    borderTopWidth: 1,
                    borderTopColor: "#f1f3f4",
                    height: 60,
                    paddingBottom: 8,
                    paddingTop: 8,
                },
                tabBarLabelStyle: {
                    fontSize: 11,
                    fontWeight: "500",
                    marginBottom: 4,
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Home",
                    tabBarIcon: ({ color, size }) => (
                        <Feather name="home" size={20} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="treatment"
                options={{
                    title: "Treatment",
                    tabBarIcon: ({ color, size }) => (
                        <Feather name="clipboard" size={20} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="analyze"
                options={{
                    title: "Analyze",
                    tabBarIcon: ({ color, size }) => (
                        <Feather name="camera" size={20} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="history"
                options={{
                    title: "History",
                    tabBarIcon: ({ color, size }) => (
                        <Feather name="bar-chart-2" size={20} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: "Profile",
                    tabBarIcon: ({ color, size }) => (
                        <Feather name="user" size={20} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}