import { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, MenuItem, Grid,
} from '@mui/material';
import axios from 'axios';

const pricingTypes = [
  { value: 'perPiece', label: 'Per Piece' },
  { value: 'weightBased', label: 'Weight Based' },
];

const metalOptions = [
  { value: 'steel', label: 'Steel' },
  { value: 'copper', label: 'Copper' },
  { value: 'brass', label: 'Brass' },
];

const EditProductDialog = ({ open, onClose, product, onProductUpdated }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    sku: '',
    stock: '',
    minStock: '',
    sellingPrice: '',
    metalType: 'steel',
    rawMaterialRate: '',
    weightKg: '',
    makingCharge: '',
    marginPercent: '',
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        category: product.category || '',
        sku: product.sku || '',
        stock: product.stock != null ? product.stock : '',
        minStock: product.minStock != null ? product.minStock : '',
        sellingPrice: product.sellingPrice != null ? product.sellingPrice : '',
        metalType: product.metalType || 'steel',
        rawMaterialRate: product.rawMaterialRate != null ? product.rawMaterialRate : '',
        weightKg: product.weightKg != null ? product.weightKg : '',
        makingCharge: product.makingCharge != null ? product.makingCharge : '',
        marginPercent: product.marginPercent != null ? product.marginPercent : '',
      });
    }
  }, [product]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        name: formData.name,
        category: formData.category,
        sku: formData.sku || undefined,
        stock: Number(formData.stock),
        minStock: Number(formData.minStock) || undefined,
      };

      if (product.pricingType === 'perPiece') {
        payload.sellingPrice = Number(formData.sellingPrice);
      } else {
        payload.metalType = formData.metalType;
        payload.rawMaterialRate = Number(formData.rawMaterialRate);
        payload.weightKg = Number(formData.weightKg);
        payload.makingCharge = Number(formData.makingCharge) || 0;
        payload.marginPercent = Number(formData.marginPercent) || 0;
      }

      await axios.put(`/products/${product._id}`, payload);
      onProductUpdated();
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || 'Product update failed');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Product</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 0.5 }}>
          <Grid item xs={12} sm={6}>
            <TextField label="Name" name="name" value={formData.name} onChange={handleChange} required fullWidth />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Category" name="category" value={formData.category} onChange={handleChange} required fullWidth />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField label="SKU (optional)" name="sku" value={formData.sku} onChange={handleChange} fullWidth />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField label="Stock" name="stock" value={formData.stock} onChange={handleChange} type="number" required fullWidth />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField label="Min Stock" name="minStock" value={formData.minStock} onChange={handleChange} type="number" fullWidth />
          </Grid>

          {/* Per Piece fields */}
          {product?.pricingType === 'perPiece' && (
            <Grid item xs={12}>
              <TextField label="Selling Price (₹)" name="sellingPrice" value={formData.sellingPrice} onChange={handleChange} type="number" required fullWidth />
            </Grid>
          )}

          {/* Weight Based fields */}
          {product?.pricingType === 'weightBased' && (
            <>
              <Grid item xs={12} sm={6}>
                <TextField select label="Metal Type" name="metalType" value={formData.metalType} onChange={handleChange} fullWidth>
                  {metalOptions.map((m) => <MenuItem key={m.value} value={m.value}>{m.label}</MenuItem>)}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="Raw Material Rate (₹/kg)" name="rawMaterialRate" value={formData.rawMaterialRate} onChange={handleChange} type="number" required fullWidth />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField label="Weight (kg)" name="weightKg" value={formData.weightKg} onChange={handleChange} type="number" required fullWidth />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField label="Making Charge (₹)" name="makingCharge" value={formData.makingCharge} onChange={handleChange} type="number" fullWidth />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField label="Margin (%)" name="marginPercent" value={formData.marginPercent} onChange={handleChange} type="number" fullWidth />
              </Grid>
            </>
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>Update</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditProductDialog;