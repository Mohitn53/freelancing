import { Router } from 'express';
import supabase from '../config/supabaseClient.js';
import { verifyToken, requireRole } from '../middleware/authMiddleware.js';

const router = Router();
router.use(verifyToken);

// ─── USER ROUTES ─────────────────────────────────────────────────────────────

// Create order (Checkout)
router.post('/', async (req, res) => {
  try {
    const { items, total_amount, shipping_address_id, payment_method_id } = req.body;
    
    // 1. Create Order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([{ 
        user_id: req.user.id, 
        total_amount, 
        shipping_address_id, 
        payment_method_id,
        status: 'pending'
      }])
      .select().single();

    if (orderError) throw orderError;

    // 2. Create Order Items
    const orderItems = items.map(item => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.price,
      size: item.size
    }));

    const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
    if (itemsError) throw itemsError;

    // 3. Clear Cart
    await supabase.from('cart_items').delete().eq('user_id', req.user.id);

    res.status(201).json({ success: true, data: order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── ADMIN ROUTES ────────────────────────────────────────────────────────────

// List all orders (Admin Only)
router.get('/admin', requireRole('admin'), async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*, profiles(name, email)')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get single order with items
router.get('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*, products(name, image_url)), profiles(name, email)')
      .eq('id', req.params.id)
      .single();

    if (error) throw error;
    
    // Authorization check: User can only see their own order, Admin can see all
    if (data.user_id !== req.user.id) {
        // Check if admin
        const { data: profile } = await supabase.from('profiles').select('role').eq('id', req.user.id).single();
        if (profile?.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Access denied.' });
        }
    }

    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Update order status (Admin Only)
router.patch('/:id/status', requireRole('admin'), async (req, res) => {
  try {
    const { status } = req.body;
    const { data, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', req.params.id)
      .select().single();
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
