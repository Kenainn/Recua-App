import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, commonStyles } from '../colors/style';

export default function StatsCard({ icon, value, label, color }) {
    return (
        <View style={[styles.card, commonStyles.shadow]}>
            <View style={styles.iconContainer}>
                <Text style={[styles.icon, { color: color || colors.primary }]}>{icon}</Text>
            </View>
            <Text style={styles.value}>{value}</Text>
            <Text style={styles.label}>{label}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.white,
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 100,
        flex: 1,
    },
    iconContainer: {
        marginBottom: 8,
    },
    icon: {
        fontSize: 32,
    },
    value: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 4,
    },
    label: {
        fontSize: 12,
        color: colors.gray,
        textAlign: 'center',
    },
});
