import { Colors } from '@/app/constants/colors';
import { BorderRadius, Spacing } from '@/app/constants/spacing';
import React, { useEffect } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming,
} from 'react-native-reanimated';

interface LoadingSkeletonProps {
    width?: number | string;
    height?: number;
    borderRadius?: number;
    style?: ViewStyle;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
    width = '100%',
    height = 20,
    borderRadius = BorderRadius.md,
    style,
}) => {
    const opacity = useSharedValue(0.3);

    useEffect(() => {
        opacity.value = withRepeat(
            withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
            -1,
            true
        );
    }, [opacity]);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
    }));

    return (
        <Animated.View
            style={[
                styles.skeleton,
                { width: width as number, height, borderRadius },
                animatedStyle,
                style,
            ]}
        />
    );
};

/** Pre-composed skeleton for a card-shaped placeholder */
export const CardSkeleton: React.FC<{ style?: ViewStyle }> = ({ style }) => (
    <View style={[styles.cardSkeleton, style]}>
        <View style={styles.cardRow}>
            <LoadingSkeleton width={40} height={40} borderRadius={BorderRadius.full} />
            <View style={styles.cardContent}>
                <LoadingSkeleton width="60%" height={16} />
                <LoadingSkeleton width="40%" height={12} style={{ marginTop: Spacing.xs }} />
            </View>
        </View>
    </View>
);

const styles = StyleSheet.create({
    skeleton: {
        backgroundColor: Colors.border,
    },

    cardSkeleton: {
        backgroundColor: Colors.surface,
        borderRadius: BorderRadius.xl,
        padding: Spacing.base,
        marginBottom: Spacing.sm,
        borderWidth: 1,
        borderColor: Colors.border,
    },

    cardRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.md,
    },

    cardContent: {
        flex: 1,
    },
});
