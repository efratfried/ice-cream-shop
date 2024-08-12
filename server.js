require('dotenv').config(); // Add this line
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();
const port = 3000;

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'ice-cream-shop',
  password: '0522829511',
  port: 5432,
});

app.use(cors());
app.use(express.json()); // This is sufficient for JSON parsing

// API for flavors
app.get('/api/flavors', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM ice_cream_flavors');
    res.json(result.rows);
  } catch (err) {
    res.status(500).send('Error retrieving data');
  }
});

// Create order
app.post('/api/orders', async (req, res) => {
  try {
    const result = await pool.query('INSERT INTO orders DEFAULT VALUES RETURNING *');
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error creating order');
  }
});

// Get order by ID
app.get('/api/orders/:orderId', async (req, res) => {
  const { orderId } = req.params;

  try {
    const orderResult = await pool.query('SELECT * FROM orders WHERE id = $1', [orderId]);
    if (orderResult.rows.length === 0) {
      return res.status(404).send('Order not found');
    }

    const itemsResult = await pool.query('SELECT * FROM order_items WHERE order_id = $1', [orderId]);
    const order = orderResult.rows[0];

    order.items = itemsResult.rows;
    if (order.items.length === 0) {
      return res.status(404).send('cart is empty');
    }

    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error retrieving order');
  }
});

// Add item to order
app.post('/api/orders/:orderId/items', async (req, res) => {
  const { orderId } = req.params;
  const { flavor, amount, price } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO order_items (order_id, flavor, amount, price) VALUES ($1, $2, $3, $4) RETURNING *',
      [orderId, flavor, amount, price]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error adding item to order');
  }
});

// Get all items in order
app.get('/api/orders/:orderId/items', async (req, res) => {
  const { orderId } = req.params;

  try {
    const result = await pool.query('SELECT * FROM order_items WHERE order_id = $1', [orderId]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error retrieving order items');
  }
});

// Update item amount in order
app.put('/api/orders/:orderId/items', async (req, res) => {
  const { orderId } = req.params;
  const { flavor, amount, price } = req.body;

  try {
    // Check if the flavor exists in the order
    const checkResult = await pool.query(
      'SELECT * FROM order_items WHERE order_id = $1 AND flavor = $2',
      [orderId, flavor]
    );

    let result;
    if (checkResult.rows.length > 0) {
      // Update the existing flavor
      result = await pool.query(
        'UPDATE order_items SET amount = $1 WHERE order_id = $2 AND flavor = $3 RETURNING *',
        [amount, orderId, flavor]
      );
    } else {
      // Add a new flavor to the order
      result = await pool.query(
        'INSERT INTO order_items (order_id, flavor, amount, price) VALUES ($1, $2, $3, $4) RETURNING *',
        [orderId, flavor, amount, price]
      );
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error updating or adding item in order');
  }
});

// Delete item from order
app.delete('/api/orders/:orderId/items/:itemId', async (req, res) => {
  const { orderId, itemId } = req.params;

  console.log(`Deleting item with ID ${itemId} from order ${orderId}`);

  try {
    await pool.query('DELETE FROM order_items WHERE id = $1 AND order_id = $2', [itemId, orderId]);
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error deleting order item');
  }
});

// Check if flavor exists in order
app.get('/api/orders/:orderId/items/check', async (req, res) => {
  const { orderId } = req.params;
  const { flavor } = req.query;

  try {
    const result = await pool.query(
      'SELECT * FROM order_items WHERE order_id = $1 AND flavor = $2',
      [orderId, flavor]
    );

    res.json(result.rowCount > 0); // Returns true if the flavor exists, false otherwise
  } catch (err) {
    console.error(err);
    res.status(500).send('Error checking flavor existence');
  }
});

// Create payment intent
app.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).send('Error creating payment intent');
  }
});

// Add this route to your Express server
app.post('/create-checkout-session', async (req, res) => {
  try {
    const { amount } = req.body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'ils',
            product_data: {
              name: 'Ice Cream',
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: 'http://localhost:4200/success', // Replace with your success URL
      cancel_url: 'http://localhost:4200/cancel', // Replace with your cancel URL
    });

    res.json({ id: session.id });
  } catch (error) {
    res.status(500).send('Error creating checkout session');
  }
});


// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
