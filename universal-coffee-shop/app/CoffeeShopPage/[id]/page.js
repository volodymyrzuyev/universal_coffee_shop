import {Text} from 'react-native';
import { useState } from 'react';
  

export default function page()
{

    //This useEffect should render the data of the coffeeshop
    //that the user clicked on. 

    async function idk()
    {
        const nameofastore = await fetch(`/getCoffee_Shop/${coffeeShopName}`)
        const data = await nameofastore.json();
        const newData = data.Coffeeshop;
        setCoffeeShopName(newData);
    }

     
        
    return(
        <>
        
        <Text>CoffeeShop: {coffeeShopName}</Text>
        <Text>Owner Name: {OwnerName}</Text>
        </>
     )
}