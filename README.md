# Flex Gateway

O Flex Gateway tem como objetivo viabilizar e facilitar a realização de cobranças via cartão de crédito dentro do seu sistema. Por meio de um sistema inteligente e integrado com múltiplos gateways de pagamento, a sua cobrança será realizada com maior segurança. No caso de uma falha na tentativa de cobrança em determinado gateway, é feita uma nova tentativa de cobrança no gateway seguinte, até que a operação seja realizada com sucesso.

### **Full Checkout**

Na nossa solução completa para checkout, oferecemos uma tela de checkout responsiva e já integrada com a nossa API. Basta importar no seu projeto e seguir a documentação para realização das configurações necessárias para começar a utilizar.

### **Core Checkout**

A solução "Core", possibilita manter a identidade visual da sua aplicação. O usuário terá liberdade para implementar a sua própria tela de checkout e depois utilizar a solução "Core" para fazer a integração com as APIs do Flex Gateway.

## **Guia utilização Full Checkout**

Primeiramente, importe o Flex Gateway Full Checkout para dentro da sua aplicação Web.

```html
<script defer="defer" src="https://democdn.flexgateway.com.br/pca-flexgateway.js"></script>
```
Crie a tag html onde será renderizada a tela de checkout do Flex Gateway
```html
    <div
        id="pca-flexgateway-app"
        data-api-key="1CDFC221-F9BA-4D68-AE0D-DC491B46CCAC"
        data-additional-info='{
            "ammount": 59.9,
            "description": "Assinatura PCA",
            "transactionCode": "CODIGO-TRANSACAO-1",
            "customerCode": "CODIGO-CLIENTE-1",
            "action": "Capture"
        }'
        data-onsuccess="callbackSucessoFlexGateway"
        data-onerror="callbackErroFlexGateway"
        >
    </div>
```
* **id:** O id do elemento onde será renderizado a tela de checkout deve ser "pca-flexgateway-app"
* **data-api-key:** Api Key para acesso a API e integração com o Flex Gateway
* **data-additional-info:** Json que contém parâmetros relacionados a cobrança a ser realizada, segue o schema abaixo:
* **data-onsuccess:** Nome da função callback que é chamada pelo Flex Gateway ao finalizar com sucesso uma operação.
* **data-onerror:** Nome da função callback que é chamada pelo Flex Gateway quando ocorrer uma falha em uma operação.
  
### **data-additional-info**
```json
{
    "ammount": number, // Valor que será cobrado
    "description": string, // Descrição do que será cobrado, aparecerá na tela de checkout
    "transactionCode": string, // Código da transação para controle das suas transações realizadas
    "customerCode": string, // Código do cliente para identificação e controle do cliente que realizou o pagamento
    "action": "Capture" | "Tokenize", // Capture: Cobrança é realizada imediatamente após submit das informações | Tokenize: É apenas realizada a Tokenização do cartão para cobranças futuras por meio das APIs do Flex Gateway. Quando marcado "Tokenize" é interessante salvar o token retornado no callback de sucesso para poder realizar futuras cobranças.
}
```
### Exemplo:
```html
<script>
    function callbackSucessoFlexGateway(resultado) {
        console.log(resultado);
    }

    function callbackErroFlexGateway(resultado) {
        console.log(resultado)
    }

    const pcaFlexGatewayElement = document.getElementById("pca-flexgateway-app");
    pcaFlexGatewayElement.setAttribute("data-api-key", "<SUA-API-KEY>");
    pcaFlexGatewayElement.setAttribute("data-additional-info", "<INFORMACOES_COBRANCA>");
    pcaFlexGatewayElement.setAttribute("data-onsuccess", "callbackSucessoFlexGateway");
    pcaFlexGatewayElement.setAttribute("data-onerror", "callbackErroFlexGateway");
</script>
```
### **Model parâmetros funções callback Sucesso e Erro**
A model retornada na função de callback segue o schema abaixo:
```ts
// Resultado
{
    success: boolean;
    message?: string;
    creditCardToken?: string; // Token cartão de crédito que poderá ser utilizado para futuras cobranças por meio das APIs do Flex Gateway
    fieldErrors?: Array<IFieldValidation>;
}

// IFieldValidation
{
  property: string;
  message: string;
}
```
### **Informações complementares**
Uma vez obtido o token do cartão de crédito, é possível realizar cobranças futuras por meio da utilização da nossa API. A sua api key será utilizada na autenticação e o token do cartão de crédito gerado será utilizado para efetuar cobranças. Portanto, para realizar cobranças recorrentes sem precisar solicitar novamente ao cliente dados de cartão de crédito, uma opção é armazenar o token do cartão a fim de utilizar em futuras cobranças. Para mais informações, acesse a documentação da nossa api [clicando aqui](https://demoapi.flexgateway.com.br/swagger)

## **Guia utilização Core Checkout**

### Importação no projeto

```html
<script defer="defer" src="https://democdn.flexgateway.com.br/pca-flexgateway-core.js"></script>
```

### Inicializando
```js
    const fgConnector = new FlexGatewayConnector();
    await fgConnector.init('<SUA_API_KEY>');
```
### Métodos **FlexGatewayConnector**

```
# Inicializa configurações
- init(apiKey: string): Promise<IInitResult>

# Gera token cartão para cobranças futuras
- tokenize(data: ITokenizationRequest): Promise<ITokenizeResult>

# Efetua a cobrança no cartão de crédito a partir do token de cartão gerado
- capture(data: IChargeModel): Promise<ICustomResponse<IChargeResponseModel>>
```

### Propriedades **FlexGatewayConnector**
```ts
config?: IFlexGatewayConfig;

interface IFlexGatwayConfig {
    cardsConfiguration: ICardConfiguration[];
}

export default interface ICardConfiguration {
  brand: string;
  name: string;

  /*
  Regex que pode ser utilizado para identificar a bandeira do cartão a partir do número informado
  */
  numberFormat: string;

  numberMaxLength: number[];

  /*
  Exemplo: [[4, 4, 4], [4, 3, 5], [3, 3, 3]].
  Cada elemento é um tipo de máscara que pode ser aplicado ao número do cartão dependendo da qtd de dígitos.
  [4, 4, 4, 4]: 1234 1234 1234 1234(16 dígitos)
  [4, 6, 4]: 1234 123 12345 (14 dígitos)
  [3, 3, 3]: 123 123 123 (9 dígitos)
  */
  cardNumberMask: number[][];

  cvvMaxLength: number[];
  image: string; // Imagem bandeira do cartão
}
```

### **Schemas**
```ts
interface IInitResult {
    success: boolean;
    message?: string;
}

interface ITokenizationRequest {
    cardNumber: string;
    holderName: string;
    expiryMonth: string;
    expiryYear: string;
    customerName: string;
    holderDocument: string;
    cardFlag: string;
    amount: number;
    cvv: string | null;
    transactionCode: string;
    customerCode: string;
    action: 'Tokenize' | 'Capture';
}

interface ITokenizeResult {
    success: boolean;
    fieldErrors?: Array<IFieldValidation>;
    message?: string;
    token?: string;
}

interface IChargeModel {
    transaction: ITransactionModel;
    customer: ICustomerModel;
    token: string;
}

interface ICustomResponse<IChargeResponseModel> {
    status: number;
    statusText: string;
    headers: any;
    success: boolean;
    data?: IChargeResponseModel;
    errorData?: any;
    message?: string;
}

interface IChargeResponseModel {
    transaction: ITransactionModel;
    customer: ICustomerModel;
    token: string;
    identifier: string;
    captureInfo: ICaptureInfoModel;
}

interface ITransactionModel {
    code?: string;
    amount: number;
}

interface ICustomerModel {
    name?: string;
    document?: string;
    code?: string;
}

interface ICaptureInfoModel {
    captured: boolean;
    message?: string;
    code?: string;
}

```

### **Utilização do FlexGatewayConnector**
Uma vez instanciado, e carregado as configurações, é possível utilizar os métodos **tokenize** e **capture** para efetuar as operações com cartão de crédito.

### Exemplo:
```ts
    const fgConnector = new FlexGatewayConnector();
    await fgConnector.init('<SUA_API_KEY>');

    // Realiza tokenização (Gera token do cartão que será utilizado para cobrança)
    const dadosTokenizacao: ITokenizationRequest = obterDadosFormularioCheckout();
    const resultadoTokenizacao = await mgConnector.tokenize(dadosTokenizacao);

    // Efetua cobrança
    const dadosCapture: IChargeModel = obterDadosCaptureFromResultadoTokenizacao(resultadoTokenizacao);
    const resultadoCobranca = await fgConnector.capture(chargeModel);
```
### **Informações complementares**
No Flex Gateway Core Checkout, toda a implementação e validação do formulário de checkout ficará sob responsabilidade do usuário do Flex Gateway. Nas configurações do **FlexGatewayConnector** estarão disponíveis as bandeiras permitidas e configurações de máscaras de cartão que poderão ser utilizadas como dados complementares para montar o formulário de checkout.

## **Demonstração**
Está disponibilizado também uma demonstração explicativa do Flex Gateway Core Checkout e Full Checkout, para que todos consigam testar e interagir com o Flex Gateway ([acessar demonstração](https://pcaeng.github.io/flexgateway-client)). O código fonte desta demonstração poderá ser utilizado também como documentação e guia para os desenvolvedores e está disponível em https://github.com/pcaeng/flexgateway-client