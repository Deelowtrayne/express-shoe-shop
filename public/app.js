function ShoeCatalogue() {


    function addNew(shoe) {
        return axios.post('/api/shoes/add', shoe);
    }

    function getAvailableShoes() {
        return availableShoes;
    }

    function filterFunc(search_params) {
        return _.filter(availableShoes, search_params);
    }

    function addtoCart(id) {
        return axios.post('/api/cart/add/'+id);
    }

    function clearTrolley() {
        return axios.get('/api/cart/clear');
    }

    function getTrolley() {
        return axios.get('/api/cart/all')
    }

    // function getCartTotal() {
    //     return axios.get('/api/cart/total')
    // }

    

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


