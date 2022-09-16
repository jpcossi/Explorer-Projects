import { GithubUser } from "./GitHubUser.js"

//classe  que vai conter a lógica dos dados
//comos dados serão estruturados
export class Favorites{
    constructor(root){
        this.root = document.querySelector(root)
        this.load()

        GithubUser.search('maykbrito')
        .then(user => console.log(user))
    }
    
    load(){
        this.entries = JSON.parse(localStorage.getItem('@github-favorites')) || []
        
    }
    
    save(){
        localStorage.setItem('@github-favorites', JSON.stringify(this.entries))
        
    }
    
    async add(username){
        try{
        const userExists = this.entries.find(entry => entry.login === username)
        
        if(userExists){
            throw new Error('Usuário já cadastrado')
        }

        const user = await GithubUser.search(username)
          
        console.log(user)

        if(user.login === undefined){
            throw new Error("Usuário não encontrado")
        }
        
        this.entries = [user, ...this.entries]
        this.update()
        this.save()
        
    }catch(error){
        alert(error.message)
    }

    
    }
    
    delete(user){
        //higher-order functions (map, reduze, filter)
        const filteredEntries = this.entries
        .filter(entry => entry.login !== user.login)
        
        this.entries = filteredEntries
        this.update()
        this.save()
    }
}

//classe que vai criar a visualização e eventos do html

export class FavoritesView extends Favorites{
    constructor (root){
        super(root)        
        this.tbody = this.root.querySelector('table tbody')
        this.update()
        this.oneadd()
    }

    oneadd(){
        const addButton = this.root.querySelector('.search button')
        addButton.onclick = () => {
            const {value} = this.root.querySelector('.search input')
            this.add(value)
        }


    }

    update(){
        this.removeAlltr()
        
        this.entries.forEach(user => {
            const row = this.createRow()

            row.querySelector('.user img').src = `https://github.com/${user.login}.png`
            row.querySelector('.user img').alt = `Imagem de ${user.name}`
            row.querySelector('.user a').href = `https://github.com/${user.login}`
            row.querySelector('.user p').textContent = user.name
            row.querySelector('.user span').textContent = user.login
            row.querySelector('.repositories').textContent = user.public_repos
            row.querySelector('.followers').textContent = user.followers
            
            this.tbody.append(row)

            row.querySelector('.remove').onclick = () => {
                const isok = confirm('Tem certeza que deseja deletar essa linha?')
                if(isok){
                    this.delete(user)
                }
            }
        })

    }

    createRow(){
        const tr = document.createElement('tr')
        
        tr.innerHTML = `
            <tr>
                <td class="user">
                    <img src="https://github.com/diego3g.png" alt="imagem do prof2">
                    <a href="https://github.com/diego3g">
                        <p>Diego Fernandes</p>
                        <span>diego3g</span>
                    </a>
                </td>
                <td class="repositories">
                    50
                </td>
                <td class="followers">
                    22503
                </td>
                <td>
                    <button class="remove">&times;</button>
                </td>
            </tr>    
        `
        return tr          
    }

    removeAlltr(){
        this.tbody.querySelectorAll('tr')
        .forEach((tr) => {
            tr.remove()
        })
    }

}