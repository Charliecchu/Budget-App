import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import Colors from '../utilities/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import * as ImagePicker from 'expo-image-picker';
import { decode } from 'base64-arraybuffer'
import { supabase } from '../utilities/SupabaseConfig';
import { useLocalSearchParams, useRouter } from 'expo-router';


const placeholder = "http://storage.googleapis.com/proudcity/mebanenc/uploads/2021/03/placeholder-image.png"
export default function AddNewCategoryItem() {
  const [image, setImage] = useState(placeholder);
  const [prevImage, setPrevImage] = useState(placeholder);
  const {categoryId} = useLocalSearchParams();
  const [name, setName] = useState();
  const [url, setUrl] = useState();
  const [cost, setCost] = useState();
  const [note, setNote] = useState();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  

  const onImagePick = async() => {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        quality: 1,
        base64: true
      });

      // console.log(result);

      if (!result.canceled) {
        setPrevImage(result.assets[0].uri);
        setImage(result.assets[0].base64)
      }
    };

    const onClickAdd = async() => {
      setLoading(true);
      const fileName = Date.now();
      const { data, error } = await supabase
      .storage
      .from('images')
      .upload(fileName + '.png', decode(image), {
        contentType: 'image/png'
      });
      if (data) {
        const fileUrl = "https://lrmmnvdfbyksxauzzeae.supabase.co/storage/v1/object/public/images/" + fileName + ".png";
        console.log(fileUrl);

        const {data, error} =  await supabase
        .from("CategoryItems")
        .insert([{
          name: name,
          cost: cost,
          url: url,
          image: fileUrl,
          note: note,
          category_id: categoryId
        }]).select();

        console.log(data);
        setLoading(false);
        router.replace({
          pathname: "/category-detail",
          params: {
              categoryId: categoryId
          }
      })
      }

    }
  

    return (
      <KeyboardAvoidingView>
      <ScrollView style = {{
        padding: 20,
        backgroundColor: Colors.WHITE
      }}>
        <TouchableOpacity onPress = {() => onImagePick()}>
          <Image source = {{uri:prevImage}}
            style = {styles.image}
          />
        </TouchableOpacity>
        <View style = {styles.textInputContainer}>
          <Ionicons name="pricetag" size={24} color= {Colors.GRAY} />
          <TextInput 
          placeholder='Item Name' 
          placeholderTextColor = "black" 
          style = {styles.input}
          onChangeText={(value => setName(value))}
          />
        </View>
        <View style = {styles.textInputContainer}>
          <FontAwesome name="dollar" size={24} color={Colors.GRAY} />
          <TextInput 
          placeholder='Cost' 
          keyboardType = "number-pad" 
          onChangeText={(value => setCost(value))}
          placeholderTextColor = "black" 
          style = {styles.input}/>
        </View>
        <View style = {styles.textInputContainer}>
          <Ionicons name="link" size={24} color= {Colors.GRAY} />  
          <TextInput 
          placeholder='URL' 
          placeholderTextColor = "black"
          onChangeText={(value => setUrl(value))} 
          style = {styles.input}/>
        </View>
        <View style = {styles.textInputContainer}>
          <Ionicons name="pencil" size={24} color= {Colors.GRAY} />
          <TextInput 
          placeholder='Note' 
          placeholderTextColor = "black" 
          onChangeText={(value => setNote(value))}
          style = {[styles.input, styles.multilineInput]} 
          multiline = {true} 
          numberOfLines={3}/>
        </View>

        <TouchableOpacity style = {styles.button}
          disabled = {!name||!cost||loading}
          onPress={() => onClickAdd()}
        >
          {loading?
          <ActivityIndicator color = {Colors.WHITE}/>:
          <Text style = {{
            textAlign: "center",
            fontFamily: "outfit-bold",
            color: Colors.WHITE
          }}>
            Add
          </Text>
        }
        </TouchableOpacity>

      </ScrollView>
      </KeyboardAvoidingView>
  )
}


const styles = StyleSheet.create({
  image: {
    width: 150,
    height: 150,
    backgroundColor: Colors.GRAY,
    borderRadius: 15
  },
  textInputContainer: {
    padding: 10,
    borderWidth: 1,
    display: "flex",
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    borderRadius: 10,
    borderColor: Colors.GRAY,
    marginTop: 10
  },
  input: {
    fontSize: 15,
    width: "100%"
  },
  multilineInput: {
    minHeight: 60,
    textAlignVertical: "top",
    paddingTop: 20
  },
  button: {
    padding: 18,
    backgroundColor: Colors.DARKSEAGREEN,
    borderRadius: 99,
    marginTop: 25
  }
})
