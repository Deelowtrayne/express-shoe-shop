function ShoeCatalogue() {


    function addNew(brand, color, size, price, qty) {
        //return axios.post('api/shoes/add')
    }

    function filterFunc(search_params) {
        return _.filter(availableShoes, search_params);
    }

    function addtoCart(id) {
        // check if it exists in the trolley (update if it does) or (add if it doesn't)
        let exists = false;

        var updateItem = availableShoes.find(shoe => (shoe.id == id));


        if (updateItem.qty > 0) {
            trolley.map(current => {
                if (current.id == id) {
                    current.qty += 1;
                    exists = true;
                }
            })

            if (!exists) {
                trolley.push({
                    id: id,
                    brand: updateItem.brand,
                    colour: updateItem.colour,
                    size: updateItem.size,
                    price: updateItem.price,
                    qty: 1
                });
            }

            // update the shoe map
            availableShoes.map(current => {
                if (current.id == id) {
                    current.qty = current.qty - 1;
                }
            })
            return true;
        }

        return false;
    }

    function clearTrolley() {
        for (let i = 0; i < availableShoes.length; i++) {
            // temp vars
            let current = availableShoes[i];
            let trolleyMatch = trolley.find(shoe => (shoe.id == current.id));
            // replace product
            if (trolleyMatch) {
                current.qty += trolleyMatch.qty;
            }
        }
        trolleyTotal = 0.00;
        trolley = [];
    }

    function getCartTotal() {
        let subTotal = 0;
        if (trolley.length > 0) {
            subTotal = trolley.reduce((total, current) => (total + (current.price * current.qty)), 0);
        }
        return (trolleyTotal + subTotal).toFixed(2);
    }

    function getAvailableShoes() {
        return availableShoes;
    }

    function getTrolley() {
        return trolley;
    }

    return {
        new: addNew,
        map: getAvailableShoes,
        filterBy: filterFunc,
        toCart: addtoCart,
        cart: getTrolley,
        cartTotal: getCartTotal,
        cancel: clearTrolley
    };
}


