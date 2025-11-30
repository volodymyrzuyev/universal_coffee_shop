import {Text, TouchableOpacity,View,StyleSheet} from 'react-native';
import { useRouter } from 'expo-router';
import {useState,useEffect} from 'react';
import * as SecureStore from "expo-secure-store";

import {SelectList} from 'react-native-dropdown-select-list'

import Constants from 'expo-constants';

const config = Constants.expoConfig;

// BACKEND URL 
const BASE_URL = config.backendUrl;


export default function modify_or_add(){
  const router = useRouter();

  //selected variable for SelectList
  const [selected, setSelected] = useState("");

  //data for list options
  const shopsList = []

  /*this useEffect will be called on render to get the shops that the
  logged in admin owns, so that way the admin cannot modify shops they 
  don't own*/
  useEffect(() => {
    getShopsAdminOwns();
  },[])

  /* This function gets the coffeeshops that the currently logged in 
  admin owns and is called in a useEffect */
  async function getShopsAdminOwns(){
    try {
      //fetch api that gets and returns to 'response' object all information from all coffeeshops
      const url = `${BASE_URL}/home/get_shops_admin_owns/`;
      const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await SecureStore.getItemAsync("user_id")}`,
                },
            });

 
      //this holds the un-jsoned object containg information about all coffeeshops
      const data = await response.json();

      console.log( data.Admin_Coffeeshops[0]);

        for (let array of data.Admin_Coffeeshops)
        {
          console.log(array[0] + " " + array[1]);

          shopsList.push({key : array[0], value: array[1]});
        }
      
       
    } catch (err) {
      console.log('FETCH ERROR:', err);
    }
  }

  //this will redirect to the ModifyCoffeeShop page when the admin selects the coffeeshop they want to modify
  useEffect(() => {

  /*because selected initially loads with "", useEffect is automatically called
  so we prevent this by checking to make sure selected isn't empty (is true)*/
  console.log(selected);
  if(selected)
    {
      router.navigate({
      pathname:'/ModifyCoffeeShop',
      params: {selectedShop: selected}
    })
    }
        
   }, [selected]);
   
         return(
            <> 
 
            <View style={styles.box}>

                <Text style={styles.header}>Would you like to modify or add a coffeeshop</Text>

                <TouchableOpacity style={styles.option} onPress={() => router.replace('/AddCoffeeShop')}>
                <Text>Add A Coffeeshop</Text>
            </TouchableOpacity>

            <View style={styles.modifyCoffeeshop}>
                 <SelectList boxStyles={{borderWidth:0}} placeholder='Modify A Coffeeshop' data={shopsList} setSelected={setSelected} />
            </View>

            <TouchableOpacity onPress={() => router.push("/home")}>
                      <Text style={styles.backText}>BACK</Text>
            </TouchableOpacity>
 
            </View>
             
            </>
        );
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
  modifyCoffeeshop:
  {
    borderRadius:6,
    borderWidth:5,
    padding:10,
    width:'50%',
    
  },
  backText:
  {
    fontWeight:'bold',
    padding:10,
    color: "#000",
    fontSize: 18,
    fontFamily: "Anton-Regular",
  }
   
});
