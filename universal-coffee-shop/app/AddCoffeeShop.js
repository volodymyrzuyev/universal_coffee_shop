import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { SafeAreaView } from 'react-native-safe-area-context';


function AddCoffeeShop()
{

const [coffeeShopName, setCoffeeShopName] = useState("");
const [OwnerID, setID] = useState("");
const [streetAddress, setStreetAddress] = useState("");
const [city, setCity] = useState("");
const [state, setState] = useState("");
const [PhoneNum, setPhoneNumber] = useState("");

const [responseMessage, setResponseMessage] = useState("");
const [messageColor, setMessageColor] = useState("black");


function fun1(e)
{
    setCoffeeShopName(e);
}

function fun2(e)
{
    setID(e);
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

// Corrected payload in submitForm function
const payload = {
    // Keys match the Python Pydantic model exactly
    'coffeeShopName': coffeeShopName, 
    'OwnerID': OwnerID, 
    'streetAddress': streetAddress, 
    'city': city, 
    'state': state, 
    'PhoneNum': PhoneNum, 
};

 
 

 const submitForm = async () => {
   
     try {
        // 3. Send the POST request
        const response = await fetch('http://localhost:8000/items/', {
            method: 'POST',
            // Crucial: Tell the server the data is JSON
            headers: {
                'Content-Type': 'application/json'
            },
            // Crucial: Convert the JavaScript object to a JSON string
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            const result = await response.json();
            setResponseMessage(`Success! ${result.message}`);
            setMessageColor('green');
        } else {
            const errorData = await response.json();
            setResponseMessage(`Error: ${response.status} - ${JSON.stringify(errorData.detail || errorData.message)}`);
            setMessageColor('red');
        }
    } catch (error) {
        setResponseMessage(`Network Error: ${error.message}`);
        setMessageColor('red');
    }
    
  };




    return (<>
     <SafeAreaView style={styles.container}>
        
        <Text>Please enter the details for your new Coffee shop</Text>
        
        <ScrollView style={styles.form}>
            <Text style={styles.text}>Coffeeshop name:</Text>
            <TextInput placeholderTextColor={'#747474ff'} placeholder='My Coffee Shop' style={styles.input} value={coffeeShopName} onChangeText={fun1}></TextInput>
             
            <Text style={styles.text}>Owner name:</Text>
            <TextInput placeholderTextColor={'#747474ff'} placeholder='John Doe' style={styles.input} value={OwnerID} onChangeText={fun2}></TextInput>

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
        
     <Text style={{ color: messageColor, marginTop: 10 }}>{responseMessage}</Text>
     
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