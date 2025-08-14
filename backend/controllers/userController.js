import User from "../models/User.js"

export const getUserData = async (req, res) => {
    try {
        const {userId} = req.auth();
        const user = await User.findById(userId);
        if(!user) {
            return res.json({success: false, message: "User not found"})
        }
        res.json({success: true, user})
    } catch (error) {
        res.json({success: false, message: error.message})
    }
}

export const updateUserData = async(req, res) => {
    try {
        const {userId} = req.auth()
        const { username, bio, location, full_name } = req.body

        const tempUser = await User.findById(userId)

        !username && (username = tempUser.username)

        if(tempUser.username !== username) {
            const user = User.findOne({username})
            if( user ) {
                username = tempUser.username
            }
        }

        const updatedData ={
            username, 
            bio, 
            location, 
            full_name
        }
    } catch (error) {
        res.json({success: false, message: error.message})
    }
}

// Find Users 
export const discoverUsers = async (req, res) => {
    try {
        const {userId} = req.auth();
        const { input } = req.body;

        const allUsers = await User.find(
            {
                $or: [
                    {username: new RegExp(input, 'i')},
                    {email: new RegExp(input, 'i')},
                    {location: new RegExp(input, 'i')},
                    {full_name: new RegExp(input, 'i')},
                ]
            }
        )

        const filteredUsers = allUsers.filter(user => user._id !== userId)
        res.json({success: true, message: error.message})

    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message})
    }
}

// Follow Users 
export const followUser = async (req, res) => {
    try {
        const { userId } = req.auth();
        const {id} = req.body;

        const user = await User.findById(userId);

        if(user.following.includes(id)) {
            return res.json({success: false, message: "You are already following this user"})
        }

        user.following.push(id);
        await user.save()

        const toUser = await User.findById(id)
        toUser.followers.push(id)
        await toUser.save()

        res.json({success: true, message: "Now you are following the user"})

    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message})
    }
}

// UnFollow Users 
export const unfollowUser = async (req, res) => {
    try {
        const { userId } = req.auth();
        const {id} = req.body;

        const user = await User.findById(userId);
        user.following = user.following.filter((user) => user !== id)
        await user.save()
        
        const toUser = await User.findById(id);
        toUser.followers = toUser.followers.filter((user) => user !== userId)
        await toUser.save()

        res.json({success: true, message: "You are no longer following this user"})

    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message})
    }
}