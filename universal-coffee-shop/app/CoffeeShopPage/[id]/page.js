import {Text} from 'react-native';
import { useState } from 'react';
  

export default function page()
{

    async function idk()
    {
        const nameofastore = await fetch(`/getCoffee_Shop/${coffeeShopName}`)
        const data = await nameofastore.json();
        const newData = data.Coffeeshop;
        setCoffeeShopName(newData);
    }

     const [coffeeShopName, setCoffeeShopName] = useState("");
     const [OwnerName, setOwnerName] = useState("");
        
    return(
        <>
        
        <Text>CoffeeShop: {coffeeShopName}</Text>
        <Text>Owner Name: {OwnerName}</Text>
        </>
     )
}