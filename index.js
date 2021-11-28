const express = require('express');
const cors = require('cors');
require('dotenv').config({ path: './.env' });
const stripeService = require('./api/checkout');

const app = express();
const port = 3005;

app.use(express.json());
app.use(cors({ origin: "*" }));

app.get('/', (req, res) => res.send('Hello World'));

app.get('/pagamento/:pagamento_id', stripeService.retriveCheckoutSession)

app.post('/create-checkout-session', stripeService.createCheckoutSession);

app.listen(process.env.PORT || port, () => console.log("Server running"));
