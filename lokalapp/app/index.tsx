import React, { useEffect, useState, useCallback } from 'react';
import {
    View,
    Text,
    FlatList,
    ActivityIndicator,
    StyleSheet,
    LayoutAnimation,
    Platform,
    UIManager,
    RefreshControl,
} from 'react-native';
import JobCard from './JobCard';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const fadeTransition = LayoutAnimation.create(
    300,
    LayoutAnimation.Types.easeInEaseOut,
    LayoutAnimation.Properties.opacity
);

type Job = {
    id: number;
    title: string;
    primary_details?: {
        Place?: string;
    };
};

export default function App() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [page, setPage] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(false);
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [expanded, setExpanded] = useState<{ [key: number]: boolean }>({});

    useEffect(() => {
        fetchJobs();
    }, [page]);

    const fetchJobs = async (isRefresh = false) => {
        if ((loading && !isRefresh) || (!hasMore && !isRefresh)) return;
        if (isRefresh) {
            setRefreshing(true);
        } else {
            setLoading(true);
        }
        try {


            const response = await fetch(
                `https://testapi.getlokalapp.com/common/jobs?page=${isRefresh ? 1 : page}`
            );
            const result = await response.json();
            let newJobs: Job[] = result.results || [];


            newJobs = newJobs.filter((job) => job.id !== undefined && job.id !== null);

            if (isRefresh) {
                LayoutAnimation.configureNext(fadeTransition);
                setJobs(newJobs);
                setPage(2);
            } else {
                setJobs((prev) => [...prev, ...newJobs]);
            }

            if (newJobs.length === 0) setHasMore(false);
        } catch (err) {
            setError('Some network issue occurred while fetching jobs.');
        } finally {
            isRefresh ? setRefreshing(false) : setLoading(false);
        }
    };

    const onRefresh = useCallback(() => {
        fetchJobs(true);
    }, []);

    const toggleExpand = (id: number) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const renderItem = ({ item }: { item: Job }) => (
        <JobCard item={item} isExpanded={expanded[item.id]} toggleExpand={toggleExpand} />
    );

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Hello User</Text>
            {loading && jobs.length === 0 ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#0000ff" />
                    <Text>Loading jobs...</Text>
                </View>
            ) : (
                <FlatList
                    data={jobs}
                    keyExtractor={(item, index) => item.id?.toString() || index.toString()}
                    renderItem={renderItem}
                    onEndReached={() => setPage((prev) => prev + 1)}
                    onEndReachedThreshold={0.5}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                    ListFooterComponent={
                        hasMore && loading ? (
                            <View style={styles.loadingMoreContainer}>
                                <ActivityIndicator size="small" color="#0000ff" />
                                <Text style={styles.loadingMoreText}>Loading more jobs...</Text>
                            </View>
                        ) : null
                    }
                    ListEmptyComponent={!loading && !error ? <Text>No Jobs Found</Text> : null}
                />
            )}
            {error && <Text style={styles.error}>{error}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        paddingTop: 50,
        backgroundColor: '#fff',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'left',
    },
    error: {
        color: 'red',
        marginTop: 10,
        textAlign: 'center',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingMoreContainer: {
        paddingVertical: 15,
        alignItems: 'center',
    },
    loadingMoreText: {
        fontSize: 13,
        marginTop: 5,
        color: '#555',
    },
});
