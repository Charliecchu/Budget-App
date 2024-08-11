import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Link, useLocalSearchParams, useRouter } from 'expo-router'
import { supabase } from '../utilities/SupabaseConfig';
import Ionicons from '@expo/vector-icons/Ionicons';
import CourseInfo from '../components/CourseDetail/CourseInfo';
import CourseItemList from '../components/CourseDetail/CourseItemList';
import Colors from '../utilities/Colors';


export default function CategoryDetails() {
    const {categoryId} = useLocalSearchParams();
    const [categoryData, setCategoryData] = useState([]);
    const router = useRouter();
    useEffect(() => {
        console.log(categoryId)
        categoryId&&getCategoryDetail();
    }, [categoryId]);

    const getCategoryDetail = async() => {
        const {data, error} = await supabase.from("Category")
        .select('*,CategoryItems(*)')
        .eq('id',categoryId)
        setCategoryData(data[0]);
        
    }
  return (
    <View style = {{
        padding: 20,
        marginTop: 20,
        flex: 1,
        backgroundColor: Colors.WHITE
    }}>
      <ScrollView showsVerticalScrollIndicator = {false}>
        <TouchableOpacity onPress = {() => router.replace('/(tabs)')}>
            <Ionicons name="arrow-back-circle-sharp" size={44} color="black" />
        </TouchableOpacity>
            <CourseInfo categoryData={categoryData}/>

            <CourseItemList categoryData={categoryData} 
            setUpdateRecord={()=>getCategoryDetail()}/>
      </ScrollView>
        <Link 
        href = {{
          pathname: "/add-new-category-item",
          params: {
            categoryId: categoryData.id
          }
        }}
        style = {styles.floatingButton}

        >
            <Ionicons name="add-circle" size={60} color={Colors.DARKSEAGREEN} />
        </Link>
    </View>
  )
}

const styles = StyleSheet.create({
  floatingButton: {
    position: "absolute",
    bottom: 16,
    right: 16
  }
})


