const cleanUsers = (arr) => {
    for (const user of arr){
        delete user.password
    }
    return arr
}

export default cleanUsers