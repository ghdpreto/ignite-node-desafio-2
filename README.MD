## Rodando o projeto

Instalar as dependências

``npm i``

Compilar o projeto (PRD)

``npm run build``

Subir o projeto (PRD)

``npm run start:prd``

## Rodando os testes

Instalar as dependências

``npm i``

Executar testes

``npm run start:test``

## Rotas
Todas as rotas espera o id do usuario sendo enviado como Cookie.

Ao fazer o login esse Cookie é gerado automaticamente e vinculado a chave ``idUsuario`` com duração de ``60 minutos``.

Criar um usuário:

``POST -> /usuarios``

```json
{
    "nome": "teste",
    "email": "teste@teste.com",
    "senha":"12345678"
}
```

Fazer login:

``POST -> /usuarios/login``

```json
{
    "email": "teste@teste.com",
    "senha":"12345678"
}
```

Criar refeição:

``POST -> /refeicoes``

```json
{
	"nome": "REFEICAO",
    "descricao": "UMA REFEIÇÃO", //opcional
	"dieta": true,
	"dtCriacao": "2023-05-29T15:38:16.498Z"
}
```

Atualizar uma refeição:

``PUT -> /refeicoes/:id``

Todos os campos são ``opcionais``
```json
{
	"nome": "REFEICAO",
    "descricao": "UMA REFEIÇÃO",
	"dieta": true,
	"dtCriacao": "2023-05-29T15:38:16.498Z"
}
```

Listar refeições:

``GET -> /refeicoes``

```json
{
	"refeicoes": [
		{
			"id": "a503f2aa-3968-417b-9eca-d3388092e702",
			"id_usuario": "62cd3d15-3b98-42c5-9782-3c1b9f109917",
			"nome": "REFEICAO 1",
			"descricao": null,
			"dieta": true,
			"dt_criacao": "2023-05-29T15:38:16.498Z"
		}
	]
}
```

Listar metricas de refeições:

``GET -> /refeicoes/metricas``

```json
{
	"metricas": {
		"registradas": 2,
		"dentroDaDieta": 2,
		"foraDaDieta": 0,
		"melhorSequencia": 2
	}
}
```

Deletar refeição:

``DELETE -> /refeicoes/:id``


## TODOS
- [X] Deve ser possível criar um usuário
- [X] Deve ser possível fazer login
- [X] Deve ser possível identificar o usuário entre as requisições
- [X] Deve ser possível registrar uma refeição feita, com as seguintes informações
    - Nome
    - Descrição
    - Data e Hora
    - Está dentro ou não da dieta
- [X] Deve ser possível editar uma refeição, podendo alterar todos os dados acima
- [X] Deve ser possível apagar uma refeição
- [X] Deve ser possível listar todas as refeições de um usuário
- [X] Deve ser possível visualizar uma única refeição
- [X] Deve ser possível recuperar as métricas de um usuário:
    - Quantidade total de refeições registradas
    - Quantidade total de refeições dentro da dieta
    - Quantidade total de refeições fora da dieta
    - Melhor sequência por dia de refeições dentro da dieta
- [X] O usuário só pode visualizar, editar e apagar as refeições o qual ele criou