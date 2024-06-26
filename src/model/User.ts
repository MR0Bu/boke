export interface User {
    registrationDate: ''|undefined,
    userEmail: ''|undefined,
    userId: number|undefined,
    userName: ''|undefined,
    userNickname: ''|undefined,
    userPassword: ''|undefined,
    userProfilePhoto: ''|undefined,
    userTelephoneNumber: number|undefined
}
export interface Blog {
    title: '',
    content: '',
    blogId:number,
    userId:number,
    postTime:string
}
