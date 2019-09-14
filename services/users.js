function getUsers() {
    let users = [
        {
            name: "Pablo",
            last_name: "Torres"
        },
        {
            name: "Ivan",
            last_name: "Sabido"
        }
    ]
    return users
}

function saveUsers(objUsers){
    console.log(objUsers)
    return 1

}

module.exports = {
    getUsers,
    saveUsers
}