import { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AddProductDialog from '../components/AddProductDialog';
import EditProductDialog from '../components/EditProductDialog';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [openAdd, setOpenAdd] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [deleteProduct, setDeleteProduct] = useState(null);

  // Fetch all products
  const fetchProducts = async () => {
    try {
      const { data } = await axios.get('/products');
      setProducts(data);
    } catch (err) {
      console.error('Failed to fetch products');
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Edit handlers
  const handleEditOpen = (product) => setEditProduct(product);
  const handleEditClose = () => setEditProduct(null);

  // Delete handlers
  const handleDeleteOpen = (product) => setDeleteProduct(product);
  const handleDeleteClose = () => setDeleteProduct(null);

  const confirmDelete = async () => {
    if (!deleteProduct) return;
    try {
      await axios.delete(`/products/${deleteProduct._id}`);
      handleDeleteClose();
      fetchProducts();
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <>
      {/* Top App Bar */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Inventory Management
          </Typography>
          <Typography sx={{ mr: 2 }}>
            {user?.name} ({user?.role})
          </Typography>
          {/* Transactions Button */}
          <Button color="inherit" onClick={() => navigate('/transactions')} sx={{ mr: 1 }}>
            Transactions
          </Button>
          <IconButton color="inherit" onClick={handleLogout}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        {/* Header with Add Button */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h5">Products</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenAdd(true)}
          >
            Add Product
          </Button>
        </Box>

        {/* Products Table */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Type</TableCell>
                <TableCell align="right">Price (₹)</TableCell>
                <TableCell align="right">Stock</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((prod) => (
                <TableRow key={prod._id}>
                  <TableCell>{prod.name}</TableCell>
                  <TableCell>{prod.category}</TableCell>
                  <TableCell>
                    <Chip
                      label={prod.pricingType}
                      size="small"
                      color={prod.pricingType === 'perPiece' ? 'primary' : 'secondary'}
                    />
                  </TableCell>
                  <TableCell align="right">
                    {prod.sellingPrice != null ? `₹${prod.sellingPrice}` : '—'}
                  </TableCell>
                  <TableCell align="right">{prod.stock}</TableCell>
                  <TableCell>
                    <IconButton size="small" onClick={() => handleEditOpen(prod)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    {/* Sirf admin ko delete button dikhega */}
                    {user?.role === 'admin' && (
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteOpen(prod)}
                        color="error"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>

      {/* Add Product Dialog */}
      <AddProductDialog
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        onProductAdded={fetchProducts}
      />

      {/* Edit Product Dialog (only if editProduct selected) */}
      {editProduct && (
        <EditProductDialog
          open={Boolean(editProduct)}
          onClose={handleEditClose}
          product={editProduct}
          onProductUpdated={fetchProducts}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={Boolean(deleteProduct)} onClose={handleDeleteClose}>
        <DialogTitle>Delete Product?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Kya aap pakka "{deleteProduct?.name}" delete karna chahte hain? Ye action
            undo nahi ho sakta.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteClose}>Cancel</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Dashboard;