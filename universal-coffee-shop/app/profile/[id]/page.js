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
      async function toggleMfa() {
      const userId = await SecureStore.getItemAsync("user_id");

      const res = await fetch(`${BASE_URL}/auth/mfa/toggle`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId }),
      });

      const data = await res.json();
      Alert.alert("MFA Updated", `New value: ${data.mfa_enabled}`);
}


    return (
        <>
            <SafeAreaView style={styles.container}>

                <Text style={styles.header}>{timeMessage} {name}</Text>
                <Text style={styles.belowHeader}>
                    Update your profile by entering new information into the text box 
                    and hitting the update button
                </Text>

                <View style={styles.infoBox}> 
                    <Text style={styles.text}>EMAIL (current)</Text>
                    <TextInput 
                        style={styles.option} 
                        placeholder={currentEmail} 
                        placeholderTextColor={'#454545ff'} 
                        onChangeText={setUpdatedEmail}
                    />
                    <TouchableOpacity style={styles.button} onPress={updateEmail}>
                        <Text style={styles.buttonText}>UPDATE EMAIL</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.infoBox}>
                    <Text style={styles.text}>PASSWORD (current)</Text>
                    <TextInput 
                        style={styles.option} 
                        placeholder={password} 
                        placeholderTextColor={'#454545ff'} 
                        onChangeText={setUpdatedPassword}
                    />
                    <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonText}>UPDATE PASSWORD</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.infoBox}>
                    <Text style={styles.text}>MULTI-FACTOR AUTHENTICATION</Text>
                    <TouchableOpacity onPress={toggleMfa}>
                        <Text style={styles.updateText}>TOGGLE MFA</Text>
                    </TouchableOpacity>
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
  container:{
    flex:1,
    backgroundColor:"#FFFFFF",
    alignItems:'center',
    padding:20,
    gap:20,
  },
  header:{
    fontSize:48,
    paddingTop:10,
    color: "#000",
    fontFamily: "Anton-Regular",
    textAlign:'center',
    lineHeight:50,
  },
  belowHeader:{
    textAlign:'center',
    paddingHorizontal:20,
    fontSize:14,
    color:"#000",
  },
  box:{
    flex:1,
    alignItems:'center',
    justifyContent:'center',
    gap:10,
  },
  infoBox:{
    borderRadius:15,
    borderWidth:2,
    width:'98%',
    padding:20,
    alignItems:'center',
    backgroundColor:"#FFFFFF",
    gap:10,
  },
  option:{
    borderRadius:25,
    borderWidth:2,
    padding:10,
    width:'90%',
    textAlign:'center',
    fontSize:16,
  },
  modifyCoffeeshop:{},
  backText:{
    fontWeight:'bold',
    padding:10,
    color: "#000",
    fontSize: 18,
    fontFamily: "Anton-Regular",
  },
  text:{
    fontSize: 20,
    color: "#000",
    fontFamily: "Anton-Regular",
    lineHeight: 30,
  },
  button:{
    width:'90%',
    height:50,
    backgroundColor:'#000',
    borderRadius:25,
    justifyContent:'center',
    alignItems:'center',
    marginTop:5,
  },
  buttonText:{
    color:'#FFF',
    fontSize:16,
    fontFamily:'Anton-Regular',
  }
});
