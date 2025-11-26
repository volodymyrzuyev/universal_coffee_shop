import {Text, TouchableOpacity,View,StyleSheet} from 'react-native';
import { useRouter } from 'expo-router';
import {useState,useEffect} from 'react';

import {SelectList} from 'react-native-dropdown-select-list'

export default function modify_or_add(){
  const router = useRouter();

  //selected variable for SelectList
  const [selected, setSelected] = useState("");

  //data for list options
  const data = [
    {key:'ShopA', value:'Select a shop'},
  ]

  //this will redirect to the ModifyCoffeeShop page when the admin selects the coffeeshop they want to modify
     useEffect(() => {

      /*because selected initially loads with "", useEffect is automatically called
      so we prevent this by checking to make sure selected isn't empty (is true)*/
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
                 <SelectList boxStyles={{borderWidth:0}} placeholder='Modify A Coffeeshop' data={data} setSelected={setSelected} />
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
    padding:0,
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
