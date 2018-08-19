
    function filterByBrand(passed_brand, passed_color, passed_size) {
        
        if (passed_brand !== '' && passed_brand !== undefined) {
            
            if (passed_color !== '' && passed_color !== undefined){

                if (passed_size !== '' && passed_size !== undefined) {
                    console.log(_.filter(shoeMap, {'brand':passed_brand, 'colour': passed_color, 'size': passed_size}));
                    
                    return _.filter(shoeMap, {'brand':passed_brand, 'colour': passed_color, 'size': passed_size});
                    
                }
                console.log(_.filter(shoeMap, {'brand':passed_brand, 'colour': passed_color}));
                
                return _.filter(shoeMap, {'brand':passed_brand, 'colour': passed_color});
                
            } else if (passed_size !== ''){

                if (passed_color !== '' && passed_color !== undefined) {
                    console.log(_.filter(shoeMap, {'brand':passed_brand, 'colour': passed_color, 'size': passed_size}));
                    
                    return _.filter(shoeMap, {'brand':passed_brand, 'colour': passed_color, 'size': passed_size})
                    
                }
                console.log(_.filter(shoeMap, {'brand':passed_brand, 'size': passed_size}));
                
                return _.filter(shoeMap, {'brand':passed_brand, 'size': passed_size});
                
            }
            console.log(_.filter(shoeMap, {'brand':passed_brand}));
            
            return _.filter(shoeMap, {'brand':passed_brand});
            //result = shoeMap.filter(current => (current.brand==passed_brand));
        }
        //return {};
    }

    function filterByColor (passed_color, passed_brand, passed_size) {
        if (passed_color !== '' && passed_color !== undefined) {
            
            if (passed_brand !== '' && passed_brand !== undefined){

                if (passed_size !== '' && passed_size !== undefined) {
                    console.log(_.filter(shoeMap, {'brand':passed_brand, 'colour': passed_color, 'size': passed_size}));
                    
                    return _.filter(shoeMap, {'brand':passed_brand, 'colour': passed_color, 'size': passed_size});
                    
                }
                console.log(_.filter(shoeMap, {'brand':passed_brand, 'colour': passed_color}));
                
                return _.filter(shoeMap, {'brand':passed_brand, 'colour': passed_color});
                
            } else if (passed_size !== ''){

                if (passed_brand !== '' && passed_brand !== undefined) {
                    console.log(_.filter(shoeMap, {'brand':passed_brand, 'colour': passed_color, 'size': passed_size}));
                    
                    return _.filter(shoeMap, {'brand':passed_brand, 'colour': passed_color, 'size': passed_size})
                    
                }
                console.log(_.filter(shoeMap, {'colour':passed_size, 'size': passed_size}));
                
                return _.filter(shoeMap, {'colour':passed_size, 'size': passed_size});
                
            }
            console.log(_.filter(shoeMap, {'colour':passed_color}));
            
            return _.filter(shoeMap, {'colour':passed_color});
            //result = shoeMap.filter(current => (current.brand==passed_brand));
        }
        //return {};
    }

    function filterBySize (passed_size, passed_brand, passed_color) {
        if (passed_size !== '' && passed_size !== undefined) {
            
            if (passed_brand !== '' && passed_brand !== undefined){

                if (passed_color !== '' && passed_color !== undefined) {
                    console.log(_.filter(shoeMap, {'brand':passed_brand, 'colour': passed_color, 'size': passed_size}));
                    
                    return _.filter(shoeMap, {'brand':passed_brand, 'colour': passed_color, 'size': passed_size});
                    
                }
                console.log(_.filter(shoeMap, {'brand':passed_brand, 'size': passed_size}));
                
                return _.filter(shoeMap, {'brand':passed_brand, 'size': passed_size});
                
            } else if (passed_color !== '' && passed_color !== undefined){

                if (passed_brand !== '' && passed_brand !== undefined) {
                    console.log(_.filter(shoeMap, {'brand':passed_brand, 'colour': passed_color, 'size': passed_size}));
                    
                    return _.filter(shoeMap, {'brand':passed_brand, 'colour': passed_color, 'size': passed_size})
                    
                }
                console.log(_.filter(shoeMap, {'colour':passed_size, 'size': passed_size}));
                
                return _.filter(shoeMap, {'colour':passed_size, 'size': passed_size});
                
            }
            console.log(_.filter(shoeMap, {'size':passed_size}));
            
            return _.filter(shoeMap, {'size':passed_size});
            //result = shoeMap.filter(current => (current.brand==passed_brand));
        }
        //return {};
    }
