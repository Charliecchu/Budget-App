import { View, Text, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import Colors from '../utilities/Colors';
import ColorPicker from '../components/ColorPicker';
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { supabase } from '../utilities/SupabaseConfig';
import { client } from '../utilities/KindeConfig';
import { useRouter } from 'expo-router';




export default function AddNewCategory() {
  const [selectedIcon, setSelectedIcon] = useState('Ic');
  const [selectedColor, setSelectedColor] = useState(Colors.DARKSEAGREEN);
  const [categoryName, setCategoryName] = useState();
  const [totalBudget, setTotalBudget] = useState();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onCreateCategory = async() => {
    setLoading(true);
    const user = await client.getUserDetails();
      const {data, error} = await supabase.from("Category")
      .insert([{
        name: categoryName,
        assigned_budget: totalBudget,
        icon: selectedIcon,
        color: selectedColor,
        created_by: user.email
      }]).select();
      if (error) {
        console.error("Error inserting data:", error);
      } else {
        console.log(data);
        router.replace({
          pathname: "/category-detail",
          params : {
            categoryId:data[0].id
          }
        })
        setLoading(false);
      }
      if (error) {
        setLoading(false);
      }
  }
  return (
    <View style = {{
      marginTop: 20,
      padding: 20
    }}>
      <View style = {{
        justifyContent: "center",
        alignItems: "center"
      }}>
        <TextInput style = {[styles.iconInput, {backgroundColor: selectedColor}]} maxLength={2}
        onChangeText={(value) => setSelectedIcon(value)}
        >
          {selectedIcon}
        </TextInput>
      <ColorPicker 
        selectedColor = {selectedColor}
        setSelectedColor= {(color) => setSelectedColor(color)}
      />
      </View>

      <View style = {styles.inputView} >
        <Ionicons name="pricetag" size={24} color="black" />
        <TextInput style = {{width: "100%", fontSize: 17}} 
        onChangeText={(v) => setCategoryName(v)} />
      </View>

      <View style = {styles.inputView} >
        <FontAwesome name="dollar" size={24} color="black" /> 
        <TextInput style = {{width: "100%", fontSize: 17}} 
        keyboardType='numeric' 
        onChangeText={(v) => setTotalBudget(v)} />
      </View>
      <TouchableOpacity style = {styles.button}
        disabled = {!categoryName||!totalBudget||loading}
        onPress={()=>onCreateCategory()}
      >
        {loading?
        <ActivityIndicator color = {Colors.WHITE}/>:
        <Text style = {{textAlign: "center", fontSize: 16, color: Colors.WHITE}}>Create</Text>
      }
      </TouchableOpacity>
    </View>
    
  )
}

const styles = StyleSheet.create({
  iconInput: {
    textAlign: "center",
    fontSize: 30,
    padding: 20,
    borderRadius: 99,
    paddingHorizontal: 28,
    color: Colors.WHITE
  },
  inputView: {
    borderWidth: 1,
    display: "flex",
    flexDirection: "row",
    gap: 5,
    padding: 14,
    borderRadius: 10,
    borderColor: Colors.GRAY,
    backgroundColor: Colors.WHITE,
    alignItems: "center",
    marginTop: 20,
  },
  button: {
    backgroundColor: Colors.DARKSEAGREEN,
    padding: 15,
    borderRadius: 99,
    marginTop: 30,
  }
})