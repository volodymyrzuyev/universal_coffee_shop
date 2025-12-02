// universal-coffee-shop/app/home.js
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import CoffeeShopCard from '../components/CoffeeShopCard';
import { useRouter } from 'expo-router';
import * as SecureStore from "expo-secure-store";
import { SafeAreaView } from 'react-native-safe-area-context';
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
import * as Linking from 'expo-linking';

const config = Constants.expoConfig;

// BACKEND URL 
const BASE_URL = config.backendUrl;

// caching lat/lon
const geoCache = {};

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

  // store user GPS coords
  const [userLocation, setUserLocation] = useState(null);

  //the state variable for the spinning loading wheel
  const [isAnimating, setisAnimating] = useState(true);

  function openDirections(lat, lon) {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`;
    Linking.openURL(url);
  }

  // FIRST LOAD — get location then fetch shops
  useEffect(() => {
    setisAnimating(true);
    initLocationAndShops();
  }, []);

  async function initLocationAndShops() {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log("Location permission denied");
        fetchAllShops(null);
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      setUserLocation(loc.coords);

      fetchAllShops(loc.coords);

    } catch (err) {
      console.log("LOCATION ERROR:", err);
      fetchAllShops(null);
    }
  }

  // maps SQL rows → frontend shop objects
  function mapRows(rows) {
    if (!Array.isArray(rows)) return [];
    return rows.map((row) => ({
      id: row[0],      
      name: row[1],    
      street: row[3],  
      city: row[4],
      state: row[5],
    }));
  }

  // HAVERSINE FORMULA
  function haversine(lat1, lon1, lat2, lon2) {
    function toRad(x) { return x * Math.PI / 180; }

    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  async function fetchAllShops(userCoords = null) {
    try {

      const url = `${BASE_URL}/home/get_all_coffeeshops`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await SecureStore.getItemAsync("user_id")}`,
        },
      });

      const data = await response.json();
      console.log("back from fetching")
      const mapped = mapRows(data.Coffeeshops);

      if (!userCoords) {
        setShops(mapped);
        return;
      }

      const updated = await Promise.all(
        mapped.map(async (shop) => {

          if (!shop.street || !shop.city || !shop.state) {
            shop.distance = null;
            return shop;
          }

          const address = `${shop.street} ${shop.city} ${shop.state}`;

          if (geoCache[shop.id]) {
            const { lat, lon } = geoCache[shop.id];
            shop.lat = lat;
            shop.lon = lon;
            shop.distance = haversine(userCoords.latitude, userCoords.longitude, lat, lon);
            return shop;
          }

          const geoURL = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;

          try {
            const resp = await fetch(geoURL);
            const geo = await resp.json();

            if (geo.length > 0) {
              const lat = parseFloat(geo[0].lat);
              const lon = parseFloat(geo[0].lon);

              geoCache[shop.id] = { lat, lon };
              shop.lat = lat;
              shop.lon = lon;

              shop.distance = haversine(
                userCoords.latitude,
                userCoords.longitude,
                lat,
                lon
              );
            } else {
              shop.distance = null;
            }

          } catch {
            shop.distance = null;
          }

          return shop;
        })
      );

      console.log("back from fetching2")

      updated.sort((a, b) => {
        if (a.distance == null) return 1;
        if (b.distance == null) return -1;
        return a.distance - b.distance;
      });

      console.log("back from fetching3");

      setisAnimating(false);

      console.log("back from fetching4")
      setShops(updated);

    } catch (err) {
      console.log('FETCH ERROR:', err);
    }
  }

  async function fetchShops(name) {
    console.log(name);
    try {

      if (name == '') {
        fetchAllShops(userLocation);
        return;
      }

      const url = `${BASE_URL}/home/get_coffeeshop_by_name/${name.toString().toLowerCase()}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await SecureStore.getItemAsync("user_id")}`,
        },
      });

      const data = await response.json();

      if (data.Coffeeshops.length == 0) {
        Alert.alert("No coffeeshops with that name exist");
        return;
      }

      const mapped = mapRows(data.Coffeeshops);

      if (!userLocation) {
        setShops(mapped);
        return;
      }

      const updated = await Promise.all(
        mapped.map(async (shop) => {

          const address = `${shop.street} ${shop.city} ${shop.state}`;

          if (geoCache[shop.id]) {
            const { lat, lon } = geoCache[shop.id];
            shop.lat = lat;
            shop.lon = lon;
            shop.distance = haversine(userLocation.latitude, userLocation.longitude, lat, lon);
            return shop;
          }

          const geoURL = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;

          try {
            const resp = await fetch(geoURL);
            const geo = await resp.json();

            if (geo.length > 0) {
              const lat = parseFloat(geo[0].lat);
              const lon = parseFloat(geo[0].lon);

              geoCache[shop.id] = { lat, lon };
              shop.lat = lat;
              shop.lon = lon;

              shop.distance = haversine(userLocation.latitude, userLocation.longitude, lat, lon);
            } else {
              shop.distance = null;
            }
          } catch {
            shop.distance = null;
          }

          return shop;
        })
      );

      updated.sort((a, b) => {
        if (a.distance == null) return 1;
        if (b.distance == null) return -1;
        return a.distance - b.distance;
      });

      setShops(updated);

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

      <View style={styles.loadingWheelView}> 
       <ActivityIndicator size={'large'} color={"black"} animating={isAnimating} hidesWhenStopped={true}/>
      </View>

      <FlatList
        data={shops}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <CoffeeShopCard shop={item} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />

      <MapView
        style={{ width: '100%', height: 300 }}
        initialRegion={{
          latitude: userLocation ? userLocation.latitude : 40.5140,
          longitude: userLocation ? userLocation.longitude : -88.9906,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
      >
        {shops.map((shop) => {
          if (!shop.lat || !shop.lon) return null;
          return (
            <Marker
              key={shop.id}
              coordinate={{ latitude: shop.lat, longitude: shop.lon }}
              title={shop.name}
              onPress={() => openDirections(shop.lat, shop.lon)}
            />
          );
        })}
      </MapView>

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
    paddingLeft: 9,
  },
  loadingWheelView:
  {
    flex:1,
    justifyContent:"center",
    alignItems:'center',
  }
});
