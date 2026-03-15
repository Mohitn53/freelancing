import React from 'react';
import { motion } from 'framer-motion';

const CheckoutPage = () => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container section">
      <h1 style={{ fontSize: '32px', textTransform: 'none', marginBottom: '32px' }}>Checkout</h1>
      
      <div className="grid grid-cols-[2fr_1fr]" style={{ gridTemplateColumns: '2fr 1fr', gap: '48px' }}>
        <div style={styles.formContainer}>
          <h3 style={styles.sectionTitle}>Shipping Information</h3>
          <form style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Full Name</label>
              <input type="text" className="input-base" placeholder="John Doe" />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Email Address</label>
              <input type="email" className="input-base" placeholder="john@example.com" />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Address</label>
              <input type="text" className="input-base" placeholder="123 Street Name" />
            </div>
            <div className="grid grid-cols-2">
              <div style={styles.inputGroup}>
                <label style={styles.label}>City</label>
                <input type="text" className="input-base" placeholder="City" />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Postal Code</label>
                <input type="text" className="input-base" placeholder="10001" />
              </div>
            </div>
          </form>

          <h3 style={{ ...styles.sectionTitle, marginTop: '40px' }}>Payment Method</h3>
          <div style={styles.paymentMethods}>
            <label style={styles.paymentOption}>
              <input type="radio" name="payment" defaultChecked /> Credit Card
            </label>
            <label style={styles.paymentOption}>
              <input type="radio" name="payment" /> PayPal
            </label>
            <label style={styles.paymentOption}>
              <input type="radio" name="payment" /> Bank Transfer
            </label>
          </div>
        </div>

        <div style={styles.summary}>
          <h3 style={styles.summaryTitle}>Order Summary</h3>
          <div className="flex-between" style={styles.row}>
            <span>Subtotal</span>
            <span>$100.00</span>
          </div>
          <div className="flex-between" style={styles.row}>
            <span>Shipping</span>
            <span>$5.00</span>
          </div>
          <div className="flex-between" style={{ ...styles.row, ...styles.totalRow }}>
            <span>Total</span>
            <span>$105.00</span>
          </div>
          <button className="btn btn-primary" style={{ width: '100%', marginTop: '24px' }}>Place Order</button>
        </div>
      </div>
    </motion.div>
  );
};

const styles = {
  formContainer: {
    display: 'flex',
    flexDirection: 'column'
  },
  sectionTitle: {
    fontFamily: 'Inter',
    fontWeight: 600,
    fontSize: '20px',
    marginBottom: '24px',
    textTransform: 'none'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  label: {
    fontSize: '14px',
    fontWeight: 500,
    color: '#333'
  },
  paymentMethods: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  paymentOption: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '16px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    cursor: 'pointer'
  },
  summary: {
    backgroundColor: '#f9f9f9',
    padding: '32px',
    borderRadius: '16px',
    height: 'fit-content'
  },
  summaryTitle: {
    fontSize: '20px',
    textTransform: 'none',
    marginBottom: '24px'
  },
  row: {
    marginBottom: '16px',
    color: '#666'
  },
  totalRow: {
    borderTop: '1px solid #ddd',
    paddingTop: '16px',
    color: '#111',
    fontWeight: 700,
    fontSize: '20px'
  }
};

export default CheckoutPage;
