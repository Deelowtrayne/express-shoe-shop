function ShoeCatalogue() {

    function addNew(shoe) {
        return axios.post('/api/shoes/add', shoe);
    }

    function getAvailableShoes() {
        return axios.get('/api/shoes/all');
    }

    function filterFunc(search_params) {
        return axios.post('/api/shoes/filter', search_params);
    }

    function addtoCart(item) {
        return axios.post('/api/cart/add/'+item.id,
            { qty: item.qty }
        );
    }

    function clearTrolley() {
        return axios.get('/api/cart/clear');
    }

    function getTrolley() {
        return axios.get('/api/cart/all');
    }

    return {
        new: addNew,
        map: getAvailableShoes,
        filterBy: filterFunc,
        toCart: addtoCart,
        cart: getTrolley,
        cancel: clearTrolley
    };
}
