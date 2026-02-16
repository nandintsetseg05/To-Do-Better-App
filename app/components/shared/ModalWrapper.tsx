import { BorderRadius, Spacing } from '@/app/constants/spacing';
import { FontSize, FontWeight } from '@/app/constants/typography';
import { useColors } from '@/app/constants/useColors';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface ModalWrapperProps {
    visible: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    showCloseButton?: boolean;
    fullHeight?: boolean;
}

export const ModalWrapper: React.FC<ModalWrapperProps> = ({
    visible,
    onClose,
    title,
    children,
    showCloseButton = true,
    fullHeight = false,
}) => {
    const colors = useColors();

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={onClose}
            transparent={!fullHeight}
        >
            {fullHeight ? (
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={[styles.fullContainer, { backgroundColor: colors.background }]}
                >
                    <View style={styles.fullContent}>
                        {/* Header */}
                        <View style={[styles.header, { borderBottomColor: colors.border }]}>
                            <View style={[styles.dragHandle, { backgroundColor: colors.border }]} />
                            {title && <Text style={[styles.title, { color: colors.text }]}>{title}</Text>}
                            {showCloseButton && (
                                <TouchableOpacity
                                    onPress={onClose}
                                    style={styles.closeButton}
                                    accessibilityLabel="Close modal"
                                    accessibilityRole="button"
                                >
                                    <Ionicons name="close" size={24} color={colors.textSecondary} />
                                </TouchableOpacity>
                            )}
                        </View>

                        <ScrollView
                            style={styles.scrollContent}
                            keyboardShouldPersistTaps="handled"
                            showsVerticalScrollIndicator={false}
                        >
                            {children}
                        </ScrollView>
                    </View>
                </KeyboardAvoidingView>
            ) : (
                <View style={styles.overlay}>
                    <TouchableOpacity
                        style={[styles.backdrop, { backgroundColor: colors.overlay }]}
                        activeOpacity={1}
                        onPress={onClose}
                        accessibilityLabel="Close modal"
                    />
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        style={styles.bottomSheet}
                    >
                        <View style={[styles.sheetContent, { backgroundColor: colors.background }]}>
                            {/* Header */}
                            <View style={[styles.header, { borderBottomColor: colors.border }]}>
                                <View style={[styles.dragHandle, { backgroundColor: colors.border }]} />
                                {title && <Text style={[styles.title, { color: colors.text }]}>{title}</Text>}
                                {showCloseButton && (
                                    <TouchableOpacity
                                        onPress={onClose}
                                        style={styles.closeButton}
                                        accessibilityLabel="Close modal"
                                        accessibilityRole="button"
                                    >
                                        <Ionicons name="close" size={24} color={colors.textSecondary} />
                                    </TouchableOpacity>
                                )}
                            </View>

                            <ScrollView
                                style={styles.scrollContent}
                                keyboardShouldPersistTaps="handled"
                                showsVerticalScrollIndicator={false}
                            >
                                {children}
                            </ScrollView>
                        </View>
                    </KeyboardAvoidingView>
                </View>
            )}
        </Modal>
    );
};

const styles = StyleSheet.create({
    // ── Full Height ──
    fullContainer: {
        flex: 1,
    },

    fullContent: {
        flex: 1,
    },

    // ── Bottom Sheet ──
    overlay: {
        flex: 1,
        justifyContent: 'flex-end',
    },

    backdrop: {
        ...StyleSheet.absoluteFillObject,
    },

    bottomSheet: {
        maxHeight: '85%',
    },

    sheetContent: {
        borderTopLeftRadius: BorderRadius['2xl'],
        borderTopRightRadius: BorderRadius['2xl'],
        paddingBottom: Spacing['2xl'],
    },

    // ── Shared ──
    header: {
        alignItems: 'center',
        paddingTop: Spacing.sm,
        paddingHorizontal: Spacing.base,
        paddingBottom: Spacing.md,
        borderBottomWidth: 1,
    },

    dragHandle: {
        width: 36,
        height: 4,
        borderRadius: 2,
        marginBottom: Spacing.sm,
    },

    title: {
        fontSize: FontSize.lg,
        fontWeight: FontWeight.bold,
        textAlign: 'center',
    },

    closeButton: {
        position: 'absolute',
        right: Spacing.base,
        top: Spacing.md,
        padding: Spacing.xs,
    },

    scrollContent: {
        paddingHorizontal: Spacing.base,
        paddingTop: Spacing.base,
    },
});
