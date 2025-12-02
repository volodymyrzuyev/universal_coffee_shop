import {Text, TouchableOpacity,View,StyleSheet, ScrollView,Alert} from 'react-native';
import {useState,useEffect} from 'react';
import * as SecureStore from "expo-secure-store";
import { useRouter } from 'expo-router';
 
import {SelectList} from 'react-native-dropdown-select-list'

import Constants from 'expo-constants';

const config = Constants.expoConfig;

// BACKEND URL 
const BASE_URL = config.backendUrl;

export default function super_admin_user_page(){

  const [selectedUser, setSelectedUser] = useState("");
  const usersList = []

  const router = useRouter();
  
  useEffect(() => {
    getListOfUsers();
  },[])

  async function getListOfUsers(){

    console.log(`${BASE_URL}/get_users/`);
    try {
       const url = `${BASE_URL}/get_users/`;
      const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await SecureStore.getItemAsync("user_id")}`,
                },
            });
        if (!response.ok)
        {
            Alert.alert("Couldn't find users")
        }
       const data = await response.json();
       
        for (let array of data.users)
        {
          console.log(array[0] + " " + array[1]);

          usersList.push({key : array[0], value: `${array[1]}, is admin: ${array[4]}`});
        }
      
    } catch (err) {
      console.log('FETCH ERROR:', err);
    }
  }

  async function makeAdmin()
  {
     try {
     const url = `${BASE_URL}/create_admin/${selectedUser}`;
      const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await SecureStore.getItemAsync("user_id")}`,
                },
            });

        if (!response.ok)
        {
            Alert.alert("Couldn't make an admin")
        }
        else {
            Alert.alert("Success", `user ${selectedUser}\n is now an admin`)
        }
      
    } catch (err) {
      console.log('FETCH ERROR:', err);
    }
  }
         return(
            <ScrollView> 
 
            <View style={styles.box}>

                <Text style={styles.header}>Super Admin Page</Text>
                <Text style={styles.belowHeader}>This page is for the Super Admin only, and is used to make a user an admin</Text>
                <Text style={styles.belowHeader}>Click on a user to make them an admin</Text>
            <View style={styles.listOfUsers}>
                 <SelectList boxStyles={{borderWidth:10, borderColor:'black'}}  
                             inputStyles={{fontFamily:'Anton-Regular', color:'black'}}
                             dropdownStyles={{borderWidth:10, borderColor:'black'}}
                             placeholder='List of Users' 
                             data={usersList} 
                             setSelected={setSelectedUser}
                             onSelect={makeAdmin} />
            </View>

            <TouchableOpacity onPress={() => router.push("/home")}>
                      <Text style={styles.backText}>BACK</Text>
            </TouchableOpacity>
 
            </View>
             
            </ScrollView>
        );
}


const styles = StyleSheet.create({
  header:{
    fontSize:20,
    fontWeight:'bold',
    padding:10,
    color: "#000",
    fontFamily: "Anton-Regular",
    textAlign:'center'
  },
  belowHeader:
  {
    fontSize:15,
    fontWeight:'bold',
    padding:10,
    color: "#000",
    fontFamily: "Anton-Regular",
    textAlign:'center'
  },
  box:{
    flex:1,
    alignItems:'center',
    justifyContent:'center',
    gap:10,
  },
  option:
  {
    borderRadius:6,
    borderWidth:5,
    padding:10,
  },
  listOfUsers:
  {
    borderRadius:6,
    borderWidth:5,
    padding:10,
    width:'100%',
    
  },
  backText:
  {
    fontWeight:'bold',
    padding:10,
    color: "#000",
    fontSize: 18,
    fontFamily: "Anton-Regular",
  },
  userBox:
  {
    borderWidth:20,

  }
   
});
