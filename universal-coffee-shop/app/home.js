import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import CoffeeShopCard from '../components/CoffeeShopCard';
import { useRouter } from 'expo-router';
import * as SecureStore from "expo-secure-store";
import { SafeAreaView } from 'react-native-safe-area-context';
import Constants from 'expo-constants';

const config = Constants.expoConfig;

// BACKEND URL 
const BASE_URL = config.backendUrl;

export default function HomeScreen() {
  const router = useRouter();

  // search box, contains the coffeeshop to be searched for
  const [searchText, setSearchText] = useState('');

  // data coming from backend
  const [shops, setShops] = useState([]);

  //user location
  const [userLocation, setUserLocation] = useState(null);

  //this sets the coffeeshop selection by the user (modify coffeeshop or add coffeeshop)
  const [coffeeshopSelection, setcoffeeshopSelection] = useState("");

  // holds whether the current user is an admin
  const [isAdmin, setIsAdmin] = useState(false);
   // load all shops once on component mount (when the page loads)
   useEffect(() => {
      getUserLocation();
      fetchAllShops();
   }, []);

  // gets user coordinates
  async function getUserLocation() {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude
        });
      },
      (err) => console.log(err),
      { enableHighAccuracy: true }
    );
  }

  //haversine formula
  function computeDistance(lat1, lon1, lat2, lon2) {
    function toRad(x) { return (x * Math.PI) / 180; }

    const R = 6371; // km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) ** 2;

    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  // maps SQL rows → frontend shop objects
  function mapRows(rows) {
     if (!Array.isArray(rows)) return [];
    return rows.map((row) => ({
      id: row[0],      // store_id
      name: row[1],    // coffee_shop_name
      lat: row[4],     // city latitude from DB
      lon: row[5],     // state longitude from DB
    }));
  }

  
  /* fetches **all** shops from the backend and maps to an object which is 
     then set to the shops variable using setShops*/
     async function fetchAllShops() {
    try {
      
      //fetch api that gets and returns to 'response' object all information from all coffeeshops
      const url = `${BASE_URL}/home/get_all_coffeeshops`;
      const response = await fetch(url, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${await SecureStore.getItemAsync("user_id")}`,
          },
      });
 
      //this holds the un-jsoned object containg information about all coffeeshops
      const data = await response.json();

      //data.Coffeeshops contains the array of coffeeshops
      let mapped = mapRows(data.Coffeeshops);

      if (userLocation) {
        mapped = mapped.map(shop => {
          if (shop.lat && shop.lon) {
            shop.distance = computeDistance(
              userLocation.lat,
              userLocation.lon,
              shop.lat,
              shop.lon
            );
          } else {
            shop.distance = null;
          }
          return shop;
        });

        mapped.sort((a, b) => {
          if (a.distance == null) return 1;
          if (b.distance == null) return -1;
          return a.distance - b.distance;
        });
      }

      setShops(mapped);
       
    } catch (err) {
      console.log('FETCH ERROR:', err);
    }
  }

  //called when a shop is fetched by name in the search bar
  async function fetchShops(name)
  { 
    console.log(name);
    try {

      //returns the page to normal if the user clicks the search bar with nothing inside
       if(name == '')
       {
         fetchAllShops();
         return;
       }
      //fetch api that gets and returns to 'response' object all information from all coffeeshops
      const url = `${BASE_URL}/home/get_coffeeshop_by_name/${name.toString().toLowerCase()}`;
      const response = await fetch(url, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${await SecureStore.getItemAsync("user_id")}`,
          },
      }
      );
 
      //this holds the un-jsoned object containg information about all coffeeshops
      const data = await response.json();

      if(data.Coffeeshops.length == 0)
      {
        Alert.alert("No coffeeshops with that name exist");
        return;
      }

      //data.Coffeeshops contains the array of coffeeshops
      let mapped = mapRows(data.Coffeeshops);

      if (userLocation) {
        mapped = mapped.map(shop => {
          if (shop.lat && shop.lon) {
            shop.distance = computeDistance(
              userLocation.lat,
              userLocation.lon,
              shop.lat,
              shop.lon
            );
          } else {
            shop.distance = null;
          }
          return shop;
        });

        mapped.sort((a, b) => {
          if (a.distance == null) return 1;
          if (b.distance == null) return -1;
          return a.distance - b.distance;
        });
      }

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
    await SecureStore.deleteItemAsync("user_id");
    await SecureStore.deleteItemAsync("is_admin");
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
          placeholderTextColor={'#676767ff'}
          value={searchText}
          onChangeText={setSearchText}
        />

        <TouchableOpacity onPress={() => fetchShops(searchText)} style={styles.iconButton}>
          <Feather name="search" size={24} color="black" />
        </TouchableOpacity>

        {isAdmin && (
          <TouchableOpacity onPress={() => router.replace('/modify_or_add')} style={styles.iconButton}>
            <Feather name="plus" size={24} color="black" />
          </TouchableOpacity>
        )}

        {!isAdmin && (
          <TouchableOpacity onPress={() => router.replace('/review')} style={styles.iconButton}>
            <MaterialIcons name="rate-review" size={24} color="black" />
          </TouchableOpacity>
        )}

        <TouchableOpacity onPress={() => router.push(`profile/[${SecureStore.getItem("user_id")}]/page`)} style={styles.iconButton}>
          <Feather name="user" size={24} color="black" />
        </TouchableOpacity>

        <TouchableOpacity onPress={handleLogout} style={styles.iconButton}>
          <Feather name="log-out" size={24} color="black" />
        </TouchableOpacity>

      </View>

      <Text style={styles.sectionTitle}>NEARBY</Text>

      <FlatList
        data={shops}
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
    paddingLeft:9,
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
