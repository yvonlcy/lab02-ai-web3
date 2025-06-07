import Koa from 'koa';
import Router from 'koa-router';
import OpenAI from 'openai';
import bodyParser from 'koa-bodyparser';
import { JsonRpcProvider, Wallet, Contract } from 'ethers';

const app = new Koa();
const router = new Router();

// Load environment variables
const apiKey = process.env.OPENAI_API_KEY || "sk-2a7b22b909044569b0785aed9472606c";
const baseURL = "https://dashscope-intl.aliyuncs.com/compatible-mode/v1";

const openai = new OpenAI({
    apiKey: apiKey,
    baseURL: baseURL
});

// Middleware to parse request body
app.use(bodyParser());

// Middleware to handle CORS
app.use(async (ctx, next) => {
    ctx.set('Access-Control-Allow-Origin', '*');
    ctx.set('Access-Control-Allow-Headers', 'Content-Type');
    ctx.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    if (ctx.method === 'OPTIONS') {
        ctx.status = 204;
        return;
    }
    await next();
});

// Route to generate AI text
interface GenerateTextRequestBody {
    prompt?: string;
    model?: string;
}

router.post('/api/generate-text', async (ctx) => {
    try {
        const body = ctx.request.body as GenerateTextRequestBody;
        const userInput = body.prompt || "teach me what is web3";
        const model = body.model || "qwen-plus";

        const completion = await openai.chat.completions.create({
            model: model,
            messages: [
                { role: "system", content: "You are a helpful assistant, speak in Hong Kong style Chinese language with Gen Z girl style." },
                { role: "user", content: userInput }
            ],
        });

        ctx.body = {
            response: completion.choices[0].message.content,
            modelUsed: model,
            prompt: userInput
        };

    } catch (error: any) {
        console.error('Error generating text:', error);
        ctx.status = 500;
        ctx.body = { 
            error: 'Failed to generate text', 
            details: error.message 
        };
    }
});

// Route to get blockchain message
router.get('/api/blockchain-message', async (ctx) => {
    try {
        // Use JsonRpcProvider for backend
        const provider = new JsonRpcProvider('http://localhost:8545');
        const contractAddress = process.env.CONTRACT_ADDRESS || '0x5FbDB2315678afecb367f032d93F642f64180aa3';
        const abi = [
            {
                "anonymous": false,
                "inputs": [
                    { "indexed": false, "internalType": "string", "name": "oldMessage", "type": "string" },
                    { "indexed": false, "internalType": "string", "name": "newMessage", "type": "string" }
                ],
                "name": "MessageUpdated",
                "type": "event"
            },
            {
                "inputs": [],
                "name": "currentMessage",
                "outputs": [
                    { "internalType": "string", "name": "", "type": "string" }
                ],
                "stateMutability": "view",
                "type": "function"
            }
        ];

        const contract = new Contract(contractAddress, abi, provider);
        const message = await contract.currentMessage();
        ctx.body = { message };
    } catch (error: any) {
        console.error('Error fetching blockchain message:', error);
        ctx.status = 500;
        ctx.body = { error: 'Failed to fetch blockchain message', details: error.message };
    }
});

// Route to update blockchain message
interface UpdateMessageRequestBody {
    message?: string;
}

router.post('/api/update-message', async (ctx) => {
    try {
        const body = ctx.request.body as UpdateMessageRequestBody;
        const newMessage = body.message;
        if (!newMessage) {
            ctx.status = 400;
            ctx.body = { error: 'Message is required' };
            return;
        }

        // Use a funded private key from Hardhat (for demo/development only!)
        const provider = new JsonRpcProvider('http://localhost:8545');
        // Replace with a private key from your Hardhat node (never use in production)
        const privateKey = process.env.PRIVATE_KEY || '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';
        const wallet = new Wallet(privateKey, provider);

        const contractAddress = process.env.CONTRACT_ADDRESS || '0x5FbDB2315678afecb367f032d93F642f64180aa3';
        const abi = [
            {
                "inputs": [
                    {
                        "internalType": "string",
                        "name": "_message",
                        "type": "string"
                    }
                ],
                "name": "setMessage",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            }
        ];

        const contract = new Contract(contractAddress, abi, wallet);
        const tx = await contract.setMessage(newMessage);
        await tx.wait();

        ctx.body = { success: true, transactionHash: tx.hash };

    } catch (error: any) {
        console.error('Error updating message:', error);
        ctx.status = 500;
        ctx.body = {
            error: 'Failed to update message',
            details: error.message
        };
    }
});

app.use(router.routes()).use(router.allowedMethods());

const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`Koa server listening on http://localhost:${port}`);
    console.log('API endpoints:');
    console.log('  POST /api/generate-text - Generate AI text');
    console.log('  GET /api/blockchain-message - Get current blockchain message');
    console.log('  POST /api/update-message - Update blockchain message');
});
