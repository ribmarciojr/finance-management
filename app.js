
class Despesa {
    constructor(ano, mes, dia, tipo, descricao , valor) {
        this.ano = ano;
        this.mes = mes;
        this.dia = dia;
        this.tipo = tipo;
        this.descricao = descricao;
        this.valor = valor;
    }
    
    validarData(){
        
        for(let i in this){
            if(this[i] === undefined || this[i] === '' || this[i] === null){ //Retorna falso, caso algum campo esteja vazio no momento da adição
              return false  
            } 
            
        } 
        return true 
        
        

    }

    activeCamp(){ //Onfocus: determina id do campo ativo dinâmicamente
        
       this.active = document.activeElement;
        
    
    }


    antNullCamp(){ //Onblur: recupera valor ; null ? is-valid ; is-invalid
        
        let value = this.active.value
        
        switch(value) { //Switch case allows to implement style for validation later
            case '':
                this.active.classList.add('is-invalid')

                break
            default:
                this.active.classList.add('is-valid')
        }

        
    }


}

let validation = new Despesa()


class Bd {
    constructor(){ //Seta o primeiro ID = 0, no momento de construção da classe
        let fistID = localStorage.getItem('id')

        if (fistID === null) {
            localStorage.setItem('id', 0)
        }
    }

    nextId(){ //Determina o índice do próximo ID, baseando-se no anterior, sempre que a função save() for chamada
        let proximoId = localStorage.getItem('id') 
        return parseInt(proximoId) + 1
    }

    save (d) {
        let actualID = this.nextId()
        
        localStorage.setItem('id', actualID )
        localStorage.setItem(actualID , JSON.stringify(d))
    }  

    recuperadorTodasDespesas(){ //Recupera todoas as despesas definidas.

        let listaDespesas = Array()

        let id = localStorage.getItem('id') //Nesse caso, o key id terá o mesmo valor da ultima key armazenada
       
       //Recuperação de todas as despesas através de looping do index
       for (let index = 1; index <= id; index++) {
            let despesa = JSON.parse(localStorage.getItem(index))
            
            if(despesa === null){
                continue
            } 
                
            listaDespesas.push(despesa)
            despesa.id = index
                
            

        }
        
        return listaDespesas
    }

    pesquisar(despesa){
        let despesasFiltradas = []
        despesasFiltradas = this.recuperadorTodasDespesas()

        
        


        for(let atributos in despesa){
            validacaoConsulta(atributos)

        }


        function validacaoConsulta(attr){
            
            if(despesa[attr] != ''){
                despesasFiltradas = despesasFiltradas.filter(d => d[attr] == despesa[attr])

            } 
        }

        return despesasFiltradas
        
        

    }

    removerDespesa(id){
        localStorage.removeItem(id)
    }

}

let bd = new Bd()


function cadastrarDespesa() { //Função ativada no click do usuário
    //Recuperação de valores cadastrados
    let ano = document.getElementById('ano').value
    let mes = document.getElementById('mes').value
    let dia = document.getElementById('dia').value
    let tipo = document.getElementById('tipo').value
    let descricao = document.getElementById('descricao').value
    let valor = document.getElementById('valor').value
    
    let despesas = new Despesa(ano, mes, dia, tipo, descricao, valor) //Objetificação da despesa cadastrada
    


    

    if(despesas.validarData()) {
        bd.save(despesas) //Envio do objeto em arquivo JSON  

        ano = ''
        mes = ''
        dia = ''
        tipo = ''
        descricao = ''
        valor = ''


        $('#modalRegistraDespesa').modal('show')
        document.getElementById('modalTitle').innerHTML = 'Registrado com Sucesso!'
        document.getElementById('modalColor').className = 'modal-header text-success'
        
        document.getElementById('modalNotation').innerHTML = 'Você obteve êxito no registro.'
        document.getElementById('modalNotation').className = 'modal-body text-dark'

        
        document.getElementById('modalButton').className = 'btn btn-success'


    } else {
        $('#modalRegistraDespesa').modal('show')
        document.getElementById('modalTitle').innerHTML = 'Preencha todos os campos indicados!'
        document.getElementById('modalColor').className = 'modal-header text-danger'

        document.getElementById('modalNotation').innerHTML = 'Falha no registro.'
        document.getElementById('modalNotation').className = 'modal-body text-dark'

        
        document.getElementById('modalButton').className = 'btn btn-danger'
    }
   
}

function carregaListaDespesas(){
    
    let despesas = Array()

        despesas = bd.recuperadorTodasDespesas() //Arrays com objetos de despesa 
    
    let tabelaDespesas = document.getElementById('tabelaDespesas') //seleção da viwtable de elementos

    despesas.forEach(function(d) {
        
        let line = tabelaDespesas.insertRow()

        line.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`
        
            
            switch(parseInt(d.tipo)){
                case 1:
                    d.tipo = 'Alimentação'
                        break
                case 2:
                    d.tipo = 'Educação'
                        break           
                case 3:
                    d.tipo = 'Lazer'
                        break
                case 4:
                    d.tipo = 'Saúde'
                        break
                case 5:
                    d.tipo = 'Transporte'
                        break

            }

        line.insertCell(1).innerHTML = d.tipo
        line.insertCell(2).innerHTML = d.descricao
        line.insertCell(3).innerHTML = d.valor

        let btn = document.createElement("button")
        btn.className = 'btn btn-danger'
        btn.innerHTML = '<i class="fas fa-times"></i>'
        btn.id = `id_btn_${d.id}`
        btn.onclick = function() {
            

            bd.removerDespesa(d.id)

            location.reload()
        }
        
        line.insertCell(4).append(btn)
        
    })
    
}


function pesquisadorDespesa(){
    let ano = document.getElementById('ano').value
    let mes = document.getElementById('mes').value
    let dia = document.getElementById('dia').value
    let tipo = document.getElementById('tipo').value
    let descricao = document.getElementById('descricao').value
    let valor = document.getElementById('valor').value
    
    let despesas = new Despesa(ano, mes, dia, tipo, descricao, valor)
    
    let despesasViwed = Array()
    despesasViwed = bd.pesquisar(despesas)

    let tabelaDespesas = document.getElementById('tabelaDespesas') //seleção da viwtable de elementos
    tabelaDespesas.innerHTML = '';
    
    let errorPop = document.querySelector('#search-null')
    let errorMessage = '<div class="table-search-null" id="error"><p class="table-search-null-content">Ops! Despesa não encontrada!</p></div>'
    
     
    if(document.querySelector('#error') != null){
        document.querySelector('#error').remove()
    }


    if(despesasViwed == ''){

        
        errorPop.innerHTML = errorMessage
        
    } else{

    
    
        despesasViwed.forEach(function(d) {
            
            let line = tabelaDespesas.insertRow()

            line.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`
            
                
                switch(parseInt(d.tipo)){
                    case 1:
                        d.tipo = 'Alimentação'
                            break
                    case 2:
                        d.tipo = 'Educação'
                            break           
                    case 3:
                        d.tipo = 'Lazer'
                            break
                    case 4:
                        d.tipo = 'Saúde'
                            break
                    case 5:
                        d.tipo = 'Transporte'
                            break

                }

            line.insertCell(1).innerHTML = d.tipo
            line.insertCell(2).innerHTML = d.descricao
            line.insertCell(3).innerHTML = d.valor

            let btn = document.createElement("button")
            btn.className = 'btn btn-danger'
            btn.innerHTML = '<i class="fas fa-times"></i>'
            btn.id = `id_btn_${d.id}`
            btn.onclick = function() {
                

                bd.removerDespesa(d.id)

                location.reload()
            }
            
            line.insertCell(4).append(btn)
            
        }) 

    }
}




