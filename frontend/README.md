## Desafio de Programação
Este é um desafio de programação para avaliar suas habilidades técnicas. O objetivo é construir uma interface web e um backend para lidar com o upload, processamento e armazenamento de transações de vendas de produtos.

## Descrição do Projeto
Surgiu uma nova demanda urgente e precisamos de uma área exclusiva para fazer o upload de um arquivo com as transações realizadas pelos nossos clientes na venda de produtos.

Nossa plataforma trabalha no modelo criador-afiliado, onde um criador pode vender seus produtos e ter um ou mais afiliados também vendendo esses produtos, recebendo uma comissão por venda.

Uma transação financeira é um contrato de compra e venda. Neste contexto, consideraremos que cada transação resulta em uma mudança de saldo, seja do produtor ou do afiliado.

Sua tarefa é construir uma aplicação que permita o upload de um arquivo contendo as transações de vendas de produtos, normalizar os dados e armazená-los em um banco de dados relacional.

O formato de arquivo txt aceito será:

12022-01-15T19:20:30-03:00CURSO DE BEM-ESTAR            0000012750JOSE CARLOS
12021-12-03T11:46:02-03:00DOMINANDO INVESTIMENTOS       0000050000MARIA CANDIDA
22022-01-16T14:13:54-03:00CURSO DE BEM-ESTAR            0000012750THIAGO OLIVEIRA

## Formato do arquivo de entrada

| Campo    | Início | Fim | Tamanho | Descrição                      |
| -------- | ------ | --- | ------- | ------------------------------ |
| Tipo     | 1      | 1   | 1       | Tipo da transação              |
| Data     | 2      | 26  | 25      | Data - ISO Date + GMT          |
| Produto  | 27     | 56  | 30      | Descrição do produto           |
| Valor    | 57     | 66  | 10      | Valor da transação em centavos |
| Vendedor | 67     | 86  | 20      | Nome do vendedor               |

### Tipos de transação

Esses são os valores possíveis para o campo Tipo:

| Tipo | Descrição         | Natureza | Sinal |
| ---- | ----------------- | -------- | ----- |
| 1    | Venda produtor    | Entrada  | +     |
| 2    | Venda afiliado    | Entrada  | +     |
| 3    | Comissão paga     | Saída    | -     |
| 4    | Comissão recebida | Entrada  | +     |

## Frontend

1 - Acesse o diretório do frontend: cd frontend.
2 - Instale as dependências: npm install.
3 - Execute o aplicativo frontend: npm run dev.
4 - O aplicativo estará disponível em http://localhost:3001.
5 - Para rodar os testes: npm run test. E aperte "a" para rodar todos os testes.

## Backend

1 - Acesse o diretório do backend: cd backend.
2 - Instale as dependências: npm install.
3 - Execute o servidor backend: npm run start:dev.
4 - O servidor estará disponível em http://localhost:3000.
5 - A documentação da API estará disponível em http://localhost:3000/api#/.
6 - Para rodar os testes: npm run test.
7 - O adminer do banco de dados PostgreSQL configurado no docker-compose estará disponível em http://localhost:8080/ . 
  username: 'pguser',
  password: 'pgpassword',
  database: 'nestjs',


## Implementação

A página inicial da aplicação possui um botão de login onde é feito por motivos de praticidade um login automático com credenciais de um adiministrador, dessa forma o usuário irá obeter um token e o acesso a todos os endpoints que estão protegidos com autenticação e autorização. Após o login, irá ser liberado um menu onde o usuário poderá ir para a página de upload, página para consultar todas as transações e página para buscar um vendedor pelo id para obter seu saldo.