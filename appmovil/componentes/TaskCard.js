import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, commonStyles } from '../colors/style';

export default function TaskCard({ task, onPress }) {
    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'pendiente':
                return colors.pending;
            case 'entregado':
                return colors.completed;
            case 'calificado':
                return colors.graded;
            default:
                return colors.gray;
        }
    };

    const getStatusText = (status) => {
        return status.charAt(0).toUpperCase() + status.slice(1);
    };

    return (
        <TouchableOpacity
            style={[styles.card, commonStyles.shadow]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={styles.header}>
                <Text style={styles.title}>{task.nombre || task.title}</Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(task.estado || task.status) }]}>
                    <Text style={styles.statusText}>{getStatusText(task.estado || task.status)}</Text>
                </View>
            </View>

            {task.materia && (
                <Text style={styles.subject}>📚 {task.materia}</Text>
            )}

            {task.descripcion && (
                <Text style={styles.description}>{task.descripcion}</Text>
            )}

            {task.fecha && (
                <Text style={styles.date}>📅 {task.fecha}</Text>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.white,
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.text,
        flex: 1,
        marginRight: 8,
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    statusText: {
        color: colors.white,
        fontSize: 12,
        fontWeight: '600',
    },
    subject: {
        fontSize: 14,
        color: colors.secondary,
        marginBottom: 4,
        fontWeight: '500',
    },
    description: {
        fontSize: 14,
        color: colors.gray,
        marginBottom: 8,
    },
    date: {
        fontSize: 13,
        color: colors.gray,
    },
});
