import { useState } from 'react';
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

const AddProductDialog = ({ open, onClose, onProductAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    sku: '',
    stock: '',
    minStock: '',
    pricingType: 'perPiece',
    // perPiece
    sellingPrice: '',
    // weightBased
    metalType: 'steel',
    rawMaterialRate: '',
    weightKg: '',
    makingCharge: '',
    marginPercent: '',
  });

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
        pricingType: formData.pricingType,
      };

      if (formData.pricingType === 'perPiece') {
        payload.sellingPrice = Number(formData.sellingPrice);
      } else {
        payload.metalType = formData.metalType;
        payload.rawMaterialRate = Number(formData.rawMaterialRate);
        payload.weightKg = Number(formData.weightKg);
        payload.makingCharge = Number(formData.makingCharge) || 0;
        payload.marginPercent = Number(formData.marginPercent) || 0;
      }

      await axios.post('/products', payload);

      // Reset form
      setFormData({
        name: '', category: '', sku: '', stock: '', minStock: '',
        pricingType: 'perPiece',
        sellingPrice: '',
        metalType: 'steel', rawMaterialRate: '', weightKg: '', makingCharge: '', marginPercent: '',
      });

      onProductAdded(); // parent refresh
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || 'Product add failed');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add New Product</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 0.5 }}>
          {/* Common fields */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Name" name="name" value={formData.name}
              onChange={handleChange} required fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Category" name="category" value={formData.category}
              onChange={handleChange} required fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="SKU (optional)" name="sku" value={formData.sku}
              onChange={handleChange} fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Stock" name="stock" value={formData.stock}
              onChange={handleChange} type="number" required fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Min Stock" name="minStock" value={formData.minStock}
              onChange={handleChange} type="number" fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              select label="Pricing Type" name="pricingType"
              value={formData.pricingType} onChange={handleChange}
              fullWidth
            >
              {pricingTypes.map((pt) => (
                <MenuItem key={pt.value} value={pt.value}>{pt.label}</MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Per Piece fields */}
          {formData.pricingType === 'perPiece' && (
            <Grid item xs={12}>
              <TextField
                label="Selling Price (₹)" name="sellingPrice"
                value={formData.sellingPrice} onChange={handleChange}
                type="number" required fullWidth
              />
            </Grid>
          )}

          {/* Weight Based fields */}
          {formData.pricingType === 'weightBased' && (
            <>
              <Grid item xs={12} sm={6}>
                <TextField
                  select label="Metal Type" name="metalType"
                  value={formData.metalType} onChange={handleChange}
                  fullWidth
                >
                  {metalOptions.map((m) => (
                    <MenuItem key={m.value} value={m.value}>{m.label}</MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Raw Material Rate (₹/kg)" name="rawMaterialRate"
                  value={formData.rawMaterialRate} onChange={handleChange}
                  type="number" required fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Weight (kg)" name="weightKg"
                  value={formData.weightKg} onChange={handleChange}
                  type="number" required fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Making Charge (₹)" name="makingCharge"
                  value={formData.makingCharge} onChange={handleChange}
                  type="number" fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Margin (%)" name="marginPercent"
                  value={formData.marginPercent} onChange={handleChange}
                  type="number" fullWidth
                />
              </Grid>
            </>
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>Add Product</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddProductDialog;