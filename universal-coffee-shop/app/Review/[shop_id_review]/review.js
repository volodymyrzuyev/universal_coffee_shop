import { View, Text, TouchableOpacity, StyleSheet,TextInput,Alert} from "react-native";
import {SelectList} from 'react-native-dropdown-select-list'
import {useState, useEffect} from 'react';
import { useRouter } from "expo-router";
import { useLocalSearchParams } from 'expo-router';
import Constants from 'expo-constants';
import * as SecureStore from "expo-secure-store";


const config = Constants.expoConfig;
const API_BASE = config.backendUrl;

export default function review()
{
    const router = useRouter();
 
    const { shop_id_review, shopName } = useLocalSearchParams();

    const [reviewContent, updateReviewContent] = useState("");

    const [selectedNum, setSelectedNum] = useState(0);

    const listData = [
      {key: 1, value: 1 + " Star"},
      {key: 2, value: 2 + " Star"},
      {key: 3, value: 3 + " Star"},
      {key: 4, value: 4 + " Star"},
      {key: 5, value: 5 + " Star"}
    ]

    const form_content = {
      'text': reviewContent,
      'num_stars':selectedNum
    }

    async function submitForm()
    {
      console.log("herelk")
        try {

            if(reviewContent != "" && selectedNum != 0)
              {


                const url = `${API_BASE}/home/shop/reviews/${shop_id_review}/`;
                const response = await fetch(url, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${await SecureStore.getItemAsync("user_id")}`,
                        },
                        body: JSON.stringify(form_content)
                    });

                  const data = await response.json();
                    console.log(data.successful)
                  if (!response.ok)
                  {
                    Alert.alert("Couldn't submit the review, try again")
                  }
                  else if(data.successful == false)
                  {
                    Alert.alert("You may only submit one review per shop")
                  }
                  else {
                    Alert.alert("Success review submitted")
                    }
              }
            else{
              Alert.alert("All sections of the form must be filled");
              return;
            }

            } catch (err) {
              console.log('FETCH ERROR:', err);
            }
    }

    return(
        <View style={styles.box}>

                <Text style={styles.header}>Write a review of {shopName}</Text>

                <Text style={styles.formText}>Write your review here</Text>
                <TextInput style={styles.option} onChangeText={updateReviewContent}></TextInput>
         
            <View style={styles.rateBox}>
                 <SelectList boxStyles={{borderWidth:0}} placeholder='Rate the shop' data={listData} setSelected={setSelectedNum} />
            </View>

            <TouchableOpacity onPress={submitForm}><Text style={styles.submit}>Submit Form</Text></TouchableOpacity>
            

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
  },
  rateBox:{
    borderRadius:6,
    borderWidth:5,
    padding:10,
    width:'50%',
    },
  submit:
  {
    fontSize: 20,
    color: "#000",
    fontFamily: "Anton-Regular",
    textAlign: "center",
    lineHeight: 50,
    borderRadius:6,
    borderWidth:5,
    width:'90%',
    margin:10,
    padding:5,
  },

   
});
