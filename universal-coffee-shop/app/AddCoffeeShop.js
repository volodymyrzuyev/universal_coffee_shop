import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Switch,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { SafeAreaView } from 'react-native-safe-area-context';


function AddCoffeeShop()
{

const [coffeeShopName, setCoffeeShopName] = useState("");
const [OwnerName, setOwnerName] = useState("");
const [streetAddress, setStreetAddress] = useState("");
const [city, setCity] = useState("");
const [state, setState] = useState("");
const [PhoneNum, setPhoneNumber] = useState("");


function fun1(e)
{
    setCoffeeShopName(e);
}

function fun2(e)
{
    setOwnerName(e);
}

function fun3(e)
{
    setStreetAddress(e);
}

function fun4(e)
{
    setCity(e);
}

function fun5(e)
{
    setState(e);
}

function fun6(e)
{
    setPhoneNumber(e);
}

 const submitForm = async () => {
     try { 
         
      // Make a POST request to the API endpoint
      const response = await fetch('http://127.0.0.1:8000/recieveForm', {
        method: 'POST', // Specify HTTP method as POST
        headers: {
          'Content-Type': 'application/json', // Set content type to JSON
        },
        body: JSON.stringify({'Coffee_Shop_Name': coffeeShopName,  'Owner_Name' :OwnerName, 'Street_Address' : streetAddress, 'City':city, 'State':state,'Phone_Number':PhoneNum}) // Send data in the request body
      });
      
      // Parse the JSON response
      const data = await response.json();
      if (response.ok) { // Check if the response status is OK (200-299)
        console.log(data); // Log the response data to the console
        Alert.alert("Post created at:", data.createdAt || "No timestamp"); // Show success alert with timestamp
      } else {
        console.error(data); // Log the error response to the console
        Alert.alert("Error", data.error || "Request failed"); // Show error alert
      }

    } catch (error) { // Catch any errors during the request
      console.error(error); // Log the error to the console
      Alert.alert("Error", "Something went wrong."); // Show generic error alert
    }
  };




    return (<>
     <SafeAreaView style={styles.container}>
        
        <Text>Please enter the details for your new Coffee shop</Text>
        
        <ScrollView style={styles.form}>
            <Text style={styles.text}>Coffeeshop name:</Text>
            <TextInput placeholderTextColor={'#747474ff'} placeholder='My Coffee Shop' style={styles.input} value={coffeeShopName} onChangeText={fun1}></TextInput>
             
            <Text style={styles.text}>Owner name:</Text>
            <TextInput placeholderTextColor={'#747474ff'} placeholder='John Doe' style={styles.input} value={OwnerName} onChangeText={fun2}></TextInput>

            <Text style={styles.text}>Street address:</Text>
            <TextInput placeholderTextColor={'#747474ff'} placeholder='123 Fake Street' style={styles.input} value={streetAddress} onChangeText={fun3}></TextInput>

            <Text style={styles.text}>City:</Text>
            <TextInput placeholderTextColor={'#747474ff'} placeholder='Springfield' style={styles.input} value={city} onChangeText={fun4}></TextInput>

            <Text style={styles.text}>State:</Text>
            <TextInput placeholderTextColor={'#747474ff'} placeholder='Illinois' style={styles.input} value={state} onChangeText={fun5}></TextInput>

            <Text style={styles.text}>Phone #:</Text>
            <TextInput placeholderTextColor={'#747474ff'} placeholder='224-123-4567' style={styles.input} value={PhoneNum} onChangeText={fun6}></TextInput>
            <Text>Current Value: {PhoneNum}</Text>

            <Text style={styles.text}>Hours:</Text>

            <Text style={{color:"black"}}>Monday</Text>
            <View style={styles.hoursView}>
                <TextInput placeholderTextColor={'#747474ff'} placeholder='8:00am' style={styles.hours}></TextInput>
                <TextInput placeholderTextColor={'#747474ff'} placeholder='9:30pm' style={styles.hours}></TextInput>
            </View>

            <Text style={{color:"black"}}>Tuesday</Text>
            <View style={styles.hoursView}>
                <TextInput placeholderTextColor={'#747474ff'} placeholder='8:00am' style={styles.hours}></TextInput>
                <TextInput placeholderTextColor={'#747474ff'} placeholder='9:30pm' style={styles.hours}></TextInput>
            </View>
             
            <Text style={{color:"black"}}>Wednesday</Text>
            <View style={styles.hoursView}>
                <TextInput placeholderTextColor={'#747474ff'} placeholder='8:00am' style={styles.hours}></TextInput>
                <TextInput placeholderTextColor={'#747474ff'} placeholder='9:30pm' style={styles.hours}></TextInput>
            </View>
             
            <Text style={{color:"black"}}>Thursday</Text>
            <View style={styles.hoursView}>
                <TextInput placeholderTextColor={'#747474ff'} placeholder='8:00am' style={styles.hours}></TextInput>
                <TextInput placeholderTextColor={'#747474ff'} placeholder='9:30pm' style={styles.hours}></TextInput>
            </View>
             
            <Text style={{color:"black"}}>Friday</Text>
            <View style={styles.hoursView}>
                <TextInput placeholderTextColor={'#747474ff'} placeholder='8:00am' style={styles.hours}></TextInput>
                <TextInput placeholderTextColor={'#747474ff'} placeholder='9:30pm' style={styles.hours}></TextInput>
            </View>
             
            <Text style={{color:"black"}}>Saturday</Text>
            <View style={styles.hoursView}>
                <TextInput placeholderTextColor={'#747474ff'} placeholder='8:00am' style={styles.hours}></TextInput>
                <TextInput placeholderTextColor={'#747474ff'} placeholder='9:30pm' style={styles.hours}></TextInput>
            </View>
             
            <Text style={{color:"black"}}>Sunday</Text>
            <View  style={[styles.hoursView, {marginBottom:25}]}>
                <TextInput placeholderTextColor={'#747474ff'} placeholder='8:00am' style={styles.hours}></TextInput>
                <TextInput placeholderTextColor={'#747474ff'} placeholder='9:30pm' style={styles.hours}></TextInput>
            </View>
        </ScrollView>

        <TouchableOpacity onPress={submitForm}><Text style={styles.text}>Submit Form</Text></TouchableOpacity>
        
     
     
     </SafeAreaView>

    
    
    
        </>);
}

const styles = StyleSheet.create({
  container: {
    // 1. Ensure the View takes up the whole screen
    flex: 1, 
    
    // 2. Center items horizontally
    justifyContent: 'center', 
    
    // 3. Center items vertically
    alignItems: 'center', 
    
    // (Optional: Set background color for visibility)
    backgroundColor: '#fff', 
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    // Note: text-align is usually unnecessary here because the container is centered.
  },
  form: 
  {
    borderWidth: 2,
    borderColor: 'black',
    borderStyle: 'solid',
    padding:20,
    margin:10,
    width:250
  },
  input:
  {
    borderWidth: 2,
    borderColor: 'black',
    borderStyle: 'solid',
    fontSize:15,
    color:'black',
    marginBottom:15,
  },
  hours:
  {
    borderWidth: 2,
    borderColor: 'black',
    borderStyle: 'solid',
    fontSize:15,
    color:'black',
    marginBottom:15,
    width:'50%',
  },
  hoursView:
  {
    flexDirection:'row',
    marginBottom:0,
  }

});
 

export default AddCoffeeShop;