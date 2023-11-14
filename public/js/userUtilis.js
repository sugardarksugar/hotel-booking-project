async function getUserName() {
    let logInUserRes = await fetch('/user')
    let LogInUserInfo = await logInUserRes.json()
    let userElement = document.querySelector('.userinformation')

    if (!LogInUserInfo.username) {
        userElement.textContent = ''
    } else {
        userElement.textContent = 'Welcome back ' + LogInUserInfo.username
    }
}
getUserName()

async function signOut() {

    let logOutButton = document.querySelector('.logout-btn')

    logOutButton.addEventListener('click', async (event) => {
        let signOutRes = await fetch('/signout')
        location.reload();
    })
}
signOut()

