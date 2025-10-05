import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { testConnection, healthAPI } from '@/services/api';

export default function ConnectionTest() {
    const [status, setStatus] = useState<string>('Checking...');
    const [isConnected, setIsConnected] = useState<boolean>(false);

    const checkConnection = async () => {
        setStatus('Testing connection...');
        try {
            const result = await testConnection();
            setIsConnected(result);
            setStatus(result ? '✅ Connected to API!' : '❌ Connection failed');
        } catch (error) {
            setIsConnected(false);
            setStatus('❌ Connection error');
        }
    };

    useEffect(() => {
        checkConnection();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.status}>{status}</Text>
            <TouchableOpacity style={styles.button} onPress={checkConnection}>
                <Text style={styles.buttonText}>Test Connection</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        margin: 16,
    },
    status: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 12,
        textAlign: 'center',
    },
    button: {
        backgroundColor: '#000',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: '600',
    },
});