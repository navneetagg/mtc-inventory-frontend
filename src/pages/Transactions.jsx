import { useState, useEffect } from 'react';
import {
  Container, Typography, Button, Box,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Chip, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, MenuItem,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Transactions = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [open, setOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    productId: '',
    type: 'in',
    quantity: '',
    note: '',
  });

  const fetchTransactions = async () => {
    try {
      const { data } = await axios.get('/transactions');
      setTransactions(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get('/products');
      setProducts(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTransactions();
    fetchProducts();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setForm({ productId: '', type: 'in', quantity: '', note: '' });
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    // Client-side validation
    if (!form.productId) {
      alert('Please select a product');
      return;
    }
    if (!form.quantity || form.quantity < 1) {
      alert('Quantity must be at least 1');
      return;
    }
    try {
      // ✅ Ye payload fix: productId bhejo (backend wahi destructure karta hai)
      await axios.post('/transactions', {
        productId: form.productId,   // key = productId
        type: form.type,
        quantity: Number(form.quantity),
        note: form.note,
      });
      handleClose();             // form reset + close
      fetchTransactions();       // list refresh
    } catch (err) {
      alert(err.response?.data?.message || 'Transaction failed');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5">Transactions</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpen}>
          New Transaction
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Product</TableCell>
              <TableCell>Type</TableCell>
              <TableCell align="right">Quantity</TableCell>
              <TableCell>Note</TableCell>
              <TableCell>By</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((txn) => (
              <TableRow key={txn._id}>
                <TableCell>{new Date(txn.createdAt).toLocaleString()}</TableCell>
                <TableCell>{txn.product?.name || txn.product}</TableCell>
                <TableCell>
                  <Chip
                    label={txn.type === 'in' ? 'IN' : 'OUT'}
                    size="small"
                    color={txn.type === 'in' ? 'success' : 'error'}
                  />
                </TableCell>
                <TableCell align="right">{txn.quantity}</TableCell>
                <TableCell>{txn.note || '—'}</TableCell>
                <TableCell>{txn.performedBy?.name || '—'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* New Transaction Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>New Stock Transaction</DialogTitle>
        <DialogContent>
          <TextField
            select
            label="Product"
            name="productId"
            value={form.productId}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          >
            {products.map((p) => (
              <MenuItem key={p._id} value={p._id}>
                {p.name} ({p.pricingType})
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Type"
            name="type"
            value={form.type}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          >
            <MenuItem value="in">Stock In</MenuItem>
            <MenuItem value="out">Stock Out</MenuItem>
          </TextField>
          <TextField
            label="Quantity"
            name="quantity"
            type="number"
            value={form.quantity}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Note (optional)"
            name="note"
            value={form.note}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!form.productId}   // ✅ Disable until product selected
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Transactions;