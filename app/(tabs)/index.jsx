import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import React, { useEffect, useState } from 'react';
import services from './../../utilities/services';
import { Link, useRouter } from 'expo-router';
import { client } from './../../utilities/KindeConfig';
import { supabase } from './../../utilities/SupabaseConfig';
import Header from '../../components/Header';
import Colors from '../../utilities/Colors';
import CircularChart from '../../components/CircularChart';
import Ionicons from '@expo/vector-icons/Ionicons';
import CategoryList from '../../components/CategoryList';

export default function () {
    const router = useRouter();
    const [categoryList, setCategoryList] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        checkUserAuth();
        getCategoryList();
    }, []);

    const checkUserAuth = async () => {
        const result = await services.getData('login');
        console.log('Check User Auth Result: ', result);  // Log auth result
        if (result !== 'true') {
            router.replace('/login');
        }
    };

    const handleLogout = async () => {
        const loggedOut = await client.logout();
        if (loggedOut) {
            // User was logged out
            await services.storeData('login', 'false');
            router.replace('/login');
        }
    };
    const getCategoryList = async () => {
        setLoading(true);
        const user = await client.getUserDetails();
        const { data, error } = await supabase.from('Category')
            .select("*,CategoryItems(*)")
            .eq('created_by', user.email);
    
        console.log('Fetched category list data:', JSON.stringify(data, null, 2));  // Pretty-print data
        setCategoryList(data || []);
        setLoading(false);
    };

    console.log('Category list state:', categoryList);  // Log state

    return (
        <View style={{ marginTop: 20, flex: 1 }}>
            <ScrollView
                refreshControl={
                    <RefreshControl
                        onRefresh={() => getCategoryList()}
                        refreshing={loading}
                    />
                }
            >
                <View style={{ padding: 20, backgroundColor: Colors.DARKSEAGREEN, height: 150 }}>
                    <Header />
                </View>
                <View style={{ padding: 20, marginTop: -75 }}>
                    <CircularChart categoryList={categoryList} />
                    <CategoryList categoryList={categoryList} />
                </View>
            </ScrollView>
            <Link href={"/add-new-category"} style={styles.addBtnContainer}>
                <Ionicons name="add-circle-sharp" size={64} color={Colors.DARKSEAGREEN} />
            </Link>
        </View>
    )
}

const styles = StyleSheet.create({
    text: {
        fontSize: 20
    },
    addBtnContainer: {
        position: "absolute",
        bottom: 16,
        right: 16
    }
});