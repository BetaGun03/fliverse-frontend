export interface User {
    username      ?: string
    token          : string
    email         ?: string
    name          ?: string
    birthdate     ?: Date
    profilePic    ?: string
    profilePicFile?: File    // Used for uploading profile picture. Is a temporary file
    password      ?: string  // Used for changing password. Is a temporary field
}
