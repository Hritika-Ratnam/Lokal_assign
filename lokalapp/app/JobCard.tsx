// JobCard.tsx
import React from 'react';
import { View, Text, Pressable, StyleSheet, LayoutAnimation } from 'react-native';

type Job = {
    id: number;
    title: string;
    primary_details?: {
        Place?: string;
    };
};

type Props = {
    item: Job;
    isExpanded: boolean;
    toggleExpand: (id: number) => void;
};

const JobCard: React.FC<Props> = ({ item, isExpanded, toggleExpand }) => {
    return (
        <View style={styles.card}>
            <Text style={styles.title} numberOfLines={isExpanded ? undefined : 2} ellipsizeMode="tail">
                {item.title || 'No Title'}
            </Text>
            {!isExpanded && (
                <Pressable onPress={() => toggleExpand(item.id)}>
                    <Text style={styles.readMore}>Read more</Text>
                </Pressable>
            )}
            <Text style={styles.location}>{item.primary_details?.Place || 'No Location'}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        padding: 15,
        marginVertical: 8,
        backgroundColor: '#ffffff',
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#ddd',
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 1 },
        shadowRadius: 2,
        elevation: 2,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    readMore: {
        color: 'blue',
        marginTop: 4,
        fontSize: 14,
    },
    location: {
        fontSize: 16,
        color: '#444',
        marginTop: 8,
    },
});

export default JobCard;
