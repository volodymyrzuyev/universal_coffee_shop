import { useEffect, useState } from 'react'
import { Text, TouchableOpacity, ScrollView, StyleSheet, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useRouter } from "expo-router";
import { SafeAreaView } from 'react-native-safe-area-context';
import Constants from 'expo-constants';
import * as SecureStore from "expo-secure-store";

const config = Constants.expoConfig;

export default function page() {
    //the information about the coffeeshop that is dynamically changed on component mount
    const [coffeeShopName, setCoffeeShopName] = useState("");
    const [OwnerID, setID] = useState("");
    const [streetAddress, setStreetAddress] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [PhoneNum, setPhoneNumber] = useState("");

    const router = useRouter();

    // BACKEND URL 
    const BASE_URL = config.backendUrl;

    //runs on component mount to get the information based on the coffeeshops id
    useEffect(() => {
        fetchShopById(shop_id);
    }, []);

    //grabs data for the coffeeshop that the user clicked on and updates
    //the page accordingly
    async function fetchShopById(shop_id) {
        try {
            //fetch api that gets and returns to 'response' object, information about a single coffeeshop
            const url = `${BASE_URL}/home/get_coffeeshop_by_id/${shop_id}`;
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await SecureStore.getItemAsync("user_id")}`,
                },
            });

            //if the coffeeshop doesn't exist we need to make sure the user knows
            if (!response.ok) {
                alert("that coffeeshop is poopoo (doesn't exist)")
                return;
            }

            //this holds the un-jsoned object containing information about the single coffeeshop the user clicked on
            const data = await response.json();

            //using array destructuring on the six elements we need for the coffeeshop
            const [, coffee_shop_name, owner_id, street_address, city, state, phone_num] = data.Coffeeshop;

            //setting the state variables to the ones destructured above
            setCoffeeShopName(coffee_shop_name);
            setID(owner_id);
            setStreetAddress(street_address);
            setCity(city);
            setState(state);
            setPhoneNumber(phone_num);

        } catch (err) {
            console.log('FETCH ERROR:', err);
        }
    }

    /*This gets the name of the coffeeshop that was sent from CoffeeShopCard.js
    'id' is used because it represents the route of the [id] folder */
    const { shop_id } = useLocalSearchParams();

    return (
        <>
            <SafeAreaView style={styles.container}>
                <ScrollView contentContainerStyle={styles.scroll}>

                    <Text style={styles.header}>
                        Hello and welcome to {"\n"}{coffeeShopName}
                    </Text>

                    <View style={styles.infoBox}>
                        <Text style={styles.text}>The owner of our establishment is {OwnerID}</Text>
                        <Text style={styles.text}>You can find us at {streetAddress}</Text>
                        <Text style={styles.text}>{city}, {state}</Text>
                        <Text style={styles.text}>Call us at {PhoneNum}</Text>
                    </View>

                    <TouchableOpacity style={styles.button} onPress={() => router.push("/home")}>
                        <Text style={styles.buttonText}>Write a review of this shop</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.backBtn} onPress={() => router.push("/home")}>
                        <Text style={styles.backText}>BACK</Text>
                    </TouchableOpacity>

                </ScrollView>
            </SafeAreaView>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
    },
    scroll: {
        alignItems: "center",
        padding: 20,
        gap: 25,
    },
    header: {
        fontSize: 40,
        textAlign: "center",
        fontFamily: "Anton-Regular",
        color: "#000",
        lineHeight: 45,
        marginTop: 10,
    },
    infoBox: {
        width: "95%",
        borderWidth: 2,
        borderRadius: 15,
        paddingVertical: 20,
        backgroundColor: "#fff",
        alignItems: "center",
        gap: 10,
    },
    text: {
        fontSize: 18,
        textAlign: "center",
        color: "#000",
        fontFamily: "Anton-Regular",
    },
    shopName: {
        textAlign: 'center',
        fontWeight: 'bold',
    },
    button: {
        width: "90%",
        backgroundColor: "#000",
        paddingVertical: 14,
        borderRadius: 25,
        alignItems: "center",
    },
    buttonText: {
        color: "#FFF",
        fontSize: 18,
        fontFamily: "Anton-Regular",
    },
    backBtn: {
        paddingTop: 5,
    },
    backText: {
        color: "#000",
        fontSize: 18,
        fontFamily: "Anton-Regular",
    },
    perimeter: { textAlign: 'center' },
});
