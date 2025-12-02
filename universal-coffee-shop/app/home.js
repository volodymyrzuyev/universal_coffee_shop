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

  const [searchText, setSearchText] = useState('');
  const [shops, setShops] = useState([]);
  const [coffeeshopSelection, setcoffeeshopSelection] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [isAnimating, setisAnimating] = useState(true);

  const [superAdminEmail, setSuperAdminEmail] = useState("");

  // NEW — sort dropdown state
  const [sortMode, setSortMode] = useState("distance"); 
  const [showSortMenu, setShowSortMenu] = useState(false);

  function openDirections(lat, lon) {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`;
    Linking.openURL(url);
  }

  useEffect(() => {
    setisAnimating(true);
    initLocationAndShops();
    getUserEmail();
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

  // oad review score
  async function loadReviewScore(shopId) {
    try {
      const url = `${BASE_URL}/home/get_reviews_by_shop_id/${shopId}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await SecureStore.getItemAsync("user_id")}`,
        },
      });

      const data = await response.json();

      // backend returns: Reviews: [ [id, text, userId, shopId] ... ]
      if (!data.Reviews || data.Reviews.length === 0) return 0;
      
      // for now, 1 review per person → count = score
      return data.Reviews.length;

    } catch {
      return 0;
    }
  }

  //  — apply sorting mode
  function applySorting(list) {
    if (sortMode === "distance") {
      list.sort((a, b) => {
        if (a.distance == null) return 1;
        if (b.distance == null) return -1;
        return a.distance - b.distance;
      });
    }
    else if (sortMode === "reviews") {
      list.sort((a, b) => {
        const aa = a.reviewScore || 0;
        const bb = b.reviewScore || 0;
        return bb - aa;
      });
    }

    return list;
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
      const mapped = mapRows(data.Coffeeshops);

      if (!userCoords) {
        setShops(mapped);
        return;
      }

      const updated = await Promise.all(
        mapped.map(async (shop) => {
          if (!shop.street || !shop.city || !shop.state) {
            shop.distance = null;
            shop.reviewScore = await loadReviewScore(shop.id);
            return shop;
          }

          const address = `${shop.street} ${shop.city} ${shop.state}`;

          if (geoCache[shop.id]) {
            const { lat, lon } = geoCache[shop.id];
            shop.lat = lat;
            shop.lon = lon;
            shop.distance = haversine(userCoords.latitude, userCoords.longitude, lat, lon);
            shop.reviewScore = await loadReviewScore(shop.id);
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
              shop.distance = haversine(userCoords.latitude, userCoords.longitude, lat, lon);
            } else {
              shop.distance = null;
            }

          } catch {
            shop.distance = null;
          }

          shop.reviewScore = await loadReviewScore(shop.id);
          return shop;
        })
      );

      const sorted = applySorting(updated);

      setisAnimating(false);
      setShops(sorted);

    } catch (err) {
      console.log('FETCH ERROR:', err);
    }
  }

  async function fetchShops(name) {
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
            shop.reviewScore = await loadReviewScore(shop.id);
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

          shop.reviewScore = await loadReviewScore(shop.id);
          return shop;
        })
      );

      const sorted = applySorting(updated);
      setShops(sorted);

    } catch (err) {
      console.log('FETCH ERROR:', err);
    }
  }

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

  async function getUserEmail()
  {
    try 
    {
       const response = await fetch(`${BASE_URL}/me/`, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${await SecureStore.getItemAsync("user_id")}`,
            },
        });

       const data = await response.json();
       setSuperAdminEmail(data.user[2]);
    }
    catch(error)
    {
      console.log(error)
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

        <TouchableOpacity onPress={() => setShowSortMenu(!showSortMenu)} style={styles.iconButton}>
          <Feather name="filter" size={24} color="black" />
        </TouchableOpacity>

        {showSortMenu && (
          <View style={{ position: "absolute", top: 55, right: 10, backgroundColor: "white", padding: 10, borderWidth: 1 }}>
            <TouchableOpacity onPress={() => { setSortMode("distance"); setShowSortMenu(false); setShops(applySorting([...shops])); }}>
              <Text>Sort by Distance</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => { setSortMode("reviews"); setShowSortMenu(false); setShops(applySorting([...shops])); }}>
              <Text>Sort by Reviews</Text>
            </TouchableOpacity>
          </View>
        )}

        {isAdmin && (
          <TouchableOpacity onPress={() => router.replace('/modify_or_add')} style={styles.iconButton}>
            <Feather name="plus" size={24} color="black" />
          </TouchableOpacity>
        )}

        {superAdminEmail == "superadmin@gmail.com" && (
          <TouchableOpacity onPress={() => router.replace('/super_admin_user_page')} style={styles.iconButton}>
            <MaterialIcons name="coffee" size={24} color="black" />
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
