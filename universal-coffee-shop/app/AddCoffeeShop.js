 
import {useState} from 'react';
import {Text,TextInput,StyleSheet,ScrollView,TouchableOpacity, Alert} from 'react-native';
import { useRouter } from "expo-router";
import { SafeAreaView } from 'react-native-safe-area-context';

function AddCoffeeShop()
{

const router = useRouter();

const [coffeeShopName, setCoffeeShopName] = useState("");
const [OwnerID, setID] = useState("");
const [streetAddress, setStreetAddress] = useState("");
const [city, setCity] = useState("");
const [state, setState] = useState("");
const [PhoneNum, setPhoneNumber] = useState("");
const [logoURL, setLogoURL] = useState("");

const [responseMessage, setResponseMessage] = useState("");


function fun1(e){ setCoffeeShopName(e);}

function fun2(e){  setID(e);}

function fun3(e){ setStreetAddress(e);}

function fun4(e){setCity(e);}

function fun5(e){setState(e);}

function fun6(e){setPhoneNumber(e);}

function fun7(e){setLogoURL(e);}

 const form_content = {
    'coffee_shop_name': coffeeShopName, 
    'owner_id': OwnerID, 
    'street_address': streetAddress, 
    'city': city, 
    'state': state, 
    'phone_number': PhoneNum,
    'logoURL': logoURL 
};

 const submitForm = async () => {
  //This 'if' statement forces the user to fill out every section of the form
    if(coffeeShopName!="" && OwnerID!="" && streetAddress !="" && city !="" && state !="" && PhoneNum!="" && logoURL!=""){
     try {
        
        const response = await fetch('http://192.168.1.175:8080/recieveForm/', {
             method: 'POST',
             headers: {
                'Content-Type': 'application/json'  
            },
             body: JSON.stringify(form_content)
        });
 
        if (response.ok) {
            /*this hits if everything runs correctly and fetch returns
            with a status code in the range of 200 */
            
            alert("Form submitted sucessfully");
            const data = await response.json();
            setResponseMessage(data.storeName);
            
        } else {
            /*This hits if the server address is correct, but the response from the
            server gave an error like a 404 status code. One reason for an error 
            could be an incorrect endpoint name*/
          
            alert("There was an error when submitting the form, please try again. Make sure the phone number includes only numbers and '-'")        
        }
    } catch (error) {
        //This hits if the server address is incorrect (couldn't reach the server)
        setResponseMessage(`Network Error: ${error.message}`); 
    }
  }
  else {
    Alert.alert("Please fill out all fields of the form")
  }
  };

    return (<>
     <SafeAreaView style={styles.container}>

        <ScrollView style={styles.form}>

            <Text style={styles.header}>Please enter the details for your new Coffee shop</Text>

            <Text style={styles.label}>Coffeeshop name:</Text>
            <TextInput placeholderTextColor={'#747474ff'} placeholder='My Coffee Shop' style={styles.input} value={coffeeShopName} onChangeText={fun1}></TextInput>
             
            <Text style={styles.label}>Owner name:</Text>
            <TextInput placeholderTextColor={'#747474ff'} placeholder='John Doe' style={styles.input} value={OwnerID} onChangeText={fun2}></TextInput>

            <Text style={styles.label}>Street address:</Text>
            <TextInput placeholderTextColor={'#747474ff'} placeholder='123 Fake Street' style={styles.input} value={streetAddress} onChangeText={fun3}></TextInput>

            <Text style={styles.label}>City:</Text>
            <TextInput placeholderTextColor={'#747474ff'} placeholder='Springfield' style={styles.input} value={city} onChangeText={fun4}></TextInput>

            <Text style={styles.label}>State:</Text>
            <TextInput placeholderTextColor={'#747474ff'} placeholder='Illinois' style={styles.input} value={state} onChangeText={fun5}></TextInput>

            <Text style={styles.label}>Phone #:</Text>
            <TextInput placeholderTextColor={'#747474ff'} placeholder='224-123-4567' style={styles.input} value={PhoneNum} onChangeText={fun6}></TextInput>
             
            <Text style={styles.label}>Shop URL (Website):</Text>
            <TextInput placeholderTextColor={'#747474ff'} placeholder='https://www.starbucks.com/' style={styles.input} value={logoURL} onChangeText={fun7}></TextInput>
        </ScrollView>

        <TouchableOpacity onPress={submitForm}><Text style={styles.submit}>Submit Form</Text></TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/home")}>
                  <Text style={styles.backText}>Back</Text>
                </TouchableOpacity>
         
     </SafeAreaView>
        </>);
}

const styles = StyleSheet.create({
  container: 
  {  
    width:'100%'
  },
  form: 
  {
    
  },
  label: 
  {
    backgroundColor:'lightblue',
    textAlign:'center',
    paddingRight:'20px', 
    fontSize: 18,  
  },  
  input: 
  {
    textAlign:'center',
    paddingLeft:'20px',
    borderWidth: 2,
    borderColor: "black",
    fontSize: 15,
    
  },
  header:
  {
    textAlign:'center',
    borderWidth: 2,
    borderColor: "black",
    fontSize: 24,
  },
  submit:
  {
    fontSize: 20,
    color: "#000",
    fontFamily: "Anton-Regular",
    textAlign: "center",
    lineHeight: 50,
  },
  backText: {
    textAlign: "center",
    marginTop: 12,
    color: "#000",
    fontSize: 12,
    fontFamily: "Anton-Regular",
  },
});
 
export default AddCoffeeShop;