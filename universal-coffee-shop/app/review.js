import { View, Text, TouchableOpacity, StyleSheet,TextInput} from "react-native";
import {SelectList} from 'react-native-dropdown-select-list'
import {useState, useEffect} from 'react';
import { useRouter } from "expo-router";
 
export default function review()
{
    const router = useRouter();
 

    const [listOfShops, setShops] = useState([]);

    const[selectedCoffeeShop, setSelected] = useState("");

    return(
        <View style={styles.box}>

                <Text style={styles.header}>Write a review</Text>

            <Text style={styles.formText}>Select the Coffeeshop</Text>
                <View style={styles.option}>
                 <SelectList boxStyles={{borderWidth:0}} placeholder='Modify A Coffeeshop' data={listOfShops} setSelected={setSelected} />
                </View>

                <Text style={styles.formText}>Write your review here</Text>
                <TextInput style={styles.option}></TextInput>
         


            <TouchableOpacity onPress={() => router.push("/home")}>
                      <Text style={styles.backText}>BACK</Text>
            </TouchableOpacity>
 
            </View>
        );
}


const styles = StyleSheet.create({
  header:{
    fontSize:30,
    fontWeight:'bold',
    padding:10,
    color: "#000",
    fontFamily: "Anton-Regular",
  },
  formText:
  {
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
    width:'100%',
    alignItems:'center'
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
