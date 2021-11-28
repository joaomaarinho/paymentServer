const stripeAPI = require('../stripe');

module.exports = {

  async createCheckoutSession(req, res) {
    const domainUrl = process.env.WEB_APP_URL;
    const { line_items, customer_email, shipping_options, pedidoNum } = req.body;
    //check req body has line items and email
    if (!line_items || !customer_email) {
      return res.status(400).json({ error: 'missing required session parameters' });
    }

    let session;

    try {
      session = await stripeAPI.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        line_items,
        customer_email,
        success_url: `${domainUrl}success/{CHECKOUT_SESSION_ID}/${pedidoNum}`,
        cancel_url: `${domainUrl}canceled`,
        // shipping_address_collection: { allowed_countries: ['BR'] }
        shipping_options
      })
      console.log(session.id)
      res.status(200).json({ sessionId: session.id, valorTotal: session.amount_total });
    } catch (error) {
      console.log(error);
      res.status(400).json({ error: error.response.data });
    }
  },

  async retriveCheckoutSession(req, res) {
    const { pagamento_id } = req.params;
    console.log(pagamento_id);
    await stripeAPI.checkout.sessions.retrieve(pagamento_id)
      .then(session => {
        console.log(session)
        res.status(200).json({ pagamentoStatus: session.payment_status })
      })
      .catch(e => {
        console.log(e);
        res.status(400).json({ error: 'oops, ocorreu um erro' });
      })
  },

}