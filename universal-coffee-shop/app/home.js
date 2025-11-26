// universal-coffee-shop/app/home.js
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import CoffeeShopCard from '../components/CoffeeShopCard';
import { useRouter } from 'expo-router';
import * as SecureStore from "expo-secure-store";
import { SafeAreaView } from 'react-native-safe-area-context';


  

 

// BACKEND URL 
const BASE_URL = 'http://192.168.1.175:8080';

export default function HomeScreen() {
  const router = useRouter();

  // search box, contains the coffeeshop to be searched for
  const [searchText, setSearchText] = useState('');

  // data coming from backend
  const [shops, setShops] = useState([]);

  //this sets the coffeeshop selection by the user (modify coffeeshop or add coffeeshop)
  const [coffeeshopSelection, setcoffeeshopSelection] = useState("");

  // holds whether the current user is an admin
  const [isAdmin, setIsAdmin] = useState(false);
   // load all shops once on component mount (when the page loads)
   useEffect(() => {
      fetchAllShops();
   }, []);

  // maps SQL rows → frontend shop objects
  function mapRows(rows) {
     if (!Array.isArray(rows)) return [];
    return rows.map((row) => ({
      id: row[0],      // store_id
      name: row[1],    // coffee_shop_name
    }));
  }

  
  /* fetches **all** shops from the backend and maps to an object which is 
     then set to the shops variable using setShops*/
  async function fetchAllShops() {
    try {
      
      //fetch api that gets and returns to 'response' object all information from all coffeeshops
      const url = `${BASE_URL}/home/get_all_coffeeshops`;
      const response = await fetch(url);
 
      //this holds the un-jsoned object containg information about all coffeeshops
      const data = await response.json();

      //data.Coffeeshops contains the array of coffeeshops
      const mapped = mapRows(data.Coffeeshops);
      setShops(mapped);
       
    } catch (err) {
      console.log('FETCH ERROR:', err);
    }
  }

  //called when a shop is fetched by name in the search bar
  async function fetchShops(name)
  {

 
    try {

      //returns the page to normal if the user clicks the search bar with nothing inside
       if(name == '')
       {
         fetchAllShops();
         return;
       }
      //fetch api that gets and returns to 'response' object all information from all coffeeshops
      const url = `${BASE_URL}/home/get_coffeeshop_by_name/${name.toString().toLowerCase()}`;
      const response = await fetch(url);
 
      //this holds the un-jsoned object containg information about all coffeeshops
      const data = await response.json();

      //data.Coffeeshops contains the array of coffeeshops
      const mapped = mapRows(data.Coffeeshops);
      setShops(mapped);
       
    } catch (err) {
      console.log('FETCH ERROR:', err);
    }
  }

  //Restore admin status from SecureStore
  useEffect(() => {
  async function loadRole() {
    const flag = await SecureStore.getItemAsync("is_admin");
    setIsAdmin(flag === "1");
  }
  loadRole();
}, []);

  async function handleLogout() {
  try {
    //we are not using the backend logout endpoint for now, just clear local storage
    await SecureStore.deleteItemAsync("user_id");// Remove user_id from secure storage
    await SecureStore.deleteItemAsync("is_admin");// Remove is_admin from secure storage

//so now the user_id and the role are both deleted from secure storage, we can redirect to login.

    
    router.replace("/login");
  } catch (err) {
    console.log("LOGOUT ERROR:", err);
  }
}

  return (
    <SafeAreaView style={styles.container}>

      <View style={styles.header}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search coffee shops..."
          value={searchText}
          onChangeText={setSearchText}
        />

        <TouchableOpacity onPress={() => fetchShops(searchText)} style={styles.iconButton}>
          <Feather name="search" size={24} color="black" />
        </TouchableOpacity>

        {isAdmin && (
          <TouchableOpacity onPress={() => router.replace('/AddCoffeeShop')} style={styles.iconButton}>
            <Feather name="plus" size={24} color="black" />
          </TouchableOpacity>
        )}

        <TouchableOpacity onPress={() => router.push(`profile/[${username}]/page`)} style={styles.iconButton}>
          <Feather name="user" size={24} color="black" />
        </TouchableOpacity>

        <TouchableOpacity onPress={handleLogout} style={styles.iconButton}>
          <Feather name="log-out" size={24} color="black" />
        </TouchableOpacity>

      </View>

      <Text style={styles.sectionTitle}>NEARBY</Text>

      <FlatList
        data={shops} // now using backend results
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <CoffeeShopCard shop={item} />}
        
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  listContent: {
    paddingHorizontal: 15,
    paddingTop: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  searchBar: {
    flex: 1,
    height: 45,
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 25,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  iconButton: {
    marginLeft: 10,
    padding: 5,
  },
  sectionTitle: {
    fontSize: 22,
    marginBottom: 15,
    fontFamily: 'Anton-Regular',
  },
  dropdown: {
      margin: 16,
      height: 50,
      borderBottomColor: 'gray',
      borderBottomWidth: 0.5,
    },
    icon: {
      marginRight: 5,
    },
    placeholderStyle: {
      fontSize: 16,
    },
    selectedTextStyle: {
      fontSize: 16,
    },
    iconStyle: {
      width: 20,
      height: 20,
    },
    inputSearchStyle: {
      height: 40,
      fontSize: 16,
    },
});
