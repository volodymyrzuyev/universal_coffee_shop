import {Text, StyleSheet, TouchableOpacity, View, TextInput, Alert} from 'react-native';
import {useEffect,useState } from 'react';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';


import * as SecureStore from "expo-secure-store";

import Constants from 'expo-constants';

const config = Constants.expoConfig;

// BACKEND URL 
const BASE_URL = config.backendUrl;

/*This represents the profile page of a user, a user will visit this page
if they want to edit their information like email or password*/
export default function UserProfilePage()
{
      const router = useRouter();
    

      /* these variables hold the name and userId of the currently 
      logged in user */
     const [name, setName] = useState("");
     const [userId, setuserId] = useState("");


    /*These state variables hold the current email and password
    this way if the user is in the process of changing their email, 
    but wants to delete what they have, the 'placeholder' in the box
    won't be nothing*/
    const [currentEmail, setCurrentEmail] = useState("");
    const [password, setPassword] = useState("");
    


    /*These state variables hold the data for the updated email or 
    password should the user choose to change them. */
    const [updatedEmail, setUpdatedEmail] = useState("");
    const [updatedPassword, setUpdatedPassword] = useState("");

    /*gets the profile info of the person signed in so that we can 
    show it to the UI*/
    async function getProfileInfo()
    {
      const url = `${BASE_URL}/me/`;
      const response = await fetch(url, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${await SecureStore.getItemAsync("user_id")}`,
          },
      });
     const data = await response.json()

     setuserId(data.user[0]);
     setName(data.user[1]);
     setCurrentEmail(data.user[2]);
     setPassword(data.user[3]);
    }

    /*gets the time of day and sets the hello message in the profile
    to what makes sense 'good morning', 'good afternoon', or 'good
    evening'. The timeMessage variable represents what will be rendered
    in the component*/
    const [timeMessage, setTimeMessage] = useState("");
    function renderTimeOfDay(){
        const timeOfDay = new Date();

        if(timeOfDay.getHours() > 0 && timeOfDay.getHours() < 12)
        {
          setTimeMessage("Good morning")
        }
        else if (timeOfDay.getHours() >=12 && timeOfDay.getHours() < 18){
          setTimeMessage("Good afternoon")
        }
        else {
          setTimeMessage("Good evening")
        }

    }

    //calls getProfileInfo() on component mount
    useEffect(() => {
    getProfileInfo();
    renderTimeOfDay();
    }, []);


    /*called when the user clicks update email, and sends the new email
    to the backend to be changed*/
    async function updateEmail()
    {
      if(updatedEmail == "") {
        Alert.alert("Cannot submit an empty email");
        return;
      }

      try {  
        const response = await fetch(`${BASE_URL}//updateEmail/`, {
             method: 'POST',
             headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${await SecureStore.getItemAsync("user_id")}`,
            },
             body: JSON.stringify({"email":updatedEmail, "user_id":userId}),
        });
 
        if (response.ok) {
            /*this hits if everything runs correctly and fetch returns
            with a status code in the range of 200 */
            
            Alert.alert(`Email updated sucessfully to: ${updatedEmail}. Please log out for changes to take effect`);
            
        } else {
            /*This hits if the server address is correct, but the response from the
            server gave an error like a 404 status code. One reason for an error 
            could be an incorrect endpoint name*/
          
            Alert.alert("There was an error when submitting the email, please try again.")        
        }
    } catch (error) {
        //This hits if the server address is incorrect (couldn't reach the server)
        setResponseMessage(`Network Error: ${error.message}`); 
    }
  }

    return (
        <>

            <SafeAreaView style={styles.box}>

                <Text style={styles.header}>{timeMessage} {name}</Text>
                <Text style={styles.belowHeader}>Update your profile by entering new information into the text box and hitting the update button</Text>

                <View style={styles.infoBox}> 
                    <Text style={styles.text}>EMAIL (current)</Text>
                    <TextInput style={styles.option} placeholder={currentEmail} placeholderTextColor={'#454545ff'} onChangeText={setUpdatedEmail}></TextInput>
                    <TouchableOpacity onPress={updateEmail}><Text style={styles.updateText}>UPDATE EMAIL</Text></TouchableOpacity>
                </View>

                 <View style={styles.infoBox}>
                    <Text style={styles.text}>PASSWORD (current)</Text>
                    <TextInput style={styles.option} placeholder={password} placeholderTextColor={'#454545ff'} onChangeText={setUpdatedPassword}></TextInput>
                    <TouchableOpacity><Text style={styles.updateText}>UPDATE PASSWORD</Text></TouchableOpacity>
                </View>

              <View style={styles.modifyCoffeeshop}>
              </View>

              <TouchableOpacity onPress={() => router.push("/home")}>
                      <Text style={styles.backText}>BACK</Text>
              </TouchableOpacity>
 
            </SafeAreaView>      
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
  belowHeader:
  {
    textAlign:'center',
    padding:2,
  },
   box:{
     flex:1,
     alignItems:'center',
     justifyContent:'center',
     gap:10,
   },
   infoBox:
   {
    borderRadius:5,
    borderWidth:2,
    width:'98%',
    padding:10,
    paddingLeft:0,
    paddingRight:0,
    alignItems:'center'
   },
   option:
  {
     borderRadius:6,
     borderWidth:5,
     padding:10,
     width:'90%',
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
    alignSelf: "left",
    lineHeight: 50,
    paddingLeft:20,
  },
  updateText:
  {
    fontSize: 20,
    color: "#000",
    fontFamily: "Anton-Regular",
    textAlign: "center",
    lineHeight: 30,
    borderColor:'black',
    borderWidth:3,
    marginTop:10,
    paddingHorizontal:10,
    
  }
   
});
