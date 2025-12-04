import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { colors } from '../colors/style';

export default function Sidebar({ navigation, onClose, userName, userEmail, onLogout }) {
    const menuItems = [
        { name: 'Home', icon: '🏠', screen: 'Home' },
        { name: 'Tareas', icon: '📝', screen: 'Tasks' },
        { name: 'Perfil', icon: '👤', screen: 'Profile' },
    ];

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollView}>
                {/* Header del Sidebar */}
                <View style={styles.header}>
                    <Text style={styles.appName}>Recua</Text>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <Text style={styles.closeText}>✖</Text>
                    </TouchableOpacity>
                </View>

                {/* Menú de navegación */}
                <View style={styles.menu}>
                    {menuItems.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.menuItem}
                            onPress={() => {
                                navigation.navigate(item.screen);
                                onClose();
                            }}
                        >
                            <Text style={styles.menuIcon}>{item.icon}</Text>
                            <Text style={styles.menuText}>{item.name}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>

            {/* Usuario en la parte inferior */}
            <View style={styles.userSection}>
                <View style={styles.userInfo}>
                    <View style={styles.userAvatar}>
                        <Text style={styles.userAvatarText}>{userName?.charAt(0) || 'U'}</Text>
                    </View>
                    <View style={styles.userDetails}>
                        <Text style={styles.userName}>{userName}</Text>
                        <Text style={styles.userEmail}>{userEmail}</Text>
                    </View>
                </View>
                <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
                    <Text style={styles.logoutText}>Cerrar Sesión</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },
    scrollView: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        paddingTop: 40,
        backgroundColor: colors.primary,
    },
    appName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.white,
    },
    closeButton: {
        padding: 8,
    },
    closeText: {
        fontSize: 20,
        color: colors.white,
    },
    menu: {
        marginTop: 20,
        paddingHorizontal: 10,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        marginBottom: 8,
    },
    menuIcon: {
        fontSize: 24,
        marginRight: 16,
    },
    menuText: {
        fontSize: 16,
        color: colors.text,
        fontWeight: '500',
    },
    userSection: {
        borderTopWidth: 1,
        borderTopColor: colors.lightGray,
        padding: 16,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    userAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    userAvatarText: {
        fontSize: 24,
        color: colors.white,
        fontWeight: 'bold',
    },
    userDetails: {
        flex: 1,
    },
    userName: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.text,
    },
    userEmail: {
        fontSize: 12,
        color: colors.gray,
        marginTop: 2,
    },
    logoutButton: {
        backgroundColor: colors.background,
        padding: 12,
        borderRadius: 10,
        alignItems: 'center',
    },
    logoutText: {
        color: colors.secondary,
        fontWeight: '600',
        fontSize: 14,
    },
});
