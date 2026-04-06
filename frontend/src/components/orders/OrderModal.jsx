import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X } from 'lucide-react';
import { orderSchema } from '../../schemas/orderSchema';
import { createOrder } from '../../api/orderApi';

const OrderModal = ({ mockup, onClose, onOrdered }) => {
  const [apiError, setApiError] = useState('');
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(orderSchema),
    defaultValues: { mockupId: mockup._id, quantity: 1, notes: '' },
  });

  const quantity = watch('quantity') || 1;
  const total = (Number(mockup.price) * Number(quantity)).toFixed(2);

  const onSubmit = async (data) => {
    try {
      setApiError('');
      await createOrder(data);
      setSuccess(true);
      setTimeout(() => onClose(), 1500);
      onOrdered?.();
    } catch (err) {
      setApiError(err.response?.data?.message || 'Failed to place order');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">Place Order</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mockup preview */}
        <div className="px-6 pt-4 flex items-center gap-3">
          <img
            src={mockup.imageUrl}
            alt={mockup.name}
            className="w-16 h-16 object-cover rounded-xl border border-gray-100"
          />
          <div>
            <p className="text-sm font-semibold text-gray-900">{mockup.name}</p>
            <p className="text-xs text-gray-500">{mockup.category}</p>
            <p className="text-sm font-bold text-indigo-600 mt-0.5">${Number(mockup.price).toFixed(2)} / unit</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-4 space-y-4">
          <input type="hidden" {...register('mockupId')} />

          {/* Quantity */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
              Quantity
            </label>
            <input
              {...register('quantity')}
              type="number"
              min="1"
              className="w-full px-4 py-2.5 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {errors.quantity && <p className="text-xs text-red-500 mt-1">{errors.quantity.message}</p>}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
              Notes (optional)
            </label>
            <textarea
              {...register('notes')}
              rows={2}
              placeholder="Any special instructions..."
              className="w-full px-4 py-2.5 bg-gray-100 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Total */}
          <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
            <span className="text-sm text-gray-600 font-medium">Total</span>
            <span className="text-lg font-bold text-gray-900">${total}</span>
          </div>

          {apiError && <p className="text-sm text-red-500">{apiError}</p>}

          {success && (
            <p className="text-sm text-green-600 font-medium">Order placed successfully!</p>
          )}

          <div className="flex justify-end gap-3 pt-1">
            <button type="button" onClick={onClose} className="px-5 py-2 text-sm text-gray-600 hover:text-gray-900 transition">
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || success}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-sm font-semibold rounded-xl transition"
            >
              {isSubmitting ? 'Placing...' : 'Confirm Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrderModal;
