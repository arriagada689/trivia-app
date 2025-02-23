const favCategory = (arr) => {
    if (arr.length === 0) {
        return 'None';
    }
    
    let obj = {};
    let maxCategory = arr[0];
    let maxCount = 1;
    
    for (const category of arr) {
        if (obj[category]) {
            obj[category] += 1;
        } else {
            obj[category] = 1;
        }
        
        if (obj[category] > maxCount) {
            maxCategory = category;
            maxCount = obj[category];
        }
    }
    return maxCategory;
};

export default favCategory