// universal-coffee-shop/app/home.js
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, SafeAreaView, FlatList, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import CoffeeShopCard from '../components/CoffeeShopCard';
import { useRouter } from 'expo-router';
import * as SecureStore from "expo-secure-store";

// BACKEND URL 
const BASE_URL = 'http://192.168.1.175:8080';

export default function HomeScreen() {
  const router = useRouter();

  // search box
  const [searchText, setSearchText] = useState('');

  // data coming from backend
  const [shops, setShops] = useState([]);

  // maps SQL rows → frontend shop objects
  function mapRows(rows) {
    if (!Array.isArray(rows)) return [];
    return rows.map((row) => ({
      id: row[0],      // store_id
      name: row[1],    // coffee_shop_name
    }));
  }

  // fetch from backend (all or filtered)
  async function fetchShops(name) {
    try {
      const query = name.trim() === '' ? '%25' : encodeURIComponent(name.trim());
      const url = `${BASE_URL}/home/getCoffee_Shop/${query}`;

      const response = await fetch(url);
 
      const data = await response.json();

      const mapped = mapRows(data.Coffeeshop);
      setShops(mapped);
    } catch (err) {
      console.log('FETCH ERROR:', err);
    }
  }
  async function handleLogout() {
  try {
    //we are not using the backend logout endpoint for now, just clear local storage
    await SecureStore.deleteItemAsync("user_id");// Remove user_id from secure storage

//so now the user_id is deleted from secure storage, we can redirect to login.

    
    router.replace("/login");
  } catch (err) {
    console.log("LOGOUT ERROR:", err);
  }
}

  // load all shops once
   useEffect(() => {
     fetchShops('');
   }, []);

  // header section (your same layout)
 

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

        <TouchableOpacity onPress={() => router.replace('/AddCoffeeShop')} style={styles.iconButton}>
          <Feather name="plus" size={24} color="black" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconButton}>
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
});
