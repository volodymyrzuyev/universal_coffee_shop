// universal-coffee-shop/app/home.js
import {useState} from 'react';
import { StyleSheet, Text, View, TextInput, SafeAreaView, FlatList, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import CoffeeShopCard from '../components/CoffeeShopCard';
import { useRouter } from 'expo-router';


const DUMMY_DATA = [
  { id: '1', name: 'LAB COFFEE', logoUrl: 'https://placeholder.com/100', color: '#B0C4DE' },
  { id: '2', name: 'THE COFFEEHOUSE', logoUrl: 'https://placeholder.com/100', color: '#D3D3D3' },
  { id: '3', name: 'CRAFTED', logoUrl: 'https://placeholder.com/100', color: '#FFFFFF' },
  { id: '4', name: 'LVL UP COFFEE BAR', logoUrl: 'https://placeholder.com/100', color: '#F08080' },
];

//Searches for a coffeeshop when user enters a coffeeshop name
async function searchCoffeeShop(coffeeShopName)
{
  try{
       
    const response = await fetch(`http://localhost:8080/home/getCoffee_Shop/${coffeeShopName}`);
    const data = await response.json();
    console.log(data+ "sddsd")
    
    if(!response.ok)
    {
      console.log("Not okay dude")
    }
  }
  catch(error)
  {
    console.log("ERROR: "+error)
  }
   
}

export default function HomeScreen() {
  
const [coffeeShopName, setCoffeeShopName] = useState("");
function fun1(e){ setCoffeeShopName(e);}

const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TextInput value={coffeeShopName} onChangeText={fun1} style={styles.searchBar} placeholder="Search coffee shops..."></TextInput>
        
         <TouchableOpacity onPress={() => {searchCoffeeShop(coffeeShopName)}} style={styles.iconButton}>
            <Feather name="search" size={24} color="black" />
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => router.replace('/AddCoffeeShop')} style={styles.iconButton}>
            <Feather name="plus" size={24} color="black" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconButton}>
            <Feather name="user" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <Text style={styles.sectionTitle}>NEARBY</Text>

      <Text>CoffeeShop: {coffeeShopName}</Text>
      <FlatList
        data={DUMMY_DATA}
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