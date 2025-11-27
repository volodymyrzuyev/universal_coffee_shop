import {Text, StyleSheet, TouchableOpacity, View, TextInput} from 'react-native';
import {useEffect,useState } from 'react';
import { useRouter } from 'expo-router';


import * as SecureStore from "expo-secure-store";


/*This represents the profile page of a user, a user will visit this page
if they want to edit their information like email or password*/
export default function UserProfilePage()
{
      const router = useRouter();
    

    const [userId, setuserId] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    //gets the profile info of the person signed in
    async function getProfileInfo()
    {
     setuserId(await SecureStore.getItemAsync("user_id"));
     setEmail(await SecureStore.getItemAsync("email"));
     setPassword(await SecureStore.getItemAsync("password"));
     }

    //calls getProfileInfo() on component mount
    useEffect(() => {
    getProfileInfo();
    }, []);

    return (
        <>

            <View style={styles.box}>

                <Text style={styles.header}>Hello {userId}</Text>

                <View style={styles.infoBox}> 
                    <Text style={styles.text}>EMAIL</Text>
                    <TextInput style={styles.option} placeholder={email} placeholderTextColor={'#828282ff'}></TextInput>
                    <Text style={styles.updateEmail}>UPDATE EMAIL</Text>

                    <Text style={styles.text}>PASSWORD</Text>
                    <TextInput style={styles.option} placeholder={password} placeholderTextColor={'#828282ff'}></TextInput>
                    <Text style={styles.text}>UPDATE PASSWORD</Text>

                </View>

            <View style={styles.modifyCoffeeshop}>
             </View>

            <TouchableOpacity onPress={() => router.push("/home")}>
                      <Text style={styles.backText}>BACK</Text>
            </TouchableOpacity>
 
            </View>      
        </>
    )
}

const styles = StyleSheet.create({
  header:{
    fontSize:20,
    fontWeight:'bold',
    padding:10,
    color: "#000",
    fontFamily: "Anton-Regular",
  },
   box:{
     flex:0.5,
     alignItems:'center',
     justifyContent:'center',
     gap:10,
   },
   infoBox:
   {
    borderRadius:5,
    borderWidth:2,
    width:'100%',
    padding:10,
    paddingLeft:0,
    paddingRight:0,
   },
   option:
  {
     borderRadius:6,
     borderWidth:5,
     padding:10,
     width:'100%',
     textAlign:'center'
   },
//   modifyCoffeeshop:
//   {
//     borderRadius:6,
//     borderWidth:5,
//     padding:0,
//   },
  backText:
  {
    fontWeight:'bold',
    padding:10,
    color: "#000",
    fontSize: 18,
    fontFamily: "Anton-Regular",
  },
  text:
  {
    fontSize: 20,
    color: "#000",
    fontFamily: "Anton-Regular",
    textAlign: "center",
    lineHeight: 50,
  },
  updateEmail:
  {
     fontSize: 20,
    color: "#000",
    fontFamily: "Anton-Regular",
    textAlign: "center",
    lineHeight: 50,
    borderBottomWidth:2,
    paddingBottom:10,
    
  }
   
});
