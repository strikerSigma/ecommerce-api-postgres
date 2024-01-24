interface UserInt {
    id?: string,
    name: string,
    email: string,
    password: string
}

let user:UserInt[]=[{
    id: '123',
    name: 'afdfas',
    email: 'fasfa',
    password: 'asdfasd'

}];

export const User = {
     findById: (id: string)=>user.map((e)=> id == e.id ),
     CreateOne: (body: any)=> user.push({name: body.name,email:body.email,password: body.password}),
     FindOne:   (item:any)=>user.map((e)=> item == e.id || e.email || e.password || e.name )    
}

