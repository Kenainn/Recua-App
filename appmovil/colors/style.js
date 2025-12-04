// Colores de la aplicación Recua - Basados en la web
export const colors = {
    primary: '#4db6ac',      // Teal principal
    secondary: '#00695c',    // Teal oscuro
    background: '#e0f2f1',   // Fondo claro
    text: '#212121',         // Texto principal
    accent: '#80cbc4',       // Acento claro
    white: '#ffffff',        // Blanco
    gray: '#666666',         // Gris para texto secundario
    lightGray: '#cccccc',    // Gris claro

    // Estados de tareas
    pending: '#ff9800',      // Naranja - Pendiente
    completed: '#4caf50',    // Verde - Completado
    graded: '#2196f3',       // Azul - Calificado

    // Colores adicionales
    red: '#f44336',
    yellow: '#ffeb3b',
    orange: '#ff9800',
    green: '#4caf50',
    gold: '#ffd700',
};

// Estilos comunes
export const commonStyles = {
    shadow: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    card: {
        backgroundColor: colors.white,
        borderRadius: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
    },
    button: {
        backgroundColor: colors.primary,
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: '600',
    },
};
