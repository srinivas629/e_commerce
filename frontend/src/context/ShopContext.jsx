import { createContext, useEffect, useState } from "react";
import { products } from "../assets/assets";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = "₹";
  const delivery_fee = 10;
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [cardItems, setCardItems] = useState({});
  const navigate = useNavigate();

  const addToCard = async (itemID, size) => {
    if (!size) {
      toast.error("Select Product Size");
      return;
    }

    let cardData = structuredClone(cardItems);

    if (cardData[itemID]) {
      if (cardData[itemID][size]) {
        cardData[itemID][size] += 1;
      } else {
        cardData[itemID][size] = 1;
      }
    } else {
      cardData[itemID] = {};
      cardData[itemID][size] = 1;
    }
    setCardItems(cardData);
  };

  const getCardCount = () => {
    let totalCount = 0;
    for (const items in cardItems) {
      for (const item in cardItems[items]) {
        try {
          if (cardItems[items][item] > 0) {
            totalCount += cardItems[items][item];
          }
        } catch (error) {}
      }
    }
    return totalCount;
  };

  const updateQuantity = async (itemID, size, quantity) => {
    let cardData = structuredClone(cardItems);

    cardData[itemID][size] = quantity;

    setCardItems(cardData);
  };

  const getCardAmount = () => {
    let totalAmount = 0;
    for (const items in cardItems) {
      let itemInfo = products.find((product) => product._id === items);
      for (const item in cardItems[items]) {
        try {
          if (cardItems[items][item] > 0) {
            totalAmount += itemInfo.price * cardItems[items][item];
          }
        } catch (error) {}
      }
    }
    return totalAmount;
  };

  const value = {
    products,
    currency,
    delivery_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cardItems,
    addToCard,
    getCardCount,
    updateQuantity,
    getCardAmount,
    navigate,
  };

  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;
