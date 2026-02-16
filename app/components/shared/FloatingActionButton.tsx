import { useColors } from '@/app/constants/useColors';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import Animated, {
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';

interface FloatingActionButtonProps {
    onPress: () => void;
    icon?: keyof typeof Ionicons.glyphMap;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
    onPress,
    icon = 'add',
}) => {
    const colors = useColors();
    const scale = useSharedValue(1);
    const pressed = useSharedValue(0);

    const animatedStyle = useAnimatedStyle(() => {
        const shadowOpacity = interpolate(pressed.value, [0, 1], [0.25, 0.15]);
        return {
            transform: [{ scale: scale.value }],
            shadowOpacity,
        };
    });

    const handlePressIn = () => {
        scale.value = withSpring(0.9, { damping: 15, stiffness: 200 });
        pressed.value = withSpring(1);
    };

    const handlePressOut = () => {
        scale.value = withSpring(1, { damping: 12, stiffness: 150 });
        pressed.value = withSpring(0);
    };

    const handlePress = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        onPress();
    };

    return (
        <Animated.View style={[styles.container, { shadowColor: colors.primary }, animatedStyle]}>
            <TouchableOpacity
                onPress={handlePress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                activeOpacity={1}
                style={[styles.button, { backgroundColor: colors.primary }]}
                accessibilityLabel="Create new item"
                accessibilityRole="button"
            >
                <Ionicons name={icon} size={28} color={colors.white} />
            </TouchableOpacity>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 24,
        right: 20,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 12,
        elevation: 8,
    },

    button: {
        width: 60,
        height: 60,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
