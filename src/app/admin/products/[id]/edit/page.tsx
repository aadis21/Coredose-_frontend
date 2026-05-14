'use client';

import { use } from 'react';
import ProductForm from '../../ProductForm';

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  return (
    <div className="flex flex-col gap-8">
      <div className="border-b border-muted/20 pb-4">
        <h1 className="font-bebas text-4xl tracking-wider text-white mb-2">Inventory Management</h1>
        <p className="font-sans text-sm text-secondary uppercase tracking-widest">Edit Product Details</p>
      </div>
      <ProductForm productId={id} />
    </div>
  );
}
