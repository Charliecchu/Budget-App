import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import loginImg from "./../../assets/images/login_img.jpeg";
import Colors from "../../utilities/Colors";
import {client} from "./../../utilities/KindeConfig";
import services from "./../../utilities/services";
import {useRouter} from "expo-router";
// import { TouchableOpacity } from 'react-native-gesture-handler';


export default function LoginScreen() {
  
  const router = useRouter();
  const handleSignIn = async () => {
    const token = await client.login();
    if (token) {
      // User was authenticated
      await services.storeData('login', 'true');
      router.replace('/')
    }
  };
  
  return (
    <View style = {{
        display: "flex",
        alignItems: "center"
    }}>
      <Image source = {loginImg} 
      style = {styles.bgImage}
      />
      <View style = {{
        backgroundColor: Colors.DARKSEAGREEN,
        width: "100%",
        height: "100%",
        padding: 20,
        marginTop: -10, 
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30
      }}>
        <Text
            style = {{
                fontSize: 35,
                fontWeight: 'bold',
                textAlign: 'center',
                color: Colors.WHITE
            }}
        >Personal Money Planner
        </Text>
        <Text 
          style = {{
            fontSize: 20,
            textAlign: 'center',
            color: Colors.WHITE,
            marginTop: 35
          }}>
            Master Your Money, Shape Your Future
        </Text>

        <TouchableOpacity style = {styles.button}
          onPress = {handleSignIn}
        >
          <Text style = {{
            textAlign: "center",
            color: Colors.DARKSEAGREEN
          }}>
            Login/Signup
          </Text>
        </TouchableOpacity>

        <Text style = {{fontSize: 13, color: Colors.WHITE, marginTop: 10}}>
          *By logging in or signing up, you agree to our terms and conditions
        </Text>
          
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
    bgImage:{
        width: 200,
        height: 250,
        marginTop: 70,
        borderWidth: 5,
        borderRadius: 20,
        borderColor: Colors.BLACK
    },
    button:{
      backgroundColor: Colors.WHITE,
      padding: 2,
      paddingHorizontal: 5,
      borderRadius: 99,
      marginTop: 30
    }
})